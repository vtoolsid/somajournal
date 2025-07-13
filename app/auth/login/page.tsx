'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSignIn } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { SomaLogo } from '@/components/ui/soma-logo';
import Link from 'next/link';
import { ChakraRing } from '@/components/ui/chakra-ring';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signIn } = useSignIn();

  const handleGoogleSignin = async () => {
    try {
      setIsLoading(true);
      await signIn?.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/wellbeing-assessment',
      });
    } catch (error) {
      console.error('Google sign-in error:', error);
      setIsLoading(false);
    }
  };

  const handleManualSignin = () => {
    setIsLoading(true);
    // Smooth transition to manual signin
    setTimeout(() => {
      router.push('/auth/login/manual');
    }, 100);
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Left Side - Chakra System */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="absolute inset-0 flex items-center justify-center">
          <ChakraRing className="w-full h-full max-w-4xl max-h-4xl" />
        </div>
      </div>

      {/* Right Side - Sign-in Options */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 bg-white">
        <div className="max-w-sm mx-auto w-full">
          {/* Header */}
          <div className="mb-12">
            {/* Simple Brand Identity */}
            <div className="flex justify-center mb-12">
              <SomaLogo size="xl" priority />
            </div>
            
            <div className="text-center">
              <h1 className="text-5xl font-bold text-black mb-2 leading-tight">
                Welcome back to your wellness journey
              </h1>
            </div>
          </div>

          {/* Sign-in Options */}
          <div className="space-y-6 mb-16">
            {/* Google Sign-in Button */}
            <Button
              onClick={handleGoogleSignin}
              disabled={isLoading}
              className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Sign in with Google</span>
            </Button>

            {/* Manual Sign-in Button */}
            <Button
              onClick={handleManualSignin}
              disabled={isLoading}
              variant="outline"
              className="w-full py-4 px-6 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-800 font-medium rounded-lg transition-all duration-200"
            >
              {isLoading ? 'Loading...' : 'Sign in with email'}
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-green-600 hover:text-green-700 font-medium">
                Sign up here.
              </Link>
            </p>
            
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
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