import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export const userApi = {
  getUsers: async (search = "", filter = {}) => {
    const params = { search };

    if (filter.isActive === "true") {
        params.is_active = true;
      } else if (filter.isActive === "false") {
        params.is_active = false;
    }
    const response = await api.get("/users", { params });
    return response.data;
  },

  getUser: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (userData) => {
    const response = await api.post("/users", userData);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

export const authApi = {
  //   login: async (credentials) => {
  //     const response = await axios.post(`${API_URL}/auth/login`, credentials);

  //     if (typeof window !== 'undefined' && response.data.access_token) {
  //       localStorage.setItem('token', response.data.access_token);
  //     }

  //     return response.data;
  //   },
  login: async (credentials) => {
    // Convert 'email' to 'username' for the API
    const formData = new URLSearchParams();
    formData.append("username", credentials.email);
    formData.append("password", credentials.password);

    const response = await axios.post(
      `${API_URL}/auth/login`,
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (typeof window !== "undefined" && response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
    }

    return response.data;
  },

  register: async (userData) => {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  },

  getCurrentUser: async () => {
    const response = await api.get("/users/me");
    return response.data;
  },
};

export default api;
