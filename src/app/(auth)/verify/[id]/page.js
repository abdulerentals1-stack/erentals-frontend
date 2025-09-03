'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { verifyEmail } from '@/services/authService';
import { toast } from 'sonner';
import { Loader, CheckCircle2, XCircle } from 'lucide-react';
import { useAuthStatus } from '@/utils/authUtils';
import { Skeleton } from '@/components/ui/skeleton';
import { Lock } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';

export default function VerifyPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isLoggedIn, isAdmin, ready } = useAuthStatus();
  

  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleVerify = async () => {
    setStatus('loading');
    try {
      const res = await verifyEmail(id);
      setMessage(res.data.message || 'Email verified successfully!');
      setStatus('success');
      toast.success('Email verified! Redirecting to login...');
      setTimeout(() => router.push('/login'), 3000);
    } catch (err) {
      setMessage(err?.response?.data?.message || 'Invalid or expired token');
      setStatus('error');
      toast.error('Verification failed');
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
    <div className="min-h-screen flex flex-col justify-center items-center px-4 text-center space-y-4 bg-gray-50">
      {/* <h2 className="text-xl font-semibold">Email Verification</h2> */}
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

      {status === 'idle' && (
        <>
          <p className="text-muted-foreground">Click the button below to verify your email.</p>
          <button
            onClick={handleVerify}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 cursor-pointer rounded-full font-medium"
          >
            Verify Email
          </button>
        </>
      )}

      {status === 'loading' && (
        <>
          <Loader className="animate-spin text-blue-500 h-6 w-6" />
          <p>Verifying your email...</p>
        </>
      )}

      {status === 'success' && (
        <>
          <CheckCircle2 className="text-green-500 h-8 w-8" />
          <p className="text-green-600">{message}</p>
          <p className="text-sm text-muted-foreground">Redirecting to login...</p>
        </>
      )}

      {status === 'error' && (
        <>
          <XCircle className="text-red-500 h-8 w-8" />
          <p className="text-red-600">{message}</p>
        </>
      )}
    </div>
  );
}
