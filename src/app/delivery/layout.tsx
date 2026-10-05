import DeliverySidebar from "./Sidebar";

export default function DeliveryLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <DeliverySidebar />
      <main className="flex-1 bg-gray-50 dark:bg-gray-950">{children}</main>
    </div>
  );
}
