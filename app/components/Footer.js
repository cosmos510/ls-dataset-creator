"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full pt-16 pb-12 px-6 footer-surface mt-20" role="contentinfo">
      <div className="max-w-7xl mx-auto">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* IDENTITÉ */}
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-black text-white tracking-tight">
              LSF BASE
            </h2>
            <p className="text-gray-200 text-sm leading-relaxed max-w-xs font-medium">
              Base de données dédiée à l'extraction de <strong>landmarks</strong> pour la reconnaissance de la Langue des Signes Française.
            </p>
          </div>

          {/* RÉSEAU WEBAMAX */}
          <div className="flex flex-col gap-4">
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">
              Expertise Technique
            </span>
            <div className="flex flex-col gap-3">
              <a 
                href="https://www.webamax.fr" 
                target="_blank" 
                rel="noopener"
                className="text-white font-bold hover:translate-x-1 transition-transform inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded"
                aria-label="Visiter le site Webamax.fr (nouvelle fenêtre)"
              >
                Webamax.fr
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </a>
              <nav className="flex flex-col gap-2 text-gray-300 text-sm" aria-label="Services Webamax">
                <a href="https://www.webamax.fr/applications-metiers" target="_blank" rel="noopener" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded">• Applications Métiers</a>
                <a href="https://www.webamax.fr/audit-securite" target="_blank" rel="noopener" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded">• Audit & Sécurité IA</a>
              </nav>
            </div>
          </div>

          {/* ACTIONS & INFOS */}
          <div className="flex flex-col md:items-end gap-6">
            <Link 
              href="/privacy" 
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg text-xs font-bold transition-all border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              POLITIQUE DE CONFIDENTIALITÉ
            </Link>
            
            <div className="flex items-center gap-3 bg-black/20 px-4 py-2 rounded-full border border-white/5" role="status" aria-label="État de la collecte">
              <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]" aria-hidden="true"></span>
              <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Collecte Landmarks Active</span>
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-300 font-bold text-[10px] tracking-widest uppercase">
          <p>© {new Date().getFullYear()} LSF DATASET</p>
          <div className="flex gap-4">
            <span>Propulsé par Webamax</span>
            <span className="text-white/30" aria-hidden="true">|</span>
            <span>Données privées</span>
          </div>
        </div>
      </div>
    </footer>
  );
}