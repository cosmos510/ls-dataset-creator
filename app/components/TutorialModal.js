"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const TutorialModal = ({ isOpen, onClose }) => {
  const router = useRouter();
  const steps = [
    {
      title: "Positionnez votre main",
      icon: "🤚",
      content: "Placez votre main bien visible face à la caméra, dans un espace bien éclairé.",
    },
    {
      title: "Bon éclairage",
      icon: "💡",
      content: "Assurez-vous d'avoir un éclairage suffisant pour des photos nettes et claires.",
    },
    {
      title: "Prenez la photo",
      icon: "📸",
      content: "10 photos seront prises automatiquement en 10 secondes. Variez légèrement les angles.",
    },
  ];

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

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

  const handleStartContribution = () => {
    onClose();
    router.push('/take-photo');
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tutorial-title"
    >
      <div className="bg-white w-full max-w-lg mx-4 rounded-2xl shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-light transition-colors duration-200"
          aria-label="Fermer le tutoriel"
        >
          ×
        </button>

        {/* Indicateur de progression */}
        <div className="flex justify-center pt-6 pb-4">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full mx-1 transition-all duration-300 ${
                index === currentStep ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        <div className="text-center px-8 pb-8">
          {/* Icône */}
          <div className="text-6xl mb-4">{steps[currentStep].icon}</div>
          
          {/* Titre */}
          <h2 id="tutorial-title" className="text-2xl font-bold mb-4 text-gray-900">
            {steps[currentStep].title}
          </h2>
          
          {/* Contenu */}
          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            {steps[currentStep].content}
          </p>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-6 py-2 text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            >
              ← Précédent
            </button>
            
            {currentStep === steps.length - 1 ? (
              <button
                onClick={handleStartContribution}
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Je suis prêt ! Commencer à contribuer
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-all duration-200"
              >
                Suivant →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialModal;