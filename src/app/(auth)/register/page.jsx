// app/auth/register/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { registerUser } from '@/services/authService';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStatus } from '@/utils/authUtils';
import { Skeleton } from '@/components/ui/skeleton';


export default function RegisterPage() {

  const router = useRouter();
  const { isLoggedIn, isAdmin, ready } = useAuthStatus();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('form');
  const [registeredEmail, setRegisteredEmail] = useState('');


  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await registerUser(form);
      toast.success(data.message || 'Verification email sent!');
      setRegisteredEmail(form.email);
      setStep('verify');
      // setTimeout(() => router.push('/verify-info'), 2000);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed');
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
        <h2 className="text-2xl font-semibold text-center">
          {step === 'form' ? 'Create Your Account' : 'Check Your Email'}
        </h2>

        {step === 'form' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
            <Input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
            <Input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Register'}
            </Button>
          </form>
        ) : (
          <div className="text-center space-y-3">
            <p className="text-sm text-green-600">
              ✅ A verification email was sent to <br />
              <span className="font-semibold">{registeredEmail}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Didn’t receive it?{' '}
              <Link href="/resend-email" className="text-blue-600 hover:underline">
                Resend email
              </Link>
            </p>
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
