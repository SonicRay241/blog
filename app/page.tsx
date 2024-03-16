import NavBar from "@/components/Navbar";
import dynamic from "next/dynamic";
import LatestBlogs from "@/components/home/LatestBlogs";

const Footer = dynamic(() => import("@/components/Footer"))

const Page = () => {
  return (
    <>
      <NavBar/>
      <div className="flex w-full justify-center pt-12">
        <div className="max-w-screen-md w-full px-4 md:px-8">
          <div className="w-full sm:px-16 md:px-32">
            <h1 className="text-5xl font-semibold w-full text-center mt-5">rayy<span className="text-violet-600">.dev</span><span className="text-2xl text-gray-400">/blogs</span></h1>
            <h1 className="w-full text-center text-2xl font-medium mt-10">
              Where logic meets creativity: <br />
              Unraveling the mysteries of code and technology.
            </h1>
            <p className="mt-10 text-center text-gray-500">Unleashing creativity in the world of technology and igniting innovation in the digital realm.</p>
          </div>
          <LatestBlogs/>
        </div>
      </div>
      <Footer/>
    </>
  )
}

export default Page