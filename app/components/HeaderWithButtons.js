"use client";

import { useState } from "react";
import RegisterModal from "./RegisterModal";
import TutorialModal from "./TutorialModal";
import LogoutButton from "./LogoutButton";

export default function HeaderWithButtons() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isTutorialModalOpen, setIsTutorialModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openRegisterModal = () => {
    setIsRegisterModalOpen(true);
  };

  const openTutorialModal = () => {
    setIsTutorialModalOpen(true);
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
      <header className=" text-white py-4 px-6 relative">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            <a href="/" className="hover:underline">
              LSF Dataset
            </a>
          </h1>
          {/* Hamburger Menu */}
          <button
            onClick={toggleMenu}
            className="block md:hidden text-white hover:text-gray-400 focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-4 items-center">
            <a
              href="/take-photo"
              className="bg-white text-indigo-700 font-semibold py-2 px-6 rounded-lg shadow-md transition-colors duration-200 text-center"
            >
              Prendre des photos
            </a>
            <button
              onClick={openRegisterModal}
              className="bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors duration-200"
            >
              Connexion/Inscription
            </button>
            <button
              onClick={openTutorialModal}
              className="bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors duration-200"
            >
              Tutoriel
            </button>
            <LogoutButton />
          </nav>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-gray-900 text-white shadow-lg z-50 py-4 px-6 transition-all duration-300">
            <div className="flex flex-col space-y-4">
              <a
                href="/take-photo"
                className="bg-white text-indigo-700 font-semibold py-2 px-6 rounded-lg shadow-md transition-colors duration-200 text-center flex items-center justify-center"
                onClick={toggleMenu}
              >
                Prendre des photos
              </a>
              <button
                onClick={() => {
                  toggleMenu();
                  openRegisterModal();
                }}
                className="bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors duration-200"
              >
                Connexion/Inscription
              </button>
              <button
                onClick={() => {
                  toggleMenu();
                  openTutorialModal();
                }}
                className="bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors duration-200"
              >
                Tutoriel
              </button>
              <LogoutButton />
            </div>
          </div>
        )}
      </header>

      {/* Modal de connexion/inscription */}
      {isRegisterModalOpen && (
        <RegisterModal isOpen={isRegisterModalOpen} onClose={closeModal} />
      )}

      {/* Modal du tutoriel */}
      {isTutorialModalOpen && (
        <TutorialModal isOpen={isTutorialModalOpen} onClose={closeModal} />
      )}
    </>
  );
}