import { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { TemplateWelcome } from './TemplateWelcome';
import { AccountSettings } from '../AccountSettings/AccountSettings';
import { NotificationsPage } from '../Notifications/NotificationsPage';
import { mockNotifications } from '../Notifications/mockData';
import type { NotificationItem } from '../Notifications/types';
import './Dashboard.css';

interface DashboardProps {
  onLogout?: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [currentView, setCurrentView] = useState('overview');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);

  const handleSetCurrentView = (view: string) => {
    if (hasUnsavedChanges) {
      if (!window.confirm("You have unsaved changes. Are you sure you want to discard them?")) {
        return;
      }
      setHasUnsavedChanges(false);
    }
    setCurrentView(view);
  };

  const handleLogout = () => {
    if (hasUnsavedChanges) {
      if (!window.confirm("You have unsaved changes. Are you sure you want to discard them?")) {
        return;
      }
    }
    if (onLogout) onLogout();
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleClearRead = () => {
    setNotifications(prev => prev.filter(n => !n.isRead));
  };

  const handleNotificationClick = (notification: NotificationItem) => {
    // Mark as read
    setNotifications(prev => prev.map(n => 
      n.id === notification.id ? { ...n, isRead: true } : n
    ));
    // Navigate
    handleSetCurrentView(notification.actionRoute);
  };

  return (
    <div className="dashboard-wrapper dashboard-fade-in">
      <Sidebar currentView={currentView} setCurrentView={handleSetCurrentView} onLogout={handleLogout} />
      <div className="dashboard-main">
        <Header 
          notifications={notifications}
          onMarkAllRead={handleMarkAllRead}
          onNotificationClick={handleNotificationClick}
          onViewAllClick={() => handleSetCurrentView('notifications')}
        />
        <div className="dashboard-content-scrollable">
          <div className="dashboard-container">
            {currentView === 'overview' ? (
              <TemplateWelcome onNavigate={handleSetCurrentView} />
            ) : currentView === 'notifications' ? (
              <NotificationsPage 
                notifications={notifications}
                onMarkAllRead={handleMarkAllRead}
                onClearRead={handleClearRead}
                onNotificationClick={handleNotificationClick}
              />
            ) : currentView === 'account' ? (
              <AccountSettings 
                setCurrentView={handleSetCurrentView} 
                hasUnsavedChanges={hasUnsavedChanges}
                setHasUnsavedChanges={setHasUnsavedChanges}
              />
            ) : (
              <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <h2>{currentView.replace('-', ' ').toUpperCase()}</h2>
                <p style={{ marginTop: '16px' }}>This page is under construction. Navigated from notification.</p>
                <button 
                  onClick={() => handleSetCurrentView('overview')}
                  style={{ marginTop: '24px', padding: '8px 16px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
