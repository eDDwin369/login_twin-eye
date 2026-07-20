import { useState, useRef, useEffect } from 'react';
import { Bell, Settings, X, Camera, User } from 'lucide-react';
import { NotificationDropdown } from '../Notifications/NotificationDropdown';
import type { NotificationItem } from '../Notifications/types';
import logo from '../../assets/logo.png';
import './Dashboard.css';

const PRESET_THEMES = [
  { id: 'corporate-blue', label: 'Corporate Blue' },
  { id: 'emerald', label: 'Emerald Green' },
  { id: 'indigo-violet', label: 'Indigo Violet' },
  { id: 'graphite', label: 'Graphite Charcoal' },
  { id: 'ocean-teal', label: 'Ocean Teal' },
  { id: 'amber', label: 'Amber Orange' }
];

interface HeaderProps {
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onNotificationClick: (notification: NotificationItem) => void;
  onViewAllClick: () => void;
  onLogout?: () => void;
  onNavigate?: (view: string) => void;
}

export function Header({ 
  notifications,
  onMarkAllRead,
  onNotificationClick,
  onViewAllClick,
  onLogout,
  onNavigate
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const [currentTheme, setCurrentTheme] = useState<string>('corporate-blue');

  // Initialize theme from document element on mount
  useEffect(() => {
    const active = document.documentElement.getAttribute('data-theme') || 'corporate-blue';
    setCurrentTheme(active);
  }, []);

  const handleCycleTheme = () => {
    const currentIndex = PRESET_THEMES.findIndex(t => t.id === currentTheme);
    const nextIndex = (currentIndex + 1) % PRESET_THEMES.length;
    const nextTheme = PRESET_THEMES[nextIndex];
    document.documentElement.setAttribute('data-theme', nextTheme.id);
    setCurrentTheme(nextTheme.id);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfileImage(url);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="dash-header">
      <div className="header-left" style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--text-main)' }}>
        OomniEye Digital Twin Solutions
      </div>
      
      <div className="header-center" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img src={logo} alt="OmniEye Logo" style={{ height: '80px', width: 'auto', objectFit: 'contain', padding: '8px 0' }} />
      </div>
      
      <div className="header-right">
        <button 
          className="header-icon-btn" 
          title={`Current Theme: ${PRESET_THEMES.find(t => t.id === currentTheme)?.label || 'Corporate Blue'}`}
          onClick={handleCycleTheme}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            {/* Outer Circle */}
            <circle cx="12" cy="12" r="10" />
            {/* Red dot animated via rotation */}
            <circle 
              cx="12" 
              cy="6" 
              r="2.5" 
              fill="#ef4444" 
              stroke="#ef4444" 
              style={{
                transformOrigin: '12px 12px',
                transform: `rotate(${PRESET_THEMES.findIndex(t => t.id === currentTheme) * 60}deg)`,
                transition: 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            />
          </svg>
        </button>
        <button className="header-icon-btn" title="Settings">
          <Settings size={18} />
        </button>
        <div className="header-bell-wrapper">
          <button 
            className="header-icon-btn" 
            title="Notifications"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              setShowNotifications(!showNotifications);
            }}
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="header-bell-indicator" />}
          </button>
          
          {showNotifications && (
            <NotificationDropdown 
              notifications={notifications}
              onClose={() => setShowNotifications(false)}
              onMarkAllRead={onMarkAllRead}
              onNotificationClick={(n) => {
                onNotificationClick(n);
                setShowNotifications(false);
              }}
              onViewAllClick={() => {
                onViewAllClick();
                setShowNotifications(false);
              }}
            />
          )}
        </div>

        {/* Profile Card relocate */}
        <div className="header-profile-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center', marginLeft: '12px' }}>
          <div 
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              setShowProfileMenu(!showProfileMenu);
            }}
            style={{ 
              background: profileImage ? 'transparent' : '#F3BA2F', 
              color: 'white', 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontWeight: '600', 
              fontSize: '14px', 
              cursor: 'pointer', 
              transition: 'transform 0.2s',
              userSelect: 'none',
              flexShrink: 0,
              overflow: 'hidden',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {profileImage ? (
              <img src={profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              "A"
            )}
          </div>

          {showProfileMenu && (
            <div 
              ref={profileMenuRef}
              style={{
                position: 'absolute',
                top: 'calc(100% + 16px)', // Positions it exactly below the header bottom border
                right: '-12px', // Very little padding from the right edge of the screen
                background: '#ffffff',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                borderRadius: '14px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.02)',
                width: '230px',
                zIndex: 200,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              }}
            >
              {/* Top User Card section */}
              <div style={{
                background: '#f8fafc',
                padding: '16px',
                borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                {/* Google-style Profile Avatar with Upload Camera Overlay */}
                <div 
                  onClick={triggerFileSelect}
                  onMouseEnter={() => setIsAvatarHovered(true)}
                  onMouseLeave={() => setIsAvatarHovered(false)}
                  style={{
                    position: 'relative',
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    background: profileImage ? 'transparent' : '#F3BA2F',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontWeight: '600',
                    fontSize: '18px',
                    userSelect: 'none',
                    flexShrink: 0,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                  title="Upload profile picture"
                >
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    "A"
                  )}
                  
                  {/* Google-style Camera Hover Overlay */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0, 0, 0, 0.45)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    opacity: isAvatarHovered ? 1 : 0,
                    transition: 'opacity 0.2s ease',
                    borderRadius: '50%'
                  }}>
                    <Camera size={14} />
                  </div>
                </div>

                {/* Hidden Input file selection */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                />

                {/* Text credentials */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '2px',
                  minWidth: 0
                }}>
                  <div style={{ 
                    fontWeight: '600', 
                    fontSize: '14px', 
                    color: '#0f172a',
                    letterSpacing: '-0.1px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: '100%'
                  }}>
                    B Anand
                  </div>
                  <div style={{ 
                    color: '#64748b', 
                    fontSize: '11px',
                    fontWeight: '450',
                    width: '100%',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    Product manager
                  </div>
                </div>
              </div>

              {/* Bottom Menu Items */}
              <div style={{ padding: '4px 0', background: '#ffffff' }}>
                {/* Profile Settings Item */}
                <div 
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (onNavigate) onNavigate('account');
                  }}
                  className="profile-dropdown-item"
                  title="View and update your profile settings"
                >
                  <div style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    backgroundColor: '#007aff',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <User size={12} strokeWidth={2.5} />
                  </div>
                  <span style={{
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#1e293b'
                  }}>
                    Profile settings
                  </span>
                </div>

                {/* Divider */}
                <div style={{ height: '1px', backgroundColor: 'rgba(0, 0, 0, 0.06)', margin: '4px 0' }} />

                {/* Sign Out Item */}
                <div 
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (onLogout) onLogout();
                  }}
                  className="profile-dropdown-item danger"
                  title="Sign out from your account"
                >
                  <div style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <X size={12} strokeWidth={2.5} />
                  </div>
                  <span style={{
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#ef4444'
                  }}>
                    Sign Out
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
