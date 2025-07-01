'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  ArrowLeft, 
  Mail, 
  Key, 
  Shield, 
  Trash2,
  Download,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { 
  SettingSection, 
  InputSetting, 
  ButtonSetting, 
  ToggleSetting 
} from '@/components/ui/setting-item';

export default function AccountSettingsPage() {
  const { user } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSaveProfile = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    // Show success message
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsLoading(false);
    // Show success message
  };

  const handleExportData = async () => {
    setIsLoading(true);
    // Simulate data export
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    // Trigger download
  };

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }
    setIsLoading(true);
    // Simulate account deletion
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Redirect to goodbye page
  };

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
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
                <p className="text-gray-600">Manage your profile and account security</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Profile Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <SettingSection
                  title="Basic Information"
                  description="Update your personal information and how others see you"
                >
                  <InputSetting
                    title="Full Name"
                    description="Your name as it appears throughout the app"
                    value={name}
                    onValueChange={setName}
                    placeholder="Enter your full name"
                    icon={<User className="w-4 h-4" />}
                  />
                  
                  <InputSetting
                    title="Email Address"
                    description="Used for login and important notifications"
                    type="email"
                    value={email}
                    onValueChange={setEmail}
                    placeholder="Enter your email"
                    icon={<Mail className="w-4 h-4" />}
                    info="Changing your email will require verification"
                  />
                </SettingSection>

                <div className="pt-4 border-t border-gray-100">
                  <Button 
                    onClick={handleSaveProfile}
                    disabled={isLoading || (!name.trim() || !email.trim())}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isLoading ? 'Saving...' : 'Save Profile'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Password & Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Password & Security</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <SettingSection
                  title="Change Password"
                  description="Keep your account secure with a strong password"
                >
                  <InputSetting
                    title="Current Password"
                    type="password"
                    value={currentPassword}
                    onValueChange={setCurrentPassword}
                    placeholder="Enter current password"
                    icon={<Key className="w-4 h-4" />}
                  />
                  
                  <InputSetting
                    title="New Password"
                    type="password"
                    value={newPassword}
                    onValueChange={setNewPassword}
                    placeholder="Enter new password"
                    icon={<Key className="w-4 h-4" />}
                    info="Must be at least 8 characters with uppercase, lowercase, number, and special character"
                  />
                  
                  <InputSetting
                    title="Confirm New Password"
                    type="password"
                    value={confirmPassword}
                    onValueChange={setConfirmPassword}
                    placeholder="Confirm new password"
                    icon={<Key className="w-4 h-4" />}
                  />
                </SettingSection>

                <SettingSection
                  title="Two-Factor Authentication"
                  description="Add an extra layer of security to your account"
                >
                  <ToggleSetting
                    title="Enable Two-Factor Authentication"
                    description="Require a second form of verification when signing in"
                    checked={twoFactorEnabled}
                    onCheckedChange={setTwoFactorEnabled}
                    icon={<Shield className="w-4 h-4" />}
                    info="We'll send a code to your phone or email when you log in"
                  />
                </SettingSection>

                <div className="pt-4 border-t border-gray-100">
                  <Button 
                    onClick={handleChangePassword}
                    disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isLoading ? 'Updating...' : 'Update Password'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Data Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Download className="w-5 h-5" />
                  <span>Data Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SettingSection
                  title="Export Your Data"
                  description="Download a copy of all your wellness data"
                >
                  <ButtonSetting
                    title="Download Data Archive"
                    description="Get a complete export of your journal entries, mood data, and settings in JSON format"
                    buttonText="Export Data"
                    onButtonClick={handleExportData}
                    loading={isLoading}
                    icon={<Download className="w-4 h-4" />}
                    info="This may take a few minutes depending on how much data you have"
                  />
                </SettingSection>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-red-700">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Danger Zone</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SettingSection
                  title="Delete Account"
                  description="Permanently delete your account and all associated data"
                >
                  <ButtonSetting
                    title="Delete My Account"
                    description="This action cannot be undone. All your journal entries, mood data, and account information will be permanently deleted."
                    buttonText={showDeleteConfirm ? "Confirm Deletion" : "Delete Account"}
                    onButtonClick={handleDeleteAccount}
                    variant="destructive"
                    loading={isLoading}
                    icon={<Trash2 className="w-4 h-4" />}
                    warning={showDeleteConfirm ? "Are you absolutely sure? This action cannot be undone." : "This will permanently delete all your data"}
                  />
                  
                  {showDeleteConfirm && (
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="mr-3"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </SettingSection>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}