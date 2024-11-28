import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-400 text-white px-4 ">
      {/* Header Section */}
      <header className="flex justify-between items-center py-4 px-6">
        <h1 className="text-xl font-bold">Politique de Confidentialité</h1>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center text-center flex-grow mb-20">
        <h1 className="text-4xl font-bold tracking-tight mb-6">
          Politique de Confidentialité
        </h1>

        <div className="max-w-4xl mx-auto">
          {/* 1. Responsable du traitement des données */}
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">1. Responsable du traitement des données</h2>
            <p>
              Le responsable du traitement des données est :
            </p>
            <p>
              <strong>Martin Maxime</strong><br />
              Adresse : 9 rue chante coq 74200 thonon les bains<br />
              E-mail : maximemartin510@gmail.com
            </p>
          </section>

          {/* 2. Données collectées */}
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">2. Données collectées</h2>
            <h3 className="text-xl font-semibold mb-2">Données collectées pour le projet LSF</h3>
            <ul className="list-disc pl-6">
              <li>
                <strong>Images des mains</strong> : Captures représentant des gestes en LSF, utilisées pour entraîner des modèles d’intelligence artificielle.
              </li>
            </ul>
            <p>Aucune donnée biométrique sensible n’est collectée.</p>

            <h3 className="text-xl font-semibold mt-4 mb-2">Données collectées pour l’utilisation du site web</h3>
            <ul className="list-disc pl-6">
              <li><strong>Adresse e-mail</strong> : Lors de l’enregistrement ou de la connexion au site, nous collectons votre adresse e-mail.</li>
              <ul className="list-inside">
                <li>Créer un compte utilisateur.</li>
                <li>Envoyer des informations liées à l’utilisation du site (notifications, changements importants, etc.).</li>
                <li>Garantir l’accès sécurisé à votre espace personnel.</li>
              </ul>
              <p>Votre e-mail ne sera jamais partagé à des fins commerciales ou publicitaires sans votre consentement explicite.</p>
            </ul>
            <ul className="list-disc pl-6 mt-4">
              <li><strong>Cookies et technologies similaires</strong> : Nous utilisons des cookies pour faciliter la navigation et la gestion des sessions d’authentification.</li>
            </ul>
            <p>
              Vous pouvez configurer votre navigateur pour accepter ou refuser les cookies.
            </p>
          </section>

          {/* 3. Finalité de la collecte des données */}
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">3. Finalité de la collecte des données</h2>
            <ul className="list-disc pl-6">
              <li><strong>Le projet LSF</strong> : Développer des modèles d’intelligence artificielle dans le domaine de la reconnaissance des gestes en LSF.</li>
              <li><strong>L’utilisation du site</strong> : Fournir un accès sécurisé, gérer les comptes utilisateurs, et améliorer l’expérience utilisateur.</li>
            </ul>
          </section>

          {/* 4. Base légale du traitement des données */}
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">4. Base légale du traitement des données</h2>
            <ul className="list-disc pl-6">
              <li><strong>Votre consentement explicite</strong> (Article 6(1)(a) du RGPD), pour l’utilisation des cookies non essentiels et pour participer au projet LSF.</li>
              <li><strong>L’exécution d’un contrat</strong> (Article 6(1)(b)) pour permettre l’enregistrement et l’utilisation de votre compte utilisateur.</li>
            </ul>
          </section>

          {/* 5. Conservation des données */}
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">5. Conservation des données</h2>
            <ul className="list-disc pl-6">
              <li><strong>Données liées au projet LSF</strong> : Les images des mains sont conservées pour la durée nécessaire à la réalisation des finalités mentionnées.</li>
              <li><strong>Données liées au site web</strong> : Les adresses e-mail sont conservées tant que votre compte reste actif. Vous pouvez demander la suppression de vos données à tout moment.</li>
              <li><strong>Les cookies de session</strong> expirent à la fin de votre session.</li>
            </ul>
          </section>

          {/* 6. Partage et protection des données */}
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">6. Partage et protection des données</h2>
            <h3 className="text-xl font-semibold mb-2">Partage</h3>
            <ul className="list-disc pl-6">
              <li>Avec des chercheurs ou partenaires impliqués dans des projets éducatifs ou scientifiques (pour le projet LSF).</li>
              <li>Avec des prestataires techniques pour assurer le fonctionnement du site.</li>
            </ul>

            <h3 className="text-xl font-semibold mt-4 mb-2">Sécurité</h3>
            <ul className="list-disc pl-6">
              <li>Chiffrement des mots de passe et des connexions.</li>
              <li>Restriction d’accès aux données à des personnes habilitées.</li>
            </ul>
          </section>

          {/* 7. Vos droits en tant qu’utilisateur */}
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">7. Vos droits en tant qu’utilisateur</h2>
            <ul className="list-disc pl-6">
              <li><strong>Accès</strong> : Connaître les données que nous détenons sur vous.</li>
              <li><strong>Rectification</strong> : Corriger des données inexactes.</li>
              <li><strong>Suppression</strong> : Supprimer vos données ou votre compte.</li>
              <li><strong>Opposition</strong> : Refuser certains traitements.</li>
              <li><strong>Portabilité</strong> : Recevoir vos données dans un format structuré.</li>
            </ul>
          </section>

          {/* 8. Consentement pour les cookies */}
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">8. Consentement pour les cookies</h2>
            <p>
              Vous pouvez modifier vos préférences de cookies à tout moment via les paramètres de votre navigateur.
            </p>
          </section>

          {/* 9. Utilisation d’images pour l’entraînement des modèles IA */}
          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">9. Utilisation d’images pour l’entraînement des modèles IA</h2>
            <p>Nous utilisons vos images uniquement pour :</p>
            <ul className="list-disc pl-6">
              <li>Entraîner des modèles d’intelligence artificielle à reconnaître les gestes en LSF.</li>
              <li>Constituer un dataset éducatif/scientifique anonymisé.</li>
            </ul>
          </section>

          {/* 10. Modifications de la politique de confidentialité */}
          <section>
            <h2 className="text-2xl font-semibold mb-2">10. Modifications de la politique de confidentialité</h2>
            <p>
              Nous nous réservons le droit de modifier cette politique pour refléter les évolutions légales ou techniques. La version la plus récente sera toujours disponible sur notre site.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;