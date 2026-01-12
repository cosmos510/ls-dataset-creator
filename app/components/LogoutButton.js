"use client";

import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function LogoutButton() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleLogout = async () => {
    if (session) {
      await signOut({ redirect: false });

      // Nettoyage manuel des cookies pour garantir une déconnexion propre
      document.cookie = 'next-auth.session-token=; Max-Age=0; path=/;';
      document.cookie = 'next-auth.csrf-token=; Max-Age=0; path=/;';
      document.cookie = 'next-auth.callback-url=; Max-Age=0; path=/;';
    }
    router.push('/');
  };

  return (
    <motion.button 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleLogout}
      className="flex items-center gap-2 px-5 py-2 rounded-full border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-bold uppercase tracking-widest hover:bg-red-500/10 hover:border-red-500/40 transition-all duration-300"
    >
      <svg 
        className="w-4 h-4" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
        />
      </svg>
      Déconnexion
    </motion.button>
  );
}