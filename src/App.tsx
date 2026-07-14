import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight, ArrowLeft, CheckCircle2, XCircle, KeyRound, Check, HelpCircle, User, Info } from 'lucide-react';
import './index.css';
import logo from './assets/logo.png';
import gmailBg from './assets/gmail-bg.jpg';
import { Dashboard } from './components/Dashboard/Dashboard';

type Screen = 'login' | 'forgot-password' | 'otp' | 'new-password' | 'success' | 'dashboard' | 'forgot-username';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [showLanding, setShowLanding] = useState(true);

  // Shared state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [forgotEmailError, setForgotEmailError] = useState('');

  // Load saved credentials on mount
  useEffect(() => {
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true';
    setRememberMe(savedRememberMe);
    if (savedRememberMe) {
      const savedEmail = localStorage.getItem('email') || '';
      const savedPassword = localStorage.getItem('password') || '';
      setEmail(savedEmail);
      setPassword(savedPassword);
    }
  }, []);

  // OTP State
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [otpError, setOtpError] = useState('');
  const [otpAttempts, setOtpAttempts] = useState(0);

  // New Password State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isNewPasswordFocused, setIsNewPasswordFocused] = useState(false);

  // Handlers
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt', { email, password });
    
    if (rememberMe) {
      localStorage.setItem('rememberMe', 'true');
      localStorage.setItem('email', email);
      localStorage.setItem('password', password);
    } else {
      localStorage.removeItem('rememberMe');
      localStorage.removeItem('email');
      localStorage.removeItem('password');
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCurrentScreen('dashboard');
    }, 1000);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // Mock database check
    const savedEmail = localStorage.getItem('email');
    const mockDb = ['john.doe@acme.com', 'admin@company.com', 'test@example.com'];
    if (savedEmail) {
      mockDb.push(savedEmail.toLowerCase().trim());
    }

    setIsLoading(true);
    setForgotEmailError('');

    setTimeout(() => {
      setIsLoading(false);
      if (mockDb.includes(email.toLowerCase().trim())) {
        setCurrentScreen('otp');
        setTimeLeft(60);
        setOtp(['', '', '', '', '', '']);
        setOtpError('');
      } else {
        setForgotEmailError('This email address is not registered in our database.');
      }
    }, 1200);
  };

  // OTP Timer
  useEffect(() => {
    if (currentScreen === 'otp' && timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [currentScreen, timeLeft]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]*$/.test(value)) return;

    const newOtp = [...otp];
    // Take only the last character if multiple are entered
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    setOtpError('');

    // Auto-advance
    if (value && index < 5 && otpRefs.current[index + 1]) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Auto-retreat
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.slice(0, 6).split('');
    const newOtp = [...otp];

    for (let i = 0; i < digits.length; i++) {
      newOtp[i] = digits[i];
    }
    setOtp(newOtp);

    // Focus next empty or last input
    const focusIndex = Math.min(digits.length, 5);
    otpRefs.current[focusIndex === 6 ? 5 : focusIndex]?.focus();
  };

  const handleVerifyOtp = () => {
    const code = otp.join('');
    if (code.length !== 6) {
      setOtpError('Please enter a 6-digit code.');
      return;
    }

    if (otpAttempts >= 3) {
      setOtpError('Too many failed attempts. Please request a new code.');
      return;
    }

    if (timeLeft === 0) {
      setOtpError('Verification code expired.');
      return;
    }

    setIsLoading(true);
    // Simulate verification
    setTimeout(() => {
      setIsLoading(false);
      if (code === '123456') { // Mock correct OTP
        setCurrentScreen('new-password');
      } else {
        setOtpAttempts(prev => prev + 1);
        setOtpError('Invalid verification code.');
        setOtp(['', '', '', '', '', '']);
        otpRefs.current[0]?.focus();
      }
    }, 1500);
  };

  const handleResendOtp = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setTimeLeft(60);
      setOtp(['', '', '', '', '', '']);
      setOtpError('');
      setOtpAttempts(0);
    }, 1000);
  };

  // Password Validation
  const passwordReqs = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
  };
  const isPasswordValid = Object.values(passwordReqs).every(Boolean) && newPassword === confirmPassword;


  const handleCreateNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCurrentScreen('success');
    }, 1500);
  };

  const maskEmail = (email: string) => {
    if (!email) return '';
    const [name, domain] = email.split('@');
    if (!domain) return email;
    const maskedName = name.length > 2 ? `${name.substring(0, 2)}***` : `${name}***`;
    return `${maskedName}@${domain}`;
  };

  if (showLanding) {
    return (
      <div 
        className="landing-screen-container" 
        style={{ 
          background: '#f4f6f8',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          overflow: 'hidden',
        }}
        onClick={() => setShowLanding(false)}
      >
        <img 
          src={gmailBg} 
          alt="Welcome Email" 
          style={{ 
            maxWidth: '100vw', 
            maxHeight: '100vh', 
            objectFit: 'contain',
            transform: 'scale(1.25) translateZ(0)',
            backfaceVisibility: 'hidden',
            imageRendering: '-webkit-optimize-contrast',
            transition: 'transform 0.3s ease',
          }} 
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.28) translateZ(0)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1.25) translateZ(0)';
          }}
        />
      </div>
    );
  }

  const handleLogout = () => {
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true';
    if (!savedRememberMe) {
      setEmail('');
      setPassword('');
    }
    setCurrentScreen('login');
  };

  if (currentScreen === 'dashboard') {
    return <Dashboard onLogout={handleLogout} />;
  }

  return (
    <>
      <div className="ambient-glow"></div>

      <div className="login-container">
        {/* Left Side - Visual Branding */}
        <div className="visual-panel">
        </div>

        {/* Right Side - Dynamic Forms */}
        <div className="form-panel">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
            <img src={logo} alt="Logo" style={{ maxWidth: '130px', height: 'auto' }} />
          </div>
          <div className="outer-auth-card">

            {currentScreen === 'login' && (
              <div className="fade-in">
                <div className="form-header centered">
                  <h1>Welcome back</h1>
                  <p>Sign in to continue</p>
                </div>
                <form onSubmit={handleLoginSubmit}>
                  <div className="form-group">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
                      <label htmlFor="login-email" style={{ margin: 0, display: 'inline-block' }}>Email Address</label>
                      <div className="tooltip-container">
                        <Info size={13} style={{ opacity: 0.6 }} />
                        <span className="tooltip-text">Enter your registered email address to sign in.</span>
                      </div>
                    </div>
                    <div className="input-wrapper" title="Enter your Email address">
                      <Mail className="input-icon" size={18} />
                      <input
                        type="email"
                        id="login-email"
                        className="form-input"
                        placeholder=""
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
                      <label htmlFor="login-password" style={{ margin: 0, display: 'inline-block' }}>Password</label>
                      <div className="tooltip-container">
                        <Info size={13} style={{ opacity: 0.6 }} />
                        <span className="tooltip-text">Enter your account password.</span>
                      </div>
                    </div>
                    <div className="input-wrapper" title="Enter your password">
                      <Lock className="input-icon" size={18} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="login-password"
                        className="form-input"
                        placeholder=""
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="form-options" style={{ marginBottom: '1.5rem' }}>
                    <label className="checkbox-wrapper">
                      <input 
                        type="checkbox" 
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <span>Remember me</span>
                    </label>
                  </div>
                  <button type="submit" className="submit-btn" style={{ width: '100%', marginBottom: '1.5rem' }}>
                    Sign in <ArrowRight size={18} />
                  </button>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '1.5rem 0',
                    color: 'var(--text-secondary)',
                    fontSize: 'var(--text-xs)',
                  }}>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }}></div>
                    <span style={{ padding: '0 10px', fontSize: '0.8rem' }}>or</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }}></div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', width: '100%', marginTop: '1rem' }}>
                    <button
                      type="button"
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        background: 'rgba(255,255,255,0.02)',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '0.6rem var(--spacing-2)',
                        color: 'var(--text-primary)',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = 'rgba(59, 130, 246, 0.08)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                      }}
                      onClick={() => setCurrentScreen('forgot-password')}
                    >
                      <Lock size={14} style={{ color: '#3b82f6' }} />
                      <span>Forgot password?</span>
                    </button>

                    <button
                      type="button"
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        background: 'rgba(255,255,255,0.02)',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '0.6rem var(--spacing-2)',
                        color: 'var(--text-primary)',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = 'rgba(139, 92, 246, 0.08)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                      }}
                      onClick={() => setCurrentScreen('forgot-username')}
                    >
                      <User size={14} style={{ color: '#8b5cf6' }} />
                      <span>Forgot username?</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentScreen === 'forgot-password' && (
              <div className="fade-in">
                <button className="back-btn" onClick={() => {
                  setCurrentScreen('login');
                  setForgotEmailError('');
                }}>
                  <ArrowLeft size={16} /> Back to login
                </button>
                <div className="form-header">
                  <h1>Enter your Email Address</h1><br />
                  {/* <p>Enter the email address associated with your account. We'll send a 6-digit verification code.</p> */}
                </div>
                <form onSubmit={handleForgotPasswordSubmit}>
                  <div className="form-group">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
                      <label htmlFor="forgot-email" style={{ margin: 0, display: 'inline-block' }}>Email Address</label>
                      <div className="tooltip-container">
                        <Info size={13} style={{ opacity: 0.6 }} />
                        <span className="tooltip-text">Enter your registered email to receive a recovery code.</span>
                      </div>
                    </div>
                    <div className="input-wrapper" title="Enter your Email address">
                      <Mail className="input-icon" size={18} />
                      <input
                        type="email"
                        id="forgot-email"
                        className="form-input"
                        placeholder=""
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setForgotEmailError('');
                        }}
                        required
                      />
                    </div>
                    {forgotEmailError && (
                      <div className="error-message">
                        <XCircle size={14} /> {forgotEmailError}
                      </div>
                    )}
                  </div>
                  <button type="submit" className={`submit-btn ${isLoading ? 'loading' : ''}`} disabled={isLoading || !email}>
                    {isLoading ? 'Sending...' : 'Send OTP'} <ArrowRight size={18} />
                  </button>
                </form>
              </div>
            )}

            {currentScreen === 'forgot-username' && (
              <div className="fade-in">
                <button className="back-btn" onClick={() => setCurrentScreen('login')}>
                  <ArrowLeft size={16} /> Back to login
                </button>
                <div className="form-header" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <HelpCircle className="brand-text" size={24} />
                  <h1 style={{ margin: 0 }}>Forgot Username</h1>
                </div>
                <div style={{ 
                  background: 'var(--input-bg)', 
                  border: '1px solid var(--border-subtle)', 
                  borderRadius: 'var(--radius-lg)', 
                  padding: '1.5rem', 
                  marginBottom: '2rem',
                  lineHeight: '1.6',
                  color: 'var(--text-secondary)',
                  fontSize: '0.9rem'
                }}>
                  Contact your administrator or email{' '}
                  <a 
                    href="mailto:support@company.com" 
                    style={{ 
                      color: 'var(--accent)', 
                      textDecoration: 'none', 
                      fontWeight: '500',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.color = 'var(--accent-hover)')}
                    onMouseOut={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                  >
                    support@company.com
                  </a>.
                </div>
                <button 
                  type="button" 
                  className="submit-btn" 
                  onClick={() => setCurrentScreen('login')}
                >
                  <ArrowLeft size={18} /> Back to Login
                </button>
              </div>
            )}

            {currentScreen === 'otp' && (
              <div className="fade-in">
                <button className="back-btn" onClick={() => setCurrentScreen('forgot-password')}>
                  <ArrowLeft size={16} /> Back
                </button>
                <div className="form-header">
                  <h1>Verify your email</h1>
                  <p>We've sent a 6-digit verification code to <strong>{maskEmail(email)}</strong></p>
                </div>
                <div className="otp-container">
                  <div className="otp-inputs" onPaste={handleOtpPaste}>
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => { otpRefs.current[index] = el; }}
                        type="text"
                        className={`otp-input ${otpError ? 'error' : ''}`}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        maxLength={1}
                        autoComplete="off"
                      />
                    ))}
                  </div>
                  {otpError && (
                    <div className="error-message">
                      <XCircle size={14} /> {otpError}
                    </div>
                  )}
                  <div className="timer-section">
                    {timeLeft > 0 ? (
                      <span className="timer">Resend code in {timeLeft}s</span>
                    ) : (
                      <button type="button" className="text-btn resend-btn" onClick={handleResendOtp} disabled={isLoading}>
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>

                <div className="form-options">
                  <button type="button" className="text-btn change-email" onClick={() => setCurrentScreen('forgot-password')}>
                    Change Email
                  </button>
                </div>

                <button
                  type="button"
                  className={`submit-btn ${isLoading ? 'loading' : ''}`}
                  onClick={handleVerifyOtp}
                  disabled={isLoading || otp.join('').length !== 6 || timeLeft === 0}
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP'} <ArrowRight size={18} />
                </button>
              </div>
            )}

            {currentScreen === 'new-password' && (
              <div className="fade-in">
                <button className="back-btn" onClick={() => setCurrentScreen('login')}>
                  <ArrowLeft size={16} /> Back to login
                </button>
                <div className="form-header">
                  <h1>Create a New Password</h1>
                </div>
                <form onSubmit={handleCreateNewPassword}>
                  <div className="form-group">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
                      <label htmlFor="new-password" style={{ margin: 0, display: 'inline-block' }}>New Password</label>
                      <div className="tooltip-container">
                        <Info size={13} style={{ opacity: 0.6 }} />
                        <span className="tooltip-text">Create a secure new password.</span>
                      </div>
                    </div>
                    <div className="input-wrapper" title="Enter your new password">
                      <Lock className="input-icon" size={18} />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        id="new-password"
                        className="form-input"
                        placeholder=""
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        onFocus={() => setIsNewPasswordFocused(true)}
                        onBlur={() => setIsNewPasswordFocused(false)}
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    
                    <div className={`validation-checklist-wrapper ${isNewPasswordFocused || newPassword.length > 0 ? 'visible' : ''}`}>
                      {Object.values(passwordReqs).every(Boolean) ? (
                        <div className="success-message">
                          <CheckCircle2 size={16} /> Strong password
                        </div>
                      ) : (
                        <div className="validation-checklist">
                          <div className={`checklist-item ${passwordReqs.length ? 'met' : ''}`}>
                            <CheckCircle2 size={16} /> Minimum 8 characters
                          </div>
                          <div className={`checklist-item ${passwordReqs.uppercase ? 'met' : ''}`}>
                            <CheckCircle2 size={16} /> One uppercase letter
                          </div>
                          <div className={`checklist-item ${passwordReqs.lowercase ? 'met' : ''}`}>
                            <CheckCircle2 size={16} /> One lowercase letter
                          </div>
                          <div className={`checklist-item ${passwordReqs.number ? 'met' : ''}`}>
                            <CheckCircle2 size={16} /> One number
                          </div>
                          <div className={`checklist-item ${passwordReqs.special ? 'met' : ''}`}>
                            <CheckCircle2 size={16} /> One special character
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
                      <label htmlFor="confirm-password" style={{ margin: 0, display: 'inline-block' }}>Confirm Password</label>
                      <div className="tooltip-container">
                        <Info size={13} style={{ opacity: 0.6 }} />
                        <span className="tooltip-text">Verify your new password.</span>
                      </div>
                    </div>
                    <div className="input-wrapper" title="Confirm your new password">
                      <KeyRound className="input-icon" size={18} />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        id="confirm-password"
                        className="form-input"
                        placeholder=""
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                    {confirmPassword && newPassword !== confirmPassword && (
                      <div className="error-message">
                        <XCircle size={14} /> Passwords do not match
                      </div>
                    )}
                  </div>



                  <button
                    type="submit"
                    className={`submit-btn ${isLoading ? 'loading' : ''}`}
                    disabled={isLoading || !isPasswordValid}
                    style={{ marginTop: '2rem' }}
                  >
                    {isLoading ? 'Updating...' : 'Reset Password'} <Check size={18} />
                  </button>
                </form>
              </div>
            )}

            {currentScreen === 'success' && (
              <div className="fade-in success-screen">
                <div className="success-icon-wrapper">
                  <div className="success-pulse"></div>
                  <CheckCircle2 className="success-icon" size={64} />
                </div>
                <div className="form-header centered">
                  <h1>Password Updated Successfully</h1>
                  {/* <p>Your password has been changed successfully. You can now sign in using your new password.</p> */}
                </div>
                <div className="success-actions">
                  <button
                    type="button"
                    className="submit-btn"
                    onClick={() => {
                      setCurrentScreen('login');
                      setPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                    }}
                  >
                    Back to Login
                  </button>
                </div>
              </div>
            )}

            {/* Optional Footer */}
            <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              Powered by OmniEye &copy; {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
