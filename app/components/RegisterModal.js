"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";

export default function RegisterModal({ isOpen, onClose }) {
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
      return "Password must be at least 8 characters long.";
    }

    if (!specialCharRegex.test(password)) {
      return "Password must contain at least one special character.";
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
        setError(data.error || 'Something went wrong');
        setLoading(false);
        return;
      }

      setLoading(false);
      
      clearForm();
      onClose();
    } catch (err) {
      setError('Something went wrong');
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
        setError(res.error);
        setLoading(false);
        return;
      }

      setLoading(false);
      clearForm(); 
      onClose();
    } catch (err) {
      setError('Something went wrong');
      setLoading(false);
    }
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
          onClick={() => {
            clearForm();
            onClose();
          }}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
        >
          &times;
        </button>
        
        <div className="text-center mb-4">
          <button
            onClick={() => setIsLogin(false)}
            className={`mr-4 px-4 py-2 rounded-md text-lg ${!isLogin ? 'bg-indigo-600 text-white' : 'text-indigo-600'}`}
          >
            Sign up
          </button>
          <button
            onClick={() => setIsLogin(true)}
            className={`px-4 py-2 rounded-md text-lg ${isLogin ? 'bg-indigo-600 text-white' : 'text-indigo-600'}`}
          >
            Sign In
          </button>
        </div>

        <h2 className="text-4xl font-extrabold mb-4 text-center text-gray-900"> 
          {isLogin ? 'Sign In' : 'Sign up'}
        </h2>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={isLogin ? onLogin : onRegister} autoComplete="off">
          {!isLogin && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2">Username</label>
              <input
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
            <label className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
              required
              autoComplete="email"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
            <input
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
            {loading ? (isLogin ? 'Signing In...' : 'Registering...') : (isLogin ? 'Sign In' : 'Register')}
          </button>
        </form>

        {/* Google Sign-In */}
        <div className="text-center mt-4">
          <button
            onClick={() => signIn("google")}
            className="flex items-center justify-center w-full bg-white text-indigo-600 border border-indigo-600 py-2 rounded-md hover:bg-indigo-50 focus:outline-none transition"
          >
            
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}