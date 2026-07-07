import './PreviewLogin.css';

export function PreviewLogin() {
  return (
    <div className="preview-login-container dashboard-fade-in">
      <div className="preview-login-left">
        <div className="preview-login-brand">
          <div className="preview-login-logo">NE</div>
          <h1 className="preview-login-title">Nexus ERP</h1>
          <p className="preview-login-subtitle">Run your whole business in one place</p>
        </div>
      </div>
      
      <div className="preview-login-right">
        <div className="preview-login-card">
          <h2 className="preview-login-card-title">Sign in</h2>
          <p className="preview-login-card-subtitle">Welcome back to Nexus ERP</p>
          
          <div className="preview-login-form">
            <div className="input-group">
              <label className="input-label">Email</label>
              <input type="text" className="form-input" defaultValue="admin@company.com" disabled />
            </div>
            <div className="input-group active">
              <label className="input-label">Password</label>
              <input type="password" className="form-input" defaultValue="password" disabled />
            </div>
            <button className="preview-login-btn">SIGN IN</button>
          </div>
          
          <div className="preview-login-footer">
            Powered by <strong>Nexus ERP</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
