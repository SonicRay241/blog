import EditorNavBar from "@/components/EditorNavbar";
import { getCookies } from 'next-client-cookies/server';

export default function EditorLayout({children,}
: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            {children}
        </>
    )
}