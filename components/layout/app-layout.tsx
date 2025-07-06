'use client';

import { useAppStore } from '@/lib/store';
import { Sidebar } from './sidebar';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isAuthenticated, hasCompletedWellbeingAssessment } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      console.log('🔐 AppLayout: User not authenticated, redirecting to home');
      // Use immediate navigation to prevent intermediate screens
      window.location.href = '/';
      return;
    }

    // Check if user needs to complete wellbeing assessment
    if (isAuthenticated && !hasCompletedWellbeingAssessment) {
      console.log('📋 AppLayout: User needs to complete wellbeing assessment');
      // Allow access to assessment routes, but redirect other routes to assessment
      const currentPath = window.location.pathname;
      const assessmentPaths = ['/wellbeing-assessment', '/wellbeing-assessment/results'];
      
      if (!assessmentPaths.some(path => currentPath.startsWith(path))) {
        console.log(`📋 AppLayout: Redirecting from ${currentPath} to wellbeing assessment`);
        router.push('/wellbeing-assessment');
      }
    } else if (isAuthenticated && hasCompletedWellbeingAssessment) {
      // User has completed assessment, allow normal navigation
      const currentPath = window.location.pathname;
      const assessmentPaths = ['/wellbeing-assessment', '/wellbeing-assessment/results'];
      
      // If user is on assessment page but already completed it, redirect to dashboard
      if (assessmentPaths.some(path => currentPath.startsWith(path)) && currentPath === '/wellbeing-assessment') {
        console.log('📋 AppLayout: User already completed assessment, redirecting to dashboard');
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, hasCompletedWellbeingAssessment, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="main-content flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}