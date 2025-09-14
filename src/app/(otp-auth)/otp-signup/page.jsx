'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Phone, KeyRound, UserPlus, RotateCcw } from 'lucide-react';
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

  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => setResendTimer((s) => s - 1), 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  // -----------------------------
  // Signup / Request OTP
  // -----------------------------
  const handleSignup = async () => {
    if (!name.trim()) return toast.error('Name is required');
    if (!phone.trim()) return toast.error('Phone number is required');
    if (!/^\d{10}$/.test(phone)) return toast.error('Enter a valid 10-digit phone number');

    setLoading(true);
    try {
      await requestSignupOtp({ name, phone, whatsappConsent });
      toast.success('OTP sent successfully');
      setStep('otp');
      setResendTimer(60); // 1 min cooldown
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Verify OTP
  // -----------------------------
  const handleVerify = async () => {
    if (!otp.trim()) return toast.error('Enter the OTP');
    if (!/^\d{6}$/.test(otp)) return toast.error('OTP must be 6 digits');

    setLoading(true);
    try {
      const { accessToken, user } = await verifySignupOtp({ phone, otp, name });
      setAccessToken(accessToken);
      setUser(user);
      toast.success('Signup successful');
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
    setLoading(true);
    try {
      await resendOTP({ phone });
      toast.success('OTP resent successfully');
      setResendTimer(60); // reset cooldown
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
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
            src="https://blr1.vultrobjects.com/erental-object/378f01fe-2344-4c35-90d2-07dcd2236dd8.png"
            alt="Logo"
            width={80}
            height={40}
            priority
            unoptimized
            className="h-18 w-36 object-contain mix-blend-multiply"
          />
        </Link>

        {step === 'details' && (
          <div className="space-y-4">
            <div className="relative">
              <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                name="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                onChange={(e) => setPhone(e.target.value)}
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
              onClick={() => setStep('details')}
              className="text-sm text-gray-500 hover:underline mt-2"
              disabled={loading}
            >
              Change details
            </button>
          </div>
        )}

        <div className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}
