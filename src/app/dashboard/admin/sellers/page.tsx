"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { toast } from "sonner";
import { useAdminSellerApplications, useUpdateSellerStatus } from "../../../../features/admin/useAdmin";
import { SellerStatus } from "../comPonents/types.admin";

type SellerApplication = {
  id: string;
  userId: string;
  shopName: string;
  description: string;
  status: SellerStatus;
  createdAt: string;
  updatedAt: string;
  user: { id: string; name: string; email: string; role: string; isActive: boolean };
};

const filters: Array<{ label: string; value?: string }> = [
  { label: "All applications" },
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
];

export default function AdminSellersPage() {
  const [status, setStatus] = useState<string | undefined>();
  const [selected, setSelected] = useState<SellerApplication | null>(null);
  const { data, isLoading, isError, error } = useAdminSellerApplications(status);
  const updateStatus = useUpdateSellerStatus();
  const applications: SellerApplication[] = data ?? [];

  const changeStatus = (application: SellerApplication, next: SellerStatus) => {
    updateStatus.mutate({ userId: application.userId, status: next }, {
      onSuccess: () => {
        toast.success(`Seller application ${next.toLowerCase()}`);
        if (selected?.id === application.id) setSelected({ ...selected, status: next });
      },
      onError: () => toast.error("Could not update seller application"),
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Seller Applications</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Review seller profiles, see applicant contact details, and approve or reject applications.</p>
      </div>

      <div className="mb-5 flex flex-wrap gap-2 border-b border-gray-100 dark:border-gray-800">
        {filters.map((filter) => (
          <button key={filter.label} onClick={() => setStatus(filter.value)} className={`px-4 py-2 text-sm font-medium ${status === filter.value ? "border-b-2 border-[#0A1F44] text-[#0A1F44] dark:border-cyan-400 dark:text-cyan-400" : "text-gray-500 dark:text-gray-400"}`}>
            {filter.label}
          </button>
        ))}
      </div>

      {isLoading ? <div className="h-72 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-900" /> : isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">Could not load seller applications. {error instanceof Error ? error.message : "Please try again."}</div>
      ) : applications.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 p-10 text-center text-sm text-gray-500 dark:border-gray-700">No seller applications found.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 text-gray-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400">
              <tr><th className="px-4 py-3">Applicant</th><th className="px-4 py-3">Shop</th><th className="px-4 py-3">Applied</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th></tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr key={application.id} className="border-b border-gray-50 dark:border-gray-800">
                  <td className="px-4 py-3"><p className="font-medium text-gray-800 dark:text-gray-100">{application.user.name}</p><a className="text-xs text-blue-600 hover:underline" href={`mailto:${application.user.email}`}>{application.user.email}</a></td>
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-200">{application.shopName}</td>
                  <td className="px-4 py-3 text-gray-500">{new Date(application.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3"><span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">{application.status}</span></td>
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><button onClick={() => setSelected(application)} className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1.5 text-xs dark:border-gray-700"><Eye size={14} /> View</button>{application.status === "PENDING" && <><button disabled={updateStatus.isPending} onClick={() => changeStatus(application, "APPROVED")} className="rounded-md bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-700 disabled:opacity-50 dark:bg-emerald-900/30 dark:text-emerald-300">Approve</button><button disabled={updateStatus.isPending} onClick={() => changeStatus(application, "REJECTED")} className="rounded-md bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700 disabled:opacity-50 dark:bg-red-900/30 dark:text-red-300">Reject</button></>}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
        <section role="dialog" aria-modal="true" aria-labelledby="seller-details-title" className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
          <div className="mb-5 flex items-start justify-between gap-4"><div><h2 id="seller-details-title" className="text-xl font-bold text-gray-900 dark:text-gray-50">Seller Application</h2><p className="mt-1 text-sm text-gray-500">{selected.status} · Applied {new Date(selected.createdAt).toLocaleString()}</p></div><button onClick={() => setSelected(null)} className="rounded-lg border px-3 py-1.5 text-sm dark:border-gray-700">Close</button></div>
          <div className="grid gap-4 sm:grid-cols-2"><div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800"><p className="text-xs text-gray-500">Applicant name</p><p className="mt-1 font-medium">{selected.user.name}</p></div><div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800"><p className="text-xs text-gray-500">Email</p><a className="mt-1 block font-medium text-blue-600 hover:underline" href={`mailto:${selected.user.email}`}>{selected.user.email}</a></div><div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800"><p className="text-xs text-gray-500">Shop name</p><p className="mt-1 font-medium">{selected.shopName}</p></div><div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800"><p className="text-xs text-gray-500">Application status</p><p className="mt-1 font-medium">{selected.status}</p></div><div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800 sm:col-span-2"><p className="text-xs text-gray-500">Shop description</p><p className="mt-1 whitespace-pre-wrap text-sm">{selected.description || "No description provided."}</p></div></div>
          {selected.status === "PENDING" && <div className="mt-6 flex justify-end gap-2"><button disabled={updateStatus.isPending} onClick={() => changeStatus(selected, "REJECTED")} className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 disabled:opacity-50">Reject</button><button disabled={updateStatus.isPending} onClick={() => changeStatus(selected, "APPROVED")} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">Approve seller</button></div>}
        </section>
      </div>}
    </div>
  );
}
