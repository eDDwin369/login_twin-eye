import { useState } from 'react';
import { ProfileTab } from './ProfileTab';
import { SecurityTab } from './SecurityTab';
import { PreferencesTab } from './PreferencesTab';
import './AccountSettings.css';

interface AccountSettingsProps {
  hasUnsavedChanges?: boolean;
  setHasUnsavedChanges?: (value: boolean) => void;
}

export function AccountSettings({ hasUnsavedChanges, setHasUnsavedChanges }: AccountSettingsProps) {
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
      <div className="tw-parent-card" style={{ padding: '12px 16px', marginTop: '16px' }}>
        <div className="account-header-wrapper">

        <h1 className="account-page-title">Account Settings</h1>
        
        <div className="account-tabs">
          <button 
            className={`account-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => handleTabChange('profile')}
          >
            <span className="tab-icon"></span> Profile
          </button>
          <button 
            className={`account-tab ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => handleTabChange('security')}
          >
            <span className="tab-icon"></span> Security & Sessions
          </button>
          <button 
            className={`account-tab ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => handleTabChange('preferences')}
          >
            <span className="tab-icon"></span> Preferences & Privacy
          </button>
        </div>
      </div>

      <div className="account-tab-content">
        {activeTab === 'profile' && (
          <ProfileTab setHasUnsavedChanges={setHasUnsavedChanges} />
        )}
        {activeTab === 'security' && <SecurityTab />}
        {activeTab === 'preferences' && <PreferencesTab />}
        </div>
      </div>
    </div>
  );
}
