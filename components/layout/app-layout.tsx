'use client';

import { useAppStore } from '@/lib/store';
import { TopNavigation } from './top-navigation';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isAuthenticated, hasCompletedWellbeingAssessment, user } = useAppStore();
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  // Check if store has hydrated from localStorage
  useEffect(() => {
    // Add a small delay to ensure store is fully hydrated
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Wait for hydration before checking auth
    if (!isHydrated) return;
    
    // Use router.pathname instead of window.location.pathname to avoid hydration issues
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
    
    console.log('🔍 AppLayout: Navigation Debug Info');
    console.log('📍 Current Path:', currentPath);
    console.log('🔐 isAuthenticated:', isAuthenticated);
    console.log('📋 hasCompletedWellbeingAssessment:', hasCompletedWellbeingAssessment);
    console.log('👤 User:', user ? { id: user.id, name: user.name } : 'null');
    
    if (!isAuthenticated) {
      console.log('❌ AppLayout: User not authenticated, redirecting to home');
      // Use immediate navigation to prevent intermediate screens
      window.location.href = '/';
      return;
    }

    // Check if user needs to complete wellbeing assessment
    if (isAuthenticated && !hasCompletedWellbeingAssessment) {
      console.log('⚠️ AppLayout: User authenticated but needs to complete wellbeing assessment');
      // Allow access to assessment routes AND journal routes, but redirect dashboard to assessment
      const assessmentPaths = ['/wellbeing-assessment', '/wellbeing-assessment/results'];
      const allowedWithoutAssessment = ['/journal', '/settings'];
      
      // Check if current path is allowed
      const isOnAssessmentPath = assessmentPaths.some(path => currentPath === path || currentPath.startsWith(path + '/'));
      const isOnAllowedPath = allowedWithoutAssessment.some(path => currentPath === path || currentPath.startsWith(path + '/'));
      
      console.log('📍 Path check details:');
      console.log('  - Current path:', currentPath);
      console.log('  - Is on assessment path:', isOnAssessmentPath);
      console.log('  - Is on allowed path:', isOnAllowedPath);
      
      if (currentPath === '/dashboard') {
        console.log('🔄 AppLayout: Dashboard requires assessment, redirecting to wellbeing assessment');
        router.push('/wellbeing-assessment');
      } else if (!isOnAssessmentPath && !isOnAllowedPath) {
        console.log(`🔄 AppLayout: Redirecting from ${currentPath} to wellbeing assessment`);
        console.log('💡 Reason: User has not completed wellbeing assessment yet');
        router.push('/wellbeing-assessment');
      } else {
        console.log(`✅ AppLayout: User allowed to access ${currentPath} without assessment`);
      }
    } else if (isAuthenticated && hasCompletedWellbeingAssessment) {
      console.log('✅ AppLayout: User authenticated and completed assessment - normal navigation allowed');
      // User has completed assessment, allow normal navigation
      const assessmentPaths = ['/wellbeing-assessment', '/wellbeing-assessment/results'];
      
      // If user is on assessment page but already completed it, redirect to dashboard
      if (assessmentPaths.some(path => currentPath.startsWith(path)) && currentPath === '/wellbeing-assessment') {
        console.log('🔄 AppLayout: User already completed assessment, redirecting to dashboard');
        router.push('/dashboard');
      } else {
        console.log(`🎯 AppLayout: User allowed to access ${currentPath}`);
      }
    }
  }, [isHydrated, isAuthenticated, hasCompletedWellbeingAssessment, router, user]);

  // Don't render anything until hydrated to prevent flash
  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <TopNavigation />
      <main className="main-content flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}