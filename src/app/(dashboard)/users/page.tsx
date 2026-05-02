import UserManagement from "./UserManagement";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: "Member Management | Library SMS",
  description: "Manage library users, members and staff.",
};

export default function UsersPage() {
  return (
    <main className="min-h-screen bg-gray-50/50">
      <UserManagement />
    </main>
  );
}
