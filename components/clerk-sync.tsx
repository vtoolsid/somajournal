'use client';

import { useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { useAppStore } from '@/lib/store';
import { useSupabaseClient } from '@/lib/supabase';

export function ClerkSync() {
  const { isLoaded: authLoaded, isSignedIn, getToken } = useAuth();
  const { isLoaded: userLoaded, user } = useUser();
  const { login, logout, wellbeingAssessment, setWellbeingAssessment, hasCompletedWellbeingAssessment } = useAppStore();
  const supabaseClient = useSupabaseClient();

  useEffect(() => {
    // Wait for both auth and user to be loaded
    if (!authLoaded || !userLoaded) return;

    if (isSignedIn && user) {
      console.log('🔄 ClerkSync: User authenticated', {
        userId: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        fullName: user.fullName,
        firstName: user.firstName,
        lastName: user.lastName
      });

      // Sync user data to Supabase
      syncUserToSupabase();

      // Sync Clerk user with Zustand store
      const appUser = {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress || '',
        name: user.fullName || user.firstName || 'User',
        timezone: user.unsafeMetadata?.timezone as string || 'UTC',
        createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
      };

      console.log('🔄 ClerkSync: Syncing user to Zustand store', appUser);
      login(appUser);

      // Load assessment data from Supabase
      loadAssessmentFromSupabase();

    } else if (!isSignedIn) {
      console.log('🔄 ClerkSync: User signed out, clearing store');
      logout();
      
      // Additional cleanup on sign-out
      console.log('🧹 ClerkSync: Performing sign-out cleanup');
      
      // Clear any cached assessment data
      if (wellbeingAssessment) {
        console.log('🗑️ ClerkSync: Clearing cached assessment data');
      }
    }
  }, [authLoaded, userLoaded, isSignedIn, user]);

  const syncUserToSupabase = async () => {
    if (!user || !isSignedIn) return;

    try {
      // Check if Supabase JWT template is available
      let token = null;
      try {
        token = await getToken({ template: 'supabase' });
      } catch (templateError) {
        console.warn('⚠️ ClerkSync: Supabase JWT template not configured in Clerk dashboard');
        console.log('💡 Please set up the Clerk-Supabase integration in your Clerk dashboard');
        // Continue without token - will use anon access
      }

      // Get current assessment status from store
      const currentStore = useAppStore.getState();
      const hasCompletedAssessment = currentStore.wellbeingAssessment?.completed || false;
      const assessmentData = currentStore.wellbeingAssessment || {};

      const userData = {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress || '',
        full_name: user.fullName || user.firstName || 'User',
        assessment_completed: hasCompletedAssessment,
        assessment_progress: (assessmentData as any).progress || {},
        assessment_data: assessmentData,
      };

      console.log('🔄 ClerkSync: Syncing user to Supabase', userData);
      console.log('🔑 Using Clerk token:', token ? 'Yes' : 'No (anon access)');

      // Upsert user data
      const { data, error } = await supabaseClient
        .from('users')
        .upsert(userData, { onConflict: 'id' })
        .select();

      if (error) {
        console.error('❌ ClerkSync: Error syncing user to Supabase:', error);
        if (error.message.includes('JWT')) {
          console.log('💡 This might be due to missing Clerk-Supabase integration setup');
        }
      } else {
        console.log('✅ ClerkSync: User synced to Supabase successfully', data);
      }
    } catch (error) {
      console.error('❌ ClerkSync: Error in syncUserToSupabase:', error);
    }
  };

  const loadAssessmentFromSupabase = async () => {
    if (!user || !isSignedIn) return;

    try {
      // Check if Supabase JWT template is available
      let token = null;
      try {
        token = await getToken({ template: 'supabase' });
      } catch (templateError) {
        console.warn('⚠️ ClerkSync: Supabase JWT template not configured for assessment loading');
        // Continue without token - will use anon access (may fail due to RLS)
      }

      console.log('🔄 ClerkSync: Loading assessment data from Supabase');
      console.log('🔑 Using Clerk token:', token ? 'Yes' : 'No (anon access)');

      const { data, error } = await supabaseClient
        .from('users')
        .select('assessment_completed, assessment_progress, assessment_data')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('❌ ClerkSync: Error loading assessment from Supabase:', error);
        if (error.message.includes('JWT') || error.message.includes('RLS')) {
          console.log('💡 This is likely due to missing Clerk-Supabase integration setup');
          console.log('📝 Falling back to local store for assessment state');
        }
      } else if (data) {
        console.log('✅ ClerkSync: Assessment data loaded from Supabase', {
          completed: data.assessment_completed,
          hasProgress: Object.keys(data.assessment_progress || {}).length > 0,
          hasData: Object.keys(data.assessment_data || {}).length > 0
        });

        // If assessment is completed and we have data, restore it
        if (data.assessment_completed && data.assessment_data && !wellbeingAssessment) {
          console.log('🔄 ClerkSync: Restoring completed assessment from Supabase');
          setWellbeingAssessment(data.assessment_data);
        }
      }
    } catch (error) {
      console.error('❌ ClerkSync: Error in loadAssessmentFromSupabase:', error);
    }
  };

  return null;
}