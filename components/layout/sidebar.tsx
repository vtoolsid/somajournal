'use client';

import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { SomaLogo } from '@/components/ui/soma-logo';
import { useRouter, usePathname } from 'next/navigation';
import { Home, BookOpen, Heart, LogOut, Settings } from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Journal', href: '/journal', icon: BookOpen },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const { user, logout } = useAppStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    console.log('🚪 Logout initiated');
    
    try {
      // Clear authentication state first
      logout();
      console.log('✅ State cleared successfully');
      
      // Use immediate navigation to home page
      window.location.href = '/';
      console.log('🏠 Navigating to home page');
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Fallback navigation
      window.location.href = '/';
    }
  };

  const handleNavigation = (href: string, name: string) => {
    console.log(`🔍 Navigation clicked: ${name} -> ${href}`);
    
    try {
      // Primary navigation method
      router.push(href);
      console.log(`✅ Router navigation successful: ${href}`);
    } catch (error) {
      console.error(`❌ Router navigation failed for ${href}:`, error);
      // Fallback navigation method
      console.log(`🔄 Using fallback navigation for ${href}`);
      window.location.href = href;
    }
  };

  return (
    <div className="sidebar-modern w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <SomaLogo size="sm" />
          <div>
            <h1 className="text-xl font-semibold text-gray-900">SomaJournal</h1>
            <p className="text-xs text-gray-500">Mindful journaling companion</p>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
            <span className="text-green-600 font-medium text-lg">
              {user?.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{user?.name}</p>
            <p className="text-sm text-gray-500">Wellness explorer</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Button
              key={item.name}
              variant={isActive ? 'secondary' : 'ghost'}
              className={`w-full justify-start mb-2 relative z-[1001] cursor-pointer ${
                isActive 
                  ? 'bg-green-50 text-green-700 hover:text-green-700 hover:bg-green-100' 
                  : 'text-gray-700 hover:text-gray-700 hover:bg-gray-50'
              }`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log(`🎯 Button click event fired for ${item.name}`);
                handleNavigation(item.href, item.name);
              }}
              onMouseDown={(e) => {
                console.log(`🖱️ Mouse down on ${item.name}`);
              }}
              style={{ 
                pointerEvents: 'auto', 
                position: 'relative', 
                zIndex: 1001,
                cursor: 'pointer'
              }}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{item.name}</span>
              {/* Emergency fallback navigation */}
              <a 
                href={item.href} 
                className="absolute inset-0 opacity-0 pointer-events-none"
                aria-hidden="true"
                tabIndex={-1}
              >
                {item.name}
              </a>
            </Button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="font-medium">Sign Out</span>
        </Button>
      </div>
    </div>
  );
}