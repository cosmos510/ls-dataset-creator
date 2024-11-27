import localFont from "next/font/local";
import { SpeedInsights } from '@vercel/speed-insights/next';
import "./globals.css";
import ClientSessionWrapper from './components/ClientSessionWrapper';
import CookieConsent from './components/CookieConsent';
import HeaderWithButtons from './components/HeaderWithButtons';

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
  title: "LSF-dataset",
  description: "Build the LSF dataset together",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <ClientSessionWrapper>
          {/* Utilisation du composant Header avec les boutons interactifs */}
          <HeaderWithButtons />

          {/* Main content */}
          <main className="flex-grow">{children}</main>

          {/* Footer */}
          <footer className="bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-gray-300 py-6 mt-auto text-lg text-center">
            <p>
              © {new Date().getFullYear()} LSF Dataset. All rights reserved.{' '}
              <a 
                href="/privacy" 
                className="text-indigo-400 underline hover:text-indigo-300 transition-colors duration-200"
              >
                Politique de Confidentialité
              </a>
            </p>
          </footer>
        </ClientSessionWrapper>
        <SpeedInsights />
        <CookieConsent />
      </body>
    </html>
  );
}