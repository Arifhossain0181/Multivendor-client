
import { api } from "../lib/axios";
import type { LoginInput, RegisterInput } from "../features/auth/schema";

export interface User{
    id: string;
    name: string;
    email: string;
    role: "USER" | "ADMIN" | "SELLER" | "DELIVERY";
}
type AuthResponse = {
  message?: string;
  user?: User;
  data?: {
    user?: User;
  };
};

export interface DeliveryManInput {
  name: string;
  email: string;
  password: string;
  district: string;
  zela: string;
  thana: string;
  area: string;
  city: string;
  profileImage?: string;
  vehicleType?: string;
  vehicleImage?: string;
  vehicleRegistrationNumber?: string;
  drivingLicenseNumber?: string;
  drivingLicenseImage?: string;
  registrationCertificateImage?: string;
  taxTokenImage?: string;
  fitnessCertificateImage?: string;
  routePermitImage?: string;
  nidNumber?: string;
  nidFrontImage?: string;
  nidBackImage?: string;
  vehicleRegistrationImage?: string;
  serviceZones?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  termsAccepted: boolean;
  privacyPolicyAccepted: boolean;
  firstName?: string;
  lastName?: string;
  mobileNumber?: string;
  gender?: string;
  dateOfBirth?: string;
  serviceType?: string;
  identityType?: string;
  identityNumber?: string;
  referralCode?: string;
  profilePhoto?: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  registrationNumber?: string;
  registrationRegion?: string;
  registrationCategory?: string;
  registrationDigits?: string;
  vehicleYear?: string;
  taxTokenNumber?: string;
  fitnessNumber?: string;
}

export  const authService ={
    login:async(payload: LoginInput): Promise<User> =>{
        const {data} = await api.post<AuthResponse>("/auth/login",payload);
        return (data.user ?? data.data?.user) as User;
    },
    register: async (payload: RegisterInput): Promise<User> => {
    const { data } = await api.post<AuthResponse>("/auth/register", payload);
    return (data.data?.user ?? data.user) as User;
  },
    registerDeliveryMan: async (payload: DeliveryManInput): Promise<User> => {
      const { data } = await api.post<{ success: boolean; data: { user: User } }>("/delivery/register", payload);
      return data.data.user;
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