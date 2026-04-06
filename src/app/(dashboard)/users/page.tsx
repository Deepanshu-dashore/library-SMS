import UserManagement from "./UserManagement";

export const metadata = {
  title: "User Management | Library SMS",
  description: "Manage library users, members and staff.",
};

export default function UsersPage() {
  return (
    <main className="min-h-screen bg-gray-50/50">
      <UserManagement />
    </main>
  );
}
