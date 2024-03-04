import Link from "next/link"

const NavBar = () => {
    return (
        <nav className="flex justify-between flex-row h-16 items-center px-4 sm:px-8 bg-white z-50">
            <Link href="/">
                <h1 className="text-2xl font-semibold">rayy<span className="text-violet-600">.dev</span><span className="text-sm text-gray-400">/blogs</span></h1>
            </Link>
            <div className="flex gap-6 items-center">
                <Link href="https://rayy.dev" className="text-lg hover:underline hidden sm:block">
                    Portfolio
                </Link>
                <Link href="/" className="text-lg hover:underline hidden sm:block">
                    Blogs
                </Link>
                {/* <div className="h-6 w-1 border-l-2 border-violet-600"/> */}
                <Link 
                    href="/editor" 
                    className="text-base py-2 px-4 bg-violet-600 hover:bg-violet-500 rounded-md text-white"
                    style={{
                        transition: "background-color 100ms cubic-bezier(0.37, 0, 0.63, 1)"
                    }}
                >
                    Editor
                </Link>
            </div>
        </nav>
    )
}

export default NavBar