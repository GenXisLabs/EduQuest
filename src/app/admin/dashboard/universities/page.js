"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/admin/Layout/DashboardLayout';
import { AuthLoading } from '@/components/admin/Auth/AuthLoading';
import CallBtn from '@/components/common/CallBtn';

function View() {
    const [universities, setUniversities] = useState([]);

    const [newUniversity, setNewUniversity] = useState({
        name: '',
    });

    const loadUniversities = () => {
        fetch('/api/admin/universities')
            .then(response => response.json())
            .then(data => setUniversities(data.data))
            .catch(error => console.error('Error fetching universities:', error));
    }

    useEffect(() => {
        loadUniversities();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-xl font-semibold text-gray-800 mb-6">Add New</h1>
            <div className="mb-6">
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="universityName">University Name</label>
                    <input
                        onChange={(e) => {
                            setNewUniversity({
                                ...newUniversity,
                                name: e.target.value
                            });
                        }}
                        type="text"
                        id="universityName"
                        className="border border-gray-300 rounded p-2 w-full"
                        placeholder="Enter university name"
                        required
                    />
                </div>
                <CallBtn
                    callback={(success, _) => {
                        loadUniversities();
                    }}
                    path={"/api/admin/universities"}
                    method="POST"
                    data={newUniversity}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                />
            </div>
            <h1 className="text-xl font-semibold text-gray-800 mb-6">Table</h1>
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border-b">University Name</th>
                        <th className="px-4 py-2 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {universities.map(university => (
                        <tr key={university.id}>
                            <td className="px-4 py-2 border-b">{university.name}</td>
                            <td className="px-4 py-2 border-b">
                                <CallBtn
                                    callback={(success, _) => {
                                        loadUniversities();
                                    }}
                                    path={`/api/admin/universities/${university.id}`}
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

export default function UniversitiesPage() {
    return (
        <AuthLoading>
            <DashboardLayout>
                <h1 className="text-3xl font-semibold text-gray-800 mb-6">Universities</h1>
                <View />
            </DashboardLayout>
        </AuthLoading>
    );
}