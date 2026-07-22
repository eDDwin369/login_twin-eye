import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Settings, X, Download, FileText, Bell, Search, Maximize2, Minimize2, MailOpen } from 'lucide-react';
import type { NotificationItem } from './types';
import './Notifications.css';

interface NotificationDropdownProps {
  notifications: NotificationItem[];
  onClose: () => void;
  onMarkAllRead: () => void;
  onNotificationClick: (notification: NotificationItem) => void;
  onViewAllClick: () => void;
}

export function NotificationDropdown(props: NotificationDropdownProps) {
  const { notifications, onClose, onMarkAllRead, onNotificationClick } = props;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'mentions' | 'unread'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isModalMode, setIsModalMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Handle closing when clicking outside the modal dropdown (only if not in modal mode)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isModalMode && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, isModalMode]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Filter notifications based on the active tab and search query selection
  const filteredNotifications = notifications.filter(item => {
    if (activeTab === 'unread') return !item.isRead;
    if (activeTab === 'mentions') return item.isMention === true;
    return true; // default: 'all'
  }).filter(item => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const matchTitle = item.title?.toLowerCase().includes(q);
    const matchDesc = item.description?.toLowerCase().includes(q);
    const matchActor = item.actorName?.toLowerCase().includes(q);
    const matchAction = item.actionText?.toLowerCase().includes(q);
    const matchTarget = item.targetName?.toLowerCase().includes(q);
    return matchTitle || matchDesc || matchActor || matchAction || matchTarget;
  });

  // Reset page when tab filters or search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderInnerContent = () => (
    <>
      {/* 1. Header Section */}
      <div className="new-notification-header" style={{ flexShrink: 0, height: '48px', minHeight: '48px', display: 'flex', alignItems: 'center' }}>
        {isSearchExpanded ? (
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              width: '100%', 
              gap: '8px', 
              background: '#f1f5f9', 
              padding: '4px 12px', 
              borderRadius: '20px',
              height: '34px',
              transition: 'all 0.25s ease'
            }}
          >
            <Search size={16} style={{ color: '#64748b', flexShrink: 0 }} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => {
                e.stopPropagation();
                setSearchQuery(e.target.value);
              }}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '13px',
                color: '#0f172a',
                background: 'transparent',
                width: '100%'
              }}
            />
            <button 
              onClick={() => {
                setIsSearchExpanded(false);
                setSearchQuery('');
              }}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#64748b',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                flexShrink: 0
              }}
              title="Close search"
              className="new-header-action-btn"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <>
            <h2 className="new-notification-title">Notification</h2>
            <div className="new-notification-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button 
                className="new-header-action-btn" 
                onClick={() => {
                  setIsSearchExpanded(true);
                  setTimeout(() => searchInputRef.current?.focus(), 100);
                }}
                title="Search notifications"
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#475569',
                  padding: '4px',
                  borderRadius: '4px'
                }}
              >
                <Search size={18} />
              </button>
              <button className="new-header-action-btn" title="Notification Settings">
                <Settings size={18} />
              </button>
              <button 
                className="new-header-action-btn" 
                onClick={() => setIsModalMode(!isModalMode)}
                title={isModalMode ? "Shrink notification list" : "Expand notification list"}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#475569',
                  padding: '4px',
                  borderRadius: '4px'
                }}
              >
                {isModalMode ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
              <button className="new-header-action-btn close" onClick={onClose} title="Close">
                <X size={18} />
              </button>
            </div>
          </>
        )}
      </div>

      {/* 2. Tabs Row Section */}
      <div className="new-notification-tabs-row" style={{ flexShrink: 0 }}>
        <div className="new-tabs-pill-container">
          <button 
            className={`new-tab-pill-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            View all
          </button>
          <button 
            className={`new-tab-pill-btn ${activeTab === 'mentions' ? 'active' : ''}`}
            onClick={() => setActiveTab('mentions')}
          >
            Mentions
          </button>
          <button 
            className={`new-tab-pill-btn ${activeTab === 'unread' ? 'active' : ''}`}
            onClick={() => setActiveTab('unread')}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {unreadCount > 0 && (
          <button 
            className="new-mark-all-read-icon-btn" 
            onClick={onMarkAllRead}
            title="Mark all as read"
          >
            <MailOpen size={18} />
          </button>
        )}
      </div>

      {/* 4. Notifications List feed */}
      <div className="new-notification-list-scroll" style={isModalMode ? { maxHeight: 'calc(100vh - 270px)', flex: 1 } : { flex: 1 }}>
        {paginatedNotifications.length === 0 ? (
          <div className="new-notification-empty">
            <Bell size={40} className="empty-bell-icon" />
            <p>No notifications found in this view</p>
          </div>
        ) : (
          paginatedNotifications.map(item => (
            <div 
              key={item.id} 
              className={`new-notification-item-row ${!item.isRead ? 'unread' : ''}`}
              onClick={() => onNotificationClick(item)}
              style={{ cursor: 'pointer' }}
              title={
                `Type: ${item.type.toUpperCase()} | Category: ${item.category}\n` +
                `Notification: ${item.actorName ? `${item.actorName} ${item.actionText} ${item.targetName}` : item.title}\n` +
                `Description: ${item.description}\n` +
                `Time: ${item.dateText || 'Apr 14'}${item.subtext ? ` (${item.subtext})` : ''}` +
                `${item.attachment ? `\nAttachment: ${item.attachment.name} (${item.attachment.size})` : ''}`
              }
            >
              {/* Unread circle dot indicator */}
              <div className="unread-dot-col">
                {!item.isRead && <span className="unread-blue-dot" />}
              </div>

              {/* User Initials Avatar badge */}
              <div className="notification-avatar-col">
                <div className="notification-avatar-initials">
                  {item.initials || 'UN'}
                </div>
              </div>

              {/* Notification Description Text content */}
              <div className="notification-body-col">
                <p className="notification-rich-content">
                  {item.actorName ? (
                    <>
                      <span className="rich-actor">{item.actorName}</span>
                      {' '}{item.actionText}{' '}
                      <span className="rich-target">{item.targetName}</span>
                    </>
                  ) : (
                    item.title
                  )}
                </p>

                {/* Subtext info row */}
                <div className="notification-date-subtext">
                  {item.dateText || 'Apr 14'}
                  {item.subtext && (
                    <>
                      <span className="subtext-bullet"> • </span>
                      <span className="subtext-value">{item.subtext}</span>
                    </>
                  )}
                </div>

                {/* Accept/Decline action buttons */}
                {item.hasButtons && (
                  <div className="notification-row-actions" onClick={(e) => e.stopPropagation()}>
                    <button className="notification-action-decline-btn">Decline</button>
                    <button className="notification-action-accept-btn">Accept</button>
                  </div>
                )}

                {/* PDF File Attachment preview block */}
                {item.attachment && (
                  <div className="notification-attachment-box" onClick={(e) => e.stopPropagation()}>
                    <div className="attachment-file-icon-box">
                      <FileText size={18} />
                    </div>
                    <div className="attachment-file-details">
                      <span className="attachment-file-name">{item.attachment.name}</span>
                      <span className="attachment-file-size">{item.attachment.size}</span>
                    </div>
                    <button className="attachment-file-download-btn" title="Download file">
                      <Download size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 5. Pagination controls Section */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 20px',
          borderTop: '1px solid rgba(0,0,0,0.06)',
          background: '#ffffff',
          flexShrink: 0
        }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
            Page {currentPage} of {totalPages}
          </div>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-light, #e2e8f0)',
                backgroundColor: '#ffffff',
                color: currentPage === 1 ? '#94a3b8' : '#334155',
                fontSize: '12px',
                fontWeight: 600,
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                if (currentPage !== 1) e.currentTarget.style.backgroundColor = '#f1f5f9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
              }}
            >
              Prev
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-light, #e2e8f0)',
                backgroundColor: '#ffffff',
                color: currentPage === totalPages ? '#94a3b8' : '#334155',
                fontSize: '12px',
                fontWeight: 600,
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                if (currentPage !== totalPages) e.currentTarget.style.backgroundColor = '#f1f5f9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      {isModalMode && (
        createPortal(
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.4)',
              backdropFilter: 'blur(4px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={() => setIsModalMode(false)}
          >
            <div 
              className="new-notification-dropdown" 
              ref={dropdownRef}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'relative',
                width: '560px',
                height: '580px',
                marginTop: 0,
                right: 'auto',
                top: 'auto',
                borderRadius: '16px',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                animation: 'none',
                transition: 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              {renderInnerContent()}
            </div>
          </div>,
          document.body
        )
      )}
      {!isModalMode && (
        <div 
          className="new-notification-dropdown" 
          ref={dropdownRef}
          style={{
            height: '520px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          {renderInnerContent()}
        </div>
      )}
    </>
  );
}
