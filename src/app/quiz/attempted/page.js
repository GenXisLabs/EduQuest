// pages/quiz-review.js (or app/quiz-review/page.js)
"use client"; // Required for App Router if using hooks

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Head from 'next/head';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid'; 
import { CheckCircleIcon } from '@heroicons/react/24/outline'; 

import QuestionNavigator from '@/components/quiz/QuestionNavigator';
import QuestionContent from '@/components/quiz/QuestionContent';

import Spinner from '@/components/admin/UI/Spinner';

// const sampleQuestions = [
//     {
//         id: 0,
//         type: "mcq",
//         marks: 5,
//         content: {
//             html: "<p>What is the capital of France?</p>",
//             choices: [
//                 { number: 1, text: "Berlin", isAnswer: false },
//                 { number: 2, text: "Madrid", isAnswer: false },
//                 { number: 3, text: "Paris", isAnswer: true },
//                 { number: 4, text: "Rome", isAnswer: false },
//             ],
//         },
//     },
//     {
//         id: 1,
//         type: "essay",
//         marks: 10,
//         content: {
//             html: "<p>Describe the process of photosynthesis in your own words.</p>",
//         },
//     },
//     {
//         id: 2,
//         type: "mcq",
//         marks: 5,
//         content: {
//             html: "<p>Which planet is known as the Red Planet?</p>",
//             choices: [
//                 { number: 1, text: "Earth", isAnswer: false },
//                 { number: 2, text: "Mars", isAnswer: true },
//                 { number: 3, text: "Jupiter", isAnswer: false },
//                 { number: 4, text: "Saturn", isAnswer: false },
//             ],
//         },
//     },
//     {
//         id: 3,
//         type: "mcq",
//         marks: 5,
//         content: {
//             html: "<p>What is 2 + 2?</p>",
//             choices: [
//                 { number: 1, text: "3", isAnswer: false },
//                 { number: 2, text: "4", isAnswer: true },
//                 { number: 3, text: "5", isAnswer: false }
//             ]
//         }
//     },
//     {
//         id: 4,
//         type: "mcq",
//         marks: 5,
//         content: {
//             html: "<p>What is the largest mammal in the world?</p>",
//             choices: [
//                 { number: 1, text: "Elephant", isAnswer: false },
//                 { number: 2, text: "Blue Whale", isAnswer: true },
//                 { number: 3, text: "Giraffe", isAnswer: false },
//                 { number: 4, text: "Hippopotamus", isAnswer: false },
//             ],
//         },
//     },
//     {
//         id: 5,
//         type: "mcq",
//         marks: 5,
//         content: {
//             html: "<p>What is the chemical symbol for water?</p>",
//             choices: [
//                 { number: 1, text: "H2O", isAnswer: true },
//                 { number: 2, text: "O2", isAnswer: false },
//                 { number: 3, text: "CO2", isAnswer: false },
//                 { number: 4, text: "HO", isAnswer: false },
//             ],
//         },
//     },
//     {
//         id: 6,
//         type: "essay",
//         marks: 10,
//         content: {
//             html: "<p>Explain the significance of the Industrial Revolution.</p>",
//         },
//     },
//     {
//         id: 7,
//         type: "mcq",
//         marks: 5,
//         content: {
//             html: "<p>Which gas do plants primarily use during photosynthesis?</p>",
//             choices: [
//                 { number: 1, text: "Oxygen", isAnswer: false },
//                 { number: 2, text: "Carbon Dioxide", isAnswer: true },
//                 { number: 3, text: "Nitrogen", isAnswer: false },
//                 { number: 4, text: "Hydrogen", isAnswer: false },
//             ],
//         },
//     },
//     {
//         id: 8,
//         type: "mcq",
//         marks: 5,
//         content: {
//             html: "<p>What is the square root of 64?</p>",
//             choices: [
//                 { number: 1, text: "6", isAnswer: false },
//                 { number: 2, text: "7", isAnswer: false },
//                 { number: 3, text: "8", isAnswer: true },
//                 { number: 4, text: "9", isAnswer: false },
//             ],
//         },
//     },
// ];

// const sampleSubmittedAnswers = [
//     { id: 0, questionId: 0, choiceNumber: 3 },
//     { id: 1, questionId: 1, text: "Photosynthesis is a complex process where plants convert light energy into chemical energy, producing glucose and oxygen from carbon dioxide and water. It primarily occurs in the chloroplasts of plant cells." },
//     // Question with id: 2 is not answered
// ];

