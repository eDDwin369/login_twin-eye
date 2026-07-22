import { useState, useRef, useEffect } from 'react';
import {
  Settings, Eye, Download, Upload, X,
  LayoutPanelTop, Layout, LayoutPanelLeft, ShieldCheck, Users,
  RotateCcw, Info, Link, Plus, Shield, Lock, FileText, Check, Palette
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

  // Local form states (Header Config)
  const [logo, setLogo] = useState(headerConfig.logo);
  const [showLogo, setShowLogo] = useState(headerConfig.showLogo);
  const [companyName, setCompanyName] = useState(headerConfig.companyName);
  const [showCompanyName, setShowCompanyName] = useState(headerConfig.showCompanyName);
  const [companyCaption, setCompanyCaption] = useState(headerConfig.companyCaption);
  const [showCompanyCaption, setShowCompanyCaption] = useState(headerConfig.showCompanyCaption);
  const [textColor, setTextColor] = useState(headerConfig.textColor);
  const [textColorApply, setTextColorApply] = useState<any>(headerConfig.textColorApply);

  // Footer Config States
  const [footerVisible, setFooterVisible] = useState(() => {
    const saved = localStorage.getItem('gs_footerVisible');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [copyrightText, setCopyrightText] = useState(() => {
    return localStorage.getItem('gs_copyrightText') || '© {year} MyProduct. All rights reserved.';
  });
  const [footerLinks, setFooterLinks] = useState<string[]>([]);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  // Sidebar Config States
  const [startExpanded, setStartExpanded] = useState(() => {
    const saved = localStorage.getItem('gs_startExpanded');
    return saved !== null ? JSON.parse(saved) : false;
  });
  const [autoHideSidebar, setAutoHideSidebar] = useState(() => {
    const saved = localStorage.getItem('sidebarLocked');
    return saved !== null ? !JSON.parse(saved) : false;
  });
  const [expandedWidth, setExpandedWidth] = useState(260);
  const [collapsedWidth, setCollapsedWidth] = useState(68);
  const [showIcons, setShowIcons] = useState(true);
  const [showLabels, setShowLabels] = useState(true);

  // Security Config States
  const [defaultEmail, setDefaultEmail] = useState('admin@digitaltwin.com');
  const [defaultPassword, setDefaultPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [enableSSO, setEnableSSO] = useState(false);
  const [minPasswordLength, setMinPasswordLength] = useState(12);
  const [reqUppercase, setReqUppercase] = useState(true);
  const [reqLowercase, setReqLowercase] = useState(true);
  // Password security policy states
  const [showStrengthMeter, setShowStrengthMeter] = useState(true);

  // Customer Profile Config States
  const [showCustomerProfile, setShowCustomerProfile] = useState(false);
  const [customerName, setCustomerName] = useState('Default Customer');
  const [customerColorFollow, setCustomerColorFollow] = useState(true);
  const [showCustomerLogo, setShowCustomerLogo] = useState(false);

  // Login Config States
  const [loginLayout, setLoginLayout] = useState('split');
  const [loginWelcomeHeader, setLoginWelcomeHeader] = useState('Welcome Back');
  const [loginWelcomeSub, setLoginWelcomeSub] = useState('Access your digital twin workspace');
  const [loginBackground, setLoginBackground] = useState('glassmorphism');

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
      setShowCompanyCaption(false);
      setTextColor('#000000');
      setTextColorApply('both');
    }
  };

  // Save changes
  const handleSave = () => {
    localStorage.setItem('gs_footerVisible', JSON.stringify(footerVisible));
    localStorage.setItem('gs_copyrightText', copyrightText);
    localStorage.setItem('gs_startExpanded', JSON.stringify(startExpanded));
    localStorage.setItem('sidebarLocked', JSON.stringify(!autoHideSidebar));

    onSaveConfig({
      logo,
      showLogo,
      companyName,
      showCompanyName,
      companyCaption,
      showCompanyCaption,
      textColor,
      textColorApply,
      autoHideSidebar
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
                          placeholder="#000000"
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
          ) : null}

          {/* Footer Config Panel */}
          {activeTab === 'footer' && (
            <div className="gs-tab-content-container">
              <div className="gs-cards-2x2">
                <div className="gs-config-card gs-card-blue">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        color: '#2563eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Eye size={18} />
                      </div>
                      <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b' }}>Footer Visibility</span>
                    </div>
                    <AppleToggle checked={footerVisible} onChange={setFooterVisible} />
                  </div>
                  <span style={{ fontSize: '12px', color: '#475569', lineHeight: '1.5' }}>
                    When disabled, the footer is hidden across the entire application. This recovers 32px of vertical space.
                  </span>
                </div>

                <div className="gs-config-card gs-card-green">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      color: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Check size={18} />
                    </div>
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b' }}>Copyright Text</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '11px', color: '#475569', fontWeight: 600 }}>Copyright Text</label>
                    <input 
                      type="text" 
                      value={copyrightText} 
                      onChange={(e) => setCopyrightText(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '13px',
                        backgroundColor: '#ffffff',
                        color: '#0f172a',
                        outline: 'none'
                      }}
                    />
                    <span style={{ fontSize: '10.5px', color: '#64748b', marginTop: '4px' }}>Use &#123;year&#125; to automatically insert the current year</span>
                  </div>
                </div>

                <div className="gs-config-card gs-card-teal">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(20, 184, 166, 0.1)',
                      color: '#20b8a6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Link size={18} />
                    </div>
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b' }}>Footer Links</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', minHeight: '60px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {footerLinks.length === 0 ? (
                      <span>No footer links added yet</span>
                    ) : (
                      footerLinks.map((link, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '6px 10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                          <span>{link}</span>
                          <button onClick={() => setFooterLinks(prev => prev.filter((_, i) => i !== idx))} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '11px' }}>Remove</button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="gs-config-card gs-card-orange">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(249, 115, 22, 0.1)',
                      color: '#f97316',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Plus size={18} />
                    </div>
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b' }}>Add Footer Link</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input 
                      type="text" 
                      placeholder="Link Label" 
                      value={linkText}
                      onChange={e => setLinkText(e.target.value)}
                      style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', color: '#0f172a', backgroundColor: '#ffffff' }}
                    />
                    <input 
                      type="text" 
                      placeholder="Link URL" 
                      value={linkUrl}
                      onChange={e => setLinkUrl(e.target.value)}
                      style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', color: '#0f172a', backgroundColor: '#ffffff' }}
                    />
                    <button 
                      onClick={() => {
                        if (linkText && linkUrl) {
                          setFooterLinks(prev => [...prev, `${linkText} (${linkUrl})`]);
                          setLinkText('');
                          setLinkUrl('');
                        }
                      }}
                      style={{ padding: '6px 12px', background: '#f97316', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      ADD LINK
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sidebar Config Panel */}
          {activeTab === 'sidebar' && (
            <div className="gs-tab-content-container">
              <div className="gs-cards-2x2">
                <div className="gs-config-card gs-card-blue">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(37, 99, 235, 0.1)',
                      color: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <LayoutPanelLeft size={18} />
                    </div>
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b' }}>Behavior</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Start Expanded</span>
                      <AppleToggle checked={startExpanded} onChange={setStartExpanded} />
                    </div>
                    <div style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }} />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Automatically Hide Sidebar</span>
                      <AppleToggle checked={autoHideSidebar} onChange={setAutoHideSidebar} />
                    </div>
                    <span style={{ fontSize: '10.5px', color: '#64748b' }}>Hides sidebar automatically when cursor leaves the area, expanding it on hover.</span>
                  </div>
                </div>

                <div className="gs-config-card gs-card-teal">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(20, 184, 166, 0.1)',
                      color: '#20b8a6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Plus size={18} />
                    </div>
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b' }}>Expanded Width</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#475569' }}>
                      <span>Width: {expandedWidth}px</span>
                    </div>
                    <input 
                      type="range" 
                      min="180" 
                      max="300" 
                      value={expandedWidth} 
                      onChange={e => setExpandedWidth(Number(e.target.value))} 
                      style={{ width: '100%', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '10.5px', color: '#64748b' }}>Recommended range: 180-300 pixels</span>
                  </div>
                </div>

                <div className="gs-config-card gs-card-green">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      color: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Eye size={18} />
                    </div>
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b' }}>Collapsed Width</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#475569' }}>
                      <span>Width: {collapsedWidth}px</span>
                    </div>
                    <input 
                      type="range" 
                      min="50" 
                      max="90" 
                      value={collapsedWidth} 
                      onChange={e => setCollapsedWidth(Number(e.target.value))} 
                      style={{ width: '100%', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '10.5px', color: '#64748b' }}>Recommended: 64 pixels for optimal icon spacing</span>
                  </div>
                </div>

                <div className="gs-config-card gs-card-orange">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(249, 115, 22, 0.1)',
                      color: '#f97316',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <LayoutPanelTop size={18} />
                    </div>
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b' }}>Display Options</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '12px', color: '#475569' }}>Show Icons</span>
                      <AppleToggle checked={showIcons} onChange={setShowIcons} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '12px', color: '#475569' }}>Show Labels</span>
                      <AppleToggle checked={showLabels} onChange={setShowLabels} />
                    </div>
                    <span style={{ fontSize: '10.5px', color: '#64748b' }}>Icons are always visible in collapsed mode</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Config Panel */}
          {activeTab === 'security' && (
            <div className="gs-tab-content-container">
              <div className="gs-cards-2x2">
                <div className="gs-config-card gs-card-blue">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(37, 99, 235, 0.1)',
                      color: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Lock size={18} />
                    </div>
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b' }}>Login Page</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input 
                      type="text" 
                      value={defaultEmail} 
                      onChange={e => setDefaultEmail(e.target.value)} 
                      style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', color: '#0f172a', backgroundColor: '#ffffff' }}
                    />
                    <input 
                      type="password" 
                      value={defaultPassword} 
                      onChange={e => setDefaultPassword(e.target.value)} 
                      style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', color: '#0f172a', backgroundColor: '#ffffff' }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                      <span style={{ fontSize: '11.5px', color: '#475569' }}>Show "Remember Me"</span>
                      <AppleToggle checked={rememberMe} onChange={setRememberMe} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '11.5px', color: '#475569' }}>Enable SSO</span>
                      <AppleToggle checked={enableSSO} onChange={setEnableSSO} />
                    </div>
                  </div>
                </div>

                <div className="gs-config-card gs-card-green">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      color: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Shield size={18} />
                    </div>
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b' }}>Password Policy</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#475569' }}>
                      <span>Minimum Length: {minPasswordLength}</span>
                    </div>
                    <input 
                      type="range" 
                      min="8" 
                      max="20" 
                      value={minPasswordLength} 
                      onChange={e => setMinPasswordLength(Number(e.target.value))} 
                      style={{ width: '100%', cursor: 'pointer' }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '11px', color: '#475569' }}>Require Uppercase</span>
                      <AppleToggle checked={reqUppercase} onChange={setReqUppercase} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '11px', color: '#475569' }}>Require Lowercase</span>
                      <AppleToggle checked={reqLowercase} onChange={setReqLowercase} />
                    </div>
                  </div>
                </div>

                <div className="gs-config-card gs-card-red">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      color: '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <ShieldCheck size={18} />
                    </div>
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b' }}>Security</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '12px', color: '#475569' }}>Show Strength Meter</span>
                      <AppleToggle checked={showStrengthMeter} onChange={setShowStrengthMeter} />
                    </div>
                    <span style={{ fontSize: '11.5px', color: '#64748b', lineHeight: '1.4' }}>
                      Displays a visual indicator of password strength during account creation and password changes.
                    </span>
                  </div>
                </div>

                <div className="gs-config-card gs-card-orange">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(249, 115, 22, 0.1)',
                      color: '#f97316',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <RotateCcw size={18} />
                    </div>
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b' }}>Password Reset</span>
                  </div>
                  <span style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>
                    Password reset functionality is managed through your authentication provider. Configure email templates and reset link expiration in the authentication settings.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Customer Profile Config Panel */}
          {activeTab === 'profile' && (
            <div className="gs-tab-content-container">
              <div className="gs-cards-2x2">
                <div className="gs-config-card gs-card-blue">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        color: '#2563eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Users size={18} />
                      </div>
                      <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b' }}>Customer Identity</span>
                    </div>
                    <AppleToggle checked={showCustomerProfile} onChange={setShowCustomerProfile} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input 
                      type="text" 
                      value={customerName} 
                      onChange={e => setCustomerName(e.target.value)} 
                      placeholder="Customer Name"
                      style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', color: '#0f172a', backgroundColor: '#ffffff' }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                      <span style={{ fontSize: '11px', color: '#475569' }}>Text Color matches theme</span>
                      <AppleToggle checked={customerColorFollow} onChange={setCustomerColorFollow} />
                    </div>
                  </div>
                </div>

                <div className="gs-config-card gs-card-green">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        color: '#10b981',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Palette size={18} />
                      </div>
                      <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b' }}>Customer Logo</span>
                    </div>
                    <AppleToggle checked={showCustomerLogo} onChange={setShowCustomerLogo} />
                  </div>
                  <button style={{ padding: '6px 12px', background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer' }}>
                    UPLOAD LOGO
                  </button>
                </div>

                <div className="gs-config-card gs-card-teal" style={{ gridColumn: 'span 2' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(20, 184, 166, 0.1)',
                      color: '#20b8a6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Eye size={18} />
                    </div>
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b' }}>Header Preview</span>
                  </div>
                  <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '16px', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>
                    {showCustomerProfile ? `Customer profile active: ${customerName}` : "Customer profile is hidden"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Login Layout Config Panel */}
          {activeTab === 'login' && (
            <div className="gs-tab-content-container">
              <div className="gs-cards-2x2">
                <div className="gs-config-card gs-card-blue">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(37, 99, 235, 0.1)',
                      color: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <LayoutPanelTop size={18} />
                    </div>
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b' }}>Layout Selection</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '11px', color: '#475569', fontWeight: 600 }}>Active Layout</label>
                    <select 
                      value={loginLayout} 
                      onChange={e => setLoginLayout(e.target.value)}
                      style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px', color: '#0f172a', backgroundColor: '#ffffff' }}
                    >
                      <option value="split">Split-screen</option>
                      <option value="card">Centered Card</option>
                      <option value="minimal">Minimalist View</option>
                    </select>
                  </div>
                </div>

                <div className="gs-config-card gs-card-green">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      color: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <FileText size={18} />
                    </div>
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b' }}>Welcome Text</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <input 
                      type="text" 
                      value={loginWelcomeHeader} 
                      onChange={e => setLoginWelcomeHeader(e.target.value)} 
                      placeholder="Header Text"
                      style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', color: '#0f172a', backgroundColor: '#ffffff' }}
                    />
                    <input 
                      type="text" 
                      value={loginWelcomeSub} 
                      onChange={e => setLoginWelcomeSub(e.target.value)} 
                      placeholder="Subtitle Text"
                      style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', color: '#0f172a', backgroundColor: '#ffffff' }}
                    />
                  </div>
                </div>

                <div className="gs-config-card gs-card-orange">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(249, 115, 22, 0.1)',
                      color: '#f97316',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Palette size={18} />
                    </div>
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b' }}>Visual Background</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <select 
                      value={loginBackground} 
                      onChange={e => setLoginBackground(e.target.value)}
                      style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px', color: '#0f172a', backgroundColor: '#ffffff' }}
                    >
                      <option value="glassmorphism">Glassmorphism Blur</option>
                      <option value="solid">Solid Slate Theme</option>
                      <option value="grid">Grid Mesh Pattern</option>
                    </select>
                  </div>
                </div>
              </div>
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
