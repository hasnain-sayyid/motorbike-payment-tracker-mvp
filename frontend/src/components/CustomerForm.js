import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './CustomerForm.css';

const CustomerForm = ({ customer, onSubmit, onCancel }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: customer?.name || '',
    phone: customer?.phone || '',
    monthlyAmount: customer?.monthlyAmount || '',
    dueDate: customer?.dueDate || '',
    notes: customer?.notes || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.phone || !formData.monthlyAmount || !formData.dueDate) {
      alert(t('fillRequiredFields'));
      return;
    }

    // Validate phone number (basic check)
    if (!/^[+]?[0-9]{10,15}$/.test(formData.phone.replace(/[\s-()]/g, ''))) {
      alert(t('validPhoneNumber'));
      return;
    }

    // Validate due date (1-31)
    const dueDate = parseInt(formData.dueDate);
    if (isNaN(dueDate) || dueDate < 1 || dueDate > 31) {
      alert(t('validDueDate'));
      return;
    }

    // Validate amount
    const amount = parseFloat(formData.monthlyAmount);
    if (isNaN(amount) || amount <= 0) {
      alert(t('validAmount'));
      return;
    }

    onSubmit({
      ...formData,
      monthlyAmount: amount,
      dueDate: dueDate
    });
  };

  return (
    <div className="customer-form-overlay">
      <div className="customer-form">
        <h3>{customer ? t('editCustomer') : t('addNewCustomer')}</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">{t('customerName')} *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder={t('customerName')}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">{t('phoneNumber')} *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+92-300-1234567"
              required
              style={{ fontSize: '16px', padding: '12px' }}
            />
            <small>Format: +92-XXX-XXXXXXX or 03XX-XXXXXXX</small>
          </div>

          <div className="form-group">
            <label htmlFor="monthlyAmount">{t('installmentAmount')} *</label>
            <input
              type="number"
              id="monthlyAmount"
              name="monthlyAmount"
              value={formData.monthlyAmount}
              onChange={handleInputChange}
              placeholder="5000"
              min="1"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">{t('dueDay')} *</label>
            <input
              type="number"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              placeholder="15"
              min="1"
              max="31"
              required
            />
            <small>{t('dueDayHelper')}</small>
          </div>

          <div className="form-group">
            <label htmlFor="notes">{t('notes')}</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder={t('notesPlaceholder')}
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-cancel">
              {t('cancel')}
            </button>
            <button type="submit" className="btn-submit">
              {customer ? t('updateCustomer') : t('addCustomer')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;