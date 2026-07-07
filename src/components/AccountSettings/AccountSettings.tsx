import { useState } from 'react';
import { ProfileTab } from './ProfileTab';
import { SecurityTab } from './SecurityTab';
import { PreferencesTab } from './PreferencesTab';
import './AccountSettings.css';

interface AccountSettingsProps {
  setCurrentView: (view: string) => void;
}

export function AccountSettings({ setCurrentView }: AccountSettingsProps) {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="account-settings-container">
      <div className="account-header-wrapper">
        <div className="breadcrumb" onClick={() => setCurrentView('overview')}>
          <span className="back-arrow">←</span> BACK TO DASHBOARD
        </div>
        <h1 className="account-page-title">Account Settings</h1>
        
        <div className="account-tabs">
          <button 
            className={`account-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <span className="tab-icon">👤</span> Profile
          </button>
          <button 
            className={`account-tab ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <span className="tab-icon">🛡️</span> Security & Sessions
          </button>
          <button 
            className={`account-tab ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            <span className="tab-icon">⚙️</span> Preferences & Privacy
          </button>
        </div>
      </div>

      <div className="account-tab-content">
        {activeTab === 'profile' && <ProfileTab />}
        {activeTab === 'security' && <SecurityTab />}
        {activeTab === 'preferences' && <PreferencesTab />}
      </div>
    </div>
  );
}
