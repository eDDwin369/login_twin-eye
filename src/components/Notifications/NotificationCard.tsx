import { CheckCircle2, AlertTriangle, XCircle, Info, Settings } from 'lucide-react';
import type { NotificationItem } from './types';
import './Notifications.css';

interface NotificationCardProps {
  notification: NotificationItem;
  onClick: (notification: NotificationItem) => void;
}

export function NotificationCard({ notification, onClick }: NotificationCardProps) {
  const getIcon = () => {
    switch (notification.type) {
      case 'success': return <CheckCircle2 size={16} />;
      case 'error': return <XCircle size={16} />;
      case 'warning': return <AlertTriangle size={16} />;
      case 'system': return <Settings size={16} />;
      case 'info':
      default:
        return <Info size={16} />;
    }
  };

  const getRelativeTime = (date: Date) => {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const diffDays = Math.round((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    const diffHours = Math.round((date.getTime() - Date.now()) / (1000 * 60 * 60));
    const diffMins = Math.round((date.getTime() - Date.now()) / (1000 * 60));
    
    if (Math.abs(diffMins) < 1) return 'Just now';
    if (Math.abs(diffMins) < 60) return `${Math.abs(diffMins)} min ago`;
    if (Math.abs(diffHours) < 24) return rtf.format(diffHours, 'hour');
    return rtf.format(diffDays, 'day');
  };

  return (
    <button 
      className={`notification-card ${notification.type} ${!notification.isRead ? 'unread' : ''}`}
      onClick={() => onClick(notification)}
      aria-label={`${notification.title}, ${getRelativeTime(notification.timestamp)}${!notification.isRead ? ', unread' : ''}`}
    >
      <div className="notification-icon-wrapper">
        {getIcon()}
      </div>
      <div className="notification-content">
        <div className="notification-title">
          {notification.title}
          {!notification.isRead && <div className="notification-unread-dot" aria-hidden="true" />}
        </div>
        <div className="notification-desc">
          {notification.description}
        </div>
        <div className="notification-time">
          {getRelativeTime(notification.timestamp)}
        </div>
      </div>
    </button>
  );
}
