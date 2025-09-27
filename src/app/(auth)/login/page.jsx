'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { useAuthStatus } from '@/utils/authUtils';
import { Skeleton } from '@/components/ui/skeleton';
import { Phone, KeyRound, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import { requestLoginOtp, verifyLoginOtp, resendOTP } from '@/services/otpService';

export default function OtpLoginPage() {
  const router = useRouter();
  const { isLoggedIn, ready } = useAuthStatus();
  const { setAccessToken, setUser } = useAuth();

  const [step, setStep] = useState('phone'); // "phone" | "otp"
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [otpSent, setOtpSent] = useState(false);

  // Auto redirect if already logged in
  useEffect(() => {
    if (ready && isLoggedIn) router.push('/');
  }, [ready, isLoggedIn]);

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
    if (!phone.trim()) return toast.error('Please enter your phone number');
    if (!/^\d{10}$/.test(phone)) return toast.error('Enter a valid 10-digit phone number');

    setLoading(true);
    try {
      await requestLoginOtp({ phone });
      toast.success('OTP sent successfully');
      setStep('otp');
      setOtpSent(true);
      setResendTimer(60);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Verify Login OTP
  // -----------------------------
  const handleVerify = async () => {
    if (!otp.trim()) return toast.error('Please enter the OTP');
    if (!/^\d{6}$/.test(otp)) return toast.error('OTP must be 6 digits');

    setLoading(true);
    try {
      const { accessToken, user } = await verifyLoginOtp({ phone, otp });
      setAccessToken(accessToken);
      setUser(user);
      toast.success('Login successful');
      router.push(user?.role === 'admin' ? '/admin/dashboard' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Resend OTP
  // -----------------------------
  const handleResend = async () => {
    if (resendTimer > 0) return;
    try {
      await resendOTP({ phone });
      toast.success('OTP resent successfully');
      setResendTimer(60);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
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
            src="https://blr1.vultrobjects.com/erental-object/378f01fe-2344-4c35-90d2-07dcd2236dd8.png"
            alt="Logo"
            width={80}
            height={40}
            priority
            unoptimized
            className="h-18 w-36 object-contain mix-blend-multiply"
          />
        </Link>

        {step === 'phone' && (
          <div className="space-y-4">
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                name="phone"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
                onChange={(e) => setOtp(e.target.value)}
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
              onClick={() => setStep('phone')}
              className="text-sm text-gray-500 hover:underline mt-2"
              disabled={loading}
            >
              Change phone number
            </button>
          </div>
        )}

        <div className="text-center text-sm text-gray-600">
          New user?{' '}
          <Link href="/register" className="text-blue-600 hover:underline">
            Create Account
          </Link>
        </div>
      </div>
    </main>
  );
}
