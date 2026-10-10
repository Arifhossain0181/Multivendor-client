"use client";

import { useState } from "react";
import { useAdminDeliveryMen, useUpdateDeliveryManStatus, useDeleteDeliveryMan } from "@/src/features/admin/useAdmin";
import { toast } from "sonner";
import type { AdminDeliveryMan } from "../comPonents/types.admin";
import {
  CheckCircle2,
  XCircle,
  Trash2,
  Eye,
  X,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";

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

function FullViewModal({ item, onClose }: { item: AdminDeliveryMan; onClose: () => void }) {
  const InfoRow = ({ label, value }: { label: string; value: string | number | boolean | null | undefined }) => (
    <div>
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-sm text-gray-800 dark:text-gray-100">{value ?? "-"}</p>
    </div>
  );

  const ImageLinks = () => {
    const images = [
      { label: "Profile Photo", url: item.profilePhoto },
      { label: "Profile Image", url: item.profileImage },
      { label: "Vehicle Image", url: item.vehicleImage },
      { label: "Driving License", url: item.drivingLicenseImage },
      { label: "Registration Certificate", url: item.registrationCertificateImage },
      { label: "Tax Token", url: item.taxTokenImage },
      { label: "Fitness Certificate", url: item.fitnessCertificateImage },
      { label: "Route Permit", url: item.routePermitImage },
      { label: "NID Front", url: item.nidFrontImage },
      { label: "NID Back", url: item.nidBackImage },
      { label: "Vehicle Registration", url: item.vehicleRegistrationImage },
    ].filter((img) => img.url);

    if (images.length === 0) {
      return <span className="text-xs text-gray-400">No images uploaded</span>;
    }

    return (
      <div className="flex flex-wrap gap-2">
        {images.map((img) => (
          <a
            key={img.label}
            href={img.url}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-blue-600 hover:underline"
          >
            {img.label}
          </a>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-6 dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Full Application Details
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X size={20} />
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="sm:col-span-2 lg:col-span-3">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Account Information</p>
            <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <InfoRow label="User ID" value={item.userId} />
              <InfoRow label="Name" value={item.user.name} />
              <InfoRow label="Email" value={item.user.email} />
              <InfoRow label="Status" value={item.status} />
              <InfoRow label="Created At" value={new Date(item.createdAt).toLocaleString()} />
              <InfoRow label="Updated At" value={new Date(item.updatedAt).toLocaleString()} />
            </div>
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Personal Information</p>
            <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <InfoRow label="First Name" value={item.firstName} />
              <InfoRow label="Last Name" value={item.lastName} />
              <InfoRow label="Mobile Number" value={item.mobileNumber} />
              <InfoRow label="Gender" value={item.gender} />
              <InfoRow label="Date of Birth" value={item.dateOfBirth ? new Date(item.dateOfBirth).toLocaleDateString() : "-"} />
            </div>
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Address</p>
            <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <InfoRow label="District" value={item.district} />
              <InfoRow label="Zela / Upazila" value={item.zela} />
              <InfoRow label="Thana" value={item.thana} />
              <InfoRow label="Area" value={item.area} />
              <InfoRow label="City" value={item.city} />
            </div>
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Service Information</p>
            <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <InfoRow label="Service Type" value={item.serviceType} />
              <InfoRow label="Identity Type" value={item.identityType} />
              <InfoRow label="Identity Number" value={item.identityNumber || item.nidNumber} />
              <InfoRow label="Referral Code" value={item.referralCode} />
              <InfoRow label="Service Zones" value={item.serviceZones} />
            </div>
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Vehicle Information</p>
            <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <InfoRow label="Vehicle Type" value={item.vehicleType} />
              <InfoRow label="Brand" value={item.vehicleBrand} />
              <InfoRow label="Model" value={item.vehicleModel} />
              <InfoRow label="Registration Number" value={item.registrationNumber} />
              <InfoRow label="Registration Region" value={item.registrationRegion} />
              <InfoRow label="Registration Category" value={item.registrationCategory} />
              <InfoRow label="Registration Digits" value={item.registrationDigits} />
              <InfoRow label="Vehicle Year" value={item.vehicleYear} />
              <InfoRow label="Driving License Number" value={item.drivingLicenseNumber} />
            </div>
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Tax & Fitness</p>
            <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <InfoRow label="Tax Token Number" value={item.taxTokenNumber} />
              <InfoRow label="Fitness Number" value={item.fitnessNumber} />
            </div>
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Emergency Contact</p>
            <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <InfoRow label="Contact Name" value={item.emergencyContactName} />
              <InfoRow label="Contact Phone" value={item.emergencyContactPhone} />
              <InfoRow label="Relation" value={item.emergencyContactRelation} />
            </div>
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Terms & Privacy</p>
            <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <InfoRow label="Terms Accepted" value={item.termsAccepted ? "Yes" : "No"} />
              <InfoRow label="Privacy Policy Accepted" value={item.privacyPolicyAccepted ? "Yes" : "No"} />
            </div>
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Documents / Images</p>
            <div className="mt-2">
              <ImageLinks />
            </div>
          </div>

          {item.status === "REJECTED" && item.rejectionReason && (
            <div className="sm:col-span-2 lg:col-span-3">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Rejection Reason</p>
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{item.rejectionReason}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RejectModal({ item, onClose, onConfirm }: { item: AdminDeliveryMan; onClose: () => void; onConfirm: (reason: string) => void }) {
  const [reason, setReason] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-gray-900">
        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Reject Application</h3>
        </div>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Please provide a reason for rejecting <strong>{item.user.name}</strong>&apos;s application.
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter rejection reason..."
          className="mb-4 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20"
          rows={4}
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(reason)}
            disabled={!reason.trim()}
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteModal({ item, onClose, onConfirm }: { item: AdminDeliveryMan; onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-gray-900">
        <div className="mb-4 flex items-center gap-2">
          <Trash2 className="h-5 w-5 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Delete Application</h3>
        </div>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Are you sure you want to delete <strong>{item.user.name}</strong>&apos;s application? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDeliveryMenPage() {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const { data, isLoading } = useAdminDeliveryMen(statusFilter, cursor, 10);
  const updateStatus = useUpdateDeliveryManStatus();
  const deleteDeliveryMan = useDeleteDeliveryMan();

  const deliveryMen = data?.items ?? [];

  const [rejectModal, setRejectModal] = useState<AdminDeliveryMan | null>(null);
  const [deleteModal, setDeleteModal] = useState<AdminDeliveryMan | null>(null);
  const [fullViewItem, setFullViewItem] = useState<AdminDeliveryMan | null>(null);

  const handleApprove = (deliveryManId: string) => {
    updateStatus.mutate(
      { deliveryManId, status: "APPROVED" },
      {
        onSuccess: () => toast.success("Delivery man application approved"),
        onError: () => toast.error("Failed to approve application"),
      }
    );
  };

  const handleReject = (deliveryManId: string, reason: string) => {
    updateStatus.mutate(
      { deliveryManId, status: "REJECTED", rejectionReason: reason },
      {
        onSuccess: () => {
          toast.success("Delivery man application rejected");
          setRejectModal(null);
        },
        onError: () => toast.error("Failed to reject application"),
      }
    );
  };

  const handleDelete = (deliveryManId: string) => {
    deleteDeliveryMan.mutate(deliveryManId, {
      onSuccess: () => {
        toast.success("Delivery man application deleted");
        setDeleteModal(null);
      },
      onError: () => toast.error("Failed to delete application"),
    });
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
              setCursor(undefined);
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
      ) : deliveryMen.length === 0 ? (
        <div className="p-8 text-center text-sm text-gray-500 dark:text-gray-400">
          No delivery applications yet. Applications will appear here once users submit the delivery man registration form.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          {deliveryMen.map((item) => (
            <div key={item.id} className="border-b border-gray-50 dark:border-gray-800">
              <div className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-100">{item.user.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.user.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusChip status={item.status} />
                  <button
                    onClick={() => setFullViewItem(item)}
                    className="text-blue-600 hover:text-blue-700"
                    title="Full View"
                  >
                    <Eye size={18} />
                  </button>
                  {item.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="text-emerald-600 hover:text-emerald-700"
                        title="Approve"
                      >
                        <CheckCircle2 size={18} />
                      </button>
                      <button
                        onClick={() => setRejectModal(item)}
                        className="text-amber-600 hover:text-amber-700"
                        title="Reject"
                      >
                        <XCircle size={18} />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setDeleteModal(item)}
                    className="text-red-600 hover:text-red-700"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-800/40">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs">
                  <div>
                    <p className="font-medium text-gray-500 dark:text-gray-400">District / City</p>
                    <p className="text-gray-800 dark:text-gray-100">{item.district}, {item.city}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500 dark:text-gray-400">Zela / Thana / Area</p>
                    <p className="text-gray-800 dark:text-gray-100">{item.zela}, {item.thana}, {item.area}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500 dark:text-gray-400">Service Type</p>
                    <p className="text-gray-800 dark:text-gray-100">{item.serviceType || "-"}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500 dark:text-gray-400">Vehicle</p>
                    <p className="text-gray-800 dark:text-gray-100">{item.vehicleBrand} {item.vehicleModel}</p>
                  </div>
                </div>
                {item.status === "REJECTED" && item.rejectionReason && (
                  <div className="mt-2 rounded-lg border border-red-100 bg-red-50 p-2 text-xs text-red-700 dark:border-red-900 dark:bg-red-900/20 dark:text-red-300">
                    <p className="font-medium">Rejection Reason:</p>
                    <p>{item.rejectionReason}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={() => setCursor(undefined)}
          disabled={!cursor}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm disabled:opacity-40 dark:border-gray-700 dark:text-gray-300"
        >
          First
        </button>
        <button
          onClick={() => (data as any)?.nextCursor && setCursor((data as any).nextCursor)}
          disabled={!(data as any)?.hasMore}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm disabled:opacity-40 dark:border-gray-700 dark:text-gray-300"
        >
          Next
        </button>
      </div>

      {rejectModal && (
        <RejectModal
          item={rejectModal}
          onClose={() => setRejectModal(null)}
          onConfirm={(reason) => handleReject(rejectModal.id, reason)}
        />
      )}

      {deleteModal && (
        <DeleteModal
          item={deleteModal}
          onClose={() => setDeleteModal(null)}
          onConfirm={() => handleDelete(deleteModal.id)}
        />
      )}

      {fullViewItem && (
        <FullViewModal item={fullViewItem} onClose={() => setFullViewItem(null)} />
      )}
    </div>
  );
}
