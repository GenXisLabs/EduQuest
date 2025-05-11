"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/admin/Layout/DashboardLayout';
import { AuthLoading } from '@/components/admin/Auth/AuthLoading';
import { useRouter } from 'next/navigation';

function View({ attemptId }) {
    if (!attemptId) {
        return <div className="text-red-500">Waiting for ID...</div>;
    }

    const [attempt, setAttempt] = useState(null);
    const router = useRouter();

    const loadAttempt = () => {
        fetch(`/api/admin/papermarking/attempt/${attemptId}`)
            .then(response => response.json())
            .then(data => setAttempt(data.attempt))
            .catch(error => console.error('Error fetching attempt:', error));
    };

    useEffect(() => {
        if (attemptId) {
            loadAttempt();
        }
    }, [attemptId]);

    if (!attempt) {
        return <div className="text-gray-500">Loading attempt data...</div>;
    }

    return (
        <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Attempt Details</h2>
            <table className="table-auto border-collapse border border-gray-200 w-full mb-4">
                <tbody>
                    <tr>
                        <td className="border border-gray-200 px-4 py-2 font-semibold">Paper:</td>
                        <td className="border border-gray-200 px-4 py-2">{attempt.paper.name}</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-200 px-4 py-2 font-semibold">Student ID:</td>
                        <td className="border border-gray-200 px-4 py-2">{attempt.student.studentId}</td>
                    </tr>
                </tbody>
            </table>

            <h2 className="text-lg font-semibold text-gray-800 mb-4">Essay Answers</h2>
            {attempt.essayAnswers.length > 0 ? (
                <div className="space-y-4">
                    {attempt.essayAnswers.map((answer, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded">
                            <h3 className="text-md font-semibold text-gray-700 mb-2">
                                Question {index + 1}
                            </h3>
                            <div className="mb-2 bg-blue-200 p-2 rounded">
                                <div dangerouslySetInnerHTML={{ __html: JSON.parse(answer.question.content).html }}></div>
                            </div>
                            <h4 className="text-sm font-semibold text-gray-600">Student Answer:</h4>
                            <div className="bg-yellow-100 p-2 rounded">
                                <p className="text-gray-800">{answer.essayAnswer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No essay answers found.</p>
            )}
        </div>
    );
}

export default function PaperAttemptEssaysPage({ params }) {
    const [attemptId, setAttemptId] = useState(null);
    const getAttemptId = async () => {
        const { id } = await params;
        setAttemptId(id);
    };

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
