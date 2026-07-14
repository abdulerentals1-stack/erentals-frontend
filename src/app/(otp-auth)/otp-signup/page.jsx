'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Phone, KeyRound, UserPlus, RotateCcw, AlertCircle, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import {
  requestSignupOtp,
  verifySignupOtp,
  resendOTP,
} from '@/services/otpService';

export default function OtpSignupPage() {
  const router = useRouter();
  const { setAccessToken, setUser } = useAuth();

  const [step, setStep] = useState('details'); // "details" | "otp"
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsappConsent, setWhatsappConsent] = useState(true);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [status, setStatus] = useState({ type: '', text: '' });

  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => setResendTimer((s) => s - 1), 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  // -----------------------------
  // Signup / Request OTP
  // -----------------------------
  const handleSignup = async () => {
    if (!name.trim()) {
      setStatus({ type: 'error', text: 'Name is required' });
      return;
    }
    if (!phone.trim()) {
      setStatus({ type: 'error', text: 'Phone number is required' });
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      setStatus({ type: 'error', text: 'Enter a valid 10-digit phone number' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', text: '' });
    try {
      await requestSignupOtp({ name, phone, whatsappConsent });
      setStatus({ type: 'success', text: 'OTP sent successfully to your phone!' });
      setStep('otp');
      setResendTimer(60); // 1 min cooldown
    } catch (err) {
      setStatus({ type: 'error', text: err.response?.data?.message || err.message || 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Verify OTP
  // -----------------------------
  const handleVerify = async () => {
    if (!otp.trim()) {
      setStatus({ type: 'error', text: 'Enter the OTP' });
      return;
    }
    if (!/^\d{6}$/.test(otp)) {
      setStatus({ type: 'error', text: 'OTP must be 6 digits' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', text: '' });
    try {
      const { accessToken, user } = await verifySignupOtp({ phone, otp, name });
      setAccessToken(accessToken);
      setUser(user);
      setStatus({ type: 'success', text: 'Signup successful! Redirecting...' });
      router.push(user?.role === 'admin' ? '/admin/dashboard' : '/');
    } catch (err) {
      setStatus({ type: 'error', text: err.response?.data?.message || err.message || 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Resend OTP
  // -----------------------------
  const handleResend = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    setStatus({ type: '', text: '' });
    try {
      await resendOTP({ phone });
      setStatus({ type: 'success', text: 'OTP resent successfully!' });
      setResendTimer(60); // reset cooldown
    } catch (err) {
      setStatus({ type: 'error', text: err.response?.data?.message || err.message || 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Handle Enter key press
  // -----------------------------
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (step === 'details') handleSignup();
      if (step === 'otp') handleVerify();
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-sm space-y-5 border border-gray-200 rounded-xl p-6 shadow-md bg-white">
        <Link href="/" className="flex justify-center">
          <Image
            src="/e-rental-logo.png"
            alt="Logo"
            width={160}
            height={60}
            priority
            unoptimized
            className="w-20 md:w-28 h-auto object-contain mx-auto"
          />
        </Link>

        {status.text && (
          <div className={`p-3 rounded-lg border flex items-start gap-2 animate-pulse ${
            status.type === 'error' 
              ? 'bg-red-50 text-red-700 border-red-200' 
              : 'bg-green-50 text-green-700 border-green-200'
          }`}>
            {status.type === 'error' ? (
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
            )}
            <span className="text-xs">{status.text}</span>
          </div>
        )}

        {step === 'details' && (
          <div className="space-y-4">
            <div className="relative">
              <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                name="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setStatus({ type: '', text: '' });
                }}
                onKeyDown={handleKeyDown}
                className="pl-10 h-10"
                disabled={loading}
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                name="phone"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setStatus({ type: '', text: '' });
                }}
                onKeyDown={handleKeyDown}
                className="pl-10 h-10"
                disabled={loading}
              />
            </div>

            <Button
              onClick={handleSignup}
              disabled={loading}
              className="w-full bg-blue-400 hover:bg-blue-600 rounded-full h-10"
            >
              {loading ? 'Sending OTP...' : 'Sign Up & Send OTP'}
            </Button>

            <div className="flex items-center justify-center text-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={whatsappConsent}
                onChange={(e) => setWhatsappConsent(e.target.checked)}
                disabled={loading}
                id="whatsappConsent"
                className="w-4 h-4"
              />
              <label htmlFor="whatsappConsent">receive WhatsApp updates</label>
            </div>
          </div>
        )}

        {step === 'otp' && (
          <div className="space-y-4">
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                name="otp"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  setStatus({ type: '', text: '' });
                }}
                onKeyDown={handleKeyDown}
                className="pl-10 h-10 tracking-widest"
                disabled={loading}
              />
            </div>

            <Button
              onClick={handleVerify}
              disabled={loading}
              className="w-full bg-blue-400 hover:bg-blue-600 rounded-full h-10"
            >
              {loading ? 'Verifying...' : 'Verify & Complete Signup'}
            </Button>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                {resendTimer > 0 ? `Resend available in ${resendTimer}s` : 'Didn’t receive OTP?'}
              </span>
              <button
                type="button"
                onClick={handleResend}
                disabled={resendTimer > 0 || loading}
                className="flex items-center gap-1 text-blue-600 hover:underline disabled:opacity-40"
              >
                <RotateCcw className="w-4 h-4" />
                Resend
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setStep('details');
                setStatus({ type: '', text: '' });
              }}
              className="text-sm text-gray-500 hover:underline mt-2"
              disabled={loading}
            >
              Change details
            </button>
          </div>
        )}

        <div className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline" onClick={() => setStatus({ type: '', text: '' })}>
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}
