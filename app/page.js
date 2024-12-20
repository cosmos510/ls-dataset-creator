"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import RegisterModal from "./components/RegisterModal";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, when: "beforeChildren", staggerChildren: 0.3 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
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
  const [letterCounts, setLetterCounts] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const descriptionRef = useRef(null);
  const thirdSectionRef = useRef(null);

  const openRegisterModal = () => setIsRegisterModalOpen(true);
  const closeRegisterModal = () => setIsRegisterModalOpen(false);

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

  useEffect(() => {
    const fetchLetterCounts = async () => {
      try {
        const response = await fetch("/api/photo-count");
        const data = await response.json();
        if (data.success && data.data) {
          setLetterCounts(data.data);
        } else {
          console.error('Error fetching photo counts:', data.error);
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
    >
      {/* Première section : Accueil */}
      <motion.div
        className="flex flex-col flex-grow items-center justify-center text-center"
        variants={itemVariants}
        style={{ minHeight: "50vh", marginTop: "150px"}}
      >
        <h1 className="text-5xl font-extrabold tracking-tight mb-6">
          Créez un corpus  LSF
        </h1>
        <p className="text-lg text-gray-200 max-w-2xl mx-auto mb-8">
        Rejoignez notre projet pour créer un corpus dédié à la Langue des Signes Française (LSF), en commençant par un modèle d’intelligence artificielle capable de reconnaître les lettres signées en dactylologie. Ce modèle a pour but de faciliter la communication des personnes sourdes et malentendantes, en offrant une meilleure accessibilité.
        </p>
        <div className="mt-4">
          <button
            onClick={openRegisterModal}
            className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-full"
          >
            Rejoindre l'initiative
          </button>
        </div>
      </motion.div>
  
      {/* Deuxième section : Pourquoi ce projet ? */}
      <motion.section
        ref={descriptionRef}
        className="flex flex-col items-center justify-center text-center py-12 max-w-3xl mx-auto px-4"
        variants={descriptionVariants}
        initial="hidden"
        animate={showDescription && !hideSecondSection ? "visible" : "hidden"}
        style={{ minHeight: "60vh" }}
      >
        <h2 className="text-3xl font-semibold text-white mb-6">
          Pourquoi faisons-nous cela ?
        </h2>
        <p className="text-lg text-gray-200">
        Nous avons besoin de photos des lettres signées pour entraîner ce modèle. Vous pouvez contribuer en prenant des photos des lettres que vous signez, et en rejoignant une communauté passionnée par l’inclusion. Ce projet n’est qu’un début : l’objectif final est d’étendre cette technologie à l’ensemble de la LSF.
        </p>
      </motion.section>
  
      {/* Troisième section : Comment ça marche ? */}
      <motion.section
  className="flex flex-col items-center justify-center text-center py-12 max-w-3xl mx-auto px-4"
  variants={descriptionVariants}
  initial="hidden"
  animate={showDescription ? "visible" : "hidden"}
  style={{ minHeight: "60vh", backgroundColor: "#5A3D8B" }}
>
  <h2 className="text-3xl font-semibold text-white mb-6">
    Comment ça marche ?
  </h2>
  <p className="text-lg text-gray-200 mb-8">
    Participer est simple et rapide ! Voici les étapes pour contribuer à la
    création du corpus LSF et aider à l'entraînement du modèle d'IA pour
    la reconnaissance des lettres signées.
  </p>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mt-6 max-w-2xl mx-auto">
    <div className="flex flex-col items-center bg-white text-indigo-600 p-6 rounded-lg shadow-lg">
      <span className="text-xl font-bold text-indigo-700 mb-4">1. Consultez le tutoriel</span>
      <p className="text-md text-gray-700">
        Avant de commencer, lisez le tutoriel pour comprendre comment réaliser les
        photos correctement. Suivez les instructions pour vous préparer à capturer
        les bonnes images.
      </p>
    </div>
    <div className="flex flex-col items-center bg-white text-indigo-600 p-6 rounded-lg shadow-lg">
      <span className="text-xl font-bold text-indigo-700 mb-4">2. Capturez les photos</span>
      <p className="text-md text-gray-700">
        Choisissez une lettre à signer. Une photo de cette lettre apparaîtra à côté
        de votre flux webcam. Pendant 10 secondes, des photos seront automatiquement
        prises toutes les secondes. Vous n'avez rien d'autre à faire que signer.
      </p>
    </div>
    <div className="flex flex-col items-center bg-white text-indigo-600 p-6 rounded-lg shadow-lg">
      <span className="text-xl font-bold text-indigo-700 mb-4">3. Enregistrez et contribuez</span>
      <p className="text-md text-gray-700">
        Une fois les photos capturées, elles seront automatiquement enregistrées et envoyées
        pour enrichir le corpus. Chaque contribution aide à améliorer l'IA pour
        reconnaître les lettres signées.
      </p>
    </div>
    <div className="flex flex-col items-center bg-white text-indigo-600 p-6 rounded-lg shadow-lg">
      <span className="text-xl font-bold text-indigo-700 mb-4">4. Profitez d'avantages exclusifs</span>
      <p className="text-md text-gray-700">
        Les 3 premiers contributeurs recevront un accès exclusif à l'application
        . En plus, tous les utilisateurs recevront des mises
        à jour régulières par mail pour suivre l'évolution du projet.
      </p>
    </div>
  </div>
</motion.section>
  
      {/* Nouvelle section : Partagez cette initiative */}
      <motion.section
  className="flex flex-col items-center justify-center text-center py-12 text-white"
  variants={descriptionVariants}
  initial="hidden"
  animate={showDescription ? "visible" : "hidden"}
  style={{ minHeight: "60vh" }}
>
  <h2 className="text-3xl font-semibold mb-4">
    Partagez cette initiative
  </h2>
  <div className="max-w-3xl mx-auto text-lg text-gray-200 mb-4">
    <p className="mb-4">
      Vous avez rejoint l'initiative, c'est maintenant à vous de faire connaître ce
      projet à vos proches. Plus nous serons nombreux, plus notre IA pourra apprendre
      rapidement à reconnaître les lettres signées et améliorer l'inclusion des
      personnes sourdes et malentendantes.
    </p>
    <p>
      Partagez ce site avec vos amis, votre famille, et sur vos réseaux sociaux pour
      soutenir cette cause importante.
    </p>
  </div>
</motion.section>
  
      {/* Section des barres de progression */}
      <motion.section className="text-center py-12 mb-20">
        <h3 className="text-3xl font-extrabold text-white mb-8">
          Nombre de photos par lettre
        </h3>
  
        <div className="flex flex-wrap justify-center gap-8">
          {letterCounts
            .sort((a, b) => b.count - a.count)
            .slice(0, isExpanded ? letterCounts.length : 5)
            .map(({ letter, count }) => {
              const target = 1000;
              const progress = Math.min((count / target) * 100, 100);
  
              const progressColor =
                progress >= 75
                  ? "bg-gradient-to-t from-indigo-600 to-purple-500"
                  : progress >= 50
                  ? "bg-gradient-to-t from-purple-500 to-pink-400"
                  : "bg-gradient-to-t from-pink-400 to-red-500";
  
              const isGoalReached = progress === 100;
  
              return (
                <div
                  key={letter}
                  className="relative flex flex-col items-center space-y-2 transition-all duration-500"
                >
                  <span className="text-2xl font-bold text-white">{letter}</span>
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <div
                      className={`absolute w-24 h-24 rounded-full ${progressColor}`}
                      style={{
                        clipPath: "circle(50% at 50% 50%)",
                        background: `conic-gradient(${progressColor} ${progress}%, rgba(0, 0, 0, 0) 0%)`,
                      }}
                    ></div>
                    <div className="absolute w-12 h-12 bg-gradient-to-r from-indigo-800 via-purple-700 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">{`${progress}%`}</span>
                    </div>
                  </div>
                  <span className="text-sm text-white font-semibold">
                    {count > 0 ? `${count} photos` : "Aucune photo"}
                  </span>
                  <span className="text-xs text-gray-200 mt-1">{`Objectif : ${target}`}</span>
                  {isGoalReached && (
                    <span className="text-xs text-green-500 font-semibold mt-2 animate-pulse">
                      Objectif atteint !
                    </span>
                  )}
                </div>
              );
            })}
        </div>
  
        <div className="mt-8">
          <button
            onClick={handleExpandToggle}
            className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-full"
          >
            {isExpanded ? "Réduire" : "Voir tout"}
          </button>
        </div>
      </motion.section>

      <motion.section
        className="flex flex-col items-center justify-center text-center py-12 text-white"
        variants={descriptionVariants}
        initial="hidden"
        animate={showDescription ? "visible" : "hidden"}
        style={{ minHeight: "80vh" }}
      >
        <h2 className="text-3xl font-semibold mb-6">À propos de moi</h2>
        
        <div className="max-w-3xl mx-auto text-lg text-gray-200 mb-8">
          <p className="mb-6">
            Je suis Martin Maxime, et mon parcours m’a conduit à m’investir dans un projet qui allie mes passions pour la technologie et l’inclusion. Je cherche à mettre mes compétences au service d’une cause qui me tient à cœur : améliorer la communication pour les personnes sourdes et malentendantes.
          </p>
          <p className="mb-6">
            Mon objectif avec ce projet est de développer des solutions technologiques innovantes qui rendent l’accès à la Langue des Signes Française (LSF) plus facile et plus accessible. Ce n’est qu’un début, mais je suis déterminé à construire quelque chose qui puisse avoir un impact durable sur l’inclusion dans notre société.
          </p>
          <p className="mb-6">
            Je crois fermement que c’est en collaborant et en unissant nos efforts que nous pouvons créer des changements significatifs. Si vous souhaitez en savoir plus sur le projet ou rejoindre cette aventure, je vous invite à me contacter et à découvrir comment vous pouvez participer.
          </p>
          
          <div className="mt-6 text-lg">
            <p className="font-semibold mb-2">Me contacter :</p>
            <div className="flex flex-col items-center space-y-4">
              <a
                href="https://www.linkedin.com/in/maxime-martin-090731aa/"
                className="w-56 text-center py-1 px-4 bg-indigo-500 text-white font-medium rounded-md hover:bg-indigo-600 transition-all duration-200"
                target="_blank" 
                rel="noopener noreferrer"
              >
                <span className="mr-2">🔗</span>
                <span>LinkedIn</span>
              </a>
              <a
                href="mailto:maximemartin510@gmail.com"
                className="w-56 text-center py-1 px-4 bg-indigo-500 text-white font-medium rounded-md hover:bg-indigo-600 transition-all duration-200"
              >
                <span className="mr-2">📧</span>
                <span>Envoyer un Email</span>
              </a>
            </div>
          </div>
        </div>
      </motion.section>
  
      {isRegisterModalOpen && (
        <RegisterModal isOpen={isRegisterModalOpen} onClose={closeRegisterModal} />
      )}
    </motion.div>
  );
}