'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  ArrowLeft, 
  MapPin, 
  Database, 
  Eye, 
  BarChart3,
  Download,
  Trash2,
  Lock,
  Globe
} from 'lucide-react';
import Link from 'next/link';
import { useSettingsStore } from '@/lib/settings-store';
import { 
  SettingSection, 
  ToggleSetting, 
  SelectSetting, 
  ButtonSetting 
} from '@/components/ui/setting-item';

export default function PrivacySettingsPage() {
  const {
    locationSharing,
    dataRetention,
    analyticsOptOut,
    shareAnonymousData,
    journalVisibility,
    updatePrivacy
  } = useSettingsStore();

  const dataRetentionOptions = [
    { 
      value: '30days', 
      label: '30 Days', 
      description: 'Data deleted after 30 days' 
    },
    { 
      value: '1year', 
      label: '1 Year', 
      description: 'Data deleted after 1 year' 
    },
    { 
      value: 'forever', 
      label: 'Keep Forever', 
      description: 'Data never automatically deleted' 
    }
  ];

  const visibilityOptions = [
    { 
      value: 'private', 
      label: 'Private', 
      description: 'Only you can see your entries' 
    },
    { 
      value: 'selected', 
      label: 'Selected Sharing', 
      description: 'Share with chosen individuals' 
    },
    { 
      value: 'public', 
      label: 'Public Insights', 
      description: 'Anonymous insights may be shared' 
    }
  ];

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <Link 
              href="/settings" 
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Settings
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Privacy & Data</h1>
                <p className="text-gray-600">Control how your wellness data is used and shared</p>
              </div>
              <Badge className="bg-green-100 text-green-800">Privacy First</Badge>
            </div>
          </div>

          <div className="space-y-8">
            {/* Location Privacy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Location Privacy</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SettingSection
                  title="Location Sharing"
                  description="Control how location data is collected and used with your journal entries"
                >
                  <ToggleSetting
                    title="Enable Location Services"
                    description="Allow the app to access your location for journal context"
                    checked={locationSharing}
                    onCheckedChange={(checked) => updatePrivacy({ locationSharing: checked })}
                    icon={<MapPin className="w-4 h-4" />}
                    info="When enabled, only city-level location is stored, never precise coordinates"
                  />
                </SettingSection>
              </CardContent>
            </Card>

            {/* Data Retention */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="w-5 h-5" />
                  <span>Data Retention</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SettingSection
                  title="How Long We Keep Your Data"
                  description="Choose how long your wellness data is stored in our systems"
                >
                  <SelectSetting
                    title="Data Retention Period"
                    description="After this period, your data will be automatically and permanently deleted"
                    value={dataRetention}
                    onValueChange={(value) => updatePrivacy({ dataRetention: value as any })}
                    options={dataRetentionOptions}
                    icon={<Database className="w-4 h-4" />}
                    warning={dataRetention === '30days' ? 'Short retention period may limit insights and progress tracking' : undefined}
                  />
                </SettingSection>
              </CardContent>
            </Card>

            {/* Journal Privacy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="w-5 h-5" />
                  <span>Journal Privacy</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SettingSection
                  title="Entry Visibility"
                  description="Control who can see your journal entries and wellness insights"
                >
                  <SelectSetting
                    title="Default Journal Visibility"
                    description="How your journal entries are shared by default"
                    value={journalVisibility}
                    onValueChange={(value) => updatePrivacy({ journalVisibility: value as any })}
                    options={visibilityOptions}
                    icon={<Eye className="w-4 h-4" />}
                    info="You can always override this setting for individual entries"
                  />
                </SettingSection>
              </CardContent>
            </Card>

            {/* Analytics & Data Sharing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Analytics & Research</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SettingSection
                  title="Data Usage for Improvement"
                  description="Help us improve the wellness experience while protecting your privacy"
                >
                  <ToggleSetting
                    title="Opt Out of Analytics"
                    description="Prevent collection of usage analytics and app performance data"
                    checked={analyticsOptOut}
                    onCheckedChange={(checked) => updatePrivacy({ analyticsOptOut: checked })}
                    icon={<BarChart3 className="w-4 h-4" />}
                    info="Opting out may limit our ability to improve the app experience"
                  />
                  
                  <ToggleSetting
                    title="Share Anonymous Research Data"
                    description="Contribute anonymized wellness insights to mental health research"
                    checked={shareAnonymousData}
                    onCheckedChange={(checked) => updatePrivacy({ shareAnonymousData: checked })}
                    icon={<Globe className="w-4 h-4" />}
                    info="All data is fully anonymized and cannot be traced back to you"
                  />
                </SettingSection>
              </CardContent>
            </Card>

            {/* Privacy Tools */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lock className="w-5 h-5" />
                  <span>Privacy Tools</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SettingSection
                  title="Data Control Actions"
                  description="Tools to manage and control your personal data"
                >
                  <ButtonSetting
                    title="Download My Data"
                    description="Get a complete copy of all your data in a portable format"
                    buttonText="Download Data"
                    onButtonClick={() => {
                      // Handle data download
                      console.log('Downloading user data...');
                    }}
                    icon={<Download className="w-4 h-4" />}
                    info="Includes all journal entries, mood data, settings, and analytics"
                  />
                  
                  <ButtonSetting
                    title="Request Data Deletion"
                    description="Permanently delete specific types of data from our systems"
                    buttonText="Manage Data"
                    onButtonClick={() => {
                      // Handle selective data deletion
                      console.log('Opening data deletion options...');
                    }}
                    variant="outline"
                    icon={<Trash2 className="w-4 h-4" />}
                    info="You can delete specific categories while keeping others"
                  />
                </SettingSection>
              </CardContent>
            </Card>

            {/* Privacy Information */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <Shield className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">Our Privacy Commitment</h3>
                    <p className="text-blue-800 text-sm mb-4">
                      We believe your wellness data is deeply personal. Every feature is designed with 
                      privacy-first principles, giving you complete control over your information.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>End-to-end encryption for sensitive data</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>No third-party data sharing without consent</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>GDPR and CCPA compliant practices</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Regular security audits and updates</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-blue-200">
                      <Link 
                        href="/privacy-policy" 
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Read our full Privacy Policy →
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}