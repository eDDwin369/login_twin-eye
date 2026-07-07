import { useState } from 'react';
import { Bell, Sun, Settings } from 'lucide-react';
import { NotificationDropdown } from '../Notifications/NotificationDropdown';
import type { NotificationItem } from '../Notifications/types';
import './Dashboard.css';

interface HeaderProps {
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onNotificationClick: (notification: NotificationItem) => void;
  onViewAllClick: () => void;
}

export function Header({ 
  notifications,
  onMarkAllRead,
  onNotificationClick,
  onViewAllClick
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="dash-header">
      <div className="header-left" style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--text-main)' }}>
        OomniEye
      </div>
      
      <div className="header-center">
        {/* Removed search bar */}
      </div>
      
      <div className="header-right">
        <button className="header-icon-btn" title="Toggle Theme">
          <Sun size={18} />
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
      </div>
    </header>
  );
}
