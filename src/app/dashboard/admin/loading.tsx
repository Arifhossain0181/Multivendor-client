export default function AdminDashboardLoading() {
  return (
    <div>
      <div className="mb-6 h-7 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-900"
          />
        ))}
      </div>
    </div>
  );
}