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
  title: {
    template: '%s | Corpus LSF',
    default: 'Corpus LSF - Dictionnaire Langue des Signes Française'
  },
  description: "Contribuez à la création du plus grand dictionnaire LSF collaboratif pour améliorer l'accessibilité des personnes sourdes et malentendantes. Plateforme développée par Webamax.",
  keywords: "LSF, langue des signes française, dictionnaire, accessibilité, IA, reconnaissance gestuelle, Webamax",
  authors: [{ name: "Webamax", url: "https://www.webamax.fr" }],
  creator: "Webamax",
  publisher: "Webamax",
  robots: "index, follow",
  openGraph: {
    title: "Corpus LSF - Dictionnaire Langue des Signes Française",
    description: "Contribuez à la création du plus grand dictionnaire LSF collaboratif pour améliorer l'accessibilité des personnes sourdes et malentendantes. Plateforme développée par Webamax.",
    url: "https://lsf-dataset-creator.up.railway.app",
    siteName: "Corpus LSF",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Corpus LSF - Dictionnaire Langue des Signes Française",
    description: "Contribuez à la création du plus grand dictionnaire LSF collaboratif pour améliorer l'accessibilité des personnes sourdes et malentendantes.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-white relative`}
        style={{ margin: 0, padding: 0 }}
      >
        <div 
          className="fixed inset-0 -z-10"
          style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #a855f7 50%, #ec4899 100%)'
          }}
        />
        <div className="flex flex-col min-h-screen">
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
        </div>
      </body>
    </html>
  );
}