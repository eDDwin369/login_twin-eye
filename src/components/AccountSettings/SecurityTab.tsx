
import { Shield, Lock, Smartphone, Key, Monitor, Smartphone as PhoneIcon } from 'lucide-react';

export function SecurityTab() {
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
        <div className="settings-card">
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

          <div className="list-item" style={{ paddingBottom: '16px' }}>
            <Monitor size={18} style={{ color: 'var(--primary)', marginTop: '2px' }} />
            <div className="list-content">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span className="list-title" style={{ color: 'var(--primary)' }}>Desktop • Chrome 120</span>
                <span className="badge badge-primary">Current session</span>
              </div>
              <div className="list-desc" style={{ marginBottom: '8px' }}>
                Windows 11<br />
                San Francisco, CA (US)<br />
                IP: 123.45.67.89
              </div>
              <div className="list-meta">
                Last active: <strong>39 minutes ago</strong><br />
                Logged in: 4/9/2026, 10:21:42 AM
              </div>
            </div>
          </div>

          <div className="list-item" style={{ padding: '16px 0' }}>
            <PhoneIcon size={18} style={{ color: 'var(--text-muted)', marginTop: '2px' }} />
            <div className="list-content">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span className="list-title">Mobile • Safari</span>
              </div>
              <div className="list-desc" style={{ marginBottom: '8px' }}>
                iOS 17.2<br />
                New York, NY (US)<br />
                IP: 98.76.xxx.xxx
              </div>
              <div className="list-meta" style={{ marginBottom: '12px' }}>
                Last active: <strong>2 hours ago</strong><br />
                Logged in: 4/8/2026, 11:21:42 AM
              </div>
              <button className="content-card-action" style={{ color: 'var(--danger)', fontSize: '11px', fontWeight: '600' }}>REVOKE SESSION</button>
            </div>
          </div>
          
          <div className="list-item" style={{ paddingTop: '16px', borderBottom: 'none' }}>
            <Monitor size={18} style={{ color: 'var(--text-muted)', marginTop: '2px' }} />
            <div className="list-content">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span className="list-title">Desktop • Safari 17</span>
              </div>
              <div className="list-desc" style={{ marginBottom: '8px' }}>
                macOS 14<br />
                Los Angeles, CA (US)<br />
                IP: 192.168.xxx.xxx
              </div>
              <div className="list-meta" style={{ marginBottom: '12px' }}>
                Last active: <strong>2 days ago</strong><br />
                Logged in: 4/6/2026, 11:21:42 AM
              </div>
              <button className="content-card-action" style={{ color: 'var(--danger)', fontSize: '11px', fontWeight: '600' }}>REVOKE SESSION</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
