"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const TutorialModal = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Position de la main",
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 10-3 0m3 5a1.5 1.5 0 10-3 0m0-5a1.5 1.5 0 10-3 0m0 5a1.5 1.5 0 10-3 0m0-5v-2a1.5 1.5 0 10-3 0" />
        </svg>
      ),
      content: "Placez votre main face à la caméra. Le système va détecter 21 points de repère mathématiques pour comprendre votre geste.",
    },
    {
      title: "Environnement",
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
        </svg>
      ),
      content: "Assurez-vous d'avoir un éclairage direct et un arrière-plan neutre pour maximiser la précision de l'extraction des données.",
    },
    {
      title: "Séquence de capture",
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      content: "10 photos seront prises en rafale. Variez légèrement l'angle de votre main entre chaque cliché pour enrichir mon modèle.",
    },
  ];

  useEffect(() => {
    if (!isOpen) setCurrentStep(0);
  }, [isOpen]);

  const nextStep = () => currentStep < steps.length - 1 && setCurrentStep(currentStep + 1);
  const prevStep = () => currentStep > 0 && setCurrentStep(currentStep - 1);

  const handleStartContribution = () => {
    onClose();
    router.push('/capture');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
      {/* Overlay */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="glass-card w-full max-w-lg p-8 md:p-12 relative overflow-hidden border-white/20 shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
          aria-label="Fermer"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex justify-center gap-2 mb-10">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all duration-500 ${
                index === currentStep ? 'w-8 bg-indigo-500' : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>

        <div className="text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-indigo-400 flex justify-center mb-8"
            >
              {steps[currentStep].icon}
            </motion.div>
          </AnimatePresence>
          
          <h2 className="text-3xl font-black mb-4 text-white tracking-tight">
            {steps[currentStep].title}
          </h2>
          
          <p className="text-white/70 text-lg leading-relaxed mb-12 min-h-[80px]">
            {steps[currentStep].content}
          </p>

          <div className="flex justify-between items-center pt-6 border-t border-white/10">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white disabled:opacity-0 transition-all"
            >
              Précédent
            </button>
            
            {currentStep === steps.length - 1 ? (
              <button
                onClick={handleStartContribution}
                className="bg-white text-black px-8 py-3 rounded-xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                Commencer
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-8 py-3 rounded-xl font-bold text-sm hover:bg-indigo-500/30 transition-all"
              >
                Suivant
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TutorialModal;