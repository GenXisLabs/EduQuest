import { CldUploadButton } from 'next-cloudinary';
import React from 'react';

const EssayInput = ({ questionId, currentText = '', fileUpload = false, cldPublicId = '', onAnswerChange }) => {
  const handleChange = (e) => {
    onAnswerChange(questionId, { essayAnswer: e.target.value });
  };

  return (
    <div className="mt-4">
      <h3 className="text-md font-semibold text-gray-700 mb-2">Your Answer:</h3>
      {!fileUpload && (
        <textarea
          value={currentText}
          onChange={handleChange}
          rows={6}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
          placeholder="Type your essay answer here..."
        />
      )}
      {fileUpload && cldPublicId.length == 0 && (
        <div className="flex flex-col">
          <span className="text-sm text-gray-500 mb-2">
            Upload answer as a file. Supported formats: .doc .docx, .pdf
          </span>
          <span className="text-sm text-gray-500 mb-2">
            Max file size: 5MB
          </span>
          <CldUploadButton
            options={{
              maxFiles: 1,
              maxFileSize: 5 * 1024 * 1024, // 5 MB
              resourceType: 'raw',
              clientAllowedFormats: ['pdf', 'docx', 'doc'],
            }}
            uploadPreset='eduquest_answer_upload'
            onSuccess={(result) => {
              if (result.info) {
                const { public_id } = result.info;
                onAnswerChange(questionId, {
                  cldPublicId: public_id,
                });
              }
            }}
            className='w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 shadow-sm'
          />
        </div>
      )}
    </div>
  );
};

export default EssayInput;