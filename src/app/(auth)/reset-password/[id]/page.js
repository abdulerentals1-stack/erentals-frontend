'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { resetPassword } from '@/services/authService';
import { toast } from 'sonner';
import Link from 'next/link';
import { useAuthStatus } from '@/utils/authUtils';
import { Skeleton } from '@/components/ui/skeleton';
import { Lock } from "lucide-react";
import Image from 'next/image';

export default function ResetPasswordPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isLoggedIn, isAdmin, ready } = useAuthStatus();
  const [form, setForm] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleReset = async (e) => {
    e.preventDefault();

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword(id, { password: form.password });
      toast.success(res.data.message || 'Password reset successful');
      router.push('/login');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };


   useEffect(() => {
        if (!ready) return; // avoid flickering during hydration
    
        if (isLoggedIn) {
          router.push('/');
        } 
      }, [isLoggedIn, isAdmin, ready]);
    
      if (!ready) return <Skeleton className="w-full h-80 rounded-xl" />;

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-sm space-y-4 border border-gray-200 rounded-xl p-6 shadow-md bg-white">
        {/* <h2 className="text-2xl font-semibold text-center">Reset Your Password</h2> */}

         <Link href="/" className='flex justify-center'>
              <Image
            src="/e-rental-logo.png"
            alt="Logo"
            width={160}
            height={60}
            priority
            unoptimized
            className="w-20 md:w-28 h-auto object-contain mx-auto"
          />
              {/* e-Renalts */}
            </Link>

        <form onSubmit={handleReset} className="space-y-4">
          <div className="relative">
    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />

          <Input
            name="password"
            type="password"
            placeholder="Enter new password"
            value={form.password}
            onChange={handleChange}
            required
            className="pl-10 h-10"
          />
          </div>
          <div className="relative">
    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />

          <Input
            name="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="pl-10 h-10"
          />
          </div>
          <Button type="submit" className="w-full h-10 bg-blue-400 hover:bg-blue-600 cursor-pointer rounded-full" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>

        <div className="text-center text-sm text-gray-600 underline">
          Go back to{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login?
          </Link>
        </div>
      </div>
    </main>
  );
}
