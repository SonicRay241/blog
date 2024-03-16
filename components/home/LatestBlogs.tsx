"use client"

import useSWR from "swr";
import { url } from "@/libs/url";
import { fetcherJSON } from "@/libs/fetchers";
import BlogCard from "@/components/editor/BlogCard";
import Skeleton from "@/components/Skeleton";

const LatestBlogs = () => {
  const {data: latestBlogs, error: isError, isLoading} = useSWR<{
    created_at: string;
    id: string;
    title: string;
    writer: string;
  }[]>(`${url}/v1/blogs/latest`, fetcherJSON)

  if (!isError)
  return (
    <>
      <h1 className="mt-24 text-gray-500 font-medium">Latest Posts</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 w-full mt-4 gap-6 mb-40">
        {(!isLoading && latestBlogs) ? 
          latestBlogs.map((blogData)=>{
            return (
              <BlogCard
                key={blogData.id}
                id={blogData.id}
                created_at={blogData.created_at}
                title={blogData.title}
                writer={blogData.writer}
              />
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
    </>
  )

  return (
    <>
      <div className="flex justify-center w-full mt-4 gap-6 mb-40">
        <h1 className="text-xl">Something went wrong.</h1>
      </div>
    </>
  )
}

export default LatestBlogs