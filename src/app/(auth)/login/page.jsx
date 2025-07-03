'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { loginUser } from '@/services/authService';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
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

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 border border-gray-200 rounded-xl p-6 shadow-md bg-white">
        <h1 className="text-2xl font-semibold text-center">Login to Erentals</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="emailOrPhone"
            placeholder="Email or Phone"
            value={form.emailOrPhone}
            onChange={handleChange}
          />
          <Input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div className="flex justify-between text-sm text-gray-600">
          <Link href="/forgot" className="hover:text-blue-600">
            Forgot Password?
          </Link>
          <Link href="/register" className="hover:text-blue-600">
            New here? Register
          </Link>
        </div>
      </div>
    </main>
  );
}
