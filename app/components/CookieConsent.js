"use client";

import { useState, useEffect } from "react";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isCookieAccepted = localStorage.getItem("cookieConsent");
    if (!isCookieAccepted) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 md:p-6 flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
      <p className="text-sm md:text-base max-w-2xl text-center">
        Nous utilisons des cookies pour améliorer votre expérience. En
        poursuivant votre navigation, vous acceptez l'utilisation de cookies.
      </p>
      <button
        onClick={handleAccept}
        className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
      >
        Accepter
      </button>
    </div>
  );
};

export default CookieConsent;