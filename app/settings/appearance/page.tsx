'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Palette, 
  ArrowLeft, 
  Sun, 
  Moon, 
  Monitor,
  Type,
  Layout,
  Eye
} from 'lucide-react';
import Link from 'next/link';
import { useSettingsStore } from '@/lib/settings-store';
import { useAppStore } from '@/lib/store';
import { 
  SettingSection, 
  ToggleSetting, 
  SelectSetting 
} from '@/components/ui/setting-item';

export default function AppearanceSettingsPage() {
  const {
    theme,
    fontSize,
    colorScheme,
    layoutDensity,
    updateAppearance
  } = useSettingsStore();
  
  const { isDarkMode, toggleTheme } = useAppStore();

  const themeOptions = [
    { 
      value: 'light', 
      label: 'Light', 
      description: 'Clean and bright interface' 
    },
    { 
      value: 'dark', 
      label: 'Dark', 
      description: 'Easy on the eyes in low light' 
    },
    { 
      value: 'system', 
      label: 'System', 
      description: 'Matches your device settings' 
    }
  ];

  const fontSizeOptions = [
    { 
      value: 'small', 
      label: 'Small', 
      description: 'Compact text for more content' 
    },
    { 
      value: 'medium', 
      label: 'Medium', 
      description: 'Balanced readability' 
    },
    { 
      value: 'large', 
      label: 'Large', 
      description: 'Easier to read text' 
    }
  ];

  const colorSchemeOptions = [
    { 
      value: 'green', 
      label: 'Wellness Green', 
      description: 'Calming and natural' 
    },
    { 
      value: 'blue', 
      label: 'Ocean Blue', 
      description: 'Peaceful and focused' 
    },
    { 
      value: 'purple', 
      label: 'Mindful Purple', 
      description: 'Creative and spiritual' 
    }
  ];

  const densityOptions = [
    { 
      value: 'compact', 
      label: 'Compact', 
      description: 'More content, less spacing' 
    },
    { 
      value: 'comfortable', 
      label: 'Comfortable', 
      description: 'Balanced spacing' 
    },
    { 
      value: 'spacious', 
      label: 'Spacious', 
      description: 'Generous spacing, relaxed feel' 
    }
  ];

  const handleThemeChange = (newTheme: string) => {
    updateAppearance({ theme: newTheme as any });
    // Also update the main store's theme if switching to light/dark
    if (newTheme === 'dark' && !isDarkMode) {
      toggleTheme();
    } else if (newTheme === 'light' && isDarkMode) {
      toggleTheme();
    }
    // For system theme, you might want to add logic to detect system preference
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
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Palette className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Appearance</h1>
                <p className="text-gray-600">Customize the look and feel of your wellness app</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Theme Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sun className="w-5 h-5" />
                  <span>Theme</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SettingSection
                  title="Color Theme"
                  description="Choose between light, dark, or system-based theme"
                >
                  <SelectSetting
                    title="App Theme"
                    description="Controls the overall color scheme of the interface"
                    value={theme}
                    onValueChange={handleThemeChange}
                    options={themeOptions}
                    icon={theme === 'light' ? <Sun className="w-4 h-4" /> : theme === 'dark' ? <Moon className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
                  />
                </SettingSection>

                {/* Theme Preview */}
                <div className="mt-6 p-4 border rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Preview</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {themeOptions.map((option) => (
                      <div 
                        key={option.value}
                        className={`relative p-3 border-2 rounded-lg cursor-pointer transition-all ${
                          theme === option.value 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleThemeChange(option.value)}
                      >
                        <div className={`w-full h-16 rounded mb-2 ${
                          option.value === 'light' ? 'bg-white border' :
                          option.value === 'dark' ? 'bg-gray-900' :
                          'bg-gradient-to-r from-white via-gray-100 to-gray-900'
                        }`}>
                          <div className={`w-full h-4 rounded-t ${
                            option.value === 'light' ? 'bg-gray-100' :
                            option.value === 'dark' ? 'bg-gray-800' :
                            'bg-gray-200'
                          }`}></div>
                        </div>
                        <div className="text-xs font-medium text-center">{option.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Typography */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Type className="w-5 h-5" />
                  <span>Typography</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SettingSection
                  title="Text Size"
                  description="Adjust the size of text throughout the app for better readability"
                >
                  <SelectSetting
                    title="Font Size"
                    description="Controls the size of text in the interface"
                    value={fontSize}
                    onValueChange={(value) => updateAppearance({ fontSize: value as any })}
                    options={fontSizeOptions}
                    icon={<Type className="w-4 h-4" />}
                  />
                </SettingSection>

                {/* Font Size Preview */}
                <div className="mt-6 p-4 border rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Font Size Preview</h4>
                  <div className="space-y-3">
                    <div className={`${
                      fontSize === 'small' ? 'text-sm' :
                      fontSize === 'medium' ? 'text-base' :
                      'text-lg'
                    }`}>
                      <p className="font-semibold">Your wellness journey, beautifully illuminated</p>
                      <p className="text-gray-600 mt-1">
                        This is how your journal entries and app content will appear with the selected font size.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Color Scheme */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="w-5 h-5" />
                  <span>Color Scheme</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SettingSection
                  title="Accent Colors"
                  description="Choose the accent color theme for buttons, links, and highlights"
                >
                  <SelectSetting
                    title="Color Scheme"
                    description="Affects buttons, links, and interactive elements"
                    value={colorScheme}
                    onValueChange={(value) => updateAppearance({ colorScheme: value as any })}
                    options={colorSchemeOptions}
                    icon={<Palette className="w-4 h-4" />}
                  />
                </SettingSection>

                {/* Color Scheme Preview */}
                <div className="mt-6 p-4 border rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Color Preview</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {colorSchemeOptions.map((option) => (
                      <div 
                        key={option.value}
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                          colorScheme === option.value 
                            ? 'border-current bg-gray-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => updateAppearance({ colorScheme: option.value as any })}
                      >
                        <div className={`w-full h-8 rounded mb-2 ${
                          option.value === 'green' ? 'bg-green-500' :
                          option.value === 'blue' ? 'bg-blue-500' :
                          'bg-purple-500'
                        }`}></div>
                        <div className="text-xs font-medium text-center">{option.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Layout Density */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Layout className="w-5 h-5" />
                  <span>Layout</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SettingSection
                  title="Layout Density"
                  description="Control the spacing and density of interface elements"
                >
                  <SelectSetting
                    title="Layout Density"
                    description="Affects spacing between elements and overall layout feel"
                    value={layoutDensity}
                    onValueChange={(value) => updateAppearance({ layoutDensity: value as any })}
                    options={densityOptions}
                    icon={<Layout className="w-4 h-4" />}
                  />
                </SettingSection>

                {/* Layout Preview */}
                <div className="mt-6 p-4 border rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Layout Preview</h4>
                  <div className={`border rounded ${
                    layoutDensity === 'compact' ? 'p-2 space-y-1' :
                    layoutDensity === 'comfortable' ? 'p-4 space-y-3' :
                    'p-6 space-y-4'
                  }`}>
                    <div className="font-medium">Journal Entry</div>
                    <div className="text-sm text-gray-600">
                      This shows how content will be spaced with the selected density.
                    </div>
                    <div className="flex space-x-2">
                      <div className="px-2 py-1 bg-gray-100 rounded text-xs">Tag 1</div>
                      <div className="px-2 py-1 bg-gray-100 rounded text-xs">Tag 2</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Accessibility */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-blue-900">
                  <Eye className="w-5 h-5" />
                  <span>Accessibility</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-blue-800 text-sm mb-4">
                  These appearance settings help improve accessibility and comfort for all users.
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>High contrast mode support</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Screen reader compatible</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Keyboard navigation friendly</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Reduced motion respect</span>
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