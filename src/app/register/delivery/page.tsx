/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import Link from "next/link";
import { useState } from "react";

import { authService } from "../../../services/auth.service";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";

const deliveryManSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  mobileNumber: z.string().min(2, "Mobile number is required"),
  gender: z.string().min(2, "Gender is required"),
  dateOfBirth: z.string().optional(),
  city: z.string().min(2, "City is required"),
  serviceType: z.string().min(2, "Service type is required"),
  identityType: z.string().min(2, "Identity type is required"),
  identityNumber: z.string().optional(),
  referralCode: z.string().optional(),
  profilePhoto: z.string().url("Invalid image URL").optional().or(z.literal("")),
  vehicleBrand: z.string().optional(),
  vehicleModel: z.string().optional(),
  registrationNumber: z.string().optional(),
  registrationRegion: z.string().optional(),
  registrationCategory: z.string().optional(),
  registrationDigits: z.string().optional(),
  vehicleYear: z.string().optional(),
  taxTokenNumber: z.string().optional(),
  fitnessNumber: z.string().optional(),
  district: z.string().min(2, "District is required"),
  zela: z.string().min(2, "Zela/Upazila is required"),
  thana: z.string().min(2, "Thana is required"),
  area: z.string().min(2, "Area is required"),
  termsAccepted: z.boolean().refine(val => val === true, "You must accept the terms and conditions"),
  privacyPolicyAccepted: z.boolean().refine(val => val === true, "You must accept the privacy policy"),
});

type DeliveryManInput = z.infer<typeof deliveryManSchema>;

