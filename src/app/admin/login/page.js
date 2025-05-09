"use client";

import LoginForm from "@/components/admin/Auth/LoginForm";
import { AuthLoading, fetchAdminData } from "@/components/admin/Auth/AuthLoading";

export default function LoginPage() {
  return (
    <AuthLoading admin={fetchAdminData()} isLoginPage={true}>
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
        <LoginForm />
      </div>
    </AuthLoading>
  );
}