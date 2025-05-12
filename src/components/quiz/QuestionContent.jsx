import React from 'react';
import McqInput from './McqInput';
import EssayInput from './EssayInput';

const QuestionContent = ({ question, questionNumber, currentAttempt, onAnswerChange }) => {
  if (!question) return null;

  return (
    <>
      <div className="mb-4 flex flex-col sm:flex-row justify-between sm:items-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 sm:mb-0">
          Question {questionNumber}
        </h3>
        <div className="flex space-x-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {question.type.toUpperCase()}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Marks: {question.marks}
          </span>
        </div>
      </div>

      <div
        className="prose prose-sm sm:prose-base max-w-none mb-6 bg-blue-50 p-2 rounded" // prose-sm for smaller default on mobile
        dangerouslySetInnerHTML={{ __html: question.content.html }}
      />


      {question.type === 'mcq' && (
        <McqInput
          questionId={question.id}
          choices={question.content.choices}
          currentSelection={currentAttempt?.choiceNumber}
          onAnswerChange={onAnswerChange}
        />
      )}

      {question.type === 'essay' && (
        <EssayInput
          questionId={question.id}
          currentText={currentAttempt?.essayAnswer}
          fileUpload={question.fileUpload}
          cldPublicId={question.cldPublicId}
          onAnswerChange={onAnswerChange}
        />
      )}
    </>
  );
};

export default QuestionContent;