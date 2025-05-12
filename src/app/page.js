'use client';

import { CldUploadButton } from 'next-cloudinary';
import React from 'react';

export default function Page() {
    return (
        <div>
            <h1>Welcome to Edu-Quest</h1>
            <CldUploadButton
                options={{
                    maxFiles: 1,
                    maxFileSize: 5 * 1024 * 1024, // 5 MB
                    resourceType: 'raw',
                    clientAllowedFormats: ['pdf', 'docx', 'doc'],
                }}
                uploadPreset='eduquest_answer_upload'
                onSuccess={(result) => {
                    if (result) {
                        console.log(result);
                    }
                }}
            />
        </div>
    );
}