"use client";

import { useState } from "react";
import RegisterModal from "./RegisterModal";
import TutorialModal from "./TutorialModal";
import LogoutButton from "./LogoutButton";

export default function HeaderWithButtons() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isTutorialModalOpen, setIsTutorialModalOpen] = useState(false);

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

  return (
    <>
      <header className="bg-gray-800 text-white shadow-md py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            <a href="/" className="hover:underline">
              LSF Dataset
            </a>
          </h1>
          <nav className="flex space-x-4">
            <a
              href="/take-photo"
              className="bg-white text-indigo-700 font-semibold py-2 px-6 rounded-lg shadow-md transition-colors duration-200"
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