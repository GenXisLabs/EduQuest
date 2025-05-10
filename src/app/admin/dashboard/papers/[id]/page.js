"use client";

import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '@/components/admin/Layout/DashboardLayout';
import { AuthLoading } from '@/components/admin/Auth/AuthLoading';
import CallBtn from '@/components/common/CallBtn';
import { useRouter } from 'next/navigation';

import { Editor } from 'primereact/editor'


function View({ id }) {
    if (!id) {
        return <div className="text-red-500">Waiting for ID...</div>;
    }

    const [contentHtml, setContentHtml] = useState('');
    const [paperDetails, setPaperDetails] = useState(null);
    const [questions, setQuestions] = useState([]);

    const [isEdit, setIsEdit] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);

    const editingCardRef = useRef(null);

    const [newQuestion, setNewQuestion] = useState({
        type: 'mcq', // 'mcq' or 'essay'
        marks: 0,
        content: {
            html: '',
            // for mcq type
            // choices: [
            //     {
            //         number: 1,
            //         text: '',
            //         isAnswer: false,
            //     }
            // ],
        }
    });

    const fetchPaperDetails = async () => {
        try {
            const response = await fetch(`/api/admin/papers/${id}`);
            if (response.ok) {
                const data = await response.json();
                setPaperDetails({ ...data.paper });
            } else {
                console.error('Error fetching paper details:', data.message);
            }
        } catch (error) {
            console.error('Error fetching paper details:', error);
        }
    };

    const fetchQuestions = async () => {
        try {
            const response = await fetch(`/api/admin/papers/${id}/questions`);
            if (response.ok) {
                const data = await response.json();
                setQuestions(data.questions);
            } else {
                console.error('Error fetching questions:', data.message);
            }
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    }

    useEffect(() => {
        fetchPaperDetails();
        fetchQuestions();
    }, [id]);

    const enableEditing = (index) => {
        setIsEdit(true);
        setEditingIndex(index);
        const question = questions[index];
        const questionContent = JSON.parse(question.content);
        setNewQuestion({
            type: question.type,
            marks: question.marks,
            content: {
                html: questionContent.html,
                choices: questionContent.choices || [],
            }
        });
        // Focus on the editing card
        setTimeout(() => {
            if (editingCardRef.current) {
                editingCardRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    };

    const cancelEditing = () => {
        setIsEdit(false);
        setEditingIndex(null);
        setNewQuestion({
            ...newQuestion,
            content: {
                html: '',
            }
        });
    };

    const addChoice = () => {
        setNewQuestion({
            ...newQuestion,
            content: {
                ...newQuestion.content,
                choices: [
                    ...(newQuestion.content.choices || []),
                    { number: (newQuestion.content.choices?.length || 0) + 1, text: '', isAnswer: false },
                ],
            },
        });
    };

    const updateChoice = (index, field, value) => {
        const updatedChoices = [...(newQuestion.content.choices || [])];
        updatedChoices[index][field] = value;
        setNewQuestion({
            ...newQuestion,
            content: {
                ...newQuestion.content,
                choices: updatedChoices,
            },
        });
    };

    const setAnswer = (index) => {
        const updatedChoices = (newQuestion.content.choices || []).map((choice, i) => ({
            ...choice,
            isAnswer: i === index,
        }));
        setNewQuestion({
            ...newQuestion,
            content: {
                ...newQuestion.content,
                choices: updatedChoices,
            },
        });
    };

    const deleteChoice = (index) => {
        const updatedChoices = (newQuestion.content.choices || []).filter((_, i) => i !== index);
        const reorderedChoices = updatedChoices.map((choice, index) => ({
            ...choice,
            number: index + 1,
        }));
        setNewQuestion({
            ...newQuestion,
            content: {
                ...newQuestion.content,
                choices: reorderedChoices,
            },
        });
    }

    const postProcessQuestionPayload = (data) => {
        const payload = { ...data };
        // Convert content into json
        payload.content = JSON.stringify(data.content);
        return payload;
    }

    return (
        <div className="p-4">
            <h1 className="text-xl font-semibold text-gray-800 mb-6">Paper Details</h1>
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    {paperDetails ? paperDetails.name : 'Loading...'}
                </h2>
                {/* Add more details about the paper here */}
            </div>

            <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Questions</h2>
                {questions.length > 0 ? (
                    <div className="space-y-4">
                        {questions.map((question, index) => {
                            const questionContent = JSON.parse(question.content);
                            return (
                                <div key={index} className="p-4 border border-blue-400 rounded-lg shadow-sm bg-blue-50">
                                    <div className="mb-2">
                                        <div className="flex justify-between items-center">
                                            <p className="text-md font-semibold text-gray-700">Question {index + 1}</p>
                                            <div className="flex items-center space-x-2">
                                                <p className="text-sm text-gray-600">Marks: {question.marks}</p>
                                                <button
                                                    type="button"
                                                    onClick={() => enableEditing(index)}
                                                    className="mt-1 px-3 py-1 bg-blue-500 text-white rounded text-sm"
                                                >
                                                    Edit
                                                </button>
                                                <CallBtn
                                                    callback={(success, result) => {
                                                        if (success) {
                                                            setQuestions(questions.filter(q => q.id !== question.id));
                                                        }
                                                    }}
                                                    path={`/api/admin/papers/${id}/questions/${question.id}`}
                                                    method="DELETE"
                                                    className="mt-1 px-3 py-1 bg-red-500 text-white rounded text-sm"
                                                    text="Delete"
                                                    confirmation={true}
                                                />
                                            </div>
                                        </div>
                                        <hr className="my-2 border-blue-300" />
                                        <div>
                                            <div dangerouslySetInnerHTML={{ __html: questionContent.html }}></div>
                                        </div>
                                        <hr className="my-2 border-blue-300" />
                                    </div>
                                    {question.type === 'mcq' && questionContent.choices && questionContent.choices.length > 0 && (
                                        <div className="mt-3">
                                            <h4 className="text-sm font-semibold text-gray-700 mb-1">Choices:</h4>
                                            <ul className="list-disc pl-5 text-sm">
                                                {questionContent.choices.map((choice, choiceIndex) => (
                                                    <li key={choiceIndex} className={`${choice.isAnswer ? 'font-semibold text-green-600' : 'text-gray-700'}`}>
                                                        {choice.text} {choice.isAnswer && '(Correct Answer)'}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-gray-500">No questions available.</p>
                )}

                <div ref={editingCardRef} className="mt-6 p-4 border rounded-lg shadow-sm bg-white">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 flex">
                        {isEdit ? 'Edit Question' : 'New Question'}
                        {isEdit && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                Question: {editingIndex + 1}
                                <button
                                    type="button"
                                    onClick={cancelEditing}
                                    className="ml-1.5 flex-shrink-0 inline-flex items-center justify-center h-4 w-4 rounded-full text-yellow-400 hover:bg-yellow-200 hover:text-yellow-500 focus:outline-none focus:bg-yellow-500 focus:text-white"
                                >
                                    <span className="sr-only">Cancel edit</span>
                                    <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                                        <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                                    </svg>
                                </button>
                            </span>
                        )}
                    </h3>
                    <Editor
                        value={newQuestion.content.html}
                        onTextChange={(e) => setNewQuestion({ ...newQuestion, content: { ...newQuestion.content, html: e.htmlValue } })}
                        style={{ height: '320px' }}
                    />
                    <div className="mt-4">
                        <label className="block text-gray-700 mb-2" htmlFor="questionType">Question Type</label>
                        <select
                            id="questionType"
                            value={newQuestion.type}
                            onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value })}
                            className="border border-gray-300 rounded p-2 w-full"
                        >
                            <option value="mcq">MCQ</option>
                            <option value="essay">Essay</option>
                        </select>
                    </div>
                    {newQuestion.type === 'mcq' && (
                        <div className="mt-4">
                            <h4 className="text-gray-700 mb-2">Choices</h4>
                            {(newQuestion.content.choices || []).map((choice, index) => (
                                <div key={index} className="flex items-center mb-2">
                                    <input
                                        type="text"
                                        value={choice.text}
                                        onChange={(e) => updateChoice(index, 'text', e.target.value)}
                                        placeholder={`Choice ${index + 1}`}
                                        className="border border-gray-300 rounded p-2 flex-1 mr-2"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setAnswer(index)}
                                        className={`px-4 py-2 rounded ${choice.isAnswer ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                                    >
                                        {choice.isAnswer ? 'Answer' : 'Set as Answer'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => deleteChoice(index)}
                                        className="ml-2 px-2 py-1 bg-red-500 text-white rounded"
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addChoice}
                                className="mt-2 px-2 py-1 bg-gray-500 text-white rounded"
                            >
                                Add Choice
                            </button>
                        </div>
                    )}
                    <div className="mt-4">
                        <label className="block text-gray-700 mb-2" htmlFor="marks">Marks</label>
                        <input
                            type="number"
                            id="marks"
                            value={newQuestion.marks}
                            onChange={(e) => setNewQuestion({ ...newQuestion, marks: parseInt(e.target.value) })}
                            className="border border-gray-300 rounded p-2 w-full"
                        />
                    </div>
                    <div className="mt-4">
                        <CallBtn
                            callback={(success, result) => {
                                if (success) {
                                    if (!isEdit) {
                                        setQuestions([...questions, result.question]);
                                    } else {
                                        const updatedQuestions = [...questions];
                                        updatedQuestions[editingIndex] = result.question;
                                        setQuestions(updatedQuestions);
                                        cancelEditing();
                                    }

                                    setNewQuestion({
                                        ...newQuestion,
                                        content: {
                                            html: '',
                                        }
                                    });
                                }
                            }}
                            path={isEdit ? `/api/admin/papers/${id}/questions/${questions[editingIndex].id}` : `/api/admin/papers/${id}/questions`}
                            method={isEdit ? 'PUT' : 'POST'}
                            data={postProcessQuestionPayload(newQuestion)}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            text={isEdit ? 'Update Question' : 'Add Question'}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function PaperPage({ params }) {
    const [paperId, setPaperId] = useState(null);

    const getPaperId = async () => {
        const { id } = await params;
        setPaperId(id);
    }

    useEffect(() => {
        getPaperId();
    }, []);

    return (
        <AuthLoading>
            <DashboardLayout>
                <h1 className="text-3xl font-semibold text-gray-800 mb-6">Papers</h1>
                <View id={paperId} />
            </DashboardLayout>
        </AuthLoading>
    );
}
