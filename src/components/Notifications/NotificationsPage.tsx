import { useState } from 'react';
import { Search, Bell } from 'lucide-react';
import type { NotificationItem } from './types';
import { NotificationCard } from './NotificationCard';
import './Notifications.css';

interface NotificationsPageProps {
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onClearRead: () => void;
  onNotificationClick: (notification: NotificationItem) => void;
}

export function NotificationsPage({ 
  notifications, 
  onMarkAllRead, 
  onClearRead, 
  onNotificationClick 
}: NotificationsPageProps) {
  const [activeTab, setActiveTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = ['All', 'Unread', 'Themes', 'Team Activity', 'System'];

  const filteredNotifications = notifications.filter(n => {
    // Tab filter
    if (activeTab === 'Unread' && n.isRead) return false;
    if (activeTab !== 'All' && activeTab !== 'Unread' && n.category !== activeTab) return false;
    
    // Search filter
    if (searchQuery && !n.title.toLowerCase().includes(searchQuery.toLowerCase()) && !n.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const groupNotificationsByDate = (notifs: NotificationItem[]) => {
    const groups: { [key: string]: NotificationItem[] } = {
      'Today': [],
      'Yesterday': [],
      'Last 7 Days': [],
      'Older': []
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const last7Days = new Date(today);
    last7Days.setDate(last7Days.getDate() - 7);

    notifs.forEach(n => {
      const date = new Date(n.timestamp);
      date.setHours(0, 0, 0, 0);

      if (date.getTime() === today.getTime()) {
        groups['Today'].push(n);
      } else if (date.getTime() === yesterday.getTime()) {
        groups['Yesterday'].push(n);
      } else if (date.getTime() >= last7Days.getTime()) {
        groups['Last 7 Days'].push(n);
      } else {
        groups['Older'].push(n);
      }
    });

    return groups;
  };

  const groupedNotifications = groupNotificationsByDate(filteredNotifications);
  const hasNotifications = filteredNotifications.length > 0;

  return (
    <div className="notifications-page-container">
      <div className="notifications-page-header">
        <h1 className="notifications-page-title">Notifications</h1>
        <div className="notifications-actions">
          <button className="notification-mark-read-btn" onClick={onMarkAllRead}>
            Mark all as read
          </button>
          <button className="notification-mark-read-btn" onClick={onClearRead}>
            Clear read
          </button>
        </div>
      </div>

      <div className="notifications-toolbar">
        <div className="notifications-tabs">
          {tabs.map(tab => (
            <button 
              key={tab}
              className={`notification-tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="notifications-search">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search notifications..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {!hasNotifications ? (
        <div className="notification-empty" style={{ marginTop: '64px' }}>
          <Bell size={64} strokeWidth={1.5} />
          <h4 style={{ fontSize: '18px', marginTop: '16px' }}>You're all caught up</h4>
          <p style={{ fontSize: '15px' }}>No notifications found for this view.</p>
        </div>
      ) : (
        <div className="notifications-page-list">
          {Object.entries(groupedNotifications).map(([groupName, items]) => {
            if (items.length === 0) return null;
            return (
              <div key={groupName}>
                <div className="notifications-group-title">{groupName}</div>
                {items.map(notification => (
                  <NotificationCard 
                    key={notification.id} 
                    notification={notification} 
                    onClick={onNotificationClick} 
                  />
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
