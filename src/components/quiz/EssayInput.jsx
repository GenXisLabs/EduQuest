import { CldUploadButton } from 'next-cloudinary';
import { XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
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
            Upload answer as a PDF. Max file size: 5MB
          </span>
        </div>
      )}
      {fileUpload && cldPublicId.length > 0 && (
        <div className="flex flex-col">
          <div className='flex items-center'>
            <CheckCircleIcon className="h-4 w-4 mr-1 text-green-800" />
            <span className="text-sm text-gray-500">
              Your answer has been uploaded.
            </span>
          </div>
          <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md border border-gray-600">
            <a
              href={cldPublicId}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 underline text-sm"
            >
              View File
            </a>
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to delete this file?")) {
                  onAnswerChange(questionId, { cldPublicId: '' });
                }
              }}
              className="text-red-500 text-sm font-semibold flex items-center"
            >
              <XMarkIcon className="h-4 w-4 mr-1" />
              Remove
            </button>
          </div>
        </div>
      )}
      <CldUploadButton
        options={{
          maxFiles: 1,
          maxFileSize: 5 * 1024 * 1024, // 5 MB
          resourceType: 'raw',
          clientAllowedFormats: ['pdf'],
        }}
        uploadPreset='eduquest_answer_upload'
        onSuccess={(result) => {
          if (result.info) {
            const { secure_url } = result.info;
            onAnswerChange(questionId, {
              cldPublicId: secure_url,
            });
          }
        }}
        className={`
          w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 shadow-sm
          ${!fileUpload || cldPublicId.length > 0 ? 'hidden' : ''}
        `}
      />
    </div>
  );
};

export default EssayInput;