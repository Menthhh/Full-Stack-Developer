"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiUsers, FiUserPlus, FiUser } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import { userApi } from "@/lib/api";

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const [userCount, setUserCount] = useState(0);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (isAuthenticated) {
        try {
          setDashboardLoading(true);
          // Fetch user count
          const users = await userApi.getUsers();
          setUserCount(users.length);
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        } finally {
          setDashboardLoading(false);
        }
      }
    };

    fetchDashboardData();
  }, [isAuthenticated]);

  if (loading || dashboardLoading) {
    return <div className="text-center p-8">Loading dashboard...</div>;
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="space-y-6">
      <div className="px-4 py-5 sm:px-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Welcome back, {user?.full_name || user?.username}!
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Stats Card - User Count */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiUsers className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Users
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {userCount}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link
                href="/users"
                className="font-medium text-slate-600 hover:text-slate-500"
              >
                View all users
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Action - Add User */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiUserPlus className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Quick Action
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      Create New User
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link
                href="/users"
                className="font-medium text-slate-600 hover:text-slate-500"
              >
                Add a new user
              </Link>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiUser className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Your Profile
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {user?.email}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a
                href={`/users/${user?.id}`}
                className="font-medium text-slate-600 hover:text-slate-500"
              >
                View profile details
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Activity/Overview Section */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            System Overview
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            User management system powered by Next.js, FastAPI, and SQLite.
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <p className="text-base text-gray-500">
            This dashboard provides an overview of your user management system.
            From here, you can:
          </p>
          <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-gray-500">
            <li>View all users in the system</li>
            <li>Create new user accounts</li>
            <li>Edit existing user details</li>
            <li>Manage user active status</li>
            <li>Delete users from the system</li>
          </ul>
          <div className="mt-5">
            <Link
              href="/users"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
            >
              Go to User Management
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
