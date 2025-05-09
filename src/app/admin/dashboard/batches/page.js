"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/admin/Layout/DashboardLayout';
import { AuthLoading } from '@/components/admin/Auth/AuthLoading';
import CallBtn from '@/components/common/CallBtn';

function View() {
    const [batches, setBatches] = useState([]);

    const [newBatch, setNewBatch] = useState({
        name: '',
    });

    const loadBatches = () => {
        fetch('/api/admin/batches')
            .then(response => response.json())
            .then(data => setBatches(data.data))
            .catch(error => console.error('Error fetching batches:', error));
    }

    useEffect(() => {
        loadBatches();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-xl font-semibold text-gray-800 mb-6">Add New</h1>
            <div className="mb-6">
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="batchName">Batch Name</label>
                    <input
                        onChange={(e) => {
                            setNewBatch({
                                ...newBatch,
                                name: e.target.value
                            });
                        }}
                        type="text"
                        id="batchName"
                        className="border border-gray-300 rounded p-2 w-full"
                        placeholder="Enter batch name"
                        required
                    />
                </div>
                <CallBtn
                    callback={(sucess, _) => {
                        loadBatches();
                    }}
                    path={"/api/admin/batches"}
                    method="POST"
                    data={newBatch}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                />
            </div>
            <h1 className="text-xl font-semibold text-gray-800 mb-6">Table</h1>
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border-b">Batch Name</th>
                        <th className="px-4 py-2 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {batches.map(batch => (
                        <tr key={batch.id}>
                            <td className="px-4 py-2 border-b">{batch.name}</td>
                            <td className="px-4 py-2 border-b">
                                <CallBtn
                                    callback={(sucess, _) => {
                                        loadBatches();
                                    }}
                                    path={`/api/admin/batches/${batch.id}`}
                                    method="DELETE"
                                    className="bg-red-300 text-black px-4 py-1 rounded"
                                    text='Delete'
                                    confirmation={true}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

}

export default function BatchesPage() {
    return (
        <AuthLoading>
            <DashboardLayout>
                <h1 className="text-3xl font-semibold text-gray-800 mb-6">Batches</h1>
                <View />
            </DashboardLayout>
        </AuthLoading>
    );
}