"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import { userApi } from "@/lib/api";
import UserCard from "@/components/users/UserCard";
import UserDetailView from "@/components/users/UserDetailView";

export default function UserDetailPage({ params }) {
 const { id } = use(params);

  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      if (isAuthenticated) {
        try {
          setPageLoading(true);
          const userData = await userApi.getUser(id);
          setUser(userData);
          setError(null);
        } catch (err) {
          console.error("Error fetching user:", err);
          setError("Failed to load user. Please try again.");
        } finally {
          setPageLoading(false);
        }
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id, isAuthenticated]);



  if (loading || pageLoading) {
    return <div className="text-center p-8">Loading user details...</div>;
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="space-y-6 text-black">
      <div className="flex items-center justify-between px-4 py-5 sm:px-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            View and manage user information.
          </p>
        </div>
        <Link
          href="/users"
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
        >
          <FiArrowLeft className="mr-2 -ml-1 h-5 w-5" />
          Back to Users
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      <UserDetailView user={user} onBack={() => router.push("/dashboard")} />
    </div>
  );
}
