import { useState, useEffect } from 'react';
import { User, Lock, Camera, Shield, Calendar, Clock, MapPin, Check, Globe } from 'lucide-react';
import './ProfileStyles.css';

interface ProfileTabProps {
  setHasUnsavedChanges?: (value: boolean) => void;
}

export function ProfileTab({ setHasUnsavedChanges }: ProfileTabProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Form State
  const initialData = {
    fullName: 'John Doe',
    phone: '',
    bio: ''
  };
  
  const [formData, setFormData] = useState(initialData);
  const [isDirty, setIsDirty] = useState(false);

  // Dynamic Profile Completion
  const getCompletionState = () => {
    let score = 50; // Base score for Name and Email (read-only)
    const checklist = [];
    
    if (formData.phone.trim().length > 0) {
      score += 25;
      checklist.push({ label: 'Add Phone Number', done: true });
    } else {
      checklist.push({ label: 'Add Phone Number', done: false });
    }
    
    if (formData.bio.trim().length > 0) {
      score += 25;
      checklist.push({ label: 'Add Bio', done: true });
    } else {
      checklist.push({ label: 'Add Bio', done: false });
    }

    return { score, checklist };
  };

  const { score, checklist } = getCompletionState();

  useEffect(() => {
    const dirty = formData.fullName !== initialData.fullName ||
                  formData.phone !== initialData.phone ||
                  formData.bio !== initialData.bio;
    setIsDirty(dirty);
    if (setHasUnsavedChanges) {
      setHasUnsavedChanges(dirty);
    }
  }, [formData]);

  // Handle BeforeUnload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDiscard = () => {
    if (window.confirm("Are you sure you want to discard your changes?")) {
      setFormData(initialData);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsDirty(false);
      if (setHasUnsavedChanges) setHasUnsavedChanges(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      
      // Update initialData in a real app here
    }, 800);
  };

  return (
    <div className="settings-grid">
      {/* Toast Notification */}
      {showToast && (
        <div className="toast-success">
          <Check size={16} /> Changes saved successfully.
        </div>
      )}

      {/* Left Column - Profile Summary */}
      <div className="content-column">
        <div className="settings-card" style={{ padding: '24px' }}>
          
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar">JD</div>
            <button className="avatar-edit-btn" title="Upload new photo">
              <Camera size={16} />
            </button>
          </div>
          
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '4px' }}>{formData.fullName || 'John Doe'}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>Senior Analyst • Operations</p>
            
            <div className="status-indicator-primary">
              <div className="status-dot-online"></div>
              Online
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '12px' }}>
              <span className="badge badge-secondary-subtle">Admin</span>
              <span className="badge badge-secondary-subtle">Verified</span>
            </div>
          </div>

          <div className="profile-completion">
            <div className="completion-header">
              <span style={{ fontWeight: 600 }}>Profile Completion</span>
              <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{score}%</span>
            </div>
            <div className="completion-bar-bg">
              <div className="completion-bar-fill" style={{ width: `${score}%` }}></div>
            </div>
            <div className="completion-checklist">
              {checklist.map((item, idx) => (
                <div key={idx} className={`checklist-item ${item.done ? 'done' : ''}`}>
                  <div className="checklist-icon">{item.done ? <Check size={12} /> : <div className="circle-empty" />}</div>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Account Information Card */}
        <div className="settings-card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div className="settings-card-header">
            <div className="settings-info-icon"><Shield size={16} /></div>
            <div className="settings-card-title">Account Information</div>
          </div>
          
          <div className="kv-list">
            <div className="kv-item">
              <div className="kv-key"><Calendar size={14} color="#3b82f6" /> Member Since</div>
              <div className="kv-val">Jan 15, 2024</div>
            </div>
            <div className="kv-item">
              <div className="kv-key"><Clock size={14} color="#f59e0b" /> Last Login</div>
              <div className="kv-val">Just now</div>
            </div>
            <div className="kv-item">
              <div className="kv-key"><MapPin size={14} color="#10b981" /> Region</div>
              <div className="kv-val">United States</div>
            </div>
            <div className="kv-item" style={{ borderBottom: 'none' }}>
              <div className="kv-key"><Globe size={14} color="#8b5cf6" /> Language</div>
              <div className="kv-val">English (US)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="content-column">
        <div className="tw-parent-card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, marginTop: 0 }}>
          
          {/* Header Card */}
          <div className="settings-card" style={{ padding: '12px 16px', marginBottom: 0 }}>
            <div className="settings-card-header" style={{ marginBottom: 0 }}>
              <div className="settings-info-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                <User size={16} />
              </div>
              <div>
                <div className="settings-card-title" style={{ fontSize: '1.2rem' }}>Personal Information</div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>Update your personal details and public profile</div>
              </div>
            </div>
          </div>

          {/* Form Container Card Removed */}
            
            {/* Basic Details Box */}
            <div className="settings-card" style={{ padding: '20px' }}>
              <div className="form-group-title" style={{ marginTop: 0, marginBottom: '8px', paddingBottom: 0, borderBottom: 'none' }}>Basic Details</div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" name="fullName" className="form-input" value={formData.fullName} onChange={handleChange} placeholder="e.g. Jane Doe" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div className="input-with-icon readonly">
                    <input type="email" className="form-input" defaultValue="test@gmail.com" readOnly disabled />
                    <Lock size={16} className="input-icon-right" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input type="tel" name="phone" className="form-input" value={formData.phone} onChange={handleChange} placeholder="Add phone number" />
                </div>
              </div>
            </div>

            {/* Work Info Box */}
            <div className="settings-card" style={{ padding: '20px' }}>
              <div className="form-group-title" style={{ marginTop: 0, marginBottom: '8px', paddingBottom: 0, borderBottom: 'none' }}>Work Information</div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Organization</label>
                  <div className="input-with-icon readonly">
                    <input type="text" className="form-input" defaultValue="Acme Corp" readOnly disabled />
                    <Lock size={16} className="input-icon-right" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <div className="input-with-icon readonly">
                    <input type="text" className="form-input" defaultValue="Operations" readOnly disabled />
                    <Lock size={16} className="input-icon-right" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Job Title</label>
                  <div className="input-with-icon readonly">
                    <input type="text" className="form-input" defaultValue="Senior Analyst" readOnly disabled />
                    <Lock size={16} className="input-icon-right" />
                  </div>
                </div>
              </div>
            </div>

            {/* Public Profile Box */}
            <div className="settings-card" style={{ padding: '20px' }}>
              <div className="form-group-title" style={{ marginTop: 0, marginBottom: '8px', paddingBottom: 0, borderBottom: 'none' }}>Public Profile</div>

              <div className="form-group">
                <label className="form-label">Bio</label>
                <div className="textarea-wrapper">
                  <textarea 
                    className="form-input" 
                    name="bio"
                    placeholder="Write a short bio about yourself..." 
                    value={formData.bio}
                    onChange={handleChange}
                    maxLength={200}
                    rows={2}
                  ></textarea>
                  <div className="char-counter">
                    {formData.bio.length} / 200
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', alignItems: 'center', paddingTop: '8px' }}>
              {isDirty && (
                <button className="btn btn-secondary" onClick={handleDiscard}>Discard</button>
              )}
              {!isDirty && <div style={{ flex: 1 }}></div>}
              <button 
                className="btn btn-primary" 
                onClick={handleSave} 
                disabled={isSaving || !isDirty} 
                style={{ minWidth: '120px', justifyContent: 'center', opacity: (!isDirty && !isSaving) ? 0.6 : 1 }}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
        </div>
      </div>
    </div>
  );
}
