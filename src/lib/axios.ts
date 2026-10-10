import axios from "axios";

export const api = axios.create({
  // Keep browser requests same-origin so auth cookies are not treated as
  // third-party cookies by browsers that block cross-site cookies.
  baseURL: "/api",
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
    const responseData = error.response?.data;
    const validationDetails = Array.isArray(responseData?.details)
      ? responseData.details
          .map((detail: { field?: unknown; message?: unknown }) => {
            const field = typeof detail.field === "string" ? detail.field : "";
            const detailMessage = typeof detail.message === "string" ? detail.message : "";
            return [field, detailMessage].filter(Boolean).join(": ");
          })
          .filter(Boolean)
          .join("; ")
      : "";
    const message = validationDetails
      ? `Validation failed: ${validationDetails}`
      : responseData?.message || responseData?.error || "server error";
    return Promise.reject({ message, status: error.response.status });
  }
);
