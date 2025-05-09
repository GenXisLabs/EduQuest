"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/admin/Layout/DashboardLayout';
import { AuthLoading } from '@/components/admin/Auth/AuthLoading';
import CallBtn from '@/components/common/CallBtn';
import { useRouter } from 'next/navigation';

import { Editor } from 'primereact/editor'
        

function View({ id }) {
    if (!id) {
        return <div className="text-red-500">Waiting for ID...</div>;
    }

    const [text, setText] = useState('');

    const changeText = (html) => {
        console.log(html);
        setText(html);
    }

    return (
        <div className="p-4">
            <h1 className="text-xl font-semibold text-gray-800 mb-6">Paper Details</h1>
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Paper ID: {id}</h2>
                {/* Add more details about the paper here */}
            </div>
            
            <Editor value={text} onTextChange={(e) => changeText(e.htmlValue)} style={{ height: '320px' }} />
        
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
  