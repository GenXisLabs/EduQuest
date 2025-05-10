import React from 'react';
import McqInput from './McqInput';
import EssayInput from './EssayInput';

const QuestionContent = ({ question, questionNumber, currentAttempt, onAnswerChange }) => {
  if (!question) return null;

  return (
    // The outer div with bg-white, p-6, rounded-lg, shadow-lg will be in the QuizPage map
    <>
      <div className="mb-4 flex flex-col sm:flex-row justify-between sm:items-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 sm:mb-0">
          Question {questionNumber}
        </h3>
        <span className="text-xs sm:text-sm font-medium text-gray-500">
          Type: {question.type.toUpperCase()} | Marks: {question.marks}
        </span>
      </div>

      <div
        className="prose prose-sm sm:prose-base max-w-none mb-6" // prose-sm for smaller default on mobile
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
          currentText={currentAttempt?.text}
          onAnswerChange={onAnswerChange}
        />
      )}
    </>
  );
};

export default QuestionContent;