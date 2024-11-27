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
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 text-center">
      <p>
        Nous utilisons des cookies pour améliorer votre expérience. En
        poursuivant votre navigation, vous acceptez l'utilisation de cookies.
      </p>
      <button
        onClick={handleAccept}
        className="bg-blue-500 text-white py-2 px-4 mt-4 rounded"
      >
        Accepter
      </button>
    </div>
  );
};

export default CookieConsent;