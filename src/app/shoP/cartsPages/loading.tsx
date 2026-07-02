export default function CartLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 h-7 w-40 animate-pulse rounded bg-gray-200" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-xl bg-gray-100"
            />
          ))}
        </div>
        <div className="h-52 animate-pulse rounded-xl bg-gray-100 lg:col-span-1" />
      </div>
    </div>
  );
}