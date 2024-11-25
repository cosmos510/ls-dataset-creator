import localFont from "next/font/local";
import { SpeedInsights } from '@vercel/speed-insights/next';
import "./globals.css";
import ClientSessionWrapper from './components/ClientSessionWrapper';

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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <ClientSessionWrapper>
          <main className="flex-grow">{children}</main> {/* Main content */}
          <footer className="text-center py-6 mt-auto text-lg text-gray-700">
          <p>© 2024 LSF Dataset. All rights reserved.</p>
          </footer>
        </ClientSessionWrapper>
        <SpeedInsights />
      </body>
    </html>
  );
}