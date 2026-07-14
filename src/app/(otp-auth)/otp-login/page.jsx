'use client';

import { useState, useEffect, Suspense } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStatus } from '@/utils/authUtils';
import { Skeleton } from '@/components/ui/skeleton';
import { Phone, KeyRound, RotateCcw, AlertCircle, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { requestLoginOtp, verifyLoginOtp, resendOTP } from '@/services/otpService';

function OtpLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoggedIn, ready } = useAuthStatus();
  const { setAccessToken, setUser } = useAuth();

  const [step, setStep] = useState('phone'); // "phone" | "otp"
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [status, setStatus] = useState({ type: '', text: '' });

  // Auto redirect if already logged in
  useEffect(() => {
    if (ready && isLoggedIn) {
      const redirectParam = searchParams.get('redirect') || '/';
      router.push(redirectParam);
    }
  }, [ready, isLoggedIn, searchParams]);

  // Countdown for resend
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => setResendTimer((s) => s - 1), 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Reset OTP when phone changes
  useEffect(() => {
    if (!otpSent) setOtp('');
  }, [phone]);

  // -----------------------------
  // Request Login OTP
  // -----------------------------
  const handleRequestOtp = async () => {
    if (!phone.trim()) {
      setStatus({ type: 'error', text: 'Please enter your phone number' });
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      setStatus({ type: 'error', text: 'Enter a valid 10-digit phone number' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', text: '' });
    try {
      await requestLoginOtp({ phone });
      setStatus({ type: 'success', text: 'OTP sent successfully to your phone!' });
      setStep('otp');
      setOtpSent(true);
      setResendTimer(60);
    } catch (err) {
      setStatus({ type: 'error', text: err.response?.data?.message || err.message || 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Verify Login OTP
  // -----------------------------
  const handleVerify = async () => {
    if (!otp.trim()) {
      setStatus({ type: 'error', text: 'Please enter the OTP' });
      return;
    }
    if (!/^\d{6}$/.test(otp)) {
      setStatus({ type: 'error', text: 'OTP must be 6 digits' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', text: '' });
    try {
      const { data } = await verifyLoginOtp({ phone, otp });
      const { accessToken, user } = data;
      setAccessToken(accessToken);
      setUser(user);
      setStatus({ type: 'success', text: 'Login successful! Redirecting...' });
      const redirectParam = searchParams.get('redirect');
      const fallbackRedirect = user?.role === 'admin' ? '/admin/dashboard' : '/';
      router.push(redirectParam || fallbackRedirect);
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
    setStatus({ type: '', text: '' });
    try {
      await resendOTP({ phone });
      setStatus({ type: 'success', text: 'OTP resent successfully!' });
      setResendTimer(60);
    } catch (err) {
      setStatus({ type: 'error', text: err.response?.data?.message || err.message || 'Something went wrong' });
    }
  };

  // -----------------------------
  // Enter key handling
  // -----------------------------
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (step === 'phone') handleRequestOtp();
      if (step === 'otp') handleVerify();
    }
  };

  if (!ready) return <Skeleton className="w-full h-80 rounded-xl" />;

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

        {step === 'phone' && (
          <div className="space-y-4">
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
              onClick={handleRequestOtp}
              disabled={loading}
              className="w-full bg-blue-400 hover:bg-blue-600 rounded-full h-10"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </Button>
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
              {loading ? 'Verifying...' : 'Verify & Login'}
            </Button>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                {resendTimer > 0
                  ? `Resend available in ${resendTimer}s`
                  : 'Didn’t receive OTP?'}
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
                setStep('phone');
                setStatus({ type: '', text: '' });
              }}
              className="text-sm text-gray-500 hover:underline mt-2"
              disabled={loading}
            >
              Change phone number
            </button>
          </div>
        )}

        <div className="text-center text-sm text-gray-600">
          New user?{' '}
          <Link href="/register" className="text-blue-600 hover:underline" onClick={() => setStatus({ type: '', text: '' })}>
            Create Account
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function OtpLoginPage() {
  return (
    <Suspense fallback={<Skeleton className="w-full h-80 rounded-xl" />}>
      <OtpLoginContent />
    </Suspense>
  );
}
