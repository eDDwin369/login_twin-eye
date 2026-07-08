
import { Settings, Globe, Download, Info, Cookie, Palette } from 'lucide-react';

export function PreferencesTab() {
  return (
    <div className="settings-grid">
      {/* Left Column */}
      <div className="content-column">
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-info-icon" style={{ background: '#F3E8FF', color: '#9333EA' }}>
              <Settings size={16} />
            </div>
            <div className="settings-card-title">Preferences</div>
          </div>
          
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>Configure your application preferences</p>

          <div style={{ padding: '16px', border: '1px solid var(--border-light)', borderRadius: '12px', marginBottom: '12px', background: 'var(--bg-dashboard)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ background: '#DBEAFE', color: '#2563EB', padding: '8px', borderRadius: '8px' }}>
                <Palette size={18} />
              </div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>Appearance</div>
            </div>
            
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '11px', background: 'var(--bg-dashboard)', display: 'inline-block', padding: '0 4px', marginBottom: '-8px', marginLeft: '8px', position: 'relative', zIndex: 1 }}>Theme</label>
              <select className="form-input" style={{ appearance: 'none', background: 'transparent' }} defaultValue="system">
                <option value="system">System Default</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </div>

          <div style={{ padding: '16px', border: '1px solid var(--border-light)', borderRadius: '12px', background: 'var(--bg-dashboard)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ background: '#CCFBF1', color: '#0D9488', padding: '8px', borderRadius: '8px' }}>
                <Globe size={18} />
              </div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>Localization</div>
            </div>
            
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label" style={{ fontSize: '11px', background: 'var(--bg-dashboard)', display: 'inline-block', padding: '0 4px', marginBottom: '-8px', marginLeft: '8px', position: 'relative', zIndex: 1 }}>Language</label>
              <select className="form-input" style={{ appearance: 'none', background: 'transparent' }} defaultValue="en">
                <option value="en">English (US)</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
            
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '11px', background: 'var(--bg-dashboard)', display: 'inline-block', padding: '0 4px', marginBottom: '-8px', marginLeft: '8px', position: 'relative', zIndex: 1 }}>Timezone</label>
              <select className="form-input" style={{ appearance: 'none', background: 'transparent' }} defaultValue="utc">
                <option value="utc">UTC</option>
                <option value="pst">Pacific Time (US & Canada)</option>
                <option value="est">Eastern Time (US & Canada)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="content-column">
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-info-icon" style={{ background: '#CFFAFE', color: '#0891B2' }}>
              <Info size={16} />
            </div>
            <div className="settings-card-title">Privacy Settings</div>
          </div>
          
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>Control your privacy settings and data sharing preferences</p>

          <div style={{ padding: '16px', border: '1px solid var(--border-light)', borderRadius: '12px', marginBottom: '12px', background: 'var(--bg-dashboard)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ background: '#E0F2FE', color: '#0284C7', padding: '8px', borderRadius: '8px' }}>
                <Download size={18} />
              </div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>Export Personal Data</div>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Download a copy of your personal data in JSON format</p>
            <button className="content-card-action" style={{ fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}><Download size={14} /> EXPORT DATA</button>
          </div>

          <div style={{ padding: '16px', border: '1px solid var(--border-light)', borderRadius: '12px', background: 'var(--bg-dashboard)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ background: '#FFEDD5', color: '#EA580C', padding: '8px', borderRadius: '8px' }}>
                <Cookie size={18} />
              </div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>Cookie Preferences</div>
            </div>
            
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>Manage how we use cookies and similar technologies</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'not-allowed' }}>
                <input type="checkbox" checked readOnly style={{ marginTop: '2px', accentColor: 'var(--primary)' }} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-main)' }}>Essential Cookies</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Required for the application to function (cannot be disabled)</div>
                </div>
              </label>
              
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ marginTop: '2px', accentColor: 'var(--primary)' }} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-main)' }}>Analytics Cookies</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Help us improve the application</div>
                </div>
              </label>
              
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                <input type="checkbox" style={{ marginTop: '2px', accentColor: 'var(--primary)' }} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-main)' }}>Marketing Cookies</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Used for personalized content</div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
