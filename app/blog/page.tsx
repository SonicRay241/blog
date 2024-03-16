import NavBar from "@/components/Navbar"
import dynamic from "next/dynamic";
import BlogPage from "@/components/home/BlogPage";
import { Suspense } from "react";

const Footer = dynamic(() => import("@/components/Footer"))

const Blog = () => {
    return (
        <>
            <NavBar/>
            <Suspense>
                <BlogPage/>
            </Suspense>
            <Footer/>
        </>
    )
}

export default Blog