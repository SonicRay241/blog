"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { url } from "@/libs/url"
import EditorNavBar from "@/components/editor/EditorNavbar"
import { getCookie, deleteCookie } from "cookies-next"
import { useRouter } from "next/navigation"
import { KeyboardArrowLeft, Logout } from "@mui/icons-material"
import Link from "next/link"
import Spinner from "@/components/Spinner"

const Editor = () => {
  const [accountData, setAccountData] = useState<{
    name: string,
    username: string,
  } | null>(null)
  const [blogData, setBlogData] = useState<{
    content: string;
    created_at: string;
    id: string;
    title: string;
    writer: string | null;
    hidden: boolean;
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  const searchParams = useSearchParams()
  const router = useRouter()
  const blog = searchParams.get("q")

  const getBlogMd = () => {
    fetch(`${url}/v1/blog/${blog}`)
      .then((res) => res.json())
      .then((data) => {        
        setBlogData(data)
        setIsLoading(false)
      })
      .catch((e)=>{
        setIsError(true)
        setIsLoading(true)
        console.log(e);
      })
  }

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
          getBlogMd()
      })
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
              logout()
          } else {
              getAccountData()
          }
      })
      .catch(()=>{
          setIsError(true)
      })
  } else router.replace("/editor/login")
  })

  return (
    <>
      <EditorNavBar username={accountData?.name ?? null} fixed useLoading/>
      { (isError || isLoading) ?
        <div className="flex w-full h-3/4 justify-center items-center">
        { isError ? 
            <h1 className="text-2xl">Something went wrong.</h1>
            :
            <Spinner className="h-10 w-10"/>
        }
        </div>
      :
      <>
        <Link href="/editor" className="fixed flex items-center gap-2 text-gray-500 top-20 left-4 p-2 rounded-full bg-white border border-gray-200">
          <KeyboardArrowLeft/>
        </Link>
        <button 
          className="fixed p-2 bottom-2 left-2 rounded-md hover:bg-red-500 hover:text-white text-red-500" 
          onClick={logout}
          style={{
            transition: "all 100ms cubic-bezier(0.37, 0, 0.63, 1)"
          }}
        >
            <Logout/>
        </button>
        <div className="flex w-full min-h-[75%] justify-center pt-32">
          <div className="w-full max-w-screen-lg px-4 md:px-8">
          {blogData ? JSON.stringify(blogData) : "null"}
          </div>
        </div>
      </>
      }
    </>
  )
}

export default Editor