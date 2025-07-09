'use client';

import { useAppStore } from '@/lib/store';
import { SomaLogo } from '@/components/ui/soma-logo';
import { useRouter, usePathname } from 'next/navigation';
import { Home, BookOpen, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useScrollPosition } from '@/hooks/use-scroll-position';
import { useState, useEffect, useRef, useMemo } from 'react';

const navigation = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Journal', href: '/journal', icon: BookOpen },
  { name: 'Settings', href: '/settings', icon: Settings },
];

// Helper hook for smooth value mapping
const useRange = (
  num: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
) => {
  const mappedValue = useMemo(() => {
    const newValue =
      ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
    const largest = Math.max(outMin, outMax);
    const smallest = Math.min(outMin, outMax);
    return Math.min(Math.max(newValue, smallest), largest);
  }, [num, inMin, inMax, outMin, outMax]);

  return mappedValue;
};

export function TopNavigation() {
  const { user, logout } = useAppStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  
  const scrollY = useScrollPosition(60);
  const navX = useRange(scrollY, 0, 50, 0, 42);
  const logoScale = useRange(scrollY, 0, 50, 1, 0.8);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    console.log('🚪 Logout initiated');
    
    try {
      logout();
      console.log('✅ State cleared successfully');
      window.location.href = '/';
      console.log('🏠 Navigating to home page');
    } catch (error) {
      console.error('❌ Logout error:', error);
      window.location.href = '/';
    }
  };

  const handleNavigate = (href: string) => {
    console.log(`🎯 Navigating to: ${href}`);
    router.push(href);
  };

  return (
    <div className="font-sans">
      {/* Header */}
      <header className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-4">
        {/* Logo */}
        <div 
          className="flex items-center space-x-3"
          style={{
            transform: `scale(${logoScale})`,
            transformOrigin: 'left center'
          }}
        >
          <SomaLogo size="sm" />
          <div>
            <h1 className="text-xl font-semibold text-gray-900">SomaJournal</h1>
            <p className="text-xs text-gray-500">Mindful journaling companion</p>
          </div>
        </div>

        {/* User Profile */}
        <div className="relative" ref={profileDropdownRef}>
          <div
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-medium text-sm">
                {user?.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900 text-sm">{user?.name}</p>
              <p className="text-xs text-gray-500">Wellness explorer</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
              <div
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer flex items-center"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Navigation */}
      <nav className="sticky top-0 flex bg-gray-50 border-b border-gray-200 text-sm z-40">
        <ol
          style={{
            transform: `translateX(${navX}px)`,
          }}
          className="flex gap-1 px-6 py-2 transition-transform duration-300"
        >
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <li
                key={item.name}
                onClick={() => handleNavigate(item.href)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer transition-colors
                  ${isActive 
                    ? 'bg-green-50 text-green-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}