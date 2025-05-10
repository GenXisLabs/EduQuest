"use client";

import { useEffect, useState } from "react";
import CallBtn from "@/components/common/CallBtn";
import Spinner from "@/components/admin/UI/Spinner";

export default function PaperPage({ params }) {
    const [paperId, setPaperId] = useState(null);

    const [paper, setPaper] = useState(null);

    const [studentId, setStudentId] = useState(null); // not the main id, the studentId (uni id)
    const [quizPassword, setQuizPassword] = useState(null); // the quiz password

    const getPaperId = async () => {
        const { id } = await params;
        setPaperId(id);
        getPaper(id);
    }

    const getPaper = async (id) => {
        try {
            const response = await fetch(`/api/quiz/paper/${id}`);
            const data = await response.json();
            if (!response.ok) {
                alert(data.message);
                return;
            }
            setPaper(data.paper);
        } catch (error) {
            console.error("Error fetching paper:", error);
        }
    }

    useEffect(() => {
        getPaperId();
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
                {!paper ? (
                    <div className="flex items-center justify-center">
                        <Spinner />
                    </div>
                ) : (
                    <>
                        <div className="mb-8 text-center">
                            <h1 className="text-2xl font-bold text-gray-800">{paper.name}</h1>
                            <p className="text-sm text-gray-500 mt-2">
                                Duration: {new Date(paper.duration * 1000).toISOString().substr(11, 8)}
                            </p>
                        </div>
                        <div className="mb-6">
                            <label
                                className="block text-sm font-medium text-gray-700 mb-2"
                                htmlFor="studentId"
                            >
                                Student ID
                            </label>
                            <input
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                id="studentId"
                                type="text"
                                placeholder="Enter your Student ID"
                                value={studentId || ""}
                                onChange={(e) => setStudentId(e.target.value)}
                            />
                        </div>
                        <div className="mb-6">
                            <label
                                className="block text-sm font-medium text-gray-700 mb-2"
                                htmlFor="quizPassword"
                            >
                                Quiz Password
                            </label>
                            <input
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                id="quizPassword"
                                type="password"
                                placeholder="Enter the Quiz Password"
                                value={quizPassword || ""}
                                onChange={(e) => setQuizPassword(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-center">
                            <CallBtn
                                callback={(success, _) => {
                                    if (success) {
                                        alert("Quiz started successfully");
                                    } else {
                                        // alert("Failed to start quiz");
                                    }
                                }}
                                path={`/api/quiz/paper/${paperId}/start`}
                                method="POST"
                                data={{ studentId, quizPassword }}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                text="Start Quiz"
                                confirmation={true}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}