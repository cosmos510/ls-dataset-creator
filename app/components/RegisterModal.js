"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";

export default function RegisterModal({ isOpen, onClose }) {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const validatePassword = (password) => {
    const minLength = 8;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (password.length < minLength) return "Minimum 8 caractères requis.";
    if (!specialCharRegex.test(password)) return "Un caractère spécial est requis.";
    return null;
  };

  const clearForm = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setError(null);
    setLoading(false);
  };

  // --- LOGIQUE INSCRIPTION + LOGIN AUTO ---
  const onRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    try {
      // 1. Création du compte
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error?.includes("unique constraint") ? "Cet utilisateur existe déjà." : data.error || 'Erreur lors de l\'inscription.');
        setLoading(false);
        return;
      }

      // 2. Connexion automatique immédiate
      const loginRes = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (loginRes.error) {
        setIsLogin(true); // On bascule sur l'onglet login au cas où
        setError("Compte créé ! Veuillez vous connecter manuellement.");
        setLoading(false);
        return;
      }

      // 3. Succès total
      setLoading(false);
      clearForm();
      onClose();
      router.refresh(); // Rafraîchit la session dans le Header
    } catch (err) {
      setError('Une erreur technique est survenue.');
      setLoading(false);
    }
  };

  const onLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await signIn('credentials', { redirect: false, email, password });
      if (res.error) {
        setError(res.error === 'CredentialsSignin' ? 'Email ou mot de passe incorrect.' : res.error);
        setLoading(false);
        return;
      }
      setLoading(false);
      clearForm(); 
      onClose();
      router.refresh();
    } catch (err) {
      setError('Une erreur s\'est produite.');
      setLoading(false);
    }
  };

  useEffect(() => { if (!isOpen) clearForm(); }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
      {/* Overlay */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Modal */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md p-8 relative overflow-hidden border-white/20 shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-5 right-5 text-white/40 hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Toggle Login/Register */}
        <div className="flex justify-center mb-10">
          <div className="bg-white/5 p-1 rounded-xl border border-white/10 flex">
            <button
              onClick={() => setIsLogin(false)}
              className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${!isLogin ? 'bg-white text-black shadow-lg' : 'text-white/50 hover:text-white'}`}
            >
              Inscription
            </button>
            <button
              onClick={() => setIsLogin(true)}
              className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${isLogin ? 'bg-white text-black shadow-lg' : 'text-white/50 hover:text-white'}`}
            >
              Connexion
            </button>
          </div>
        </div>

        <h2 className="text-3xl font-black mb-8 text-center text-white tracking-tight"> 
          {isLogin ? 'Bon retour' : 'Rejoindre la base'}
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={isLogin ? onLogin : onRegister} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-white/50 text-[10px] font-bold uppercase tracking-widest mb-2 ml-1">Nom d'utilisateur</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-white/50 text-[10px] font-bold uppercase tracking-widest mb-2 ml-1">Adresse e-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-white/50 text-[10px] font-bold uppercase tracking-widest mb-2 ml-1">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 mt-4 shadow-lg"
          >
            {loading ? 'Traitement...' : isLogin ? 'Se connecter' : 'Créer mon compte'}
          </button>
        </form>

        <div className="relative my-8 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
          <span className="relative bg-[#050508] px-4 text-[10px] text-white/30 font-bold uppercase tracking-widest">Ou</span>
        </div>

        <button
          onClick={() => signIn("google")}
          className="flex items-center justify-center w-full bg-white/5 border border-white/10 py-3 rounded-xl hover:bg-white/10 transition-all text-sm font-medium text-white"
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continuer avec Google
        </button>
      </motion.div>
    </div>
  );
}