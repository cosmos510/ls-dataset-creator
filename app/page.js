"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import RegisterModal from "./components/RegisterModal";
import TutorialModal from "./components/TutorialModal";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, staggerChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function HomePage() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isTutorialModalOpen, setIsTutorialModalOpen] = useState(false);
  const [letterCounts, setLetterCounts] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  const openRegisterModal = () => setIsRegisterModalOpen(true);
  const closeRegisterModal = () => setIsRegisterModalOpen(false);
  const openTutorialModal = () => setIsTutorialModalOpen(true);
  const closeTutorialModal = () => setIsTutorialModalOpen(false);

  const handleStartContribution = () => {
    router.push('/take-photo');
  };

  useEffect(() => {
    const fetchLetterCounts = async () => {
      try {
        const response = await fetch("/api/photo-count");
        const data = await response.json();
        if (data.success && data.data) {
          setLetterCounts(data.data);
        }
      } catch (error) {
        console.error('Error fetching letter counts:', error);
      }
    };

    fetchLetterCounts();
  }, []);

  const handleExpandToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen flex flex-col items-center justify-center px-4"
    >
      {/* Section principale centrée */}
      <motion.div
        className="text-center max-w-5xl mx-auto"
        variants={itemVariants}
      >
        {/* Titre principal */}
        <motion.h1 
          className="text-5xl md:text-7xl font-extrabold mb-12 bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent leading-tight"
          variants={itemVariants}
        >
          Créez le dictionnaire LSF
        </motion.h1>

        {/* Visuel d'impact amélioré */}
        <motion.div 
          className="mb-16 relative"
          variants={itemVariants}
        >
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-4 opacity-90 mb-12">
            {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((letter) => (
              <div key={letter} className="relative group cursor-pointer">
                <img
                  src={`/letters/${letter}.jpg`}
                  alt={`${letter.toUpperCase()}`}
                  className="w-full h-16 md:h-20 object-cover rounded-xl shadow-lg transform group-hover:scale-110 group-hover:rotate-2 transition-all duration-500 border-2 border-white/20"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/40 to-transparent rounded-xl group-hover:from-indigo-500/60 transition-all duration-300"></div>
                <span className="absolute bottom-1 right-1 text-white font-bold text-xs md:text-sm drop-shadow-lg">
                  {letter.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xl md:text-2xl text-blue-100 font-light mb-12 max-w-2xl mx-auto">
            Votre geste compte
          </p>
        </motion.div>

        {/* Bouton principal d'action amélioré */}
        <motion.div 
          className="mb-12"
          variants={itemVariants}
        >
          <button
            onClick={handleStartContribution}
            className="bg-white text-indigo-600 font-bold text-xl md:text-2xl px-12 py-5 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 hover:bg-blue-50 border-4 border-white/20"
          >
            Commencer
          </button>
        </motion.div>

        {/* Lien vers le tutoriel */}
        <motion.div variants={itemVariants}>
          <button
            onClick={openTutorialModal}
            className="text-blue-200 hover:text-white text-lg font-medium transition-all duration-200 hover:underline"
          >
            Comment ça marche ?
          </button>
        </motion.div>
      </motion.div>

      {/* Section des barres de progression */}
      <motion.section className="text-center py-12 mt-20 w-full max-w-6xl">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-8">
          Progression par lettre
        </h3>
  
        <div className="flex flex-wrap justify-center gap-6">
          {letterCounts
            .sort((a, b) => b.count - a.count)
            .slice(0, isExpanded ? letterCounts.length : 8)
            .map(({ letter, count }) => {
              const target = 1000;
              const progress = Math.min((count / target) * 100, 100);
  
              return (
                <div
                  key={letter}
                  className="flex flex-col items-center space-y-2"
                >
                  <span className="text-xl font-bold text-white">{letter.toUpperCase()}</span>
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <div className="absolute w-16 h-16 rounded-full bg-white/20"></div>
                    <div 
                      className="absolute w-16 h-16 rounded-full bg-gradient-to-t from-indigo-500 to-blue-400"
                      style={{
                        background: `conic-gradient(from 0deg, #3b82f6 ${progress * 3.6}deg, rgba(255,255,255,0.2) 0deg)`
                      }}
                    ></div>
                    <div className="absolute w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-xs">{Math.round(progress)}%</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-300">
                    {count} photos
                  </span>
                </div>
              );
            })}
        </div>
  
        {letterCounts.length > 8 && (
          <div className="mt-8">
            <button
              onClick={handleExpandToggle}
              className="bg-white/20 text-white font-medium py-2 px-6 rounded-full hover:bg-white/30 transition-all duration-200"
            >
              {isExpanded ? "Voir moins" : "Voir tout"}
            </button>
          </div>
        )}
      </motion.section>

      {/* Modals */}
      {isRegisterModalOpen && (
        <RegisterModal isOpen={isRegisterModalOpen} onClose={closeRegisterModal} />
      )}
      
      {isTutorialModalOpen && (
        <TutorialModal isOpen={isTutorialModalOpen} onClose={closeTutorialModal} />
      )}
    </motion.div>
  );
}