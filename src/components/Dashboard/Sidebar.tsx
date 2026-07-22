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
  PanelLeftOpen,
  Pin,
  PinOff
} from 'lucide-react';
import './Dashboard.css';
import logo from '../../assets/logo.png';

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

  // Context menu state
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const hideTimeoutRef = useRef<any>(null);

  // Close context menu on any global click
  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

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
            position: 'fixed',
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
        onContextMenu={(e) => {
          e.preventDefault();
          setContextMenu({ x: e.clientX, y: e.clientY });
        }}
        style={{ cursor: isSidebarCollapsed ? 'pointer' : 'default' }}
      >
        <div 
          className="sidebar-header" 
          style={{ 
            height: isSidebarCollapsed ? '64px' : '110px',
            justifyContent: isSidebarCollapsed ? 'center' : 'space-between', 
            padding: isSidebarCollapsed ? '0' : '12px 16px 12px 24px',
            alignItems: 'center',
            transition: 'height 0.25s ease'
          }}
        >
          {/* Logo Brand / Hover Icon Toggle Section */}
          <div 
            className="sidebar-brand" 
            style={{ 
              display: 'flex', 
              flex: 1, 
              justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
              alignItems: 'center' 
            }}
            onMouseEnter={() => setIsLogoHovered(true)}
            onMouseLeave={() => setIsLogoHovered(false)}
          >
            {isSidebarCollapsed && isLogoHovered ? (
              /* Hover Panel Open Icon - ChatGPT visual reference matching */
              <div 
                title="Open sidebar"
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '8px',
                  backgroundColor: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#475569',
                  transition: 'all 0.15s ease'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setCollapsed(false);
                }}
              >
                <PanelLeftOpen size={24} />
              </div>
            ) : (
              /* Logo display element */
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: isSidebarCollapsed ? 'center' : 'flex-start', 
                  cursor: 'pointer',
                  flex: 1
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isSidebarCollapsed) {
                    setCollapsed(false);
                  } else {
                    setCurrentView('overview');
                  }
                }}
              >
                {/* Dynamic Scaling Logo */}
                <img 
                  src={logo} 
                  alt="OmniEye Logo" 
                  style={{ 
                    height: isSidebarCollapsed ? '52px' : '80px', 
                    width: isSidebarCollapsed ? '52px' : 'auto', 
                    objectFit: isSidebarCollapsed ? 'cover' : 'contain',
                    objectPosition: isSidebarCollapsed ? 'top center' : 'center',
                    transition: 'all 0.25s ease',
                    borderRadius: isSidebarCollapsed ? '8px' : '0'
                  }} 
                />
              </div>
            )}
          </div>
          
          <div className="sidebar-header-actions">
            {/* Pin/Lock Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsLocked(!isLocked);
              }}
              title={isLocked ? "Unlock sidebar (auto-hide)" : "Lock sidebar in place"}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: isLocked ? '#2563eb' : '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px',
                borderRadius: '6px',
                transition: 'background-color 0.15s ease'
              }}
              className="sidebar-toggle"
            >
              {isLocked ? <Pin size={16} /> : <PinOff size={16} />}
            </button>

            {/* Close/Collapse Button (only when locked) */}
            {isLocked && (
              <button 
                className="sidebar-toggle" 
                onClick={(e) => {
                  e.stopPropagation();
                  setCollapsed(true);
                }}
                title="Collapse sidebar"
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px',
                  borderRadius: '6px'
                }}
              >
                <PanelLeftClose size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="sidebar-nav">
          <a 
            href="#" 
            className={`nav-item ${currentView === 'overview' ? 'active' : ''}`} 
            onClick={(e) => { e.preventDefault(); setCurrentView('overview'); }}
          >
            <LayoutGrid size={20} className="nav-icon" color="#3b82f6" />
            <span className="nav-label">Dashboard</span>
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
            <span className="nav-label">My Account</span>
          </a>
        </div>

      </aside>

      {/* Sleek context menu (Windows taskbar style) */}
      {contextMenu && (
        <div 
          style={{
            position: 'fixed',
            left: `${contextMenu.x}px`,
            top: `${contextMenu.y}px`,
            backgroundColor: '#1e293b',
            border: '1px solid #475569',
            borderRadius: '8px',
            padding: '8px 12px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.35)',
            zIndex: 100000,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            userSelect: 'none',
            transition: 'background-color 0.15s ease'
          }}
          onClick={(e) => {
            e.stopPropagation();
            setIsLocked(!isLocked); // Toggle locked/unlocked state (Locked = !autohide)
            setContextMenu(null);
          }}
        >
          <input
            type="checkbox"
            checked={!isLocked}
            readOnly
            style={{
              width: '14px',
              height: '14px',
              accentColor: '#3b82f6',
              cursor: 'pointer',
              margin: 0
            }}
          />
          <span style={{ fontSize: '12px', color: '#f8fafc', fontWeight: 500 }}>
            Automatically hide the sidebar
          </span>
        </div>
      )}
    </>
  );
}
