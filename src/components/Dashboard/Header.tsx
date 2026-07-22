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
  onNavigate?: (view: string, options?: any) => void;
  onSettingsClick?: () => void;
  headerConfig?: any;
}

export function Header({
  notifications,
  onMarkAllRead,
  onNotificationClick,
  onViewAllClick,
  onLogout,
  onNavigate,
  onSettingsClick,
  headerConfig
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const [currentTheme, setCurrentTheme] = useState<string>('corporate-blue');
  const [showThemeTooltip, setShowThemeTooltip] = useState(false);
  const [themeToast, setThemeToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });
  const longPressTimerRef = useRef<any>(null);
  const didLongPressRef = useRef<boolean>(false);
  const toastTimeoutRef = useRef<any>(null);

  // Initialize theme from document element on mount
  useEffect(() => {
    const active = document.documentElement.getAttribute('data-theme') || 'corporate-blue';
    setCurrentTheme(active);
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const handleCycleTheme = () => {
    const currentIndex = PRESET_THEMES.findIndex(t => t.id === currentTheme);
    const nextIndex = (currentIndex + 1) % PRESET_THEMES.length;
    const nextTheme = PRESET_THEMES[nextIndex];
    document.documentElement.setAttribute('data-theme', nextTheme.id);
    setCurrentTheme(nextTheme.id);
  };

  const handleMouseDownButton = () => {
    didLongPressRef.current = false;
    longPressTimerRef.current = setTimeout(() => {
      const currentMode = document.documentElement.getAttribute('data-theme-mode') || 'light';
      const nextMode = currentMode === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme-mode', nextMode);
      window.dispatchEvent(new CustomEvent('theme-mode-change', { detail: nextMode }));
      didLongPressRef.current = true;

      // Show temporary toast
      const emoji = nextMode === 'dark' ? '🌙' : '☀️';
      const capitalized = nextMode.charAt(0).toUpperCase() + nextMode.slice(1);
      
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      setThemeToast({
        message: `${emoji} Switched to ${capitalized} Mode`,
        visible: true
      });
      toastTimeoutRef.current = setTimeout(() => {
        setThemeToast(prev => ({ ...prev, visible: false }));
      }, 3000);
    }, 2000);
  };

  const handleMouseUpButton = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    if (!didLongPressRef.current) {
      handleCycleTheme();
    }
    didLongPressRef.current = false;
  };

  const handleMouseLeaveButton = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    didLongPressRef.current = false;
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
      <div
        className="header-left"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: '12px'
        }}
      >
        {(!headerConfig || headerConfig.showLogo) && (
          <img
            src={headerConfig?.logo || logo}
            alt="OmniEye Logo"
            style={{ height: '64px', width: 'auto', objectFit: 'contain' }}
          />
        )}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          {(!headerConfig || headerConfig.showCompanyName) && (
            <div
              style={{
                fontWeight: 'bold',
                fontSize: '1.05rem',
                lineHeight: '1.2',
                color: (headerConfig && (headerConfig.textColorApply === 'both' || headerConfig.textColorApply === 'name'))
                  ? headerConfig.textColor
                  : 'var(--text-main)'
              }}
            >
              {headerConfig?.companyName || 'OomniEye'}
            </div>
          )}
          {(!headerConfig || headerConfig.showCompanyCaption) && (
            <div
              style={{
                fontSize: '0.65rem',
                lineHeight: '1.2',
                color: (headerConfig && (headerConfig.textColorApply === 'both' || headerConfig.textColorApply === 'caption'))
                  ? headerConfig.textColor
                  : 'var(--text-muted, #64748b)',
                marginTop: '2px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              {headerConfig?.companyCaption || 'Digital Twin Solutions'}
            </div>
          )}
        </div>
      </div>

      <div className="header-center" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
        <img
          src={logo}
          alt="Digital Twin Logo"
          style={{ height: '64px', width: 'auto', objectFit: 'contain' }}
        />
        <span style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-main)', letterSpacing: '0.02em' }}>
          Digital Twin
        </span>
      </div>

      <div className="header-right">
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <button
            className="header-icon-btn"
            onMouseEnter={() => setShowThemeTooltip(true)}
            onMouseLeave={() => {
              setShowThemeTooltip(false);
              handleMouseLeaveButton();
            }}
            onMouseDown={handleMouseDownButton}
            onMouseUp={handleMouseUpButton}
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
          
          {showThemeTooltip && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: '0',
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '8px',
              padding: '10px 14px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
              zIndex: 99999,
              width: '240px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              textAlign: 'left',
              pointerEvents: 'none'
            }}>
              <div style={{ fontWeight: 700, fontSize: '12px', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                Theme
              </div>
              <div style={{ fontSize: '11px', color: '#e2e8f0', display: 'flex', flexDirection: 'column', gap: '6px', lineHeight: '1.4' }}>
                <div>• <strong>Click</strong> to cycle through preset themes.</div>
                <div>• <strong>Press & hold</strong> to switch between Light and Dark mode.</div>
              </div>
            </div>
          )}
        </div>
        <button 
          className="header-icon-btn" 
          title="Settings" 
          onClick={() => {
            setShowNotifications(false);
            setShowProfileMenu(false);
            if (onSettingsClick) onSettingsClick();
          }}
        >
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
              setShowProfileMenu(false);
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
              setShowNotifications(false);
            }}
            style={{
              background: profileImage ? 'transparent' : '#F3BA2F',
              color: 'white',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '600',
              fontSize: '18px',
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
                    if (onNavigate) onNavigate('account', { editMode: true });
                  }}
                  className="profile-dropdown-item"
                  title="View and update your profile settings"
                >
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    border: '1.5px solid #2563eb',
                    backgroundColor: 'transparent',
                    color: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <User size={15} strokeWidth={2.5} />
                  </div>
                  <span style={{
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#1e293b'
                  }}>
                    Edit Profile
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
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    border: '1.5px solid #ef4444',
                    backgroundColor: 'transparent',
                    color: '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <X size={15} strokeWidth={2.5} />
                  </div>
                  <span style={{
                    fontSize: '13px',
                    fontWeight: '700',
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
      
      {themeToast.visible && (
        <div className="theme-toggle-toast">
          {themeToast.message}
        </div>
      )}
    </header>
  );
}
