import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAdmin } from '../contexts/AdminContext';
import './AdminLogin.css';

const AdminLogin = ({ onClose, onSuccess, purpose = "edit customer details" }) => {
  const { language } = useLanguage();
  const { adminLogin, adminCredentials } = useAdmin();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    const result = adminLogin(formData.username, formData.password);
    
    if (result.success) {
      setIsLoading(false);
      if (onSuccess) {
        onSuccess();
      }
      if (onClose) {
        onClose();
      }
    } else {
      setError(
        language === 'ur' 
          ? 'غلط ایڈمن کی معلومات' 
          : 'Invalid admin credentials'
      );
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setFormData({
      username: adminCredentials.username,
      password: adminCredentials.password
    });
  };

  return (
    <div className="admin-login-overlay" onClick={onClose} dir={language === 'ur' ? 'rtl' : 'ltr'}>
      <div className="admin-login-modal" onClick={e => e.stopPropagation()}>
        <div className="admin-login-header">
          <h3>
            🔐 {language === 'ur' ? 'ایڈمن لاگ ان' : 'Admin Login'}
          </h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="admin-login-content">
          <p className="login-purpose">
            {language === 'ur' 
              ? `${purpose} کے لیے ایڈمن کی تصدیق درکار ہے`
              : `Admin authentication required to ${purpose}`}
          </p>

          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="form-group">
              <label htmlFor="username">
                {language === 'ur' ? 'یوزر نیم:' : 'Username:'}
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                placeholder={language === 'ur' ? 'یوزر نیم درج کریں' : 'Enter username'}
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                {language === 'ur' ? 'پاسورڈ:' : 'Password:'}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder={language === 'ur' ? 'پاسورڈ درج کریں' : 'Enter password'}
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="form-actions">
              <button
                type="submit"
                className="login-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="spinner-small"></div>
                    {language === 'ur' ? 'لاگ ان ہو رہا ہے...' : 'Logging in...'}
                  </>
                ) : (
                  <>
                    🔓 {language === 'ur' ? 'لاگ ان' : 'Login'}
                  </>
                )}
              </button>

              <button
                type="button"
                className="cancel-btn"
                onClick={onClose}
                disabled={isLoading}
              >
                {language === 'ur' ? 'منسوخ' : 'Cancel'}
              </button>
            </div>
          </form>

          {/* Demo credentials helper */}
          <div className="demo-helper">
            <button
              type="button"
              className="demo-credentials-btn"
              onClick={() => setShowCredentials(!showCredentials)}
            >
              {language === 'ur' ? 'ڈیمو کی معلومات' : 'Demo Credentials'} 
              {showCredentials ? ' 🔼' : ' 🔽'}
            </button>
            
            {showCredentials && (
              <div className="demo-credentials">
                <p><strong>{language === 'ur' ? 'یوزر نیم' : 'Username'}:</strong> {adminCredentials.username}</p>
                <p><strong>{language === 'ur' ? 'پاسورڈ' : 'Password'}:</strong> {adminCredentials.password}</p>
                <button
                  type="button"
                  className="use-demo-btn"
                  onClick={handleDemoLogin}
                >
                  {language === 'ur' ? 'ڈیمو کی معلومات استعمال کریں' : 'Use Demo Credentials'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;