"use client"

import NavBar from "@/components/Navbar";
import Link from "next/link";
import Skeleton from "@/components/Skeleton";
// import Footer from "@/components/Footer";
import { url } from "@/libs/url";
import dynamic from "next/dynamic";
import useSWR from "swr";
import { fetcherJSON } from "@/libs/fetchers";

const Footer = dynamic(() => import("@/components/Footer"))

const Page = () => {
  const {data: latestBlogs, error: isError, isLoading} = useSWR<{
    created_at: string;
    id: string;
    title: string;
    writer: string;
  }[]>(`${url}/v1/blogs/latest`, fetcherJSON)
  
  if (!isError)
  return (
    <>
      <NavBar/>
      <div className="flex w-full justify-center pt-12">
        <div className="max-w-screen-md w-full px-4 md:px-8">
          <div className="w-full sm:px-16 md:px-32">
            <h1 className="text-5xl font-semibold w-full text-center mt-5">rayy<span className="text-violet-600">.dev</span><span className="text-2xl text-gray-400">/blogs</span></h1>
            <h1 className="w-full text-center text-2xl font-medium mt-10">
              Where logic meets creativity: <br />
              Unraveling the mysteries of code and technology.
            </h1>
            <p className="mt-10 text-center text-gray-500">Unleashing creativity in the world of technology and igniting innovation in the digital realm.</p>
          </div>
          <h1 className="mt-24 text-gray-500 font-medium">Latest Posts</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 w-full mt-4 gap-6 mb-40">
            {(!isLoading && latestBlogs) ? 
              latestBlogs.map((blogData, n)=>{
                return (
                  <Link 
                    href={`/blog?p=${blogData.id}`} 
                    className="group p-6 rounded-lg border bg-white hover:bg-gray-200 drop-shadow-sm"
                    key={n}
                    style={{
                      transition: "all 100ms cubic-bezier(0.37, 0, 0.63, 1)"
                    }}
                  >
                    <div className="flex flex-col h-fit w-full justify-between">
                      <h1 className="font-medium text-black">{blogData.title}</h1>
                      <p 
                        className="font-medium text-gray-500 text-xs mt-6"
                      >
                        {blogData.created_at.split("T")[0].split("-").reverse().join(".")} | {blogData.writer}
                      </p>
                    </div>
                  </Link>
                )
              })
              :
              [...Array(6)].map((_, n)=>{
                return (
                  <Skeleton width={"full"} height={84} key={n}/>
                )
              })
            }
          </div>
        </div>
      </div>
      <Footer/>
    </>
  )
  return (
    <>
      <NavBar/>
      <div className="h-3/4 w-full flex justify-center items-center">
        <div className="flex flex-col items-center">
          <h1 className="text-xl text-black">Something went wrong.</h1>
        </div>
      </div>
    </>
  )
}

export default Page