export default function DeliveryManRegisterPage() {
  const router = useRouter();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeliveryManInput>({
    resolver: zodResolver(deliveryManSchema),
  });

  const registerDeliveryMan = useMutation({
    mutationFn: (payload: DeliveryManInput) =>
      authService.registerDeliveryMan({
        name: `${payload.firstName} ${payload.lastName}`,
        email: `${payload.mobileNumber}@temp.local`,
        password: Math.random().toString(36).slice(2),
        ...payload,
      }),

    onSuccess: () => {
      toast.success("Delivery man registration successful! Please login.");
      router.push("/login");
    },

    onError: (error: any) => {
      toast.error(error.message || "Registration failed, please try again");
    },
  });

  const onSubmit = (values: DeliveryManInput) => {
    registerDeliveryMan.mutate(values);
  };

  const inputClassName =
    "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-[#0A1F44] focus:ring-2 focus:ring-[#0A1F44]/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20";
  const selectClassName =
    "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-[#0A1F44] focus:ring-2 focus:ring-[#0A1F44]/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20";
  const sectionTitleClassName = "text-lg font-semibold text-gray-900 dark:text-gray-100";
  const sectionDescClassName = "text-xs text-gray-500 dark:text-gray-400";

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mx-auto max-w-3xl"
      >
        <div className="mb-6">
          <h1 className={sectionTitleClassName}>Delivery Man Registration</h1>
          <p className={sectionDescClassName}>Fill in the details to register as a delivery man</p>
        </div>

        {/* 01 Personal Information */}
        <div className="mb-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800">
          <h2 className={sectionTitleClassName}>01 Personal Information</h2>
          <p className={sectionDescClassName}>Basic details and identity verification</p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
              <Input id="firstName" className={inputClassName} aria-invalid={!!errors.firstName} {...register("firstName")} />
              {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
              <Input id="lastName" className={inputClassName} aria-invalid={!!errors.lastName} {...register("lastName")} />
              {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="mobileNumber">Mobile Number <span className="text-red-500">*</span></Label>
              <Input id="mobileNumber" className={inputClassName} aria-invalid={!!errors.mobileNumber} {...register("mobileNumber")} />
              {errors.mobileNumber && <p className="text-xs text-red-500">{errors.mobileNumber.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="gender">Gender <span className="text-red-500">*</span></Label>
              <select id="gender" className={selectClassName} {...register("gender")}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <p className="text-xs text-red-500">{errors.gender.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="dateOfBirth">Date Of Birth <span className="text-red-500">*</span></Label>
              <Input id="dateOfBirth" type="date" className={inputClassName} {...register("dateOfBirth")} />
              {errors.dateOfBirth && <p className="text-xs text-red-500">{errors.dateOfBirth.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
              <select id="city" className={selectClassName} {...register("city")}>
                <option value="">Select City</option>
                <option value="Dhaka">Dhaka</option>
                <option value="Chittagong">Chittagong</option>
                <option value="Khulna">Khulna</option>
                <option value="Rajshahi">Rajshahi</option>
                <option value="Sylhet">Sylhet</option>
                <option value="Barisal">Barisal</option>
                <option value="Rangpur">Rangpur</option>
                <option value="Comilla">Comilla</option>
              </select>
              {errors.city && <p className="text-xs text-red-500">{errors.city.message}</p>}
            </div>
          </div>

          <div className="mt-4">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">Service(s) you want to provide <span className="text-red-500">*</span></Label>
            <div className="mt-2 flex flex-wrap gap-4">
              {["Bike Rider", "Food Delivery", "Parcel Delivery", "Tong Delivery"].map((service) => (
                <label key={service} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                  <input
                    type="checkbox"
                    value={service}
                    {...register("serviceType")}
                    className="h-4 w-4 rounded border-gray-300 text-[#0A1F44] focus:ring-[#0A1F44] dark:border-gray-600 dark:bg-gray-700"
                  />
                  <span>{service}</span>
                </label>
              ))}
            </div>
            {errors.serviceType && <p className="text-xs text-red-500">{errors.serviceType.message}</p>}
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="identityType">Select Your Identity <span className="text-red-500">*</span></Label>
              <select id="identityType" className={selectClassName} {...register("identityType")}>
                <option value="">Select Identity</option>
                <option value="NID">NID</option>
                <option value="Driving License">Driving License</option>
                <option value="Passport">Passport</option>
              </select>
              {errors.identityType && <p className="text-xs text-red-500">{errors.identityType.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="identityNumber">NID Number <span className="text-red-500">*</span></Label>
              <Input id="identityNumber" className={inputClassName} aria-invalid={!!errors.identityNumber} {...register("identityNumber")} />
              {errors.identityNumber && <p className="text-xs text-red-500">{errors.identityNumber.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="referralCode">Referral Code</Label>
              <Input id="referralCode" className={inputClassName} placeholder="Enter your referral code" {...register("referralCode")} />
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-1.5">
            <Label htmlFor="profilePhoto">Upload your photo <span className="text-red-500">*</span></Label>
            <input
              type="file"
              id="profilePhoto"
              accept="image/*"
              className="text-sm text-gray-500 dark:text-gray-400"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => setPhotoPreview(reader.result as string);
                  reader.readAsDataURL(file);
                }
              }}
            />
            {photoPreview && (
              <img src={photoPreview} alt="Preview" className="mt-2 h-24 w-24 rounded-lg object-cover" />
            )}
            {errors.profilePhoto && <p className="text-xs text-red-500">{errors.profilePhoto.message}</p>}
          </div>
        </div>

        {/* 02 Vehicle Information */}
        <div className="mb-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800">
          <h2 className={sectionTitleClassName}>02 Vehicle Information</h2>
          <p className={sectionDescClassName}>Vehicle details for delivery</p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="vehicleBrand">Select Brand <span className="text-red-500">*</span></Label>
              <select id="vehicleBrand" className={selectClassName} {...register("vehicleBrand")}>
                <option value="">Select The Brand</option>
                <option value="Yamaha">Yamaha</option>
                <option value="Honda">Honda</option>
                <option value="Suzuki">Suzuki</option>
                <option value="Hero">Hero</option>
                <option value="Bajaj">Bajaj</option>
                <option value="TVS">TVS</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="vehicleModel">Select Model <span className="text-red-500">*</span></Label>
              <select id="vehicleModel" className={selectClassName} {...register("vehicleModel")}>
                <option value="">Select Your Bike Model</option>
                <option value="Standard">Standard</option>
                <option value="Sports">Sports</option>
                <option value="Cruiser">Cruiser</option>
                <option value="Scooter">Scooter</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="registrationNumber">Registration Number <span className="text-red-500">*</span></Label>
              <div className="mt-1 grid gap-2 sm:grid-cols-3">
                <select id="registrationRegion" className={selectClassName} {...register("registrationRegion")}>
                  <option value="">Region</option>
                  <option value="Dhaka">Dhaka</option>
                  <option value="Chittagong">Chittagong</option>
                  <option value="Khulna">Khulna</option>
                </select>
                <select id="registrationCategory" className={selectClassName} {...register("registrationCategory")}>
                  <option value="">Category</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
                <Input id="registrationDigits" className={inputClassName} placeholder="Digits" {...register("registrationDigits")} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="vehicleYear">Year <span className="text-red-500">*</span></Label>
              <select id="vehicleYear" className={selectClassName} {...register("vehicleYear")}>
                <option value="">Select Year</option>
                {Array.from({ length: 20 }, (_, i) => 2025 - i).map((year) => (
                  <option key={year} value={String(year)}>{year}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="taxTokenNumber">Tax Token Number <span className="text-red-500">*</span></Label>
              <Input id="taxTokenNumber" className={inputClassName} aria-invalid={!!errors.taxTokenNumber} {...register("taxTokenNumber")} />
              {errors.taxTokenNumber && <p className="text-xs text-red-500">{errors.taxTokenNumber.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="fitnessNumber">Fitness Number</Label>
              <Input id="fitnessNumber" className={inputClassName} {...register("fitnessNumber")} />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
            <input type="checkbox" {...register("termsAccepted")} />
            <span>I accept the terms and conditions</span>
          </label>
          {errors.termsAccepted && <p className="text-xs text-red-500">{errors.termsAccepted.message}</p>}

          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
            <input type="checkbox" {...register("privacyPolicyAccepted")} />
            <span>I accept the privacy policy</span>
          </label>
          {errors.privacyPolicyAccepted && <p className="text-xs text-red-500">{errors.privacyPolicyAccepted.message}</p>}
        </div>

        <div className="mt-4 flex gap-3">
          <Button type="submit" disabled={registerDeliveryMan.isPending}>
            {registerDeliveryMan.isPending ? "Submitting..." : "Submit"}
          </Button>
          <Link href="/register">
            <Button type="button" variant="outline">
              Back
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
