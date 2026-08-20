import { notFound } from "next/navigation";

export default function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  void params;

  return notFound();
}
