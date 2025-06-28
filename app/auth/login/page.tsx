'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FloatingParticles } from '@/components/ui/floating-particles';
import { Heart, Sparkles, ArrowRight, CheckCircle, Users, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      router.push('/dashboard');
      setIsLoading(false);
    }, 1000);
  };

  const benefits = [
    { icon: Heart, text: "Track your emotional wellness journey" },
    { icon: TrendingUp, text: "Discover patterns in your thoughts" },
    { icon: Sparkles, text: "AI-powered insights for growth" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      <FloatingParticles count={15} />
      
      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Benefits & Social Proof */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 space-y-12">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-slate-700">Join 10,000+ wellness seekers</span>
              </div>
              
              <h1 className="text-5xl font-semibold text-slate-800 leading-tight">
                Welcome back to your{' '}
                <span className="gradient-text-shine">wellness sanctuary</span>
              </h1>
              
              <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
                Continue your journey of self-discovery and emotional growth with AI-powered insights.
              </p>
            </div>

            <div className="space-y-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div 
                    key={index} 
                    className="flex items-center space-x-4 fade-enter"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center breathing-element">
                      <Icon className="w-6 h-6 text-indigo-600" />
                    </div>
                    <span className="text-lg text-slate-700">{benefit.text}</span>
                  </div>
                );
              })}
            </div>

            {/* Social Proof */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 space-y-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <span className="font-medium text-slate-800">Trusted by wellness enthusiasts</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full border-2 border-white" />
                  ))}
                </div>
                <div className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-800">Sarah, Mike, Emma</span> and 9,997+ others are on their wellness journey
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            {/* Mobile Header */}
            <div className="lg:hidden text-center space-y-4 mb-8">
              <Link href="/" className="inline-block text-slate-600 hover:text-slate-800 transition-colors">
                Back to home
              </Link>
              
              <div>
                <h1 className="text-3xl font-semibold text-slate-800">Welcome back</h1>
                <p className="text-slate-600">Continue your wellness journey</p>
              </div>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block text-center space-y-4 mb-8">
              <Link href="/" className="inline-block text-slate-600 hover:text-slate-800 transition-colors mb-6">
                Back to home
              </Link>
              
              <div>
                <h2 className="text-3xl font-semibold text-slate-800 mb-2">Sign in to continue</h2>
                <p className="text-slate-600">Your wellness journey awaits</p>
              </div>
            </div>

            {/* Login Form */}
            <Card className="wellness-card energy-pulse min-h-[580px]">
              <CardContent className="p-8 h-full flex flex-col justify-center">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Input
                        type="email"
                        placeholder="Your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="wellness-input h-14 text-lg text-slate-800 placeholder:text-slate-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <Input
                        type="password"
                        placeholder="Your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="wellness-input h-14 text-lg text-slate-800 placeholder:text-slate-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="text-center">
                    <Link href="#" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                      Forgot your password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full wellness-button h-14 text-lg text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Sparkles className="w-5 h-5 mr-3 animate-spin" />
                        Signing you in...
                      </>
                    ) : (
                      <>
                        Continue Your Journey
                        <ArrowRight className="w-5 h-5 ml-3" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-sm text-slate-600">
                    New to Karmic Wellness?{' '}
                    <Link href="/auth/signup" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                      Start your free journey
                    </Link>
                  </p>
                </div>

                {/* Trust Indicators */}
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <div className="flex items-center justify-center space-x-6 text-xs text-slate-500">
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Secure & Private</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Free to Start</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>No Spam</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}