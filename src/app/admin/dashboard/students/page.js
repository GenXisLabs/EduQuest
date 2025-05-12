"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/admin/Layout/DashboardLayout';
import { AuthLoading } from '@/components/admin/Auth/AuthLoading';
import CallBtn from '@/components/common/CallBtn';

function View() {
    const [students, setStudents] = useState([]);
    const [universities, setUniversities] = useState([]);
    const [batches, setBatches] = useState([]);

    const [newStudent, setNewStudent] = useState({
        studentId: '',
        universityId: -1,
        batchId: -1,
        name: '',
    });

    const loadStudents = () => {
        fetch('/api/admin/students')
            .then(response => response.json())
            .then(data => setStudents(data.data))
            .catch(error => console.error('Error fetching students:', error));
    };

    const loadUniversities = () => {
        fetch('/api/admin/universities')
            .then(response => response.json())
            .then(data => setUniversities(data.data))
            .catch(error => console.error('Error fetching universities:', error));
    };

    const loadBatches = () => {
        fetch('/api/admin/batches')
            .then(response => response.json())
            .then(data => setBatches(data.data))
            .catch(error => console.error('Error fetching batches:', error));
    };

    const getUniversityName = (universityId) => {
        const university = universities.find(u => u.id === universityId);
        return university ? university.name : 'Unknown';
    }

    const getBatchName = (batchId) => {
        const batch = batches.find(b => b.id === batchId);
        return batch ? batch.name : 'Unknown';
    }

    useEffect(() => {
        loadStudents();
        loadUniversities();
        loadBatches();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-xl font-semibold text-gray-800 mb-6">Add New Student</h1>
            <div className="mb-6">
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="studentId">Student ID</label>
                    <input
                        onChange={(e) => {
                            setNewStudent({
                                ...newStudent,
                                studentId: e.target.value
                            });
                        }}
                        type="text"
                        id="studentId"
                        className="border border-gray-300 rounded p-2 w-full"
                        placeholder="Enter student ID"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="studentName">Student Name</label>
                    <input
                        onChange={(e) => {
                            setNewStudent({
                                ...newStudent,
                                name: e.target.value
                            });
                        }}
                        type="text"
                        id="studentName"
                        className="border border-gray-300 rounded p-2 w-full"
                        placeholder="Enter student name"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="universitySelect">University</label>
                    <select
                        onChange={(e) => {
                            setNewStudent({
                                ...newStudent,
                                universityId: parseInt(e.target.value)
                            });
                        }}
                        id="universitySelect"
                        className="border border-gray-300 rounded p-2 w-full"
                        required
                    >
                        <option value="">Select a university</option>
                        {universities.map(university => (
                            <option key={university.id} value={university.id}>
                                {university.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="batchSelect">Batch</label>
                    <select
                        onChange={(e) => {
                            setNewStudent({
                                ...newStudent,
                                batchId: parseInt(e.target.value)
                            });
                        }}
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
                <CallBtn
                    callback={(success, _) => {
                        if (success) {
                            loadStudents();
                            // Reset the form
                            setNewStudent({
                                ...newStudent,
                                studentId: '',
                                name: '',
                            });
                        }
                    }}
                    path={"/api/admin/students"}
                    method="POST"
                    data={newStudent}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                />
            </div>
            <h1 className="text-xl font-semibold text-gray-800 mb-6">Students Table</h1>
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border-b">Student ID</th>
                        <th className="px-4 py-2 border-b">Name</th>
                        <th className="px-4 py-2 border-b">University</th>
                        <th className="px-4 py-2 border-b">Batch</th>
                        <th className="px-4 py-2 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <tr key={student.id}>
                            <td className="px-4 py-2 border-b">{student.studentId}</td>
                            <td className="px-4 py-2 border-b">{student.name}</td>
                            <td className="px-4 py-2 border-b">{getUniversityName(student.universityId)}</td>
                            <td className="px-4 py-2 border-b">{getBatchName(student.batchId)}</td>
                            <td className="px-4 py-2 border-b">
                                <CallBtn
                                    callback={(success, _) => {
                                        loadStudents();
                                    }}
                                    path={`/api/admin/students/${student.id}`}
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

export default function StudentsPage() {
    return (
        <AuthLoading>
            <DashboardLayout>
                <h1 className="text-3xl font-semibold text-gray-800 mb-6">Students</h1>
                <View />
            </DashboardLayout>
        </AuthLoading>
    );
}