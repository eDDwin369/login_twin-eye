import { useState } from 'react';
import { Search, Home, MapPin, Camera, X, FileText, Download } from 'lucide-react';
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
  sidebarLocked: boolean;
  setSidebarLocked: (locked: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  sidebarVisible: boolean;
  setSidebarVisible: (visible: boolean) => void;
  sidebarAutoHide: boolean;
  setSidebarAutoHide: (val: boolean) => void;
}

export function Dashboard({ 
  onLogout,
  sidebarLocked: isLocked,
  setSidebarLocked: handleSetIsLocked,
  sidebarCollapsed: collapsed,
  setSidebarCollapsed: handleSetCollapsed,
  sidebarVisible: isVisible,
  setSidebarVisible: setIsVisible,
  sidebarAutoHide,
  setSidebarAutoHide
}: DashboardProps) {
  const [currentView, setCurrentView] = useState('overview');
  const [isThemeStudioOpen, setIsThemeStudioOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [selectedFullNotification, setSelectedFullNotification] = useState<NotificationItem | null>(null);

  const [editProfileOnLoad, setEditProfileOnLoad] = useState(false);
  const [footerVisible, setFooterVisible] = useState(() => {
    const saved = localStorage.getItem('gs_footerVisible');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [copyrightText, setCopyrightText] = useState(() => {
    return localStorage.getItem('gs_copyrightText') || '© {year} OomniEye. All rights reserved.';
  });

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
      showCompanyCaption: false,
      textColor: '#000000',
      textColorApply: 'both'
    };
  });

  const handleSaveHeaderConfig = (newConfig: any) => {
    setHeaderConfig(newConfig);
    localStorage.setItem('headerConfig', JSON.stringify(newConfig));
    if (newConfig.startExpanded !== undefined) {
      handleSetCollapsed(!newConfig.startExpanded);
    }
    const savedFooter = localStorage.getItem('gs_footerVisible');
    if (savedFooter !== null) {
      setFooterVisible(JSON.parse(savedFooter));
    }
    const savedCopyright = localStorage.getItem('gs_copyrightText');
    if (savedCopyright) {
      setCopyrightText(savedCopyright);
    }
  };

  const handleSetCurrentView = (view: string, options?: any) => {
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

    if (view === 'account' && options?.editMode) {
      setEditProfileOnLoad(true);
    } else if (view === 'account') {
      setEditProfileOnLoad(false);
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
    // Show full content modal
    setSelectedFullNotification(notification);
    // Navigate
    handleSetCurrentView(notification.actionRoute);
  };

  const headerLeftPadding = (!isLocked && isVisible) 
    ? (collapsed ? '68px' : '260px') 
    : '0px';

  // Resolve Powered By custom footer branding
  const footerPoweredByType = (() => {
    try {
      const saved = localStorage.getItem('gs_footerPoweredByType');
      return saved ? JSON.parse(saved) : 'text';
    } catch {
      return 'text';
    }
  })();
  const footerPoweredByText = localStorage.getItem('gs_footerPoweredByText') || `Powered by ${headerConfig?.companyName || 'OomniEye'} Digital Solutions`;
  const footerPoweredByImage = localStorage.getItem('gs_footerPoweredByImage') || '';

  return (
    <div className="dashboard-wrapper dashboard-fade-in">
      <Header 
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
        onNotificationClick={handleNotificationClick}
        onViewAllClick={() => handleSetCurrentView('notifications')}
        onLogout={handleLogout}
        onNavigate={handleSetCurrentView}
        onSettingsClick={() => setIsGlobalSettingsOpen(true)}
        headerConfig={headerConfig}
      />
      <div className="dashboard-body">
        <Sidebar 
          currentView={currentView} 
          setCurrentView={handleSetCurrentView} 
          isThemeStudioOpen={isThemeStudioOpen}
          isLocked={isLocked}
          setIsLocked={handleSetIsLocked}
          collapsed={collapsed}
          setCollapsed={handleSetCollapsed}
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          autoHideSidebar={sidebarAutoHide}
        />
        
        <div className="dashboard-main">
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
                    editProfileOnLoad={editProfileOnLoad}
                    setEditProfileOnLoad={setEditProfileOnLoad}
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
        </div>
      </div>
      {footerVisible && (
        <footer 
          style={{
            height: '32px',
            backgroundColor: 'var(--bg-card, #ffffff)',
            borderTop: '1px solid var(--border-light, #e2e8f0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            fontSize: '11.5px',
            color: 'var(--text-secondary, #64748b)',
            flexShrink: 0,
            zIndex: 40
          }}
        >
          <div>Ready</div>
          <div>{copyrightText.replace('{year}', new Date().getFullYear().toString())}</div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {footerPoweredByType === 'image' && footerPoweredByImage ? (
              <img src={footerPoweredByImage} alt="Powered By Logo" style={{ maxHeight: '20px', objectFit: 'contain', display: 'block' }} />
            ) : (
              footerPoweredByText
            )}
          </div>
        </footer>
      )}
       {isGlobalSettingsOpen && (
        <GlobalSettingsWorkspace 
          onClose={() => setIsGlobalSettingsOpen(false)} 
          headerConfig={headerConfig}
          onSaveConfig={handleSaveHeaderConfig}
          sidebarAutoHide={sidebarAutoHide}
          setSidebarAutoHide={setSidebarAutoHide}
        />
      )}

      {selectedFullNotification && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100000
          }}
          onClick={() => setSelectedFullNotification(null)}
        >
          <div 
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              width: '480px',
              maxWidth: '90%',
              padding: '24px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedFullNotification(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#64748b',
                padding: '4px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={18} />
            </button>

            {/* Header / Meta */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{ 
                fontSize: '11px', 
                fontWeight: 600, 
                textTransform: 'uppercase', 
                letterSpacing: '0.5px',
                color: '#2563eb',
                backgroundColor: '#eff6ff',
                padding: '2px 8px',
                borderRadius: '4px'
              }}>
                {selectedFullNotification.category}
              </span>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                {new Date(selectedFullNotification.timestamp).toLocaleString()}
              </span>
            </div>

            {/* Title */}
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '12px', lineHeight: '1.4' }}>
              {selectedFullNotification.title}
            </h3>

            {/* Description */}
            <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6', marginBottom: '20px' }}>
              {selectedFullNotification.description}
            </p>

            {/* Actor & details if any */}
            {selectedFullNotification.actor && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#dbeafe',
                  color: '#2563eb',
                  fontWeight: 600,
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textTransform: 'uppercase'
                }}>
                  {selectedFullNotification.actor.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{selectedFullNotification.actor}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{selectedFullNotification.actionText || 'Updated details'}</div>
                </div>
              </div>
            )}

            {/* Attachment if any */}
            {selectedFullNotification.attachment && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', backgroundColor: '#f1f5f9', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <div style={{ width: '32px', height: '32px', backgroundColor: '#ef4444', color: '#ffffff', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={18} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {selectedFullNotification.attachment.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    {selectedFullNotification.attachment.size}
                  </div>
                </div>
                <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}>
                  <Download size={16} />
                </button>
              </div>
            )}

            {/* Close button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setSelectedFullNotification(null)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
