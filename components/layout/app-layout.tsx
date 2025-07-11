'use client';

import { useAppStore } from '@/lib/store';
import { TopNavigation } from './top-navigation';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@clerk/nextjs';
import { useSupabaseClient } from '@/lib/supabase';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isAuthenticated, hasCompletedWellbeingAssessment, user } = useAppStore();
  const { isSignedIn, getToken } = useAuth();
  const { user: clerkUser } = useUser();
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const [isHydrated, setIsHydrated] = useState(false);
  const [assessmentStatusFromDB, setAssessmentStatusFromDB] = useState<boolean | null>(null);
  const [assessmentProgress, setAssessmentProgress] = useState<any>(null);

  // Helper function to determine where to resume assessment
  const getResumeUrl = (progress: any) => {
    if (!progress || Object.keys(progress).length === 0) {
      return '/wellbeing-assessment';
    }

    // Add logic to determine resume URL based on progress
    // For now, just return the main assessment page
    console.log('📍 Determining resume URL from progress:', progress);
    return '/wellbeing-assessment';
  };

  // Check assessment status from Supabase
  const checkAssessmentStatusFromDB = async () => {
    if (!isSignedIn || !clerkUser) return;

    try {
      // Check if Supabase JWT template is available
      let token = null;
      try {
        token = await getToken({ template: 'supabase' });
      } catch (templateError) {
        console.warn('⚠️ AppLayout: Supabase JWT template not configured, falling back to local store');
        setAssessmentStatusFromDB(hasCompletedWellbeingAssessment);
        return;
      }

      console.log('🔍 AppLayout: Checking assessment status from Supabase');
      console.log('🔑 Using Clerk token:', token ? 'Yes' : 'No');

      const { data, error } = await supabaseClient
        .from('users')
        .select('assessment_completed, assessment_progress, assessment_data')
        .eq('id', clerkUser.id)
        .single();

      if (error) {
        console.error('❌ AppLayout: Error checking assessment status:', error);
        if (error.message.includes('JWT') || error.message.includes('RLS')) {
          console.log('💡 AppLayout: Database access failed, using local store as fallback');
        }
        // Fallback to local store if DB check fails
        setAssessmentStatusFromDB(hasCompletedWellbeingAssessment);
      } else if (data) {
        console.log('✅ AppLayout: Assessment status from DB:', {
          completed: data.assessment_completed,
          hasProgress: Object.keys(data.assessment_progress || {}).length > 0,
          hasData: Object.keys(data.assessment_data || {}).length > 0
        });
        
        setAssessmentStatusFromDB(data.assessment_completed);
        setAssessmentProgress(data.assessment_progress);
      }
    } catch (error) {
      console.error('❌ AppLayout: Error in checkAssessmentStatusFromDB:', error);
      // Fallback to local store
      setAssessmentStatusFromDB(hasCompletedWellbeingAssessment);
    }
  };

  // Check if store has hydrated from localStorage
  useEffect(() => {
    // Add a small delay to ensure store is fully hydrated
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Check assessment status from Supabase when user is authenticated
  useEffect(() => {
    if (isHydrated && isSignedIn && clerkUser) {
      checkAssessmentStatusFromDB();
    }
  }, [isHydrated, isSignedIn, clerkUser]);

  useEffect(() => {
    // Wait for hydration before routing
    if (!isHydrated) return;
    
    // Use router.pathname instead of window.location.pathname to avoid hydration issues
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
    
    console.log('🔍 AppLayout: Smart Navigation Debug Info');
    console.log('📍 Current Path:', currentPath);
    console.log('🔐 Clerk isSignedIn:', isSignedIn);
    console.log('🔐 Store isAuthenticated:', isAuthenticated);
    console.log('📋 Store hasCompletedWellbeingAssessment:', hasCompletedWellbeingAssessment);
    console.log('📋 DB assessmentStatusFromDB:', assessmentStatusFromDB);
    console.log('📝 Assessment Progress:', assessmentProgress);
    console.log('👤 Clerk User:', clerkUser ? { id: clerkUser.id, fullName: clerkUser.fullName } : 'null');
    console.log('👤 Store User:', user ? { id: user.id, name: user.name } : 'null');
    
    // Handle sign-out case first (when user is not signed in)
    if (!isSignedIn) {
      console.log('❌ AppLayout: User not authenticated, redirecting to home');
      // Use immediate navigation to prevent intermediate screens
      window.location.href = '/';
      return;
    }

    // For authenticated users, wait for assessment status to be loaded
    if (assessmentStatusFromDB === null) {
      console.log('⏳ AppLayout: Waiting for assessment status from DB...');
      return;
    }

    // Use database status as the source of truth
    const isAssessmentCompleted = assessmentStatusFromDB;

    // Check if user needs to complete wellbeing assessment
    if (isSignedIn && !isAssessmentCompleted) {
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
      
      // Check if there's assessment progress to resume from
      const hasProgress = assessmentProgress && Object.keys(assessmentProgress).length > 0;
      const resumeUrl = hasProgress ? getResumeUrl(assessmentProgress) : '/wellbeing-assessment';

      if (currentPath === '/') {
        console.log('🔄 AppLayout: Incomplete user on home page, redirecting to assessment');
        console.log('📍 Resume URL:', resumeUrl);
        router.push(resumeUrl);
      } else if (currentPath === '/dashboard') {
        console.log('🔄 AppLayout: Dashboard requires assessment, redirecting to assessment');
        console.log('📍 Resume URL:', resumeUrl);
        router.push(resumeUrl);
      } else if (!isOnAssessmentPath && !isOnAllowedPath) {
        console.log(`🔄 AppLayout: Redirecting from ${currentPath} to assessment`);
        console.log('💡 Reason: User has not completed wellbeing assessment yet');
        console.log('📍 Resume URL:', resumeUrl);
        router.push(resumeUrl);
      } else {
        console.log(`✅ AppLayout: User allowed to access ${currentPath} without assessment`);
      }
    } else if (isSignedIn && isAssessmentCompleted) {
      console.log('✅ AppLayout: User authenticated and completed assessment - normal navigation allowed');
      // User has completed assessment, allow normal navigation
      const assessmentPaths = ['/wellbeing-assessment', '/wellbeing-assessment/results'];
      
      // Handle different scenarios for completed users
      if (currentPath === '/') {
        console.log('🔄 AppLayout: Completed user on home page, redirecting to dashboard');
        router.push('/dashboard');
      } else if (assessmentPaths.some(path => currentPath.startsWith(path)) && currentPath === '/wellbeing-assessment') {
        console.log('🔄 AppLayout: User already completed assessment, redirecting to dashboard');
        router.push('/dashboard');
      } else {
        console.log(`🎯 AppLayout: User allowed to access ${currentPath}`);
      }
    }
  }, [isHydrated, isSignedIn, assessmentStatusFromDB, assessmentProgress, router]);

  // Don't render anything until hydrated
  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  // For signed-in users, wait for assessment status to be loaded
  if (isSignedIn && assessmentStatusFromDB === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading assessment status...</div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  // Determine if TopNavigation should be shown (use database status)
  const shouldShowTopNavigation = isSignedIn && assessmentStatusFromDB;

  return (
    <>
      {shouldShowTopNavigation && <TopNavigation />}
      <main className="main-content bg-background">
        {children}
      </main>
    </>
  );
}