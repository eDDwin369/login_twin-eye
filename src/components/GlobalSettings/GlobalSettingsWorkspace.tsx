import { useState, useRef, useEffect } from 'react';
import {
  Settings, Eye, Download, Upload, X,
  LayoutPanelTop, Layout, LayoutPanelLeft, ShieldCheck, Users,
  RotateCcw, Info, Link, Plus, Shield, Lock, Check, Palette, Star, Type, Image
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
  sidebarAutoHide: boolean;
  setSidebarAutoHide: (val: boolean) => void;
  sidebarExpandedWidth: number;
  setSidebarExpandedWidth: (val: number) => void;
  sidebarCollapsedWidth: number;
  setSidebarCollapsedWidth: (val: number) => void;
  sidebarShowIcons: boolean;
  setSidebarShowIcons: (val: boolean) => void;
  sidebarShowLabels: boolean;
  setSidebarShowLabels: (val: boolean) => void;
  onSyncFooter: (footerData: any) => void;
  setSidebarCollapsed: (val: boolean) => void;
  onTabChange?: (tab: string) => void;
  onSyncCustomerProfile?: (data: {
    showCustomerProfile: boolean;
    customerName: string;
    customerColorFollow: boolean;
    showCustomerLogo: boolean;
    customerLogo: string;
  }) => void;
}

type TabId = 'header' | 'footer' | 'sidebar' | 'security' | 'profile';

