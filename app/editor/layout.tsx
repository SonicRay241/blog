import { Toaster } from "react-hot-toast";

export default function EditorLayout({children,}
: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Toaster/>
            {children}
        </>
    )
}