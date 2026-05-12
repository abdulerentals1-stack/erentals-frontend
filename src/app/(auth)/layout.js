import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { AuthProvider } from '../../context/AuthContext';
import { Toaster } from 'sonner';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Secure Login & Registration – e-Rentals.in",
  description: "Securely sign in or create an account on e-Rentals India to request quotations, manage orders, and unlock curated rental catalogs.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
           <Toaster position="top-center" richColors />
           {children}
        </AuthProvider>
      </body>
    </html>
  );
}
