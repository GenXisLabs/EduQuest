"use client";

import DashboardLayout from '@/components/admin/Layout/DashboardLayout';
import UserProfileCard from '@/components/admin/Profile/UserProfileCard';
import { AuthLoading } from '@/components/admin/Auth/AuthLoading';

export default function ProfilePage() {
  return (
    <AuthLoading>
      <DashboardLayout>
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">User Profile</h1>
        <UserProfileCard />
        {/* You could add forms for editing profile details here */}
      </DashboardLayout>
    </AuthLoading>
  );
}