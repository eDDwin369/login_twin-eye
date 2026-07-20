import { useState } from 'react';
import { 
  Shield, Lock, Key, Monitor, RefreshCw, Clock,
  Info, MoreVertical, CheckCircle2, XCircle, Laptop, Smartphone as PhoneIcon 
} from 'lucide-react';

export function SecurityTab() {
  const [activeMenu, setActiveMenu] = useState<'sessions' | 'history' | 'password' | '2fa' | 'api'>('sessions');

  const sessions = [
    {
      id: 1,
      device: 'MacBook Pro',
      browser: 'Chrome 138',
      isCurrent: true,
      os: 'macOS 14.4',
      location: 'San Francisco, CA, US',
      ip: '123.45.67.89',
      lastActive: 'Just now',
      icon: Laptop,
      circleColor: 'purple'
    },
    {
      id: 2,
      device: 'Windows Laptop',
      browser: 'Edge 120',
      isCurrent: false,
      os: 'Windows 11',
      location: 'Bangalore, KA, IN',
      ip: '103.21.244.1',
      lastActive: '28 min ago',
      icon: Monitor,
      circleColor: 'blue'
    },
    {
      id: 3,
      device: 'iPhone 15',
      browser: 'Safari',
      isCurrent: false,
      os: 'iOS 17.4',
      location: 'Mumbai, MH, IN',
      ip: '106.51.23.11',
      lastActive: '2 hours ago',
      icon: PhoneIcon,
      circleColor: 'green'
    }
  ];

  const loginActivity = [
    {
      id: 1,
      status: 'success',
      text: 'Successful login',
      device: 'Chrome on macOS',
      location: 'San Francisco, CA, US',
      time: 'Today, 10:30 AM'
    },
    {
      id: 2,
      status: 'success',
      text: 'Successful login',
      device: 'Edge on Windows',
      location: 'Bangalore, KA, IN',
      time: 'Yesterday, 9:15 PM'
    },
    {
      id: 3,
      status: 'failed',
      text: 'Failed login attempt',
      device: 'Chrome on Windows',
      location: 'New Delhi, DL, IN',
      time: 'Yesterday, 8:42 PM'
    },
    {
      id: 4,
      status: 'success',
      text: 'Successful login',
      device: 'Safari on iPhone',
      location: 'Mumbai, MH, IN',
      time: 'Apr 8, 11:21 AM'
    }
  ];

  return (
    <div className="security-page-grid">
      {/* LEFT SIDEBAR PANEL */}
      <div className="security-sidebar">


        {/* Vertical Sub-sections Menu */}
        <div className="security-menu-card">
          <button 
            className={`security-menu-item ${activeMenu === 'sessions' ? 'active' : ''}`}
            onClick={() => setActiveMenu('sessions')}
          >
            <div className="security-menu-item-left">
              <Laptop size={16} />
              <span>Active Sessions</span>
            </div>
            {activeMenu === 'sessions' && <span className="security-menu-dot" />}
          </button>

          <button 
            className={`security-menu-item ${activeMenu === 'history' ? 'active' : ''}`}
            onClick={() => setActiveMenu('history')}
          >
            <div className="security-menu-item-left">
              <Clock size={16} />
              <span>Login History</span>
            </div>
            {activeMenu === 'history' && <span className="security-menu-dot" />}
          </button>

          <button 
            className={`security-menu-item ${activeMenu === 'password' ? 'active' : ''}`}
            onClick={() => setActiveMenu('password')}
          >
            <div className="security-menu-item-left">
              <Lock size={16} />
              <span>Password</span>
            </div>
            {activeMenu === 'password' && <span className="security-menu-dot" />}
          </button>

          <button 
            className={`security-menu-item ${activeMenu === '2fa' ? 'active' : ''}`}
            onClick={() => setActiveMenu('2fa')}
          >
            <div className="security-menu-item-left">
              <Shield size={16} />
              <span>Two-Factor Authentication</span>
            </div>
            {activeMenu === '2fa' && <span className="security-menu-dot" />}
          </button>

          <button 
            className={`security-menu-item ${activeMenu === 'api' ? 'active' : ''}`}
            onClick={() => setActiveMenu('api')}
          >
            <div className="security-menu-item-left">
              <Key size={16} />
              <span>API Tokens</span>
            </div>
            {activeMenu === 'api' && <span className="security-menu-dot" />}
          </button>
        </div>
      </div>

      {/* RIGHT CONTENT STACK */}
      <div className="security-content-stack">
        {activeMenu === 'sessions' && (
          /* Card 1: Active Sessions & Devices */
          <div className="security-main-card">
            <div className="security-card-title-row">
              <div className="security-card-title-left">
                <div className="security-card-icon-wrapper cyan">
                  <Laptop size={20} />
                </div>
                <div>
                  <h2 className="security-card-title">Active Sessions & Devices</h2>
                  <p className="security-card-subtitle">Manage and monitor all active sessions across your devices</p>
                </div>
              </div>
              <button className="security-refresh-btn" title="Refresh list">
                <RefreshCw size={14} /> Refresh
              </button>
            </div>

            <div className="security-alert-box">
              <Info size={16} />
              <span>You have 3 active sessions. Maximum allowed: 5</span>
            </div>

            <div className="security-device-list">
              {sessions.map(session => {
                const DevIcon = session.icon;
                return (
                  <div key={session.id} className="security-device-row">
                    <div className="security-device-left">
                      <div className={`security-device-circle ${session.circleColor}`}>
                        <DevIcon size={18} />
                      </div>
                      <div className="security-device-info">
                        <div className="security-device-title-line">
                          <span>{session.device} • {session.browser}</span>
                          {session.isCurrent && <span className="security-badge-current">Current session</span>}
                        </div>
                        <div className="security-device-meta">
                          {session.os} • {session.location}
                        </div>
                        <div className="security-device-meta-sub">
                          IP: {session.ip} • Last active: {session.lastActive}
                        </div>
                      </div>
                    </div>
                    <div className="security-row-actions">
                      {!session.isCurrent && (
                        <button className="security-signout-btn">Sign out</button>
                      )}
                      <button className="security-more-btn" title="More options">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <a href="#devices" className="security-card-link-bottom" onClick={e => e.preventDefault()}>
              See all devices &gt;
            </a>
          </div>
        )}

        {activeMenu === 'history' && (
          /* Card 2: Recent Login Activity */
          <div className="security-main-card">
            <div className="security-card-title-row" style={{ marginBottom: '24px' }}>
              <div className="security-card-title-left">
                <div className="security-card-icon-wrapper blue">
                  <Clock size={20} />
                </div>
                <div>
                  <h2 className="security-card-title">Recent Login Activity</h2>
                  <p className="security-card-subtitle">A log of your recent account access and authentication events</p>
                </div>
              </div>
            </div>

            <div className="security-activity-table">
              {loginActivity.map(activity => (
                <div key={activity.id} className="security-activity-row">
                  <div className="security-activity-col-left">
                    {activity.status === 'success' ? (
                      <CheckCircle2 size={16} className="activity-status-icon success" />
                    ) : (
                      <XCircle size={16} className="activity-status-icon failed" />
                    )}
                    <span className="activity-status-text">{activity.text}</span>
                  </div>
                  <div className="security-activity-col-device">{activity.device}</div>
                  <div className="security-activity-col-location">{activity.location}</div>
                  <div className="security-activity-col-time">{activity.time}</div>
                </div>
              ))}
            </div>

            <a href="#history" className="security-card-link-bottom" onClick={e => e.preventDefault()}>
              View all login history &gt;
            </a>
          </div>
        )}

        {activeMenu === 'password' && (
          /* Password Card */
          <div className="security-main-card">
            <div className="security-card-title-row" style={{ marginBottom: '20px' }}>
              <div className="security-card-title-left">
                <div className="security-card-icon-wrapper" style={{ background: '#fee2e2', color: '#ef4444' }}>
                  <Lock size={20} />
                </div>
                <div>
                  <h2 className="security-card-title">Password Settings</h2>
                  <p className="security-card-subtitle">Last changed: 30 days ago</p>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px', marginTop: '12px' }}>
              <div className="edit-form-group">
                <label className="edit-form-label">Current Password</label>
                <input type="password" className="edit-form-input" placeholder="••••••••" style={{ background: '#ffffff', border: '1px solid #cbd5e1' }} />
              </div>
              <div className="edit-form-group">
                <label className="edit-form-label">New Password</label>
                <input type="password" className="edit-form-input" placeholder="Min. 8 characters" style={{ background: '#ffffff', border: '1px solid #cbd5e1' }} />
              </div>
              <div className="edit-form-group">
                <label className="edit-form-label">Confirm New Password</label>
                <input type="password" className="edit-form-input" placeholder="Confirm password" style={{ background: '#ffffff', border: '1px solid #cbd5e1' }} />
              </div>
              <button className="btn-save" style={{ width: 'fit-content', marginTop: '8px' }}>Update Password</button>
            </div>
          </div>
        )}

        {activeMenu === '2fa' && (
          /* 2FA Card */
          <div className="security-main-card">
            <div className="security-card-title-row" style={{ marginBottom: '20px' }}>
              <div className="security-card-title-left">
                <div className="security-card-icon-wrapper cyan" style={{ background: '#ecfdf5', color: '#10b981' }}>
                  <Shield size={20} />
                </div>
                <div>
                  <h2 className="security-card-title">Two-Factor Authentication (2FA)</h2>
                  <p className="security-card-subtitle">Add an extra layer of security to your account</p>
                </div>
              </div>
            </div>

            <div style={{ padding: '20px', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>Authenticator App</div>
                <div style={{ fontSize: '12.5px', color: '#64748b' }}>Use an app like Google Authenticator to generate verification codes.</div>
              </div>
              <button className="security-signout-btn" style={{ borderColor: '#2563eb', color: '#2563eb' }}>Configure</button>
            </div>
          </div>
        )}

        {activeMenu === 'api' && (
          /* API Tokens Card */
          <div className="security-main-card">
            <div className="security-card-title-row" style={{ marginBottom: '20px' }}>
              <div className="security-card-title-left">
                <div className="security-card-icon-wrapper" style={{ background: '#fef3c7', color: '#d97706' }}>
                  <Key size={20} />
                </div>
                <div>
                  <h2 className="security-card-title">API Tokens</h2>
                  <p className="security-card-subtitle">Generate and manage API keys for programmatic access</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>
                Use personal access tokens to authenticate with the OmniEye API. Keep your tokens secure and never share them.
              </p>
              <button className="btn-save" style={{ width: 'fit-content', background: '#d97706' }}>Generate New API Key</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
