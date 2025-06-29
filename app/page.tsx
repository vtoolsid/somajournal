'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FloatingParticles } from '@/components/ui/floating-particles';
import { KarmicAura } from '@/components/ui/karmic-aura';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  Sparkles, 
  ArrowRight, 
  Brain, 
  Zap, 
  Compass, 
  Waves, 
  Sun, 
  Moon, 
  Star, 
  Flower2,
  Circle,
  Eye,
  Target,
  Activity
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const router = useRouter();
  const [isChakraHovered, setIsChakraHovered] = useState(false);
  const [hoveredChakra, setHoveredChakra] = useState<string | null>(null);

  // Horizontal Human Body Silhouette (lying down)
  const HorizontalBodySilhouette = () => (
    <svg 
      width="300" 
      height="120" 
      viewBox="0 0 300 120" 
      className="mx-auto opacity-30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="horizontalBodyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#E5E5E5" stopOpacity="0.2"/>
          <stop offset="50%" stopColor="#E5E5E5" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#E5E5E5" stopOpacity="0.2"/>
        </linearGradient>
      </defs>
      
      {/* Head */}
      <ellipse cx="270" cy="60" rx="20" ry="25" fill="url(#horizontalBodyGradient)" stroke="#E5E5E5" strokeWidth="1"/>
      
      {/* Neck */}
      <rect x="245" y="55" width="15" height="10" fill="url(#horizontalBodyGradient)" stroke="#E5E5E5" strokeWidth="1"/>
      
      {/* Torso */}
      <ellipse cx="170" cy="60" rx="60" ry="30" fill="url(#horizontalBodyGradient)" stroke="#E5E5E5" strokeWidth="1"/>
      
      {/* Arms */}
      <ellipse cx="150" cy="35" rx="30" ry="8" fill="url(#horizontalBodyGradient)" stroke="#E5E5E5" strokeWidth="1"/>
      <ellipse cx="150" cy="85" rx="30" ry="8" fill="url(#horizontalBodyGradient)" stroke="#E5E5E5" strokeWidth="1"/>
      
      {/* Pelvis */}
      <ellipse cx="100" cy="60" rx="20" ry="25" fill="url(#horizontalBodyGradient)" stroke="#E5E5E5" strokeWidth="1"/>
      
      {/* Legs */}
      <ellipse cx="50" cy="50" rx="40" ry="12" fill="url(#horizontalBodyGradient)" stroke="#E5E5E5" strokeWidth="1"/>
      <ellipse cx="50" cy="70" rx="40" ry="12" fill="url(#horizontalBodyGradient)" stroke="#E5E5E5" strokeWidth="1"/>
    </svg>
  );

  const features = [
    {
      icon: Heart,
      title: 'Emotional Awareness',
      description: 'Track and understand your emotional patterns through mindful journaling and reflection.',
      chakra: 'heart',
      color: 'from-green-400 to-emerald-500'
    },
    {
      icon: Activity,
      title: 'Mind-Body Connection',
      description: 'Discover how your emotions manifest as physical symptoms and learn to heal holistically.',
      chakra: 'solar',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      icon: Brain,
      title: 'Wellness Insights',
      description: 'Gain personalized insights into your mental and physical health patterns over time.',
      chakra: 'third-eye',
      color: 'from-indigo-400 to-purple-500'
    },
  ];

  const chakraElements = [
    { 
      name: 'Root', 
      icon: Circle, 
      color: 'bg-red-500', 
      description: 'Foundation & Security',
      emotion: 'Feeling grounded, secure, and connected to earth',
      location: 'Base of spine'
    },
    { 
      name: 'Sacral', 
      icon: Waves, 
      color: 'bg-orange-500', 
      description: 'Creativity & Passion',
      emotion: 'Expressing creativity, sexuality, and emotional flow',
      location: 'Lower abdomen'
    },
    { 
      name: 'Solar', 
      icon: Sun, 
      color: 'bg-yellow-500', 
      description: 'Personal Power',
      emotion: 'Confidence, self-esteem, and inner strength',
      location: 'Upper abdomen'
    },
    { 
      name: 'Heart', 
      icon: Heart, 
      color: 'bg-green-500', 
      description: 'Love & Compassion',
      emotion: 'Unconditional love, empathy, and connection',
      location: 'Center of chest'
    },
    { 
      name: 'Throat', 
      icon: Compass, 
      color: 'bg-blue-500', 
      description: 'Communication & Truth',
      emotion: 'Authentic expression and speaking your truth',
      location: 'Throat area'
    },
    { 
      name: 'Third Eye', 
      icon: Eye, 
      color: 'bg-indigo-500', 
      description: 'Intuition & Insight',
      emotion: 'Inner wisdom, clarity, and spiritual awareness',
      location: 'Between eyebrows'
    },
    { 
      name: 'Crown', 
      icon: Star, 
      color: 'bg-purple-500', 
      description: 'Divine Connection',
      emotion: 'Spiritual enlightenment and universal consciousness',
      location: 'Top of head'
    },
  ];

  return (
    <div className="min-h-screen wellness-container">
      <FloatingParticles count={20} />
      
      {/* Header */}
      <header className="relative z-10 border-b border-white/20 bg-white/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <KarmicAura karma={0.8} intensity="medium">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center breathing-element">
                  <Flower2 className="w-7 h-7 text-white" />
                </div>
              </KarmicAura>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Karmic Wellness
                </h1>
                <p className="text-sm text-slate-500 font-medium">✨ Digital Enlightenment Sanctuary</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="hidden sm:flex bg-white/60 text-slate-600 border-white/40">
                <Sparkles className="w-3 h-3 mr-1" />
                Beta
              </Badge>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  onClick={() => router.push('/auth/login')}
                  className="text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 rounded-lg px-4 py-2 font-medium transition-all duration-200 text-sm"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => router.push('/auth/signup')}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-5 py-2 rounded-lg text-sm transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-16">
          <div className="fade-enter">
            {/* Chakra Mandala */}
            <div className="relative inline-flex items-center justify-center mb-12">
              <div className="absolute inset-0 animate-spin-slow">
                <div className="w-32 h-32 rounded-full border-2 border-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 opacity-30"></div>
              </div>
              <KarmicAura karma={0.9} intensity="strong">
                <div className="w-28 h-28 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-full flex items-center justify-center breathing-element shadow-2xl">
                  <div className="w-20 h-20 bg-gradient-to-br from-white/20 to-white/5 rounded-full flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                </div>
              </KarmicAura>
            </div>
            
            <div className="space-y-8">
              <h1 className="text-7xl font-semibold text-slate-800 leading-tight">
                Bridge the gap between{' '}
                <span className="gradient-text-shine">
                  mental and physical
                </span>
                {' '}health
              </h1>
              
              <p className="text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                A comprehensive wellness platform that connects your mind and body, 
                helping you achieve holistic health through integrated mental and physical well-being practices.
              </p>
            </div>
          </div>
          
          {/* Chakra Energy Bar */}
          <div 
            className={`chakra-container flex justify-center items-center space-x-6 py-12 mb-16 fade-enter ${isChakraHovered ? 'chakra-hovered' : ''}`}
            onMouseEnter={() => setIsChakraHovered(true)}
            onMouseLeave={() => {
              setIsChakraHovered(false);
              setHoveredChakra(null);
            }}
          >
            {chakraElements.map((chakra, index) => {
              const Icon = chakra.icon;
              return (
                <div
                  key={chakra.name}
                  className={`chakra-item relative transition-opacity duration-300 ${
                    hoveredChakra && hoveredChakra !== chakra.name ? 'opacity-30' : 'opacity-100'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onMouseEnter={() => {
                    setHoveredChakra(chakra.name);
                  }}
                  onMouseLeave={() => {
                    setHoveredChakra(null);
                  }}
                >
                  
                  <div 
                    className={`w-10 h-10 ${chakra.color} rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-md relative overflow-hidden`}
                  >
                    <Icon className="w-5 h-5 text-white relative z-10" />
                    <div className={`absolute inset-0 ${chakra.color} opacity-20 transition-opacity duration-300`}></div>
                  </div>
                  
                  {/* Simple Tooltip */}
                  <div className="chakra-tooltip absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 opacity-0 transition-all duration-300 pointer-events-none z-50">
                    <div className={`bg-white rounded-xl shadow-xl border border-gray-200 p-4 w-80 flex flex-col justify-between ${isChakraHovered ? 'h-[150px]' : ''}`}>
                      {/* Tooltip Arrow */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-white"></div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className={`w-4 h-4 ${chakra.color} rounded-full`}></div>
                          <h3 className="font-semibold text-gray-900">{chakra.name} Chakra</h3>
                        </div>
                        <p className="text-sm text-gray-600 font-medium">{chakra.description}</p>
                        <p className="text-xs text-gray-500 italic">{chakra.emotion}</p>
                        <div className="flex items-center text-xs text-gray-400 pt-1 border-t border-gray-100">
                          <Target className="w-3 h-3 mr-1" />
                          {chakra.location}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-center pt-8 fade-enter">
            <Button
              size="lg"
              onClick={() => router.push('/auth/signup')}
              className="wellness-button text-xl px-16 py-8 text-lg font-semibold"
            >
              Begin the Journey
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-8 fade-enter">
            <h2 className="text-6xl font-bold text-slate-800">
              Illuminate your{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                spiritual essence
              </span>
            </h2>
            <p className="text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
              Discover the divine technology that bridges ancient wisdom with modern consciousness, 
              creating a harmonious space for your soul&apos;s evolution.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="group border-0 bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 hover:shadow-lg text-left">
                  <CardContent className="p-6 text-left">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="mb-2 text-left">
                      <h3 className="text-xl font-semibold text-slate-900 mb-2 text-left">{feature.title}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed mb-4 text-left">
                        {feature.description}
                      </p>
                    </div>
                    
                    <div className="text-left">
                      <Button variant="ghost" size="sm" className="justify-start text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 p-0 h-auto font-medium text-left">
                        Learn more
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="relative z-10 border-t border-white/20 bg-white/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
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
          <div className="mt-8 pt-8 border-t border-white/20 text-center text-sm text-slate-500">
            © 2024 Karmic Wellness. Crafted with love and intention for your wellness journey.
          </div>
        </div>
      </footer>
    </div>
  );
}