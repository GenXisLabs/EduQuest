import React from 'react';

const McqInput = ({ questionId, choices, currentSelection, onAnswerChange }) => {
  const handleSelect = (choiceNumber) => {
    onAnswerChange(questionId, { choiceNumber });
  };

  return (
    <div className="space-y-3 mt-4">
      {choices.map((choice) => {
        const isSelected = choice.number === currentSelection;
        return (
          <button
            key={choice.number}
            onClick={() => handleSelect(choice.number)}
            className={`block w-full text-left p-3 rounded-md border transition-colors
                        ${
                          isSelected
                            ? 'bg-blue-100 border-blue-500 ring-2 ring-blue-400 text-blue-700 font-semibold'
                            : 'bg-gray-50 hover:bg-gray-100 border-gray-300'
                        }`}
          >
            <span className="font-medium mr-2">{choice.number}.</span>
            {choice.text}
          </button>
        );
      })}
    </div>
  );
};

export default McqInput;