// app/auth/resend/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { resendVerification } from '@/services/authService';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStatus } from '@/utils/authUtils';
import { Skeleton } from '@/components/ui/skeleton';

export default function ResendVerificationPage() {
  const router = useRouter();
  const { isLoggedIn, isAdmin, ready } = useAuthStatus();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResend = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Enter your email');
    setLoading(true);
    try {
      const res = await resendVerification({ email });
      toast.success(res.data.message || 'Verification link sent!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to resend');
    } finally {
      setLoading(false);
    }
  };

   useEffect(() => {
        if (!ready) return; // avoid flickering during hydration
    
        if (isLoggedIn) {
          router.push('/');
        } else if (isAdmin) {
          router.push('/admin/dashboard');
        }
      }, [isLoggedIn, isAdmin, ready]);
    
      if (!ready) return <Skeleton className="w-full h-80 rounded-xl" />;

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 border border-gray-200 rounded-xl p-6 shadow-md bg-white">
        <h2 className="text-2xl font-semibold text-center">Resend Verification Email</h2>
        <form onSubmit={handleResend} className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Sending...' : 'Send Link'}
          </Button>
        </form>
        <div className="text-center text-sm text-gray-600">
          Go back to{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}
