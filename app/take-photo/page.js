"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Webcam from "react-webcam";
import { useSession } from "next-auth/react";
import TutorialModal from "../components/TutorialModal";
import RegisterModal from "../components/RegisterModal";

export default function TakePhoto() {
  const webcamRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [letter, setLetter] = useState("");
  const [countdown, setCountdown] = useState(10);
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const { data: session, status } = useSession();
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      setIsRegisterModalOpen(true);
    }
  }, [status]);

  useEffect(() => {
    let timer;
    if (countdown > 0 && uploading) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown, uploading]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    );
  }

  const handleCaptureClick = () => {
    if (!letter) {
      setErrorMessage("Sélectionnez une lettre");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    setCurrentStep(2);
    captureImages();
  };

  const captureImages = async () => {
    if (!webcamRef.current) {
      setErrorMessage("Caméra non disponible");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    setUploading(true);
    setCountdown(10);
    const capturedImages = [];

    for (let i = 0; i < 10; i++) {
      if (webcamRef.current) {
        capturedImages.push(webcamRef.current.getScreenshot());
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    setCurrentStep(3);

    try {
      const response = await fetch("/api/photo/timer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: capturedImages,
          letter,
          userId: session.user.id,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setCurrentStep(1);
          setLetter("");
        }, 3000);
      } else {
        setErrorMessage("Échec de l'envoi");
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
      }
    } catch (error) {
      setErrorMessage("Erreur réseau");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } finally {
      setUploading(false);
      setCountdown(10);
      setCurrentStep(1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-4">
      {/* Messages de feedback */}
      {showSuccess && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg z-50 flex items-center"
        >
          <span className="mr-2">✓</span>
          Photo envoyée !
        </motion.div>
      )}

      {showError && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-full shadow-lg z-50 flex items-center"
        >
          <span className="mr-2">⚠</span>
          {errorMessage}
        </motion.div>
      )}

      {/* Indicateur de progression */}
      <div className="flex justify-center mb-6 mt-4">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              currentStep >= step ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              {step}
            </div>
            {step < 3 && <div className={`w-12 h-1 ${currentStep > step ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>}
          </div>
        ))}
      </div>

      <div className="text-center mb-6">
        <p className="text-sm text-gray-300">
          {currentStep === 1 && "Choisissez une lettre"}
          {currentStep === 2 && "Capture en cours..."}
          {currentStep === 3 && "Envoi..."}
        </p>
      </div>

      {/* Interface principale */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full">
        
        {/* Sélection de lettre */}
        {currentStep === 1 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <select
              value={letter}
              onChange={(e) => setLetter(e.target.value)}
              className="bg-white text-gray-800 text-2xl font-bold px-8 py-4 rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-300 border-0"
            >
              <option value="">Choisir une lettre</option>
              {[..."abcdefghijklmnopqrstuvwxyz"].map((char) => (
                <option key={char} value={char}>
                  {char.toUpperCase()}
                </option>
              ))}
            </select>
          </motion.div>
        )}

        {/* Compteur pendant la capture */}
        {uploading && countdown > 0 && (
          <motion.div 
            className="mb-8 text-center"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <div className="text-6xl font-bold text-white mb-2">{countdown}</div>
            <div className="w-32 h-2 bg-white/20 rounded-full mx-auto">
              <div 
                className="h-2 bg-white rounded-full transition-all duration-1000"
                style={{ width: `${((10 - countdown) / 10) * 100}%` }}
              ></div>
            </div>
          </motion.div>
        )}

        {/* Interface caméra */}
        <div className="flex flex-col lg:flex-row items-center gap-8 mb-8 w-full">
          <div className="relative flex-1 max-w-xl">
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              className="w-full h-96 object-cover rounded-2xl shadow-xl border-4 border-white/20"
            />
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 px-4 py-1 rounded-full text-sm font-medium shadow-lg">
              Votre caméra
            </div>
          </div>

          {letter && (
            <motion.div 
              className="relative flex-1 max-w-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <img
                src={`/letters/${letter}.jpg`}
                alt={`Lettre ${letter.toUpperCase()}`}
                className="w-full h-96 object-cover rounded-2xl shadow-xl border-4 border-white/20"
              />
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                Lettre {letter.toUpperCase()}
              </div>
            </motion.div>
          )}
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <button
            onClick={() => setIsTutorialOpen(true)}
            className="text-gray-300 hover:text-white underline text-sm transition-colors"
          >
            Comment ça marche ?
          </button>
          
          <button
            onClick={handleCaptureClick}
            disabled={uploading || !letter}
            className="bg-white text-indigo-600 font-bold text-xl px-12 py-4 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {uploading ? "Capture..." : "Commencer"}
          </button>
        </div>
      </div>

      {isTutorialOpen && (
        <TutorialModal
          isOpen={isTutorialOpen}
          onClose={() => setIsTutorialOpen(false)}
        />
      )}
    </div>
  );
}