"use client"


import { KeyboardArrowDown } from "@mui/icons-material"
import Link from "next/link"
import { FC } from "react"

const EditorNavBar: FC<{
    username: string | null
    fixed?: boolean
}> = (props) => {
    return (
        <nav className={`${props.fixed ? "fixed w-full" : ""} flex justify-between flex-row h-16 items-center px-4 sm:px-8`}>
            <Link href="/">
                <h1 className="text-2xl font-semibold">rayy<span className="text-violet-600">.dev</span><span className="text-sm text-gray-400">/blogs</span></h1>
            </Link>
            <div className="flex gap-6 pr-2 items-center">
                <Link href="https://rayy.dev" className="text-lg hover:underline">
                    Portfolio
                </Link>
                <Link href="/" className="text-lg hover:underline">
                    Blogs
                </Link>
                { props.username &&
                <>
                    <div className="h-6 w-1 border-l-2 border-violet-600"/>
                    <p className="text-lg">
                        {props.username}
                    </p>
                </>
                }
            </div>
        </nav>
    )
}

export default EditorNavBar