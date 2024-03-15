"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState, useCallback, Suspense } from "react"
import { url } from "@/libs/url"
import EditorNavBar from "@/components/editor/EditorNavbar"
import { getCookie, deleteCookie } from "cookies-next"
import { useRouter } from "next/navigation"
import { Archive, ArchiveOutlined, DeleteOutline, KeyboardArrowLeft, Publish, Save } from "@mui/icons-material"
import Link from "next/link"
import Spinner from "@/components/Spinner"
import DeleteModal from "@/components/editor/DeleteModal"
import { TextareaAutosize } from "@mui/material"
// import '@mdxeditor/editor/style.css'
import EditorComp from "@/components/editor/EditorComponent"
import toast from "react-hot-toast"

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

  // const EditorComp = dynamic(() => import('@/components/editor/EditorComponent'), { ssr: false })

  const [editorContent, setEditorContent] = useState("")
  const [saveBtn, setSaveBtn] = useState(false)
  const [publishBtn, setPublishBtn] = useState(false)

  const searchParams = useSearchParams()
  const router = useRouter()
  const blog = searchParams.get("p")

  const saveContent = () => {
    const saveToast = toast.loading("Saving...")
    console.log(blogTitle == initialBlogData?.title)
    fetch(`${url}/v1/editor/write/blog/`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: getCookie("token") ?? "",
        content: editorContent,
        blogId: blog ?? "",
        newTitle: blogTitle
      })
    })
    .then(async (e) => {
      const res = await e.text()
      if (res == "SUCCESS") {
        toast.success("Saved!", { id: saveToast })
        setSaveBtn(false)
        if (blogTitle != initialBlogData?.title) router.replace(`/editor/blog?q=${[...(blogTitle.toLowerCase()).matchAll(/[a-zA-Z0-9]+/g)].join("-")}`)
      } else {
        toast.error(res, { id: saveToast })
      }
    })
    .catch(() => toast.error("Something went wrong...", { id: saveToast }))
  }

  const getBlogMd = useCallback(() => {
    console.log("getting markdown...");
    
    if (!isError)
    setTimeout(() => {
      fetch(`${url}/v1/blog/${blog}?cache=false`)
      .then(async (res) => {
        const data = await res.json()
        setInitialBlogData(data)
        setBlogTitle(`${data.title}`)
        setEditorContent(`${data.content}`)
        setPublishBtn(data.hidden)
        setIsLoading(false)
      })
      .catch((e)=>{
        setIsError(true)
        setIsLoading(true)
      })
    }, 2000)
  }, [blogTitle, editorContent, publishBtn, blog, isError])

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

  const publish = () => {
    const publishToast = toast.loading("Publishing...")
    fetch(`${url}/v1/editor/publish/`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: getCookie("token"),
        blogId: blog
      })
    })
    .then(async (e) => {
      const res = await e.text()
      if (res == "SUCCESS") {
        toast.success("Published blog!", { id: publishToast })
        setPublishBtn(false)
      } else {
        toast.error(res, { id: publishToast })
      }
    })
    .catch(() => toast.error("Something went wrong...", { id: publishToast }))
  }

  const archive = () => {
    const archiveToast = toast.loading("Archiving...")
    fetch(`${url}/v1/editor/archive/`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: getCookie("token"),
        blogId: blog
      })
    })
    .then(async (e) => {
      const res = await e.text()
      if (res == "SUCCESS") {
        toast.success("Archived blog!", { id: archiveToast })
        setPublishBtn(true)
      } else {
        toast.error(res, { id: archiveToast })
      }
    })
    .catch(() => toast.error("Something went wrong...", { id: archiveToast }))
  }

  useEffect(()=>{
    const getAccountData = () => {
      console.log("Getting account data...");
      
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
      .catch(() => {
        setIsError(true)
      })
  }

  if (accountData == null && !isError) {
    console.log("Getting auth...");
    
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
  }
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
          className="fixed z-40 flex items-center gap-2 text-gray-500 top-20 left-4 p-2 rounded-full backdrop-blur-sm bg-white/60 hover:bg-gray-100 border border-gray-200 drop-shadow-sm"
          style={{
            transition: "background-color 100ms cubic-bezier(0.37, 0, 0.63, 1)"
          }}
        >
          <KeyboardArrowLeft/>
        </Link>
        <button 
          className={`fixed z-40 p-2 bottom-2 left-2 rounded-md ${ publishBtn ? "text-green-500 hover:bg-green-500" : "text-red-500 hover:bg-red-500"} hover:text-white  backdrop-blur-sm bg-white/60` }
          onClick={publishBtn ? publish : archive}
          style={{
            transition: "all 100ms cubic-bezier(0.37, 0, 0.63, 1)"
          }}
        >
          { publishBtn ?
              <Publish/>
            :
              <ArchiveOutlined/>
          }
        </button>
        <button 
          className="fixed z-40 p-2 bottom-2 right-2 rounded-md hover:bg-red-500 hover:text-white text-red-500 backdrop-blur-sm bg-white/60" 
          onClick={() => setShowDeleteModal(true)}
          style={{
            transition: "all 100ms cubic-bezier(0.37, 0, 0.63, 1)"
          }}
        >
          <DeleteOutline/>
        </button>
        <button 
          className={`disabled:invisible fixed z-40 p-2 top-[72px] right-2 rounded-md hover:bg-violet-600 hover:text-white text-violet-600 backdrop-blur-sm bg-white/60` }
          onClick={saveContent}
          style={{
            transition: "all 100ms cubic-bezier(0.37, 0, 0.63, 1)"
          }}
          disabled={!saveBtn}
        >
          <Save/>
        </button>
        {
        /* 
         *==============================MAIN PAGE==============================
         */
        }
        <div className="flex w-full justify-center pt-20">
          <div className="w-full max-w-screen-lg md:px-4">
              <p className={`${blogTitle == "" ? "opacity-100" : "opacity-0"} text-red-500`}>
                Title must not be empty.
              </p>
              <TextareaAutosize
                className={`pt-6 font-bold text-4xl sm:text-5xl md:text-6xl text-violet-600 w-full h-fit p-4 resize-none outline-none rounded-md ${blogTitle == "" ? "border border-red-500" : ""}`}
                value={blogTitle} 
                onChange={e => {
                  setBlogTitle(e.target.value)
                  setSaveBtn(true)
                }}
              />
            <div className="">
              <p className="px-4 text-neutral-500 m-0 p-0 leading-none text-sm sm:text-base md:text-lg mb-4">{initialBlogData?.created_at.split("T")[0].split("-").reverse().join(".")} | {initialBlogData?.writer}</p>
            <Suspense>
              <EditorComp markdown={editorContent} setState={setEditorContent} enableSaveBtn={setSaveBtn}/>
            </Suspense>
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