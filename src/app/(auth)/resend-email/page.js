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
import { Mail } from "lucide-react";
import Image from 'next/image';

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
        }
      }, [isLoggedIn, isAdmin, ready]);
    
      if (!ready) return <Skeleton className="w-full h-80 rounded-xl" />;

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-sm space-y-4 border border-gray-200 rounded-xl p-6 shadow-md bg-white">
        {/* <h2 className="text-2xl font-semibold text-center">Resend Verification Email</h2> */}
        <Link href="/" className='flex justify-center'>
              <Image
                  src="https://blr1.vultrobjects.com/erental-object/378f01fe-2344-4c35-90d2-07dcd2236dd8.png"
                  alt="Logo"
                  width={80}
                  height={40}
                  priority // 👈 forces SSR load
                  unoptimized   // 👈 disables optimization
                  className="h-18 w-36 object-contain mix-blend-multiply"
                />
              {/* e-Renalts */}
            </Link>
        <form onSubmit={handleResend} className="space-y-4">
          <div className="relative">
    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
    
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="pl-10 h-10"
          />
          </div>
          <Button type="submit" className="w-full h-10 bg-blue-400 hover:bg-blue-600 cursor-pointer rounded-full" disabled={loading}>
            {loading ? 'Sending...' : 'Send Varification Link'}
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
