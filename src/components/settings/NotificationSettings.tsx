import React, { useState } from 'react';
import { SettingsCard, SettingsSectionHeader, SettingsToggle } from './shared';

export function NotificationSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklySummary: true,
    quizCompletion: true,
    learningReminder: true,
    documentProcessing: true,
    securityAlerts: true,
    marketingEmails: false
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="w-full">
      <SettingsCard>
        <SettingsSectionHeader 
          title="Notification Preferences" 
          description="Choose what we should notify you about." 
        />
        
        <div className="space-y-6">
          <SettingsToggle 
            title="Email Notifications" 
            description="Receive important updates and alerts directly to your inbox." 
            checked={settings.emailNotifications}
            onChange={() => toggle('emailNotifications')}
          />
          <SettingsToggle 
            title="Push Notifications" 
            description="Receive immediate alerts in your browser when you're online." 
            checked={settings.pushNotifications}
            onChange={() => toggle('pushNotifications')}
          />
          
          <div className="border-t border-stone-100 dark:border-[#2A2A2A] my-6 pt-6">
            <h3 className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-wider mb-4">Specific Alerts</h3>
            
            <div className="space-y-6">
              <SettingsToggle 
                title="Weekly Summary" 
                description="Get a recap of your learning progress every Monday." 
                checked={settings.weeklySummary}
                onChange={() => toggle('weeklySummary')}
              />
              <SettingsToggle 
                title="Quiz Completion Alerts" 
                description="Notify me as soon as my AI-generated quiz is ready." 
                checked={settings.quizCompletion}
                onChange={() => toggle('quizCompletion')}
              />
              <SettingsToggle 
                title="Learning Reminder" 
                description="Daily reminders to keep up your study streak." 
                checked={settings.learningReminder}
                onChange={() => toggle('learningReminder')}
              />
              <SettingsToggle 
                title="Document Processing Finished" 
                description="Alert me when large PDFs are fully analyzed by the AI." 
                checked={settings.documentProcessing}
                onChange={() => toggle('documentProcessing')}
              />
              <SettingsToggle 
                title="Security Alerts" 
                description="Crucial security updates and unrecognised login attempts." 
                checked={settings.securityAlerts}
                onChange={() => toggle('securityAlerts')}
              />
              <SettingsToggle 
                title="Marketing Emails" 
                description="Receive updates about new LearnFlow AI features and offers." 
                checked={settings.marketingEmails}
                onChange={() => toggle('marketingEmails')}
              />
            </div>
          </div>
        </div>
      </SettingsCard>
    </div>
  );
}
