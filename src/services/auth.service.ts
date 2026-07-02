
import { api } from "../lib/axios";
import type { LoginInput, RegisterInput } from "../features/auth/schema";

export interface User{
    id: string;
    name: string;
    email: string;
    role: "USER" | "ADMIN" | "SELLER";
}
export  const authService ={
    login:async(payload: LoginInput): Promise<User> =>{
        const {data} = await api.post("/auth/login",payload);
        return data;
    },
    register: async (payload: RegisterInput): Promise<User> => {
    const { data } = await api.post<User>("/auth/register", payload);
    return data;
  },
    logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },
  me: async (): Promise<User | null> => {
    try {
      const { data } = await api.get<User>("/auth/me");
      return data;
    } catch {
      // login nh thkle null return krbe
      return null;
    }
  },
}