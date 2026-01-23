import React, { useState } from 'react';
import './PaymentForm.css';

const PaymentForm = ({ customer, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    amount: customer?.monthlyAmount || '',
    notes: ''
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
    
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid payment amount');
      return;
    }

    onSubmit({
      customerId: customer.id,
      amount: amount,
      notes: formData.notes
    });
  };

  return (
    <div className="payment-form-overlay">
      <div className="payment-form">
        <h3>Record Payment</h3>
        
        <div className="customer-summary">
          <div className="customer-details">
            <h4>{customer.name}</h4>
            <p>{customer.phone}</p>
          </div>
          <div className="payment-info">
            <span className="label">Monthly Amount:</span>
            <span className="amount">{customer.monthlyAmount}</span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="amount">Payment Amount *</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="5000"
              min="0.01"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Payment Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Payment method, reference number, etc..."
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Record Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;