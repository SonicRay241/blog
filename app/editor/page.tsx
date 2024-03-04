"use client"

import { useEffect, useState } from "react"
import { useCookies } from "next-client-cookies"
import { useRouter } from "next/navigation"
import EditorNavBar from "@/components/EditorNavbar"
import Spinner from "@/components/Spinner"
import { Logout } from "@mui/icons-material"

const Page = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [accountData, setAccountData] = useState<{
        name: string,
        username: string,
    } | null>(null)

    const cookieStore = useCookies()
    const router = useRouter()

    const logout = () => {
        setIsLoading(true)
        fetch("https://blogapi.rayy.dev/v1/auth/logout/", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: cookieStore.get("token")
            })
        })
        .then(async (e) => console.log(e.text))
        cookieStore.remove("token")
        router.replace("/editor/login")
    }

    const getAccountData = () => {
        fetch("https://blogapi.rayy.dev/v1/auth/session-user/", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: cookieStore.get("token")
            })
        })
        .then(async (e) => {
            const res = await e.text()
            setAccountData(JSON.parse(res))
        })
    }

    useEffect(()=>{
        if (cookieStore.get("token")) {
            fetch("https://blogapi.rayy.dev/v1/auth/validate/",{
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: cookieStore.get("token")
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
        } else router.replace("/editor/login")
    }, [])

    return (
        <>
        <EditorNavBar username={accountData?.name ?? null} fixed/>
        {isLoading ? 
            <div className=" flex w-full h-3/4 justify-center items-center">
                <Spinner className="h-10 w-10"/>
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