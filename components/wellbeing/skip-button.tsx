'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { useAuth, useUser } from '@clerk/nextjs';
import { useAssessmentSync } from '@/lib/supabase-utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { SkipForward } from 'lucide-react';

export function SkipButton() {
  const router = useRouter();
  const { skipWellbeingAssessment, wellbeingAssessment } = useAppStore();
  const { user } = useUser();
  const { syncAssessment } = useAssessmentSync();
  const [isSkipping, setIsSkipping] = useState(false);

  useEffect(() => {
    window.console.log('🎯 SkipButton component mounted');
  }, []);

  const handleSkip = async () => {
    window.console.log('🔄 Skip button clicked - initiating skip process');
    setIsSkipping(true);
    
    try {
      // Mark assessment as skipped in store
      window.console.log('📝 Calling skipWellbeingAssessment()');
      skipWellbeingAssessment();
      
      // Sync to Supabase if user is authenticated
      if (user && wellbeingAssessment) {
        window.console.log('🔄 Syncing skipped assessment to Supabase...');
        const syncSuccess = await syncAssessment(wellbeingAssessment, user.id);
        if (syncSuccess) {
          window.console.log('✅ Skipped assessment synced to Supabase successfully');
        } else {
          window.console.warn('⚠️ Failed to sync skipped assessment to Supabase, continuing with local storage');
        }
      }
      
      // Navigate to results page
      window.console.log('🚀 Navigating to results page');
      await router.push('/wellbeing-assessment/results');
      window.console.log('✅ Navigation complete');
    } catch (error) {
      window.console.error('Skip assessment error:', error);
    } finally {
      setIsSkipping(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          onClick={() => window.console.log('👆 Initial Skip button clicked - opening dialog')}
        >
          <SkipForward className="w-4 h-4 mr-2" />
          Skip for now
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center space-x-2">
            <span className="text-2xl">🤔</span>
            <span>Skip Assessment?</span>
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>
                We understand if you'd prefer to skip this assessment for now. 
                You can always take it later from your settings.
              </p>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-700">
                  💡 <strong>Why we recommend taking it:</strong>
                </p>
                <div className="text-sm text-blue-600 mt-1 space-y-1">
                  <div>• Personalized wellness insights</div>
                  <div>• Better journal analysis</div>
                  <div>• Targeted recommendations</div>
                </div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <span>Continue Assessment</span>
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSkip}
            disabled={isSkipping}
            className="bg-gray-600 hover:bg-gray-700"
          >
            {isSkipping ? 'Skipping...' : 'Skip for Now'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}