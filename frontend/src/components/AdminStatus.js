import React from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { useLanguage } from '../contexts/LanguageContext';
import './AdminStatus.css';

const AdminStatus = () => {
  const { isAdminAuthenticated, adminSession, adminLogout } = useAdmin();
  const { language } = useLanguage();

  if (!isAdminAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    if (window.confirm(language === 'ur' ? 'کیا آپ واقعی لاگ آؤٹ کرنا چاہتے ہیں؟' : 'Are you sure you want to logout?')) {
      adminLogout();
    }
  };

  return (
    <div className="admin-status" dir={language === 'ur' ? 'rtl' : 'ltr'}>
      <div className="admin-badge">
        <span className="admin-icon">👨‍💼</span>
        <span className="admin-text">
          {language === 'ur' ? 'ایڈمن' : 'Admin'}: {adminSession?.username}
        </span>
        <button 
          className="logout-btn" 
          onClick={handleLogout}
          title={language === 'ur' ? 'لاگ آؤٹ' : 'Logout'}
        >
          🚪
        </button>
      </div>
    </div>
  );
};

export default AdminStatus;