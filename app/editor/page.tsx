"use client"

import { useCallback, useEffect, useState } from "react"
import { getCookie, setCookie, deleteCookie } from "cookies-next"
import { useRouter } from "next/navigation"
import EditorNavBar from "@/components/editor/EditorNavbar"
import Spinner from "@/components/Spinner"
import { Add, KeyboardArrowLeft, KeyboardArrowRight, Logout, Search } from "@mui/icons-material"
import { url } from "@/libs/url"
import Skeleton from "@/components/Skeleton"
import BlogCard from "@/components/editor/BlogCard"
import NewModal from "@/components/editor/NewModal"
import toast from "react-hot-toast"

const Page = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [blogCount, setBlogCount] = useState<number | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [accountData, setAccountData] = useState<{
        name: string,
        username: string,
    } | null>(null)
    const [blogsData, setBlogsData] = useState<{
        created_at: string;
        hidden: boolean;
        id: string;
        title: string;
        writer: string | null;
    }[] | null>(null)

    const [isError, setIsError] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [arrowDisabled, setArrowDisabled] = useState(false)
    const [showSkeleton, setShowSkeleton] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    const router = useRouter()

    const logout = useCallback(() => {
        setIsLoading(true)
        if (getCookie("token"))
            fetch(`${url}/v1/auth/logout/`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: getCookie("token"),
                })
            })
            .then(async (e) => console.log(e.text))
        deleteCookie("token")
        router.replace("/editor/login")
    }, [router])

    const getBlogs = () => {
        fetch(`${url}/v1/editor/blogs/`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: getCookie("token"),
                page: currentPage,
                searchQuery: searchQuery
            })
        })
        .then(async (e) => {
            const res = JSON.parse(await e.text())
            setBlogCount(+res.count)
            setBlogsData(res.data)
            setIsLoading(false)
            setShowSkeleton(false)
            setArrowDisabled(false)
        })
        .catch(()=>{
            toast.error("Something went wrong when fetching blogs.")
        })
    }

    useEffect(()=>{
        if (showSkeleton && arrowDisabled) getBlogs()
        const getAccountData = () => {
            fetch(`${url}/v1/auth/session-user/`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: getCookie("token"),
                })
            })
            .then(async (e) => {
                const res = JSON.parse(await e.text())
                setAccountData(res)
            })
            getBlogs()
        }

        if (isLoading)
        if (getCookie("token")) {
            fetch(`${url}/v1/auth/validate/`,{
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: getCookie("token")
                })
            })
            .then(async (e) => {
                const valid = await e.text()
                if (valid == "false") {
                    toast.error("Invalid session, please log in again.")
                    logout()
                } else {
                    getAccountData()
                }
            })
            .catch(()=>{
                setIsError(true)
                setIsLoading(true)
            })
        } else router.replace("/editor/login")
    }, [logout, router, getBlogs])

    return (
        <>
        <NewModal show={showModal} cancelCallback={()=>{setShowModal(false)}} reloadCallback={()=>{setIsLoading(true); getBlogs()}}/>
        <EditorNavBar username={accountData?.name ?? null} fixed useLoading/>
        {(isError || isLoading) ? 
            <div className="flex w-full h-3/4 justify-center items-center">
                {isError ? 
                    <h1 className="text-2xl">Something went wrong.</h1>
                    :
                    <Spinner className="h-10 w-10"/>
                }
            </div>
            :
            <>
            <div className="w-full md:h-full pt-20 md:pt-24 pb-16 md:pb-24">
                <div className="flex flex-col w-full h-full items-center gap-6 md:gap-8">
                    <form 
                        className="w-full gap-2 flex max-w-screen-sm px-8 md:px-14"
                        onSubmit={(e) => {
                            e.preventDefault()
                            setShowSkeleton(true)
                            getBlogs()
                        }}
                    >
                        <input
                            className="py-2 px-4 bg-gray-100 border border-gray-200 w-full rounded-md outline-none text-gray-600 drop-shadow-sm hover:bg-gray-200 focus:bg-gray-200"
                            type="text"
                            placeholder="Search..."
                            style={{
                                transition: "all 100ms cubic-bezier(0.37, 0, 0.63, 1)"
                            }}
                            value={searchQuery}
                            onChange={(e)=>setSearchQuery(e.target.value)}
                            
                        />
                        <button 
                            className="p-2 bg-gray-100 border border-gray-200 w-fit rounded-md outline-none text-gray-600 hover:bg-gray-200 drop-shadow-sm"
                            style={{
                                transition: "all 100ms cubic-bezier(0.37, 0, 0.63, 1)"
                            }}
                        >
                            <Search/>
                        </button>
                    </form>
                    <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-3 gap-4 w-full max-w-screen-lg px-8 md:px-14 h-full pb-32 md:pb-0">
                        { (blogsData && !showSkeleton) ?
                            blogsData?.map((b, n)=>{
                                return (
                                    <BlogCard
                                    created_at={b.created_at}
                                    id={b.id}
                                    hidden={b.hidden}
                                    title={b.title}
                                    writer={b.writer}
                                    key={n}
                                    />
                                )
                            })
                        :
                            [...Array(6)].map((_, n)=>{
                                return (
                                    <Skeleton width="full" height="full" key={n} className="bg-gray-200"/>
                                )
                            })
                        }
                    </div>
                
                </div>
            </div>
        <button 
            className="fixed p-2 bottom-2 left-2 rounded-md hover:bg-red-500 hover:text-white text-red-500" 
            onClick={logout}
            style={{
                transition: "all 100ms cubic-bezier(0.37, 0, 0.63, 1)"
            }}
        >
            <Logout/>
        </button>
        <button 
            className="fixed p-2 bottom-2 right-2 rounded-md hover:bg-gray-200 text-gray-500" 
            onClick={()=>setShowModal(true)}
            style={{
                transition: "all 100ms cubic-bezier(0.37, 0, 0.63, 1)"
            }}
        >
            <Add/>
        </button>
        <div className="flex fixed bottom-2 gap-2 left-1/2 -translate-x-1/2">
            <button
                className="p-2 bg-white border border-gray-200 text-gray-600 rounded-md hover:bg-gray-100 disabled:hover:cursor-not-allowed"
                style={{
                    transition: "all 100ms cubic-bezier(0.37, 0, 0.63, 1)"
                }}
                onClick={() => {
                    if (currentPage > 1) {
                        setCurrentPage(currentPage - 1)
                        setArrowDisabled(true)
                        setShowSkeleton(true)
                    }
                }}
                disabled={arrowDisabled || currentPage < 2}
            >
                <KeyboardArrowLeft/>
            </button>
            <div className="flex gap-2 p-2 rounded-md bg-white border border-gray-200 text-gray-600 hover:cursor-default">
                <h1 className="text-nowrap">Page</h1>
                <h1 className="text-nowrap">{currentPage} / {Math.ceil(Math.max(blogCount ?? 1, 1) / 6)}</h1>
            </div>
            <button
                className="p-2 bg-white border border-gray-200 text-gray-600 rounded-md hover:bg-gray-100 disabled:hover:cursor-not-allowed"
                style={{
                    transition: "all 100ms cubic-bezier(0.37, 0, 0.63, 1)"
                }}
                onClick={() => {
                    if (currentPage < Math.ceil(((blogCount ?? 1)) / 6)) {
                        setCurrentPage(currentPage + 1)
                        setArrowDisabled(true)
                        setShowSkeleton(true)
                    }
                }}
                disabled={arrowDisabled || currentPage >= Math.ceil((blogCount ?? 1) / 6)}
            >
                <KeyboardArrowRight/>
            </button>
        </div>
        </>
        }
        </>
    )
}

export default Page