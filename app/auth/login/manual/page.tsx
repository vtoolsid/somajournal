'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { ChakraRing } from '@/components/ui/chakra-ring';

export default function ManualLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAppStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const mockUser = {
        id: 'user-1',
        email,
        name: email.split('@')[0],
        timezone: 'UTC',
        createdAt: new Date(),
      };
      
      login(mockUser);
      console.log('🔐 User login completed, redirecting to wellbeing assessment for first-time completion');
      // For now, all users go to assessment - in production, check assessment status
      router.push('/wellbeing-assessment');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Back Navigation - Fixed positioning following industry standards */}
      <div className="fixed top-6 left-6 z-10">
        <Link 
          href="/auth/login" 
          className="inline-flex items-center text-sm text-gray-600 hover:text-slate-800 transition-colors bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to sign-in options
        </Link>
      </div>

      {/* Left Side - Chakra System */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="absolute inset-0 flex items-center justify-center">
          <ChakraRing className="w-full h-full max-w-4xl max-h-4xl" />
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 bg-white">
        <div className="max-w-md mx-auto w-full">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-medium text-slate-800 mb-2">
              Welcome back
            </h1>
            <p className="text-gray-600">
              Sign in to continue your wellness journey
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-slate-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter your email"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-slate-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex items-center justify-end">
              <div className="text-sm">
                <Link href="#" className="font-medium text-green-600 hover:text-green-700">
                  Forgot your password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-green-600 hover:text-green-700 font-medium">
                Sign up here.
              </Link>
            </p>
            
            <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-500">
              <Link href="#" className="hover:text-gray-700">Terms of Use</Link>
              <span>|</span>
              <Link href="#" className="hover:text-gray-700">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}