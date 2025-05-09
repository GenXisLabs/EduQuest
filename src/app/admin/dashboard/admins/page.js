"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/admin/Layout/DashboardLayout';
import { AuthLoading } from '@/components/admin/Auth/AuthLoading';
import CallBtn from '@/components/common/CallBtn';

function View() {
    const [admins, setAdmins] = useState([]);

    const [newAdmin, setNewAdmin] = useState({
        name: '',
        email: '',
    });

    const loadAdmins = () => {
        fetch('/api/admin/admins')
            .then(response => response.json())
            .then(data => setAdmins(data.data))
            .catch(error => console.error('Error fetching admins:', error));
    }

    useEffect(() => {
        loadAdmins();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-xl font-semibold text-gray-800 mb-6">Add New Admin</h1>
            <div className="mb-6">
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="adminName">Admin Name</label>
                    <input
                        onChange={(e) => {
                            setNewAdmin({
                                ...newAdmin,
                                name: e.target.value
                            });
                        }}
                        type="text"
                        id="adminName"
                        className="border border-gray-300 rounded p-2 w-full"
                        placeholder="Enter admin name"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="adminEmail">Admin Email</label>
                    <input
                        onChange={(e) => {
                            setNewAdmin({
                                ...newAdmin,
                                email: e.target.value
                            });
                        }}
                        type="email"
                        id="adminEmail"
                        className="border border-gray-300 rounded p-2 w-full"
                        placeholder="Enter admin email"
                        required
                    />
                </div>
                <CallBtn
                    callback={(success, _) => {
                        loadAdmins();
                    }}
                    path={"/api/admin/admins"}
                    method="POST"
                    data={newAdmin}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                />
            </div>
            <h1 className="text-xl font-semibold text-gray-800 mb-6">Admins Table</h1>
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border-b">Admin Name</th>
                        <th className="px-4 py-2 border-b">Admin Email</th>
                        <th className="px-4 py-2 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {admins.map(admin => (
                        <tr key={admin.id}>
                            <td className="px-4 py-2 border-b">{admin.name}</td>
                            <td className="px-4 py-2 border-b">{admin.email}</td>
                            <td className="px-4 py-2 border-b">
                                <CallBtn
                                    callback={(success, _) => {
                                        loadAdmins();
                                    }}
                                    path={`/api/admin/admins/${admin.id}`}
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

export default function AdminsPage() {
    return (
        <AuthLoading>
            <DashboardLayout>
                <h1 className="text-3xl font-semibold text-gray-800 mb-6">Admins</h1>
                <View />
            </DashboardLayout>
        </AuthLoading>
    );
}