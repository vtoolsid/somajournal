import { createClerkSupabaseClient } from './supabase';
import { useAuth } from '@clerk/nextjs';
import { WellbeingAssessment } from './store';

/**
 * Sync wellbeing assessment data to Supabase
 * @param assessment - The assessment data to sync
 * @param userId - The user ID
 * @param getToken - Clerk getToken function
 * @returns Success status
 */
export async function syncAssessmentToSupabase(
  assessment: WellbeingAssessment,
  userId: string,
  getToken: any
): Promise<boolean> {
  try {
    console.log('🔄 Syncing assessment to Supabase:', { userId, completed: assessment.completed });
    
    // Get Supabase client
    const supabaseClient = createClerkSupabaseClient(getToken);
    
    // Prepare update data
    const updateData = {
      assessment_completed: assessment.completed || false,
      assessment_data: assessment,
      assessment_progress: assessment.progress || {},
      updated_at: new Date().toISOString()
    };
    
    // Update user record
    const { data, error } = await supabaseClient
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select();
    
    if (error) {
      console.error('❌ Error syncing assessment to Supabase:', error);
      
      // If user doesn't exist, try to create with assessment data
      if (error.code === 'PGRST116') {
        console.log('🔄 User not found, creating new record...');
        const { data: newData, error: insertError } = await supabaseClient
          .from('users')
          .insert({
            id: userId,
            email: '', // Will be filled by ClerkSync
            full_name: '', // Will be filled by ClerkSync
            ...updateData
          })
          .select();
        
        if (insertError) {
          console.error('❌ Error creating user with assessment:', insertError);
          return false;
        }
        
        console.log('✅ Created user with assessment data:', newData);
        return true;
      }
      
      return false;
    }
    
    console.log('✅ Assessment synced to Supabase successfully:', data);
    return true;
  } catch (error) {
    console.error('❌ Unexpected error syncing assessment:', error);
    return false;
  }
}

/**
 * Hook to sync assessment data
 */
export function useAssessmentSync() {
  const { getToken } = useAuth();
  
  const syncAssessment = async (assessment: WellbeingAssessment, userId: string) => {
    return syncAssessmentToSupabase(assessment, userId, getToken);
  };
  
  return { syncAssessment };
}