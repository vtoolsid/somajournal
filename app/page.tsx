'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FloatingParticles } from '@/components/ui/floating-particles';
import { useRouter } from 'next/navigation';
import { Heart, BookOpen, Sparkles, ArrowRight, TrendingUp, Brain, Bot as Lotus } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  const features = [
    {
      icon: Lotus,
      title: 'Mindful Journaling',
      description: 'Transform your thoughts into insights in a space designed for deep self-discovery.',
    },
    {
      icon: Brain,
      title: 'Karmic Insights',
      description: 'Discover the hidden patterns in your emotional and spiritual journey with AI guidance.',
    },
    {
      icon: Heart,
      title: 'Mind-Body Harmony',
      description: 'Understand the beautiful connections between your thoughts, emotions, and physical wellbeing.',
    },
  ];

  return (
    <div className="min-h-screen wellness-container">
      <FloatingParticles count={20} />
      
      {/* Header */}
      <header className="relative z-10 border-b border-white/20 bg-white/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center breathing-element">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-800">Karmic Wellness</h1>
                <p className="text-xs text-slate-500">Digital wellness sanctuary</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/auth/login')}
                className="text-slate-600 hover:text-slate-800 hover:bg-white/50 rounded-2xl px-6 py-3"
              >
                Sign In
              </Button>
              <Button
                onClick={() => router.push('/auth/signup')}
                className="wellness-button"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <div className="fade-enter">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full mb-8 breathing-element">
              <Sparkles className="w-12 h-12 text-indigo-600" />
            </div>
            
            <h1 className="text-7xl font-semibold text-slate-800 leading-tight mb-8">
              Your wellness journey,{' '}
              <span className="gradient-text-shine">
                beautifully illuminated
              </span>
            </h1>
            
            <p className="text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              A digital sanctuary where your thoughts transform into wisdom, 
              your emotions find harmony, and your spirit discovers its true patterns.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8 fade-enter">
            <Button
              size="lg"
              onClick={() => router.push('/auth/signup')}
              className="wellness-button text-xl px-12 py-6"
            >
              <Heart className="w-6 h-6 mr-3" />
              Begin Your Journey
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push('/auth/login')}
              className="text-xl px-12 py-6 border-slate-200 text-slate-700 hover:bg-white/50 rounded-2xl"
            >
              <BookOpen className="w-6 h-6 mr-3" />
              Continue Writing
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20 space-y-6 fade-enter">
            <h2 className="text-5xl font-semibold text-slate-800">
              Nurture your inner wisdom
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Ancient wisdom meets modern technology to create a space where your inner world 
              can flourish and find its natural rhythm.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="fade-enter"
                  style={{ animationDelay: `${index * 0.3}s` }}
                >
                  <Card className="wellness-card h-full">
                    <CardContent className="p-10 text-center space-y-6 h-full flex flex-col">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full breathing-element">
                        <Icon className="w-10 h-10 text-indigo-600" />
                      </div>
                      <h3 className="text-2xl font-semibold text-slate-800">{feature.title}</h3>
                      <p className="text-slate-600 leading-relaxed text-lg flex-1">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="fade-enter">
            <Card className="wellness-card energy-pulse">
              <CardContent className="p-16 text-center space-y-8">
                <div className="space-y-6">
                  <h2 className="text-4xl font-semibold text-slate-800">
                    Ready to begin your wellness journey?
                  </h2>
                  <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    Take the first step towards deeper self-understanding, 
                    inner peace, and the beautiful discovery of your personal patterns.
                  </p>
                </div>
                
                <div className="flex justify-center space-x-2 mb-8">
                  {['root', 'sacral', 'solar', 'heart', 'throat', 'third-eye', 'crown'].map((chakra, index) => (
                    <div
                      key={chakra}
                      className={`w-4 h-4 rounded-full chakra-${chakra} breathing-element`}
                      style={{ animationDelay: `${index * 0.2}s` }}
                    />
                  ))}
                </div>
                
                <Button
                  size="lg"
                  onClick={() => router.push('/auth/signup')}
                  className="wellness-button text-xl px-16 py-6"
                >
                  <Sparkles className="w-6 h-6 mr-3" />
                  Start Your Journey
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/20 bg-white/20 backdrop-blur-sm py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center breathing-element">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-semibold text-slate-800">Karmic Wellness</span>
                <p className="text-xs text-slate-500">Digital wellness sanctuary</p>
              </div>
            </div>
            <div className="flex space-x-8 text-sm text-slate-500">
              <a href="#" className="hover:text-slate-700 transition-colors">About</a>
              <a href="#" className="hover:text-slate-700 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-700 transition-colors">Terms of Service</a>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/20 text-center text-sm text-slate-500">
            © 2024 Karmic Wellness. Crafted with love and intention for your wellness journey.
          </div>
        </div>
      </footer>
    </div>
  );
}