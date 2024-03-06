import { FC } from "react";

const Skeleton: FC<{
    width?: number | "full" | string
    height?: number | "full"
    rounded?: number | "full"
    className?: string
}> = (props) => {
    return (
        <div className="animate-pulse">
            <div 
                style={{ 
                    width: props.width == "full" ? "100%" : props.width ?? 120,
                    height: props.height == "full" ? "100%" : props.height ?? 40,
                    borderRadius: props.rounded == "full" ? "50%" : props.rounded ?? 6
                }}
                className={`bg-gray-200 ${props.className}`}
            />
        </div>
    )
}

export default Skeleton