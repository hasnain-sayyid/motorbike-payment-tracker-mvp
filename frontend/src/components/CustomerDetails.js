import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAdmin } from '../contexts/AdminContext';
import { exportCustomerToExcel } from '../api';
import AdminLogin from './AdminLogin';
import './CustomerDetails.css';

const CustomerDetails = ({ customer, onClose, onEdit }) => {
  const { t } = useLanguage();
  const { isAdminAuthenticated, requireAdminAuth } = useAdmin();
  const [exportingExcel, setExportingExcel] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [pendingEditAction, setPendingEditAction] = useState(null);

  // Debug log
  console.log('CustomerDetails rendering with customer:', customer);

  if (!customer) {
    console.log('No customer provided to CustomerDetails');
    return null;
  }

  // Safe translation function with fallback
  const safeT = (key) => {
    try {
      return t(key) || key;
    } catch (err) {
      console.warn('Translation error for key:', key, err);
      return key;
    }
  };

  const handleEditClick = (editType = 'general') => {
    console.log('Edit clicked, type:', editType, 'isAdminAuthenticated:', isAdminAuthenticated);
    
    const editAction = () => {
      if (onEdit) {
        onEdit(customer);
      }
    };

    if (requireAdminAuth(editAction)) {
      // Admin is already authenticated, proceed with edit
      return;
    } else {
      // Admin auth required, show login modal
      setPendingEditAction(() => editAction);
      setShowAdminLogin(true);
    }
  };

  const handleAdminLoginSuccess = () => {
    console.log('Admin login successful');
    setShowAdminLogin(false);
    if (pendingEditAction) {
      pendingEditAction();
      setPendingEditAction(null);
    }
  };

  const handleAdminLoginClose = () => {
    console.log('Admin login closed');
    setShowAdminLogin(false);
    setPendingEditAction(null);
  };

  const handleExportToExcel = async () => {
    setExportingExcel(true);
    try {
      const result = await exportCustomerToExcel(customer.id);
      if (result.success) {
        alert(`Excel file exported successfully: ${result.filename}`);
      } else {
        alert(`Export failed: ${result.message}`);
      }
    } catch (error) {
      alert('Failed to export to Excel');
      console.error('Excel export error:', error);
    } finally {
      setExportingExcel(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return `${amount.toLocaleString()}`;
  };

  const getPaymentTypeText = (type) => {
    return type === 'down_payment' ? t('downPaymentType') : t('monthlyPaymentType');
  };

  const getStatusText = (status) => {
    return status === 'completed' ? t('completed') : t('pending');
  };

  const totalPaid = customer.paymentHistory?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
  const remainingAmount = customer.bikePrice - totalPaid;

  try {
    return (
      <div className="customer-details-overlay" onClick={onClose}>
        <div className="customer-details-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2>{safeT('customerDetails')}</h2>
            <div className="header-actions">
              <button 
                className="export-excel-btn" 
                onClick={handleExportToExcel}
                disabled={exportingExcel}
                title="Export customer details to Excel"
              >
                {exportingExcel ? '📊⏳' : '📊'} Excel
              </button>
              <button 
                className={`edit-btn ${!isAdminAuthenticated ? 'requires-auth' : ''}`}
                onClick={() => handleEditClick('general')}
                title={isAdminAuthenticated ? 'Edit customer' : 'Admin authentication required'}
              >
                {isAdminAuthenticated ? '✏️' : '🔒'} {safeT('edit')}
              </button>
              <button className="close-btn" onClick={onClose}>
                ×
              </button>
            </div>
          </div>

        <div className="modal-content">
          <div className="customer-info-section">
            <h3>📋 {customer.name}</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">{t('phone')}:</span>
                <span className="value">
                  {customer.phone}
                  <button 
                    className={`quick-edit-btn ${!isAdminAuthenticated ? 'requires-auth' : ''}`}
                    onClick={() => handleEditClick('phone')}
                    title={isAdminAuthenticated ? 'Edit phone number' : 'Admin authentication required'}
                  >
                    {isAdminAuthenticated ? '📞' : '🔒'}
                  </button>
                </span>
              </div>
              <div className="info-item">
                <span className="label">{t('bikeDetails')}:</span>
                <span className="value">{customer.bikeDetails}</span>
              </div>
              <div className="info-item">
                <span className="label">{t('bikePrice')}:</span>
                <span className="value price">{formatCurrency(customer.bikePrice)}</span>
              </div>
              <div className="info-item">
                <span className="label">{t('downPayment')}:</span>
                <span className="value down-payment">{formatCurrency(customer.downPayment)}</span>
              </div>
              <div className="info-item">
                <span className="label">{t('installmentAmount')}:</span>
                <span className="value">
                  {formatCurrency(customer.monthlyAmount)}
                  <button 
                    className={`quick-edit-btn ${!isAdminAuthenticated ? 'requires-auth' : ''}`}
                    onClick={() => handleEditClick('monthly')}
                    title={isAdminAuthenticated ? 'Edit monthly amount' : 'Admin authentication required'}
                  >
                    {isAdminAuthenticated ? '💰' : '🔒'}
                  </button>
                </span>
              </div>
              <div className="info-item">
                <span className="label">{t('totalPaid')}:</span>
                <span className="value paid">{formatCurrency(totalPaid)}</span>
              </div>
              <div className="info-item">
                <span className="label">{t('remainingAmount')}:</span>
                <span className="value remaining">{formatCurrency(remainingAmount)}</span>
              </div>
            </div>
          </div>

          <div className="payment-history-section">
            <h3>💳 {t('paymentHistory')}</h3>
            {customer.paymentHistory && customer.paymentHistory.length > 0 ? (
              <div className="payment-table">
                <div className="payment-header">
                  <span>{t('paymentDate')}</span>
                  <span>{t('paymentType')}</span>
                  <span>{t('paymentAmount')}</span>
                  <span>{t('paymentStatus')}</span>
                </div>
                {customer.paymentHistory.map((payment) => (
                  <div key={payment.id} className="payment-row">
                    <span className="date">{formatDate(payment.date)}</span>
                    <span className="type">{getPaymentTypeText(payment.type)}</span>
                    <span className="amount">{formatCurrency(payment.amount)}</span>
                    <span className={`status ${payment.status}`}>
                      {getStatusText(payment.status)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-payments">{t('noPayments')}</p>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button 
            className={`btn-edit-full ${!isAdminAuthenticated ? 'requires-auth' : ''}`}
            onClick={() => handleEditClick('full')}
            title={isAdminAuthenticated ? 'Edit customer details' : 'Admin authentication required'}
          >
            {isAdminAuthenticated ? '✏️' : '🔒'} {t('editCustomer')}
          </button>
          <button className="btn-close" onClick={onClose}>
            {t('close')}
          </button>
        </div>
      </div>
      
      {/* Admin Login Modal */}
      {showAdminLogin && (
        <AdminLogin
          onClose={handleAdminLoginClose}
          onSuccess={handleAdminLoginSuccess}
          purpose={`edit ${customer.name}'s details`}
        />
      )}
    </div>
  );
  } catch (error) {
    console.error('Error rendering CustomerDetails:', error);
    return (
      <div className="customer-details-overlay" onClick={onClose}>
        <div className="customer-details-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Error</h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          <div className="modal-content">
            <p>Sorry, there was an error loading customer details.</p>
            <p>Error: {error.message}</p>
            <button onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  }
};

export default CustomerDetails;