import Link from "next/link";
import { FiUserPlus, FiUsers, FiLock } from "react-icons/fi";

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero section */}
      <div className="text-center flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl ">
          <span className="block">User Management</span>
          <span className="block ">Assignment</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Checkout my github repo for the code
          demo.
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <div className="rounded-md shadow">
            <Link
              href="/register"
              className="text-slate-800  w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
            >
              Get Started
            </Link>
          </div>
          <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
            <Link
              href="/login"
              className="text-slate-800 not-only-of-type:w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