export function GlobalSettingsWorkspace({ 
  onClose, 
  headerConfig, 
  onSaveConfig,
  sidebarAutoHide,
  setSidebarAutoHide,
  sidebarExpandedWidth,
  setSidebarExpandedWidth,
  sidebarCollapsedWidth,
  setSidebarCollapsedWidth,
  sidebarShowIcons,
  setSidebarShowIcons,
  sidebarShowLabels,
  setSidebarShowLabels,
  onSyncFooter,
  setSidebarCollapsed,
  onTabChange,
  onSyncCustomerProfile
}: GlobalSettingsWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<TabId>('footer');

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
    return localStorage.getItem('gs_copyrightText') || '© {year} OomniEye. All rights reserved.';
  });
  const [footerPoweredByType, setFooterPoweredByType] = useState<'text' | 'image'>(() => {
    try {
      const saved = localStorage.getItem('gs_footerPoweredByType');
      return saved ? JSON.parse(saved) : 'text';
    } catch {
      return 'text';
    }
  });
  const [footerPoweredByText, setFooterPoweredByText] = useState(() => {
    return localStorage.getItem('gs_footerPoweredByText') || 'Powered by OomniEye Digital Solutions';
  });
  const [footerPoweredByImage, setFooterPoweredByImage] = useState(() => {
    return localStorage.getItem('gs_footerPoweredByImage') || '';
  });
  const [footerLinks, setFooterLinks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('gs_footerLinks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [isAddingLink, setIsAddingLink] = useState(false);

  // Sidebar Config States
  const [startExpanded, setStartExpanded] = useState(() => {
    const saved = localStorage.getItem('gs_startExpanded');
    return saved !== null ? JSON.parse(saved) : false;
  });
  const [autoHideSidebar, setAutoHideSidebar] = useState(sidebarAutoHide);
  const [expandedWidth, setExpandedWidth] = useState(sidebarExpandedWidth);
  const [collapsedWidth, setCollapsedWidth] = useState(sidebarCollapsedWidth);
  const [showIcons, setShowIcons] = useState(sidebarShowIcons);
  const [showLabels, setShowLabels] = useState(sidebarShowLabels);

  // Capture initial snapshot on mount for revert support
  const originalSettingsRef = useRef({
    headerConfig: { ...headerConfig },
    footerVisible: Boolean(JSON.parse(localStorage.getItem('gs_footerVisible') ?? 'true')),
    copyrightText: localStorage.getItem('gs_copyrightText') ?? '© {year} OomniEye. All rights reserved.',
    footerPoweredByType: JSON.parse(localStorage.getItem('gs_footerPoweredByType') ?? '"text"'),
    footerPoweredByText: localStorage.getItem('gs_footerPoweredByText') ?? '',
    footerPoweredByImage: localStorage.getItem('gs_footerPoweredByImage') ?? '',
    sidebarAutoHide,
    sidebarExpandedWidth,
    sidebarCollapsedWidth,
    sidebarShowIcons,
    sidebarShowLabels,
    sidebarCollapsed: !JSON.parse(localStorage.getItem('gs_startExpanded') ?? 'false'),
    footerLinks: JSON.parse(localStorage.getItem('gs_footerLinks') ?? '[]'),
    showCustomerProfile: Boolean(JSON.parse(localStorage.getItem('gs_showCustomerProfile') ?? 'false')),
    customerName: localStorage.getItem('gs_customerName') ?? 'Default Customer',
    customerColorFollow: Boolean(JSON.parse(localStorage.getItem('gs_customerColorFollow') ?? 'true')),
    showCustomerLogo: Boolean(JSON.parse(localStorage.getItem('gs_showCustomerLogo') ?? 'false')),
    customerLogo: localStorage.getItem('gs_customerLogo') ?? ''
  });

  // Track if changes have been saved to avoid reverting on close
  const isSavedRef = useRef(false);

  // Close modal — changes are auto-persisted, no revert needed
  const handleCancelAndClose = () => {
    onClose();
  };

  // Sync Header config in real-time
  useEffect(() => {
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
  }, [logo, showLogo, companyName, showCompanyName, companyCaption, showCompanyCaption, textColor, textColorApply]);

  // Sync Footer config in real-time
  useEffect(() => {
    onSyncFooter({
      footerVisible,
      copyrightText,
      footerPoweredByType,
      footerPoweredByText,
      footerPoweredByImage,
      footerLinks
    });
  }, [footerVisible, copyrightText, footerPoweredByType, footerPoweredByText, footerPoweredByImage, footerLinks]);

  // Sync Sidebar config in real-time
  useEffect(() => {
    setSidebarAutoHide(autoHideSidebar);
    setSidebarExpandedWidth(expandedWidth);
    setSidebarCollapsedWidth(collapsedWidth);
    setSidebarShowIcons(showIcons);
    setSidebarShowLabels(showLabels);
    setSidebarCollapsed(!startExpanded);
  }, [autoHideSidebar, expandedWidth, collapsedWidth, showIcons, showLabels, startExpanded]);

  // Sync active settings tab with parent
  useEffect(() => {
    if (onTabChange) {
      onTabChange(activeTab);
    }
  }, [activeTab, onTabChange]);

  // Clean up tab track on unmount
  useEffect(() => {
    return () => {
      if (onTabChange) onTabChange('');
    };
  }, [onTabChange]);

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
  const [showCustomerProfile, setShowCustomerProfile] = useState(() => {
    const saved = localStorage.getItem('gs_showCustomerProfile');
    return saved !== null ? JSON.parse(saved) : false;
  });
  const [customerName, setCustomerName] = useState(() => {
    return localStorage.getItem('gs_customerName') || 'Default Customer';
  });
  const [customerColorFollow, setCustomerColorFollow] = useState(() => {
    const saved = localStorage.getItem('gs_customerColorFollow');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [showCustomerLogo, setShowCustomerLogo] = useState(() => {
    const saved = localStorage.getItem('gs_showCustomerLogo');
    return saved !== null ? JSON.parse(saved) : false;
  });
  const [customerLogo, setCustomerLogo] = useState(() => {
    return localStorage.getItem('gs_customerLogo') || '';
  });

  const customerLogoInputRef = useRef<HTMLInputElement>(null);

  const handleCustomerLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setCustomerLogo(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Sync Customer Profile config in real-time
  useEffect(() => {
    if (onSyncCustomerProfile) {
      onSyncCustomerProfile({
        showCustomerProfile,
        customerName,
        customerColorFollow,
        showCustomerLogo,
        customerLogo
      });
    }
  }, [showCustomerProfile, customerName, customerColorFollow, showCustomerLogo, customerLogo, onSyncCustomerProfile]);



  // Notifications Config States
  const [notificationsToShow] = useState(() => {
    const saved = localStorage.getItem('gs_notificationsToShow');
    return saved !== null ? JSON.parse(saved) : 5;
  });

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
  const handleFooterImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setFooterPoweredByImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

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
      setFooterPoweredByType('text');
      setFooterPoweredByText('Powered by OomniEye Digital Solutions');
      setFooterPoweredByImage('');
      setStartExpanded(false);
      setAutoHideSidebar(false);
      setExpandedWidth(260);
      setCollapsedWidth(68);
      setShowIcons(true);
      setShowLabels(true);
    }
  };

  // Save changes
  const handleSave = () => {
    isSavedRef.current = true;
    localStorage.setItem('gs_footerVisible', JSON.stringify(footerVisible));
    localStorage.setItem('gs_copyrightText', copyrightText);
    localStorage.setItem('gs_startExpanded', JSON.stringify(startExpanded));
    localStorage.setItem('sidebarCollapsed', JSON.stringify(!startExpanded));
    localStorage.setItem('sidebarLocked', JSON.stringify(!autoHideSidebar));
    localStorage.setItem('gs_notificationsToShow', JSON.stringify(notificationsToShow));
    setSidebarAutoHide(autoHideSidebar);
    localStorage.setItem('gs_footerPoweredByType', JSON.stringify(footerPoweredByType));
    localStorage.setItem('gs_footerPoweredByText', footerPoweredByText);
    localStorage.setItem('gs_footerPoweredByImage', footerPoweredByImage);
    localStorage.setItem('gs_footerLinks', JSON.stringify(footerLinks));
    localStorage.setItem('gs_footerLinks', JSON.stringify(footerLinks));
    localStorage.setItem('gs_showCustomerProfile', JSON.stringify(showCustomerProfile));
    localStorage.setItem('gs_customerName', customerName);
    localStorage.setItem('gs_customerColorFollow', JSON.stringify(customerColorFollow));
    localStorage.setItem('gs_showCustomerLogo', JSON.stringify(showCustomerLogo));
    localStorage.setItem('gs_customerLogo', customerLogo);
    localStorage.setItem('gs_expandedWidth', JSON.stringify(expandedWidth));
    localStorage.setItem('gs_collapsedWidth', JSON.stringify(collapsedWidth));
    localStorage.setItem('gs_showIcons', JSON.stringify(showIcons));
    localStorage.setItem('gs_showLabels', JSON.stringify(showLabels));
    setSidebarExpandedWidth(expandedWidth);
    setSidebarCollapsedWidth(collapsedWidth);
    setSidebarShowIcons(showIcons);
    setSidebarShowLabels(showLabels);

    onSaveConfig({
      logo,
      showLogo,
      companyName,
      showCompanyName,
      companyCaption,
      showCompanyCaption,
      textColor,
      textColorApply,
      autoHideSidebar,
      startExpanded
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
      if (e.key === 'Escape') handleCancelAndClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleCancelAndClose]);

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
    { id: 'profile', label: 'Customer Profile', icon: <Users size={16} /> },
    { id: 'footer', label: 'Footer', icon: <Layout size={16} /> },
    { id: 'sidebar', label: 'Sidebar', icon: <LayoutPanelLeft size={16} /> },
    { id: 'security', label: 'Security', icon: <ShieldCheck size={16} /> },
  ];

  return (
    <div className="gs-overlay" onClick={handleCancelAndClose}>
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
            <button className="gs-icon-btn" title="Close" onClick={handleCancelAndClose} style={{ marginLeft: '8px' }}>
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
          {activeTab === 'header' && (
            <div className="gs-tab-content-container">
              <div className="gs-cards-2x2">

                {/* Left Card: Logo Settings */}
                <div className="gs-config-card gs-card-blue">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(37, 99, 235, 0.1)',
                      color: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Image size={18} />
                    </div>
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b' }}>Logo Settings</span>
                  </div>

                  {/* Logo Drag Box Preview Area */}
                  <div
                    style={{
                      background: '#ffffff',
                      border: '1px dashed #bfdbfe',
                      borderRadius: '12px',
                      height: '110px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '12px',
                      padding: '8px'
                    }}
                  >
                    <img
                      src={logo || logoDefault}
                      alt="Logo Preview"
                      style={{ maxHeight: '60px', maxWidth: '100%', objectFit: 'contain', marginBottom: '8px' }}
                    />
                    <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 500 }}>
                      Height 80px (transparent PNG recommended)
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Show Logo Toggle Row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Eye size={16} style={{ color: '#475569' }} />
                        <span style={{ fontSize: '12.5px', color: '#1e293b', fontWeight: 500 }}>Show Logo</span>
                      </div>
                      <AppleToggle checked={showLogo} onChange={setShowLogo} />
                    </div>

                    {/* Upload Logo Row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #bfdbfe', paddingTop: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Upload size={16} style={{ color: '#475569' }} />
                        <span style={{ fontSize: '12.5px', color: '#1e293b', fontWeight: 500 }}>Upload File</span>
                      </div>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          background: '#2563eb',
                          color: '#ffffff',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        UPLOAD LOGO
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        style={{ display: 'none' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Card: Branding Texts */}
                <div className="gs-config-card gs-card-green">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(37, 99, 235, 0.1)',
                      color: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Type size={18} />
                    </div>
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b' }}>Branding Texts</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Company Name Row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ flex: 1, position: 'relative', marginTop: '8px' }}>
                        <span style={{ 
                          position: 'absolute', 
                          top: '-8px', 
                          left: '12px', 
                          background: '#e8eefb', 
                          padding: '0 4px', 
                          fontSize: '11px', 
                          color: '#475569',
                          fontWeight: 500
                        }}>
                          Company Name
                        </span>
                        <input
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="e.g. OomniEye"
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '10px',
                            border: '1px solid #cbd5e1',
                            fontSize: '14px',
                            outline: 'none',
                            color: '#0f172a',
                            backgroundColor: '#ffffff'
                          }}
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
                        <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 500 }}>Show</span>
                        <AppleToggle checked={showCompanyName} onChange={setShowCompanyName} />
                      </div>
                    </div>

                    {/* Company Caption Row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ flex: 1, position: 'relative', marginTop: '8px' }}>
                        <span style={{ 
                          position: 'absolute', 
                          top: '-8px', 
                          left: '12px', 
                          background: '#e8eefb', 
                          padding: '0 4px', 
                          fontSize: '11px', 
                          color: '#475569',
                          fontWeight: 500
                        }}>
                          Company Caption
                        </span>
                        <input
                          type="text"
                          value={companyCaption}
                          onChange={(e) => setCompanyCaption(e.target.value)}
                          placeholder="e.g. Digital Twin Solutions"
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '10px',
                            border: '1px solid #cbd5e1',
                            fontSize: '14px',
                            outline: 'none',
                            color: '#0f172a',
                            backgroundColor: '#ffffff'
                          }}
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
                        <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 500 }}>Show</span>
                        <AppleToggle checked={showCompanyCaption} onChange={setShowCompanyCaption} />
                      </div>
                    </div>

                    {/* Color and Dropdown Row */}
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '8px' }}>
                      {/* Color Picker clicker */}
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          backgroundColor: textColor,
                          border: '1px solid #cbd5e1',
                          cursor: 'pointer',
                          marginTop: '8px',
                          flexShrink: 0
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

                      {/* Text Color Input */}
                      <div style={{ flex: 1.2, position: 'relative', marginTop: '8px' }}>
                        <span style={{ 
                          position: 'absolute', 
                          top: '-8px', 
                          left: '12px', 
                          background: '#e8eefb', 
                          padding: '0 4px', 
                          fontSize: '11px', 
                          color: '#475569',
                          fontWeight: 500
                        }}>
                          Text Color
                        </span>
                        <input 
                          type="text" 
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '10px',
                            border: '1px solid #cbd5e1',
                            fontSize: '14px',
                            outline: 'none',
                            color: '#0f172a',
                            backgroundColor: '#ffffff'
                          }}
                        />
                      </div>

                      {/* Apply Color Dropdown */}
                      <div style={{ flex: 2, position: 'relative', marginTop: '8px' }}>
                        <span style={{ 
                          position: 'absolute', 
                          top: '-8px', 
                          left: '12px', 
                          background: '#e8eefb', 
                          padding: '0 4px', 
                          fontSize: '11px', 
                          color: '#475569',
                          fontWeight: 500
                        }}>
                          Apply Color To
                        </span>
                        <select
                          value={textColorApply}
                          onChange={(e) => setTextColorApply(e.target.value as any)}
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '10px',
                            border: '1px solid #cbd5e1',
                            fontSize: '14px',
                            outline: 'none',
                            color: '#0f172a',
                            backgroundColor: '#ffffff',
                            cursor: 'pointer'
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
          )}

          {activeTab === 'footer' && (
            <div className="gs-tab-content-container">
              <div className="gs-cards-2x2">
                <div className="gs-config-card gs-card-blue">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(37, 99, 235, 0.1)',
                      color: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Star size={16} fill="currentColor" />
                    </div>
                    <label style={{ fontSize: '13.5px', color: '#1e293b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Powered By
                      <span title="Custom branding text or logo in footer bottom-right" style={{ display: 'inline-flex', alignItems: 'center' }}>
                        <Info size={12} style={{ opacity: 0.6, cursor: 'help' }} />
                      </span>
                    </label>
                  </div>

                  {/* Tabs: Text vs Image */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    <button
                      type="button"
                      onClick={() => setFooterPoweredByType('text')}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: footerPoweredByType === 'text' ? 'none' : '1px solid #1a73e8',
                        backgroundColor: footerPoweredByType === 'text' ? '#0b57d0' : 'transparent',
                        color: footerPoweredByType === 'text' ? '#ffffff' : '#1a73e8',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <Type size={14} /> TEXT
                    </button>
                    <button
                      type="button"
                      onClick={() => setFooterPoweredByType('image')}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: footerPoweredByType === 'image' ? 'none' : '1px solid #1a73e8',
                        backgroundColor: footerPoweredByType === 'image' ? '#0b57d0' : 'transparent',
                        color: footerPoweredByType === 'image' ? '#ffffff' : '#1a73e8',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <Image size={14} /> IMAGE
                    </button>
                  </div>

                  {/* Dynamic Inputs */}
                  {footerPoweredByType === 'text' ? (
                    <div style={{ position: 'relative', marginTop: '12px', width: '100%' }}>
                      <span style={{ 
                        position: 'absolute', 
                        top: '-8px', 
                        left: '12px', 
                        background: '#f0f4ff', 
                        padding: '0 4px', 
                        fontSize: '11px', 
                        color: '#475569',
                        fontWeight: 500
                      }}>
                        Powered By Text
                      </span>
                      <input 
                        type="text" 
                        value={footerPoweredByText}
                        onChange={(e) => setFooterPoweredByText(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '10px',
                          border: '1px solid #cbd5e1',
                          fontSize: '14px',
                          outline: 'none',
                          color: '#0f172a',
                          backgroundColor: '#ffffff'
                        }}
                      />
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
                        Displayed in the footer bottom-right
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ position: 'relative', marginTop: '6px', width: '100%' }}>
                        <span style={{ 
                          position: 'absolute', 
                          top: '-8px', 
                          left: '12px', 
                          background: '#f0f4ff', 
                          padding: '0 4px', 
                          fontSize: '11px', 
                          color: '#475569',
                          fontWeight: 500
                        }}>
                          Footer Logo URL
                        </span>
                        <input 
                          type="text" 
                          placeholder="https://example.com/logo.png"
                          value={footerPoweredByImage.startsWith('data:') ? '' : footerPoweredByImage}
                          onChange={(e) => setFooterPoweredByImage(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '10px',
                            border: '1px solid #cbd5e1',
                            fontSize: '14px',
                            outline: 'none',
                            color: '#0f172a',
                            backgroundColor: '#ffffff'
                          }}
                        />
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '11px', color: '#475569', fontWeight: 600 }}>Or Upload Image</label>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleFooterImageUpload}
                          style={{ fontSize: '12px' }}
                        />
                        {footerPoweredByImage && (
                          <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '11px', color: '#64748b' }}>Preview:</span>
                            <img src={footerPoweredByImage} alt="Footer Logo Preview" style={{ maxHeight: '24px', maxWidth: '100px', objectFit: 'contain', border: '1px solid #e2e8f0', padding: '2px', borderRadius: '4px' }} />
                            <button 
                              type="button" 
                              onClick={() => setFooterPoweredByImage('')} 
                              style={{ border: 'none', background: 'none', color: '#ef4444', fontSize: '11px', cursor: 'pointer' }}
                            >
                              Clear
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="gs-config-card gs-card-green">
                  
                  {/* Row 1: Footer Visibility */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        color: '#2563eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Eye size={18} />
                      </div>
                      <label style={{ fontSize: '13.5px', color: '#1e293b', fontWeight: 700 }}>Footer Visibility</label>
                    </div>
                    <AppleToggle checked={footerVisible} onChange={setFooterVisible} />
                  </div>

                  <div style={{ borderBottom: '1px solid #f1f5f9', margin: '12px 0' }} />

                  {/* Row 2: Copyright Text */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(37, 99, 235, 0.1)',
                      color: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Check size={18} />
                    </div>
                    <div style={{ flex: 1, position: 'relative', marginTop: '12px' }}>
                      <span style={{ 
                        position: 'absolute', 
                        top: '-8px', 
                        left: '12px', 
                        background: '#e8eefb', 
                        padding: '0 4px', 
                        fontSize: '11px', 
                        color: '#475569',
                        fontWeight: 500
                      }}>
                        Copyright Text
                      </span>
                      <input 
                        type="text" 
                        value={copyrightText} 
                        onChange={(e) => setCopyrightText(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '10px',
                          border: '1px solid #cbd5e1',
                          fontSize: '14px',
                          outline: 'none',
                          color: '#0f172a',
                          backgroundColor: '#ffffff'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ borderBottom: '1px solid #f1f5f9', margin: '12px 0' }} />

                  {/* Row 3: Add Footer Link */}
                  <div style={{ 
                    position: 'relative', 
                    height: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    overflow: 'hidden'
                  }}>
                    {/* State A: Add Link Trigger */}
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      opacity: isAddingLink ? 0 : 1,
                      transform: isAddingLink ? 'translateX(-20px)' : 'translateX(0)',
                      pointerEvents: isAddingLink ? 'none' : 'auto',
                      transition: 'all 0.30s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          backgroundColor: 'rgba(37, 99, 235, 0.1)',
                          color: '#2563eb',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Plus size={18} />
                        </div>
                        <label style={{ fontSize: '13.5px', color: '#1e293b', fontWeight: 700 }}>Add Footer Link</label>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setIsAddingLink(true)}
                        style={{
                          padding: '6px 16px',
                          background: '#2563eb',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#1d4ed8'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#2563eb'}
                      >
                        ADD LINK
                      </button>
                    </div>

                    {/* State B: Animated Inline Inputs */}
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      opacity: isAddingLink ? 1 : 0,
                      transform: isAddingLink ? 'translateX(0)' : 'translateX(20px)',
                      pointerEvents: isAddingLink ? 'auto' : 'none',
                      transition: 'all 0.30s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}>
                      <input 
                        type="text" 
                        placeholder="Link Label" 
                        value={linkText}
                        onChange={e => setLinkText(e.target.value)}
                        style={{
                          flex: 1,
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          fontSize: '12px',
                          color: '#0f172a',
                          backgroundColor: '#ffffff',
                          outline: 'none',
                          minWidth: 0
                        }}
                      />
                      <input 
                        type="text" 
                        placeholder="Link URL" 
                        value={linkUrl}
                        onChange={e => setLinkUrl(e.target.value)}
                        style={{
                          flex: 1.5,
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          fontSize: '12px',
                          color: '#0f172a',
                          backgroundColor: '#ffffff',
                          outline: 'none',
                          minWidth: 0
                        }}
                      />
                      {/* Confirm Icon Button */}
                      <button
                        type="button"
                        onClick={() => {
                          if (linkText && linkUrl) {
                            setFooterLinks(prev => [...prev, `${linkText} (${linkUrl})`]);
                            setLinkText('');
                            setLinkUrl('');
                            setIsAddingLink(false);
                          } else {
                            alert('Please enter both a label and a URL.');
                          }
                        }}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '10px',
                          backgroundColor: '#22c55e',
                          color: '#ffffff',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          flexShrink: 0
                        }}
                      >
                        <Check size={14} strokeWidth={3} />
                      </button>
                      {/* Cancel Icon Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setLinkText('');
                          setLinkUrl('');
                          setIsAddingLink(false);
                        }}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '10px',
                          backgroundColor: '#ef4444',
                          color: '#ffffff',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          flexShrink: 0
                        }}
                      >
                        <X size={14} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                </div>

                {footerLinks.length > 0 && (
                  <div className="gs-config-card gs-card-teal">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        color: '#2563eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Link size={18} />
                      </div>
                      <label style={{ fontSize: '13.5px', color: '#1e293b', fontWeight: 700 }}>Footer Links</label>
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {footerLinks.map((link, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '6px 10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                          <span>{link}</span>
                          <button onClick={() => setFooterLinks(prev => prev.filter((_, i) => i !== idx))} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '11px' }}>Remove</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* Sidebar Config Panel */}
          {activeTab === 'sidebar' && (
            <div className="gs-tab-content-container">
              <div className="gs-cards-2x2">
                
                {/* Behavior Card */}
                <div className="gs-config-card gs-card-blue">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
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

                {/* Expanded Width Card */}
                <div className="gs-config-card gs-card-teal">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(37, 99, 235, 0.12)',
                      color: '#2563eb',
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

                {/* Collapsed Width Card */}
                <div className="gs-config-card gs-card-green">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(37, 99, 235, 0.1)',
                      color: '#2563eb',
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

                {/* Display Options Card */}
                <div className="gs-config-card gs-card-orange">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(37, 99, 235, 0.12)',
                      color: '#2563eb',
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
                      borderRadius: '10px',
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
                      borderRadius: '10px',
                      backgroundColor: 'rgba(37, 99, 235, 0.1)',
                      color: '#2563eb',
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
                      borderRadius: '10px',
                      backgroundColor: 'rgba(37, 99, 235, 0.14)',
                      color: '#2563eb',
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
                      <span style={{ fontSize: '12px', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Show Strength Meter
                        <span title="Displays a visual indicator of password strength during account creation and password changes." style={{ display: 'inline-flex', alignItems: 'center' }}>
                          <Info size={12} style={{ opacity: 0.6, cursor: 'help' }} />
                        </span>
                      </span>
                      <AppleToggle checked={showStrengthMeter} onChange={setShowStrengthMeter} />
                    </div>
                  </div>
                </div>

                <div className="gs-config-card gs-card-orange">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(37, 99, 235, 0.12)',
                      color: '#2563eb',
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
                        borderRadius: '10px',
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
                        borderRadius: '10px',
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        color: '#2563eb',
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
                  <button 
                    onClick={() => customerLogoInputRef.current?.click()}
                    style={{ padding: '6px 12px', background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    UPLOAD LOGO
                  </button>
                  <input 
                    type="file" 
                    ref={customerLogoInputRef} 
                    onChange={handleCustomerLogoUpload} 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                  />
                  {customerLogo && (
                    <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>Preview:</span>
                      <img src={customerLogo} alt="Customer Logo Preview" style={{ maxHeight: '24px', maxWidth: '100px', objectFit: 'contain', border: '1px solid #e2e8f0', padding: '2px', borderRadius: '4px' }} />
                      <button 
                        type="button" 
                        onClick={() => setCustomerLogo('')} 
                        style={{ border: 'none', background: 'none', color: '#ef4444', fontSize: '11px', cursor: 'pointer' }}
                      >
                        Clear
                      </button>
                    </div>
                  )}
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
            <button className="gs-btn-cancel" onClick={handleCancelAndClose}>
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
