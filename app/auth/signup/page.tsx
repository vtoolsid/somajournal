'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Eye, EyeOff, Check, X, Circle, Sparkles, Heart, Brain } from 'lucide-react';
import Link from 'next/link';
import { ChakraRing } from '@/components/ui/chakra-ring';

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
    
    // Check required fields
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      return;
    }
    
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
    <div className="min-h-screen flex overflow-hidden">
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
            <Link 
              href="/" 
              className="inline-flex items-center text-sm text-gray-600 hover:text-slate-800 mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to home
            </Link>
            
            
            <h1 className="text-4xl font-medium text-slate-800 mb-2">
              Begin your inner journey
            </h1>
            <p className="text-gray-600">
              Bridge your mind and body through mindful wellness
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Fields marked with <span className="text-red-500">*</span> are required
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="signup-input w-full px-3 py-2 border border-gray-300 rounded-lg text-slate-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="signup-input w-full px-3 py-2 border border-gray-300 rounded-lg text-slate-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                className="signup-input w-full px-3 py-2 border border-gray-300 rounded-lg text-slate-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                  <SelectTrigger className="w-full border-gray-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg">
                    <SelectItem value="male" className="text-slate-800 hover:bg-gray-100 hover:text-slate-800 focus:bg-gray-100 focus:text-slate-800 data-[highlighted]:bg-gray-100 data-[highlighted]:text-slate-800 cursor-pointer">Male</SelectItem>
                    <SelectItem value="female" className="text-slate-800 hover:bg-gray-100 hover:text-slate-800 focus:bg-gray-100 focus:text-slate-800 data-[highlighted]:bg-gray-100 data-[highlighted]:text-slate-800 cursor-pointer">Female</SelectItem>
                    <SelectItem value="other" className="text-slate-800 hover:bg-gray-100 hover:text-slate-800 focus:bg-gray-100 focus:text-slate-800 data-[highlighted]:bg-gray-100 data-[highlighted]:text-slate-800 cursor-pointer">Other</SelectItem>
                    <SelectItem value="prefer-not-to-disclose" className="text-slate-800 hover:bg-gray-100 hover:text-slate-800 focus:bg-gray-100 focus:text-slate-800 data-[highlighted]:bg-gray-100 data-[highlighted]:text-slate-800 cursor-pointer">Prefer not to disclose</SelectItem>
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
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  className="signup-input w-full px-3 py-2 border border-gray-300 rounded-lg text-slate-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Age"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-slate-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                <div className="mt-3 space-y-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-gray-700">
                    Password must contain:
                  </p>
                  <div className="space-y-1">
                    <PasswordCheck isValid={passwordChecks.length} text="At least 8 characters" />
                    <PasswordCheck isValid={passwordChecks.uppercase} text="One uppercase letter" />
                    <PasswordCheck isValid={passwordChecks.lowercase} text="One lowercase letter" />
                    <PasswordCheck isValid={passwordChecks.number} text="One number" />
                    <PasswordCheck isValid={passwordChecks.special} text="One special character" />
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || !isPasswordValid || !formData.name.trim() || !formData.email.trim()}
              className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isLoading ? 'Creating account...' : 'Begin your journey'}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already Awakened?{' '}
              <Link href="/auth/login" className="text-green-600 hover:text-green-700 font-medium">
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