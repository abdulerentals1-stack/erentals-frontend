'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { loginUser } from '@/services/authService';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { useAuthStatus } from '@/utils/authUtils';
import { Skeleton } from '@/components/ui/skeleton';
import { Mail, Lock } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const { isLoggedIn, isAdmin, ready } = useAuthStatus();
  const { setAccessToken, setUser } = useAuth();

  const [form, setForm] = useState({ emailOrPhone: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await loginUser(form);
      setAccessToken(data.accessToken);
      setUser(data.user);
      toast.success('Login successful');

      // Redirect based on role
      router.push(data.user.role === 'admin' ? '/admin/dashboard' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
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
        {/* <h1 className="text-2xl font-semibold text-center">Login to Erentals</h1> */}
      
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


        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
                name="emailOrPhone"
                placeholder="Email or Phone"
                value={form.emailOrPhone}
                onChange={handleChange}
                className='pl-10 h-10'
              />
          </div> 
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className='pl-10 h-10'
          />
          </div>

<div className="flex flex-col space-y-2 text-sm">
  <Link href="/forgot" className="text-blue-600 hover:underline">
    Forgot your password?
  </Link>
  {/* <p className="text-gray-600">
    Didn’t receive a verification email?{" "}
    <Link href="/resend-email" className="text-blue-600 hover:underline font-medium">
      Resend
    </Link>
  </p> */}
</div>


          <Button
            type="submit"
            className="w-full bg-blue-400 hover:bg-blue-600 cursor-pointer rounded-full h-10"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div className='text-center'>or</div>

        <Link href="/register" className="hover:text-blue-600">
           <Button
            className="w-full bg-gray-200 hover:bg-gray-300 cursor-pointer text-black rounded-full h-10"
          >
            Create New Account
          </Button>
        </Link>

        {/* <div className="flex justify-between text-sm text-gray-600">
          <Link href="/forgot" className="hover:text-blue-600">
            Forgot Password?
          </Link>
          <Link href="/register" className="hover:text-blue-600">
            New here? Register
          </Link>
        </div> */}
      </div>
    </main>
  );
}
