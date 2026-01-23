import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { exportAllCustomersToExcel } from '../api';
import './ExcelManager.css';

const ExcelManager = ({ onCustomersImported }) => {
  const { language } = useLanguage();
  const [isExporting, setIsExporting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [lastExportedFile, setLastExportedFile] = useState(localStorage.getItem('lastExportedFilename') || '');

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  const handleExportAll = async () => {
    setIsExporting(true);
    try {
      const result = await exportAllCustomersToExcel();
      if (result.success) {
        // Store the exported filename for import reference
        localStorage.setItem('lastExportedFilename', result.filename);
        setLastExportedFile(result.filename);
        showMessage(
          language === 'ur' 
            ? `Excel فائل کامیابی سے ایکسپورٹ ہوگئی: ${result.filename}` 
            : `Excel file exported successfully: ${result.filename}`,
          'success'
        );
      } else {
        showMessage(
          language === 'ur' 
            ? `Excel فائل ایکسپورٹ میں خرابی: ${result.message}` 
            : `Export failed: ${result.message}`,
          'error'
        );
      }
    } catch (error) {
      showMessage(
        language === 'ur' 
          ? 'Excel فائل ایکسپورٹ میں خرابی' 
          : 'Failed to export Excel file',
        'error'
      );
    } finally {
      setIsExporting(false);
    }
  };

  // Remove the handleImportClick function - we'll use direct file input
  
  return (
    <div className="excel-manager" dir={language === 'ur' ? 'rtl' : 'ltr'}>
      <div className="excel-controls">
        
        {/* Export Button */}
        <button
          onClick={handleExportAll}
          disabled={isExporting}
          className="excel-btn export-btn"
          title={language === 'ur' ? 'تمام ڈیٹا Excel میں ایکسپورٹ کریں' : 'Export all data to Excel'}
        >
          {isExporting ? (
            <>
              <div className="spinner"></div>
              {language === 'ur' ? 'ایکسپورٹ ہو رہا ہے...' : 'Exporting...'}
            </>
          ) : (
            <>
              📊 {language === 'ur' ? 'Excel میں ایکسپورٹ' : 'Export to Excel'}
            </>
          )}
        </button>

        {/* Download/Open Excel Button */}
        <div className="import-container">
          <button
            onClick={() => {
              if (lastExportedFile) {
                // Try to trigger download of the exported file
                const exportedFileName = lastExportedFile;
                alert(`Excel file "${exportedFileName}" was already downloaded to your Downloads folder.\n\n📁 Check your Downloads folder and double-click the file to open it in Microsoft Excel.\n\nTo get a fresh copy, click "Export to Excel" first.`);
              } else {
                alert('❌ No Excel file available yet!\n\n1. First click "📊 Export to Excel" to create a file\n2. Then you can find it in your Downloads folder\n3. Double-click the file to open it in Microsoft Excel');
              }
            }}
            className="excel-btn import-btn"
            style={{
              display: 'inline-block',
              padding: '10px 16px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #FF9800, #F57C00)',
              color: 'white',
              minWidth: '200px',
              textAlign: 'center'
            }}
          >
            📂 {language === 'ur' ? 'Excel میں کھولیں' : 'Open in Excel'}
          </button>
          {lastExportedFile ? (
            <div className="import-hint" style={{ marginTop: '5px', fontSize: '11px', opacity: '0.8' }}>
              File: {lastExportedFile}
            </div>
          ) : (
            <div className="import-hint" style={{ marginTop: '5px', fontSize: '11px', opacity: '0.8' }}>
              Export data first to create Excel file
            </div>
          )}
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`excel-message ${messageType}`}>
          {message}
        </div>
      )}

      {/* Instructions */}
      <div className="excel-instructions">
        <p>
          {language === 'ur' 
            ? '• Excel فائل میں کسٹمر کی تفصیلات، ادائیگی کی تاریخ، اور مالی خلاصہ شامل ہوگا' 
            : '• Excel file will include customer details, payment history, and financial summary'}
        </p>
        <p>
          {language === 'ur' 
            ? '• امپورٹ کرتے وقت پہلے سے موجود ڈیٹا محفوظ رہے گا' 
            : '• Existing data will be preserved when importing new customers'}
        </p>
      </div>
    </div>
  );
};

export default ExcelManager;