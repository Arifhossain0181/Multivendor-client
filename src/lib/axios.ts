import axios from 'axios';


export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// resPonse intercePtor 
api.interceptors.response.use((response) => response, 
async (error) => {
    const originalRequest = error.config;
   
    if(error.response.status === 401 && !originalRequest._retry){
        originalRequest._retry = true;}
        try{
           await axios.post(
          `${api.defaults.baseURL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );
        // retry the original request after refreshing the token
        return api(originalRequest);
        }
        catch(refreshError){
            // handle refresh token error (e.g., redirect to login page)
            if(typeof window !== 'undefined'){
                window.location.href = '/login';
            }
            return Promise.reject(refreshError);
        }
        // others error hole reject kore dw 
        return Promise.reject(error);
})