"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Webcam from "react-webcam";
import { useSession } from "next-auth/react";
import confetti from "canvas-confetti"; 
import TutorialModal from "../components/TutorialModal";
import RegisterModal from "../components/RegisterModal";

export default function CapturePage() {
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
      window.location.href = "/";
    }
  }, [status]);

  useEffect(() => {
    let timer;
    if (countdown > 0 && uploading && currentStep === 2) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown, uploading, currentStep]);

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };
    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const handleCaptureClick = async () => {
    if (!letter) {
      setErrorMessage("Sélectionnez une lettre avant de commencer.");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    setCurrentStep(2);
    
    if (!webcamRef.current) return;
    setUploading(true);
    setCountdown(10);
    const capturedImages = [];

    for (let i = 0; i < 10; i++) {
      if (webcamRef.current) capturedImages.push(webcamRef.current.getScreenshot());
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    setCurrentStep(3);
    try {
      const response = await fetch("/api/photo/timer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: capturedImages, letter, userId: session?.user?.id }),
      });
      
      if (response.ok) {
        triggerConfetti();
        setShowSuccess(true);
      } else {
        throw new Error("Erreur");
      }
    } catch (error) {
      setErrorMessage("Erreur lors de l'enregistrement.");
      setShowError(true);
      setCurrentStep(1);
    } finally {
      setUploading(false);
      setCountdown(10);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 text-center bg-white/90 backdrop-blur-md">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          className="p-12 border border-gray-200 bg-white shadow-2xl rounded-[3rem] max-w-lg"
        >
          <div className="text-7xl mb-6">🤟</div>
          <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-4">
            Séquence <span className="text-indigo-600">Validée</span>
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Bravo ! Tes 10 photos pour la lettre <span className="text-gray-900 font-bold">{letter.toUpperCase()}</span> ont été ajoutées.
          </p>
          <button 
            onClick={() => { setShowSuccess(false); setCurrentStep(1); setLetter(""); }}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl"
          >
            Continuer
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col p-4 md:p-8 overflow-hidden">
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col mt-24 md:mt-32 max-md:mt-6">

        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase">
            Enregistrement <span className="text-indigo-600">LSF</span>
          </h1>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.4em] mt-2">Collecte de données pour l'IA</p>
        </div>

        <div className="flex justify-center gap-2 mb-16 max-md:mb-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-1.5 rounded-full transition-all duration-700 ${currentStep >= s ? 'w-24 bg-indigo-600' : 'w-12 bg-gray-200'}`} />
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start max-md:flex max-md:flex-col max-md:gap-6 max-md:overflow-hidden">

          {/* LEFT — WEBCAM + BOUTONS */}
          <div className="lg:col-span-6 space-y-8 max-md:space-y-4 max-md:w-full">

            {/* === BOUTON MOBILE (au-dessus du feed) === */}
            <button 
  onClick={() => setIsTutorialOpen(true)} 
  className="max-md:flex hidden w-full py-3 rounded-xl bg-black text-white font-black uppercase tracking-widest text-sm hover:bg-indigo-600 transition-all shadow-xl flex justify-center items-center"
>
  Protocole Technique
</button>

            <div className="relative rounded-[2.5rem] overflow-hidden border border-gray-200 bg-black shadow-xl aspect-[4/3] w-full mx-auto max-md:max-h-[45vh] max-md:flex max-md:items-center max-md:justify-center">
              <Webcam ref={webcamRef} audio={false} screenshotFormat="image/jpeg" className="w-full h-full object-contain md:object-cover scale-x-[-1]" />
              {uploading && (
                <div className="absolute top-4 right-4 bg-indigo-600 px-4 py-1.5 rounded-xl shadow-xl z-50">
                  <span className="text-xl font-black text-white">{countdown}s</span>
                </div>
              )}
            </div>

            {/* === BOUTON DESKTOP (sous webcam) === */}
            <button 
  onClick={() => setIsTutorialOpen(true)} 
  className="hidden md:flex w-full py-5 rounded-2xl bg-black text-white font-black uppercase tracking-widest text-sm hover:bg-indigo-600 transition-all shadow-xl flex justify-center items-center"
>
  Protocole Technique
</button>
          </div>

          {/* RIGHT — LETTRES + PREVIEW */}
          <div className="lg:col-span-6 space-y-8 max-md:space-y-4 max-md:w-full max-md:max-h-[45vh] max-md:overflow-y-auto max-md:pb-2">

            <div className="bg-gray-900 p-8 rounded-[2.5rem] shadow-2xl max-md:p-4">
              <div className="grid grid-cols-6 gap-3 mb-8 max-md:flex max-md:gap-2 max-md:overflow-x-auto max-md:whitespace-nowrap max-md:scrollbar-none">
                {[..."abcdefghijklmnopqrstuvwxyz"].map((char) => (
                  <button 
                    key={char} 
                    onClick={() => setLetter(char)} 
                    disabled={uploading} 
                    className={`h-14 w-14 min-w-14 rounded-xl font-black text-lg flex-shrink-0 transition-all ${
                      letter === char 
                      ? 'bg-indigo-600 text-white scale-110 shadow-[0_0_15px_rgba(79,70,229,0.5)]' 
                      : 'bg-white/10 text-white/40 hover:text-white hover:bg-white/20'
                    }`}
                  >
                    {char.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="aspect-video rounded-3xl bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-600 max-md:max-h-[30vh]">
                {letter ? (
                  <motion.img key={letter} initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={`/letters/${letter}.jpg`} alt={letter} className="w-full h-full object-contain p-4" />
                ) : (
                  <span className="text-xs font-bold text-gray-300 uppercase tracking-[0.3em]">Aperçu du signe</span>
                )}
              </div>
            </div>

            <button
              onClick={handleCaptureClick}
              disabled={uploading || !letter}
              className="w-full bg-indigo-600 hover:bg-black text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] text-sm transition-all disabled:opacity-30 shadow-lg"
            >
              {uploading ? "Capture en cours..." : `Démarrer la capture`}
            </button>
          </div>
        </div>
      </div>

      <TutorialModal isOpen={isTutorialOpen} onClose={() => setIsTutorialOpen(false)} />
      <RegisterModal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} />
    </div>
  );
}