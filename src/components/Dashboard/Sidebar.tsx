import { useState, useEffect, useRef } from 'react';
import {
  LayoutGrid,
  Grid,
  Store,
  BarChart2,
  FlaskConical,
  Palette,
  UserCircle,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import './Dashboard.css';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  isThemeStudioOpen?: boolean;
  isLocked: boolean;
  setIsLocked: (locked: boolean) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
}

export function Sidebar({
  currentView,
  setCurrentView,
  isThemeStudioOpen,
  isLocked,
  setIsLocked,
  collapsed,
  setCollapsed,
  isVisible,
  setIsVisible
}: SidebarProps) {

  // Hover state specifically for logo in collapsed state
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  const hideTimeoutRef = useRef<any>(null);

  // Reset visibility when lock state changes
  useEffect(() => {
    if (!isLocked) {
      setIsVisible(false);
    }
  }, [isLocked]);

  // Handle Theme Studio triggers
  useEffect(() => {
    if (isThemeStudioOpen) {
      setCollapsed(true);
    }
  }, [isThemeStudioOpen]);

  const handleMouseEnter = () => {
    if (!isLocked) {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isLocked) {
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
        setCollapsed(true);
      }, 800);
    }
  };

  const handleSidebarClick = () => {
    if (collapsed) {
      setCollapsed(false);
    }
  };

  // Evaluate collapsed status
  const isSidebarCollapsed = collapsed;

  return (
    <>
      {/* Invisible Hover Zone on the left viewport edge (only when unlocked & hidden) */}
      {!isLocked && !isVisible && (
        <div
          onMouseEnter={handleMouseEnter}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '12px',
            zIndex: 9999,
            background: 'transparent'
          }}
        />
      )}

      <aside
        className={`dash-sidebar ${!isLocked ? 'unlocked' : ''} ${!isLocked && isVisible ? 'visible' : ''} ${isSidebarCollapsed ? 'collapsed' : ''}`}
        onClick={handleSidebarClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: isSidebarCollapsed ? 'pointer' : 'default' }}
      >
        {isSidebarCollapsed && (
          <div
            className="sidebar-header"
            style={{
              height: '52px',
              display: 'flex',
              justifyContent: 'center',
              padding: '0',
              alignItems: 'center',
              transition: 'all 0.25s ease',
              borderBottom: '1px solid var(--border-light, #e2e8f0)'
            }}
          >
            <div
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}
            >
              <button
                title="Open sidebar"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '8px',
                  backgroundColor: isLogoHovered ? '#f1f5f9' : 'transparent',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: isLogoHovered ? '#1a73e8' : '#64748b',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={() => setIsLogoHovered(true)}
                onMouseLeave={() => setIsLogoHovered(false)}
                onClick={(e) => {
                  e.stopPropagation();
                  setCollapsed(false);
                }}
              >
                <PanelLeftOpen size={20} />
              </button>
            </div>
          </div>
        )}

        <div
          className="sidebar-nav"
          style={{ paddingTop: isSidebarCollapsed ? '0' : '16px' }}
        >
          <a
            href="#"
            className={`nav-item ${currentView === 'overview' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setCurrentView('overview'); }}
            style={{ display: 'flex', alignItems: 'center', width: '100%', position: 'relative' }}
          >
            <LayoutGrid size={20} className="nav-icon" color="#3b82f6" />
            <span className="nav-label" style={{ flex: 1 }}>Dashboard</span>
            {!isSidebarCollapsed && (
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingRight: '8px' }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setIsLocked(!isLocked)}
                  title={isLocked ? "Unlock sidebar" : "Lock sidebar"}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isLocked ? '#2563eb' : '#94a3b8',
                    padding: '4px',
                    borderRadius: '4px',
                    transition: 'all 0.15s ease'
                  }}
                  className="sidebar-toggle"
                >
                  {isLocked ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="17" x2="12" y2="22" />
                      <path d="M5 17h14v-1.76a2 2 0 0 0-.44-1.24l-2.78-3.5A2 2 0 0 1 15 9.26V5a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4.26a2 2 0 0 1-.78 1.24l-2.78 3.5a2 2 0 0 0-.44 1.24Z" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(-45deg)' }}>
                      <line x1="12" y1="17" x2="12" y2="22" />
                      <path d="M5 17h14v-1.76a2 2 0 0 0-.44-1.24l-2.78-3.5A2 2 0 0 1 15 9.26V5a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4.26a2 2 0 0 1-.78 1.24l-2.78 3.5a2 2 0 0 0-.44 1.24Z" />
                    </svg>
                  )}
                </button>
                <button
                  className="sidebar-toggle"
                  onClick={() => setCollapsed(true)}
                  title="Collapse sidebar"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#94a3b8',
                    padding: '4px',
                    borderRadius: '4px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <PanelLeftClose size={14} />
                </button>
              </div>
            )}
          </a>
          <a href="#" className="nav-item" onClick={(e) => e.preventDefault()}>
            <Grid size={20} className="nav-icon" color="#10b981" />
            <span className="nav-label">Menu Item 1</span>
          </a>
          <a href="#" className="nav-item" onClick={(e) => e.preventDefault()}>
            <Store size={20} className="nav-icon" color="#f59e0b" />
            <span className="nav-label">Menu Item 2</span>
          </a>

          <div className="nav-section-title">REPORTS</div>
          <div className="nav-divider"></div>

          <a
            href="#reports"
            className={`nav-item ${currentView === 'reports' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setCurrentView('reports'); }}
          >
            <BarChart2 size={20} className="nav-icon" color="#8b5cf6" />
            <span className="nav-label">Report Builder</span>
          </a>
          <a
            href="#reports"
            className={`nav-item ${currentView === 'reports' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setCurrentView('reports'); }}
          >
            <FlaskConical size={20} className="nav-icon" color="#ec4899" />
            <span className="nav-label">Testing Reports</span>
          </a>

          <div className="nav-section-title">SYSTEM</div>
          <div className="nav-divider"></div>

          <a
            href="#theme-studio"
            className={`nav-item ${isThemeStudioOpen ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              setCurrentView('theme-studio');
            }}
          >
            <Palette size={20} className="nav-icon" color="#14b8a6" />
            <span className="nav-label">Theme Studio</span>
          </a>
          <a
            href="#"
            className={`nav-item ${currentView === 'account' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setCurrentView('account'); }}
          >
            <UserCircle size={20} className="nav-icon" color="#6366f1" />
            <span className="nav-label">Account Settings</span>
          </a>
        </div>

      </aside>
    </>
  );
}
