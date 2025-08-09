import localFont from "next/font/local";
import { SpeedInsights } from '@vercel/speed-insights/next';
import "./globals.css";
import ClientSessionWrapper from './components/ClientSessionWrapper';
import CookieConsent from './components/CookieConsent';
import HeaderWithButtons from './components/HeaderWithButtons';
import Footer from './components/Footer'

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Corpus LSF - Dictionnaire Langue des Signes Française",
  description: "Contribuez à la création du plus grand dictionnaire LSF collaboratif pour améliorer l'accessibilité des personnes sourdes et malentendantes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-400 text-white overflow-x-hidden`}
      >
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white text-black px-4 py-2 rounded z-50">
          Aller au contenu principal
        </a>
        <ClientSessionWrapper>
          <HeaderWithButtons />

          <main id="main-content" className="flex-grow" role="main">{children}</main>

          <Footer />
        </ClientSessionWrapper>
        <SpeedInsights />
        <CookieConsent />
      </body>
    </html>
  );
}