import EditorNavBar from "@/components/editor/EditorNavbar";

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