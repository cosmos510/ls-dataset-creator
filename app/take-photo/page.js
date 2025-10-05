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
    <div className="min-h-screen w-full flex flex-col p-4 md:p-6">
      {/* Messages de feedback */}
      {showSuccess && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 sm:px-6 py-3 rounded-lg shadow-xl z-50 flex items-center font-medium"
          role="alert"
          aria-live="polite"
        >
          <span className="mr-2" aria-hidden="true">✓</span>
          Photo envoyée !
        </motion.div>
      )}

      {showError && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 sm:px-6 py-3 rounded-lg shadow-xl z-50 flex items-center font-medium max-w-sm text-center"
          role="alert"
          aria-live="assertive"
        >
          <span className="mr-2" aria-hidden="true">⚠</span>
          {errorMessage}
        </motion.div>
      )}

      {/* Indicateur de progression */}
      <div className="flex justify-center mb-8 mt-6">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-lg md:text-xl font-bold shadow-lg transition-all duration-300 ${
              currentStep >= step ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white scale-110' : 'bg-white/20 text-white/60 backdrop-blur-sm'
            }`}>
              {step}
            </div>
            {step < 3 && <div className={`w-16 md:w-20 h-2 rounded-full transition-all duration-500 ${currentStep > step ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-white/20'}`}></div>}
          </div>
        ))}
      </div>

      <div className="text-center mb-8">
        <p className="text-lg md:text-xl font-semibold text-white mb-2" aria-live="polite" aria-atomic="true">
          {currentStep === 1 && "Choisissez une lettre"}
          {currentStep === 2 && "Capture en cours..."}
          {currentStep === 3 && "Envoi..."}
        </p>
        <p className="text-sm text-blue-100 mb-6">
          {currentStep === 1 && "Sélectionnez la lettre que vous souhaitez signer"}
          {currentStep === 2 && "10 photos automatiques en 10 secondes"}
          {currentStep === 3 && "Vos photos sont en cours d'envoi"}
        </p>
        
        {/* Bouton Comment ça marche */}
        <div className="mt-4">
          <button
            onClick={() => setIsTutorialOpen(true)}
            className="group bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm border border-white/30 text-white font-medium text-sm px-4 py-2 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:from-indigo-400/30 hover:to-purple-400/30 focus:outline-none focus:ring-4 focus:ring-white/50 animate-pulse hover:animate-none"
            aria-label="Ouvrir le tutoriel pour apprendre à bien capturer les signes"
          >
            <span className="flex items-center gap-2">
              <span className="text-sm group-hover:animate-bounce">❓</span>
              Comment ça marche ?
            </span>
          </button>
        </div>
      </div>

      {/* Interface principale */}
      <section className="flex-1 flex flex-col items-center justify-center w-full max-w-7xl mx-auto" aria-labelledby="capture-heading">
        
        <h1 id="capture-heading" className="sr-only">Capture d'images pour le corpus LSF</h1>
        
        {/* Sélection de lettre */}
        {currentStep === 1 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 sm:mb-8"
          >
            <label htmlFor="letter-select" className="sr-only">
              Sélectionnez une lettre de l'alphabet à signer
            </label>
            <select
              id="letter-select"
              value={letter}
              onChange={(e) => setLetter(e.target.value)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg sm:text-2xl font-bold px-6 sm:px-10 py-4 sm:py-5 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/50 border-2 border-white/20 backdrop-blur-sm"
              aria-describedby="letter-help"
              lang="fr"
              style={{ WebkitAppearance: 'menulist', appearance: 'menulist' }}
            >
              <option value="" lang="fr">Choisir une lettre</option>
              {[..."abcdefghijklmnopqrstuvwxyz"].map((char) => (
                <option key={char} value={char} lang="en">
                  {char.toUpperCase()}
                </option>
              ))}
            </select>
            <p id="letter-help" className="sr-only">
              Sélectionnez une lettre pour commencer la capture de 10 photos en 10 secondes
            </p>
          </motion.div>
        )}

        {/* Compteur pendant la capture */}
        {uploading && countdown > 0 && (
          <motion.div 
            className="mb-6 sm:mb-8 text-center"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            role="timer"
            aria-live="assertive"
            aria-label={`Capture en cours, ${countdown} secondes restantes`}
          >
            <div className="text-4xl sm:text-6xl font-bold text-white mb-2">{countdown}</div>
            <div className="w-24 sm:w-32 h-2 bg-white/20 rounded-full mx-auto" role="progressbar" aria-valuenow={((10 - countdown) / 10) * 100} aria-valuemin="0" aria-valuemax="100">
              <div 
                className="h-2 bg-white rounded-full transition-all duration-1000"
                style={{ width: `${((10 - countdown) / 10) * 100}%` }}
              ></div>
            </div>
          </motion.div>
        )}

        {/* Timer d'upload */}
        {uploading && countdown === 0 && (
          <motion.div 
            className="mb-6 sm:mb-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            role="status"
            aria-live="polite"
            aria-label="Envoi des photos en cours"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mr-3"></div>
              <span className="text-xl font-medium text-white">Envoi en cours...</span>
            </div>
            <div className="w-32 h-1 bg-white/20 rounded-full mx-auto">
              <div className="h-1 bg-white rounded-full animate-pulse w-full"></div>
            </div>
            <p className="text-sm text-blue-100 mt-2">Veuillez patienter, vos photos sont en cours d'envoi</p>
          </motion.div>
        )}

        {/* Interface caméra */}
        <div className="flex flex-col lg:flex-row items-center gap-6 md:gap-8 mb-6 md:mb-8 w-full">
          <div className="relative flex-1 max-w-2xl w-full">
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              className="w-full max-w-md md:max-w-lg lg:max-w-2xl h-[350px] md:h-[450px] lg:h-[500px] object-cover rounded-2xl shadow-xl border-4 border-white/20"
              aria-label="Flux vidéo de votre caméra pour capturer les signes LSF"
            />
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-medium shadow-lg">
              Votre caméra
            </div>
          </div>

          {letter && (
            <motion.div 
              className="relative flex-1 max-w-2xl w-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <img
                src={`/letters/${letter}.jpg`}
                alt={`Exemple de la lettre ${letter.toUpperCase()} en langue des signes française - position de la main pour former cette lettre`}
                className="w-full max-w-md md:max-w-lg lg:max-w-2xl h-[350px] md:h-[450px] lg:h-[500px] object-contain rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-medium shadow-lg">
                Lettre {letter.toUpperCase()}
              </div>
            </motion.div>
          )}
        </div>

        {/* Bouton d'action */}
        <div className="flex justify-center">
          <button
            onClick={handleCaptureClick}
            disabled={uploading || !letter}
            className="bg-white text-indigo-600 font-bold text-lg md:text-xl px-8 md:px-12 py-4 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-4 focus:ring-white/50"
            aria-describedby={letter ? undefined : "letter-required"}
          >
            {uploading ? "Capture..." : "Commencer"}
          </button>
          {!letter && (
            <p id="letter-required" className="sr-only">
              Vous devez sélectionner une lettre avant de commencer la capture
            </p>
          )}
        </div>
      </section>

      {isTutorialOpen && (
        <TutorialModal
          isOpen={isTutorialOpen}
          onClose={() => setIsTutorialOpen(false)}
        />
      )}
    </div>
  );
}