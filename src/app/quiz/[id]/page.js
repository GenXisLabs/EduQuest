"use client";

import { useEffect, useState } from "react";
import CallBtn from "@/components/common/CallBtn";
import Spinner from "@/components/admin/UI/Spinner";
import { useRouter } from "next/navigation";

function PaperNotAttempt({ paperId }) {
    if (!paperId) {
        return <div className="text-red-500">Waiting for ID...</div>;
    }

    const [paper, setPaper] = useState(null);

    const [studentId, setStudentId] = useState(null); // not the main id, the studentId (uni id)
    const [quizPassword, setQuizPassword] = useState(null); // the quiz password

    const router = useRouter();

    const getPaper = async () => {
        try {
            const response = await fetch(`/api/quiz/paper/${paperId}`);
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
        getPaper();
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
                                        router.push("/quiz/attempted");
                                    }
                                }}
                                path={`/api/quiz/attempt`}
                                method="POST"
                                data={{ studentId, paperId, quizPassword }}
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

export default function PaperPage({ params }) {
    const router = useRouter();

    const [paperId, setPaperId] = useState(null);

    const [checkingAttempt, setCheckingAttempt] = useState(true);
    const [attemptDetails, setAttemptDetails] = useState(null);

    const checkAttempt = async () => {
        const { id } = await params;
        const response = await fetch(`/api/quiz/checkattempt`);
        const data = await response.json();
        setCheckingAttempt(false);
        if (!response.ok) {
            return;
        }
        setAttemptDetails(data.data);
    }

    const getPaperId = async () => {
        const { id } = await params;
        setPaperId(parseInt(id));
        getPaper(id);
    }

    useEffect(() => {
        getPaperId();
        checkAttempt();
    }, []);

    if (checkingAttempt) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <Spinner />
            </div>
        );
    }

    if (attemptDetails) {
        if (attemptDetails.attempt.isFinished && attemptDetails.paper.id === paperId) {
            return (
                <div className="flex items-center justify-center min-h-screen bg-gray-100">
                    <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 text-center">
                        <h1 className="text-xl font-semibold text-gray-700 mb-2">{attemptDetails.paper.name}</h1>
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">You have already finished the quiz</h1>
                    </div>
                </div>
            );
        }

        if (!attemptDetails.attempt.isFinished) {
            return (
                <div className="flex items-center justify-center min-h-screen bg-gray-100">
                    <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 text-center">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">You already have an attempt</h1>
                        <button
                            onClick={() => router.push("/quiz/attempted")}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Go to Attempt
                        </button>
                    </div>
                </div>
            );
        }
    }

    return (
        <div>
            <PaperNotAttempt paperId={paperId} />
        </div>
    );
}