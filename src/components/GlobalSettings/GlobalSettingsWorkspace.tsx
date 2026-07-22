import { useState, useRef, useEffect } from 'react';
import {
  Settings, Eye, Download, Upload, X,
  LayoutPanelTop, Layout, LayoutPanelLeft, ShieldCheck, Users,
  RotateCcw, Info
} from 'lucide-react';
import './GlobalSettingsWorkspace.css';
import logoDefault from '../../assets/logo.png';

interface GlobalSettingsWorkspaceProps {
  onClose: () => void;
  headerConfig: {
    logo: string;
    showLogo: boolean;
    companyName: string;
    showCompanyName: boolean;
    companyCaption: string;
    showCompanyCaption: boolean;
    textColor: string;
    textColorApply: 'both' | 'name' | 'caption';
  };
  onSaveConfig: (config: any) => void;
}

type TabId = 'header' | 'footer' | 'sidebar' | 'security' | 'profile' | 'login';

export function GlobalSettingsWorkspace({ onClose, headerConfig, onSaveConfig }: GlobalSettingsWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<TabId>('header');

  // Local form states
  const [logo, setLogo] = useState(headerConfig.logo);
  const [showLogo, setShowLogo] = useState(headerConfig.showLogo);
  const [companyName, setCompanyName] = useState(headerConfig.companyName);
  const [showCompanyName, setShowCompanyName] = useState(headerConfig.showCompanyName);
  const [companyCaption, setCompanyCaption] = useState(headerConfig.companyCaption);
  const [showCompanyCaption, setShowCompanyCaption] = useState(headerConfig.showCompanyCaption);
  const [textColor, setTextColor] = useState(headerConfig.textColor);
  const [textColorApply, setTextColorApply] = useState<any>(headerConfig.textColorApply);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync form states with props if they change
  useEffect(() => {
    setLogo(headerConfig.logo);
    setShowLogo(headerConfig.showLogo);
    setCompanyName(headerConfig.companyName);
    setShowCompanyName(headerConfig.showCompanyName);
    setCompanyCaption(headerConfig.companyCaption);
    setShowCompanyCaption(headerConfig.showCompanyCaption);
    setTextColor(headerConfig.textColor);
    setTextColorApply(headerConfig.textColorApply);
  }, [headerConfig]);

  // Handle Logo file upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setLogo(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset to default settings
  const handleResetToDefaults = () => {
    if (window.confirm("Reset all settings to default values?")) {
      setLogo('');
      setShowLogo(true);
      setCompanyName('OomniEye');
      setShowCompanyName(true);
      setCompanyCaption('Digital Twin Solutions');
      setShowCompanyCaption(true);
      setTextColor('#4A6FA5');
      setTextColorApply('both');
    }
  };

  // Save changes
  const handleSave = () => {
    onSaveConfig({
      logo,
      showLogo,
      companyName,
      showCompanyName,
      companyCaption,
      showCompanyCaption,
      textColor,
      textColorApply
    });
    onClose();
  };

  // Export settings to JSON
  const handleExportSettings = () => {
    const configToExport = {
      logo,
      showLogo,
      companyName,
      showCompanyName,
      companyCaption,
      showCompanyCaption,
      textColor,
      textColorApply
    };
    const blob = new Blob([JSON.stringify(configToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `OomniEye_GlobalSettings_Export.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import settings from JSON
  const handleImportSettings = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const imported = JSON.parse(reader.result as string);
            if (imported.companyName !== undefined) {
              if (imported.logo !== undefined) setLogo(imported.logo);
              if (imported.showLogo !== undefined) setShowLogo(imported.showLogo);
              if (imported.companyName !== undefined) setCompanyName(imported.companyName);
              if (imported.showCompanyName !== undefined) setShowCompanyName(imported.showCompanyName);
              if (imported.companyCaption !== undefined) setCompanyCaption(imported.companyCaption);
              if (imported.showCompanyCaption !== undefined) setShowCompanyCaption(imported.showCompanyCaption);
              if (imported.textColor !== undefined) setTextColor(imported.textColor);
              if (imported.textColorApply !== undefined) setTextColorApply(imported.textColorApply);
              alert("Settings imported successfully. Click Save Settings to apply.");
            } else {
              alert("Invalid backup configuration file format.");
            }
          } catch (err) {
            alert("Error parsing backup settings file.");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  // Close on Escape keypress
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Apple-style toggle switch inside modal
  const AppleToggle = ({ checked, onChange }: { checked: boolean; onChange: (val: boolean) => void }) => {
    return (
      <button
        type="button"
        onClick={() => onChange(!checked)}
        style={{
          position: 'relative',
          width: '42px',
          height: '24px',
          borderRadius: '9999px',
          backgroundColor: checked ? '#2563eb' : '#cbd5e1',
          border: 'none',
          cursor: 'pointer',
          transition: 'background-color 0.2s ease',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '2px',
            left: checked ? '20px' : '2px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
            transition: 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
      </button>
    );
  };

  const navItems = [
    { id: 'header', label: 'Header', icon: <LayoutPanelTop size={16} /> },
    { id: 'footer', label: 'Footer', icon: <Layout size={16} /> },
    { id: 'sidebar', label: 'Sidebar', icon: <LayoutPanelLeft size={16} /> },
    { id: 'security', label: 'Security', icon: <ShieldCheck size={16} /> },
    { id: 'profile', label: 'Customer Profile', icon: <Users size={16} /> },
    { id: 'login', label: 'Login Config', icon: <Settings size={16} /> },
  ];

  return (
    <div className="gs-overlay" onClick={onClose}>
      <div className="gs-modal" onClick={e => e.stopPropagation()}>

        {/* HEADER BAR */}
        <div className="gs-header">
          <div className="gs-header-left">
            <h2>
              <Settings size={20} style={{ color: '#2563eb' }} />
              Global Settings
            </h2>
          </div>
          <div className="gs-header-right">
            <button className="gs-icon-btn" title="Live Preview" onClick={() => alert("Live Preview is active.")}>
              <Eye size={18} />
            </button>
            <button className="gs-icon-btn" title="Export Settings" onClick={handleExportSettings}>
              <Download size={18} />
            </button>
            <button className="gs-icon-btn" title="Import Settings" onClick={handleImportSettings}>
              <Upload size={18} />
            </button>
            <button className="gs-icon-btn" title="Close" onClick={onClose} style={{ marginLeft: '8px' }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* TABS ROW */}
        <div className="gs-tabs-row">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabId)}
              className={`gs-tab-btn ${activeTab === item.id ? 'active' : ''}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        {/* CONTENT PANEL BODY */}
        <div className="gs-content-body">
          {activeTab === 'header' ? (
            <div className="gs-card-grid">

              {/* Left Card: Logo */}
              <div className="gs-config-card" style={{ flex: 1 }}>
                <div className="gs-card-header" style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <h3 className="gs-card-title">Logo</h3>
                    <span title="Upload your company logo to be displayed in the header." style={{ display: 'inline-flex', alignItems: 'center', color: '#94a3b8', cursor: 'help' }}>
                      <Info size={14} />
                    </span>
                  </div>
                </div>

                {/* Logo Drag Box Preview Area */}
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px dashed #cbd5e1',
                    borderRadius: '12px',
                    height: '180px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                    padding: '16px'
                  }}
                >
                  <img
                    src={logo || logoDefault}
                    alt="Logo Preview"
                    style={{ maxHeight: '110px', maxWidth: '100%', objectFit: 'contain', marginBottom: '12px' }}
                  />
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>
                    Height 80px (transparent PNG recommended)
                  </span>
                </div>

                {/* Left Card Bottom Controls */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      color: '#475569',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#94a3b8';
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#cbd5e1';
                      e.currentTarget.style.backgroundColor = '#ffffff';
                    }}
                  >
                    <Upload size={14} />
                    Upload Logo
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    style={{ display: 'none' }}
                  />

                  {/* Toggle */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0f172a' }}>Show Logo</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AppleToggle checked={showLogo} onChange={setShowLogo} />
                      <span style={{ fontSize: '11.5px', color: '#64748b' }}></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Card: Text & Visibility */}
              <div className="gs-config-card" style={{ flex: 1.2 }}>
                <div className="gs-card-header" style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <h3 className="gs-card-title">Text & Visibility</h3>
                    <span title="Manage the company name and caption text shown in the header." style={{ display: 'inline-flex', alignItems: 'center', color: '#94a3b8', cursor: 'help' }}>
                      <Info size={14} />
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                  {/* Company Name row */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0f172a' }}>Company Name</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Company name"
                        style={{
                          flex: 1,
                          maxWidth: '320px',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '13px',
                          fontWeight: 500,
                          outline: 'none',
                          color: '#0f172a'
                        }}
                      />
                      <AppleToggle checked={showCompanyName} onChange={setShowCompanyName} />
                    </div>
                  </div>

                  {/* Horizontal divider */}
                  <div style={{ borderBottom: '1px solid #f1f5f9', margin: '4px 0' }} />

                  {/* Company Caption row */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0f172a' }}>Company Caption</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <input
                        type="text"
                        value={companyCaption}
                        onChange={(e) => setCompanyCaption(e.target.value)}
                        placeholder="Caption description"
                        style={{
                          flex: 1,
                          maxWidth: '320px',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '13px',
                          fontWeight: 500,
                          outline: 'none',
                          color: '#0f172a'
                        }}
                      />
                      <AppleToggle checked={showCompanyCaption} onChange={setShowCompanyCaption} />
                    </div>
                  </div>

                  {/* Horizontal divider */}
                  <div style={{ borderBottom: '1px solid #f1f5f9', margin: '4px 0' }} />

                  {/* Text Color Selection Row */}
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0f172a' }}>Text Color</span>
                        <span title="Choose color for company name and caption." style={{ display: 'inline-flex', alignItems: 'center', color: '#94a3b8', cursor: 'help' }}>
                          <Info size={13} />
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', height: '38px' }}>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '8px',
                              backgroundColor: textColor,
                              border: '1px solid #cbd5e1',
                              cursor: 'pointer'
                            }}
                            onClick={() => document.getElementById('gs-color-picker')?.click()}
                          />
                          <input
                            id="gs-color-picker"
                            type="color"
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                            style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                          />
                        </div>
                        <input
                          type="text"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          placeholder="#4A6FA5"
                          style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            fontSize: '13px',
                            fontWeight: 500,
                            outline: 'none',
                            width: '100px',
                            color: '#0f172a'
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '180px' }}>
                      <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0f172a' }}>Apply to</span>
                      <div style={{ display: 'flex', alignItems: 'center', height: '38px' }}>
                        <select
                          value={textColorApply}
                          onChange={(e: any) => setTextColorApply(e.target.value)}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            fontSize: '13px',
                            fontWeight: 500,
                            color: '#0f172a',
                            outline: 'none',
                            backgroundColor: '#ffffff',
                            cursor: 'pointer',
                            width: '100%'
                          }}
                        >
                          <option value="both">Company name & caption</option>
                          <option value="name">Company name only</option>
                          <option value="caption">Company caption only</option>
                        </select>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: '#64748b' }}>
              <Settings size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
              <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a' }}>
                {navItems.find(i => i.id === activeTab)?.label} Settings
              </h4>
              <p style={{ fontSize: '12px', marginTop: '4px' }}>
                Configuration panels for {navItems.find(i => i.id === activeTab)?.label} will load here.
              </p>
            </div>
          )}
        </div>

        {/* BOTTOM STICKY FOOTER */}
        <div className="gs-footer">
          <button className="gs-btn-reset" onClick={handleResetToDefaults}>
            <RotateCcw size={14} />
            Reset to defaults
          </button>
          <div className="gs-footer-right">
            <button className="gs-btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button className="gs-btn-save" onClick={handleSave}>
              Save Settings
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
