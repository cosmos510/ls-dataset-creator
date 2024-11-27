"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Webcam from "react-webcam";
import { useSession } from "next-auth/react";
import TutorialModal from "../components/TutorialModal";

// Animation Variants
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
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const { data: session } = useSession();

  const captureImages = async () => {
    if (!webcamRef.current || !letter) {
      alert("Please select a letter before capturing images.");
      return;
    }

    if (!session) {
      alert("Please log in to capture images.");
      return;
    }

    const capturedImages = [];
    const captureInterval = 1000;
    const duration = 10000; // 10 seconds
    const totalCaptures = duration / captureInterval;

    for (let i = 0; i < totalCaptures; i++) {
      capturedImages.push(webcamRef.current.getScreenshot());
      await new Promise((resolve) => setTimeout(resolve, captureInterval));
    }

    if (!capturedImages.length || !letter || !session.user.id) {
      alert("Missing required fields.");
      return;
    }

    setUploading(true);
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
          alert("Failed to upload images.");
          break;
        }
      }
      alert(`Successfully uploaded images for letter "${letter}".`);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("An error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-400 text-white px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Section */}
      <header className="flex justify-between items-center py-4 px-6">
        <h1 className="text-xl font-bold">LSF Dataset Tool</h1>
        <button
          onClick={() => setIsTutorialOpen(true)}
          className="bg-indigo-700 hover:bg-indigo-800 text-white py-2 px-4 rounded-md font-bold shadow-md"
        >
          Help
        </button>
      </header>

      {/* Main Content */}
      <motion.main
        className="flex flex-col items-center justify-center text-center flex-grow"
        variants={itemVariants}
      >
        <h1 className="text-4xl font-bold tracking-tight mb-6">
          Capture Images for LSF Dataset
        </h1>
        <p className="text-lg text-gray-200 max-w-2xl mx-auto mb-8">
          Help us create a comprehensive dataset for French Sign Language (LSF)
          by capturing images for each letter of the alphabet.
        </p>

        {/* Letter Selection */}
        <motion.div className="mb-8 w-full max-w-sm mx-auto" variants={itemVariants}>
          <label htmlFor="letter" className="block text-lg font-medium mb-2">
            Select Letter:
          </label>
          <select
            id="letter"
            value={letter}
            onChange={(e) => setLetter(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">--Select--</option>
            {[..."abcdefghijklmnopqrstuvwxyz"].map((char) => (
              <option key={char} value={char}>
                {char.toUpperCase()}
              </option>
            ))}
          </select>
        </motion.div>

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
            onClick={captureImages}
            disabled={uploading || !letter || !session}
            className={`${
              uploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-white text-indigo-600 hover:bg-gray-200"
            } font-bold py-3 px-8 rounded-full shadow-md transition`}
          >
            {uploading ? "Uploading..." : "Capture"}
          </button>
        </motion.div>

        {/* Progress Bar */}
        {uploading && (
          <motion.div
            className="w-full max-w-lg mx-auto mt-6"
            variants={itemVariants}
          >
            <div className="w-full h-3 bg-gray-300 rounded-full">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>
        )}
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