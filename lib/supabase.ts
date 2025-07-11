import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@clerk/nextjs';
import { useMemo } from 'react';

// Singleton Supabase client to prevent multiple instances
let supabaseInstance: any = null;

// Create a standard Supabase client (singleton)
export const supabase = (() => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return supabaseInstance;
})();

// Create a Clerk-integrated Supabase client with error handling
export function createClerkSupabaseClient(getToken: any) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        fetch: async (url, options = {}) => {
          try {
            // Try to get the Supabase token from Clerk
            const clerkToken = await getToken({ template: 'supabase' });
            
            const headers = new Headers(options?.headers);
            if (clerkToken) {
              headers.set('Authorization', `Bearer ${clerkToken}`);
            }

            return fetch(url, {
              ...options,
              headers,
            });
          } catch (error) {
            console.warn('⚠️ Supabase: Could not get Clerk token, using anon access:', error);
            // Fallback to regular fetch without Clerk token
            return fetch(url, options);
          }
        },
      },
    }
  );
}

// Hook for using Clerk-integrated Supabase client (memoized to prevent multiple instances)
export function useSupabaseClient() {
  const { getToken } = useAuth();

  return useMemo(() => {
    return createClerkSupabaseClient(getToken);
  }, [getToken]);
}

// Database types
export interface User {
  id: string;
  email: string;
  full_name: string;
  assessment_completed: boolean;
  assessment_progress: any;
  assessment_data: any;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}