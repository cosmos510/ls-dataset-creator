# 🤟 Corpus LSF - Dictionnaire Collaboratif

> **Créons ensemble le plus grand dictionnaire de Langue des Signes Française**

Une plateforme web moderne et accessible permettant de contribuer à la création d'un corpus LSF pour l'entraînement d'IA de reconnaissance gestuelle.

## ✨ Fonctionnalités

### 🎯 **Contribution Simplifiée**
- Interface intuitive en 3 étapes
- Capture automatique de 10 photos en 10 secondes
- Feedback visuel en temps réel
- Support de toutes les lettres de l'alphabet

### 📱 **Design Responsive**
- Optimisé mobile-first
- Interface adaptative (téléphone, tablette, desktop)
- Navigation tactile fluide

### ♿ **Accessibilité WCAG 2.1 AA**
- Structure sémantique complète
- Support lecteurs d'écran
- Navigation clavier
- Contrastes optimisés
- Messages live pour les actions

### 🔐 **Authentification Sécurisée**
- Connexion email/mot de passe
- Intégration Google OAuth
- Sessions sécurisées NextAuth.js

## 🚀 Installation et Lancement Local

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Compte Supabase (pour la base de données)

### Étapes d'installation

1. **Cloner le repository**
   ```bash
   git clone https://github.com/votre-username/ls-dataset-creator.git
   cd ls-dataset-creator
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configuration des variables d'environnement**
   
   Créer un fichier `.env.local` à la racine du projet :
   ```env
   # Supabase
   LSF_NEXT_PUBLIC_SUPABASE_URL=votre_supabase_url
   LSF_NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_supabase_anon_key
   
   # NextAuth.js
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=votre_secret_aleatoire
   
   # Google OAuth (optionnel)
   GOOGLE_CLIENT_ID=votre_google_client_id
   GOOGLE_CLIENT_SECRET=votre_google_client_secret
   ```

4. **Lancer le serveur de développement**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

5. **Accéder à l'application**
   
   Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur

### Scripts disponibles

- `npm run dev` : Lance le serveur de développement
- `npm run build` : Build de production
- `npm run start` : Lance le serveur de production
- `npm run lint` : Vérification du code

### Dépannage

**Problème avec Safari en local :**
- Redémarrer le serveur après modification de `next.config.mjs`
- Vider le cache Safari (Développement > Vider les caches)
- Utiliser Chrome/Firefox en alternative pour le développement

**CSS non chargé :**
- Vérifier que `npm install` a été exécuté
- Redémarrer le serveur de développement

## 🛠️ Stack Technique

- **Framework** : Next.js 14 (App Router)
- **Styling** : Tailwind CSS
- **Animations** : Framer Motion
- **Authentification** : NextAuth.js
- **Base de données** : Supabase
- **Caméra** : react-webcam
- **Déploiement** : Vercel

## 🌐 Fonctionnalités d'Accessibilité

- **Navigation clavier** : Tab, Enter, Espace
- **Lecteurs d'écran** : Labels ARIA, rôles sémantiques
- **Contrastes** : Respect des ratios WCAG AA
- **Focus visible** : Indicateurs visuels clairs
- **Messages live** : Feedback temps réel

## 🔄 Workflow de Contribution

1. **Sélection** : Choisir une lettre dans le dropdown
2. **Capture** : 10 photos automatiques en 10 secondes
3. **Upload** : Envoi sécurisé vers la base de données
4. **Feedback** : Confirmation visuelle de succès

## 🎯 Objectifs du Projet

- **1000 photos** par lettre de l'alphabet
- **Diversité** des contributeurs pour la robustesse IA
- **Qualité** des données pour l'entraînement
- **Accessibilité** pour tous les utilisateurs

## 🤝 Contribution

Les contributions sont les bienvenues ! 

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/amelioration`)
3. Commit les changements (`git commit -m 'Ajout fonctionnalité'`)
4. Push vers la branche (`git push origin feature/amelioration`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👨‍💻 Auteur

**Maxime Martin**
- LinkedIn : [maxime-martin](https://www.linkedin.com/in/maxime-martin-090731aa/)
- Email : maximemartin510@gmail.com

---

*Ensemble, construisons l'avenir de la communication inclusive* 🤟