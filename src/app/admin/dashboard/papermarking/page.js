"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/admin/Layout/DashboardLayout';
import { AuthLoading } from '@/components/admin/Auth/AuthLoading';
import CallBtn from '@/components/common/CallBtn';
import { useRouter } from 'next/navigation';

function View() {
    const [paperMarkingOverview, setPaperMarkingOverview] = useState([]);

    const router = useRouter();

    const loadPaperMarking = () => {
        fetch('/api/admin/papermarking')
            .then(response => response.json())
            .then(data => setPaperMarkingOverview(data.data))
            .catch(error => console.error('Error fetching paper marking:', error));
    };

    useEffect(() => {
        loadPaperMarking();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-xl font-semibold text-gray-800 mb-6">Papers (Only shows inactive papers)</h1>
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border-b">ID</th>
                        <th className="px-4 py-2 border-b">Name</th>
                        <th className="px-4 py-2 border-b">Batch</th>
                        <th className="px-4 py-2 border-b">Number of Attempts</th>
                        <th className="px-4 py-2 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paperMarkingOverview.map(paperdata => (
                        <tr key={paperdata.id}>
                            <td className="px-4 py-2 border-b">{paperdata.id}</td>
                            <td className="px-4 py-2 border-b">{paperdata.name}</td>
                            <td className="px-4 py-2 border-b">{paperdata.batch.name}</td>
                            <td className="px-4 py-2 border-b">
                                <span
                                    className={`text-sm font-medium px-2 py-1 rounded ${
                                        paperdata._count.quizAttempts > 0
                                            ? 'bg-green-200 text-green-800'
                                            : 'bg-red-200 text-red-800'
                                    }`}
                                >
                                    {paperdata._count.quizAttempts}
                                </span>
                            </td>
                            <td className="px-4 py-2 border-b">
                                {paperdata._count.quizAttempts > 0 && (
                                    <button
                                        onClick={() => router.push(`/admin/dashboard/papermarking/${paperdata.id}`)}
                                        className="bg-blue-500 text-white px-4 py-1 rounded"
                                    >
                                        View Attempts
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default function PapersPage() {
    return (
        <AuthLoading>
            <DashboardLayout>
                <h1 className="text-3xl font-semibold text-gray-800 mb-6">Paper Marking</h1>
                <View />
            </DashboardLayout>
        </AuthLoading>
    );
}
