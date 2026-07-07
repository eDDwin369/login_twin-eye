import { 
  CheckCircle2, 
  Settings2, 
  Palette, 
  Rocket,
  Info,
  Lightbulb,
  LayoutDashboard,
  Settings,
  User,
  Bell,
  Wand2,
  ArrowRight
} from 'lucide-react';
import './Dashboard.css';

interface TemplateWelcomeProps {
  onNavigate?: (view: string) => void;
}

export function TemplateWelcome({ onNavigate }: TemplateWelcomeProps) {
  return (
    <div className="template-welcome dashboard-fade-in">
      {/* Hero Header */}
      <div className="tw-header">
        <div className="tw-title-row">
          <h1 className="tw-brand">MyProduct</h1>
          <div className="tw-badge">
            <CheckCircle2 size={16} />
            <span>Template Active</span>
          </div>
        </div>
        <p className="tw-subtitle">
          Your project template is ready. Replace this page with your product's main view.
        </p>
      </div>

      {/* Getting Started */}
      <div className="tw-section">
        <h2 className="tw-section-title">Getting started</h2>
        <div className="tw-grid-3">
          {/* Card 1 */}
          <div className="tw-card">
            <div className="tw-card-header">
              <div className="tw-icon-wrapper icon-blue">
                <Settings2 size={20} />
              </div>
              <h3>1. Configure branding</h3>
            </div>
            <p>
              Edit src/config/template.config.ts to set your app name, logo path, tagline, menu items, and footer text. This is the only file you need to change for basic branding.
            </p>
            <div className="tw-card-footer">
              <div className="tw-tag blue-tag">template.config.ts</div>
              <button className="tw-cta-btn">Configure <ArrowRight size={14} /></button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="tw-card">
            <div className="tw-card-header">
              <div className="tw-icon-wrapper icon-green">
                <Palette size={20} />
              </div>
              <h3>2. Choose your theme</h3>
            </div>
            <p>
              Click the sun/moon icon in the header to toggle between Professional Dark and Professional Light. Access the Theme page from the sidebar for the full OmniEye theme studio with all 4 brand themes.
            </p>
            <div className="tw-card-footer">
              <div className="tw-tag green-tag">4 OmniEye themes</div>
              <button className="tw-cta-btn">Open Studio <ArrowRight size={14} /></button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="tw-card">
            <div className="tw-card-header">
              <div className="tw-icon-wrapper icon-orange">
                <Rocket size={20} />
              </div>
              <h3>3. Build your content</h3>
            </div>
            <p>
              Replace this DashboardPage with your domain content. Add new routes in App.tsx and new menu items in template.config.ts. The entire shell — header, sidebar, footer — is already wired and ready.
            </p>
            <div className="tw-card-footer">
              <div className="tw-tag orange-tag">Zero configuration needed</div>
              <button className="tw-cta-btn">View Docs <ArrowRight size={14} /></button>
            </div>
          </div>
        </div>
      </div>

      {/* What's already built */}
      <div className="tw-feature-box">
        <div className="tw-feature-header">
          <Info size={18} className="tw-feature-icon" />
          <h3>What's already built</h3>
        </div>
        
        <div className="tw-grid-2">
          <div className="tw-feature-item">
            <div className="tw-feature-icon-wrapper"><Settings2 size={20} /></div>
            <div>
              <h4>Authentication</h4>
              <p>Login page · Forgot password (5-step OTP flow) · Mock auth with real API hooks</p>
            </div>
          </div>
          <div className="tw-feature-item">
            <div className="tw-feature-icon-wrapper"><LayoutDashboard size={20} /></div>
            <div>
              <h4>Layout Shell</h4>
              <p>Header · Collapsible sidebar · Footer · Notification dropdown · User menu</p>
            </div>
          </div>
          <div className="tw-feature-item">
            <div className="tw-feature-icon-wrapper"><Settings size={20} /></div>
            <div>
              <h4>Settings System</h4>
              <p>Global Settings dialog (6 tabs) · IndexedDB persistence · Export/Import · Live preview</p>
            </div>
          </div>
          <div className="tw-feature-item">
            <div className="tw-feature-icon-wrapper"><Palette size={20} /></div>
            <div>
              <h4>Theme Engine</h4>
              <p>4 OmniEye brand themes · @nithishdts001/theme-engine · Token-based colours · Full ThemeStudio</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="tw-section">
        <h2 className="tw-section-title" style={{ fontSize: '1.1rem' }}>Quick navigation</h2>
        <div className="tw-nav-pills">
          <button className="tw-pill" onClick={() => onNavigate?.('overview')}>
            <LayoutDashboard size={16} /> DASHBOARD
          </button>
          <button className="tw-pill" onClick={() => onNavigate?.('account')}>
            <Settings size={16} /> SETTINGS
          </button>
          <button className="tw-pill">
            <User size={16} /> PROFILE
          </button>
          <button className="tw-pill" onClick={() => onNavigate?.('notifications')}>
            <Bell size={16} /> NOTIFICATIONS
          </button>
          <button className="tw-pill">
            <Wand2 size={16} /> THEME STUDIO
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="tw-footer-box">
        <div className="tw-footer-header">
          <Lightbulb size={18} className="tw-footer-icon" />
          <h4>Built with Figma Make</h4>
        </div>
        <p>
          This template was built prompt-by-prompt using Figma Make. All components use 100% Material UI v5 — zero Tailwind, zero Radix. Powered by @nithishdts001/theme-engine for full OmniEye brand theming.
        </p>
      </div>

    </div>
  );
}
