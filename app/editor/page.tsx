"use client"

import { useEffect, useState } from "react"
import { useCookies } from "next-client-cookies"
import { useRouter } from "next/navigation"
import EditorNavBar from "@/components/EditorNavbar"
import Spinner from "@/components/Spinner"

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
        <EditorNavBar username={accountData?.name ?? null}/>
        {isLoading ? 
            <div className=" flex w-full h-3/4 justify-center items-center">
                <Spinner className="h-10 w-10"/>
            </div>
            :
            <div className="w-full">
                <h1>Amongus</h1>
                <button onClick={logout}>LOGOUT</button>
            </div>
        }
        </>
    )
}

export default Page