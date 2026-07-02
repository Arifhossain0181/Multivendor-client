
export default function ProductDetailLoading() {
  return (
    <div className="max-w-4xl mx-auto p-6 grid sm:grid-cols-2 gap-8 animate-pulse">
      <div className="w-full h-80 bg-gray-200 rounded-lg" />
      <div>
        <div className="h-7 w-2/3 bg-gray-200 rounded mb-3" />
        <div className="h-6 w-1/4 bg-gray-200 rounded mb-4" />
        <div className="h-4 w-full bg-gray-200 rounded mb-2" />
        <div className="h-4 w-5/6 bg-gray-200 rounded mb-6" />
        <div className="h-10 w-40 bg-gray-300 rounded" />
      </div>
    </div>
  );
}