import React, { useState } from 'react';
import { 
  LayoutGrid, 
  Grid, 
  Store, 
  BarChart2, 
  FlaskConical, 
  Palette, 
  UserCircle,
  ChevronLeft,
  X,
  Menu
} from 'lucide-react';
import './Dashboard.css';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export function Sidebar({ currentView, setCurrentView }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`dash-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!collapsed && (
          <div className="sidebar-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ background: 'var(--primary)', color: 'white', width: '28px', height: '28px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' }}>M</div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: '600', fontSize: '15px', color: 'var(--text-main)', lineHeight: '1.2' }}>MyProduct</span>
                <span style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Enterprise Platform</span>
              </div>
            </div>
          </div>
        )}
        <button 
          className="sidebar-toggle" 
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
        </button>
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

      {!collapsed && (
        <div className="sidebar-footer">
          Project Template v1.0
        </div>
      )}
    </aside>
  );
}
