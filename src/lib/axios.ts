import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url ?? "";
    const isAuthEndpoint = /\/auth\/(login|register|refresh-token)$/.test(requestUrl);

    
    if (!error.response) {
      return Promise.reject({ message: "Network error, server is not reachable" });
    }

    
    if (error.response.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true; 

      try {
        await axios.post(
          `${api.defaults.baseURL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );
       
        return api(originalRequest);
      } catch (refreshError) {
        
        if (typeof window !== "undefined") {
          const path = window.location.pathname;
          const isProtected = 
            path.startsWith("/admin") || 
            path.startsWith("/dashboard") || 
            path.startsWith("/seller") || 
            path.startsWith("/cart") || 
            path.startsWith("/checkout") ||
            path.startsWith("/orders");

          if (isProtected) {
            window.location.href = `/login?redirect=${encodeURIComponent(path)}`;
          }
        }
        return Promise.reject(refreshError);
      }
    }

    // 
    const message = error.response?.data?.message || error.response?.data?.error || "server error";
    return Promise.reject({ message, status: error.response.status });
  }
);