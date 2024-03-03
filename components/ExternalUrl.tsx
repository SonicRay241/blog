import Link from "next/link"
import { ArrowOutward } from "@mui/icons-material"
import { FC } from "react"

const ExternalUrl: FC<{
    title: string
    url: string
}> = (props) => {
    return (
        <Link 
            className="w-fit p-2 border border-black rounded-md hover:bg-black hover:text-white"
            href={props.url}
            target="_blank"
            style={{
                transition: "all 100ms cubic-bezier(0.37, 0, 0.63, 1)"
            }}
        >
            <div className="flex h-5 w-fit">
                <h1 className="text-base">{props.title}</h1>
                <ArrowOutward className="text-base"/>
            </div>
        </Link>
    )
}

export default ExternalUrl