import DashboardLayout from '@/components/admin/Layout/DashboardLayout';
import UserProfileCard from '@/components/admin/Profile/UserProfileCard';

export default function ProfilePage() {
  // In a real app, you'd fetch user data
  const user = {
    name: 'Current Admin',
    email: 'current.admin@example.com',
    role: 'Super Administrator',
    avatar: 'https://source.unsplash.com/random/150x150/?portrait,user',
    bio: 'Dedicated to managing and enhancing the admin dashboard experience. Always looking for ways to improve efficiency and user satisfaction.',
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">User Profile</h1>
      <UserProfileCard user={user} />
      {/* You could add forms for editing profile details here */}
    </DashboardLayout>
  );
}