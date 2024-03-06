"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState, useCallback, Suspense } from "react"
import { url } from "@/libs/url"
import EditorNavBar from "@/components/editor/EditorNavbar"
import { getCookie, deleteCookie } from "cookies-next"
import { useRouter } from "next/navigation"
import { DeleteOutline, KeyboardArrowLeft, Logout } from "@mui/icons-material"
import Link from "next/link"
import Spinner from "@/components/Spinner"
import DeleteModal from "@/components/editor/DeleteModal"
import { TextareaAutosize } from "@mui/material"

const Editor = () => {
  const [accountData, setAccountData] = useState<{
    name: string,
    username: string,
  } | null>(null)
  const [initialBlogData, setInitialBlogData] = useState<{
    content: string;
    created_at: string;
    id: string;
    title: string;
    writer: string | null;
    hidden: boolean;
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [blogTitle, setBlogTitle] = useState("")
  const [blogContent, setBlogContent] = useState<string[]>([])

  const searchParams = useSearchParams()
  const router = useRouter()
  const blog = searchParams.get("q")

  const getBlogMd = () => {
    if (!isError)
    fetch(`${url}/v1/blog/${blog}`)
      .then((res) => res.json())
      .then((data) => {        
        setInitialBlogData(data)
        setBlogTitle(data.title)
        setBlogContent(data.content.split("\n"))
        setIsLoading(false)
      })
      .catch((e)=>{
        setIsError(true)
        setIsLoading(true)
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
      <DeleteModal show={showDeleteModal} id={blog ?? ""} cancelCallback={() => setShowDeleteModal(false)}/>
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
        <Link 
          href="/editor" 
          className="fixed flex items-center gap-2 text-gray-500 top-20 left-4 p-2 rounded-full bg-white hover:bg-gray-100 border border-gray-200 drop-shadow-sm"
          style={{
            transition: "background-color 100ms cubic-bezier(0.37, 0, 0.63, 1)"
          }}
        >
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
        <button 
          className="fixed p-2 bottom-2 right-2 rounded-md hover:bg-red-500 hover:text-white text-red-500" 
          onClick={()=>setShowDeleteModal(true)}
          style={{
            transition: "all 100ms cubic-bezier(0.37, 0, 0.63, 1)"
          }}
        >
          <DeleteOutline/>
        </button>
        {
        /* 
         *==============================MAIN PAGE==============================
         */
        }
        <div className="flex w-full justify-center pt-20">
          <div className="w-full max-w-screen-lg px-4 md:px-8">
              <p className={`${blogTitle == "" ? "opacity-100" : "opacity-0"} text-red-500`}>
                Title must not be empty.
              </p>
              <TextareaAutosize
                className={`pt-6 font-bold text-5xl md:text-7xl text-violet-600 w-full h-fit p-4 resize-none outline-none rounded-md ${blogTitle == "" ? "border border-red-500" : ""}`}
                value={blogTitle} 
                onChange={e => setBlogTitle(e.target.value)}
              />
            <div className="px-4">
              <p className="text-neutral-500 m-0 p-0 leading-none text-lg">{initialBlogData?.created_at.split("T")[0].split("-").reverse().join(".")} | {initialBlogData?.writer}</p>
              {
                blogContent.map((s, n)=>{
                  return (
                    <p key={n}>{s}</p>
                  )
                })
              }
            </div>
          </div>
        </div>
      </>
      }
    </>
  )
}

const Page = () => {
  return (
    <Suspense>
      <Editor/>
    </Suspense>
  )
}

export default Page