export default function QuizPage() {
    const [questions, setQuestions] = useState([]);
    const [userAnswers, setUserAnswers] = useState([]);

    const [attempt, setAttempt] = useState(null);
    const [paper, setPaper] = useState(null);
    const [remainingTime, setRemainingTime] = useState(0);

    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const [attemptedFetching, setAttemptedFetching] = useState(true);

    const [answerChangedQuestionIds, setAnswerChangedQuestionIds] = useState([]);

    // Refs for scrolling to questions
    const questionRefs = useRef([]);
    useEffect(() => {
        // Initialize refs array based on questions length
        questionRefs.current = Array(questions.length).fill(null).map(
            (_, i) => questionRefs.current[i] || React.createRef()
        );
    }, [questions.length]);


    // Load/Save answers from/to localStorage (from previous version)
    useEffect(() => {
        //   const savedAnswers = localStorage.getItem('quizUserAnswers');
        //   if (savedAnswers) {
        //     setUserAnswers(JSON.parse(savedAnswers));
        //   }
        // Fetch questions from API
        fetchAttempted();
    }, []);

    useEffect(() => {
        // Timer for backup answers
        const backupInterval = setInterval(() => {
            backupUserAnswers();
        }, 2000); // Backup every 2 seconds
        return () => clearInterval(backupInterval); // Cleanup on unmount
    }, [answerChangedQuestionIds]);

    useEffect(() => {
        if (userAnswers.length > 0 || localStorage.getItem('quizUserAnswers')) { // Avoid clearing on initial empty load if already empty
            localStorage.setItem('quizUserAnswers', JSON.stringify(userAnswers));
        }
    }, [userAnswers]);

    useEffect(() => {
        if (remainingTime > 0) {
            const timer = setInterval(() => {
                setRemainingTime((prevTime) => Math.max(prevTime - 1, 0));

            }, 1000);
            return () => clearInterval(timer); // Cleanup on unmount
        }
    }, [remainingTime]);

    const backupUserAnswers = async () => {
        if (answerChangedQuestionIds.length == 0) return;

        const uniqueIds = [...new Set(answerChangedQuestionIds)];
        const updatedAnswers = userAnswers.filter((ans) => uniqueIds.includes(ans.questionId));

        try {
            const response = await fetch('/api/quiz/attempted/saveanswers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ answers: updatedAnswers, attemptId: attempt.id }),
            });

            if (response.ok) {
                setAnswerChangedQuestionIds([]);
                console.log("Answers backed up successfully");
            }
        } catch (error) {
            console.error('Error backing up answers:', error);
        }
    }

    const fetchAttempted = async () => {
        try {
            const response = await fetch('/api/quiz/attempted');
            if (!response.ok) {
                alert('Failed to fetch questions. Please try again later.');
            }
            const result = await response.json();
            setQuestions(result.data.questions);
            setUserAnswers(result.data.submittedAnswers);
            setAttempt(result.data.attempt);
            setPaper(result.data.paper);
            setRemainingTime(result.data.remainingTime);
        } catch (error) {
            console.error('Error fetching questions:', error);
        } finally {
            setAttemptedFetching(false);
        }
    }

    const attemptedQuestionIds = useMemo(() => {
        return new Set(userAnswers.map(ans => ans.questionId));
    }, [userAnswers]);

    const handleAnswerChange = (questionId, answerDetail) => {
        setUserAnswers(prevAnswers => {
            const existingAnswerIndex = prevAnswers.findIndex(ans => ans.questionId === questionId);
            const newAnswer = { id: Date.now(), questionId, ...answerDetail }; // Ensure unique ID for answer if needed

            if (existingAnswerIndex > -1) {
                const updatedAnswers = [...prevAnswers];
                updatedAnswers[existingAnswerIndex] = { ...updatedAnswers[existingAnswerIndex], ...answerDetail };
                return updatedAnswers;
            } else {
                return [...prevAnswers, newAnswer];
            }
        });

        setAnswerChangedQuestionIds(prev => [...prev, questionId]); // Track changed question IDs
    };

    const handleNavigateToQuestion = (index) => {
        if (questionRefs.current[index] && questionRefs.current[index].current) {
            questionRefs.current[index].current.scrollIntoView({
                behavior: 'smooth',
                block: 'start', // scroll so the top of the element is at the top of the viewport
            });
        }
        if (isMobileNavOpen) {
            setIsMobileNavOpen(false); // Close mobile nav after selection
        }
    };

    const handleSubmitQuiz = () => {
        console.log("Quiz Submitted!", userAnswers);
        alert(`Quiz submitted! Check console for answers. You attempted ${attemptedQuestionIds.size} out of ${questions.length} questions.`);
        // Optionally clear localStorage:
        // localStorage.removeItem('quizUserAnswers');
        // setUserAnswers([]);
    };

    if (attemptedFetching) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner />
            </div>
        );
    }

    if (!paper) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline"> Unable to load quiz!</span>
                </div>
            </div>
        );
    }

    const countDownHMS = {
        hours: String(Math.floor(remainingTime / 3600)).padStart(2, '0'),
        minutes: String(Math.floor((remainingTime % 3600) / 60)).padStart(2, '0'),
        seconds: String(remainingTime % 60).padStart(2, '0'),
    };

    return (
        <>
            <div className="min-h-screen bg-gray-100 flex flex-col">
                <header className="bg-white shadow-md sticky top-0 z-40">
                    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center">
                                <h1 className="text-2xl font-bold text-indigo-700 uppercase">{paper.name}</h1>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className='flex flex-col'>
                                    {remainingTime > 0 && (
                                        <>
                                            <div className="md:block text-gray-700 font-medium" style={{ fontFamily: 'Courier New, Courier, monospace' }}>
                                                {countDownHMS.hours}h {countDownHMS.minutes}m {countDownHMS.seconds}s
                                            </div>
                                            {answerChangedQuestionIds.length > 0 ? (
                                                <span className="inline-flex items-center rounded-full text-xs font-medium text-yellow-800">
                                                    Saving...
                                                </span>
                                            ) : (
                                                <span className="inline-flex gap-1 items-center rounded-full text-xs font-medium text-green-800">
                                                    Saved <CheckCircleIcon className="h-4 w-4 text-green-800" />
                                                </span>
                                            )}
                                        </>
                                    )}
                                    {remainingTime <= 0 && (
                                        <div className="md:block text-red-700 font-medium">
                                            Time's up!
                                        </div>
                                    )}
                                </div>
                                <div className="md:hidden">
                                    <button
                                        onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                                        type="button"
                                        className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                                        aria-controls="mobile-menu"
                                        aria-expanded={isMobileNavOpen}
                                    >
                                        <span className="sr-only">Open main menu</span>
                                        {isMobileNavOpen ? (
                                            <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                        ) : (
                                            <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-grow container mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
                    <div className="md:flex md:gap-x-8">
                        {/* Desktop Navigator (Sticky) */}
                        <nav className="hidden md:block md:w-1/4 lg:w-1/5 md:sticky md:top-20 self-start max-h-[calc(100vh-5rem-2rem)] overflow-y-auto bg-white p-4 rounded-lg shadow">
                            <QuestionNavigator
                                questions={questions}
                                onNavigate={handleNavigateToQuestion}
                                attemptedQuestionIds={attemptedQuestionIds}
                            />
                        </nav>

                        {/* Mobile Navigator (Off-canvas Sidebar) */}
                        {isMobileNavOpen && (
                            <>
                                <div // Overlay
                                    className="fixed inset-0 z-30 bg-black bg-opacity-50 transition-opacity md:hidden"
                                    onClick={() => setIsMobileNavOpen(false)}
                                ></div>
                                <nav // Sidebar
                                    className="fixed top-0 left-0 h-full w-3/4 max-w-xs bg-gray-100 shadow-xl z-40 p-4 overflow-y-auto transform transition-transform ease-in-out duration-300 md:hidden"
                                    style={{ transform: isMobileNavOpen ? 'translateX(0)' : 'translateX(-100%)' }}
                                >
                                    <div className="flex justify-end mb-2">
                                        <button onClick={() => setIsMobileNavOpen(false)} className="p-1 text-gray-600 hover:text-gray-800">
                                            <XMarkIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                    <QuestionNavigator
                                        questions={questions}
                                        onNavigate={handleNavigateToQuestion}
                                        attemptedQuestionIds={attemptedQuestionIds}
                                    />
                                </nav>
                            </>
                        )}


                        {/* Main Content: Scrollable Questions List */}
                        <main className="flex-1 mt-6 md:mt-0 space-y-8">
                            {questions.map((question, index) => {
                                const currentAttempt = userAnswers.find(
                                    (ans) => ans.questionId === question.id
                                );
                                return (
                                    <section
                                        key={question.id}
                                        ref={questionRefs.current[index]} // Assign ref for scrolling
                                        id={`question-section-${question.id}`} // ID for direct linking or advanced use
                                        className="bg-white p-5 sm:p-6 rounded-lg shadow-lg"
                                    >
                                        <QuestionContent
                                            question={question}
                                            questionNumber={index + 1}
                                            currentAttempt={currentAttempt}
                                            onAnswerChange={handleAnswerChange}
                                        />
                                    </section>
                                );
                            })}

                            {/* Submit Button at the very end */}
                            <div className="mt-10 pt-6 border-t border-gray-200">
                                <button
                                    onClick={handleSubmitQuiz}
                                    className="w-full sm:w-auto float-right px-8 py-3 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                                >
                                    Submit Quiz
                                </button>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
}