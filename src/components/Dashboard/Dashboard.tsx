import { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { TemplateWelcome } from './TemplateWelcome';
import { AccountSettings } from '../AccountSettings/AccountSettings';
import { NotificationsPage } from '../Notifications/NotificationsPage';
import { ThemeStudioLayout } from './ThemeStudioLayout';
import { OrdersView } from './OrdersView';
import { PlaceholderView } from './PlaceholderView';
import { PreviewLogin } from './PreviewLogin';
import { FormView } from './FormView';
import { ReportsPage } from './ReportsPage';
import { mockNotifications } from '../Notifications/mockData';
import type { NotificationItem } from '../Notifications/types';
import { GlobalSettingsWorkspace } from '../GlobalSettings/GlobalSettingsWorkspace';
import './Dashboard.css';

interface DashboardProps {
  onLogout?: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [currentView, setCurrentView] = useState('overview');
  const [isThemeStudioOpen, setIsThemeStudioOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);

  // Sidebar states
  const [isLocked, setIsLocked] = useState(() => {
    const saved = localStorage.getItem('sidebarLocked');
    return saved !== null ? JSON.parse(saved) : false;
  });
  const [collapsed, setCollapsed] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  const handleSetIsLocked = (locked: boolean) => {
    setIsLocked(locked);
    localStorage.setItem('sidebarLocked', JSON.stringify(locked));
  };

  // Global settings modal state
  const [isGlobalSettingsOpen, setIsGlobalSettingsOpen] = useState(false);
  const [headerConfig, setHeaderConfig] = useState(() => {
    const saved = localStorage.getItem('headerConfig');
    return saved ? JSON.parse(saved) : {
      logo: '',
      showLogo: true,
      companyName: 'OomniEye',
      showCompanyName: true,
      companyCaption: 'Digital Twin Solutions',
      showCompanyCaption: true,
      textColor: '#4A6FA5',
      textColorApply: 'both'
    };
  });

  const handleSaveHeaderConfig = (newConfig: any) => {
    setHeaderConfig(newConfig);
    localStorage.setItem('headerConfig', JSON.stringify(newConfig));
  };

  const handleSetCurrentView = (view: string) => {
    if (view === 'theme-studio') {
      setIsThemeStudioOpen(true);
      return;
    }

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

  const headerLeftPadding = (!isLocked && isVisible) 
    ? (collapsed ? '68px' : '260px') 
    : '0px';

  return (
    <div className="dashboard-wrapper dashboard-fade-in">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={handleSetCurrentView} 
        isThemeStudioOpen={isThemeStudioOpen}
        isLocked={isLocked}
        setIsLocked={handleSetIsLocked}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
      />
      <div className="dashboard-main">
        <Header 
          notifications={notifications}
          onMarkAllRead={handleMarkAllRead}
          onNotificationClick={handleNotificationClick}
          onViewAllClick={() => handleSetCurrentView('notifications')}
          onLogout={handleLogout}
          onNavigate={handleSetCurrentView}
          onSettingsClick={() => setIsGlobalSettingsOpen(true)}
          headerConfig={headerConfig}
          leftPadding={headerLeftPadding}
        />
        <div 
          className="dashboard-content-scrollable"
          style={{
            paddingLeft: headerLeftPadding,
            transition: 'padding-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {isThemeStudioOpen ? (
            <ThemeStudioLayout 
              onClose={() => {
                setIsThemeStudioOpen(false);
                handleSetCurrentView('overview');
              }} 
              currentView={currentView}
              onNavigate={handleSetCurrentView}
              notifications={notifications}
              handleMarkAllRead={handleMarkAllRead}
              handleClearRead={handleClearRead}
              handleNotificationClick={handleNotificationClick}
              hasUnsavedChanges={hasUnsavedChanges}
              setHasUnsavedChanges={setHasUnsavedChanges}
            />
          ) : (
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
                  hasUnsavedChanges={hasUnsavedChanges}
                  setHasUnsavedChanges={setHasUnsavedChanges}
                />
              ) : currentView === 'orders' ? (
                <OrdersView />
              ) : currentView === 'login' ? (
                <PreviewLogin />
              ) : currentView === 'form' ? (
                <FormView />
              ) : currentView === 'reports' ? (
                <ReportsPage />
              ) : ['operations', 'cameras', 'settings', 'components'].includes(currentView) ? (
                <PlaceholderView title={currentView.charAt(0).toUpperCase() + currentView.slice(1)} />
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
          )}
        </div>
        <footer 
          style={{
            height: '32px',
            backgroundColor: 'var(--bg-card, #ffffff)',
            borderTop: '1px solid var(--border-light, #e2e8f0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            paddingLeft: `calc(20px + ${headerLeftPadding})`,
            fontSize: '11.5px',
            color: 'var(--text-secondary, #64748b)',
            flexShrink: 0,
            transition: 'padding-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 40
          }}
        >
          <div>Ready</div>
          <div>© {new Date().getFullYear()} {headerConfig?.companyName || 'OomniEye'}. All rights reserved.</div>
          <div>Powered by {headerConfig?.companyName || 'OomniEye'} Digital Solutions</div>
        </footer>
      </div>
      {isGlobalSettingsOpen && (
        <GlobalSettingsWorkspace 
          onClose={() => setIsGlobalSettingsOpen(false)} 
          headerConfig={headerConfig}
          onSaveConfig={handleSaveHeaderConfig}
        />
      )}
    </div>
  );
}
