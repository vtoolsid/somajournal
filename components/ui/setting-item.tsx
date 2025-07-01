'use client';

import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Info, AlertTriangle } from 'lucide-react';

interface BaseSettingItemProps {
  title: string;
  description?: string;
  children: ReactNode;
  icon?: ReactNode;
  warning?: string;
  info?: string;
  disabled?: boolean;
}

export function SettingItem({ 
  title, 
  description, 
  children, 
  icon, 
  warning, 
  info, 
  disabled = false 
}: BaseSettingItemProps) {
  return (
    <div className={`py-4 first:pt-0 last:pb-0 ${disabled ? 'opacity-50' : ''}`}>
      <div className="flex items-start justify-between space-x-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            {icon && <div className="text-gray-600">{icon}</div>}
            <Label className="text-base font-medium text-gray-900">{title}</Label>
          </div>
          {description && (
            <p className="text-sm text-gray-600 mb-2">{description}</p>
          )}
          {warning && (
            <div className="flex items-center space-x-2 mb-2 p-2 bg-amber-50 border border-amber-200 rounded-md">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span className="text-sm text-amber-800">{warning}</span>
            </div>
          )}
          {info && (
            <div className="flex items-center space-x-2 mb-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
              <Info className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-800">{info}</span>
            </div>
          )}
        </div>
        <div className="flex-shrink-0">
          {children}
        </div>
      </div>
    </div>
  );
}

interface ToggleSettingProps extends Omit<BaseSettingItemProps, 'children'> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function ToggleSetting({ checked, onCheckedChange, ...props }: ToggleSettingProps) {
  return (
    <SettingItem {...props}>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={props.disabled}
        className="data-[state=checked]:bg-green-600"
      />
    </SettingItem>
  );
}

interface SelectSettingProps extends Omit<BaseSettingItemProps, 'children'> {
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string; description?: string }[];
  placeholder?: string;
}

export function SelectSetting({ 
  value, 
  onValueChange, 
  options, 
  placeholder = "Select an option...",
  ...props 
}: SelectSettingProps) {
  return (
    <SettingItem {...props}>
      <Select value={value} onValueChange={onValueChange} disabled={props.disabled}>
        <SelectTrigger className="w-48 focus:ring-green-500 focus:border-green-500">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div>
                <div className="font-medium">{option.label}</div>
                {option.description && (
                  <div className="text-sm text-gray-500">{option.description}</div>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </SettingItem>
  );
}

interface InputSettingProps extends Omit<BaseSettingItemProps, 'children'> {
  value: string;
  onValueChange: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'time';
  placeholder?: string;
  maxLength?: number;
}

export function InputSetting({ 
  value, 
  onValueChange, 
  type = 'text',
  placeholder,
  maxLength,
  ...props 
}: InputSettingProps) {
  return (
    <SettingItem {...props}>
      <Input
        type={type}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={props.disabled}
        className="w-48 focus:ring-green-500 focus:border-green-500"
      />
    </SettingItem>
  );
}

interface ButtonSettingProps extends Omit<BaseSettingItemProps, 'children'> {
  buttonText: string;
  onButtonClick: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary';
  loading?: boolean;
}

export function ButtonSetting({ 
  buttonText, 
  onButtonClick, 
  variant = 'outline',
  loading = false,
  ...props 
}: ButtonSettingProps) {
  return (
    <SettingItem {...props}>
      <Button
        variant={variant}
        onClick={onButtonClick}
        disabled={props.disabled || loading}
        className={variant === 'destructive' ? 'hover:bg-red-700' : 'hover:bg-green-50 hover:border-green-300'}
      >
        {loading ? 'Loading...' : buttonText}
      </Button>
    </SettingItem>
  );
}

interface SettingSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function SettingSection({ title, description, children }: SettingSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>
      <div className="space-y-1 divide-y divide-gray-100">
        {children}
      </div>
    </div>
  );
}