'use client';

import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
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
    logout();
    router.push('/');
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
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
              className={`w-full justify-start mb-2 ${
                isActive 
                  ? 'bg-green-50 text-green-700 hover:text-green-700 hover:bg-green-100' 
                  : 'text-gray-700 hover:text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => router.push(item.href)}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{item.name}</span>
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