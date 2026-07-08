import { useEffect, useRef } from 'react';
import { Bell, ChevronRight } from 'lucide-react';
import type { NotificationItem } from './types';
import { NotificationCard } from './NotificationCard';
import './Notifications.css';

interface NotificationDropdownProps {
  notifications: NotificationItem[];
  onClose: () => void;
  onMarkAllRead: () => void;
  onNotificationClick: (notification: NotificationItem) => void;
  onViewAllClick: () => void;
}

export function NotificationDropdown({ 
  notifications, 
  onClose, 
  onMarkAllRead, 
  onNotificationClick, 
  onViewAllClick 
}: NotificationDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="notification-dropdown" ref={dropdownRef}>
      <div className="notification-header">
        <h3>
          Notifications
          {unreadCount > 0 && <span className="notification-count-badge">{unreadCount}</span>}
        </h3>
        {unreadCount > 0 && (
          <button className="notification-mark-read-btn" onClick={onMarkAllRead}>
            Mark all as read
          </button>
        )}
      </div>

      <div className="notification-list">
        {notifications.length === 0 ? (
          <div className="notification-empty">
            <Bell size={48} strokeWidth={1.5} />
            <h4>You're all caught up</h4>
            <p>No new notifications</p>
          </div>
        ) : (
          notifications.map(notification => (
            <NotificationCard 
              key={notification.id} 
              notification={notification} 
              onClick={onNotificationClick} 
            />
          ))
        )}
      </div>

      <div className="notification-footer">
        <button className="notification-view-all" onClick={onViewAllClick}>
          View All Notifications <ChevronRight size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
