import { useState, useEffect } from 'react';
import { ProfileTab } from './ProfileTab';
import { SecurityTab } from './SecurityTab';
import { PreferencesTab } from './PreferencesTab';
import { NotificationsTab } from './NotificationsTab';
import './AccountSettings.css';

interface AccountSettingsProps {
  hasUnsavedChanges?: boolean;
  setHasUnsavedChanges?: (value: boolean) => void;
  editProfileOnLoad?: boolean;
  setEditProfileOnLoad?: (value: boolean) => void;
  initialTab?: string;
}

export function AccountSettings({ 
  hasUnsavedChanges, 
  setHasUnsavedChanges,
  editProfileOnLoad,
  setEditProfileOnLoad,
  initialTab
}: AccountSettingsProps) {
  const [activeTab, setActiveTab] = useState(initialTab || 'profile');

  // Watch for changes in initialTab if navigated while component is already mounted
  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  // An "Edit Profile" request (e.g. from the header menu) must force the Profile
  // tab so ProfileTab mounts and can enter edit mode — otherwise the request is
  // silently ignored while another settings tab is active. editProfileOnLoad is
  // reset to false by ProfileTab once consumed, so this fires on each request.
  useEffect(() => {
    if (editProfileOnLoad) setActiveTab('profile');
  }, [editProfileOnLoad]);

  const handleTabChange = (tab: string) => {
    if (tab !== activeTab && hasUnsavedChanges) {
      if (!window.confirm("You have unsaved changes. Are you sure you want to discard them?")) {
        return;
      }
      if (setHasUnsavedChanges) setHasUnsavedChanges(false);
    }
    setActiveTab(tab);
  };

  return (
    <div className="account-settings-container">
      {/* Tabs menu at the very top */}
      <div className="account-tabs-wrapper">
        <div className="account-tabs">
          <button 
            className={`account-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => handleTabChange('profile')}
          >
            Profile
          </button>
          <button 
            className={`account-tab ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => handleTabChange('security')}
          >
            Security & Sessions
          </button>
          <button 
            className={`account-tab ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => handleTabChange('preferences')}
          >
            Preferences & Privacy
          </button>
          <button 
            className={`account-tab ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => handleTabChange('notifications')}
          >
            Notification
          </button>
        </div>
      </div>

      {/* Render Tab Content */}
      <div className="account-tab-content">
        {activeTab === 'profile' && (
          <ProfileTab 
            setHasUnsavedChanges={setHasUnsavedChanges}
            editProfileOnLoad={editProfileOnLoad}
            setEditProfileOnLoad={setEditProfileOnLoad}
          />
        )}
        {activeTab === 'security' && <SecurityTab />}
        {activeTab === 'preferences' && <PreferencesTab />}
        {activeTab === 'notifications' && <NotificationsTab />}
      </div>
    </div>
  );
}
