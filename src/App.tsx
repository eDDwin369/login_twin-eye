import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, Shield, ArrowRight, ArrowLeft, CheckCircle2, XCircle, KeyRound, Check } from 'lucide-react';
import './index.css';
import logo from './assets/logo.png';
import { Dashboard } from './components/Dashboard/Dashboard';

type Screen = 'login' | 'forgot-password' | 'otp' | 'new-password' | 'success' | 'dashboard';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');

  // Shared state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  // Handlers
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt', { email, password });
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCurrentScreen('dashboard');
    }, 1000);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setCurrentScreen('otp');
      setTimeLeft(60);
      setOtp(['', '', '', '', '', '']);
      setOtpError('');
    }, 1500);
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

  const getPasswordStrength = () => {
    const reqsMet = Object.values(passwordReqs).filter(Boolean).length;
    if (newPassword.length === 0) return { width: '0%', color: 'transparent', text: '' };
    if (reqsMet <= 2) return { width: '33%', color: '#ef4444', text: 'Weak' }; // red-500
    if (reqsMet <= 4) return { width: '66%', color: '#eab308', text: 'Medium' }; // yellow-500
    return { width: '100%', color: '#22c55e', text: 'Strong' }; // green-500
  };

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

  if (currentScreen === 'dashboard') {
    return <Dashboard onLogout={() => setCurrentScreen('login')} />;
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

          {currentScreen === 'login' && (
            <div className="fade-in">
              <div className="form-header">
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <img src={logo} alt="Logo" style={{ maxWidth: '180px', height: 'auto' }} />
                </div>
                <h1>Welcome back</h1>
                <p>Enter your credentials to access the system.</p>
              </div>
              <form onSubmit={handleLoginSubmit}>
                <div className="form-group">
                  <label htmlFor="login-email">Email Address</label>
                  <div className="input-wrapper">
                    <Mail className="input-icon" size={18} />
                    <input
                      type="email"
                      id="login-email"
                      className="form-input"
                      placeholder="admin@oomnieye.net"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="login-password">Password</label>
                  <div className="input-wrapper">
                    <Lock className="input-icon" size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="login-password"
                      className="form-input"
                      placeholder="••••••••"
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
                <div className="form-options">
                  <label className="checkbox-wrapper">
                    <input type="checkbox" defaultChecked />
                    <span>Remember me</span>
                  </label>
                  <button type="button" className="text-btn forgot-password" onClick={() => setCurrentScreen('forgot-password')}>
                    Forgot password?
                  </button>
                </div>
                <button type="submit" className="submit-btn">
                  Authenticate <ArrowRight size={18} />
                </button>
              </form>
            </div>
          )}

          {currentScreen === 'forgot-password' && (
            <div className="fade-in">
              <button className="back-btn" onClick={() => setCurrentScreen('login')}>
                <ArrowLeft size={16} /> Back to login
              </button>
              <div className="form-header">
                <h1>Forgot Password?</h1>
                <p>Enter the email address associated with your account. We'll send a 6-digit verification code.</p>
              </div>
              <form onSubmit={handleForgotPasswordSubmit}>
                <div className="form-group">
                  <label htmlFor="forgot-email">Email Address</label>
                  <div className="input-wrapper">
                    <Mail className="input-icon" size={18} />
                    <input
                      type="email"
                      id="forgot-email"
                      className="form-input"
                      placeholder="admin@oomnieye.net"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <button type="submit" className={`submit-btn ${isLoading ? 'loading' : ''}`} disabled={isLoading || !email}>
                  {isLoading ? 'Sending...' : 'Send OTP'} <ArrowRight size={18} />
                </button>
              </form>
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
              <div className="form-header">
                <h1>Create a New Password</h1>
                <p>Your new password must be unique and meet the security requirements.</p>
              </div>
              <form onSubmit={handleCreateNewPassword}>
                <div className="form-group">
                  <label htmlFor="new-password">New Password</label>
                  <div className="input-wrapper">
                    <Lock className="input-icon" size={18} />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      id="new-password"
                      className="form-input"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
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
                  {/* Strength Meter */}
                  <div className="strength-meter-container">
                    <div className="strength-bar">
                      <div
                        className="strength-fill"
                        style={{
                          width: getPasswordStrength().width,
                          backgroundColor: getPasswordStrength().color
                        }}
                      ></div>
                    </div>
                    {newPassword.length > 0 && (
                      <span className="strength-text" style={{ color: getPasswordStrength().color }}>
                        {getPasswordStrength().text}
                      </span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="confirm-password">Confirm Password</label>
                  <div className="input-wrapper">
                    <KeyRound className="input-icon" size={18} />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      id="confirm-password"
                      className="form-input"
                      placeholder="••••••••"
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
                <p>Your password has been changed successfully. You can now sign in using your new password.</p>
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

        </div>
      </div>
    </>
  );
}

export default App;
