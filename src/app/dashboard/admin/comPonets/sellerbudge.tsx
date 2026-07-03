import { SellerStatus } from "./tyPes";

const styles: Record<SellerStatus, string> = {
  PENDING: "bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
  APPROVED: "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  REJECTED: "bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-400",
  SUSPENDED: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
};

export default function SellerStatusBadge({ status }: { status: SellerStatus }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}