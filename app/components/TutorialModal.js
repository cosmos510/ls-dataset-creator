"use client";

import React, { useState, useEffect } from "react";

const TutorialModal = ({ isOpen, onClose }) => {
  const steps = [
    { title: 'Step 1', content: 'Welcome to the tutorial. This is step 1.' },
    { title: 'Step 2', content: 'This is step 2. More information.' },
    { title: 'Step 3', content: 'Step 3 explains something else.' },
    { title: 'Step 4', content: 'Final step. You are done!' }
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState(null);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-lg relative">
        <button
          onClick={() => {
            onClose();
          }}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
        >
          &times;
        </button>

        <div className="text-center mb-4">
          <h2 className="text-4xl font-extrabold mb-4 text-center text-gray-900">
            {steps[currentStep].title}
          </h2>
          <p className="text-gray-700 text-lg mb-4">{steps[currentStep].content}</p>
        </div>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <div className="flex justify-between">
          <button 
            onClick={prevStep} 
            disabled={currentStep === 0} 
            className="bg-indigo-600 text-white px-6 py-2 rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <button 
            onClick={nextStep} 
            disabled={currentStep === steps.length - 1} 
            className="bg-indigo-600 text-white px-6 py-2 rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialModal;