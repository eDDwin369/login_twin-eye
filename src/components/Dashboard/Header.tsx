import { useState } from 'react';
import { Search, Sparkles, Bell, HelpCircle, Sun, Settings, LogOut } from 'lucide-react';
import './Dashboard.css';

interface HeaderProps {
  onLogout?: () => void;
}

export function Header({ onLogout }: HeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="dash-header">
      <div className="header-left">
      </div>
      
      <div className="header-center">
        <div className="search-bar">
          <Search size={16} />
          <input type="text" placeholder="Search projects, reports..." />
          <span className="search-shortcut">⌘K</span>
        </div>
      </div>
      
      <div className="header-right">
        <button className="header-icon-btn" title="AI Assistant">
          <Sparkles size={18} />
        </button>
        <button className="header-icon-btn" title="Notifications">
          <Bell size={18} />
        </button>
        <button className="header-icon-btn" title="Help">
          <HelpCircle size={18} />
        </button>
        <button className="header-icon-btn" title="Toggle Theme">
          <Sun size={18} />
        </button>
        <button className="header-icon-btn" title="Settings">
          <Settings size={18} />
        </button>
        <div style={{ position: 'relative' }}>
          <div className="header-avatar" title="User Menu" onClick={() => setShowDropdown(!showDropdown)}>
            EA
          </div>
          {showDropdown && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '8px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              width: '160px',
              zIndex: 100,
              overflow: 'hidden'
            }}>
              <button 
                onClick={onLogout}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  background: 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  fontSize: '13px',
                  color: 'var(--danger)',
                  cursor: 'pointer',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-dashboard)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
