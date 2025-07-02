'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FloatingParticles } from '@/components/ui/floating-particles';
import { SomaLogo } from '@/components/ui/soma-logo';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  Sparkles, 
  ArrowRight, 
  Brain, 
  Activity,
  Shield,
  Database,
  Award,
  Users,
  Quote,
  HelpCircle,
  Unlink,
  BarChart3,
  CheckCircle,
  Target,
  Lightbulb
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const router = useRouter();
  const [showSanskrit, setShowSanskrit] = useState(true);

  // Meditative quotes for cycling
  const quotes = [
    {
      id: "english-quote",
      text: "Every mental knot has a corresponding physical, muscular knot.",
      author: "",
      isEnglish: true
    },
    {
      id: "sanskrit-quote", 
      text: "मानसिकं बन्धं शरीरिकं स्नायविकं बन्धं समं भवति",
      author: "- Satyananda Saraswati",
      isEnglish: false
    }
  ];


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
      color: 'from-teal-400 to-cyan-500'
    },
  ];

  const problemPoints = [
    {
      icon: HelpCircle,
      title: 'The Physical Mystery',
      question: 'Why does stress give me headaches?',
      description: 'You feel the physical symptoms but can\'t connect them to your emotional state. Your body is sending signals, but you don\'t have the map to decode them.',
      color: 'from-slate-400 to-gray-500'
    },
    {
      icon: Unlink,
      title: 'The Journaling Gap',
      question: 'Why doesn\'t journaling give me real insights?',
      description: 'You write about your feelings, but it feels like venting without understanding. You want to see the deeper patterns and physical connections.',
      color: 'from-blue-400 to-slate-500'
    },
    {
      icon: BarChart3,
      title: 'The Shallow Tracking Gap',
      question: 'Why do mood apps feel so basic?',
      description: 'Current mood trackers give you basic emotions and simple charts, but they don\'t reveal the deeper mind-body connections. You want to understand WHY you feel certain ways physically.',
      color: 'from-orange-400 to-slate-500'
    },
  ];

  const solutionCards = [
    {
      icon: CheckCircle,
      title: 'Decode Physical Mysteries',
      benefit: 'No more wondering why stress gives you headaches',
      result: 'Get clear connections between your emotions and physical symptoms',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Target,
      title: 'Transform Journaling Into Insights',
      benefit: 'Turn venting into actionable body awareness',
      result: 'See exactly where your emotions live in your body',
      color: 'from-teal-500 to-cyan-600'
    },
    {
      icon: Lightbulb,
      title: 'Go Beyond Basic Mood Tracking',
      benefit: 'Get personalized mind-body intelligence',
      result: 'Understand what to do about your emotional patterns',
      color: 'from-blue-500 to-indigo-600'
    },
  ];

  const testimonials = [
    {
      name: 'Sarah',
      age: 28,
      quote: 'Finally understand why stress gives me headaches',
      icon: Brain,
      color: 'from-purple-400 to-indigo-500'
    },
    {
      name: 'Mike',
      age: 31,
      quote: 'My anxiety stomach pain makes sense now',
      icon: Activity,
      color: 'from-orange-400 to-red-500'
    },
    {
      name: 'Lisa',
      age: 26,
      quote: 'Stopped my tension headaches by addressing root emotions',
      icon: Heart,
      color: 'from-green-400 to-teal-500'
    },
  ];


  return (
    <div className="min-h-screen wellness-container">
      <FloatingParticles count={20} />
      
      {/* Header */}
      <header className="relative z-10 border-b border-white/20 bg-white/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-1">
              <SomaLogo size="lg" className="breathing-element -mt-1" priority />
              <div className="flex flex-col justify-center -mt-0.5">
                <h1 className="text-2xl font-bold leading-tight">
                  <span className="text-gray-900">Soma</span><span style={{color: '#5a8db4'}}>Journal</span>
                </h1>
                <p className="text-sm text-slate-500 font-medium -mt-0.5">Your AI Mind-Body Analyst</p>
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
                  className="relative overflow-hidden text-white font-medium px-5 py-2 rounded-lg text-sm transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105"
                >
                  <span 
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(90deg, #22c55e 0%, #10b981 15%, #059669 30%, #10b981 45%, #0ea5e9 60%, #10b981 75%, #059669 85%, #22c55e 100%)',
                      backgroundSize: '200% 100%',
                      animation: 'gradient-shine 6s ease infinite'
                    }}
                  />
                  <span className="relative z-10">Get Started</span>
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
            <div className="relative inline-flex items-center justify-center mb-16">
              <div className="absolute inset-0 animate-spin-slow">
                <div className="w-32 h-32 rounded-full border-2 border-gradient-to-r from-green-200 via-emerald-200 to-teal-200 opacity-30"></div>
              </div>
              <div className="w-28 h-28 bg-gradient-to-br from-green-500 via-emerald-600 to-teal-500 rounded-full flex items-center justify-center breathing-element shadow-2xl">
                <div className="w-20 h-20 bg-gradient-to-br from-white/20 to-white/5 rounded-full flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <h1 className="text-7xl font-medium text-slate-800 leading-tight">
                <span className="gradient-text-shine">
                  Map Your Mind.
                </span>
                {' '}
                <span className="gradient-text-shine">
                  Heal Your Body.
                </span>
              </h1>
              
              <p className="text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
                The first intelligent journal that uses AI to decode your emotional patterns and reveal their direct impact on your physical well-being.
              </p>
              
              {/* Trust Badges - Under Subtitle */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 mt-8 fade-enter">
                {/* User Count Badge */}
                <div className="flex items-center space-x-3 px-6 py-3 bg-green-50/90 backdrop-blur-sm rounded-full border border-green-200/80 shadow-md">
                  <Heart className="w-5 h-5 text-green-600" />
                  <span className="text-base text-green-700 font-semibold">Join 1,200+ users</span>
                </div>
                
                {/* Dataset Badge */}
                <div className="flex items-center space-x-3 px-6 py-3 bg-blue-50/90 backdrop-blur-sm rounded-full border border-blue-200/80 shadow-md">
                  <Database className="w-5 h-5 text-blue-600" />
                  <span className="text-base text-blue-700 font-semibold">Built on 58,000+ emotional expressions</span>
                </div>
                
                {/* Clinical Badge */}
                <div className="flex items-center space-x-3 px-6 py-3 bg-slate-50/90 backdrop-blur-sm rounded-full border border-slate-200/80 shadow-md">
                  <Shield className="w-5 h-5 text-slate-600" />
                  <span className="text-base text-slate-700 font-semibold">Clinically validated</span>
                </div>
              </div>
            </div>
          </div>
          
          
          <div className="flex justify-center pt-8 fade-enter">
            <Button
              size="lg"
              onClick={() => router.push('/auth/signup')}
              className="wellness-button text-xl px-16 py-8 text-lg font-semibold"
            >
              Analyze Your First Entry
            </Button>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="relative z-10 py-24 px-6 bg-slate-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-6 fade-enter">
            <h2 className="text-5xl font-bold text-slate-800">
              You Know{' '}
              <span className="bg-gradient-to-r from-slate-600 to-gray-600 bg-clip-text text-transparent">
                Something's Missing
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
              Your mind and body are connected, but you've never had a map to understand how. 
              Sound familiar?
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {problemPoints.map((problem, index) => {
              const Icon = problem.icon;
              return (
                <Card key={index} className="group border-0 bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-300 hover:shadow-lg relative overflow-hidden">
                  <CardContent className="p-8 text-center relative z-10">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${problem.color} flex items-center justify-center mb-6 mx-auto opacity-70`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold text-slate-800 mb-3">{problem.title}</h3>
                      <p className="text-lg font-medium text-slate-700 mb-4 italic">
                        "{problem.question}"
                      </p>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {problem.description}
                      </p>
                    </div>
                  </CardContent>
                  
                  {/* Subtle muted background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-gray-100 opacity-20"></div>
                </Card>
              );
            })}
          </div>
          
          <div className="text-center mt-12 fade-enter">
            <p className="text-lg text-slate-600 font-medium">
              There <em>is</em> a way to bridge this gap...
            </p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-6 fade-enter">
            <h2 className="text-5xl font-bold text-slate-800">
              Here's How We{' '}
              <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                Bridge That Gap
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
              SomaJournal is the first intelligent journal that translates your emotions into a visual map of your body, using AI trained on clinical research to reveal exactly how your feelings manifest physically.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {solutionCards.map((solution, index) => {
              const Icon = solution.icon;
              return (
                <Card key={index} className="group border-0 bg-white/80 backdrop-blur-sm hover:bg-white/95 transition-all duration-300 hover:shadow-xl relative overflow-hidden">
                  <CardContent className="p-8 text-center relative z-10">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${solution.color} flex items-center justify-center mb-6 mx-auto shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-slate-800 mb-3">{solution.title}</h3>
                      <p className="text-lg font-semibold text-green-700 mb-4">
                        {solution.benefit}
                      </p>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {solution.result}
                      </p>
                    </div>
                  </CardContent>
                  
                  {/* Bright background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${solution.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
                </Card>
              );
            })}
          </div>
          
          <div className="text-center mt-12 fade-enter">
            <p className="text-lg text-slate-700 font-semibold">
              While other apps ask how you feel, SomaJournal shows you exactly where you feel it—and what to do about it.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-8 fade-enter">
            <h2 className="text-6xl font-bold text-slate-800">
              Illuminate your{' '}
              <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                spiritual essence
              </span>
            </h2>
            <p className="text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
              Discover the divine technology that bridges ancient wisdom with modern consciousness, 
              creating a harmonious space for your soul&apos;s evolution.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                      <Button variant="ghost" size="sm" className="justify-start text-green-600 hover:text-green-700 hover:bg-green-50 p-0 h-auto font-medium text-left">
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

      {/* Testimonials Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-6 fade-enter">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Users className="w-8 h-8 text-green-600" />
              <h2 className="text-5xl font-bold text-slate-800">
                Real people,{' '}
                <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                  real healing
                </span>
              </h2>
            </div>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
              Discover how our users uncovered the hidden connections between their emotions and physical symptoms
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => {
              const Icon = testimonial.icon;
              return (
                <Card key={index} className="group border-0 bg-white/70 backdrop-blur-sm hover:bg-white/90 transition-all duration-300 hover:shadow-xl relative overflow-hidden">
                  <CardContent className="p-8 text-center relative z-10">
                    {/* Quote Icon */}
                    <div className="flex justify-center mb-6">
                      <Quote className="w-8 h-8 text-slate-400" />
                    </div>
                    
                    {/* Testimonial Quote */}
                    <blockquote className="text-lg font-medium text-slate-800 mb-6 leading-relaxed">
                      "{testimonial.quote}"
                    </blockquote>
                    
                    {/* User Info */}
                    <div className="text-center">
                      <p className="font-semibold text-slate-800">{testimonial.name}</p>
                      <p className="text-sm text-slate-500">Age {testimonial.age}</p>
                    </div>
                  </CardContent>
                  
                  {/* Subtle background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Meditative Quote Cycle Section */}
      <section className="relative z-10 py-24 px-6 pb-32">
        <div className="max-w-6xl mx-auto text-center">
          <div className="space-y-12 max-w-5xl mx-auto fade-enter">
            <div className="relative min-h-40 flex items-center justify-center px-8">
              {/* English Quote - On Hover */}
              <div
                className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000 ease-in-out cursor-pointer ${
                  !showSanskrit ? 'opacity-100' : 'opacity-0'
                }`}
                onMouseEnter={() => setShowSanskrit(false)}
                onMouseLeave={() => setShowSanskrit(true)}
              >
                <blockquote 
                  className="text-4xl leading-relaxed font-medium text-slate-800 max-w-4xl"
                  style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                >
                  {quotes[0].text}
                </blockquote>
              </div>

              {/* Sanskrit Quote - Default */}
              <div
                className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000 ease-in-out cursor-pointer ${
                  showSanskrit ? 'opacity-100' : 'opacity-0'
                }`}
                onMouseEnter={() => setShowSanskrit(false)}
                onMouseLeave={() => setShowSanskrit(true)}
              >
                <blockquote 
                  className="text-4xl leading-relaxed mb-6 font-medium text-slate-800 max-w-4xl"
                  style={{ fontFamily: '"Poppins", "Noto Sans Devanagari", sans-serif' }}
                >
                  {quotes[1].text}
                </blockquote>
                <cite 
                  className="text-lg text-slate-600 font-normal"
                  style={{ fontFamily: '"Poppins", "Noto Sans Devanagari", sans-serif' }}
                >
                  {quotes[1].author}
                </cite>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/20 bg-white/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <SomaLogo size="sm" className="breathing-element" />
              <div>
                <span className="text-lg font-semibold text-slate-800">SomaJournal</span>
                <p className="text-xs text-slate-500">Mindful journaling companion</p>
              </div>
            </div>
            <div className="flex space-x-8 text-sm text-slate-500">
              <a href="#" className="hover:text-slate-700 transition-colors">About</a>
              <a href="#" className="hover:text-slate-700 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-700 transition-colors">Terms of Service</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/20 text-center text-sm text-slate-500">
            © 2024 SomaJournal. Crafted with love and intention for your journaling journey.
          </div>
        </div>
      </footer>
    </div>
  );
}