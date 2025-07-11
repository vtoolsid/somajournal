'use client';

import { SignIn } from '@clerk/nextjs';
import { SomaLogo } from '@/components/ui/soma-logo';
import { ChakraRing } from '@/components/ui/chakra-ring';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Left Side - Chakra System */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="absolute inset-0 flex items-center justify-center">
          <ChakraRing className="w-full h-full max-w-4xl max-h-4xl" />
        </div>
      </div>

      {/* Right Side - Sign-in Form */}
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

          {/* Clerk Sign-in Component */}
          <div className="space-y-6 mb-16">
            <SignIn 
              forceRedirectUrl="/dashboard"
              fallbackRedirectUrl="/dashboard"
              appearance={{
                elements: {
                  formButtonPrimary: 
                    "w-full py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200",
                  card: "shadow-none border-0 w-full",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: 
                    "w-full py-4 px-6 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-800 font-medium rounded-lg transition-all duration-200",
                  formFieldInput: 
                    "w-full py-3 px-4 border-2 border-gray-300 focus:border-green-500 rounded-lg",
                  footerActionLink: "text-green-600 hover:text-green-700 font-medium"
                }
              }}
            />
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