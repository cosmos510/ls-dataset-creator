"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import RegisterModal from "./components/RegisterModal";
import TutorialModal from "./components/TutorialModal";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function HomePage() {
  const [letterCounts, setLetterCounts] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTutorialModalOpen, setIsTutorialModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchLetterCounts = async () => {
      try {
        const response = await fetch("/api/photo-count");
        const data = await response.json();
        if (data.success) setLetterCounts(data.data);
      } catch (e) { console.error(e); }
    };
    fetchLetterCounts();
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Project",
    "name": "Collecte de données LSF - Intelligence Artificielle",
    "description": "Projet de création d'un jeu de données pour l'apprentissage de la langue des signes française (LSF).",
    "url": "https://www.parle-avec-tes-mains.fr",
    "author": { "@type": "Organization", "name": "Webamax" },
    "potentialAction": { "@type": "Action", "name": "Aider à entraîner l'IA", "target": "/capture" }
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center pt-10 pb-20 px-4 md:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <motion.section 
        initial="hidden" animate="visible" variants={fadeInUp}
        className="text-center max-w-5xl mx-auto mb-24 mt-20"
        aria-labelledby="hero-title"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-6">
          Phase de collecte de données LSF
        </div>
        
        <h1 id="hero-title" className="text-5xl md:text-8xl font-black mb-8 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent leading-tight">
          L'IA doit apprendre <br/> la langue des signes.
        </h1>
        
        <p className="text-lg md:text-xl text-secondary max-w-3xl mx-auto mb-12 font-light leading-relaxed">
          Je construis actuellement le jeu de données nécessaire pour entraîner mon modèle de reconnaissance. 
          Chaque photo permet d'extraire les <strong>landmarks</strong> essentiels à la compréhension des gestes.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button 
            onClick={() => router.push('/capture')}
            className="btn-main px-10 py-5 rounded-2xl font-bold text-xl transition-transform hover:scale-105 active:scale-95 focus:ring-4 focus:ring-indigo-500 outline-none"
          >
            Aider à entraîner l'IA
          </button>
          <button 
            onClick={() => setIsTutorialModalOpen(true)}
            className="glass-card px-10 py-5 rounded-2xl font-bold text-lg text-white hover:bg-white/5 transition-all focus:ring-4 focus:ring-white/20 outline-none"
            aria-haspopup="dialog"
          >
            Comment ça marche ?
          </button>
        </div>
      </motion.section>

      <div className="grid lg:grid-cols-12 gap-8 w-full max-w-7xl mx-auto mb-24">
        
        <motion.section 
          initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-5 glass-card p-8 md:p-12 flex flex-col justify-between border-indigo-500/20 bg-white/5"
          aria-labelledby="story-title"
        >
          <div>
            <div className="text-indigo-400 font-bold mb-4 tracking-widest text-sm" aria-hidden="true">PROJET PERSONNEL</div>
            <h2 id="story-title" className="text-3xl font-bold text-white mb-6">De l'ASL à la LSF</h2>
            <div className="space-y-6 text-secondary leading-relaxed">
              <p>
                Après avoir réalisé un modèle pour l'ASL sur 
                <a href="https://www.parle-avec-tes-mains.fr" target="_blank" rel="noopener" className="text-white underline ml-1 font-bold focus:ring-2 focus:ring-indigo-400 rounded">Parle avec tes mains</a>, 
                je souhaite l'adapter pour la France.
              </p>
              <blockquote className="text-white italic font-medium border-l-2 border-indigo-500 pl-6 py-2 bg-indigo-500/5">
                "Aucun jeu de données public n'existe pour la LSF. Je collecte donc les images pour extraire les points de repère et entraîner mon propre modèle."
              </blockquote>
              <p className="text-xs opacity-50 uppercase tracking-widest">
                Propulsé par l'expertise technique de <strong>Webamax</strong>.
              </p>
            </div>
          </div>
          
          <div className="mt-12 flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/5" role="status" aria-label="État du projet">
             <div className="text-center flex-1 text-[10px] font-bold text-indigo-400 uppercase">ASL : Modèle Prêt</div>
             <div className="w-px h-10 bg-white/10 mx-4" aria-hidden="true"></div>
             <div className="text-center flex-1 text-[10px] font-bold text-pink-400 uppercase tracking-tighter">LSF : Collecte Points</div>
          </div>
        </motion.section>

        <motion.section 
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-7 glass-card p-8 md:p-12 bg-white/5"
          aria-labelledby="progress-title"
        >
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 id="progress-title" className="text-3xl font-bold text-white mb-2">Avancement</h2>
              <p className="text-sm text-muted italic font-medium tracking-tight">Objectif : 1000 captures par lettre</p>
            </div>
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
              className="text-xs font-bold text-indigo-400 hover:text-white transition-colors uppercase tracking-widest border-b border-indigo-400/30 pb-1 focus:outline-none focus:border-white"
            >
              {isExpanded ? "Réduire la liste" : "Voir toutes les lettres"}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-6" role="list">
            {letterCounts
              .sort((a, b) => a.letter.localeCompare(b.letter))
              .slice(0, isExpanded ? 26 : 10)
              .map(({ letter, count }) => {
                const progress = Math.min((count / 1000) * 100, 100);
                const color = progress > 70 ? "#10b981" : progress > 30 ? "#6366f1" : "#ec4899";
                return (
                  <div key={letter} className="flex flex-col items-center" role="listitem">
                    <div 
                      className="relative w-16 h-16 mb-3 flex items-center justify-center transition-transform hover:scale-110"
                      role="progressbar"
                      aria-valuenow={progress}
                      aria-valuemin="0"
                      aria-valuemax="100"
                      aria-label={`Progression lettre ${letter.toUpperCase()} : ${count} sur 1000`}
                    >
                      <svg className="absolute w-full h-full -rotate-90" aria-hidden="true">
                        <circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,0.05)" strokeWidth="4" fill="none" />
                        <motion.circle 
                          cx="32" cy="32" r="28" stroke={color} 
                          strokeWidth="4" fill="none" strokeDasharray="175.9" 
                          initial={{ strokeDashoffset: 175.9 }}
                          animate={{ strokeDashoffset: 175.9 - (175.9 * progress) / 100 }}
                        />
                      </svg>
                      <span className="text-xl font-black text-white">{letter.toUpperCase()}</span>
                    </div>
                    <span className="text-[10px] text-secondary font-bold uppercase">{count} photos</span>
                  </div>
                );
              })}
          </div>
        </motion.section>
      </div>

      <section className="w-full max-w-7xl mx-auto border-t border-white/5 pt-20 mb-24" aria-label="Informations techniques">
        <div className="grid md:grid-cols-3 gap-12">
          <article className="space-y-4 p-6 rounded-2xl bg-white/5">
            <svg aria-hidden="true" className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h3 className="text-xl font-bold text-white">Landmarks uniquement</h3>
            <p className="text-secondary text-sm leading-relaxed">
              Le visage n'est jamais enregistré. J'extrais uniquement les coordonnées mathématiques de la main pour entraîner l'IA.
            </p>
          </article>
          <article className="space-y-4 p-6 rounded-2xl bg-white/5">
            <svg aria-hidden="true" className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 012-2M5 11V9a2 2 0 01-2-2m0 0V5a2 2 0 012-2h14a2 2 0 012 2v2M5 7h14" />
            </svg>
            <h3 className="text-xl font-bold text-white">Objectif final</h3>
            <p className="text-secondary text-sm leading-relaxed">
              Cette base de données servira à créer un outil de traduction LSF temps réel performant et accessible.
            </p>
          </article>
          <article className="space-y-4 p-6 rounded-2xl bg-white/5">
            <svg aria-hidden="true" className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h3 className="text-xl font-bold text-white">Technologie</h3>
            <p className="text-secondary text-sm leading-relaxed">
              Le projet utilise <strong>Supabase</strong> et <strong>Vercel</strong> pour une gestion sécurisée et rapide des données de collecte.
            </p>
          </article>
        </div>
      </section>

      <section className="w-full max-w-7xl mx-auto mb-24 grid md:grid-cols-2 gap-16 px-6">
        <aside aria-labelledby="faq-title">
          <h2 id="faq-title" className="text-3xl font-bold text-white mb-8">Questions fréquentes</h2>
          <dl className="space-y-8">
            <div>
              <dt className="text-indigo-400 font-bold mb-2">Pourquoi ne pas utiliser des vidéos existantes ?</dt>
              <dd className="text-secondary text-sm leading-relaxed">Les vidéos sur internet varient trop en qualité. Nous avons besoin de données standardisées.</dd>
            </div>
            <div>
              <dt className="text-indigo-400 font-bold mb-2">Mes données sont-elles partagées ?</dt>
              <dd className="text-secondary text-sm leading-relaxed">Non. Aucune image brute n'est stockée, uniquement des points mathématiques.</dd>
            </div>
          </dl>
        </aside>

        <aside aria-labelledby="tips-title">
          <h2 id="tips-title" className="text-3xl font-bold text-white mb-8">Comment aider efficacement ?</h2>
          <ul className="space-y-8" role="list">
            <li className="flex gap-4">
              <div aria-hidden="true" className="bg-white/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-black">A</div>
              <p className="text-secondary text-sm leading-relaxed">Variez légèrement la position et l'inclinaison de votre main pour chaque capture.</p>
            </li>
            <li className="flex gap-4">
              <div aria-hidden="true" className="bg-white/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-black">B</div>
              <p className="text-secondary text-sm leading-relaxed">Assurez-vous d'avoir un éclairage correct de face.</p>
            </li>
          </ul>
        </aside>
      </section>

      {isTutorialModalOpen && (
        <TutorialModal 
          isOpen={isTutorialModalOpen} 
          onClose={() => setIsTutorialModalOpen(false)} 
        />
      )}
    </main>
  );
}