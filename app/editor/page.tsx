"use client"

import { useCallback, useEffect, useState } from "react"
import { getCookie, setCookie, deleteCookie } from "cookies-next"
import { useRouter } from "next/navigation"
import EditorNavBar from "@/components/editor/EditorNavbar"
import Spinner from "@/components/Spinner"
import { Logout } from "@mui/icons-material"
import { url } from "@/libs/url"
import Skeleton from "@/components/Skeleton"
import BlogCard from "@/components/editor/BlogCard"

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
    const router = useRouter()

    const logout = useCallback(() => {
        setIsLoading(true)
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
                page: currentPage
            })
        })
        .then(async (e) => {
            const res = JSON.parse(await e.text())
            setBlogCount(+res.count)
            setBlogsData(res.data)
            setIsLoading(false)
        })
    }

    useEffect(()=>{
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
                    logout()
                } else {
                    getAccountData()
                }
            })
            .catch(()=>{
                setIsError(true)
            })
        } else router.replace("/editor/login")
    }, [logout, router, getBlogs])

    return (
        <>
        <EditorNavBar username={accountData?.name ?? null} fixed/>
        {isLoading ? 
            <div className="flex w-full h-3/4 justify-center items-center">
                {isError ? 
                    <h1 className="text-2xl">Something went wrong.</h1>
                    :
                    <Spinner className="h-10 w-10"/>
                }
            </div>
            :
            <>
            <div className="flex w-full min-h-[75%] justify-center pt-32">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-screen-lg px-14">
                    { blogsData ?
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
                        [...Array(10)].map((_, n)=>{
                            return (
                                <Skeleton width={"full"} height={96} key={n}/>
                            )
                        })
                    }
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
        <h1 className="fixed p-2 bottom-2 rounded-md bg-white border border-gray-200 left-1/2 -translate-x-1/2">Page: {currentPage} / {Math.ceil((blogCount ?? 10) / 10)}</h1>
        </>
        }
        </>
    )
}

export default Page