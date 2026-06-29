import React from 'react';
import { SettingsCard, SettingsSectionHeader, SettingsButton, SettingsInput } from './shared';
import { Shield, Key, Smartphone, Laptop, CheckCircle2, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export function SecuritySettings() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  return (
    <div className="w-full space-y-8">
      {/* Change Password Card */}
      <SettingsCard>
        <SettingsSectionHeader 
          title="Change Password" 
          description="Update your password to keep your account secure." 
        />
        
        <div className="space-y-4 max-w-md mb-8">
          <div className="relative">
            <SettingsInput type={showCurrent ? "text" : "password"} placeholder="Current Password" />
            <button 
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
            >
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          
          <div className="relative">
            <SettingsInput type={showNew ? "text" : "password"} placeholder="New Password" />
            <button 
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
            >
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="relative">
            <SettingsInput type="password" placeholder="Confirm New Password" />
          </div>

          {/* Password Strength Meter */}
          <div className="pt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-stone-500">Password Strength: <strong className="text-orange-500">Medium</strong></span>
            </div>
            <div className="flex gap-1 h-1.5 w-full rounded-full overflow-hidden bg-stone-100 dark:bg-[#2A2A2A]">
              <div className="h-full bg-orange-500 w-1/3 rounded-full" />
              <div className="h-full bg-orange-500 w-1/3 rounded-full opacity-50" />
              <div className="h-full bg-stone-200 dark:bg-[#333] w-1/3 rounded-full" />
            </div>
          </div>
        </div>

        <SettingsButton variant="primary" className="font-bold">
          Update Password
        </SettingsButton>
      </SettingsCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Two-Factor Authentication */}
        <SettingsCard>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-500/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600 dark:text-green-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-white">Two-Factor Auth</h3>
              <p className="text-sm text-stone-500">Add an extra layer of security</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-stone-50 dark:bg-[#1A1A1A] rounded-lg border border-stone-200 dark:border-[#2A2A2A] w-fit mb-6">
            <CheckCircle2 className="w-4 h-4 text-stone-400" />
            <span className="text-sm font-medium text-stone-600 dark:text-stone-400">Currently Disabled</span>
          </div>
          <SettingsButton variant="outline" className="w-full justify-center text-sm font-semibold">
            Enable 2FA
          </SettingsButton>
        </SettingsCard>

        {/* Active Devices */}
        <SettingsCard>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center">
              <Laptop className="w-5 h-5 text-blue-600 dark:text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-white">Active Devices</h3>
              <p className="text-sm text-stone-500">Manage where you're logged in</p>
            </div>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Laptop className="w-4 h-4 text-stone-400" />
                <div>
                  <p className="text-sm font-medium text-stone-900 dark:text-white">MacBook Pro - Chrome</p>
                  <p className="text-xs text-green-500 font-medium">Current Session</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-stone-400" />
                <div>
                  <p className="text-sm font-medium text-stone-900 dark:text-white">iPhone 14 Pro - Safari</p>
                  <p className="text-xs text-stone-500">Last active: 2 hours ago</p>
                </div>
              </div>
              <button className="text-xs font-semibold text-red-500 hover:text-red-600">Revoke</button>
            </div>
          </div>
          
          <SettingsButton variant="outline" className="w-full justify-center text-sm font-semibold text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/20">
            Sign Out All Other Devices
          </SettingsButton>
        </SettingsCard>
      </div>

      {/* Recent Login Activity */}
      <SettingsCard>
        <SettingsSectionHeader title="Recent Login Activity" />
        <div className="overflow-hidden rounded-xl border border-stone-100 dark:border-[#2A2A2A] bg-stone-50/50 dark:bg-[#1A1A1A]">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-100/50 dark:bg-[#222] border-b border-stone-200 dark:border-[#2A2A2A]">
              <tr>
                <th className="px-4 py-3 font-semibold text-stone-600 dark:text-stone-300">Device</th>
                <th className="px-4 py-3 font-semibold text-stone-600 dark:text-stone-300">Location</th>
                <th className="px-4 py-3 font-semibold text-stone-600 dark:text-stone-300">Date & Time</th>
                <th className="px-4 py-3 font-semibold text-stone-600 dark:text-stone-300">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-[#2A2A2A]">
              <tr>
                <td className="px-4 py-3 text-stone-900 dark:text-white">MacBook Pro (Mac OS)</td>
                <td className="px-4 py-3 text-stone-500">San Francisco, CA</td>
                <td className="px-4 py-3 text-stone-500">Today, 2:45 PM</td>
                <td className="px-4 py-3 text-green-500 font-medium">Success</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-stone-900 dark:text-white">iPhone 14 Pro (iOS)</td>
                <td className="px-4 py-3 text-stone-500">San Francisco, CA</td>
                <td className="px-4 py-3 text-stone-500">Yesterday, 9:12 AM</td>
                <td className="px-4 py-3 text-green-500 font-medium">Success</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-stone-900 dark:text-white">Unknown Device</td>
                <td className="px-4 py-3 text-stone-500">Seattle, WA</td>
                <td className="px-4 py-3 text-stone-500">Oct 10, 4:30 AM</td>
                <td className="px-4 py-3 text-red-500 font-medium flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Failed
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </SettingsCard>
    </div>
  );
}
