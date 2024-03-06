import Link from "next/link";
import { FC } from "react"

const BlogCard: FC<{
    created_at: string;
    hidden: boolean;
    id: string;
    title: string;
    writer: string | null;
}> = (props) => {
    return (
        <Link 
            href={`/editor/blog?q=${props.id}`} 
            className="group p-6 rounded-lg border bg-white hover:bg-gray-100 drop-shadow-sm"
            style={{
                transition: "background-color 100ms cubic-bezier(0.37, 0, 0.63, 1)"
            }}
        >
            <div className="flex flex-col h-full w-full justify-between">
                <h1 className="font-medium text-black">{props.title}</h1>
                <div className="flex justify-between">
                <p 
                    className="font-medium text-gray-500 text-xs mt-6"
                    >
                    {props.created_at.split("T")[0].split("-").reverse().join(".")} | {props.writer}
                </p>
                <p
                    className={`font-medium ${props.hidden ? "text-red-500" : "text-emerald-500"} text-xs mt-6`}
                >
                    {props.hidden ? "Archived" : "Public"}
                </p>
                </div>
            </div>
        </Link>
    )
}

export default BlogCard