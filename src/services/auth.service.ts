
import { api } from "../lib/axios";
import type { LoginInput, RegisterInput } from "../features/auth/schema";

export interface User{
    id: string;
    name: string;
    email: string;
    role: "USER" | "ADMIN" | "SELLER";
}
type AuthResponse = {
  message?: string;
  user?: User;
  data?: {
    user?: User;
  };
};

export  const authService ={
    login:async(payload: LoginInput): Promise<User> =>{
        const {data} = await api.post<AuthResponse>("/auth/login",payload);
        return (data.user ?? data.data?.user) as User;
    },
    register: async (payload: RegisterInput): Promise<User> => {
    const { data } = await api.post<AuthResponse>("/auth/register", payload);
    return (data.data?.user ?? data.user) as User;
  },
    logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },
  me: async (): Promise<User | null> => {
    try {
      const { data } = await api.get<{ user: User }>("/auth/me");
      return data.user;
    } catch {
      // login nh thkle null return krbe
      return null;
    }
  },
}