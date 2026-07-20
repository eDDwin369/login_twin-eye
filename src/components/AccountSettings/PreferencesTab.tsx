import { useState } from 'react';
import { 
  Palette, Globe, Download, Cookie, FileText, Trash2, 
  AlertTriangle, ChevronRight 
} from 'lucide-react';

export function PreferencesTab() {
  const [activeMenu, setActiveMenu] = useState<'appearance' | 'localization' | 'export' | 'cookies' | 'legal' | 'delete'>('appearance');
  
  // Local state for interactive elements
  const [theme, setTheme] = useState('corporate-blue');
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('utc');
  const [analyticsCookies, setAnalyticsCookies] = useState(true);
  const [marketingCookies, setMarketingCookies] = useState(false);

  return (
    <div className="security-page-grid">
      {/* LEFT SIDEBAR PANEL */}
      <div className="security-sidebar">
        <div className="security-menu-card">
          <button 
            className={`security-menu-item ${activeMenu === 'appearance' ? 'active' : ''}`}
            onClick={() => setActiveMenu('appearance')}
          >
            <div className="security-menu-item-left">
              <Palette size={16} />
              <span>Appearance</span>
            </div>
            {activeMenu === 'appearance' && <span className="security-menu-dot" />}
          </button>

          <button 
            className={`security-menu-item ${activeMenu === 'localization' ? 'active' : ''}`}
            onClick={() => setActiveMenu('localization')}
          >
            <div className="security-menu-item-left">
              <Globe size={16} />
              <span>Localization</span>
            </div>
            {activeMenu === 'localization' && <span className="security-menu-dot" />}
          </button>

          <button 
            className={`security-menu-item ${activeMenu === 'export' ? 'active' : ''}`}
            onClick={() => setActiveMenu('export')}
          >
            <div className="security-menu-item-left">
              <Download size={16} />
              <span>Export Personal Data</span>
            </div>
            {activeMenu === 'export' && <span className="security-menu-dot" />}
          </button>

          <button 
            className={`security-menu-item ${activeMenu === 'cookies' ? 'active' : ''}`}
            onClick={() => setActiveMenu('cookies')}
          >
            <div className="security-menu-item-left">
              <Cookie size={16} />
              <span>Cookie Preferences</span>
            </div>
            {activeMenu === 'cookies' && <span className="security-menu-dot" />}
          </button>

          <button 
            className={`security-menu-item ${activeMenu === 'legal' ? 'active' : ''}`}
            onClick={() => setActiveMenu('legal')}
          >
            <div className="security-menu-item-left">
              <FileText size={16} />
              <span>Legal Documents</span>
            </div>
            {activeMenu === 'legal' && <span className="security-menu-dot" />}
          </button>

          <button 
            className={`security-menu-item ${activeMenu === 'delete' ? 'active' : ''}`}
            onClick={() => setActiveMenu('delete')}
          >
            <div className="security-menu-item-left" style={{ color: '#ef4444' }}>
              <Trash2 size={16} />
              <span>Delete Account</span>
            </div>
            {activeMenu === 'delete' && <span className="security-menu-dot" style={{ background: '#ef4444' }} />}
          </button>
        </div>
      </div>

      {/* RIGHT CONTENT STACK */}
      <div className="security-content-stack">
        
        {/* VIEW 1: APPEARANCE */}
        {activeMenu === 'appearance' && (
          <div className="security-main-card">
            <div className="security-card-title-row">
              <div className="security-card-title-left">
                <div className="security-card-icon-wrapper blue" style={{ background: '#eff6ff', color: '#3b82f6' }}>
                  <Palette size={20} />
                </div>
                <div>
                  <h2 className="security-card-title">Appearance Settings</h2>
                  <p className="security-card-subtitle">Configure your visual interface layout and theme mode</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '400px', marginTop: '16px' }}>
              <div className="edit-form-group">
                <label className="edit-form-label">Theme</label>
                <select 
                  className="edit-form-input" 
                  value={theme} 
                  onChange={(e) => setTheme(e.target.value)}
                  style={{ background: '#ffffff', border: '1px solid #cbd5e1' }}
                >
                  <option value="corporate-blue">Corporate Blue</option>
                  <option value="light">Light Mode</option>
                  <option value="dark">Dark Mode</option>
                  <option value="system">System Default</option>
                </select>
              </div>
              <button className="btn-save" style={{ width: 'fit-content', marginTop: '4px' }}>Save Changes</button>
            </div>
          </div>
        )}

        {/* VIEW 2: LOCALIZATION */}
        {activeMenu === 'localization' && (
          <div className="security-main-card">
            <div className="security-card-title-row">
              <div className="security-card-title-left">
                <div className="security-card-icon-wrapper cyan" style={{ background: '#f0fdfa', color: '#0d9488' }}>
                  <Globe size={20} />
                </div>
                <div>
                  <h2 className="security-card-title">Localization Preferences</h2>
                  <p className="security-card-subtitle">Set your regional language and timezone configuration</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px', marginTop: '16px' }}>
              <div className="edit-form-group">
                <label className="edit-form-label">Language</label>
                <select 
                  className="edit-form-input" 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)}
                  style={{ background: '#ffffff', border: '1px solid #cbd5e1' }}
                >
                  <option value="en">English (US)</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>

              <div className="edit-form-group">
                <label className="edit-form-label">Timezone</label>
                <select 
                  className="edit-form-input" 
                  value={timezone} 
                  onChange={(e) => setTimezone(e.target.value)}
                  style={{ background: '#ffffff', border: '1px solid #cbd5e1' }}
                >
                  <option value="utc">UTC</option>
                  <option value="pst">Pacific Time (US & Canada)</option>
                  <option value="est">Eastern Time (US & Canada)</option>
                  <option value="ist">Indian Standard Time (IST)</option>
                </select>
              </div>
              <button className="btn-save" style={{ width: 'fit-content', marginTop: '8px' }}>Save Changes</button>
            </div>
          </div>
        )}

        {/* VIEW 3: EXPORT DATA */}
        {activeMenu === 'export' && (
          <div className="security-main-card">
            <div className="security-card-title-row">
              <div className="security-card-title-left">
                <div className="security-card-icon-wrapper" style={{ background: '#f0f9ff', color: '#0284c7' }}>
                  <Download size={20} />
                </div>
                <div>
                  <h2 className="security-card-title">Export Personal Data</h2>
                  <p className="security-card-subtitle">Request a backup download of your profile data history</p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '12px' }}>
              <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: '1.6', marginBottom: '20px' }}>
                Download a copy of your personal data in JSON format. This archive contains your complete profile settings, notification logs, security events, and preferences configurations.
              </p>
              <button className="security-signout-btn" style={{ borderColor: '#0284c7', color: '#0284c7', padding: '10px 18px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <Download size={15} /> Export Data
              </button>
            </div>
          </div>
        )}

        {/* VIEW 4: COOKIE PREFERENCES */}
        {activeMenu === 'cookies' && (
          <div className="security-main-card">
            <div className="security-card-title-row">
              <div className="security-card-title-left">
                <div className="security-card-icon-wrapper" style={{ background: '#fff7ed', color: '#ea580c' }}>
                  <Cookie size={20} />
                </div>
                <div>
                  <h2 className="security-card-title">Cookie Preferences</h2>
                  <p className="security-card-subtitle">Manage how we use cookies and tracking technologies</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', border: '1px solid #f1f5f9', borderRadius: '8px', cursor: 'not-allowed', background: '#f8fafc' }}>
                <input type="checkbox" checked readOnly style={{ marginTop: '3px', accentColor: '#ea580c' }} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>Essential Cookies</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Required for the application to function (cannot be disabled)</div>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', transition: 'background-color 0.2s' }}>
                <input 
                  type="checkbox" 
                  checked={analyticsCookies} 
                  onChange={(e) => setAnalyticsCookies(e.target.checked)} 
                  style={{ marginTop: '3px', accentColor: '#ea580c' }} 
                />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>Analytics Cookies</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Help us improve the application performance and usage feedback</div>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', transition: 'background-color 0.2s' }}>
                <input 
                  type="checkbox" 
                  checked={marketingCookies} 
                  onChange={(e) => setMarketingCookies(e.target.checked)} 
                  style={{ marginTop: '3px', accentColor: '#ea580c' }} 
                />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>Marketing Cookies</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Used for personalized content, promotions, and tailored features</div>
                </div>
              </label>

              <button className="btn-save" style={{ width: 'fit-content', background: '#ea580c', marginTop: '8px' }}>Save Cookie Preferences</button>
            </div>
          </div>
        )}

        {/* VIEW 5: LEGAL DOCUMENTS */}
        {activeMenu === 'legal' && (
          <div className="security-main-card">
            <div className="security-card-title-row">
              <div className="security-card-title-left">
                <div className="security-card-icon-wrapper cyan" style={{ background: '#ecfdf5', color: '#10b981' }}>
                  <FileText size={20} />
                </div>
                <div>
                  <h2 className="security-card-title">Legal Documents</h2>
                  <p className="security-card-subtitle">Review our standard terms, compliance, and user policies</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '20px' }}>
              {[
                { name: 'Privacy Policy', path: '#privacy' },
                { name: 'Terms of Service', path: '#terms' },
                { name: 'Data Retention Policy', path: '#retention' }
              ].map((doc, idx) => (
                <a 
                  key={idx} 
                  href={doc.path} 
                  onClick={(e) => e.preventDefault()}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    padding: '12px 16px', 
                    borderRadius: '8px', 
                    border: '1px solid #e2e8f0', 
                    color: '#0f172a',
                    fontWeight: '500', 
                    fontSize: '13.5px',
                    textDecoration: 'none',
                    transition: 'all 0.2s'
                  }}
                  className="legal-doc-link-row"
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FileText size={16} style={{ color: '#64748b' }} />
                    {doc.name}
                  </span>
                  <ChevronRight size={16} style={{ color: '#94a3b8' }} />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 6: DELETE ACCOUNT */}
        {activeMenu === 'delete' && (
          <div className="security-main-card" style={{ border: '1px solid #fee2e2' }}>
            <div className="security-card-title-row">
              <div className="security-card-title-left">
                <div className="security-card-icon-wrapper" style={{ background: '#fef2f2', color: '#ef4444' }}>
                  <Trash2 size={20} />
                </div>
                <div>
                  <h2 className="security-card-title" style={{ color: '#ef4444' }}>Delete Account</h2>
                  <p className="security-card-subtitle">Permanently delete your profile data and account settings</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '16px', border: '1px solid #fca5a5', borderRadius: '12px', background: '#fef2f2', color: '#b91c1c' }}>
                <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '13.5px', lineHeight: '1.5', fontWeight: '500' }}>
                  This action is permanent and cannot be undone. All your data will be permanently deleted, including active session configurations, profile setups, preferences history, and file associations.
                </div>
              </div>

              <button className="security-signout-btn" style={{ borderColor: '#ef4444', color: '#ef4444', background: '#ffffff', width: 'fit-content', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Trash2 size={16} /> Delete My Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
