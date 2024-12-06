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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-lg relative">
        <button
          onClick={handleModalClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
        >
          &times;
        </button>
        
        <div className="text-center mb-4">
          <button
            onClick={() => setIsLogin(false)}
            className={`mr-4 px-4 py-2 rounded-md text-lg ${!isLogin ? 'bg-indigo-600 text-white' : 'text-indigo-600'}`}
          >
            S'inscrire
          </button>
          <button
            onClick={() => setIsLogin(true)}
            className={`px-4 py-2 rounded-md text-lg ${isLogin ? 'bg-indigo-600 text-white' : 'text-indigo-600'}`}
          >
            Se connecter
          </button>
        </div>

        <h2 className="text-4xl font-extrabold mb-4 text-center text-gray-900"> 
          {isLogin ? 'Se connecter' : 'S\'inscrire'}
        </h2>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={isLogin ? onLogin : onRegister} autoComplete="off">
          {!isLogin && (
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700 text-sm font-semibold mb-2">Nom d'utilisateur</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
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
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
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
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
              required
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none transition ${loading ? 'opacity-50' : ''}`}
          >
            {loading ? (isLogin ? 'Connexion en cours...' : 'Enregistrement en cours...') : (isLogin ? 'Se connecter' : 'S\'inscrire')}
          </button>
        </form>

        {/* Connexion avec Google */}
        <div className="text-center mt-4">
          <button
            onClick={() => signIn("google")}
            className="flex items-center justify-center w-full bg-white text-indigo-600 border border-indigo-600 py-2 rounded-md hover:bg-indigo-50 focus:outline-none transition"
          >
            Se connecter avec Google
          </button>
        </div>
      </div>
    </div>
  );
}