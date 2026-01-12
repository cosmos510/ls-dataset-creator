"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Webcam from "react-webcam";
import { useSession } from "next-auth/react";
// Suppression de useRouter car on utilise window.location
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

  // Redirection robuste via window.location pour éviter les erreurs de Chunk
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

  // Données structurées (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Interface de Capture LSF",
    "description": "Outil d'enregistrement de signes pour l'entraînement de l'intelligence artificielle en Langue des Signes Française.",
    "applicationCategory": "EducationApplication",
    "browserRequirements": "Requires camera access",
    "url": "https://ton-site.com/capture"
  };

  if (status === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-500 border-r-transparent"></div>
      </div>
    );
  }

  const handleCaptureClick = () => {
    if (!letter) {
      setErrorMessage("Sélectionnez une lettre avant de commencer.");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    setCurrentStep(2);
    captureImages();
  };

  const captureImages = async () => {
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
        setShowSuccess(true);
        setTimeout(() => { 
            setShowSuccess(false); 
            setCurrentStep(1); 
            setLetter(""); 
        }, 3000);
      }
    } catch (error) {
      setErrorMessage("Erreur réseau.");
      setShowError(true);
    } finally {
      setUploading(false);
      setCountdown(10);
      if (!showSuccess) setCurrentStep(1);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col p-4 md:p-8">
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 20, opacity: 1 }} exit={{ y: -50, opacity: 0 }} className="fixed top-0 left-1/2 -translate-x-1/2 z-[200] bg-green-500 text-black px-8 py-3 rounded-full font-black uppercase text-[10px] tracking-widest shadow-2xl">
            Séquence enregistrée !
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col mt-24 md:mt-32">
        
        <h1 className="sr-only">Interface de Capture pour l'Entraînement IA Langue des Signes Française</h1>
        
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase">
            Enregistrement <span className="text-indigo-500">LSF</span>
          </h2>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.4em] mt-2">Collecte de données landmarks</p>
        </div>

        <div className="flex justify-center gap-2 mb-16">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-1.5 rounded-full transition-all duration-700 ${currentStep >= s ? 'w-24 bg-indigo-500' : 'w-12 bg-white/10'}`} />
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-6 space-y-8">
            <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 bg-black/20 shadow-2xl aspect-[4/3] w-full mx-auto">
              <Webcam 
                ref={webcamRef} 
                audio={false} 
                screenshotFormat="image/jpeg" 
                className="w-full h-full object-cover scale-x-[-1]" 
              />
              
              <div className="absolute inset-0 flex items-center justify-end pr-[10%] pointer-events-none">
                <div className="relative w-[45%] h-[60%] border-2 border-dashed border-white/20 rounded-[2rem] translate-y-[-5%] transition-all duration-500">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-indigo-500 rounded-tl-xl -mt-1 -ml-1" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-indigo-500 rounded-tr-xl -mt-1 -mr-1" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-indigo-500 rounded-bl-xl -mb-1 -ml-1" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-indigo-500 rounded-br-xl -mb-1 -mr-1" />
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-40">
                    <span className="text-[8px] font-black uppercase tracking-tighter text-white">Zone Main</span>
                  </div>
                </div>
              </div>

              {uploading && (
                <div className="absolute top-6 right-6 bg-indigo-600 px-6 py-2 rounded-2xl shadow-xl z-50">
                  <span className="text-2xl font-black text-white">{countdown}s</span>
                </div>
              )}
            </div>

            <button 
              onClick={() => setIsTutorialOpen(true)}
              className="w-full py-5 rounded-2xl border-2 border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 transition-all flex items-center justify-center gap-3 group"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <span className="text-sm font-black uppercase tracking-widest text-white">Consulter le Protocole Technique</span>
            </button>
          </div>

          <div className="lg:col-span-6 space-y-8">
            <div className="glass-card p-8 border-white/10 bg-white/5 rounded-[2.5rem]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Sélecteur de lettre</h3>
                {letter && <span className="text-indigo-400 font-black text-xl uppercase tracking-tighter">Lettre {letter}</span>}
              </div>

              <div className="grid grid-cols-6 gap-3 mb-8">
                {[..."abcdefghijklmnopqrstuvwxyz"].map((char) => (
                  <button
                    key={char}
                    onClick={() => setLetter(char)}
                    disabled={uploading}
                    className={`h-14 rounded-xl font-black text-lg transition-all shadow-sm ${
                      letter === char ? 'bg-white text-black scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {char.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="aspect-video rounded-3xl bg-black/40 flex items-center justify-center overflow-hidden border border-white/5">
                {letter ? (
                  <motion.img key={letter} initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={`/letters/${letter}.jpg`} alt={letter} className="w-full h-full object-contain p-4" />
                ) : (
                  <span className="text-[10px] font-bold text-white/10 uppercase tracking-[0.5em]">Aperçu du signe</span>
                )}
              </div>
            </div>

            <button
              onClick={handleCaptureClick}
              disabled={uploading || !letter}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] text-sm transition-all disabled:opacity-10 shadow-[0_20px_40px_rgba(79,70,229,0.3)] active:scale-95"
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