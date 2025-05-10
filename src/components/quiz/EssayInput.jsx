import React from 'react';

const EssayInput = ({ questionId, currentText = '', onAnswerChange }) => {
  const handleChange = (e) => {
    onAnswerChange(questionId, { text: e.target.value });
  };

  return (
    <div className="mt-4">
      <h3 className="text-md font-semibold text-gray-700 mb-2">Your Answer:</h3>
      <textarea
        value={currentText}
        onChange={handleChange}
        rows={6}
        className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
        placeholder="Type your essay answer here..."
      />
    </div>
  );
};

export default EssayInput;