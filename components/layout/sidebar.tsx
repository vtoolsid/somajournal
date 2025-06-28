'use client';

import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { useRouter, usePathname } from 'next/navigation';
import { Home, BookOpen, TrendingUp, Heart, LogOut, Bot as Lotus } from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Journal', href: '/journal', icon: BookOpen },
  { name: 'Insights', href: '/karma', icon: TrendingUp },
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
    <div className="w-72 h-full bg-white/20 backdrop-blur-sm border-r border-white/20 wellness-container">
      <div className="flex flex-col h-full relative z-10">
        {/* Logo */}
        <div className="p-8 border-b border-white/20">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center breathing-element">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-800">Karmic Wellness</h1>
              <p className="text-sm text-slate-500">Digital wellness sanctuary</p>
            </div>
          </div>
        </div>

        {/* User */}
        <div className="p-8 border-b border-white/20">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center breathing-element">
              <span className="text-indigo-600 font-medium text-lg">
                {user?.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium text-slate-800">{user?.name}</p>
              <p className="text-sm text-slate-500">Wellness explorer</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-8 space-y-3">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Button
                key={item.name}
                variant="ghost"
                className={`w-full justify-start h-14 rounded-2xl transition-all duration-300 text-lg ${
                  isActive 
                    ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-lg' 
                    : 'text-slate-600 hover:bg-white/40 hover:text-slate-800 hover:scale-105'
                }`}
                onClick={() => router.push(item.href)}
              >
                <Icon className="w-6 h-6 mr-4" />
                {item.name}
              </Button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-8 border-t border-white/20">
          <Button
            variant="ghost"
            className="w-full justify-start h-14 rounded-2xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all duration-300 text-lg"
            onClick={handleLogout}
          >
            <LogOut className="w-6 h-6 mr-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}