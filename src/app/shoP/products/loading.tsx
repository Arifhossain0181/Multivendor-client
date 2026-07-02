export default function ProductsLoading() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="h-7 w-40 bg-gray-200 rounded mb-6 animate-pulse" />
 
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-3 animate-pulse">
            <div className="w-full h-40 bg-gray-200 rounded-md mb-2" />
            <div className="h-4 w-3/4 bg-gray-200 rounded mb-1" />
            <div className="h-4 w-1/3 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
 