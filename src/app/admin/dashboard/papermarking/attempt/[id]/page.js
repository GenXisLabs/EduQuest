"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/admin/Layout/DashboardLayout';
import { AuthLoading } from '@/components/admin/Auth/AuthLoading';
import { useRouter } from 'next/navigation';

function View({ attemptId }) {
    if (!attemptId) {
        return <div className="text-red-500">Waiting for ID...</div>;
    }

    const [attempts, setAttempts] = useState([]);
    const router = useRouter();

    const loadAttempts = () => {
        fetch(`/api/admin/papermarking/attempt/${attemptId}`)
            .then(response => response.json())
            .then(data => setAttempts(data.attempts))
            .catch(error => console.error('Error fetching attempts:', error));
    };

    useEffect(() => {
        if (attemptId) {
            loadAttempts();
        }
    }, [attemptId]);

    return (
        <div className="p-4">
            <h1 className="text-xl font-semibold text-gray-800 mb-6">Attempts for Paper {attemptId}</h1>
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border-b">Student ID</th>
                        <th className="px-4 py-2 border-b">Markes Processed</th>
                        <th className="px-4 py-2 border-b">#Unmarked Essays</th>
                        <th className="px-4 py-2 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {attempts.length > 0 ? (
                        attempts.map(attempt => (
                            <tr key={attempt.id}>
                                <td className="px-4 py-2 border-b">{attempt.student.studentId}</td>
                                <td className="px-4 py-2 border-b">
                                    {attempt.isProcessed ? (
                                        <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                            Yes
                                        </span>
                                    ) : (
                                        <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                            No
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-2 border-b">
                                    {attempt.unmarkedEssayCount > 0 ? (
                                        <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                            {attempt.unmarkedEssayCount}
                                        </span>
                                    ) : (
                                        <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                            0
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-2 border-b">
                                    <button
                                        onClick={() => router.push(`/admin/dashboard/papermarking/attempt/${attempt.id}`)}
                                        className="bg-blue-500 text-white px-4 py-1 rounded"
                                    >
                                        View Essays
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="px-4 py-2 text-center text-gray-500">
                                No attempts found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default function PaperAttemptEssaysPage({ params }) {
    const [attemptId, setAttemptId] = useState(null);
    const getAttemptId = async () => {
        const { id, sid } = await params;
        setAttemptId(id);
    }

    useEffect(() => {
        getAttemptId();
    }, []);

    return (
        <AuthLoading>
            <DashboardLayout>
                <button
                    onClick={() => window.history.back()}
                    className="bg-gray-500 text-white px-4 py-2 rounded mb-4"
                >
                    Go Back
                </button>
                <h1 className="text-3xl font-semibold text-gray-800 mb-6">Attempt & Essay Questions</h1>
                <View attemptId={attemptId} />
            </DashboardLayout>
        </AuthLoading>
    );
}
