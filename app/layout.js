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
  title: "LSF-dataset",
  description: "Build the LSF dataset together",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-400 text-white px-4`}
      >
        <ClientSessionWrapper>
          <HeaderWithButtons />

          {/* Main content */}
          <main className="flex-grow">{children}</main>

          <Footer />
        </ClientSessionWrapper>
        <SpeedInsights />
        <CookieConsent />
      </body>
    </html>
  );
}