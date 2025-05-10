import React from 'react';

const QuestionNavigator = ({
  questions,
  onNavigate, // Will now scroll to the question
  attemptedQuestionIds,
  // currentVisibleQuestionIndex, // Optional: for scroll-spy highlighting
}) => {
  return (
    // Parent div in QuizPage will handle overall positioning and background for mobile
    <div className="p-3 md:p-0"> {/* Reduced padding */}
      <h2 className="text-lg font-semibold text-gray-700 mb-3">Navigation</h2>
      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-4 lg:grid-cols-5 gap-1.5"> {/* Denser grid, smaller gap */}
        {questions.map((question, index) => {
          const isAttempted = attemptedQuestionIds.has(question.id);
          // const isCurrentVisible = index === currentVisibleQuestionIndex; // For scroll-spy

          let buttonClasses = "p-1.5 rounded text-xs font-medium transition-colors duration-150 ease-in-out focus:outline-none focus:ring-1 focus:ring-offset-1 aspect-square flex items-center justify-center ";

          // Add highlighting for current visible question if implementing scroll-spy
          // if (isCurrentVisible) {
          //   buttonClasses += "ring-2 ring-indigo-500 ring-offset-1 ";
          //   buttonClasses += isAttempted ? "bg-blue-700 text-white " : "bg-indigo-200 text-indigo-800 ";
          // } else
          if (isAttempted) {
            buttonClasses += "bg-blue-500 hover:bg-blue-600 text-white ring-blue-400 ";
          } else {
            buttonClasses += "bg-gray-300 hover:bg-gray-400 text-gray-800 ring-gray-400 ";
          }
          
          return (
            <button
              key={question.id}
              onClick={() => onNavigate(index)}
              className={buttonClasses}
              aria-label={`Go to question ${index + 1}`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionNavigator;