"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import RegisterModal from "./components/RegisterModal";
import LogoutButton from "./components/LogoutButton";
import TutorialModal from './components/TutorialModal';


const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, when: "beforeChildren", staggerChildren: 0.3 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const buttonVariants = {
  hover: { scale: 1.05, boxShadow: "0px 5px 20px rgba(0, 0, 0, 0.2)" },
};

const descriptionVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.95,
    transition: {
      opacity: { duration: 0.4, ease: "easeIn" },
      y: { duration: 0.4, ease: "easeIn" },
      scale: { duration: 0.4, ease: "easeIn" },
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      opacity: { duration: 0.6, ease: "easeOut" },
      y: { duration: 0.6, ease: "easeOut" },
      scale: { duration: 0.6, ease: "easeOut" },
      delay: 0.3,
    },
  },
};

export default function HomePage() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isTutorialModalOpen, setIsTutorialModalOpen] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [showThirdSection, setShowThirdSection] = useState(false);
  const [hideSecondSection, setHideSecondSection] = useState(false);

  const descriptionRef = useRef(null);
  const thirdSectionRef = useRef(null);

  const openRegisterModal = () => setIsRegisterModalOpen(true);
  const closeRegisterModal = () => setIsRegisterModalOpen(false);

  const openTutorialModal = () => setIsTutorialModalOpen(true);
  const closeTutorialModal = () => setIsTutorialModalOpen(false);

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;

    const descriptionTop = descriptionRef.current?.getBoundingClientRect().top;
    if (descriptionTop < windowHeight * 0.75) {
      setShowDescription(true);
    }
    if (scrollPosition < descriptionTop || scrollPosition === 0) {
      setShowDescription(false);
    }

    const thirdSectionTop = thirdSectionRef.current?.getBoundingClientRect().top;
    if (thirdSectionTop < windowHeight * 0.75) {
      setShowThirdSection(true);
      setHideSecondSection(true);
    }
    if (scrollPosition < thirdSectionTop || scrollPosition === 0) {
      setShowThirdSection(false);
      setHideSecondSection(false);
    }
  };

  useEffect(() => {
    const checkInitialScrollPosition = () => {
      const descriptionTop = descriptionRef.current?.getBoundingClientRect().top;
      const thirdSectionTop = thirdSectionRef.current?.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (descriptionTop < windowHeight * 0.75) {
        setShowDescription(true);
      }
      if (thirdSectionTop < windowHeight * 0.75) {
        setShowThirdSection(true);
        setHideSecondSection(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    checkInitialScrollPosition();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-400 text-white px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Première section */}
      <motion.div
        className="flex flex-col flex-grow items-center justify-center text-center"
        variants={itemVariants}
        style={{ minHeight: "50vh", marginTop: "200px" }}
      >
        <h1 className="text-5xl font-extrabold tracking-tight mb-2">
          Créez le jeu de données LSF
        </h1>
        <p className="text-lg text-gray-200 max-w-2xl mx-auto">
          Rejoignez notre initiative pour créer un jeu de données complet de la Langue des Signes Française (LSF). Ensemble, nous pouvons favoriser l'inclusion et l'innovation.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 mt-10">
          <motion.div variants={buttonVariants} whileHover="hover">
            <Link
              href="/take-photo"
              className="bg-white text-indigo-600 font-bold py-3 px-8 rounded-full shadow-md hover:bg-gray-200 transition-all"
            >
              Commencer à prendre des photos
            </Link>
          </motion.div>
  
          <motion.div variants={buttonVariants} whileHover="hover">
            <button
              onClick={openRegisterModal}
              className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-3 px-8 rounded-full shadow-md"
            >
              Connexion/inscription
            </button>
          </motion.div>
          <motion.div variants={buttonVariants} whileHover="hover">
            <LogoutButton />
          </motion.div>
        </div>
  
        {/* Bouton pour déclencher le modal tutoriel */}
        <motion.div variants={buttonVariants} whileHover="hover">
          <button
            onClick={openTutorialModal}
            className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-3 px-8 rounded-full shadow-md mt-4"
          >
            Commencer le tutoriel
          </button>
        </motion.div>
      </motion.div>
  
      {/* Deuxième section */}
      <motion.section
        ref={descriptionRef}
        className="flex flex-col items-center justify-center text-center py-12 max-w-3xl mx-auto px-4"
        variants={descriptionVariants}
        initial="hidden"
        animate={showDescription && !hideSecondSection ? "visible" : "hidden"} // Cacher la deuxième section quand la condition est remplie
        style={{ minHeight: "80vh" }}
      >
        <h2 className="text-3xl font-semibold text-white mb-6">
          Pourquoi faisons-nous cela ?
        </h2>
        <p className="text-lg text-gray-200">
          Nous croyons qu’il est essentiel de créer un jeu de données complet de la Langue des Signes Française (LSF) pour développer des technologies accessibles et promouvoir l'inclusion. En contribuant à ce projet, vous aidez à combler les écarts de communication et à encourager l'innovation dans l'éducation, la technologie et au-delà. Rejoignez-nous dans notre mission de soutenir la communauté des sourds et malentendants.
        </p>
      </motion.section>
  
      {/* Troisième section */}
      <motion.section
        ref={thirdSectionRef}
        className="flex flex-col items-center justify-center text-center py-12 max-w-3xl mx-auto px-4"
        variants={descriptionVariants}
        initial="hidden"
        animate={showThirdSection ? "visible" : "hidden"}
        style={{ minHeight: "30vh", marginTop: "20px", marginBottom: "200px" }}
      >
        <h2 className="text-3xl font-semibold text-white mb-6">
          Participez dès aujourd'hui
        </h2>
        <p className="text-lg text-gray-200">
          Votre participation est importante. En contribuant au jeu de données LSF, vous rejoignez une communauté de personnes influentes qui façonnent l'avenir de la technologie inclusive. Travaillons ensemble pour faire une différence.
        </p>
      </motion.section>
  
      {isRegisterModalOpen && (
        <RegisterModal isOpen={isRegisterModalOpen} onClose={closeRegisterModal} />
      )}
      
      {/* Ajouter le modal tutoriel */}
      {isTutorialModalOpen && (
        <TutorialModal isOpen={isTutorialModalOpen} onClose={closeTutorialModal} />
      )}
    </motion.div>
  );
}