"use client"

import { FC, Suspense, useEffect } from "react"
import Markdown from "react-markdown"
import { useState } from "react"
import Skeleton from "@/components/Skeleton"

import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark as theme } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import Link from "next/link"
import NavBar from "@/components/Navbar"
import { url } from "@/libs/url";
import { useSearchParams } from "next/navigation"
import EditorComp from "@/components/editor/EditorComponent"

const Blog = () => {
    return (
        <Suspense>
            <BlogPost/>
        </Suspense>
    )
}

const BlogPost = () => {
    const searchParams = useSearchParams()
    const blog = searchParams.get("p")
    const [isLoaded, setIsLoaded] = useState(false)

    const [blogData, setBlogData] = useState<{
        content: string;
        created_at: string;
        id: string;
        title: string;
        writer: string | null;
        hidden: boolean;
    } | null>(null)
    const [isError, setIsError] = useState(false)

    useEffect(()=>{
        if (!isLoaded)
        fetch(`${url}/v1/blog/${blog}`)
        .then((res) => res.json())
        .then((data) => {
            setBlogData(data)
            setIsLoaded(true)
        })
        .catch(()=>{
            setIsError(true)
        })
    }, [blog])

    if (!isError)
    return (
        <>
            <NavBar/>
            <div className="w-full flex flex-col items-center">
                {
                    blogData &&
                    blogData.hidden &&
                    <div className="sticky top-0 w-full flex justify-center bg-red-500 py-2">
                        <h1 className="text-white font-medium">This blog is archived by the creator.</h1>
                    </div>
                }
                <div className="w-full max-w-screen-lg text-neutral-900 px-4 sm:px-8">
                    <div className="flex w-full justify-center pt-12">
                        {
                            blogData ?
                            <div className="prose prose-base md:prose-lg prose-pre:bg-transparent prose-code:bg-transparent prose-pre:p-0 max-w-none w-full prose-img:mx-auto prose-img:rounded-md prose-pre:no-scrollbar prose-code:no-scrollbar">
                                <h1 className="text-4xl sm:text-5xl md:text-6xl text-violet-600 mb-4 md:mb-8 p-0 leading-none">{blogData.title}</h1>
                                <p className="text-neutral-500 m-0 p-0 leading-none text-sm sm:text-base md:text-lg">{blogData.created_at.split("T")[0].split("-").reverse().join(".")} | {blogData.writer}</p>
                                <br />
                                <Markdown 
                                    rehypePlugins={[rehypeRaw]}
                                    remarkPlugins={[remarkGfm]}
                                    urlTransform={(value: string) => value}
                                    components={{
                                        code({ node, inline, className, children, ...props }: any) {
                                            const match = /language-(\w+)/.exec(className || '');
                                        
                                            return !inline && match ? (
                                                <SyntaxHighlighter 
                                                    style={theme} 
                                                    customStyle={{
                                                        msScrollbarFaceColor: "transparent",
                                                        scrollbarColor: "transparent"
                                                    }} 
                                                    PreTag="div" 
                                                    language={match[1]} 
                                                    {...props}
                                                >
                                                    {String(children).replace(/\n$/, '')}
                                                </SyntaxHighlighter>
                                            ) : (
                                                <code className={className} {...props}>
                                                    {children}
                                                </code>
                                            );
                                        },
                                        a({ node, inline, className, children, ...props }: any) {
                                            return (
                                                <a 
                                                    className={className}
                                                    style={{
                                                        color: "#3b82f6"
                                                    }}
                                                    target="_blank"
                                                    {...props}
                                                >
                                                    {children}
                                                </a>
                                            )
                                        }
                                    }}
                                >
                                    {blogData.content}
                                </Markdown>
                            </div>
                            :
                            <div className="flex flex-col gap-16 w-full">
                                <div className="flex flex-col w-full gap-2">
                                    <Skeleton width={"full"} height={72} className="bg-violet-300"/>
                                    <Skeleton width={240} height={28}/>
                                </div>
                                <div className="flex flex-col w-full gap-2">
                                    <Skeleton width={"50%"} height={56}/>
                                    <div className="h-12"/>
                                    <Skeleton width={"full"} height={28}/>
                                    <Skeleton width={"full"} height={28}/>
                                    <Skeleton width={"full"} height={28}/>
                                    <Skeleton width={"50%"} height={28}/>
                                </div>
                                <div className="flex flex-col w-full gap-2">
                                    <Skeleton width={"50%"} height={56}/>
                                    <div className="h-12"/>
                                    <Skeleton width={"full"} height={28}/>
                                    <Skeleton width={"full"} height={28}/>
                                    <Skeleton width={"full"} height={28}/>
                                    <Skeleton width={"50%"} height={28}/>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    )

    return (
        <>
        <NavBar/>
        <div className="h-3/4 w-full flex justify-center items-center">
            <div className="flex flex-col items-center">
                <h1 className="text-xl text-black">Blog not found.</h1>
                <Link href="/" className="text-blue-500 hover:underline">Back</Link>
            </div>
        </div>
        </>
    )
}

export default Blog