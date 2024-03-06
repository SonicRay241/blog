"use client"

import { FC, FormEvent, useEffect, useState } from "react"
import { url } from "@/libs/url"
import { getCookie } from "cookies-next"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import Spinner from "@/components/Spinner"

const DeleteModal: FC<{
  show: boolean,
  id: string,
  cancelCallback: () => void
}> = (props) => {
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const router = useRouter()

  const deleteBlog = () => {
    setButtonDisabled(true)
    fetch(`${url}/v1/editor/delete/`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: getCookie("token"),
        id: props.id
      })
    })
    .then(async (e) => {
      const res = await e.text()
      if (res == "SUCCESS") {
        toast.success("Deleted blog.")
        props.cancelCallback()
        router.push("/editor")
      }
      else toast.error(res)
      setButtonDisabled(false)
    })
    .catch(()=>{
      toast.error("Something went wrong.")
      setButtonDisabled(false)
    })
  }

  return (
    <>
    <div
      className={`${props.show ? "visible bg-black/20" : "invisible"} fixed flex justify-center items-center h-screen w-screen z-50 transition-colors`}
      onClick={() => props.cancelCallback()}
    >
      <div
        className={`${props.show ? "scale-100 opacity-100" : "scale-50 opacity-0"} w-full max-w-sm flex flex-col p-6 bg-white rounded-md border border-gray-200 gap-4 transition-all`}
        onClick={(e)=>e.stopPropagation()}
      >
        <h1 className="text-2xl font-semibold text-red-600">Delete Blog</h1>
        <p className="text-base text-gray-600">Are you sure you want to delete this blog?</p>
        <div className="flex gap-4">
          <button 
            type="button"
            onClick={props.cancelCallback}
            className="flex justify-center py-2 px-4 border border-gray-300 bg-white hover:bg-gray-200 disabled:cursor-not-allowed text-gray-600 rounded-md w-full"
            style={{
              transition: "background-color 100ms cubic-bezier(0.37, 0, 0.63, 1)"
            }}
          >
            Cancel
          </button>
          <button 
            className="flex justify-center py-2 px-4 border border-white bg-red-600 hover:bg-red-500 disabled:hover:bg-red-600 disabled:cursor-not-allowed text-white rounded-md w-full"
            style={{
              transition: "background-color 100ms cubic-bezier(0.37, 0, 0.63, 1)"
            }}
            onClick={deleteBlog}
          >
            {buttonDisabled ? <Spinner className="h-6 w-6 fill-red-600"/> : "Delete"}
          </button>
        </div>
      </div>
    </div>
    </>
  )
}
export default DeleteModal