"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import LogoutButton from "./components/LogoutButton";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, when: "beforeChildren", staggerChildren: 0.3 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const buttonVariants = {
  hover: { scale: 1.05, boxShadow: "0px 5px 20px rgba(0, 0, 0, 0.2)" },
};

export default function HomePage() {
  return (
    <motion.div
      className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-400 text-white px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Main Content */}
      <motion.div
        className="flex flex-col flex-grow items-center justify-center text-center"
        variants={itemVariants}
      >
        <h1 className="text-5xl font-extrabold tracking-tight mb-4">
          Build the LSF Dataset
        </h1>
        <p className="text-lg text-gray-200 max-w-2xl mx-auto">
          Join our initiative to create a comprehensive French Sign Language (LSF) dataset. Together, we can foster inclusivity and innovation.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 mt-10">
          <motion.div variants={buttonVariants} whileHover="hover">
            <Link
              href="/take-photo"
              className="bg-white text-indigo-600 font-bold py-3 px-8 rounded-full shadow-md hover:bg-gray-200 transition-all"
            >
              Start Taking Photos
            </Link>
          </motion.div>
          <motion.div variants={buttonVariants} whileHover="hover">
            <LogoutButton />
          </motion.div>
        </div>
      </motion.div>
      </motion.div>
  );
}