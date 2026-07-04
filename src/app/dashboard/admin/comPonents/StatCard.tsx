import { LucideIcon } from "lucide-react";

export default function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <Icon size={18} className="text-[#0A1F44] dark:text-cyan-400" />
      </div>
      <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-50">
        {value}
      </p>
    </div>
  );
}