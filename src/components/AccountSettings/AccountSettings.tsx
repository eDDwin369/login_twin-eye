import { useState } from 'react';
import { ProfileTab } from './ProfileTab';
import { SecurityTab } from './SecurityTab';
import { PreferencesTab } from './PreferencesTab';
import './AccountSettings.css';

interface AccountSettingsProps {
  hasUnsavedChanges?: boolean;
  setHasUnsavedChanges?: (value: boolean) => void;
  editProfileOnLoad?: boolean;
  setEditProfileOnLoad?: (value: boolean) => void;
}

export function AccountSettings({ 
  hasUnsavedChanges, 
  setHasUnsavedChanges,
  editProfileOnLoad,
  setEditProfileOnLoad
}: AccountSettingsProps) {
  const [activeTab, setActiveTab] = useState('profile');

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
      </div>
    </div>
  );
}
