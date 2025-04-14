import { useState, useEffect, useCallback } from "react";
import { userApi } from "@/lib/api";

export function useUsers(initialFilters = {}, initialSearch = "") {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  // Fetch users based on filters and search
  const fetchUsers = useCallback(async () => {
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
  }, [searchTerm, filters]);

  // Call fetchUsers when filters or search changes
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Create a new user
  const createUser = async (userData) => {
    try {
      setLoading(true);
      const newUser = await userApi.createUser(userData);
      setUsers((prev) => [...prev, newUser]);
      return newUser;
    } catch (err) {
      console.error("Error creating user:", err);
      setError("Failed to create user. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing user
  const updateUser = async (id, userData) => {
    try {
      setLoading(true);
      const updatedUser = await userApi.updateUser(id, userData);
      setUsers((prev) =>
        prev.map((user) => (user.id === id ? updatedUser : user))
      );
      return updatedUser;
    } catch (err) {
      console.error("Error updating user:", err);
      setError("Failed to update user. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a user
  const deleteUser = async (id) => {
    try {
      setLoading(true);
      await userApi.deleteUser(id);
      setUsers((prev) => prev.filter((user) => user.id !== id));
      return true;
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Failed to delete user. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({});
    setSearchTerm("");
  };

  return {
    users,
    loading,
    error,
    searchTerm,
    filters,
    setSearchTerm,
    updateFilters,
    resetFilters,
    createUser,
    updateUser,
    deleteUser,
    refetch: fetchUsers,
  };
}
