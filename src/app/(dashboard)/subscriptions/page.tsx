import SubscriptionManagement from "./SubscriptionManagement";

export const metadata = {
  title: "Subscription Management | Library SMS",
  description: "Manage library subscriptions, renewals, and seat transfers.",
};

export default function SubscriptionPage() {
  return (
    <main className="min-h-screen bg-gray-50/50">
      <SubscriptionManagement />
    </main>
  );
}
