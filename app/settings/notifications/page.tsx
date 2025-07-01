'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Bell, 
  ArrowLeft, 
  Mail, 
  Smartphone, 
  Moon, 
  Brain,
  Calendar,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { useSettingsStore } from '@/lib/settings-store';
import { 
  SettingSection, 
  ToggleSetting, 
  SelectSetting, 
  InputSetting 
} from '@/components/ui/setting-item';

export default function NotificationsSettingsPage() {
  const {
    emailNotifications,
    pushNotifications,
    reminderFrequency,
    reminderTime,
    insightNotifications,
    quietHoursEnabled,
    quietHoursStart,
    quietHoursEnd,
    updateNotifications
  } = useSettingsStore();

  const frequencyOptions = [
    { value: 'never', label: 'Never', description: 'No reminders' },
    { value: 'daily', label: 'Daily', description: 'Once per day' },
    { value: 'weekly', label: 'Weekly', description: 'Once per week' }
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
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                <p className="text-gray-600">Configure alerts and reminders for your wellness journey</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Email Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="w-5 h-5" />
                  <span>Email Notifications</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SettingSection
                  title="Email Preferences"
                  description="Choose what updates you'd like to receive via email"
                >
                  <ToggleSetting
                    title="Email Notifications"
                    description="Receive important updates and insights via email"
                    checked={emailNotifications}
                    onCheckedChange={(checked) => updateNotifications({ emailNotifications: checked })}
                    icon={<Mail className="w-4 h-4" />}
                  />
                  
                  <ToggleSetting
                    title="Weekly Insight Reports"
                    description="Get weekly summaries of your wellness patterns and insights"
                    checked={insightNotifications}
                    onCheckedChange={(checked) => updateNotifications({ insightNotifications: checked })}
                    disabled={!emailNotifications}
                    icon={<Brain className="w-4 h-4" />}
                    info="Requires email notifications to be enabled"
                  />
                </SettingSection>
              </CardContent>
            </Card>

            {/* Push Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Smartphone className="w-5 h-5" />
                  <span>Push Notifications</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SettingSection
                  title="Mobile & Browser Notifications"
                  description="Real-time alerts sent to your device"
                >
                  <ToggleSetting
                    title="Push Notifications"
                    description="Allow the app to send notifications to your device"
                    checked={pushNotifications}
                    onCheckedChange={(checked) => updateNotifications({ pushNotifications: checked })}
                    icon={<Smartphone className="w-4 h-4" />}
                    info="You'll need to grant permission in your browser or device settings"
                  />
                </SettingSection>
              </CardContent>
            </Card>

            {/* Journal Reminders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Journal Reminders</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SettingSection
                  title="Writing Reminders"
                  description="Get gentle reminders to maintain your journaling practice"
                >
                  <SelectSetting
                    title="Reminder Frequency"
                    description="How often you'd like to be reminded to journal"
                    value={reminderFrequency}
                    onValueChange={(value) => updateNotifications({ reminderFrequency: value as any })}
                    options={frequencyOptions}
                    icon={<Calendar className="w-4 h-4" />}
                  />
                  
                  <InputSetting
                    title="Reminder Time"
                    description="What time of day to send journal reminders"
                    type="time"
                    value={reminderTime}
                    onValueChange={(value) => updateNotifications({ reminderTime: value })}
                    disabled={reminderFrequency === 'never'}
                    icon={<Clock className="w-4 h-4" />}
                    info="Reminders will be sent at this time based on your local timezone"
                  />
                </SettingSection>
              </CardContent>
            </Card>

            {/* Quiet Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Moon className="w-5 h-5" />
                  <span>Quiet Hours</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SettingSection
                  title="Do Not Disturb"
                  description="Set times when you don't want to receive any notifications"
                >
                  <ToggleSetting
                    title="Enable Quiet Hours"
                    description="Automatically silence notifications during specified hours"
                    checked={quietHoursEnabled}
                    onCheckedChange={(checked) => updateNotifications({ quietHoursEnabled: checked })}
                    icon={<Moon className="w-4 h-4" />}
                  />
                  
                  <InputSetting
                    title="Quiet Hours Start"
                    description="When to start silencing notifications"
                    type="time"
                    value={quietHoursStart}
                    onValueChange={(value) => updateNotifications({ quietHoursStart: value })}
                    disabled={!quietHoursEnabled}
                    icon={<Moon className="w-4 h-4" />}
                  />
                  
                  <InputSetting
                    title="Quiet Hours End"
                    description="When to resume normal notifications"
                    type="time"
                    value={quietHoursEnd}
                    onValueChange={(value) => updateNotifications({ quietHoursEnd: value })}
                    disabled={!quietHoursEnabled}
                    icon={<Moon className="w-4 h-4" />}
                  />
                </SettingSection>
              </CardContent>
            </Card>

            {/* Notification Preview */}
            <Card className="bg-gray-50 border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-700">Notification Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-gray-600 mb-4">
                    Based on your current settings, here's what notifications you'll receive:
                  </div>
                  
                  <div className="space-y-3">
                    {emailNotifications && (
                      <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                        <Mail className="w-4 h-4 text-blue-500" />
                        <div>
                          <div className="font-medium text-sm">Email Updates</div>
                          <div className="text-xs text-gray-500">
                            {insightNotifications ? 'Weekly insights + important updates' : 'Important updates only'}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {pushNotifications && (
                      <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                        <Smartphone className="w-4 h-4 text-green-500" />
                        <div>
                          <div className="font-medium text-sm">Push Notifications</div>
                          <div className="text-xs text-gray-500">Real-time alerts on your device</div>
                        </div>
                      </div>
                    )}
                    
                    {reminderFrequency !== 'never' && (
                      <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                        <Calendar className="w-4 h-4 text-purple-500" />
                        <div>
                          <div className="font-medium text-sm">Journal Reminders</div>
                          <div className="text-xs text-gray-500">
                            {reminderFrequency.charAt(0).toUpperCase() + reminderFrequency.slice(1)} at {reminderTime}
                            {quietHoursEnabled && ` (respecting quiet hours)`}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {quietHoursEnabled && (
                      <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                        <Moon className="w-4 h-4 text-indigo-500" />
                        <div>
                          <div className="font-medium text-sm">Quiet Hours Active</div>
                          <div className="text-xs text-gray-500">
                            Silent from {quietHoursStart} to {quietHoursEnd}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {!emailNotifications && !pushNotifications && reminderFrequency === 'never' && (
                      <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-dashed">
                        <Bell className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="font-medium text-sm text-gray-500">No notifications enabled</div>
                          <div className="text-xs text-gray-400">You won't receive any notifications</div>
                        </div>
                      </div>
                    )}
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