import React, { useState } from 'react';
import './CustomerForm.css';

const CustomerForm = ({ customer, onSubmit, onCancel }) => {
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
      alert('Please fill in all required fields');
      return;
    }

    // Validate phone number (basic check)
    if (!/^[+]?[0-9]{10,15}$/.test(formData.phone.replace(/[\s-()]/g, ''))) {
      alert('Please enter a valid phone number');
      return;
    }

    // Validate due date (1-31)
    const dueDate = parseInt(formData.dueDate);
    if (isNaN(dueDate) || dueDate < 1 || dueDate > 31) {
      alert('Due date must be between 1 and 31');
      return;
    }

    // Validate amount
    const amount = parseFloat(formData.monthlyAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
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
        <h3>{customer ? 'Edit Customer' : 'Add New Customer'}</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Customer Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter customer name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+91-9876543210"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="monthlyAmount">Monthly Installment Amount *</label>
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
            <label htmlFor="dueDate">Due Date (Day of Month) *</label>
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
            <small>Enter the day of the month when payment is due (1-31)</small>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Any additional notes about this customer..."
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              {customer ? 'Update Customer' : 'Add Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;