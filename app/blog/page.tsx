import NavBar from "@/components/Navbar"
import dynamic from "next/dynamic";
import NavPage from "@/components/home/BlogPage";

const Footer = dynamic(() => import("@/components/Footer"))

const Blog = () => {
    return (
        <>
            <NavBar/>
            <NavPage/>
            <Footer/>
        </>
    )
}

export default Blog