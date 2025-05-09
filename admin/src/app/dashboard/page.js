import DashboardLayout from '@/components/Layout/DashboardLayout';
import Card from '@/components/UI/Card';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Total Users">
          <p className="text-4xl font-bold text-blue-600">1,234</p>
          <p className="text-sm text-gray-500 mt-1">+5% from last month</p>
        </Card>
        <Card title="Revenue">
          <p className="text-4xl font-bold text-green-600">$56,789</p>
          <p className="text-sm text-gray-500 mt-1">+12% from last month</p>
        </Card>
        <Card title="New Orders">
          <p className="text-4xl font-bold text-yellow-500">345</p>
          <p className="text-sm text-gray-500 mt-1">-2% from last month</p>
        </Card>
      </div>
      {/* Add more content here */}
      <div className="mt-8">
        <Card title="Recent Activity">
          <ul className="space-y-2">
            <li className="text-gray-700">User John Doe signed up.</li>
            <li className="text-gray-700">Order #12345 processed.</li>
            <li className="text-gray-700">User Jane Smith updated profile.</li>
          </ul>
        </Card>
      </div>
    </DashboardLayout>
  );
}