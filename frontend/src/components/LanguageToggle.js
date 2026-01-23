import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './LanguageToggle.css';

const LanguageToggle = () => {
  const { language, toggleLanguage, t } = useLanguage();
  
  return (
    <div className="language-toggle">
      <button 
        className={`language-btn ${language === 'en' ? 'active' : ''}`}
        onClick={toggleLanguage}
        title={t('language')}
      >
        <span className="language-icon">🌐</span>
        <span className="language-text">
          {language === 'en' ? 'اردو' : 'English'}
        </span>
      </button>
    </div>
  );
};

export default LanguageToggle;