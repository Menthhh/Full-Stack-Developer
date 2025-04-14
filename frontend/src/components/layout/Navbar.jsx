"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { FiMenu, FiX, FiUser, FiLogOut, FiHome, FiUsers } from "react-icons/fi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const isActive = (path) => {
    return pathname === path;
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-10xl mx-auto sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
            <div className="flex ">
                <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-xl font-bold text-black ">
                    User Management
                </Link>
                </div>

                {/* Desktop navigation */}
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                    href="/"
                    className={`${
                    isActive("/")
                        ? "border-slate-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                    Home
                </Link>

                {isAuthenticated && (
                    <>
                    <Link
                        href="/dashboard"
                        className={`${
                        isActive("/dashboard")
                            ? "border-slate-500 text-gray-900"
                            : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                        } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                    >
                        Dashboard
                    </Link>

                    <Link
                        href="/users"
                        className={`${
                        isActive("/users") || pathname.startsWith("/users/")
                            ? "border-slate-500 text-gray-900"
                            : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                        } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                    >
                        Users
                    </Link>
                    </>
                )}
                </div>
          </div>

          {/* User menu desktop */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated ? (
              <div className="ml-3 relative flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">
                  {user?.username || user?.email}
                </span>

                <button
                  onClick={logout}
                  className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  <FiLogOut className="mr-1" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-x-4">
                <Link
                  href="/login"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="bg-slate-600 text-white hover:bg-slate-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-500"
            >
              <span className="sr-only">
                {isOpen ? "Close menu" : "Open menu"}
              </span>
              {isOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? "block" : "hidden"} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            href="/"
            className={`${
              isActive("/")
                ? "text-gray-500 border-slate-500 text-slate-700"
                : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
            } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
            onClick={closeMenu}
          >
            <FiHome className="inline mr-2" /> Home
          </Link>

          {isAuthenticated && (
            <>
              <Link
                href="/dashboard"
                className={`${
                  isActive("/dashboard")
                    ? "bg-slate-50 border-slate-500 text-slate-700"
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                onClick={closeMenu}
              >
                <FiHome className="inline mr-2" /> Dashboard
              </Link>

              <Link
                href="/users"
                className={`${
                  isActive("/users") || pathname.startsWith("/users/")
                    ? "bg-slate-50 border-slate-500 text-slate-700"
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                onClick={closeMenu}
              >
                <FiUsers className="inline mr-2" /> Users
              </Link>
            </>
          )}
        </div>

        <div className="pt-4 pb-3 border-t border-gray-200">
          {isAuthenticated ? (
            <>
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <FiUser className="h-6 w-6 text-slate-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    {user?.full_name || user?.username}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {user?.email}
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 w-full text-left"
                >
                  <FiLogOut className="inline mr-2" /> Logout
                </button>
              </div>
            </>
          ) : (
            <div className="px-4 space-y-1">
              <Link
                href="/login"
                className="block text-gray-500 hover:text-gray-800 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium"
                onClick={closeMenu}
              >
                Login
              </Link>

              <Link
                href="/register"
                className="block text-gray-500 hover:text-gray-800 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium"
                onClick={closeMenu}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
