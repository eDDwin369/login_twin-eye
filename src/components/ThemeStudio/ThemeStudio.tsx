import { useState, useEffect, useCallback } from 'react';
import {
  X, RotateCcw, Upload, Download, Check, Sun, Moon,
  Palette, ChevronDown
} from 'lucide-react';
import './ThemeStudio.css';
import './ThemeStudioAccordion.css';

interface ThemeStudioProps {
  onClose: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
}

type ThemeName = 'corporate-blue' | 'emerald' | 'indigo-violet' | 'graphite' | 'ocean-teal' | 'amber';
type Mode = 'light' | 'dark';
type Screen = string;

const THEMES: { id: ThemeName; label: string }[] = [
  { id: 'corporate-blue',  label: 'Corporate Blue' },
  { id: 'emerald',         label: 'Emerald' },
  { id: 'indigo-violet',   label: 'Indigo Violet' },
  { id: 'graphite',        label: 'Graphite' },
  { id: 'ocean-teal',      label: 'Ocean Teal' },
  { id: 'amber',           label: 'Amber' },
];

const SCREEN_GROUPS: { label: string; screens: Screen[] }[] = [
  { label: 'Auth', screens: ['Login', 'Form'] },
  { label: 'App', screens: ['Dashboard', 'Operations', 'Cameras', 'Reports', 'Orders'] },
  { label: 'Config', screens: ['Settings', 'Components'] },
];



