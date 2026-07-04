import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="max-w-2xl mx-auto p-10 text-center">
      <h1 className="text-3xl font-bold mb-2">Product Not Found</h1>
      <p className="text-gray-500 mb-6">
        The product you are looking for does not exist or has been deleted.
      </p>
      <Link href="/shoP/products" className="text-blue-600 underline">
         View All Products   
      </Link>
    </div>
  );
}
