import React, { useEffect } from "react";

const PrivacyPolicy = () => {
  useEffect(() => {
    document.title = "Politique de Confidentialité & Mentions Légales | Corpus LSF";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Mentions légales, politique de confidentialité et protection des données pour le projet Corpus LSF. Informations sur la collecte de landmarks gestuels et l\'utilisation sécurisée de vos données.');
    }
  }, []);
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-400 text-white px-4">
      {/* Header Section */}
      <header className="flex justify-between items-center py-4 px-6">
        <h1 className="text-xl font-bold">Mentions Légales & Politique de Confidentialité</h1>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center text-center flex-grow mb-20">
        <h1 className="text-4xl font-bold tracking-tight mb-6">
          Mentions Légales & Politique de Confidentialité
        </h1>

        <div className="max-w-4xl mx-auto text-left">
          {/* 1. Éditeur et Hébergement */}
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">1. Éditeur et Hébergement</h2>
            <p className="mb-4">
              <strong>Éditeur :</strong> Webamax (Entreprise Individuelle), Martin Maxime<br />
              <strong>SIRET :</strong> 99073315600014<br />
              <strong>Siège :</strong> 9 rue chante coq, 74200 Thonon-les-Bains<br />
              <strong>E-mail :</strong> maximemartin510@gmail.com<br />
              <strong>Site web :</strong> <a href="https://www.webamax.fr" target="_blank" rel="noopener noreferrer" className="underline hover:text-indigo-300">www.webamax.fr</a>
            </p>
            <p>
              <strong>Hébergement Frontend :</strong> Vercel Inc. (USA)<br />
              <strong>Hébergement Données & Auth :</strong> Supabase Inc. (Données stockées sur infrastructure AWS sécurisée)
            </p>
          </section>

          {/* 2. Données collectées */}
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">2. Données collectées</h2>
            <h3 className="text-xl font-semibold mb-2">Données collectées pour le projet LSF</h3>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Captures de landmarks gestuels :</strong> Coordonnées x,y,z des mains représentant des gestes en LSF, utilisées pour entraîner des modèles d'intelligence artificielle.</li>
            </ul>
            <p className="mb-4">Aucune donnée biométrique sensible n'est collectée.</p>

            <h3 className="text-xl font-semibold mb-2">Données collectées pour l'utilisation du site web</h3>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Adresse e-mail :</strong> Collectée via Supabase Auth lors de l'enregistrement ou de la connexion au site.</li>
              <li><strong>Mots de passe :</strong> Non stockés par nous mais gérés de manière chiffrée par Supabase.</li>
              <li><strong>Cookies et technologies similaires :</strong> Utilisés pour faciliter la navigation et la gestion des sessions d'authentification.</li>
            </ul>
            <p className="mb-2">Finalités de la collecte de l'e-mail :</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Créer un compte utilisateur</li>
              <li>Envoyer des informations liées à l'utilisation du site</li>
              <li>Garantir l'accès sécurisé à votre espace personnel</li>
            </ul>
            <p>Votre e-mail ne sera jamais partagé à des fins commerciales ou publicitaires sans votre consentement explicite.</p>
          </section>

          {/* 3. Finalité de la collecte des données */}
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">3. Finalité de la collecte des données</h2>
            <ul className="list-disc pl-6">
              <li><strong>Le projet LSF :</strong> Développer des modèles d'intelligence artificielle dans le domaine de la reconnaissance des gestes en LSF.</li>
              <li><strong>L'utilisation du site :</strong> Fournir un accès sécurisé, gérer les comptes utilisateurs, et améliorer l'expérience utilisateur.</li>
            </ul>
          </section>

          {/* 4. Base légale du traitement des données */}
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">4. Base légale du traitement des données</h2>
            <ul className="list-disc pl-6">
              <li><strong>Votre consentement explicite</strong> (Article 6(1)(a) du RGPD), pour l'utilisation des cookies non essentiels et pour participer au projet LSF.</li>
              <li><strong>L'exécution d'un contrat</strong> (Article 6(1)(b)) pour permettre l'enregistrement et l'utilisation de votre compte utilisateur.</li>
            </ul>
          </section>

          {/* 5. Conservation des données */}
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">5. Conservation des données</h2>
            <ul className="list-disc pl-6">
              <li><strong>Données liées au projet LSF :</strong> Les captures de landmarks gestuels sont conservées pour la durée nécessaire à la réalisation des finalités mentionnées.</li>
              <li><strong>Données liées au site web :</strong> Les adresses e-mail sont conservées tant que votre compte reste actif. Vous pouvez demander la suppression de vos données à tout moment.</li>
              <li><strong>Les cookies de session :</strong> Expirent à la fin de votre session.</li>
            </ul>
          </section>

          {/* 6. Partage et protection des données */}
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">6. Partage et protection des données</h2>
            <h3 className="text-xl font-semibold mb-2">Partage</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Avec des chercheurs ou partenaires impliqués dans des projets éducatifs ou scientifiques (pour le projet LSF).</li>
              <li>Avec des prestataires techniques pour assurer le fonctionnement du site.</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2">Sécurité</h3>
            <ul className="list-disc pl-6">
              <li>Chiffrement des mots de passe et des connexions via Supabase.</li>
              <li>Infrastructure AWS sécurisée pour le stockage des données.</li>
              <li>Restriction d'accès aux données à des personnes habilitées.</li>
            </ul>
          </section>

          {/* 7. Vos droits en tant qu'utilisateur */}
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">7. Vos droits en tant qu'utilisateur</h2>
            <ul className="list-disc pl-6">
              <li><strong>Accès :</strong> Connaître les données que nous détenons sur vous.</li>
              <li><strong>Rectification :</strong> Corriger des données inexactes.</li>
              <li><strong>Suppression :</strong> Supprimer vos données ou votre compte.</li>
              <li><strong>Opposition :</strong> Refuser certains traitements.</li>
              <li><strong>Portabilité :</strong> Recevoir vos données dans un format structuré.</li>
            </ul>
          </section>

          {/* 8. Consentement pour les cookies */}
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">8. Consentement pour les cookies</h2>
            <p>
              Vous pouvez modifier vos préférences de cookies à tout moment via les paramètres de votre navigateur.
            </p>
          </section>

          {/* 9. Utilisation des données pour l'entraînement des modèles IA */}
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">9. Utilisation des données pour l'entraînement des modèles IA</h2>
            <p className="mb-2">Nous utilisons vos données uniquement pour :</p>
            <ul className="list-disc pl-6">
              <li>Entraîner des modèles d'intelligence artificielle à reconnaître les gestes en LSF.</li>
              <li>Constituer un dataset éducatif/scientifique anonymisé.</li>
            </ul>
          </section>

          {/* 10. Modifications de la politique de confidentialité */}
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">10. Modifications de la politique de confidentialité</h2>
            <p>
              Nous nous réservons le droit de modifier cette politique pour refléter les évolutions légales ou techniques. La version la plus récente sera toujours disponible sur notre site.
            </p>
          </section>

          {/* 11. À propos de Webamax */}
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">11. À propos de Webamax</h2>
            <p className="mb-4">
              Cette plateforme a été développée par Webamax, spécialiste en solutions d'intelligence artificielle et en sécurité informatique.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <a 
                href="https://www.webamax.fr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-indigo-300 transition-colors duration-200"
              >
                Accueil Webamax
              </a>
              <span>•</span>
              <a 
                href="https://www.webamax.fr/applications-metiers" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-indigo-300 transition-colors duration-200"
              >
                Expertise IA & Applications
              </a>
              <span>•</span>
              <a 
                href="https://www.webamax.fr/audit-securite" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-indigo-300 transition-colors duration-200"
              >
                Audit & Sécurité des données
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;