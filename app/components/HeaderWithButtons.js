"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import RegisterModal from "./RegisterModal";
import TutorialModal from "./TutorialModal";

export default function HeaderWithButtons() {
  const { data: session } = useSession();
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isTutorialModalOpen, setIsTutorialModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openRegisterModal = () => {
    setIsRegisterModalOpen(true);
  };

  const closeModal = () => {
    setIsRegisterModalOpen(false);
    setIsTutorialModalOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <>
      <header className="text-white py-4 px-4 relative mb-12 sm:mb-20 w-full" role="banner">
        <div className="w-full max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-xl sm:text-2xl font-bold flex-shrink-0">
            <a href="/" className="hover:underline focus:outline-none focus:ring-2 focus:ring-white/50 focus:rounded px-2 py-1" aria-label="Retour à l'accueil - Corpus LSF">
            Corpus LSF
            </a>
          </div>
          
          {/* Hamburger Menu */}
          <button
            onClick={toggleMenu}
            className="block lg:hidden text-white hover:text-gray-400 focus:outline-none p-2"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          
          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-2" role="navigation" aria-label="Navigation principale">
            <a
              href="/"
              className="bg-gray-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-colors duration-200 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm whitespace-nowrap"
              aria-label="Aller à la page d'accueil"
            >
              Accueil
            </a>
            <a
              href="/take-photo"
              className="bg-white text-indigo-700 font-medium py-2 px-4 rounded-lg shadow-md transition-colors duration-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm whitespace-nowrap"
              aria-label="Aller à la page de capture de photos"
            >
              📸 Photos
            </a>
            {!session ? (
              <button
                onClick={openRegisterModal}
                className="bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-colors duration-200 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm whitespace-nowrap"
                aria-label="Ouvrir le formulaire de connexion ou d'inscription"
              >
                👤 Connexion
              </button>
            ) : (
              <button
                onClick={() => signOut()}
                className="bg-red-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-colors duration-200 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm whitespace-nowrap"
                aria-label="Se déconnecter de votre compte"
              >
                🚪 Déconnexion
              </button>
            )}
            <button
              onClick={() => setIsTutorialModalOpen(true)}
              className="bg-purple-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-colors duration-200 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm whitespace-nowrap"
              aria-label="Ouvrir le tutoriel pour apprendre à contribuer"
            >
              📚 Tutoriel
            </button>
          </nav>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-gray-900/95 backdrop-blur-sm text-white shadow-xl z-50 py-4 px-4 lg:hidden">
            <div className="flex flex-col space-y-3 max-w-sm mx-auto">
              <a
                href="/"
                className="bg-gray-700 text-white font-medium py-3 px-4 rounded-lg shadow-md transition-colors duration-200 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50 text-center"
                onClick={toggleMenu}
              >
                🏠 Accueil
              </a>
              <a
                href="/take-photo"
                className="bg-white text-indigo-700 font-medium py-3 px-4 rounded-lg shadow-md transition-colors duration-200 hover:bg-blue-50 text-center"
                onClick={toggleMenu}
              >
                📸 Prendre des photos
              </a>
              {!session ? (
                <button
                  onClick={() => {
                    toggleMenu();
                    openRegisterModal();
                  }}
                  className="bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg shadow-md transition-colors duration-200 hover:bg-indigo-800"
                >
                  👤 Connexion/Inscription
                </button>
              ) : (
                <button
                  onClick={() => {
                    toggleMenu();
                    signOut();
                  }}
                  className="bg-red-700 text-white font-medium py-3 px-4 rounded-lg shadow-md transition-colors duration-200 hover:bg-red-800"
                >
                  🚪 Déconnexion
                </button>
              )}
              <button
                onClick={() => {
                  toggleMenu();
                  setIsTutorialModalOpen(true);
                }}
                className="bg-purple-700 text-white font-medium py-3 px-4 rounded-lg shadow-md transition-colors duration-200 hover:bg-purple-800"
              >
                📚 Tutoriel
              </button>
            </div>
          </div>
        )}
      </header>

      {isRegisterModalOpen && (
        <RegisterModal isOpen={isRegisterModalOpen} onClose={closeModal} />
      )}
      {isTutorialModalOpen && (
        <TutorialModal isOpen={isTutorialModalOpen} onClose={closeModal} />
      )}
    </>
  );
}