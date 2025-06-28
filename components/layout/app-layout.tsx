'use client';

import { useAppStore } from '@/lib/store';
import { Sidebar } from './sidebar';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isAuthenticated } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}