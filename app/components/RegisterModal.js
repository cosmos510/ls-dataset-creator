"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

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

    if (password.length < minLength) {
      return "Le mot de passe doit comporter au moins 8 caractères.";
    }

    if (!specialCharRegex.test(password)) {
      return "Le mot de passe doit contenir au moins un caractère spécial.";
    }

    return null;
  };

  const clearForm = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setError(null);
    setLoading(false);
  };

  const onRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error && data.error.includes("duplicate key value violates unique constraint")) {
          setError("Cet utilisateur existe déjà.");
        } else {
          setError(data.error || 'Une erreur s\'est produite.');
        }
        setLoading(false);
        return;
      }

      setLoading(false);
      clearForm();
      onClose();
    } catch (err) {
      setError('Une erreur s\'est produite.');
      setLoading(false);
    }
  };

  const onLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res.error) {
        if (res.error === 'CredentialsSignin') {
          setError('Email ou mot de passe incorrect.');
        } else {
          setError(res.error || 'Une erreur s\'est produite.');
        }
        setLoading(false);
        return;
      }

      setLoading(false);
      clearForm(); 
      onClose();
    } catch (err) {
      setError('Une erreur s\'est produite.');
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    clearForm();
    onClose();
    router.push('/');
  };

  useEffect(() => {
    if (!isOpen) {
      clearForm();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="register-title"
    >
      <div className="bg-white w-full max-w-md mx-4 p-8 rounded-2xl shadow-2xl relative">
        <button
          onClick={handleModalClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-light transition-colors duration-200"
          aria-label="Fermer"
        >
          ×
        </button>
        
        <div className="text-center mb-6">
          <div className="bg-gray-100 rounded-lg p-1 inline-flex">
            <button
              onClick={() => setIsLogin(false)}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${!isLogin ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
            >
              S'inscrire
            </button>
            <button
              onClick={() => setIsLogin(true)}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${isLogin ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
            >
              Se connecter
            </button>
          </div>
        </div>

        <h2 id="register-title" className="text-2xl font-bold mb-6 text-center text-gray-900"> 
          {isLogin ? 'Connexion' : 'Inscription'}
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={isLogin ? onLogin : onRegister} autoComplete="off">
          {!isLogin && (
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700 text-sm font-semibold mb-2">Nom d'utilisateur</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                required
                autoComplete="username"
              />
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">Adresse e-mail</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              required
              autoComplete="email"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">Mot de passe</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              required
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : 'transform hover:scale-[1.02]'}`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isLogin ? 'Connexion...' : 'Inscription...'}
              </div>
            ) : (
              isLogin ? 'Se connecter' : 'S\'inscrire'
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={() => signIn("google")}
            className="flex items-center justify-center w-full bg-white text-gray-700 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all duration-200 font-medium"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuer avec Google
          </button>
        </div>
      </div>
    </div>
  );
}