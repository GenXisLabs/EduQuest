"use client";

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/admin/Layout/DashboardLayout';
import Card from '@/components/admin/UI/Card';
import { AuthLoading } from '@/components/admin/Auth/AuthLoading';
import Image from 'next/image';

export default function DashboardPage() {
  const [data, setData] = useState({
    totalStudents: 0,
    totalPapers: 0,
    activePapers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/admin/dashoverview');
        const result = await response.json();
        setData({
          totalStudents: result.data.totalStudents || 0,
          totalPapers: result.data.totalPapers || 0,
          activePapers: result.data.activePapers || 0,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <AuthLoading>
      <DashboardLayout>
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Dashboard Overview</h1>
        {loading ? (
          <div className="flex min-h-screen">
            <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 animate-pulse"></div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card title="Total Students">
              <p className="text-4xl font-bold text-blue-600">{data.totalStudents}</p>
            </Card>
            <Card title="Total Papers">
              <p className="text-4xl font-bold text-green-600">{data.totalPapers}</p>
            </Card>
            <Card title="Active Papers">
              <p className="text-4xl font-bold text-yellow-500">{data.activePapers}</p>
            </Card>
          </div>
        )}
        <div className="fixed bottom-4 right-4 bg-white p-2 shadow-lg">
          <Image
            src="/genxis.png"
            alt="Logo"
            width={100}
            height={50}
          />
          <p className="text-sm text-gray-500">Powered by GenXis Labs © 2025</p>
        </div>
      </DashboardLayout>
    </AuthLoading>
  );
}