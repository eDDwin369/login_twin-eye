import { useState } from 'react';
import { 
  LayoutGrid, 
  Grid, 
  Store, 
  BarChart2, 
  FlaskConical, 
  Palette, 
  UserCircle,
  PanelLeftClose,
  LogOut,
  ChevronRight,
  LifeBuoy
} from 'lucide-react';
import './Dashboard.css';
import logo from '../../assets/logo.png';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onLogout?: () => void;
}

export function Sidebar({ currentView, setCurrentView, onLogout }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(true);
  const [showLogoutOptions, setShowLogoutOptions] = useState(false);

  const handleSidebarClick = () => {
    if (collapsed) {
      setCollapsed(false);
    }
  };

  return (
    <aside 
      className={`dash-sidebar ${collapsed ? 'collapsed' : ''}`}
      onClick={handleSidebarClick}
      style={{ cursor: collapsed ? 'pointer' : 'default' }}
    >
      <div className="sidebar-header" style={{ justifyContent: collapsed ? 'center' : 'space-between', padding: collapsed ? '1rem 0' : '1.5rem 1.5rem 1rem' }}>
        <div className="sidebar-brand">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start' }}>
            <img src={logo} alt="OmniEye Logo" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
          </div>
        </div>
        
        {!collapsed && (
          <div className="custom-tooltip-wrapper">
            <button 
              className="sidebar-toggle" 
              onClick={(e) => {
                e.stopPropagation();
                setCollapsed(true);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px',
                borderRadius: '6px'
              }}
            >
              <PanelLeftClose size={18} />
            </button>
            <div className="custom-tooltip">Close sidebar</div>
          </div>
        )}
      </div>

      <div className="sidebar-nav">
        <a 
          href="#" 
          className={`nav-item ${currentView === 'overview' ? 'active' : ''}`} 
          onClick={(e) => { e.preventDefault(); setCurrentView('overview'); }}
        >
          <LayoutGrid size={20} className="nav-icon" />
          {!collapsed && <span className="nav-label">Dashboard</span>}
        </a>
        <a href="#" className="nav-item" onClick={(e) => e.preventDefault()}>
          <Grid size={20} className="nav-icon" />
          {!collapsed && <span className="nav-label">Menu Item 1</span>}
        </a>
        <a href="#" className="nav-item" onClick={(e) => e.preventDefault()}>
          <Store size={20} className="nav-icon" />
          {!collapsed && <span className="nav-label">Menu Item 2</span>}
        </a>

        {!collapsed && <div className="nav-section-title">REPORTS</div>}
        {collapsed && <div className="nav-divider"></div>}
        
        <a href="#" className="nav-item" onClick={(e) => e.preventDefault()}>
          <BarChart2 size={20} className="nav-icon" />
          {!collapsed && <span className="nav-label">Report Builder</span>}
        </a>
        <a href="#" className="nav-item" onClick={(e) => e.preventDefault()}>
          <FlaskConical size={20} className="nav-icon" />
          {!collapsed && <span className="nav-label">Testing Reports</span>}
        </a>

        {!collapsed && <div className="nav-section-title">SYSTEM</div>}
        {collapsed && <div className="nav-divider"></div>}

        <a href="#" className="nav-item" onClick={(e) => e.preventDefault()}>
          <Palette size={20} className="nav-icon" />
          {!collapsed && <span className="nav-label">Theme Studio</span>}
        </a>
        <a 
          href="#" 
          className={`nav-item ${currentView === 'account' ? 'active' : ''}`} 
          onClick={(e) => { e.preventDefault(); setCurrentView('account'); }}
        >
          <UserCircle size={20} className="nav-icon" />
          {!collapsed && <span className="nav-label">My Account</span>}
        </a>
      </div>

      <div className="sidebar-footer" style={{ padding: collapsed ? '16px 8px' : '16px', position: 'relative', display: 'flex', justifyContent: 'center' }}>
        <div 
          onClick={(e) => { e.stopPropagation(); setShowLogoutOptions(!showLogoutOptions); }}
          style={{ display: 'flex', alignItems: 'center', gap: collapsed ? '0' : '12px', cursor: 'pointer', padding: '8px', borderRadius: '8px', transition: 'background 0.2s', width: '100%', justifyContent: collapsed ? 'center' : 'flex-start' }}
          onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-dashboard)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <div style={{ background: '#22c55e', color: 'white', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '13px', flexShrink: 0 }}>
            EA
          </div>
          {!collapsed && (
            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <span style={{ fontWeight: '500', fontSize: '14px', color: 'var(--text-main)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>Edwin Antony</span>
            </div>
          )}
        </div>
        
        {showLogoutOptions && (
          <div style={{
            position: 'absolute',
            bottom: '100%',
            left: collapsed ? '16px' : '16px',
            right: collapsed ? 'auto' : '16px',
            marginBottom: '8px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 100,
            overflow: 'hidden',
            width: '220px',
            display: 'flex',
            flexDirection: 'column',
            padding: '8px 0'
          }}>
            <div className="profile-menu-item" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', cursor: 'pointer', color: 'var(--text-main)', fontSize: '15px' }} onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-dashboard)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
              <LifeBuoy size={20} />
              <span style={{ flex: 1, textAlign: 'left' }}>Help</span>
              <ChevronRight size={18} color="var(--text-main)" />
            </div>
            <div 
              className="profile-menu-item" 
              onClick={(e) => { e.stopPropagation(); if (onLogout) onLogout(); setShowLogoutOptions(false); }}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', cursor: 'pointer', color: 'var(--text-main)', fontSize: '15px' }} 
              onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-dashboard)'} 
              onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <LogOut size={20} />
              <span style={{ flex: 1, textAlign: 'left' }}>Log out</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
