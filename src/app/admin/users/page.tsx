export { default } from "../../dashboard/admin/user/Page";
"use client";

import { useMemo, useState } from "react";
import { Users, Store, ShieldCheck, Search } from "lucide-react";

import UserRow from "../../dashboard/admin/comPonets/UserRow";
import { useAdminUsers } from "../../../features/admin/useAdmin";
import type { UserRole } from "../../dashboard/admin/comPonets/tyPes";

const FILTERS: Array<{ label: string; value: "ALL" | UserRole }> = [
	{ label: "All", value: "ALL" },
	{ label: "Customers", value: "CUSTOMER" },
	{ label: "Sellers", value: "SELLER" },
	{ label: "Admins", value: "ADMIN" },
];

function LoadingState() {
	return (
		<div className="space-y-4">
			<div className="h-8 w-56 rounded bg-gray-200 dark:bg-gray-800" />
			<div className="h-12 rounded-xl bg-gray-100 dark:bg-gray-900" />
			<div className="h-96 rounded-xl bg-gray-100 dark:bg-gray-900" />
		</div>
	);
}

export default function AdminUsersPage() {
	const [filter, setFilter] = useState<"ALL" | UserRole>("ALL");
	const { data, isLoading, isError } = useAdminUsers(filter === "ALL" ? undefined : filter, 1);

	const users = data?.items ?? [];

	const summary = useMemo(() => {
		return {
			total: users.length,
			sellers: users.filter((user) => user.role === "SELLER").length,
			pending: users.filter((user) => user.role === "SELLER" && user.sellerStatus === "PENDING").length,
			admins: users.filter((user) => user.role === "ADMIN").length,
		};
	}, [users]);

	if (isLoading) return <LoadingState />;

	if (isError) {
		return (
			<div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300">
				Failed to load users. Please try again.
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
				<div>
					<p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
						Admin Management
					</p>
					<h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-50">
						Users & Sellers
					</h1>
					<p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
						Review customers, sellers, and seller approval status from one place.
					</p>
				</div>

				<div className="flex flex-wrap gap-2">
					{FILTERS.map((item) => (
						<button
							key={item.value}
							onClick={() => setFilter(item.value)}
							className={`rounded-full px-4 py-2 text-sm font-medium transition ${
								filter === item.value
									? "bg-[#0A1F44] text-white dark:bg-cyan-600"
									: "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
							}`}
						>
							{item.label}
						</button>
					))}
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				<div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
					<div className="flex items-center justify-between">
						<p className="text-sm text-gray-500 dark:text-gray-400">Users shown</p>
						<Users size={18} className="text-[#0A1F44] dark:text-cyan-400" />
					</div>
					<p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-50">{summary.total}</p>
				</div>
				<div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
					<div className="flex items-center justify-between">
						<p className="text-sm text-gray-500 dark:text-gray-400">Sellers</p>
						<Store size={18} className="text-[#0A1F44] dark:text-cyan-400" />
					</div>
					<p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-50">{summary.sellers}</p>
				</div>
				<div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
					<div className="flex items-center justify-between">
						<p className="text-sm text-gray-500 dark:text-gray-400">Pending approvals</p>
						<Search size={18} className="text-[#0A1F44] dark:text-cyan-400" />
					</div>
					<p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-50">{summary.pending}</p>
				</div>
				<div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
					<div className="flex items-center justify-between">
						<p className="text-sm text-gray-500 dark:text-gray-400">Admins</p>
						<ShieldCheck size={18} className="text-[#0A1F44] dark:text-cyan-400" />
					</div>
					<p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-50">{summary.admins}</p>
				</div>
			</div>

			<div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
				<div className="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
					<h2 className="text-base font-semibold text-gray-900 dark:text-gray-50">All users</h2>
				</div>
				{users.length === 0 ? (
					<div className="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
						No users found for this filter.
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
							<thead className="bg-gray-50 dark:bg-gray-950/60">
								<tr className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
									<th className="px-4 py-3">User</th>
									<th className="px-4 py-3">Role</th>
									<th className="px-4 py-3">Seller status</th>
									<th className="px-4 py-3">Created</th>
								</tr>
							</thead>
							<tbody>
								{users.map((user) => (
									<UserRow key={user.id} user={user} />
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
}
