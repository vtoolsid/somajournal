'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Flower2, Eye, EyeOff, Check, X, Circle, Sparkles, Heart, Brain } from 'lucide-react';
import Link from 'next/link';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    gender: '',
    age: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAppStore();
  const router = useRouter();

  // Password validation
  const passwordChecks = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /\d/.test(formData.password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
  };

  const isPasswordValid = Object.values(passwordChecks).every(check => check);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) return;
    
    setIsLoading(true);

    setTimeout(() => {
      const mockUser = {
        id: 'user-1',
        email: formData.email,
        name: formData.name,
        timezone: 'UTC',
        createdAt: new Date(),
      };
      
      login(mockUser);
      router.push('/onboarding');
      setIsLoading(false);
    }, 1000);
  };

  const PasswordCheck = ({ isValid, text }: { isValid: boolean; text: string }) => (
    <div className="flex items-center space-x-2 text-sm">
      {isValid ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <X className="w-4 h-4 text-gray-300" />
      )}
      <span className={isValid ? 'text-green-600' : 'text-gray-500'}>{text}</span>
    </div>
  );

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Gradient Orb */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-gray-100 via-blue-50 to-purple-50">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Main gradient orb */}
            <div 
              className="w-96 h-96 rounded-full opacity-80"
              style={{
                background: 'radial-gradient(circle at 30% 30%, #ff6b6b 0%, #feca57 25%, #ff9ff3 50%, #54a0ff 75%, #5f27cd 100%)'
              }}
            />
            {/* Overlay for softer effect */}
            <div 
              className="absolute inset-0 w-96 h-96 rounded-full opacity-60"
              style={{
                background: 'radial-gradient(circle at 70% 70%, rgba(255,255,255,0.3) 0%, transparent 50%)'
              }}
            />
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 bg-white">
        <div className="max-w-md mx-auto w-full">
          {/* Header */}
          <div className="mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to home
            </Link>
            
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center mr-3">
                <Flower2 className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl font-medium text-gray-900 mb-2">
              Begin your{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                inner journey
              </span>
            </h1>
            <p className="text-gray-600 flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-purple-400" />
              Bridge your mind and body through mindful wellness
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <Input
                id="location"
                name="location"
                type="text"
                required
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="City, Country"
              />
            </div>

            {/* Gender & Age Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger className="w-full border-gray-300 focus:ring-2 focus:ring-purple-500">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-disclose">Prefer not to disclose</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  min="13"
                  max="120"
                  required
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Age"
                />
              </div>
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
                  required
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Create a strong password"
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
              
              {/* Password Requirements */}
              {formData.password && (
                <div className="mt-3 space-y-2 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                  <p className="text-sm font-medium text-gray-700 flex items-center">
                    <Circle className="w-4 h-4 mr-2 text-purple-400" />
                    Create a strong energetic foundation:
                  </p>
                  <div className="space-y-1">
                    <PasswordCheck isValid={passwordChecks.length} text="At least 8 characters (like 8 sacred breaths)" />
                    <PasswordCheck isValid={passwordChecks.uppercase} text="One uppercase letter (reach higher)" />
                    <PasswordCheck isValid={passwordChecks.lowercase} text="One lowercase letter (stay grounded)" />
                    <PasswordCheck isValid={passwordChecks.number} text="One number (cosmic vibration)" />
                    <PasswordCheck isValid={passwordChecks.special} text="One special character (unique energy)" />
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || !isPasswordValid || !formData.name || !formData.email || !formData.location || !formData.gender || !formData.age}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Awakening your journey...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Heart className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                  Begin your transformation
                  <Sparkles className="w-4 h-4 ml-2 group-hover:animate-pulse" />
                </div>
              )}
            </Button>
          </form>

          {/* Inspirational note */}
          <div className="mt-6 text-center p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
            <p className="text-sm text-gray-600 flex items-center justify-center">
              <Brain className="w-4 h-4 mr-2 text-indigo-400" />
              <span className="italic">"The journey of a thousand miles begins with a single step"</span>
              <Heart className="w-4 h-4 ml-2 text-pink-400" />
            </p>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-purple-600 hover:text-purple-700 font-medium">
                Sign in now.
              </Link>
            </p>
            
            <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-500">
              <Link href="#" className="hover:text-gray-700">Sacred Terms</Link>
              <span>•</span>
              <Link href="#" className="hover:text-gray-700">Privacy Sanctuary</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}