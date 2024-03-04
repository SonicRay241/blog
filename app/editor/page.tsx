"use client"

import { useCallback, useEffect, useState } from "react"
import { getCookie, setCookie, deleteCookie } from "cookies-next"
import { useRouter } from "next/navigation"
import EditorNavBar from "@/components/editor/EditorNavbar"
import Spinner from "@/components/Spinner"
import { Logout } from "@mui/icons-material"
import { url } from "@/libs/url"

const Page = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [accountData, setAccountData] = useState<{
        name: string,
        username: string,
    } | null>(null)
    // const [userBlogData]

    const [isError, setIsError] = useState(false)
    const router = useRouter()

    const logout = useCallback(() => {
        setIsLoading(true)
        fetch(`${url}/v1/auth/logout/`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: getCookie("token")
            })
        })
        .then(async (e) => console.log(e.text))
        deleteCookie("token")
        router.replace("/editor/login")
    }, [router])

    useEffect(()=>{
        const getAccountData = () => {
            fetch(`${url}/v1/auth/session-user/`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: getCookie("token")
                })
            })
            .then(async (e) => {
                const res = await e.text()
                setAccountData(JSON.parse(res))
            })
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
                    setIsLoading(false)
                }
            })
            .catch(()=>{
                setIsError(true)
            })
        } else router.replace("/editor/login")
    }, [logout, router])

    return (
        <>
        <EditorNavBar username={accountData?.name ?? null} fixed/>
        {isLoading ? 
            <div className=" flex w-full h-3/4 justify-center items-center">
                {isError ? 
                    <h1 className="text-2xl">Something went wrong.</h1>
                    :
                    <Spinner className="h-10 w-10"/>
                }
            </div>
            :
            <div className="flex w-full h-3/4 justify-center items-center">
                <div className="w-full max-w-screen-md">a</div>
            </div>
        }
        <button 
            className="fixed p-2 bottom-2 left-2 rounded-md hover:bg-red-500 hover:text-white text-red-500" 
            onClick={logout}
            style={{
                transition: "all 100ms cubic-bezier(0.37, 0, 0.63, 1)"
            }}
        >
            <Logout/>
        </button>
        </>
    )
}

export default Page