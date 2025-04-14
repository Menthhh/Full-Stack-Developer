"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FiEdit,
  FiTrash2,
  FiUserPlus,
  FiSearch,
  FiFilter,
} from "react-icons/fi";
import { userApi } from "@/lib/api";
import UserForm from "./userForm";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    isActive: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const router = useRouter();

  // Fetch users on component mount and when search/filters change
  useEffect(() => {
    fetchUsers();
  }, [searchTerm, filters]);

  // Fetch all users from the API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userApi.getUsers(searchTerm, filters);
      setUsers(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setFilters({
      isActive: "",
    });
  };

  // Toggle filter visibility
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Handle create/edit user
  const handleCreateUser = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  // Handle view user details
  const handleViewUser = (userId) => {
    router.push(`/users/${userId}`);
  };

  // Handle delete user
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      await userApi.deleteUser(userId);
      setUsers(users.filter((user) => user.id !== userId));
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Failed to delete user. Please try again.");
    }
  };

  // Handle form submission
  const handleFormSubmit = async (userData) => {
    try {
      if (editingUser) {
        // Update existing user
        const updatedUser = await userApi.updateUser(editingUser.id, userData);
        setUsers(
          users.map((user) => (user.id === editingUser.id ? updatedUser : user))
        );
      } else {
        // Create new user
        const newUser = await userApi.createUser(userData);
        setUsers([...users, newUser]);
      }
      setShowForm(false);
    } catch (err) {
      console.error("Error saving user:", err);
      setError("Failed to save user. Please try again.");
    }
  };

  // Close the form
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  if (loading && users.length === 0) {
    return <div className="flex justify-center p-6">Loading users...</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Search and filter controls */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="relative flex-1 min-w-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search users..."
                className="pl-10 w-full py-2 border-gray-300 rounded-md shadow-sm focus:ring-slate-500 focus:border-slate-500 text-black placeholder-gray-400"
              />
            </div>
            <button
              onClick={toggleFilters}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
            >
              <FiFilter className="mr-2" />
              {showFilters ? "Hide Filters" : "Filters"}
            </button>
          </div>

          <button
            onClick={handleCreateUser}
            className="inline-flex items-center text-gray-700 cursor-pointer hover:text-gray-900"
          >
            <FiUserPlus className="mr-2 text-gray-700" />
            Add New User
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <div className="flex flex-wrap gap-4">
              <div>
                <label
                  htmlFor="isActive"
                  className="block text-sm font-medium text-gray-400 mb-1 "
                >
                  Status
                </label>
                <select
                  id="isActive"
                  name="isActive"
                  value={filters.isActive}
                  onChange={handleFilterChange}
                  className="block w-full pl-3 pr-10 py-2 text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                >
                  <option value="">All</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                User
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Created
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 cursor-pointer">
                  <td
                    className="px-6 py-4 whitespace-nowrap"
                    onClick={() => handleViewUser(user.id)}
                  >
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                        <span className="text-slate-600 font-medium">
                          {user.username
                            ? user.username.charAt(0).toUpperCase()
                            : "?"}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.full_name || user.username}
                        </div>
                        <div className="text-sm text-gray-500">
                          @{user.username}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    onClick={() => handleViewUser(user.id)}
                  >
                    {user.email}
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap"
                    onClick={() => handleViewUser(user.id)}
                  >
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    onClick={() => handleViewUser(user.id)}
                  >
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditUser(user);
                      }}
                      className="text-slate-600 hover:text-slate-900 mr-4"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteUser(user.id);
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* User Form Modal */}
      {showForm && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  {editingUser ? "Edit User" : "Create New User"}
                </h3>
                <UserForm
                  initialData={editingUser}
                  onSubmit={handleFormSubmit}
                  onCancel={handleCloseForm}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
