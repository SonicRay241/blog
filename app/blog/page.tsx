"use client"

import { Suspense, useEffect } from "react"
// import Markdown from "react-markdown"
import { useState } from "react"
import Skeleton from "@/components/Skeleton"

import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
// import SyntaxHighlighter from 'react-syntax-highlighter/dist/cjs/prism';
import { oneDark as theme } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import Link from "next/link"
import NavBar from "@/components/Navbar"
import { url } from "@/libs/url";
import { useSearchParams } from "next/navigation"
import Footer from "@/components/Footer"
import Image from "next/image"
import dynamic from "next/dynamic";

const ContentSkeleton = () => {
    return (
        <div className="flex flex-col gap-16 w-full pt-6">
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
    )
}

const Markdown = dynamic(() => import("react-markdown"), {
    ssr: false,
    loading: () => <ContentSkeleton/>
})
const SyntaxHighlighter = dynamic(() => import('react-syntax-highlighter/dist/cjs/prism'))

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

    const [blogMetadata, setBlogMetadata] = useState<{
        created_at: string;
        title: string;
        writer: string | null;
        hidden: boolean;
    } | null>(null)
    const [blogContent, setBlogContent] = useState<string | null>(null)
    const [isError, setIsError] = useState(false)

    useEffect(()=>{
        if (!isLoaded){
            fetch(`${url}/v1/blog/${blog}/metadata?cache=true`)
            .then((res) => res.json())
            .then((data) => {
                setBlogMetadata(data)
                setIsLoaded(true)
            })
            .catch(()=>{
                setIsError(true)
            })
            fetch(`${url}/v1/blog/${blog}/content?cache=true`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                
                setBlogContent(data.content)
                setIsLoaded(true)
            })
            .catch(()=>{
                setIsError(true)
            })
        }
    }, [blog])

    if (!isError)
    return (
        <>
            <NavBar/>
            <div className="w-full flex flex-col items-center pb-20">
                {
                    blogMetadata &&
                    blogMetadata.hidden &&
                    <div className="sticky top-0 w-full flex justify-center bg-red-500 py-2">
                        <h1 className="text-white font-medium">This blog is archived by the author.</h1>
                    </div>
                }
                <div className="w-full max-w-screen-lg text-neutral-900 px-4 sm:px-8">
                    <div className="flex w-full justify-center pt-12">
                        {
                            blogMetadata ?
                            <div className="prose prose-base md:prose-lg prose-pre:bg-transparent prose-code:bg-transparent prose-pre:p-0 max-w-none w-full prose-img:mx-auto prose-img:rounded-md prose-img:border prose-img:border-gray-200 prose-pre:no-scrollbar prose-code:no-scrollbar">
                                <h1 className="text-4xl sm:text-5xl md:text-6xl text-violet-600 mb-4 md:mb-8 p-0 leading-none">{blogMetadata.title}</h1>
                                <p className="text-neutral-500 m-0 p-0 leading-none text-sm sm:text-base md:text-lg">{blogMetadata.created_at.split("T")[0].split("-").reverse().join(".")} | {blogMetadata.writer}</p>
                                <div className="border-b border-gray-300"/>
                                { blogContent ?
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
                                            },
                                            image({ node, inline, src, className, children, ...props }: any) {
                                                return (
                                                    <Image
                                                        className={className}
                                                        style={{
                                                            color: "#3b82f6"
                                                        }}
                                                        quality={100}
                                                        {...props}
                                                    >
                                                        {children}
                                                    </Image>
                                                )
                                            },
                                        }}
                                    >
                                        {blogContent}
                                    </Markdown>
                                    :
                                    <ContentSkeleton/>
                                }
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
            <Footer/>
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