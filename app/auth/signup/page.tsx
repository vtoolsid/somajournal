'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FloatingParticles } from '@/components/ui/floating-particles';
import { Heart, Sparkles, ArrowRight, CheckCircle, Users, Star, Zap } from 'lucide-react';
import Link from 'next/link';

export default function SignUpPage() {
  const [name, setName] = useState('');
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
        name,
        timezone: 'UTC',
        createdAt: new Date(),
      };
      
      login(mockUser);
      router.push('/onboarding');
      setIsLoading(false);
    }, 1000);
  };

  const features = [
    { icon: Heart, text: "AI-powered emotional insights", highlight: "Most loved feature" },
    { icon: Sparkles, text: "Personalized wellness tracking", highlight: "Trending" },
    { icon: Zap, text: "Daily mindfulness reminders", highlight: "Popular" }
  ];

  const testimonials = [
    { name: "Sarah M.", text: "This app changed how I understand my emotions", rating: 5 },
    { name: "David K.", text: "Finally, a wellness app that actually works", rating: 5 },
    { name: "Emma L.", text: "My anxiety has decreased significantly", rating: 5 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      <FloatingParticles count={20} />
      
      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Value Proposition */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 space-y-12">
          <div className="space-y-8">
            {/* Urgency/Scarcity */}
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-100 to-red-100 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-orange-700">Limited: Free access ending soon</span>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-5xl font-semibold text-slate-800 leading-tight">
                Transform your life with{' '}
                <span className="gradient-text-shine">AI-powered wellness</span>
              </h1>
              
              <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
                Join thousands who've discovered deeper self-awareness and emotional balance through intelligent journaling.
              </p>
            </div>

            {/* Social Proof Numbers */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">10K+</div>
                <div className="text-sm text-slate-600">Active users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">4.9★</div>
                <div className="text-sm text-slate-600">App rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">85%</div>
                <div className="text-sm text-slate-600">Feel better</div>
              </div>
            </div>

            {/* Features with Benefits */}
            <div className="space-y-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-xl fade-enter"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-indigo-600" />
                      </div>
                      <span className="text-slate-700 font-medium">{feature.text}</span>
                    </div>
                    <span className="text-xs bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-2 py-1 rounded-full">
                      {feature.highlight}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Testimonials */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">What our users say:</h3>
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white/60 backdrop-blur-sm rounded-xl p-4 space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-slate-800">{testimonial.name}</span>
                  </div>
                  <p className="text-sm text-slate-600 italic">"{testimonial.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Sign Up Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            {/* Mobile Header */}
            <div className="lg:hidden text-center space-y-4 mb-8">
              <Link href="/" className="inline-block text-slate-600 hover:text-slate-800 transition-colors">
                Back to home
              </Link>
              
              <div>
                <h1 className="text-3xl font-semibold text-slate-800">Start your journey</h1>
                <p className="text-slate-600">Join thousands finding inner peace</p>
              </div>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block text-center space-y-4 mb-8">
              <Link href="/" className="inline-block text-slate-600 hover:text-slate-800 transition-colors mb-6">
                Back to home
              </Link>
              
              <div>
                <h2 className="text-3xl font-semibold text-slate-800 mb-2">Start free today</h2>
                <p className="text-slate-600">No credit card required • Cancel anytime</p>
              </div>
            </div>

            {/* Sign Up Form */}
            <Card className="wellness-card energy-pulse min-h-[580px]">
              <CardContent className="p-8 h-full flex flex-col justify-center">
                {/* Urgency Banner */}
                <div className="mb-6 p-3 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl text-center">
                  <p className="text-sm font-medium text-orange-700">
                    🔥 Free premium features for first 1,000 users
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Input
                        type="text"
                        placeholder="Your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="wellness-input h-14 text-lg text-slate-800 placeholder:text-slate-500"
                        required
                      />
                    </div>

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
                        placeholder="Create a secure password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="wellness-input h-14 text-lg text-slate-800 placeholder:text-slate-500"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full wellness-button h-14 text-lg text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Sparkles className="w-5 h-5 mr-3 animate-spin" />
                        Creating your sanctuary...
                      </>
                    ) : (
                      <>
                        Start Your Free Journey
                        <ArrowRight className="w-5 h-5 ml-3" />
                      </>
                    )}
                  </Button>
                </form>

                {/* Trust Indicators */}
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-center space-x-6 text-xs text-slate-500">
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>100% Free</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>No Spam Ever</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Cancel Anytime</span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-center text-slate-500">
                    By signing up, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-sm text-slate-600">
                    Already have an account?{' '}
                    <Link href="/auth/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Additional Social Proof */}
            <div className="text-center space-y-3 mt-6">
              <div className="flex items-center justify-center space-x-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-medium text-slate-700">Join 10,000+ wellness seekers</span>
              </div>
              <div className="flex justify-center -space-x-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full border-2 border-white breathing-element" style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}