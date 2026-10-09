/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import Link from "next/link";
import { useState, useEffect } from "react";

import { authService } from "../../../services/auth.service";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";

const deliveryManSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  mobileNumber: z.string().min(2, "Mobile number is required"),
  gender: z.string().min(2, "Gender is required"),
  dateOfBirth: z.string().optional(),
  city: z.string().min(2, "City is required"),
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
  drivingLicenseImage: z.string().min(1, "Driving license image is required"),
  nidFrontImage: z.string().min(1, "NID front image is required"),
  nidBackImage: z.string().min(1, "NID back image is required"),
  registrationCertificateImage: z.string().min(1, "Registration certificate image is required"),
  taxTokenImage: z.string().min(1, "Tax token image is required"),
  fitnessCertificateImage: z.string().min(1, "Fitness certificate image is required"),
  routePermitImage: z.string().min(1, "Route permit image is required"),
});

type DeliveryManInput = z.infer<typeof deliveryManSchema>;

type SubmitStatus = "idle" | "validating" | "submitting" | "success" | "error";

export default function DeliveryManRegisterPage() {
  const router = useRouter();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const documentFields = [
    "drivingLicenseImage",
    "nidFrontImage",
    "nidBackImage",
    "registrationCertificateImage",
    "taxTokenImage",
    "fitnessCertificateImage",
    "routePermitImage",
  ] as const;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<DeliveryManInput>({
    resolver: zodResolver(deliveryManSchema),
    mode: "onChange",
    defaultValues: {
      drivingLicenseImage: "",
      nidFrontImage: "",
      nidBackImage: "",
      registrationCertificateImage: "",
      taxTokenImage: "",
      fitnessCertificateImage: "",
      routePermitImage: "",
    },
  });

  const registerDeliveryMan = useMutation({
    mutationFn: (payload: DeliveryManInput) =>
      authService.registerDeliveryMan({
        ...payload,
        name: `${payload.firstName} ${payload.lastName}`,
      }),
  });

  const onSubmit = async (values: DeliveryManInput) => {
    setSubmitError(null);
    setSubmitStatus("submitting");

    if (selectedServices.length === 0) {
      const error = "Please select at least one service";
      setSubmitError(error);
      setSubmitStatus("error");
      toast.error(error);
      return;
    }

    if (!values.termsAccepted || !values.privacyPolicyAccepted) {
      const error = "Please accept terms and privacy policy";
      setSubmitError(error);
      setSubmitStatus("error");
      toast.error(error);
      return;
    }

    const payload = {
      ...values,
      serviceType: selectedServices.join(", "),
    };

    try {
      await registerDeliveryMan.mutateAsync(payload);
      setSubmitStatus("success");
      reset();
      setSelectedServices([]);
      setPhotoPreview(null);
      toast.success("Delivery man registration successful! Please login.");
      setTimeout(() => router.push("/login"), 1000);
    } catch (error: any) {
      const message = error?.message || "Registration failed, please try again";
      setSubmitStatus("error");
      setSubmitError(message);
      toast.error(message);
    }
  };

  const handleDocumentChange = (
    field: (typeof documentFields)[number],
    file?: File,
  ) => {
    if (!file) {
      setValue(field, "", { shouldDirty: true, shouldValidate: true });
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      setValue(field, "", { shouldDirty: true, shouldValidate: true });
      return;
    }
    if (file.size > 900 * 1024) {
      toast.error("Each document image must be 900 KB or smaller");
      setValue(field, "", { shouldDirty: true, shouldValidate: true });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setValue(field, String(reader.result ?? ""), { shouldDirty: true, shouldValidate: true });
    reader.onerror = () => {
      setValue(field, "", { shouldDirty: true, shouldValidate: true });
      toast.error("Could not read the selected image");
    };
    reader.readAsDataURL(file);
  };

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((item) => item !== service) : [...prev, service]
    );
  };

  const inputClassName =
    "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-[#0A1F44] focus:ring-2 focus:ring-[#0A1F44]/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20";
  const selectClassName =
    "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-[#0A1F44] focus:ring-2 focus:ring-[#0A1F44]/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20";
  const sectionTitleClassName = "text-lg font-semibold text-gray-900 dark:text-gray-100";
  const sectionDescClassName = "text-xs text-gray-500 dark:text-gray-400";

  const isFormValid = Object.keys(errors).length === 0 && selectedServices.length > 0;
  const isButtonDisabled = isSubmitting || registerDeliveryMan.isPending || submitStatus === "submitting";

  useEffect(() => {
    if (submitStatus === "success") {
      const timer = setTimeout(() => setSubmitStatus("idle"), 3000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  return (
    <div className="relative isolate min-h-screen bg-gray-50/75 px-4 py-10 dark:bg-gray-900/75">
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage: "url('/Bazaari%20Delivery%20Bike%20on%20a%20Sunny%20Street.png')",
          backgroundPosition: "center 42%",
        }}
      />
      <div aria-hidden="true" className="fixed inset-0 -z-10 bg-white/65 dark:bg-gray-950/75" />
      <section
        className="relative isolate mx-auto mb-8 flex min-h-[280px] max-w-6xl items-center overflow-hidden rounded-3xl border border-emerald-100 bg-white/60 shadow-lg backdrop-blur-sm dark:border-emerald-900 dark:bg-gray-900/55 sm:min-h-[340px]"
        aria-label="Bazaari delivery motorcycle on a sunny street"
      >
        <div className="ml-auto flex w-full max-w-xl flex-col justify-center p-6 sm:p-9 lg:p-12">
          <span className="w-fit rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800 dark:border-emerald-800 dark:bg-gray-900/70 dark:text-emerald-300">
            Delivery Partner Application
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Deliver with <span className="text-emerald-700 dark:text-emerald-400">Bazaari</span>
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-6 text-slate-600 dark:text-gray-300 sm:text-base">
            Join our delivery team. Submit your details and required documents to apply.
          </p>
        </div>
      </section>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mx-auto max-w-3xl"
      >
        <div className="mb-6">
          <h1 className={sectionTitleClassName}>Delivery Man Registration</h1>
          <p className={sectionDescClassName}>Fill in the details to register as a delivery man</p>
          <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700 dark:border-amber-900 dark:bg-amber-900/20 dark:text-amber-300">
            <p className="font-medium">Note:</p>
            <p>After registration, your account will be in <strong>PENDING</strong> status. An admin will review your application. Once approved, you can login with the email and password you provide below.</p>
          </div>
        </div>

        {/* Status indicator */}
        <div className="mb-4 rounded-lg border p-3 text-sm">
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${
              submitStatus === "idle" ? "bg-gray-400" :
              submitStatus === "validating" ? "bg-yellow-400 animate-pulse" :
              submitStatus === "submitting" ? "bg-blue-400 animate-pulse" :
              submitStatus === "success" ? "bg-green-400" :
              "bg-red-400"
            }`} />
            <span className="font-medium">
              {submitStatus === "idle" && "Ready to submit"}
              {submitStatus === "validating" && "Validating form..."}
              {submitStatus === "submitting" && "Submitting registration..."}
              {submitStatus === "success" && "Registration successful! Redirecting..."}
              {submitStatus === "error" && "Submission failed"}
            </span>
          </div>
          {!isFormValid && submitStatus === "idle" && (
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              Please fill all required fields and select at least one service
            </p>
          )}
        </div>

        {submitError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-900/20 dark:text-red-300">
            <p className="font-medium">Error:</p>
            <p>{submitError}</p>
          </div>
        )}

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
              <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
              <Input id="email" type="email" className={inputClassName} aria-invalid={!!errors.email} {...register("email")} />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
              <Input id="password" type="password" className={inputClassName} aria-invalid={!!errors.password} {...register("password")} />
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
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

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="district">District <span className="text-red-500">*</span></Label>
              <Input id="district" className={inputClassName} placeholder="District" aria-invalid={!!errors.district} {...register("district")} />
              {errors.district && <p className="text-xs text-red-500">{errors.district.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="zela">Zela / Upazila <span className="text-red-500">*</span></Label>
              <Input id="zela" className={inputClassName} placeholder="Zela" aria-invalid={!!errors.zela} {...register("zela")} />
              {errors.zela && <p className="text-xs text-red-500">{errors.zela.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="thana">Thana <span className="text-red-500">*</span></Label>
              <Input id="thana" className={inputClassName} placeholder="Thana" aria-invalid={!!errors.thana} {...register("thana")} />
              {errors.thana && <p className="text-xs text-red-500">{errors.thana.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="area">Area <span className="text-red-500">*</span></Label>
              <Input id="area" className={inputClassName} placeholder="Area" aria-invalid={!!errors.area} {...register("area")} />
              {errors.area && <p className="text-xs text-red-500">{errors.area.message}</p>}
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
                    checked={selectedServices.includes(service)}
                    onChange={() => toggleService(service)}
                    className="h-4 w-4 rounded border-gray-300 text-[#0A1F44] focus:ring-[#0A1F44] dark:border-gray-600 dark:bg-gray-700"
                  />
                  <span>{service}</span>
                </label>
              ))}
            </div>
            {selectedServices.length === 0 && (
              <p className="text-xs text-red-500">Please select at least one service</p>
            )}
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

        {/* 03 Document Images */}
        <div className="mb-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800">
          <h2 className={sectionTitleClassName}>03 Document Images</h2>
          <p className={sectionDescClassName}>Upload required documents</p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="drivingLicenseImage">Driving License <span className="text-red-500">*</span></Label>
              <input
                type="file"
                id="drivingLicenseImage"
                accept="image/*"
                required
                className="text-sm text-gray-500 dark:text-gray-400"
                onChange={(e) => handleDocumentChange("drivingLicenseImage", e.target.files?.[0])}
              />
              {errors.drivingLicenseImage && <p className="text-xs text-red-500">{errors.drivingLicenseImage.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nidFrontImage">NID Front <span className="text-red-500">*</span></Label>
              <input
                type="file"
                id="nidFrontImage"
                accept="image/*"
                required
                className="text-sm text-gray-500 dark:text-gray-400"
                onChange={(e) => handleDocumentChange("nidFrontImage", e.target.files?.[0])}
              />
              {errors.nidFrontImage && <p className="text-xs text-red-500">{errors.nidFrontImage.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nidBackImage">NID Back <span className="text-red-500">*</span></Label>
              <input
                type="file"
                id="nidBackImage"
                accept="image/*"
                required
                className="text-sm text-gray-500 dark:text-gray-400"
                onChange={(e) => handleDocumentChange("nidBackImage", e.target.files?.[0])}
              />
              {errors.nidBackImage && <p className="text-xs text-red-500">{errors.nidBackImage.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="registrationCertificateImage">Registration Certificate <span className="text-red-500">*</span></Label>
              <input
                type="file"
                id="registrationCertificateImage"
                accept="image/*"
                required
                className="text-sm text-gray-500 dark:text-gray-400"
                onChange={(e) => handleDocumentChange("registrationCertificateImage", e.target.files?.[0])}
              />
              {errors.registrationCertificateImage && <p className="text-xs text-red-500">{errors.registrationCertificateImage.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="taxTokenImage">Tax Token <span className="text-red-500">*</span></Label>
              <input
                type="file"
                id="taxTokenImage"
                accept="image/*"
                required
                className="text-sm text-gray-500 dark:text-gray-400"
                onChange={(e) => handleDocumentChange("taxTokenImage", e.target.files?.[0])}
              />
              {errors.taxTokenImage && <p className="text-xs text-red-500">{errors.taxTokenImage.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="fitnessCertificateImage">Fitness Certificate <span className="text-red-500">*</span></Label>
              <input
                type="file"
                id="fitnessCertificateImage"
                accept="image/*"
                required
                className="text-sm text-gray-500 dark:text-gray-400"
                onChange={(e) => handleDocumentChange("fitnessCertificateImage", e.target.files?.[0])}
              />
              {errors.fitnessCertificateImage && <p className="text-xs text-red-500">{errors.fitnessCertificateImage.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="routePermitImage">Route Permit <span className="text-red-500">*</span></Label>
              <input
                type="file"
                id="routePermitImage"
                accept="image/*"
                required
                className="text-sm text-gray-500 dark:text-gray-400"
                onChange={(e) => handleDocumentChange("routePermitImage", e.target.files?.[0])}
              />
              {errors.routePermitImage && <p className="text-xs text-red-500">{errors.routePermitImage.message}</p>}
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
          <Button 
            type="submit" 
            disabled={isButtonDisabled}
            className="min-w-[140px]"
          >
            {submitStatus === "submitting" ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Submitting...
              </>
            ) : submitStatus === "success" ? (
              "Success!"
            ) : (
              "Submit"
            )}
          </Button>
          <Link href="/register">
            <Button type="button" variant="outline" disabled={isButtonDisabled}>
              Back
            </Button>
          </Link>
        </div>

      </form>
    </div>
  );
}
