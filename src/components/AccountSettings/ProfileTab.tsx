import React, { useState } from 'react';
import { User, Mail, Phone, Building2, CheckCircle2, Camera, Calendar, Clock, Globe2, MapPin, ShieldCheck, Key, Shield } from 'lucide-react';
import './ProfileStyles.css';

export function ProfileTab() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 800);
  };

  return (
    <div className="settings-grid">
      {/* Left Column - Profile Summary */}
      <div className="content-column">
        <div className="settings-card" style={{ padding: '32px 24px' }}>
          
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar">JD</div>
            <button className="avatar-edit-btn" title="Upload new photo">
              <Camera size={16} />
            </button>
          </div>
          
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '4px' }}>John Doe</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '12px' }}>Senior Analyst • Operations</p>
            
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '16px' }}>
              <span className="badge badge-primary">Admin</span>
              <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={12} /> Verified
              </span>
            </div>

            <div className="status-indicator">
              <div className="status-dot"></div>
              Online
            </div>
          </div>

          <div className="profile-completion">
            <div className="completion-header">
              <span>Profile Completion</span>
              <span style={{ color: 'var(--primary)' }}>85%</span>
            </div>
            <div className="completion-bar-bg">
              <div className="completion-bar-fill"></div>
            </div>
          </div>

          <div className="info-row-list">
            <div className="info-row">
              <div className="info-icon-box" style={{ color: 'var(--success)' }}><Mail size={16} /></div>
              <div className="info-content">
                <div className="info-label">Email</div>
                <div className="info-value">test@gmail.com</div>
              </div>
            </div>
            <div className="info-row">
              <div className="info-icon-box" style={{ color: 'var(--warning)' }}><Phone size={16} /></div>
              <div className="info-content">
                <div className="info-label">Phone</div>
                <div className="info-value" style={{ color: 'var(--text-muted)' }}>Not provided</div>
              </div>
            </div>
            <div className="info-row">
              <div className="info-icon-box" style={{ color: 'var(--primary)' }}><Building2 size={16} /></div>
              <div className="info-content">
                <div className="info-label">Organization</div>
                <div className="info-value">Acme Corp</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Account Information Card */}
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-info-icon"><Shield size={16} /></div>
            <div className="settings-card-title">Account Information</div>
          </div>
          
          <div className="kv-list">
            <div className="kv-item">
              <div className="kv-key"><Calendar size={14} /> Member Since</div>
              <div className="kv-val">Jan 15, 2024</div>
            </div>
            <div className="kv-item">
              <div className="kv-key"><Clock size={14} /> Last Login</div>
              <div className="kv-val">Just now</div>
            </div>
            <div className="kv-item">
              <div className="kv-key"><Globe2 size={14} /> Timezone</div>
              <div className="kv-val">UTC</div>
            </div>
            <div className="kv-item">
              <div className="kv-key"><MapPin size={14} /> Region</div>
              <div className="kv-val">United States</div>
            </div>
            <div className="kv-item">
              <div className="kv-key"><ShieldCheck size={14} /> Account Status</div>
              <div className="kv-val" style={{ color: 'var(--success)' }}>Active</div>
            </div>
            <div className="kv-item">
              <div className="kv-key"><Key size={14} /> 2FA Status</div>
              <div className="kv-val" style={{ color: 'var(--text-muted)' }}>Disabled</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="content-column">
        <div className="settings-card" style={{ position: 'relative', overflow: 'hidden', padding: '32px' }}>
          <div className="settings-card-header" style={{ marginBottom: '32px' }}>
            <div className="settings-info-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
              <User size={16} />
            </div>
            <div>
              <div className="settings-card-title">Personal Information</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Update your personal details and public profile</div>
            </div>
          </div>

          <div className="form-group-title">Basic Details</div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" defaultValue="John Doe" placeholder="e.g. Jane Doe" />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" defaultValue="test@gmail.com" readOnly />
              <div className="form-hint">Email cannot be changed. Contact support if needed.</div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input type="tel" className="form-input" placeholder="+1 (555) 000-0000" />
            </div>
          </div>

          <div className="form-group-title" style={{ marginTop: '32px' }}>Work Information</div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Organization</label>
              <input type="text" className="form-input" defaultValue="Acme Corp" placeholder="e.g. Acme Corp" />
            </div>
            <div className="form-group">
              <label className="form-label">Department</label>
              <input type="text" className="form-input" defaultValue="Operations" placeholder="e.g. Engineering" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Job Title</label>
              <input type="text" className="form-input" defaultValue="Senior Analyst" placeholder="e.g. Product Manager" />
            </div>
          </div>

          <div className="form-group-title" style={{ marginTop: '32px' }}>Public Profile</div>

          <div className="form-group">
            <label className="form-label">Bio</label>
            <textarea className="form-input" placeholder="Write a short bio about yourself..." defaultValue=""></textarea>
            <div className="form-hint" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Brief description for your profile.</span>
              <span>0 / 200</span>
            </div>
          </div>

          <div className="sticky-footer">
            <button className="btn btn-secondary">Discard</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={isSaving} style={{ minWidth: '120px', justifyContent: 'center' }}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