export function ThemeStudio({ onClose, currentView, onNavigate }: ThemeStudioProps) {
  const [activeTheme, setActiveTheme] = useState<ThemeName>('amber');
  const [mode, setMode] = useState<Mode>('light');
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>('theme-mode');

  // Map dashboard route to screen name for the UI
  const getScreenFromView = (view: string) => {
    if (view === 'overview') return 'Dashboard';
    const mapping: Record<string, string> = {
      'operations': 'Operations',
      'cameras': 'Cameras',
      'reports': 'Reports',
      'orders': 'Orders',
      'settings': 'Settings',
      'components': 'Components',
      'login': 'Login',
      'form': 'Form'
    };
    return mapping[view] || 'Dashboard';
  };

  const activeScreen = getScreenFromView(currentView);

  const handleScreenSelect = (screen: Screen) => {
    let route = screen.toLowerCase();
    if (route === 'dashboard') route = 'overview';
    onNavigate(route);
  };

  // Close on Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleReset = () => {
    setActiveTheme('amber');
    setMode('light');
    onNavigate('overview');
  };

  // Apply theme to document globally for live preview
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', activeTheme);
    document.documentElement.setAttribute('data-theme-mode', mode);
  }, [activeTheme, mode]);

  return (
    <div className="ts-panel" onClick={e => e.stopPropagation()}>

      {/* HEADER */}
        <div className="ts-header">
          <div className="ts-header-left">
            <div className="ts-logo-badge">
              <Palette size={16} color="#fff" />
            </div>
            <div className="ts-title-group">
              <span className="ts-title">ThemeKit Studio</span>
              <span className="ts-subtitle">{THEMES.find(t => t.id === activeTheme)?.label}</span>
            </div>
          </div>
          <button className="ts-close-btn" onClick={onClose} title="Close (Esc)">
            <X size={14} />
          </button>
        </div>

        {/* ACTION BAR */}
        <div className="ts-action-bar">
          <button className="ts-action-btn reset" onClick={handleReset}>
            <RotateCcw size={12} /> RESET
          </button>
          <button className="ts-action-btn import">
            <Upload size={12} /> IMPORT
          </button>
          <button className="ts-action-btn export">
            <Download size={12} /> EXPORT
          </button>
        </div>

        {/* BODY */}
        <div className="ts-body">

          {/* ── PREVIEWING SCREEN ── */}
          <div className="ts-section">
              <div className="ts-section-header">
                <span className="ts-section-label">Previewing Screen</span>
                <span className="ts-section-meta">{activeScreen}</span>
              </div>
              {SCREEN_GROUPS.map(group => (
                <div key={group.label} className="ts-screen-group">
                  <div className="ts-screen-group-label">{group.label}</div>
                  <div className="ts-screen-grid">
                    {group.screens.map(screen => (
                      <button
                        key={screen}
                        className={`ts-screen-btn ${activeScreen === screen ? 'active' : ''}`}
                        onClick={() => handleScreenSelect(screen)}
                      >
                        {screen}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="ts-accordion-list">
              {/* Accordion 1: Theme & Mode */}
              <div className={`ts-accordion-item ${expandedAccordion === 'theme-mode' ? 'expanded' : ''}`}>
                <button 
                  className="ts-accordion-header" 
                  onClick={() => setExpandedAccordion(expandedAccordion === 'theme-mode' ? null : 'theme-mode')}
                >
                  <div className="ts-accordion-header-left">
                    <span className="ts-accordion-title">Theme & Mode</span>
                    <span className="ts-accordion-meta">{THEMES.find(t => t.id === activeTheme)?.label} · {mode === 'light' ? 'Light' : 'Dark'}</span>
                  </div>
                  <ChevronDown size={16} className="ts-accordion-icon" />
                </button>
                {expandedAccordion === 'theme-mode' && (
                  <div className="ts-accordion-content">
                    <div style={{ marginBottom: 'var(--spacing-3)' }}>
                      <div className="ts-screen-group-label" style={{ marginBottom: 'var(--spacing-2)' }}>Preset Themes</div>
                      <div className="ts-theme-grid">
                        {THEMES.map(theme => (
                          <button
                            key={theme.id}
                            data-theme={theme.id}
                            className={`ts-theme-pill ${activeTheme === theme.id ? 'active' : ''}`}
                            onClick={() => setActiveTheme(theme.id)}
                          >
                            <div className="ts-theme-swatch" />
                            <span className="ts-theme-name">{theme.label}</span>
                            {activeTheme === theme.id && (
                              <Check size={12} className="ts-theme-active-check" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="ts-screen-group-label" style={{ marginBottom: 'var(--spacing-2)' }}>Mode</div>
                      <div className="ts-mode-toggle">
                        <button
                          className={`ts-mode-btn ${mode === 'light' ? 'active' : ''}`}
                          onClick={() => setMode('light')}
                        >
                          <Sun size={14} /> Light
                        </button>
                        <button
                          className={`ts-mode-btn ${mode === 'dark' ? 'active' : ''}`}
                          onClick={() => setMode('dark')}
                        >
                          <Moon size={14} /> Dark
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 2: Brand & Logo */}
              <div className={`ts-accordion-item ${expandedAccordion === 'brand-logo' ? 'expanded' : ''}`}>
                <button 
                  className="ts-accordion-header" 
                  onClick={() => setExpandedAccordion(expandedAccordion === 'brand-logo' ? null : 'brand-logo')}
                >
                  <div className="ts-accordion-header-left">
                    <span className="ts-accordion-title">Brand & Logo</span>
                    <span className="ts-accordion-meta">Nexus ERP</span>
                  </div>
                  <ChevronDown size={16} className="ts-accordion-icon" />
                </button>
              </div>

              {/* Accordion 3: Typography */}
              <div className={`ts-accordion-item ${expandedAccordion === 'typography' ? 'expanded' : ''}`}>
                <button 
                  className="ts-accordion-header" 
                  onClick={() => setExpandedAccordion(expandedAccordion === 'typography' ? null : 'typography')}
                >
                  <div className="ts-accordion-header-left">
                    <span className="ts-accordion-title">Typography</span>
                    <span className="ts-accordion-meta">Roboto · Default</span>
                  </div>
                  <ChevronDown size={16} className="ts-accordion-icon" />
                </button>
              </div>

              {/* Accordion 4: Surface, Cards & Shape */}
              <div className={`ts-accordion-item ${expandedAccordion === 'surface' ? 'expanded' : ''}`}>
                <button 
                  className="ts-accordion-header" 
                  onClick={() => setExpandedAccordion(expandedAccordion === 'surface' ? null : 'surface')}
                >
                  <div className="ts-accordion-header-left">
                    <span className="ts-accordion-title">Surface, Cards & Shape</span>
                    <span className="ts-accordion-meta">Rounded · Default</span>
                  </div>
                  <ChevronDown size={16} className="ts-accordion-icon" />
                </button>
              </div>

              {/* Accordion 5: Notifications */}
              <div className={`ts-accordion-item ${expandedAccordion === 'notifications' ? 'expanded' : ''}`}>
                <button 
                  className="ts-accordion-header" 
                  onClick={() => setExpandedAccordion(expandedAccordion === 'notifications' ? null : 'notifications')}
                >
                  <div className="ts-accordion-header-left">
                    <span className="ts-accordion-title">Notifications</span>
                    <span className="ts-accordion-meta">Top Right · toast</span>
                  </div>
                  <ChevronDown size={16} className="ts-accordion-icon" />
                </button>
              </div>

              {/* Accordion 6: Login Screen */}
              <div className={`ts-accordion-item ${expandedAccordion === 'login' ? 'expanded' : ''}`}>
                <button 
                  className="ts-accordion-header" 
                  onClick={() => setExpandedAccordion(expandedAccordion === 'login' ? null : 'login')}
                >
                  <div className="ts-accordion-header-left">
                    <span className="ts-accordion-title">Login Screen</span>
                    <span className="ts-accordion-meta">Split Brand</span>
                  </div>
                  <ChevronDown size={16} className="ts-accordion-icon" />
                </button>
              </div>

            </div>

        </div>

        {/* FOOTER */}
        <div className="ts-footer">
          <button className="ts-done-btn" style={{ backgroundColor: '#2b3944', padding: '14px' }} onClick={onClose}>
            <Check size={16} /> DONE — BACK TO APP
          </button>
        </div>

      </div>
  );
}
