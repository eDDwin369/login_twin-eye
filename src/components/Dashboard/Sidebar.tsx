import { useState, useEffect } from 'react';
import { 
  LayoutGrid, 
  Grid, 
  Store, 
  BarChart2, 
  FlaskConical, 
  Palette, 
  UserCircle,
  PanelLeftClose
} from 'lucide-react';
import './Dashboard.css';
import logo from '../../assets/logo.png';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  isThemeStudioOpen?: boolean;
}

export function Sidebar({ currentView, setCurrentView, isThemeStudioOpen }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    if (isThemeStudioOpen) {
      setCollapsed(true);
    }
  }, [isThemeStudioOpen]);

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
          <div 
            style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', cursor: 'pointer' }}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentView('overview');
            }}
          >
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
          <LayoutGrid size={20} className="nav-icon" color="#3b82f6" />
          {!collapsed && <span className="nav-label">Dashboard</span>}
        </a>
        <a href="#" className="nav-item" onClick={(e) => e.preventDefault()}>
          <Grid size={20} className="nav-icon" color="#10b981" />
          {!collapsed && <span className="nav-label">Menu Item 1</span>}
        </a>
        <a href="#" className="nav-item" onClick={(e) => e.preventDefault()}>
          <Store size={20} className="nav-icon" color="#f59e0b" />
          {!collapsed && <span className="nav-label">Menu Item 2</span>}
        </a>

        {!collapsed && <div className="nav-section-title">REPORTS</div>}
        {collapsed && <div className="nav-divider"></div>}
        
        <a 
          href="#reports" 
          className={`nav-item ${currentView === 'reports' ? 'active' : ''}`} 
          onClick={(e) => { e.preventDefault(); setCurrentView('reports'); }}
        >
          <BarChart2 size={20} className="nav-icon" color="#8b5cf6" />
          {!collapsed && <span className="nav-label">Report Builder</span>}
        </a>
        <a 
          href="#reports" 
          className={`nav-item ${currentView === 'reports' ? 'active' : ''}`} 
          onClick={(e) => { e.preventDefault(); setCurrentView('reports'); }}
        >
          <FlaskConical size={20} className="nav-icon" color="#ec4899" />
          {!collapsed && <span className="nav-label">Testing Reports</span>}
        </a>

        {!collapsed && <div className="nav-section-title">SYSTEM</div>}
        {collapsed && <div className="nav-divider"></div>}

        <a 
          href="#theme-studio"
          className={`nav-item ${isThemeStudioOpen ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            setCurrentView('theme-studio');
          }}
        >
          <Palette size={20} className="nav-icon" color="#14b8a6" />
          {!collapsed && <span className="nav-label">Theme Studio</span>}
        </a>
        <a 
          href="#" 
          className={`nav-item ${currentView === 'account' ? 'active' : ''}`} 
          onClick={(e) => { e.preventDefault(); setCurrentView('account'); }}
        >
          <UserCircle size={20} className="nav-icon" color="#6366f1" />
          {!collapsed && <span className="nav-label">My Account</span>}
        </a>
      </div>

    </aside>
  );
}
