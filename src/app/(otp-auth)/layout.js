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
  title: "OTP Verification – e-Rentals.in",
  description: "Securely sign in or sign up with single-use verification passcode access on e-Rentals India.",
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
