"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/admin/Layout/DashboardLayout';
import { AuthLoading } from '@/components/admin/Auth/AuthLoading';
import CallBtn from '@/components/common/CallBtn';
import { useRouter } from 'next/navigation';

function View() {
    const [papers, setPapers] = useState([]);
    const [batches, setBatches] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newPaper, setNewPaper] = useState({
        name: '',
        batchId: -1,
        duration: 0,
        password: '',
        metadata: JSON.stringify({
            shuffleRange: {
                from: -1,
                to: -1,
            }
        })
    });

    const router = useRouter();

    const loadPapers = () => {
        fetch('/api/admin/papers')
            .then(response => response.json())
            .then(data => setPapers(data.data))
            .catch(error => console.error('Error fetching papers:', error));
    };

    const loadBatches = () => {
        fetch('/api/admin/batches')
            .then(response => response.json())
            .then(data => setBatches(data.data))
            .catch(error => console.error('Error fetching batches:', error));
    };

    const getBatchName = (batchId) => {
        const batch = batches.find(b => b.id === batchId);
        return batch ? batch.name : 'Unknown';
    };

    const openModal = (paper = null) => {
        if (paper) {
            setIsEditing(true);
            setNewPaper({
                ...paper,
            });
        } else {
            setIsEditing(false);
            setNewPaper({
                name: '',
                batchId: -1,
                duration: 0,
                password: '',
                metadata: JSON.stringify({
                    shuffleRange: {
                        from: -1,
                        to: -1,
                    }
                })
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        loadPapers();
        loadBatches();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-xl font-semibold text-gray-800 mb-6">Papers</h1>
            <button
                onClick={() => openModal()}
                className="bg-green-500 text-white px-4 py-2 rounded mb-4"
            >
                Add New Paper
            </button>
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border-b">Name</th>
                        <th className="px-4 py-2 border-b">Batch</th>
                        <th className="px-4 py-2 border-b">Duration</th>
                        <th className="px-4 py-2 border-b">Created At</th>
                        <th className="px-4 py-2 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {papers.map(paper => (
                        <tr key={paper.id}>
                            <td className="px-4 py-2 border-b">{paper.name}</td>
                            <td className="px-4 py-2 border-b">{getBatchName(paper.batchId)}</td>
                            <td className="px-4 py-2 border-b">{paper.duration}</td>
                            <td className="px-4 py-2 border-b">
                                <div>
                                    {new Date(paper.createdAt).toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true
                                    })}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {new Date(paper.createdAt).toDateString()}
                                </div>
                            </td>
                            <td className="px-4 py-2 border-b">
                                <button
                                    onClick={() => openModal(paper)}
                                    className="bg-yellow-500 text-white px-4 py-1 rounded mr-2"
                                >
                                    Update
                                </button>
                                <CallBtn
                                    callback={(success, _) => {
                                        loadPapers();
                                    }}
                                    path={`/api/admin/papers/${paper.id}`}
                                    method="DELETE"
                                    className="bg-red-300 text-black px-4 py-1 rounded"
                                    text='Delete'
                                    confirmation={true}
                                />
                                <CallBtn
                                    callback={(success, _) => {
                                        loadPapers();
                                    }}
                                    path={`/api/admin/papers/${paper.id}`}
                                    method="PUT"
                                    data={{ isActive: !paper.isActive }}
                                    className={`px-4 py-1 rounded ${paper.isActive ? 'bg-gray-400 text-black' : 'bg-green-400 text-white'}`}
                                    text={paper.isActive ? 'Deactivate' : 'Activate'}
                                    confirmation={true}
                                />
                                <button
                                    onClick={() => router.push(`/admin/dashboard/papers/${paper.id}`)}
                                    className="bg-blue-500 text-white px-4 py-1 rounded"
                                >
                                    Quiz
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h2 className="text-lg font-semibold mb-4">
                            {isEditing ? 'Update Paper' : 'Add New Paper'}
                        </h2>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="paperName">Paper Name</label>
                            <input
                                onChange={(e) => {
                                    setNewPaper({
                                        ...newPaper,
                                        name: e.target.value
                                    });
                                }}
                                value={newPaper.name}
                                type="text"
                                id="paperName"
                                className="border border-gray-300 rounded p-2 w-full"
                                placeholder="Enter paper name"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="batchSelect">Batch</label>
                            <select
                                onChange={(e) => {
                                    setNewPaper({
                                        ...newPaper,
                                        batchId: parseInt(e.target.value)
                                    });
                                }}
                                value={newPaper.batchId}
                                id="batchSelect"
                                className="border border-gray-300 rounded p-2 w-full"
                                required
                            >
                                <option value="">Select a batch</option>
                                {batches.map(batch => (
                                    <option key={batch.id} value={batch.id}>
                                        {batch.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="duration">Duration (in seconds)</label>
                            <input
                                onChange={(e) => {
                                    setNewPaper({
                                        ...newPaper,
                                        duration: parseInt(e.target.value)
                                    });
                                }}
                                value={newPaper.duration}
                                type="number"
                                id="duration"
                                className="border border-gray-300 rounded p-2 w-full"
                                placeholder="Enter duration in seconds"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
                            <input
                                onChange={(e) => {
                                    setNewPaper({
                                        ...newPaper,
                                        password: e.target.value
                                    });
                                }}
                                value={newPaper.password}
                                type="text"
                                id="password"
                                className="border border-gray-300 rounded p-2 w-full"
                                placeholder="Enter password"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="shuffleFrom">Shuffle Range From</label>
                            <input
                                onChange={(e) => {
                                    setNewPaper({
                                        ...newPaper,
                                        metadata: JSON.stringify({
                                            ...JSON.parse(newPaper.metadata || '{}'),
                                            shuffleRange: {
                                                ...JSON.parse(newPaper.metadata || '{}').shuffleRange,
                                                from: parseInt(e.target.value)
                                            }
                                        })
                                    });
                                }}
                                value={JSON.parse(newPaper.metadata || '{}').shuffleRange.from}
                                type="number"
                                id="shuffleFrom"
                                className="border border-gray-300 rounded p-2 w-full"
                                placeholder="Enter starting range"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="shuffleTo">Shuffle Range To</label>
                            <input
                                onChange={(e) => {
                                    setNewPaper({
                                        ...newPaper,
                                        metadata: JSON.stringify({
                                            ...JSON.parse(newPaper.metadata || '{}'),
                                            shuffleRange: {
                                                ...JSON.parse(newPaper.metadata || '{}').shuffleRange,
                                                to: parseInt(e.target.value)
                                            }
                                        })
                                    });
                                }}
                                value={JSON.parse(newPaper.metadata || '{}').shuffleRange.to}
                                type="number"
                                id="shuffleTo"
                                className="border border-gray-300 rounded p-2 w-full"
                                placeholder="Enter ending range"
                                required
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={closeModal}
                                className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
                            >
                                Cancel
                            </button>
                            <CallBtn
                                callback={(success, _) => {
                                    loadPapers();
                                    closeModal();
                                }}
                                path={isEditing ? `/api/admin/papers/${newPaper.id}` : "/api/admin/papers"}
                                method={isEditing ? "PUT" : "POST"}
                                data={newPaper}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                text={isEditing ? 'Update' : 'Add'}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function PapersPage() {
    return (
        <AuthLoading>
            <DashboardLayout>
                <h1 className="text-3xl font-semibold text-gray-800 mb-6">Papers</h1>
                <View />
            </DashboardLayout>
        </AuthLoading>
    );
}
