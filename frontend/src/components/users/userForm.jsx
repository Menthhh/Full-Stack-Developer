"use client";

import { useState, useEffect } from "react";

const UserForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    full_name: "",
    password: "",
    confirm_password: "",
    is_active: true,
  });
  const [formErrors, setFormErrors] = useState({});

  // Initialize form with initial data if provided
  useEffect(() => {
    if (initialData) {
      setFormData({
        email: initialData.email || "",
        username: initialData.username || "",
        full_name: initialData.full_name || "",
        password: "",
        confirm_password: "",
        is_active:
          initialData.is_active !== undefined ? initialData.is_active : true,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // For checkboxes, use the checked property
    const newValue = type === "checkbox" ? checked : value;

    setFormData({ ...formData, [name]: newValue });

    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (!formData.username) {
      errors.username = "Username is required";
    } else if (formData.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }

    // Only validate password if this is a new user or password is being changed
    if (!initialData || formData.password) {
      if (!initialData && !formData.password) {
        errors.password = "Password is required for new users";
      } else if (formData.password && formData.password.length < 8) {
        errors.password = "Password must be at least 8 characters";
      }

      if (
        formData.password &&
        formData.password !== formData.confirm_password
      ) {
        errors.confirm_password = "Passwords do not match";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Prepare the data for submission
    // Remove confirm_password and only include password if it's set
    const userData = {
      email: formData.email,
      username: formData.username,
      full_name: formData.full_name,
      is_active: formData.is_active,
    };

    // Only include password if it's set (creating new user or changing password)
    if (formData.password) {
      userData.password = formData.password;
    }

    onSubmit(userData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-black ">
      <div>
        <label htmlFor="email" className="form-label pr-4">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className={`input bg-gray-200 text-gray-700 border border-gray-500 rounded py-1 px-4 mb-3 focus:outline-none focus:bg-white ${formErrors.email ? "border-red-300" : ""}`}
          value={formData.email}
          onChange={handleChange}
        />
        {formErrors.email && <p className="form-error">{formErrors.email}</p>}
      </div>

      <div>
        <label htmlFor="username" className="form-label pr-4">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          className={`input bg-gray-200 text-gray-700 border border-gray-500 rounded py-1 px-4 mb-3 focus:outline-none focus:bg-white ${formErrors.username ? "border-red-300" : ""}`}
          value={formData.username}
          onChange={handleChange}
        />
        {formErrors.username && (
          <p className="form-error">{formErrors.username}</p>
        )}
      </div>

      <div>
        <label htmlFor="full_name" className="form-label pr-4">
          Full Name
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          className={`input bg-gray-200 text-gray-700 border border-gray-500 rounded py-1 px-4 mb-3 focus:outline-none focus:bg-white }`}
          value={formData.full_name}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="password" className="form-label pr-4">
          {initialData
            ? "New Password (leave blank to keep current)"
            : "Password"}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required={!initialData}
          className={`input bg-gray-200 text-gray-700 border border-gray-500 rounded py-1 px-4 mb-3 focus:outline-none focus:bg-white ${formErrors.password ? "border-red-300" : ""}`}
          value={formData.password}
          onChange={handleChange}
        />
        {formErrors.password && (
          <p className="form-error">{formErrors.password}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirm_password" className="form-label pr-4">
          Confirm Password
        </label>
        <input
          id="confirm_password"
          name="confirm_password"
          type="password"
          required={!initialData || !!formData.password}
          className={`input bg-gray-200 text-gray-700 border border-gray-500 rounded py-1 px-4 mb-3 focus:outline-none focus:bg-white 
          ${
            formErrors.confirm_password ? "border-red-300" : ""
          }`}
          value={formData.confirm_password}
          onChange={handleChange}
        />
        {formErrors.confirm_password && (
          <p className="form-error">{formErrors.confirm_password}</p>
        )}
      </div>

      <div className="flex items-center">
        <input
          id="is_active"
          name="is_active"
          type="checkbox"
          className="h-4 w-4 text-slate-600 focus:ring-slate-500 border-gray-300 rounded"
          checked={formData.is_active}
          onChange={handleChange}
        />
        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
          Active
        </label>
      </div>

      <div className="text-black flex justify-end space-x-3 pt-4 border-t">
        <button type="button" className="hover:text-gray-800 hover:underline cursor-pointer" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="hover:text-gray-800 hover:underline cursor-pointer">
          {initialData ? "Update User" : "Create User"}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
