export type SellerStatus = "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
export type UserRole = "CUSTOMER" | "SELLER" | "ADMIN" | "DELIVERY";
export type DeliveryManStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  sellerStatus?: SellerStatus;
  shopName?: string;
  paidOrderCount?: number;
  totalPaidAmount?: number;
  lastPaidOrderAt?: string | null;
  createdAt: string;
  isActive: boolean;
}

export interface AdminStats {
  totalUsers: number;
  totalSellers: number;
  pendingSellers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

export type AdminProduct = {
  id: string;
  name: string;
  image: string;
  sellerName: string;
  price: number;
  quantity?: number;
  status: "DRAFT" | "ACTIVE" | "BLOCKED";
  createdAt: string;
};

export interface AdminDeliveryMan {
  id: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  mobileNumber?: string;
  gender?: string;
  dateOfBirth?: string;
  city: string;
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
  district: string;
  zela: string;
  thana: string;
  area: string;
  profileImage?: string;
  vehicleType?: string;
  vehicleImage?: string;
  vehicleRegistrationImage?: string;
  drivingLicenseNumber?: string;
  drivingLicenseImage?: string;
  registrationCertificateImage?: string;
  taxTokenImage?: string;
  fitnessCertificateImage?: string;
  routePermitImage?: string;
  nidNumber?: string;
  nidFrontImage?: string;
  nidBackImage?: string;
  serviceZones?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  termsAccepted: boolean;
  privacyPolicyAccepted: boolean;
  status: DeliveryManStatus;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    isActive: boolean;
  };
}

export interface AdminSubOrder {
  id: string;
  sellerName: string;
  status: string;
  subtotal: number;
  itemCount: number;
  createdAt?: string;
  deliveryManId?: string | null;
  deliveryMan?: {
    id: string;
    name: string;
    mobileNumber?: string;
  } | null;
}

export interface AdminOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  subOrders: AdminSubOrder[];
}
