import { useState, useRef, useEffect } from 'react';
import {
  Download, Upload, X, MoreVertical,
  LayoutPanelTop, Layout, LayoutPanelLeft, Users,
  RotateCcw, Type, Image, Ban, Save
} from 'lucide-react';
import './GlobalSettingsWorkspace.css';

import { ImageCropperModal } from './ImageCropperModal';

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
    companyNameColor?: string;
    companyCaptionColor?: string;
    companyNameStyle?: string;
    companyCaptionStyle?: string;
    headerBgColor?: string;
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
    customerNameStyle?: string;
    customerNameColor?: string;
  }) => void;
}

type TabId = 'header' | 'footer' | 'sidebar' | 'profile';

// Apple-style toggle switch (Matching User Screenshot 1:1)
const AppleToggle = ({ checked, onChange }: { checked: boolean; onChange: (val: boolean) => void }) => {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        position: 'relative',
        width: '50px',
        height: '28px',
        borderRadius: '14px',
        background: checked ? 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)' : '#3c3f47',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0,
        boxShadow: checked ? '0 2px 10px rgba(29, 78, 216, 0.5)' : 'inset 0 1px 3px rgba(0,0,0,0.4)'
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: checked ? '24px' : '3px',
          width: '21px',
          height: '21px',
          backgroundColor: '#ffffff',
          borderRadius: '50%',
          boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
          transition: 'left 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      />
    </button>
  );
};

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
  const [activeTab, setActiveTab] = useState<TabId>('header');

  // Local form states (Header Config)

  // Cropper State
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [pendingCropImage, setPendingCropImage] = useState('');
  const [cropperTarget, setCropperTarget] = useState<'header' | 'footer' | 'customer' | null>(null);

  const [logo, setLogo] = useState(headerConfig.logo);
  const [showLogo, setShowLogo] = useState(headerConfig.showLogo);
  const [companyName, setCompanyName] = useState(headerConfig.companyName);
  const [showCompanyName, setShowCompanyName] = useState(headerConfig.showCompanyName);
  const [companyCaption, setCompanyCaption] = useState(headerConfig.companyCaption);
  const [showCompanyCaption, setShowCompanyCaption] = useState(headerConfig.showCompanyCaption !== undefined ? headerConfig.showCompanyCaption : true);
  const [textColor, setTextColor] = useState(headerConfig.textColor || '#ffffff');
  const [textColorApply, setTextColorApply] = useState<any>(headerConfig.textColorApply || 'both');
  const [headerBgColor, setHeaderBgColor] = useState(headerConfig.headerBgColor || 'linear-gradient(135deg, #000000, #011446)');
  const [companyNameColor, setCompanyNameColor] = useState(headerConfig.companyNameColor || '#ffffff');
  const [companyCaptionColor, setCompanyCaptionColor] = useState(headerConfig.companyCaptionColor || 'rgba(255, 255, 255, 0.65)');
  const [companyNameStyle, setCompanyNameStyle] = useState(headerConfig.companyNameStyle || 'h1');
  const [companyCaptionStyle, setCompanyCaptionStyle] = useState(headerConfig.companyCaptionStyle || 'h3');

  // Header Color & Gradient Popover State
  const [showColorPopover, setShowColorPopover] = useState(false);
  const [bgType, setBgType] = useState<'solid' | 'gradient'>(() => {
    return (headerConfig.headerBgColor && headerConfig.headerBgColor.includes('gradient')) ? 'gradient' : 'solid';
  });
  const [gradColor1, setGradColor1] = useState('#000000');
  const [gradColor2, setGradColor2] = useState('#011446');
  const [gradAngle, setGradAngle] = useState('135deg');
  const colorPopoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (colorPopoverRef.current && !colorPopoverRef.current.contains(e.target as Node)) {
        setShowColorPopover(false);
      }
    };
    if (showColorPopover) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showColorPopover]);

  // Footer Config States
  const [footerVisible, setFooterVisible] = useState(() => {
    const saved = localStorage.getItem('gs_footerVisible');
    return saved !== null ? JSON.parse(saved) : false;
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
  const [footerLinks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('gs_footerLinks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [, setIsAddingLink] = useState(false);

  // Sidebar Config States
  const [startExpanded, setStartExpanded] = useState(() => {
    const saved = localStorage.getItem('gs_startExpanded');
    return saved !== null ? JSON.parse(saved) : false;
  });

  const [isHoveringExpanded] = useState(false);
  const [isDraggingExpanded] = useState(false);
  const [isHoveringCollapsed] = useState(false);
  const [isDraggingCollapsed] = useState(false);
  const [autoHideSidebar, setAutoHideSidebar] = useState(sidebarAutoHide);
  const [expandedWidth, setExpandedWidth] = useState(sidebarExpandedWidth);
  const [collapsedWidth, setCollapsedWidth] = useState(sidebarCollapsedWidth);
  const [showIcons, setShowIcons] = useState(sidebarShowIcons);
  const [showLabels, setShowLabels] = useState(sidebarShowLabels);

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
      textColorApply,
      companyNameColor,
      companyCaptionColor,
      companyNameStyle,
      companyCaptionStyle,
      headerBgColor
    });
  }, [logo, showLogo, companyName, showCompanyName, companyCaption, showCompanyCaption, textColor, textColorApply, companyNameColor, companyCaptionColor, companyNameStyle, companyCaptionStyle, headerBgColor]);

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
  }, [autoHideSidebar, expandedWidth, collapsedWidth, showIcons, showLabels]);

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
  // (Removed unused security states based on tsc output)

  // Customer Profile Config States
  const [showCustomerProfile, setShowCustomerProfile] = useState(() => {
    const saved = localStorage.getItem('gs_showCustomerProfile');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [customerName, setCustomerName] = useState(() => {
    return localStorage.getItem('gs_customerName') || 'OomniEye';
  });
  const [customerNameStyle, setCustomerNameStyle] = useState(() => {
    return localStorage.getItem('gs_customerNameStyle') || 'h1';
  });
  const [customerNameColor, setCustomerNameColor] = useState(() => {
    return localStorage.getItem('gs_customerNameColor') || '#ffffff';
  });

  const [customerColorFollow, setCustomerColorFollow] = useState(() => {
    const saved = localStorage.getItem('gs_customerColorFollow');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [showCustomerLogo, setShowCustomerLogo] = useState(() => {
    const saved = localStorage.getItem('gs_showCustomerLogo');
    return saved !== null ? JSON.parse(saved) : true;
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
          setPendingCropImage(reader.result);
          setCropperTarget('customer');
          setIsCropperOpen(true);
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
        customerLogo,
        customerNameStyle,
        customerNameColor
      });
    }
  }, [showCustomerProfile, customerName, customerColorFollow, showCustomerLogo, customerLogo, customerNameStyle, customerNameColor, onSyncCustomerProfile]);

  // Equal height is now enforced via CSS (.gs-config-card height: 286px) to maintain a perfectly static layout.
  // Notifications Config States
  const [notificationsToShow] = useState(() => {
    const saved = localStorage.getItem('gs_notificationsToShow');
    return saved !== null ? JSON.parse(saved) : 5;
  });



  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (isHoveringExpanded || isDraggingExpanded) {
      setSidebarCollapsed(false);
    } else if (isHoveringCollapsed || isDraggingCollapsed) {
      setSidebarCollapsed(true);
    } else {
      setSidebarCollapsed(!startExpanded);
    }
  }, [isHoveringExpanded, isDraggingExpanded, isHoveringCollapsed, isDraggingCollapsed, startExpanded, setSidebarCollapsed]);

  // Removed unused containerRef
  const fileInputRef = useRef<HTMLInputElement>(null);
  const footerFileInputRef = useRef<HTMLInputElement>(null);

  // Sync activeTab with parent component to highlight active section
  useEffect(() => {
    if (onTabChange) {
      onTabChange(activeTab);
    }
  }, [activeTab, onTabChange]);

  // Handle Logo file upload
  const handleFooterImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPendingCropImage(reader.result);
          setCropperTarget('footer');
          setIsCropperOpen(true);
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
          setPendingCropImage(reader.result);
          setCropperTarget('header');
          setIsCropperOpen(true);
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
      setTextColor('#ffffff');
      setTextColorApply('both');
      setCompanyNameColor('#ffffff');
      setCompanyCaptionColor('rgba(255, 255, 255, 0.65)');
      setCompanyNameStyle('h1');
      setCompanyCaptionStyle('h3');
      setHeaderBgColor('linear-gradient(135deg, #000000, #011446)');
      setFooterVisible(false);
      setFooterPoweredByType('text');
      setFooterPoweredByText('Powered by OomniEye Digital Solutions');
      setFooterPoweredByImage('');
      setStartExpanded(false);
      setAutoHideSidebar(true);
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
    localStorage.setItem('gs_notificationsToShow', JSON.stringify(notificationsToShow));
    setSidebarAutoHide(autoHideSidebar);
    localStorage.setItem('gs_footerPoweredByType', JSON.stringify(footerPoweredByType));
    localStorage.setItem('gs_footerPoweredByText', footerPoweredByText);
    localStorage.setItem('gs_footerPoweredByImage', footerPoweredByImage);
    localStorage.setItem('gs_footerLinks', JSON.stringify(footerLinks));
    localStorage.setItem('gs_footerLinks', JSON.stringify(footerLinks));

    localStorage.setItem('gs_showCustomerProfile', JSON.stringify(showCustomerProfile));
    localStorage.setItem('gs_customerName', customerName);
    localStorage.setItem('gs_customerNameStyle', customerNameStyle);
    localStorage.setItem('gs_customerNameColor', customerNameColor);
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
      companyNameColor,
      companyCaptionColor,
      companyNameStyle,
      companyCaptionStyle,
      headerBgColor,
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
      textColorApply,
      companyNameColor,
      companyCaptionColor,
      companyNameStyle,
      companyCaptionStyle,
      headerBgColor
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
              if (imported.companyNameColor !== undefined) setCompanyNameColor(imported.companyNameColor);
              if (imported.companyCaptionColor !== undefined) setCompanyCaptionColor(imported.companyCaptionColor);
              if (imported.companyNameStyle !== undefined) setCompanyNameStyle(imported.companyNameStyle);
              if (imported.companyCaptionStyle !== undefined) setCompanyCaptionStyle(imported.companyCaptionStyle);
              if (imported.headerBgColor !== undefined) setHeaderBgColor(imported.headerBgColor);
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

  const navItems = [
    { id: 'header', label: 'Header', icon: <LayoutPanelTop size={20} /> },
    { id: 'profile', label: 'Customer Profile', icon: <Users size={20} /> },
    { id: 'footer', label: 'Footer', icon: <Layout size={20} /> },
    { id: 'sidebar', label: 'Sidebar', icon: <LayoutPanelLeft size={20} /> },
  ];

  return (
    <div className="gs-overlay" onClick={handleCancelAndClose}>
      <div className="gs-workspace-layout" onClick={e => e.stopPropagation()}>

        <ImageCropperModal 
          isOpen={isCropperOpen}
          imageUrl={pendingCropImage}
          onClose={() => setIsCropperOpen(false)}
          onConfirm={(croppedUrl) => {
            if (cropperTarget === 'header') {
              setLogo(croppedUrl);
            } else if (cropperTarget === 'footer') {
              setFooterPoweredByImage(croppedUrl);
            } else if (cropperTarget === 'customer') {
              setCustomerLogo(croppedUrl);
            }
            setIsCropperOpen(false);
          }}
        />

        {/* Floating Left Sidebar Dock (Frame 20 in User Mockup) */}
        <div className="gs-left-dock">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabId)}
              className={`gs-dock-btn ${activeTab === item.id ? 'active' : ''}`}
              title={item.label}
            >
              {item.icon}
              <span className="gs-dock-tooltip">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Main Blurred Grey Window Card (Frame 19 in User Mockup) */}
        <div className="gs-modal">
          <div className="gs-header">
            <div className="gs-header-left">
              <h2 style={{ fontSize: '24px', fontWeight: 500, color: '#ffffff' }}>Global Settings</h2>
            </div>
            <div className="gs-header-right" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button 
                type="button"
                className="gs-top-action-btn gs-top-btn-cancel" 
                title="Cancel" 
                onClick={handleCancelAndClose}
                style={{
                  width: '46px',
                  height: '32px',
                  borderRadius: '16px',
                  background: 'rgba(38, 40, 48, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.2s ease'
                }}
              >
                <Ban size={16} />
              </button>
              <button 
                type="button"
                className="gs-top-action-btn gs-top-btn-save" 
                title="Save Settings" 
                onClick={handleSave}
                style={{
                  width: '46px',
                  height: '32px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
                  border: 'none',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(29, 78, 216, 0.6)',
                  transition: 'all 0.2s ease'
                }}
              >
                <Save size={16} />
              </button>
            </div>
          </div>

          {/* CONTENT PANEL BODY (2 Inner Cards) */}
          <div className="gs-content-body">
          {activeTab === 'header' && (
            <div className="gs-tab-content-container" style={{ padding: '24px 32px' }}>
              <div className="gs-cards-2x2">

                {/* Left Card: Logo & Header Color Settings (Matching User Screenshot 1:1) */}
                <div className="gs-config-card" style={{ background: 'rgba(38, 40, 48, 0.95)', borderRadius: '28px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  {/* Dashed Upload Dropzone */}
                  <div 
                    className="gs-iphone-dropzone"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        const file = e.dataTransfer.files[0];
                        if (file.type.startsWith('image/')) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            setPendingCropImage(reader.result as string);
                            setCropperTarget('header');
                            setIsCropperOpen(true);
                          };
                          reader.readAsDataURL(file);
                        }
                      }
                    }}
                    style={{
                      border: '1.5px dashed rgba(255, 255, 255, 0.25)',
                      borderRadius: '20px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      padding: '24px 16px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    {/* Glowing Blue Orb */}
                    <div style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #e0f2fe 0%, #38bdf8 100%)',
                      boxShadow: '0 0 20px rgba(56, 189, 248, 0.5), inset 0 2px 4px rgba(255,255,255,0.8)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '10px'
                    }}>
                      <Upload size={22} color="#0284c7" />
                    </div>

                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#ffffff' }}>Drop your logo here</span>
                    <span style={{ fontSize: '11.5px', color: 'rgba(255, 255, 255, 0.6)', marginTop: '4px', maxWidth: '280px', lineHeight: 1.3 }}>
                      For best results, logo uploads should be transparent PNG or SVG format.
                    </span>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    style={{ display: 'none' }}
                  />

                  {/* Uploaded Item Card */}
                  {logo && (
                    <div style={{
                      background: 'rgba(50, 53, 62, 0.85)',
                      borderRadius: '18px',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      border: '1px solid rgba(255, 255, 255, 0.15)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                          <img src={logo} alt="Logo Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </div>
                        <div>
                          <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#ffffff' }}>Company Logo</div>
                          <div style={{ fontSize: '11.5px', color: 'rgba(255, 255, 255, 0.6)' }}>PNG • Ready</div>
                        </div>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => {
                          setLogo('');
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }} 
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: '#ffffff',
                          color: '#1e293b',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          fontWeight: 700
                        }}
                      >
                        ×
                      </button>
                    </div>
                  )}

                  {/* Divider Line */}
                  <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)', margin: '4px 0' }} />

                  {/* Header Color Row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                    <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.85)', fontWeight: 500 }}>Header Color</span>
                    <div style={{ position: 'relative' }} ref={colorPopoverRef}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: headerBgColor || 'radial-gradient(circle at 30% 30%, #000000, #0a192f)',
                          border: '2px solid rgba(255, 255, 255, 0.35)',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)'
                        }}
                        onClick={() => setShowColorPopover(!showColorPopover)}
                        title="Choose Header Background Color or Gradient"
                      />

                      {/* Floating Popover for Color & Gradient */}
                      {showColorPopover && (
                        <div
                          style={{
                            position: 'absolute',
                            bottom: 'calc(100% + 8px)',
                            right: '0',
                            width: '270px',
                            backgroundColor: '#ffffff',
                            border: '1px solid #cbd5e1',
                            borderRadius: '12px',
                            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.18)',
                            padding: '12px',
                            zIndex: 9999,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>Header Theme Color</span>
                            <X size={14} style={{ cursor: 'pointer', color: '#64748b' }} onClick={() => setShowColorPopover(false)} />
                          </div>

                          <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '2px', borderRadius: '6px' }}>
                            <button
                              type="button"
                              onClick={() => setBgType('solid')}
                              style={{
                                flex: 1,
                                padding: '4px',
                                fontSize: '11px',
                                fontWeight: 600,
                                borderRadius: '4px',
                                border: 'none',
                                background: bgType === 'solid' ? '#ffffff' : 'transparent',
                                color: bgType === 'solid' ? '#0f172a' : '#64748b',
                                cursor: 'pointer'
                              }}
                            >
                              Solid Color
                            </button>
                            <button
                              type="button"
                              onClick={() => setBgType('gradient')}
                              style={{
                                flex: 1,
                                padding: '4px',
                                fontSize: '11px',
                                fontWeight: 600,
                                borderRadius: '4px',
                                border: 'none',
                                background: bgType === 'gradient' ? '#ffffff' : 'transparent',
                                color: bgType === 'gradient' ? '#0f172a' : '#64748b',
                                cursor: 'pointer'
                              }}
                            >
                              Gradient
                            </button>
                          </div>

                          {bgType === 'solid' ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              <input
                                type="color"
                                value={headerBgColor.startsWith('linear-gradient') ? '#ffffff' : headerBgColor}
                                onChange={(e) => setHeaderBgColor(e.target.value)}
                                style={{ width: '100%', height: '32px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                              />
                            </div>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <span style={{ fontSize: '11px', color: '#64748b', width: '45px' }}>Start</span>
                                <input
                                  type="color"
                                  value={gradColor1}
                                  onChange={(e) => {
                                    setGradColor1(e.target.value);
                                    setHeaderBgColor(`linear-gradient(${gradAngle}, ${e.target.value}, ${gradColor2})`);
                                  }}
                                  style={{ flex: 1, height: '28px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                />
                              </div>
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <span style={{ fontSize: '11px', color: '#64748b', width: '45px' }}>End</span>
                                <input
                                  type="color"
                                  value={gradColor2}
                                  onChange={(e) => {
                                    setGradColor2(e.target.value);
                                    setHeaderBgColor(`linear-gradient(${gradAngle}, ${gradColor1}, ${e.target.value})`);
                                  }}
                                  style={{ flex: 1, height: '28px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                />
                              </div>
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <span style={{ fontSize: '11px', color: '#64748b', width: '45px' }}>Angle</span>
                                <select
                                  value={gradAngle}
                                  onChange={(e) => {
                                    setGradAngle(e.target.value);
                                    setHeaderBgColor(`linear-gradient(${e.target.value}, ${gradColor1}, ${gradColor2})`);
                                  }}
                                  style={{ flex: 1, height: '28px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '11px', padding: '0 4px' }}
                                >
                                  <option value="90deg">90° →</option>
                                  <option value="135deg">135° ↘</option>
                                  <option value="180deg">180° ↓</option>
                                  <option value="45deg">45° ↗</option>
                                </select>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Show Logo Row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.85)', fontWeight: 500 }}>Show Logo</span>
                    <AppleToggle checked={showLogo} onChange={setShowLogo} />
                  </div>
                </div>

                {/* Right Card: Branding Texts (Matching User Screenshot 1:1) */}
                <div className="gs-config-card" style={{ background: '#282a30', borderRadius: '28px', padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '32px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ fontSize: '22px', fontWeight: 400, color: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                    Branding Texts
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    
                    {/* Company Name Block */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                      {/* Underline Input Line (Matching User Screenshot 1:1) */}
                      <input
                        type="text"
                        className="gs-underline-input"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Company Name"
                      />

                      {/* Controls Row sitting BELOW the line */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: '4px' }}>
                        {/* H1 Pill Dropdown */}
                        <div style={{ position: 'relative' }}>
                          <select
                            value={companyNameStyle}
                            onChange={(e) => setCompanyNameStyle(e.target.value)}
                            style={{
                              width: '58px',
                              height: '32px',
                              borderRadius: '16px',
                              border: '1px solid rgba(255, 255, 255, 0.15)',
                              fontSize: '13px',
                              fontWeight: 500,
                              padding: '0 8px 0 12px',
                              backgroundColor: '#3c3f47',
                              color: '#ffffff',
                              cursor: 'pointer',
                              outline: 'none',
                              appearance: 'none',
                              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                            }}
                          >
                            <option value="h1">H1</option>
                            <option value="h2">H2</option>
                            <option value="h3">H3</option>
                            <option value="h4">H4</option>
                          </select>
                          <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-55%)', pointerEvents: 'none', color: '#ffffff', fontSize: '10px', opacity: 0.8 }}>˅</span>
                        </div>

                        {/* Circular Color Swatch */}
                        <div style={{ position: 'relative' }}>
                          <div
                            style={{
                              width: '34px',
                              height: '34px',
                              borderRadius: '50%',
                              background: companyNameColor ? companyNameColor : 'radial-gradient(circle at 40% 40%, #051937, #000814)',
                              border: '1.5px solid rgba(255, 255, 255, 0.6)',
                              cursor: 'pointer',
                              boxShadow: '0 0 10px rgba(255, 255, 255, 0.15)'
                            }}
                            onClick={() => document.getElementById('gs-color-picker-name')?.click()}
                          />
                          <input
                            id="gs-color-picker-name"
                            type="color"
                            value={companyNameColor || '#051937'}
                            onChange={(e) => setCompanyNameColor(e.target.value)}
                            style={{ position: 'absolute', opacity: 0, width: 0, height: 0, top: 0, left: 0 }}
                          />
                        </div>

                        {/* Switch */}
                        <AppleToggle checked={showCompanyName} onChange={setShowCompanyName} />
                      </div>
                    </div>

                    {/* Company Caption Block */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                      {/* Underline Input Line (Matching User Screenshot 1:1) */}
                      <input
                        type="text"
                        className="gs-underline-input"
                        value={companyCaption}
                        onChange={(e) => setCompanyCaption(e.target.value)}
                        placeholder="Company Caption"
                      />

                      {/* Controls Row sitting BELOW the line */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: '4px' }}>
                        {/* H1 Pill Dropdown */}
                        <div style={{ position: 'relative' }}>
                          <select
                            value={companyCaptionStyle}
                            onChange={(e) => setCompanyCaptionStyle(e.target.value)}
                            style={{
                              width: '58px',
                              height: '32px',
                              borderRadius: '16px',
                              border: '1px solid rgba(255, 255, 255, 0.15)',
                              fontSize: '13px',
                              fontWeight: 500,
                              padding: '0 8px 0 12px',
                              backgroundColor: '#3c3f47',
                              color: '#ffffff',
                              cursor: 'pointer',
                              outline: 'none',
                              appearance: 'none',
                              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                            }}
                          >
                            <option value="h1">H1</option>
                            <option value="h2">H2</option>
                            <option value="h3">H3</option>
                            <option value="h4">H4</option>
                          </select>
                          <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-55%)', pointerEvents: 'none', color: '#ffffff', fontSize: '10px', opacity: 0.8 }}>˅</span>
                        </div>

                        {/* Circular Color Swatch */}
                        <div style={{ position: 'relative' }}>
                          <div
                            style={{
                              width: '34px',
                              height: '34px',
                              borderRadius: '50%',
                              background: companyCaptionColor ? companyCaptionColor : 'radial-gradient(circle at 40% 40%, #051937, #000814)',
                              border: '1.5px solid rgba(255, 255, 255, 0.6)',
                              cursor: 'pointer',
                              boxShadow: '0 0 10px rgba(255, 255, 255, 0.15)'
                            }}
                            onClick={() => document.getElementById('gs-color-picker-caption')?.click()}
                          />
                          <input
                            id="gs-color-picker-caption"
                            type="color"
                            value={companyCaptionColor || '#051937'}
                            onChange={(e) => setCompanyCaptionColor(e.target.value)}
                            style={{ position: 'absolute', opacity: 0, width: 0, height: 0, top: 0, left: 0 }}
                          />
                        </div>

                        {/* Switch */}
                        <AppleToggle checked={showCompanyCaption} onChange={setShowCompanyCaption} />
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Footer Config Panel */}
          {activeTab === 'footer' && (
            <div className="gs-tab-content-container" style={{ padding: '24px 32px' }}>
              <div className="gs-cards-2x2">
                
                {/* Left Card: Powered By Settings */}
                <div className="gs-config-card" style={{ background: '#282a30', borderRadius: '28px', padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '24px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ fontSize: '22px', fontWeight: 400, color: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                    Powered By
                  </div>

                  {/* Tabs: Text vs Image */}
                  <div style={{ display: 'flex', gap: '8px', background: '#3c3f47', padding: '4px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
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
                        borderRadius: '10px',
                        border: 'none',
                        background: footerPoweredByType === 'text' ? 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)' : 'transparent',
                        color: '#ffffff',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
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
                        borderRadius: '10px',
                        border: 'none',
                        background: footerPoweredByType === 'image' ? 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)' : 'transparent',
                        color: '#ffffff',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <Image size={14} /> IMAGE
                    </button>
                  </div>

                  {/* Dynamic Inputs */}
                  {footerPoweredByType === 'text' ? (
                    <div style={{ marginTop: '8px' }}>
                      <input 
                        type="text" 
                        className="gs-underline-input"
                        value={footerPoweredByText}
                        onChange={(e) => setFooterPoweredByText(e.target.value)}
                        placeholder="Powered By Text"
                      />
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, marginTop: '8px' }}>
                      {/* Dashed upload area */}
                      <div 
                        className="gs-iphone-dropzone"
                        onClick={() => footerFileInputRef.current?.click()}
                        style={{ 
                          border: '1.5px dashed rgba(255, 255, 255, 0.25)', 
                          borderRadius: '20px', 
                          padding: '24px 16px', 
                          display: 'flex', 
                          flexDirection: 'column',
                          justifyContent: 'center', 
                          alignItems: 'center',
                          cursor: 'pointer',
                          background: 'rgba(255, 255, 255, 0.03)',
                        }}
                      >
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #e0f2fe 0%, #38bdf8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                          <Upload size={20} color="#0284c7" />
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>Choose image</span>
                      </div>
                      <input
                        ref={footerFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFooterImageUpload}
                        style={{ display: 'none' }}
                      />

                      {/* Uploaded image preview */}
                      {footerPoweredByImage && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(50, 53, 62, 0.85)', borderRadius: '16px', padding: '12px 16px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img src={footerPoweredByImage} alt="Uploaded Preview" style={{ height: '36px', width: '36px', objectFit: 'contain', borderRadius: '6px' }} />
                            <span style={{ fontSize: '13.5px', color: '#ffffff', fontWeight: 600 }}>Uploaded image</span>
                          </div>
                          <button type="button" onClick={() => {
                            setFooterPoweredByImage('');
                            if (footerFileInputRef.current) footerFileInputRef.current.value = '';
                          }} style={{ background: '#ffffff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111', fontWeight: 700 }}>
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Right Card: Footer Settings */}
                <div className="gs-config-card" style={{ background: '#282a30', borderRadius: '28px', padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '24px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ fontSize: '22px', fontWeight: 400, color: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                    Footer Settings
                  </div>

                  {/* Row 1: Footer Visibility */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.85)', fontWeight: 500 }}>Footer Visibility</span>
                    <AppleToggle checked={footerVisible} onChange={setFooterVisible} />
                  </div>

                  <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }} />

                  {/* Row 2: Copyright Text */}
                  <div>
                    <input 
                      type="text" 
                      className="gs-underline-input"
                      value={copyrightText} 
                      onChange={(e) => setCopyrightText(e.target.value)}
                      placeholder="Copyright Text"
                    />
                  </div>

                  <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }} />

                  {/* Row 3: Add Footer Link */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.85)', fontWeight: 500 }}>Footer Links</span>
                    <button 
                      type="button"
                      onClick={() => setIsAddingLink(true)}
                      style={{
                        padding: '6px 16px',
                        background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '14px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      + ADD LINK
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Sidebar Config Panel */}
          {activeTab === 'sidebar' && (
            <div className="gs-tab-content-container" style={{ padding: '24px 32px' }}>
              <div className="gs-cards-2x2">
                
                {/* Behavior Card */}
                <div className="gs-config-card" style={{ background: '#282a30', borderRadius: '28px', padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ fontSize: '22px', fontWeight: 400, color: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                    Sidebar Behavior
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(255, 255, 255, 0.85)' }}>Start Expanded</span>
                      <AppleToggle checked={startExpanded} onChange={setStartExpanded} />
                    </div>
                    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }} />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(255, 255, 255, 0.85)' }}>Auto Hide Sidebar</span>
                      <AppleToggle checked={autoHideSidebar} onChange={setAutoHideSidebar} />
                    </div>
                    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }} />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(255, 255, 255, 0.85)' }}>Show Icons</span>
                      <AppleToggle checked={showIcons} onChange={setShowIcons} />
                    </div>
                    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }} />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(255, 255, 255, 0.85)' }}>Show Labels</span>
                      <AppleToggle checked={showLabels} onChange={setShowLabels} />
                    </div>
                  </div>
                </div>

                {/* Width Configuration Card */}
                <div className="gs-config-card" style={{ background: '#282a30', borderRadius: '28px', padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '24px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ fontSize: '22px', fontWeight: 400, color: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                    Sidebar Dimensions
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'rgba(255, 255, 255, 0.85)', marginBottom: '8px' }}>
                        <span>Expanded Width</span>
                        <span style={{ fontWeight: 700 }}>{expandedWidth}px</span>
                      </div>
                      <input 
                        type="range" 
                        min="180" 
                        max="300" 
                        value={expandedWidth} 
                        onChange={e => setExpandedWidth(Number(e.target.value))} 
                        style={{ width: '100%', cursor: 'pointer', accentColor: '#1d4ed8' }}
                      />
                    </div>

                    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }} />

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'rgba(255, 255, 255, 0.85)', marginBottom: '8px' }}>
                        <span>Collapsed Width</span>
                        <span style={{ fontWeight: 700 }}>{collapsedWidth}px</span>
                      </div>
                      <input 
                        type="range" 
                        min="50" 
                        max="90" 
                        value={collapsedWidth} 
                        onChange={e => setCollapsedWidth(Number(e.target.value))} 
                        style={{ width: '100%', cursor: 'pointer', accentColor: '#1d4ed8' }}
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Customer Profile Config Panel */}
          {activeTab === 'profile' && (
            <div className="gs-tab-content-container" style={{ padding: '24px 32px' }}>
              <div className="gs-cards-2x2">
                
                {/* Left Card: Customer Logo */}
                <div className="gs-config-card" style={{ background: '#282a30', borderRadius: '28px', padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ fontSize: '22px', fontWeight: 400, color: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                    Customer Logo
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
                    <div 
                      className="gs-iphone-dropzone"
                      onClick={() => customerLogoInputRef.current?.click()}
                      style={{ 
                        borderRadius: '20px', 
                        padding: '24px 16px', 
                        display: 'flex', 
                        flexDirection: 'column',
                        justifyContent: 'center', 
                        alignItems: 'center',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1.5px dashed rgba(255, 255, 255, 0.25)',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #e0f2fe 0%, #38bdf8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                        <Upload size={20} color="#0284c7" />
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>Choose customer logo</span>
                    </div>
                    <input
                      ref={customerLogoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleCustomerLogoUpload}
                      style={{ display: 'none' }}
                    />

                    {customerLogo && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(50, 53, 62, 0.85)', borderRadius: '16px', padding: '12px 16px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img src={customerLogo} alt="Uploaded Preview" style={{ height: '36px', width: '36px', objectFit: 'contain', borderRadius: '6px' }} />
                          <span style={{ fontSize: '13.5px', color: '#ffffff', fontWeight: 600 }}>Uploaded image</span>
                        </div>
                        <button type="button" onClick={() => {
                          setCustomerLogo('');
                          if (customerLogoInputRef.current) customerLogoInputRef.current.value = '';
                        }} style={{ background: '#ffffff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111', fontWeight: 700 }}>
                          ×
                        </button>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', borderTop: '1px solid rgba(255, 255, 255, 0.12)', paddingTop: '14px' }}>
                    <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.85)', fontWeight: 500 }}>Show Customer Logo</span>
                    <AppleToggle checked={showCustomerLogo} onChange={setShowCustomerLogo} />
                  </div>
                </div>

                {/* Right Card: Customer Profile Visibility */}
                <div className="gs-config-card" style={{ background: '#282a30', borderRadius: '28px', padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '24px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ fontSize: '22px', fontWeight: 400, color: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                    Customer Profile Visibility
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
                    {/* Minimal Underline Input Line */}
                    <div>
                      <input 
                        type="text" 
                        className="gs-underline-input"
                        value={customerName} 
                        onChange={e => setCustomerName(e.target.value)} 
                        placeholder="Customer Name"
                      />
                    </div>

                    {/* Controls Row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                      {/* Style Dropdown */}
                      <select
                        value={customerNameStyle}
                        onChange={(e) => setCustomerNameStyle(e.target.value)}
                        style={{
                          width: '58px',
                          height: '32px',
                          borderRadius: '16px',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          fontSize: '13px',
                          fontWeight: 500,
                          padding: '0 8px',
                          backgroundColor: '#3c3f47',
                          color: '#ffffff',
                          cursor: 'pointer',
                          outline: 'none'
                        }}
                      >
                        <option value="h1">H1</option>
                        <option value="h2">H2</option>
                        <option value="h3">H3</option>
                        <option value="h4">H4</option>
                      </select>

                      {/* Color Swatch */}
                      <div style={{ position: 'relative' }}>
                        <div
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            background: customerNameColor ? customerNameColor : 'radial-gradient(circle at 40% 40%, #051937, #000814)',
                            border: '1.5px solid rgba(255, 255, 255, 0.6)',
                            cursor: 'pointer',
                            boxShadow: '0 0 10px rgba(255, 255, 255, 0.15)'
                          }}
                          onClick={() => document.getElementById('gs-color-picker-customer')?.click()}
                        />
                        <input
                          id="gs-color-picker-customer"
                          type="color"
                          value={customerNameColor || '#ffffff'}
                          onChange={(e) => setCustomerNameColor(e.target.value)}
                          style={{ position: 'absolute', opacity: 0, width: 0, height: 0, top: 0, left: 0 }}
                        />
                      </div>

                      {/* Right Toggle */}
                      <AppleToggle checked={showCustomerProfile} onChange={setShowCustomerProfile} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', borderTop: '1px solid rgba(255, 255, 255, 0.12)', paddingTop: '14px' }}>
                    <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.85)', fontWeight: 500 }}>Text Color matches theme</span>
                    <AppleToggle checked={customerColorFollow} onChange={setCustomerColorFollow} />
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* BOTTOM STICKY FOOTER */}
        <div className="gs-footer">
          <div style={{ flex: 1 }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <button 
                className="gs-icon-btn" 
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                onBlur={() => setTimeout(() => setIsMoreMenuOpen(false), 200)}
              >
                <MoreVertical size={18} />
              </button>
              {isMoreMenuOpen && (
                <div style={{
                  position: 'absolute',
                  bottom: '100%',
                  left: 0,
                  marginBottom: '8px',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 -4px 12px rgba(0,0,0,0.1)',
                  padding: '4px',
                  display: 'flex',
                  gap: '4px',
                  zIndex: 50
                }}>
                  <button className="gs-icon-btn" title="Export Settings" onClick={handleExportSettings}>
                    <Download size={18} />
                  </button>
                  <button className="gs-icon-btn" title="Import Settings" onClick={handleImportSettings}>
                    <Upload size={18} />
                  </button>
                  <button className="gs-icon-btn" title="Reset to defaults" onClick={handleResetToDefaults}>
                    <RotateCcw size={18} color="#ef4444" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
);
}
