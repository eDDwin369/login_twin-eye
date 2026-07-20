import { CheckCircle2, AlertTriangle, XCircle, Info, Settings, Save, Users, Download } from 'lucide-react';
import type { NotificationItem } from './types';
import './Notifications.css';

interface NotificationCardProps {
  notification: NotificationItem;
  onClick: (notification: NotificationItem) => void;
}

export function NotificationCard({ notification, onClick }: NotificationCardProps) {
  const getIcon = () => {
    switch (notification.type) {
      case 'success': return <CheckCircle2 size={16} strokeWidth={2.5} />;
      case 'save': return <Save size={16} strokeWidth={2.5} />;
      case 'share': return <Users size={16} strokeWidth={2.5} />;
      case 'import': return <Download size={16} strokeWidth={2.5} />;
      case 'error': return <XCircle size={16} strokeWidth={2.5} />;
      case 'warning': return <AlertTriangle size={16} strokeWidth={2.5} />;
      case 'system': return <Settings size={16} strokeWidth={2.5} />;
      case 'info':
      default:
        return <Info size={16} strokeWidth={2.5} />;
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
      title={
        `Type: ${notification.type.toUpperCase()} | Category: ${notification.category}\n` +
        `Notification: ${notification.title}\n` +
        `Description: ${notification.description}\n` +
        `Time: ${getRelativeTime(notification.timestamp)}` +
        `${notification.subtext ? ` (${notification.subtext})` : ''}` +
        `${notification.attachment ? `\nAttachment: ${notification.attachment.name} (${notification.attachment.size})` : ''}`
      }
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
