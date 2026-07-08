import { useState, useEffect } from 'react';
import { 
  X, MoreVertical, Layout, LayoutPanelTop, LayoutPanelLeft, 
  ShieldCheck, Users, LogIn, Bell, Palette, Settings, RotateCcw
} from 'lucide-react';
import './GlobalSettingsWorkspace.css';
import { ProfileTab } from '../AccountSettings/ProfileTab';
import { SecurityTab } from '../AccountSettings/SecurityTab';
import { PreferencesTab } from '../AccountSettings/PreferencesTab';

interface GlobalSettingsWorkspaceProps {
  onClose: () => void;
}

type NavSection = 'header' | 'footer' | 'sidebar' | 'security' | 'profile' | 'login' | 'notifications' | 'branding' | 'advanced';

export function GlobalSettingsWorkspace({ onClose }: GlobalSettingsWorkspaceProps) {
  const [activeSection, setActiveSection] = useState<NavSection>('security');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(new Date());
  

  const handleClose = () => {
    if (hasUnsavedChanges) {
      if (window.confirm("Discard your changes?")) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const handleSave = () => {
    setHasUnsavedChanges(false);
    setLastSaved(new Date());
  };

  const handleDiscard = () => {
    setHasUnsavedChanges(false);
    // Reset local state here if needed
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [hasUnsavedChanges]); // Need dependency so we get correct state in handleClose

  const navItems = [
    { id: 'security', label: 'Security', icon: <ShieldCheck size={18} /> },
    { id: 'profile', label: 'Customer Profile', icon: <Users size={18} /> },
    { id: 'login', label: 'Login Configuration', icon: <LogIn size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'branding', label: 'Branding', icon: <Palette size={18} /> },
    { id: 'header', label: 'Header', icon: <LayoutPanelTop size={18} /> },
    { id: 'sidebar', label: 'Sidebar', icon: <LayoutPanelLeft size={18} /> },
    { id: 'footer', label: 'Footer', icon: <Layout size={18} /> },
    { id: 'advanced', label: 'Advanced', icon: <Settings size={18} /> },
  ];

  return (
    <div className="gs-overlay" onClick={handleClose}>
      <div className="gs-modal" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="gs-header">
          <div className="gs-header-left">
            <div className="gs-title-row">
              <h2><Settings size={22} /> Application Settings</h2>
              {hasUnsavedChanges && (
                <div className="gs-unsaved-badge">
                  <span className="dot"></span> Unsaved Changes
                </div>
              )}
            </div>
            <p className="gs-description">Configure global branding, navigation and application behaviour.</p>
          </div>
          <div className="gs-header-right">
            {lastSaved && !hasUnsavedChanges && (
              <span className="gs-timestamp">
                ✓ All changes saved (Last saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
              </span>
            )}
            <div className="gs-overflow-menu">
              <button className="gs-icon-btn">
                <MoreVertical size={18} />
              </button>
            </div>
            <button className="gs-icon-btn" onClick={handleClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Main Body */}
        <div className="gs-body">
          
          {/* Vertical Navigation */}
          <div className="gs-nav">
            {navItems.map(item => (
              <button 
                key={item.id}
                className={`gs-nav-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => setActiveSection(item.id as NavSection)}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </div>

          {/* Configuration Content */}
          <div className="gs-content">
            <h3 className="gs-section-title">
              {navItems.find(i => i.id === activeSection)?.icon} 
              {navItems.find(i => i.id === activeSection)?.label}
            </h3>

            {/* Render forms based on active section */}
            {activeSection === 'profile' && (
              <div className="gs-card">
                <ProfileTab setHasUnsavedChanges={setHasUnsavedChanges} />
              </div>
            )}
            
            {activeSection === 'security' && (
              <div className="gs-card">
                <SecurityTab />
              </div>
            )}

            {activeSection === 'advanced' && (
              <div className="gs-card">
                <PreferencesTab />
              </div>
            )}

            {/* Placeholders for other sections */}
            {['header', 'footer', 'sidebar', 'login', 'notifications', 'branding'].includes(activeSection) && (
              <div className="gs-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', color: '#64748B' }}>
                <Settings size={32} style={{ marginBottom: '16px', opacity: 0.5 }} />
                <p>Configuration options for {activeSection} will appear here.</p>
              </div>
            )}
            
          </div>

          {/* Sticky Live Preview */}
          <div className="gs-preview">
            <div className="gs-preview-header">
              Live Preview
            </div>
            <div className="gs-preview-window">
              {/* Dummy Preview */}
              <div style={{ padding: '16px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ width: '80px', height: '20px', background: '#E2E8F0', borderRadius: '4px' }}></div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ width: '20px', height: '20px', background: '#E2E8F0', borderRadius: '50%' }}></div>
                  <div style={{ width: '20px', height: '20px', background: '#E2E8F0', borderRadius: '50%' }}></div>
                </div>
              </div>
              <div style={{ display: 'flex', height: '100%' }}>
                <div style={{ width: '48px', height: '100%', background: '#F8FAFC', borderRight: '1px solid #E2E8F0' }}></div>
                <div style={{ flex: 1, padding: '16px' }}>
                  <div style={{ width: '100px', height: '16px', background: '#E2E8F0', borderRadius: '4px', marginBottom: '16px' }}></div>
                  <div style={{ width: '100%', height: '60px', background: '#F1F5F9', borderRadius: '8px', marginBottom: '8px' }}></div>
                  <div style={{ width: '100%', height: '60px', background: '#F1F5F9', borderRadius: '8px' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="gs-footer">
          <button className="gs-footer-btn gs-btn-reset" onClick={() => setHasUnsavedChanges(true)}>
            <RotateCcw size={14} style={{ display: 'inline', marginRight: '6px' }} />
            Reset All
          </button>
          <div className="gs-footer-right">
            {hasUnsavedChanges && (
              <button className="gs-footer-btn gs-btn-secondary" onClick={handleDiscard}>
                Discard Changes
              </button>
            )}
            <button 
              className="gs-footer-btn gs-btn-primary" 
              disabled={!hasUnsavedChanges}
              onClick={handleSave}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
