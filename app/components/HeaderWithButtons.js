"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import RegisterModal from "./RegisterModal";
import TutorialModal from "./TutorialModal";
import Link from "next/link";

export default function HeaderWithButtons() {
  const { data: session } = useSession();
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isTutorialModalOpen, setIsTutorialModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeModal = () => {
    setIsRegisterModalOpen(false);
    setIsTutorialModalOpen(false);
  };

  return (
    <>
      <header className="w-full py-6 px-4 md:px-8 sticky top-0 z-50" role="banner">
        <div className="max-w-7xl mx-auto flex justify-between items-center glass-card px-4 md:px-8 py-3 border-white/10 shadow-2xl">
          
          {/* LOGO */}
          <div className="flex-1">
            <Link href="/" className="text-xl font-black tracking-tighter bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
              LSF BASE
            </Link>
          </div>
          
          {/* DESKTOP NAV - CENTERED COLLECTE */}
          <nav className="hidden lg:flex flex-1 justify-center items-center gap-8">
            <Link href="/" className="text-sm font-medium text-white/50 hover:text-white transition-all">
              Accueil
            </Link>
            
            {/* BOUTON COLLECTE MIS EN AVANT */}
            <Link 
              href="/capture" 
              className="btn-collecte pulse-collecte flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transform hover:scale-105 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Contribuer à la collecte
            </Link>

            <button
              onClick={() => setIsTutorialModalOpen(true)}
              className="text-sm font-medium text-white/50 hover:text-white transition-all"
            >
              Tutoriel
            </button>
          </nav>

          {/* RIGHT SIDE - ACCOUNT */}
          <div className="flex-1 flex justify-end items-center gap-4">
            {!session ? (
              <button
                onClick={() => setIsRegisterModalOpen(true)}
                className="text-xs font-bold text-white/70 hover:text-white uppercase tracking-widest transition-all"
              >
                Connexion
              </button>
            ) : (
              <button
                onClick={() => {
                  signOut({ redirect: false }).then(() => {
                    window.location.href = "/";
                  });
                }}
                className="text-xs font-bold text-red-400 hover:text-red-300 uppercase tracking-widest transition-all"
              >
                Quitter
              </button>
            )}

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-white p-2 ml-2"
              aria-label="Menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="absolute top-24 left-4 right-4 glass-card p-6 flex flex-col gap-4 lg:hidden border-white/20 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
            <Link href="/capture" className="bg-white text-black font-black py-4 px-4 rounded-xl text-center flex items-center justify-center gap-3" onClick={() => setIsMenuOpen(false)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              </svg>
              PRENDRE DES PHOTOS
            </Link>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <Link href="/" className="text-white text-center font-medium p-3 rounded-xl bg-white/5 border border-white/10" onClick={() => setIsMenuOpen(false)}>Accueil</Link>
              <button onClick={() => { setIsTutorialModalOpen(true); setIsMenuOpen(false); }} className="text-white text-center font-medium p-3 rounded-xl bg-white/5 border border-white/10">Tuto</button>
            </div>
            {!session ? (
              <button onClick={() => { setIsRegisterModalOpen(true); setIsMenuOpen(false); }} className="text-white/60 text-xs font-bold uppercase tracking-widest mt-4">Connexion</button>
            ) : (
              <button onClick={() => {
                signOut({ redirect: false }).then(() => {
                  window.location.href = "/";
                });
              }} className="text-red-400/60 text-xs font-bold uppercase tracking-widest mt-4">Se déconnecter</button>
            )}
          </div>
        )}
      </header>

      {isRegisterModalOpen && <RegisterModal isOpen={isRegisterModalOpen} onClose={closeModal} />}
      {isTutorialModalOpen && <TutorialModal isOpen={isTutorialModalOpen} onClose={closeModal} />}
    </>
  );
}