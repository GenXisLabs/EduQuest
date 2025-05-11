"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/admin/Layout/DashboardLayout';
import { AuthLoading } from '@/components/admin/Auth/AuthLoading';
import CallBtn from '@/components/common/CallBtn';
import { useRouter } from 'next/navigation';

function View() {
    const [marksheetOverview, setMarksheetOverview] = useState([]);

    const router = useRouter();

    const loadMarksheets = () => {
        fetch('/api/admin/marksheets')
            .then(response => response.json())
            .then(data => setMarksheetOverview(data.data))
            .catch(error => console.error('Error fetching marksheets:', error));
    };

    useEffect(() => {
        loadMarksheets();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-xl font-semibold text-gray-800 mb-6">(Only shows inactive papers)</h1>
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border-b">ID</th>
                        <th className="px-4 py-2 border-b">Name</th>
                        <th className="px-4 py-2 border-b">Batch</th>
                        <th className="px-4 py-2 border-b">Processed</th>
                        <th className="px-4 py-2 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {marksheetOverview.map(marksheet => (
                        <tr key={marksheet.id}>
                            <td className="px-4 py-2 border-b">{marksheet.id}</td>
                            <td className="px-4 py-2 border-b">{marksheet.name}</td>
                            <td className="px-4 py-2 border-b">{marksheet.batch.name}</td>
                            <td className="px-4 py-2 border-b">
                                {marksheet.isProcessed ? (
                                    <span className="text-sm font-medium px-2 py-1 rounded bg-green-200 text-green-800">
                                        Processed
                                    </span>
                                ) : (
                                    <span className="text-sm font-medium px-2 py-1 rounded bg-red-200 text-red-800">
                                        Not Processed
                                    </span>
                                )}
                            </td>
                            <td className="px-4 py-2 border-b">
                                {marksheet.bgWorkerStatus === 'running' && (
                                    <div className='flex flex-col'>
                                        <span className="text-sm font-medium px-2 py-1 rounded bg-yellow-200 text-yellow-800">
                                            Processing...
                                        </span>
                                        <small className="text-gray-500">Refresh in a few minutes</small>
                                    </div>
                                )}

                                {marksheet.bgWorkerStatus !== 'running' && (
                                    <div className='flex flex-row gap-2'>
                                        <button
                                            onClick={() => router.push(`/admin/dashboard/marksheets/${marksheet.id}`)}
                                            className="bg-blue-500 text-white px-4 py-1 rounded"
                                        >
                                            View
                                        </button>
                                        <CallBtn
                                            callback={(success, _) => {
                                                if (success) {
                                                    loadMarksheets();
                                                }
                                            }}
                                            path={`/api/admin/marksheets/startprocess`}
                                            method={"POST"}
                                            data={{
                                                paperId: marksheet.id,
                                            }}
                                            className="text-sm font-medium px-2 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600"
                                            text={marksheet.isProcessed ? 'Reprocess' : 'Process'}
                                        />
                                    </div>
                                )}

                                {marksheet.bgWorkerStatus === 'failed' && (
                                    <span className="text-sm font-medium px-2 py-1 rounded bg-red-200 text-red-800">
                                        Last Processing Failed. Try again.
                                    </span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default function MarksheetsPage() {
    return (
        <AuthLoading>
            <DashboardLayout>
                <h1 className="text-3xl font-semibold text-gray-800 mb-6">Marksheets</h1>
                <View />
            </DashboardLayout>
        </AuthLoading>
    );
}
