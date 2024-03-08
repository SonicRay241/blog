"use client"

import { FC } from "react"
import { Property } from "csstype"
import Image from "next/image"
import NextIcon from "@/public/next.png"
import ExternalUrl from "./ExternalUrl"
import Link from "next/link"

const Footer = () => {
    const contacts: { title: string, url: string }[] = [
        {
            title: "Github",
            url: "https://github.com/SonicRay241"
        },
        {
            title: "LinkedIn",
            url: "https://www.linkedin.com/in/rayhan-permana-733129292/"
        },
        {
            title: "Instagram",
            url: "https://www.instagram.com/rayy.dev?igsh=cDFyaTg5Nmd3cDVv"
        }
    ]

    return (
        <div className="bg-white py-12 px-8 h-54 border-t border-gray-200">
            <div 
                className=""
            >     
                <h1 className="text-5xl font-semibold w-fit h-fit text-center mb-3">rayy<span className="text-violet-600">.dev</span><span className="text-2xl text-gray-400">/blogs</span></h1>
            </div>
            <div className="flex flex-col md:flex-row gap-8 md:gap-0">
                <div className="w-full">
                    <div 
                        className="flex flex-wrap gap-2 w-fit"
                    >
                        <h2 className="text-base">Made with</h2>
                        <Link 
                            className="h-5 w-5 hover:cursor-pointer"
                            href="https://nextjs.org/"
                            target="_blank"
                        >
                            <Image src={NextIcon} alt="NextJS Icon" quality={50} height={28} className=""/>
                        </Link>
                        <h2 className="text-base">in Jakarta, Indonesia.</h2>
                    </div>
                </div>
                <div className="flex w-full gap-5 justify-start md:justify-end flex-wrap">
                    {contacts.map((c, n)=>{
                        return (
                            <ExternalUrl
                                title={c.title}
                                url={c.url}
                                key={n}
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Footer