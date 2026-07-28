import { useState } from 'react';
import { 
  Bell, Mail, Volume2 
} from 'lucide-react';

export function NotificationsTab() {
  // Toggle states
  const [emailSecurity, setEmailSecurity] = useState(true);
  const [emailActivity, setEmailActivity] = useState(true);
  const [emailMarketing, setEmailMarketing] = useState(false);
  
  const [pushDirectMessage, setPushDirectMessage] = useState(true);
  const [pushMention, setPushMention] = useState(true);
  const [pushSystemAlert, setPushSystemAlert] = useState(true);

  const [soundEnabled, setSoundEnabled] = useState(false);
  const [frequency, setFrequency] = useState('immediate');

  // Apple-style toggle switch component
  const AppleToggle = ({ 
    checked, 
    onChange, 
    disabled 
  }: { 
    checked: boolean; 
    onChange?: (val: boolean) => void; 
    disabled?: boolean; 
  }) => {
    return (
      <button
        type="button"
        onClick={() => {
          if (!disabled && onChange) onChange(!checked);
        }}
        style={{
          position: 'relative',
          width: '42px',
          height: '24px',
          borderRadius: '9999px',
          backgroundColor: checked ? '#22c55e' : '#cbd5e1',
          border: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.2s ease',
          padding: 0,
          opacity: disabled ? 0.8 : 1,
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Email Notifications Card */}
      <div className="profile-card" style={{ padding: '24px', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            color: '#3b82f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Mail size={18} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>Email Notifications</h3>
            <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>Configure what emails you want to receive</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Item 1 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155' }}>Security alerts</span>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Get notified about logins, password changes and MFA alerts.</span>
            </div>
            <AppleToggle checked={emailSecurity} onChange={setEmailSecurity} />
          </div>

          <div style={{ borderBottom: '1px solid #f1f5f9' }} />

          {/* Item 2 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155' }}>Account activity</span>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Receive updates on workspace updates and team activity.</span>
            </div>
            <AppleToggle checked={emailActivity} onChange={setEmailActivity} />
          </div>

          <div style={{ borderBottom: '1px solid #f1f5f9' }} />

          {/* Item 3 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155' }}>Marketing & Product updates</span>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Tips, features announcements, and general newsletter updates.</span>
            </div>
            <AppleToggle checked={emailMarketing} onChange={setEmailMarketing} />
          </div>
        </div>
      </div>

      {/* Push Notifications Card */}
      <div className="profile-card" style={{ padding: '24px', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
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
            <Bell size={18} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>In-App & Push Notifications</h3>
            <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>Configure desktop and dashboard alerts</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Item 1 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155' }}>Direct Messages</span>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Show alerts when team members message you directly.</span>
            </div>
            <AppleToggle checked={pushDirectMessage} onChange={setPushDirectMessage} />
          </div>

          <div style={{ borderBottom: '1px solid #f1f5f9' }} />

          {/* Item 2 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155' }}>Mentions & Replies</span>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Get notified when tagged inside reports or comment sections.</span>
            </div>
            <AppleToggle checked={pushMention} onChange={setPushMention} />
          </div>

          <div style={{ borderBottom: '1px solid #f1f5f9' }} />

          {/* Item 3 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155' }}>System alerts</span>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Realtime alert updates when system exceptions are logged.</span>
            </div>
            <AppleToggle checked={pushSystemAlert} onChange={setPushSystemAlert} />
          </div>
        </div>
      </div>

      {/* Advanced Sound and Frequency Card */}
      <div className="profile-card" style={{ padding: '24px', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            color: '#8b5cf6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Volume2 size={18} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>Sound & Frequency</h3>
            <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>Customize alerts delivery speed and sounds</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Dropdown 1 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155' }}>Digest Frequency</span>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Select how often you wish to receive system email digests.</span>
            </div>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '12px',
                color: '#334155',
                background: '#ffffff',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="immediate">Immediate</option>
              <option value="daily">Daily Digest</option>
              <option value="weekly">Weekly Summary</option>
            </select>
          </div>

          <div style={{ borderBottom: '1px solid #f1f5f9' }} />

          {/* Item 2 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155' }}>Notification Sound</span>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Play an alert chime sound whenever a new notification lands.</span>
            </div>
            <AppleToggle checked={soundEnabled} onChange={setSoundEnabled} />
          </div>
        </div>
      </div>
    </div>
  );
}
