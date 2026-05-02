import PaymentManagement from "./PaymentManagement";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: "Payment Records | Library SMS",
  description: "View and manage library membership payment records.",
};

export default function PaymentsPage() {
  return (
    <main className="min-h-screen bg-gray-50/50">
      <PaymentManagement />
    </main>
  );
}
