import { useState } from 'react';
import { Shield, Lock, Smartphone, Key, Monitor, Smartphone as PhoneIcon, ChevronDown, ChevronUp } from 'lucide-react';

export function SecurityTab() {
  const [expandedSession, setExpandedSession] = useState<number | null>(1);

  const toggleSession = (id: number) => {
    if (expandedSession === id) {
      setExpandedSession(null);
    } else {
      setExpandedSession(id);
    }
  };

  const sessions = [
    {
      id: 1,
      type: 'desktop',
      title: 'Desktop • Chrome 120',
      isCurrent: true,
      os: 'Windows 11',
      location: 'San Francisco, CA (US)',
      ip: '123.45.67.89',
      lastActive: '39 minutes ago',
      loggedIn: '4/9/2026, 10:21:42 AM'
    },
    {
      id: 2,
      type: 'mobile',
      title: 'Mobile • Safari',
      isCurrent: false,
      os: 'iOS 17.2',
      location: 'New York, NY (US)',
      ip: '98.76.xxx.xxx',
      lastActive: '2 hours ago',
      loggedIn: '4/8/2026, 11:21:42 AM'
    },
    {
      id: 3,
      type: 'desktop',
      title: 'Desktop • Safari 17',
      isCurrent: false,
      os: 'macOS 14',
      location: 'Los Angeles, CA (US)',
      ip: '192.168.xxx.xxx',
      lastActive: '2 days ago',
      loggedIn: '4/6/2026, 11:21:42 AM'
    }
  ];

  return (
    <div className="settings-grid">
      {/* Left Column */}
      <div className="content-column">
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-info-icon" style={{ background: 'var(--danger-light)', color: 'var(--danger)' }}>
              <Shield size={16} />
            </div>
            <div className="settings-card-title">Security Settings</div>
          </div>

          <div style={{ padding: '20px', border: '1px solid var(--border-light)', borderRadius: '12px', marginBottom: '16px', background: 'var(--bg-dashboard)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: '10px', borderRadius: '8px' }}>
                  <Lock size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '4px' }}>Password</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Last changed: 30 days ago</div>
                </div>
              </div>
              <span className="badge badge-success">Strong</span>
            </div>
            <button className="content-card-action" style={{ fontSize: '12px', fontWeight: '600' }}>CHANGE PASSWORD</button>
          </div>

          <div style={{ padding: '20px', border: '1px solid var(--border-light)', borderRadius: '12px', marginBottom: '16px', background: 'var(--bg-dashboard)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'var(--success-light)', color: 'var(--success)', padding: '10px', borderRadius: '8px' }}>
                  <Smartphone size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '4px' }}>Two-Factor Authentication</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Add an extra layer of security to your account</div>
                </div>
              </div>
              <span className="badge" style={{ background: '#F1F5F9', color: 'var(--text-secondary)', border: '1px solid var(--border-light)' }}>Disabled</span>
            </div>
            <button className="content-card-action" style={{ fontSize: '12px', fontWeight: '600' }}>ENABLE 2FA</button>
          </div>

          <div style={{ padding: '20px', border: '1px solid var(--border-light)', borderRadius: '12px', background: 'var(--bg-dashboard)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'var(--warning-light)', color: 'var(--warning)', padding: '10px', borderRadius: '8px' }}>
                  <Key size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '4px' }}>API Keys</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Generate and manage API keys for programmatic access</div>
                </div>
              </div>
            </div>
            <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: '12px', fontWeight: '600', padding: '10px' }}>GENERATE NEW API KEY</button>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="content-column">
        <div className="settings-card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div className="settings-card-header">
            <div className="settings-info-icon" style={{ background: 'var(--warning-light)', color: 'var(--warning)' }}>
              <Monitor size={16} />
            </div>
            <div className="settings-card-title">Active Sessions & Devices</div>
          </div>
          
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Manage and monitor all active sessions across your devices</p>

          <div style={{ background: 'var(--primary-light)', border: '1px solid rgba(37, 99, 235, 0.2)', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ color: 'var(--primary)' }}>ℹ️</div>
            <div style={{ fontSize: '13px', color: 'var(--text-main)' }}>You have 3 active sessions. Maximum allowed: 5</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {sessions.map((session) => {
              const isExpanded = expandedSession === session.id;
              const Icon = session.type === 'desktop' ? Monitor : PhoneIcon;
              const titleColor = session.isCurrent ? 'var(--primary)' : 'var(--text-main)';
              const iconColor = session.isCurrent ? 'var(--primary)' : 'var(--text-muted)';

              return (
                <div 
                  key={session.id}
                  style={{ 
                    padding: '16px 20px', 
                    border: '1px solid var(--border-light)', 
                    borderRadius: '12px', 
                    background: 'var(--bg-dashboard)', 
                    display: 'flex', 
                    gap: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => toggleSession(session.id)}
                >
                  <Icon size={18} style={{ color: iconColor, marginTop: '2px', flexShrink: 0 }} />
                  <div className="list-content" style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span className="list-title" style={{ color: titleColor, fontWeight: '600' }}>{session.title}</span>
                        {session.isCurrent && <span className="badge badge-primary">Current session</span>}
                      </div>
                      <div style={{ color: 'var(--text-muted)' }}>
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </div>
                    
                    {isExpanded && (
                      <div style={{ marginTop: '16px' }}>
                        <div className="list-desc" style={{ marginBottom: '12px', lineHeight: '1.5' }}>
                          {session.os}<br />
                          {session.location}<br />
                          IP: {session.ip}
                        </div>
                        <div className="list-meta" style={{ marginBottom: session.isCurrent ? '0' : '16px' }}>
                          Last active: <strong>{session.lastActive}</strong><br />
                          Logged in: {session.loggedIn}
                        </div>
                        {!session.isCurrent && (
                          <button 
                            className="content-card-action" 
                            style={{ color: 'var(--danger)', fontSize: '12px', fontWeight: '600', padding: 0 }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            REVOKE SESSION
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
