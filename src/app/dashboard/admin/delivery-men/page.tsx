"use client";

import { useState } from "react";
import { useAdminDeliveryMen, useUpdateDeliveryManStatus } from "@/src/features/admin/useAdmin";
import { toast } from "sonner";
import type { AdminDeliveryMan } from "../comPonents/types.admin";

const statusOptions: AdminDeliveryMan["status"][] = ["PENDING", "APPROVED", "REJECTED"];

function StatusChip({ status }: { status: AdminDeliveryMan["status"] }) {
  const tone =
    status === "APPROVED"
      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
      : status === "REJECTED"
        ? "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
        : "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";

  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${tone}`}>{status}</span>;
}

function DeliveryManDetails({ item }: { item: AdminDeliveryMan }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-50 dark:border-gray-800">
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <p className="font-medium text-gray-800 dark:text-gray-100">{item.user.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{item.user.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusChip status={item.status} />
          <button
            onClick={() => setOpen(!open)}
            className="text-xs text-blue-600 hover:underline"
          >
            {open ? "Hide" : "Details"}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-gray-100 bg-gray-50 px-4 py-4 dark:border-gray-800 dark:bg-gray-800/40">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Personal Info</p>
              <p className="text-sm text-gray-800 dark:text-gray-100">{item.firstName} {item.lastName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{item.mobileNumber} | {item.gender}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{item.city} | {item.district}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Service Type</p>
              <p className="text-sm text-gray-800 dark:text-gray-100">{item.serviceType || "-"}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{item.identityType}: {item.identityNumber || item.nidNumber || "-"}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Vehicle Info</p>
              <p className="text-sm text-gray-800 dark:text-gray-100">{item.vehicleBrand} {item.vehicleModel}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{item.registrationNumber} | {item.vehicleYear}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Tax & Fitness</p>
              <p className="text-sm text-gray-800 dark:text-gray-100">Tax: {item.taxTokenNumber || "-"}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Fitness: {item.fitnessNumber || "-"}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Emergency Contact</p>
              <p className="text-sm text-gray-800 dark:text-gray-100">{item.emergencyContactName || "-"}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{item.emergencyContactPhone} ({item.emergencyContactRelation})</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Terms & Privacy</p>
              <p className="text-sm text-gray-800 dark:text-gray-100">
                Terms: {item.termsAccepted ? "Accepted" : "Not accepted"} | Privacy: {item.privacyPolicyAccepted ? "Accepted" : "Not accepted"}
              </p>
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Images</p>
              <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-700 dark:text-gray-200">
                {item.profilePhoto && <a href={item.profilePhoto} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Profile</a>}
                {item.profileImage && <a href={item.profileImage} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Profile Image</a>}
                {item.vehicleImage && <a href={item.vehicleImage} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Vehicle</a>}
                {item.drivingLicenseImage && <a href={item.drivingLicenseImage} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">License</a>}
                {item.nidFrontImage && <a href={item.nidFrontImage} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">NID Front</a>}
                {item.nidBackImage && <a href={item.nidBackImage} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">NID Back</a>}
                {item.vehicleRegistrationImage && <a href={item.vehicleRegistrationImage} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Registration</a>}
                {!item.profilePhoto && !item.profileImage && !item.vehicleImage && !item.drivingLicenseImage && !item.nidFrontImage && !item.nidBackImage && !item.vehicleRegistrationImage && <span>No images uploaded</span>}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Update status:</label>
            <select
              value={item.status}
              onChange={(e) =>
                handleStatusChange(
                  item.id,
                  e.target.value as AdminDeliveryMan["status"]
                )
              }
              disabled={updateStatus.isPending}
              className="rounded-md border border-gray-200 bg-transparent px-2 py-1 text-xs outline-none focus:border-cyan-500 dark:border-gray-700 dark:text-gray-200"
            >
              {statusOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminDeliveryMenPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const { data, isLoading } = useAdminDeliveryMen(statusFilter, page);
  const updateStatus = useUpdateDeliveryManStatus();

  const handleStatusChange = (deliveryManId: string, newStatus: AdminDeliveryMan["status"]) => {
    updateStatus.mutate(
      { deliveryManId, status: newStatus },
      {
        onSuccess: () => toast.success("Delivery man status updated"),
        onError: () => toast.error("Failed to update status"),
      }
    );
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            Delivery Men
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage delivery man applications and their current status.
          </p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2 border-b border-gray-100 dark:border-gray-800">
        {[
          { label: "All", value: undefined },
          { label: "Pending", value: "PENDING" },
          { label: "Approved", value: "APPROVED" },
          { label: "Rejected", value: "REJECTED" },
        ].map((filter) => (
          <button
            key={filter.label}
            onClick={() => {
              setStatusFilter(filter.value);
              setPage(1);
            }}
            className={`px-4 py-2 text-sm font-medium ${
              statusFilter === filter.value
                ? "border-b-2 border-[#0A1F44] text-[#0A1F44] dark:border-cyan-400 dark:text-cyan-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="h-96 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-900" />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          {data?.items.map((item) => (
            <DeliveryManDetails key={item.id} item={item} />
          ))}
        </div>
      )}

      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={() => setPage((current) => Math.max(1, current - 1))}
          disabled={page === 1}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm disabled:opacity-40 dark:border-gray-700 dark:text-gray-300"
        >
          Prev
        </button>
        <button
          onClick={() => setPage((current) => current + 1)}
          disabled={page >= Math.max(1, Math.ceil((data?.total ?? 0) / (data?.limit ?? 10)))}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm disabled:opacity-40 dark:border-gray-700 dark:text-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
}
