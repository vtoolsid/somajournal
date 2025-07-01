'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Database,
  Search,
  ChevronRight,
  Info,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { useSettingsStore } from '@/lib/settings-store';

const settingsCategories = [
  {
    id: 'account',
    title: 'Account',
    description: 'Manage your profile and login preferences',
    icon: User,
    href: '/settings/account',
    items: ['Profile information', 'Password & security', 'Connected accounts']
  },
  {
    id: 'privacy',
    title: 'Privacy & Data',
    description: 'Control how your data is used and shared',
    icon: Shield,
    href: '/settings/privacy',
    items: ['Location sharing', 'Data retention', 'Export & deletion'],
    badge: 'Important'
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Configure alerts and reminders',
    icon: Bell,
    href: '/settings/notifications',
    items: ['Email notifications', 'Push notifications', 'Quiet hours']
  },
  {
    id: 'appearance',
    title: 'Appearance',
    description: 'Customize the look and feel',
    icon: Palette,
    href: '/settings/appearance',
    items: ['Theme settings', 'Font size', 'Color scheme']
  },
  {
    id: 'advanced',
    title: 'Advanced',
    description: 'Advanced options and data management',
    icon: Database,
    href: '/settings/advanced',
    items: ['Data export', 'Beta features', 'Developer options']
  }
];

export default function SettingsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, locationSharing, emailNotifications, autoSave } = useSettingsStore();

  const filteredCategories = settingsCategories.filter(category =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.items.some(item => item.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600">Manage your preferences and account settings</p>
              </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search settings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Quick Settings Overview */}
          {!searchQuery && (
            <Card className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-800">
                  <Info className="w-5 h-5" />
                  <span>Quick Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-700">{theme.charAt(0).toUpperCase() + theme.slice(1)}</div>
                    <div className="text-sm text-green-600">Theme</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-700">{locationSharing ? 'On' : 'Off'}</div>
                    <div className="text-sm text-green-600">Location</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-700">{emailNotifications ? 'On' : 'Off'}</div>
                    <div className="text-sm text-green-600">Email Alerts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-700">{autoSave ? 'On' : 'Off'}</div>
                    <div className="text-sm text-green-600">Auto-save</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Settings Categories */}
          <div className="space-y-4">
            {filteredCategories.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No settings found</h3>
                  <p className="text-gray-600">Try searching with different keywords</p>
                  <Button
                    variant="outline"
                    onClick={() => setSearchQuery('')}
                    className="mt-4"
                  >
                    Clear search
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Link key={category.id} href={category.href}>
                    <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group hover:border-green-300">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-green-100 transition-colors">
                              <IconComponent className="w-6 h-6 text-gray-600 group-hover:text-green-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
                                {category.badge && (
                                  <Badge variant="secondary" className="bg-amber-100 text-amber-800 text-xs">
                                    {category.badge}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-gray-600 mb-3">{category.description}</p>
                              <div className="flex flex-wrap gap-2">
                                {category.items.map((item, index) => (
                                  <span
                                    key={index}
                                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                                  >
                                    {item}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })
            )}
          </div>

          {/* Footer Info */}
          {!searchQuery && (
            <div className="mt-12 p-6 bg-white rounded-lg border border-gray-200">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Privacy First Approach</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    We believe in giving you complete control over your wellness data. All settings are designed 
                    with privacy as the default, and you can adjust them to match your comfort level.
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <Link href="/privacy-policy" className="text-green-600 hover:text-green-700 flex items-center space-x-1">
                      <span>Privacy Policy</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                    <Link href="/terms" className="text-green-600 hover:text-green-700 flex items-center space-x-1">
                      <span>Terms of Service</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                    <Link href="/support" className="text-green-600 hover:text-green-700 flex items-center space-x-1">
                      <span>Support Center</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}