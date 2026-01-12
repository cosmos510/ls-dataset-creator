"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const isCookieAccepted = localStorage.getItem("cookieConsent");
      if (!isCookieAccepted) {
        // Petit délai pour ne pas agresser l'utilisateur dès le chargement
        const timer = setTimeout(() => setIsVisible(true), 1500);
        return () => clearTimeout(timer);
      }
    } catch (error) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem("cookieConsent", "accepted");
      setIsVisible(false);
    } catch (error) {
      setIsVisible(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-sm z-[100]"
        >
          <div className="glass-card p-6 border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
            {/* Effet de lueur en arrière-plan */}
            <div className="absolute -right-10 -top-10 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h4 className="text-white font-bold text-sm uppercase tracking-widest">Confidentialité</h4>
              </div>

              <p className="text-white/70 text-xs leading-relaxed">
                Nous utilisons des cookies pour optimiser votre expérience sur la base LSF et garantir la sécurité de vos données.
              </p>

              <div className="flex gap-3 mt-2">
                <button
                  onClick={handleAccept}
                  className="flex-1 bg-white text-black py-2.5 rounded-xl font-black text-[10px] uppercase tracking-wider hover:scale-[1.02] active:scale-[0.95] transition-all"
                >
                  Accepter
                </button>
                <button
                  onClick={() => setIsVisible(false)}
                  className="flex-1 bg-white/5 border border-white/10 text-white/50 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-wider hover:bg-white/10 hover:text-white transition-all"
                >
                  Refuser
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;