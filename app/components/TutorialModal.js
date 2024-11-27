"use client";

import React, { useState, useEffect } from "react";

const TutorialModal = ({ isOpen, onClose }) => {
  const steps = [
    {
      title: "Étape 1 : Préparez-vous",
      content:
        "Positionnez-vous face à la caméra, dans un espace bien éclairé. Assurez-vous que votre main est bien visible.",
    },
    {
      title: "Étape 2 : Ajustez la distance",
      content:
        "Alternez entre des positions proches et éloignées pour varier les angles. Approchez ou éloignez doucement votre main pour chaque photo.",
    },
    {
      title: "Étape 3 : Bougez lentement",
      content:
        "Déplacez légèrement votre main à différents angles entre chaque photo. Faites une pause d'une seconde pour garantir des images nettes.",
    },
    {
      title: "Étape 4 : Suivez le chronomètre",
      content:
        "La session de photos dure 10 secondes. Une photo sera prise automatiquement chaque seconde. Restez stable et variez vos mouvements.",
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
        >
          &times;
        </button>

        <div className="text-center mb-4">
          <h2 className="text-2xl font-extrabold mb-4 text-gray-900">
            {steps[currentStep].title}
          </h2>
          <p className="text-gray-700 text-lg">{steps[currentStep].content}</p>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            Précédent
          </button>
          <button
            onClick={nextStep}
            disabled={currentStep === steps.length - 1}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialModal;