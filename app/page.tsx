'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FloatingParticles } from '@/components/ui/floating-particles';
import { SomaLogo } from '@/components/ui/soma-logo';
import { WellnessGradientBackground } from '@/components/ui/wellness-gradient-background';
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
  Lightbulb,
  Edit3,
  Play,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const router = useRouter();
  const [showSanskrit, setShowSanskrit] = useState(true);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);


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

  const howItWorksSteps = [
    {
      icon: Edit3,
      title: 'Journal Freely',
      description: 'Write about your day, your feelings, and your thoughts. No prompts, no rules.',
      technical: 'Advanced AI processes your natural writing to understand emotional context',
      position: 'top-right',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: Brain,
      title: 'Proprietary AI Analysis',
      description: 'Our machine learning system analyzes your text using proprietary algorithms trained on extensive emotion research.',
      technical: 'Clinical-grade accuracy identifies complex emotional patterns in real-time',
      position: 'bottom-left',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: Heart,
      title: 'Body Mapping Intelligence',
      description: 'Research-backed algorithms translate emotions into personalized body maps with actionable wellness insights.',
      technical: 'Combines multiple clinical studies with advanced AI for personalized recommendations',
      position: 'bottom-right',
      color: 'from-green-500 to-teal-600'
    },
  ];

  const faqItems = [
    {
      question: "Is my journal data private and secure?",
      answer: "Your privacy is our top priority. We use Supabase with end-to-end encryption to ensure your journal entries remain completely private. Your data is encrypted before it leaves your device, and only you have the decryption key."
    },
    {
      question: "How accurate is the AI analysis?",
      answer: "Our AI is powered by a fine-tuned model trained on extensive emotional research. While it provides clinical-grade insights with high accuracy, it continuously learns and improves from aggregate patterns. Think of it as a highly educated assistant that gets better over time."
    },
    {
      question: "Is this a replacement for medical advice?",
      answer: "No. SomaJournal is a wellness tool designed for self-awareness and emotional understanding. While it can help you identify patterns between emotions and physical symptoms, it is not a medical diagnostic tool and should not replace professional medical advice."
    },
    {
      question: "How quickly will I see results?",
      answer: "Most users report gaining valuable insights within their first week of consistent journaling. The AI needs just a few entries to start identifying patterns, but deeper insights emerge with regular use over 2-3 weeks."
    },
    {
      question: "What makes this different from other journaling apps?",
      answer: "Unlike basic mood trackers or traditional journals, SomaJournal uses advanced AI to reveal the hidden connections between your emotions and physical symptoms. It's the only app that provides psychosomatic insights backed by clinical research."
    },
    {
      question: "Can I export my data?",
      answer: "Yes! You own your data. You can export all your journal entries, analyses, and insights at any time in multiple formats including PDF and CSV."
    }
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
    <main className="opal-wrapper min-h-screen">
      <WellnessGradientBackground intensity="vibrant" cycleDuration={12} />
      <FloatingParticles count={20} />
      
      {/* Header */}
      <header className="relative z-10 border-b border-white/20 bg-white/20 backdrop-blur-sm full-bleed">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-1">
              <SomaLogo size="lg" className="breathing-element -mt-1" priority />
              <div className="flex flex-col justify-center -mt-0.5">
                <h1 className="text-2xl font-bold leading-tight">
                  <span className="text-gray-900">Soma</span><span style={{color: '#5a8db4'}}>Journal</span>
                </h1>
                <p className="text-lg text-slate-500 font-medium -mt-0.5">Your AI Mind-Body Analyst</p>
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
                  className="text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 rounded-lg px-4 py-2 font-medium transition-all duration-200 text-lg"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => router.push('/auth/signup')}
                  className="relative overflow-hidden text-white font-medium px-5 py-2 rounded-lg text-lg transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105"
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

      {/* OPAL Hero Section - Full Screen */}
      <div className="opal-hero-container full-bleed relative z-10">
        <div className="opal-wrapper w-full">
          <div className="flex flex-col items-center text-center space-y-16">
            {/* Chakra Mandala with Parallax */}
            <div className="opal-parallax-wrapper relative inline-flex items-center justify-center mb-12">
              <div className="opal-parallax-element absolute inset-0 animate-spin-slow" style={{ "--movement": "20px" } as React.CSSProperties}>
                <div className="w-32 h-32 rounded-full border-2 border-gradient-to-r from-green-200 via-emerald-200 to-teal-200 opacity-30"></div>
              </div>
              <div className="opal-parallax-element w-28 h-28 bg-gradient-to-br from-green-500 via-emerald-600 to-teal-500 rounded-full flex items-center justify-center breathing-element shadow-2xl" style={{ "--movement": "15px" } as React.CSSProperties}>
                <div className="w-20 h-20 bg-gradient-to-br from-white/20 to-white/5 rounded-full flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>
            
            <div className="space-y-8 max-w-6xl">
              {/* Main Heading with OPAL reveal effect */}
              <h1 className="text-7xl font-medium leading-[1.1] tracking-tight">
                <span className="gradient-text-shine">
                  Map Your Mind.
                </span>
                {' '}
                <span className="gradient-text-shine">
                  Heal Your Body.
                </span>
              </h1>
              
              <p className="text-2xl text-white max-w-2xl mx-auto leading-[1.4] font-light drop-shadow-lg">
                The first intelligent journal that uses AI to decode your emotional patterns and reveal their direct impact on your physical well-being.
              </p>
              
              {/* Trust Badges */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mt-8">
                <div className="flex items-center space-x-3 px-6 py-3 bg-white/95 backdrop-blur-sm rounded-full border border-white/40 shadow-lg">
                  <Heart className="w-5 h-5 text-green-600" />
                  <span className="text-lg text-green-700 font-semibold">Join 1,200+ users</span>
                </div>
                
                <div className="flex items-center space-x-3 px-6 py-3 bg-white/95 backdrop-blur-sm rounded-full border border-white/40 shadow-lg">
                  <Database className="w-5 h-5 text-blue-600" />
                  <span className="text-lg text-blue-700 font-semibold">Built on 58,000+ emotional expressions</span>
                </div>
                
                <div className="flex items-center space-x-3 px-6 py-3 bg-white/95 backdrop-blur-sm rounded-full border border-white/40 shadow-lg">
                  <Shield className="w-5 h-5 text-slate-600" />
                  <span className="text-lg text-slate-700 font-semibold">Clinically validated</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center pt-6">
              <Button
                size="lg"
                onClick={() => router.push('/auth/signup')}
                className="wellness-button text-xl px-16 py-8 text-lg font-semibold"
              >
                Analyze Your First Entry
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* OPAL Scroll-Triggered Text Reveal Section */}
      <div className="opal-scroll-section">
        <div className="sticky-content">
          <div className="opal-wrapper">
            <div className="text-center full-bleed px-7 md:px-14 lg:px-20">
              <h2 className="opal-reveal-text wellness-theme supports-[animation-timeline]:text-2xl md:text-3xl lg:text-4xl lg:leading-[1.3]">
                Your body feels off but you can't figure out why. Apps track your thoughts but miss the real connections. It's time to understand what your body is telling you.
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Problem Section */}
      <section className="relative z-10 py-24 px-6 bg-slate-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-6 fade-enter">
            <h2 className="text-5xl font-bold text-slate-800 tracking-tight">
              You Know{' '}
              <span className="bg-gradient-to-r from-slate-600 to-gray-600 bg-clip-text text-transparent">
                Something's Missing
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-[1.4] font-light">
              Your mind and body are connected, but you've never had a map to understand how. 
              Sound familiar?
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {problemPoints.map((problem, index) => {
              const Icon = problem.icon;
              return (
                <Card key={index} className="group border-0 bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-300 hover:shadow-lg relative overflow-hidden">
                  <CardContent className="p-8 text-left relative z-10">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${problem.color} flex items-center justify-center mb-6 opacity-70`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold text-slate-800 mb-3">{problem.title}</h3>
                      <p className="text-lg font-medium text-slate-700 mb-4 italic text-center">
                        "{problem.question}"
                      </p>
                      <p className="text-slate-600 text-lg leading-[1.4]">
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
          
          <div className="text-center mt-8 fade-enter">
            <p className="text-lg text-slate-600 font-medium">
              There <em>is</em> a way to bridge this gap...
            </p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto items-start">
            {/* Left Column - Video Placeholder */}
            <div className="fade-enter">
              <div className="relative group cursor-pointer">
                {/* Video Card */}
                <Card className="border-0 bg-white/80 backdrop-blur-sm hover:bg-white/95 transition-all duration-300 hover:shadow-xl overflow-hidden">
                  <CardContent className="p-0">
                    {/* Placeholder Video Background */}
                    <div className="relative h-[300px] bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center">
                      {/* Abstract pattern background */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-10 left-10 w-32 h-32 bg-green-200 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-10 right-10 w-40 h-40 bg-teal-200 rounded-full blur-3xl"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-200 rounded-full blur-3xl"></div>
                      </div>
                      
                      {/* Play Button */}
                      <div className="relative z-10 w-24 h-24 bg-white rounded-full shadow-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-10 h-10 text-green-600 ml-1 fill-current" />
                      </div>
                      
                      {/* Video Duration Badge */}
                      <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-md text-lg font-medium">
                        2:45
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* TODO: Implement video modal on click
                   * 1. Add state for modal visibility
                   * 2. Create modal component with video embed
                   * 3. Add click handler to open modal
                   * 4. Support YouTube/Vimeo embed or custom video player
                   */}
              </div>
              
              <p className="text-center mt-4 text-lg text-slate-600">
                Watch how SomaJournal transforms your journaling experience
              </p>
            </div>
            
            {/* Right Column - Content */}
            <div className="fade-enter text-center lg:text-left">
              <div>
                <h3 className="text-3xl font-bold text-slate-800 tracking-tight mb-4">
                  What is SomaJournal?
                </h3>
                <div className="space-y-4 text-slate-600">
                  <p className="text-lg leading-[1.4]">
                    SomaJournal is an intelligent journaling app that reveals the hidden connections between your emotions and physical symptoms. Write about your day, and instantly see which emotions are affecting your body and where.
                  </p>
                  <p className="text-lg leading-[1.4]">
                    Get personalized body maps, track emotional patterns, and receive evidence-based recommendations to break negative cycles—all through simple daily journaling.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8 fade-enter">
            <p className="text-lg text-slate-700 font-semibold">
              While other apps ask how you feel, SomaJournal shows you exactly where you feel it—and what to do about it.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 py-24 px-6 bg-gradient-to-br from-slate-50/50 to-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-6 fade-enter">
            <h2 className="text-5xl font-bold text-slate-800 tracking-tight">
              How It{' '}
              <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-[1.4] font-light">
              Three simple steps to decode your body's messages
            </p>
          </div>
          
          {/* Horizontal Step Flow Layout */}
          <div className="max-w-6xl mx-auto fade-enter">
            {/* Step Numbers Row with Single Continuous Line */}
            <div className="relative mb-8">
              {/* Continuous connecting line */}
              <div className="hidden lg:block absolute top-8 left-[16.67%] right-[16.67%] h-0.5 bg-gradient-to-r from-green-300 via-teal-400 to-green-300 transform -translate-y-1/2"></div>
              
              {/* Step Numbers */}
              <div className="grid grid-cols-3 gap-6 relative z-10">
                {howItWorksSteps.map((step, index) => (
                  <div key={index} className="flex justify-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Step Cards Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {howItWorksSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <Card key={index} className="border-0 bg-white/80 backdrop-blur-sm hover:bg-white/95 hover:shadow-lg transition-all duration-300 h-full w-full">
                    <CardContent className="p-6 text-center h-full flex flex-col">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 mx-auto shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 tracking-tight mb-3">{step.title}</h3>
                      <p className="text-slate-700 leading-[1.4] mb-3 font-medium flex-grow">{step.description}</p>
                      <p className="text-lg text-slate-500 leading-[1.4] italic">{step.technical}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
          
          {/* CTA Button */}
          <div className="text-center mt-8 fade-enter">
            <Button
              size="lg"
              onClick={() => router.push('/auth/signup')}
              className="wellness-button text-lg px-12 py-6 font-semibold"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Your Healing Journey
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 py-32 px-6 bg-gradient-to-b from-white to-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-6 fade-enter">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Users className="w-8 h-8 text-green-600" />
              <h2 className="text-5xl font-bold text-slate-800 tracking-tight">
                Real people,{' '}
                <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                  real healing
                </span>
              </h2>
            </div>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-[1.4] font-light">
              Discover how our users uncovered the hidden connections between their emotions and physical symptoms
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
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
                    <blockquote className="text-lg font-medium text-slate-800 mb-6 leading-[1.4]">
                      "{testimonial.quote}"
                    </blockquote>
                    
                    {/* User Info */}
                    <div className="text-center">
                      <p className="font-semibold text-slate-800">{testimonial.name}</p>
                      <p className="text-lg text-slate-500">Age {testimonial.age}</p>
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

      {/* FAQ Section */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 space-y-6 fade-enter">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <HelpCircle className="w-8 h-8 text-green-600" />
              <h2 className="text-5xl font-bold text-slate-800 tracking-tight">
                Frequently Asked{' '}
                <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                  Questions
                </span>
              </h2>
            </div>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-[1.4] font-light">
              Everything you need to know about SomaJournal
            </p>
          </div>
          
          <div className="space-y-4 fade-enter">
            {faqItems.map((faq, index) => (
              <Card key={index} className="border border-slate-200 bg-white/80 backdrop-blur-sm hover:bg-white/95 transition-all duration-200">
                <CardContent className="p-0">
                  <button
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-50/50 transition-colors duration-200"
                  >
                    <h3 className="text-lg font-semibold text-slate-800 pr-4">
                      {faq.question}
                    </h3>
                    {openFAQ === index ? (
                      <ChevronUp className="w-5 h-5 text-slate-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-500 flex-shrink-0" />
                    )}
                  </button>
                  
                  {openFAQ === index && (
                    <div className="px-6 pb-6 pt-0">
                      <p className="text-slate-600 leading-[1.4] max-w-lg">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
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
                  className="text-4xl leading-[1.4] font-medium text-slate-800 max-w-4xl"
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
                  className="text-4xl leading-[1.4] mb-6 font-medium text-slate-800 max-w-4xl"
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
            <div className="flex space-x-8 text-lg text-slate-500">
              <a href="#" className="hover:text-slate-700 transition-colors">About</a>
              <a href="#" className="hover:text-slate-700 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-700 transition-colors">Terms of Service</a>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/20 text-center text-lg text-slate-500">
            © 2024 SomaJournal. Crafted with love and intention for your journaling journey.
          </div>
        </div>
      </footer>

    </main>
  );
}