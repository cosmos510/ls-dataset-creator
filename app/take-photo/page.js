"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Webcam from "react-webcam";
import { useSession } from "next-auth/react";
import TutorialModal from "../components/TutorialModal";
import RegisterModal from "../components/RegisterModal";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, staggerChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const buttonVariants = {
  hover: { scale: 1.05, boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)" },
};

export default function TakePhoto() {
  const webcamRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [letter, setLetter] = useState("");
  const [progress, setProgress] = useState(0);
  const [countdown, setCountdown] = useState(10);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const { data: session, status } = useSession();
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      setIsRegisterModalOpen(true);
    }
  }, [status]);

  useEffect(() => {
    let timer;
    if (countdown > 0 && uploading) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown, uploading]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    );
  }

  const handleCaptureClick = () => {
    if (letter === "") {
      alert("Veuillez sélectionner une lettre avant de capturer des images.");
      return;
    }
    setErrorMessage("");
    captureImages();
  };

  const captureImages = async () => {
    if (!webcamRef.current) {
      alert("La webcam n’est pas prête.");
      return;
    }

    setUploading(true);
    setCountdown(10); 
    const capturedImages = [];
    const captureInterval = 1000;
    const totalCaptures = 10;

    for (let i = 0; i < totalCaptures; i++) {
      if (webcamRef.current) {
        capturedImages.push(webcamRef.current.getScreenshot());
      }
      await new Promise((resolve) => setTimeout(resolve, captureInterval));
    }

    if (!capturedImages.length || !letter || !session.user.id) {
      alert("Champs obligatoires manquants.");
      setUploading(false);
      return;
    }

    const batchSize = 5;
    const totalBatches = Math.ceil(capturedImages.length / batchSize);

    try {
      for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
        const batch = capturedImages.slice(
          batchIndex * batchSize,
          (batchIndex + 1) * batchSize
        );

        const response = await fetch("/api/photo/timer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            images: batch,
            letter,
            userId: session.user.id,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setProgress(((batchIndex + 1) / totalBatches) * 100);
        } else {
          alert("Échec du téléchargement des images.");
          break;
        }
      }
      alert(`Images téléchargées avec succès pour la lettre "${letter}".`);
    } catch (error) {
      console.error("Échec du téléchargement :", error);
      alert("Une erreur est survenue lors du téléchargement.");
    } finally {
      setUploading(false);
      setCountdown(10);
    }
  };

  const handleLetterChange = (e) => {
    setLetter(e.target.value);
    if (e.target.value) {
      setErrorMessage("");
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.main
        className="flex flex-col items-center justify-center text-center flex-grow "
        variants={itemVariants}
      >
        <h1 className="text-4xl font-bold tracking-tight mb-6">
          Capture Images for LSF Dataset
        </h1>
        <p className="text-lg text-gray-200 max-w-2xl mx-auto mb-8">
        Aidez-nous à créer un jeu de données complet pour la Langue des Signes Française (LSF)
        en capturant des images pour chaque lettre de l’alphabet.
        </p>
        <button
          onClick={() => setIsTutorialOpen(true)}
          className="bg-indigo-700 hover:bg-indigo-800 text-white py-2 px-4 rounded-md font-bold shadow-md"
        >
          aide
        </button>
        {/* Letter Selection */}
        <motion.div className="mb-8 w-full max-w-sm mx-auto" variants={itemVariants}>
          <label htmlFor="letter" className="block text-lg font-medium mb-2">
          Sélectionnez une lettre :
          </label>
          <select
            id="letter"
            value={letter}
            onChange={handleLetterChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">--Select--</option>
            {[..."abcdefghijklmnopqrstuvwxyz"].map((char) => (
              <option key={char} value={char}>
                {char.toUpperCase()}
              </option>
            ))}
          </select>

          {/* Error message if letter not selected */}
          {letter === "" && (
            <p className="text-red-500 mt-2">{errorMessage}</p>
          )}
        </motion.div>

        {/* Countdown Timer */}
        {uploading && countdown > 0 && (
          <motion.div className="mb-4 text-2xl font-semibold text-gray-700">
            <p>Temps restant : {countdown} sec</p>
          </motion.div>
        )}

        {/* Uploading message when countdown reaches 0 */}
        {uploading && countdown === 0 && (
          <motion.div className="mb-4 text-2xl font-semibold text-gray-700">
            <p>Téléchargement en cours…</p>
          </motion.div>
        )}

        {/* Webcam */}
        <motion.div className="relative mb-8" variants={itemVariants}>
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            className="w-full max-w-md mx-auto border-4 border-indigo-600 rounded-lg shadow-lg"
          />
        </motion.div>

        {/* Capture Button */}
        <motion.div variants={buttonVariants} whileHover="hover">
          <button
            onClick={handleCaptureClick}
            className="bg-white text-indigo-600 hover:bg-gray-200 font-bold py-3 px-8 rounded-full shadow-md transition"
            disabled={uploading}
          >
            {uploading ? "..." : "Capture"}
          </button>
        </motion.div>

        {/* Progress Bar */}
       
      </motion.main>

      {/* Tutorial Modal */}
      {isTutorialOpen && (
        <TutorialModal
          isOpen={isTutorialOpen}
          onClose={() => setIsTutorialOpen(false)}
        />
      )}
    </motion.div>
  );
}