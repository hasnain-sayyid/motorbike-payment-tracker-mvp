import React, { useState, useEffect } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import AdminLogin from './AdminLogin';
import * as api from '../api';
import './CustomerDetails.css';

const CustomerDetailsSimple = ({ customer, onClose, onEdit }) => {
  const { isAdminAuthenticated } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState(customer);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  // Update editedCustomer when customer prop changes (e.g., after recording a payment)
  useEffect(() => {
    if (!isEditing) { // Only update if not currently editing
      setEditedCustomer(customer);
    }
  }, [customer, isEditing]);

  console.log('CustomerDetails rendering:', { customer, isAdminAuthenticated, isEditing });

  if (!customer) {
    return null;
  }

  const handleEditClick = () => {
    if (isAdminAuthenticated) {
      setIsEditing(true);
      setEditedCustomer({ ...customer });
    } else {
      setShowAdminLogin(true);
    }
  };

  const handleAdminLoginSuccess = () => {
    setShowAdminLogin(false);
    setIsEditing(true);
    setEditedCustomer({ ...customer });
  };

  const handleInputChange = (field, value) => {
    setEditedCustomer(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePaymentHistoryChange = (paymentIndex, field, value) => {
    setEditedCustomer(prev => ({
      ...prev,
      paymentHistory: prev.paymentHistory?.map((payment, index) => 
        index === paymentIndex 
          ? { ...payment, [field]: value }
          : payment
      ) || []
    }));
  };

  const addNewPayment = () => {
    const newPayment = {
      id: Date.now(),
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      type: 'monthly',
      status: 'pending'
    };
    
    setEditedCustomer(prev => ({
      ...prev,
      paymentHistory: [...(prev.paymentHistory || []), newPayment]
    }));
  };

  const removePayment = (paymentIndex) => {
    setEditedCustomer(prev => ({
      ...prev,
      paymentHistory: prev.paymentHistory?.filter((_, index) => index !== paymentIndex) || []
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Determine customer status based on payment history
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      
      const hasPaymentThisMonth = editedCustomer.paymentHistory?.some(payment => {
        if (payment.status !== 'completed') return false;
        const paymentDate = new Date(payment.date);
        return paymentDate.getMonth() + 1 === currentMonth && 
               paymentDate.getFullYear() === currentYear;
      });
      
      // Update customer status based on payment history
      const updatedCustomer = {
        ...editedCustomer,
        status: hasPaymentThisMonth ? 'paid' : editedCustomer.status
      };
      
      await api.updateCustomer(customer.id, updatedCustomer);
      setIsEditing(false);
      
      // Call parent onEdit to refresh the data
      if (onEdit) {
        onEdit(updatedCustomer);
      }
      
      alert('Customer details updated successfully!');
    } catch (error) {
      console.error('Error updating customer:', error);
      alert('Failed to update customer details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedCustomer(customer);
  };



  const formatCurrency = (amount) => {
    return Number(amount).toLocaleString();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const totalPaid = editedCustomer.paymentHistory?.reduce((sum, payment) => 
    payment.status === 'completed' ? sum + Number(payment.amount) : sum, 0) || 0;
    
  // Add down payment to total if it's not already in payment history
  const downPaymentInHistory = editedCustomer.paymentHistory?.some(p => p.type === 'down_payment') || false;
  const actualTotalPaid = totalPaid + (downPaymentInHistory ? 0 : Number(editedCustomer.downPayment || 0));
  
  const remainingAmount = Number(editedCustomer.bikePrice || 0) - actualTotalPaid;

  return (
    <div className="customer-details-overlay" onClick={onClose}>
      <div className="customer-details-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? 'Edit Customer Details' : 'Customer Details'}</h2>
          <div className="header-actions">
            {!isEditing && (
              <button 
                className={`edit-btn ${!isAdminAuthenticated ? 'requires-auth' : ''}`}
                onClick={handleEditClick}
                title={isAdminAuthenticated ? 'Edit customer details' : 'Admin authentication required'}
              >
                {isAdminAuthenticated ? '✏️ Edit' : '🔒 Edit (Login Required)'}
              </button>
            )}
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
        </div>

        <div className="modal-content">
          {/* Basic Customer Information */}
          <div className="customer-info-section">
            <h3>📋 Customer Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Customer Name:</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedCustomer.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="edit-input"
                  />
                ) : (
                  <span className="value">{customer.name || 'N/A'}</span>
                )}
              </div>
              
              <div className="info-item">
                <span className="label">Phone:</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedCustomer.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="edit-input"
                  />
                ) : (
                  <span className="value">{customer.phone || 'N/A'}</span>
                )}
              </div>
              
              <div className="info-item">
                <span className="label">Bike Details:</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedCustomer.bikeDetails || ''}
                    onChange={(e) => handleInputChange('bikeDetails', e.target.value)}
                    className="edit-input"
                  />
                ) : (
                  <span className="value">{customer.bikeDetails || 'N/A'}</span>
                )}
              </div>
              
              <div className="info-item">
                <span className="label">Bike Price:</span>
                {isEditing ? (
                  <input
                    type="number"
                    value={editedCustomer.bikePrice || ''}
                    onChange={(e) => handleInputChange('bikePrice', Number(e.target.value))}
                    className="edit-input"
                  />
                ) : (
                  <span className="value price">{formatCurrency(customer.bikePrice || 0)}</span>
                )}
              </div>
              
              <div className="info-item">
                <span className="label">Down Payment:</span>
                {isEditing ? (
                  <input
                    type="number"
                    value={editedCustomer.downPayment || ''}
                    onChange={(e) => handleInputChange('downPayment', Number(e.target.value))}
                    className="edit-input"
                  />
                ) : (
                  <span className="value down-payment">{formatCurrency(customer.downPayment || 0)}</span>
                )}
              </div>
              
              <div className="info-item">
                <span className="label">Monthly Amount:</span>
                {isEditing ? (
                  <input
                    type="number"
                    value={editedCustomer.monthlyAmount || ''}
                    onChange={(e) => handleInputChange('monthlyAmount', Number(e.target.value))}
                    className="edit-input"
                  />
                ) : (
                  <span className="value">{formatCurrency(customer.monthlyAmount || 0)}</span>
                )}
              </div>
              
              <div className="info-item">
                <span className="label">Due Date:</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedCustomer.dueDate || ''}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    className="edit-input"
                    placeholder="e.g., 15th of each month"
                  />
                ) : (
                  <span className="value">{customer.dueDate || 'N/A'}</span>
                )}
              </div>
              
              <div className="info-item">
                <span className="label">Status:</span>
                {isEditing ? (
                  <select
                    value={editedCustomer.status || 'active'}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="edit-select"
                  >
                    <option value="active">Active</option>
                    <option value="overdue">Overdue</option>
                    <option value="completed">Completed</option>
                    <option value="suspended">Suspended</option>
                  </select>
                ) : (
                  <span className={`value status-${customer.status}`}>
                    {customer.status?.charAt(0).toUpperCase() + customer.status?.slice(1) || 'Unknown'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="financial-summary">
            <h3>💰 Financial Summary</h3>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="label">Total Paid:</span>
                <span className="value paid">{formatCurrency(actualTotalPaid)}</span>
              </div>
              <div className="summary-item">
                <span className="label">Remaining Amount:</span>
                <span className="value remaining">{formatCurrency(remainingAmount)}</span>
              </div>
              <div className="summary-item">
                <span className="label">Progress:</span>
                <span className="value">{((actualTotalPaid / (editedCustomer.bikePrice || 1)) * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="payment-history-section">
            <h3>💳 Payment History</h3>
            {isEditing && (
              <button onClick={addNewPayment} className="add-payment-btn">
                ➕ Add Payment
              </button>
            )}
            
            {editedCustomer.paymentHistory && editedCustomer.paymentHistory.length > 0 ? (
              <div className="payment-table">
                <div className="payment-header">
                  <span>Date</span>
                  <span>Amount</span>
                  <span>Type</span>
                  <span>Status</span>
                  {isEditing && <span>Actions</span>}
                </div>
                {editedCustomer.paymentHistory.map((payment, index) => (
                  <div key={payment.id || index} className="payment-row">
                    <span>
                      {isEditing ? (
                        <input
                          type="date"
                          value={payment.date?.split('T')[0] || ''}
                          onChange={(e) => handlePaymentHistoryChange(index, 'date', e.target.value)}
                          className="payment-input"
                        />
                      ) : (
                        formatDate(payment.date)
                      )}
                    </span>
                    <span>
                      {isEditing ? (
                        <input
                          type="number"
                          value={payment.amount || ''}
                          onChange={(e) => handlePaymentHistoryChange(index, 'amount', Number(e.target.value))}
                          className="payment-input"
                        />
                      ) : (
                        formatCurrency(payment.amount)
                      )}
                    </span>
                    <span>
                      {isEditing ? (
                        <select
                          value={payment.type || 'monthly'}
                          onChange={(e) => handlePaymentHistoryChange(index, 'type', e.target.value)}
                          className="payment-select"
                        >
                          <option value="down_payment">Down Payment</option>
                          <option value="monthly">Monthly Payment</option>
                          <option value="extra">Extra Payment</option>
                        </select>
                      ) : (
                        payment.type === 'down_payment' ? 'Down Payment' : 
                        payment.type === 'monthly' ? 'Monthly Payment' : 
                        payment.type || 'Unknown'
                      )}
                    </span>
                    <span>
                      {isEditing ? (
                        <select
                          value={payment.status || 'pending'}
                          onChange={(e) => handlePaymentHistoryChange(index, 'status', e.target.value)}
                          className="payment-select"
                        >
                          <option value="completed">Completed</option>
                          <option value="pending">Pending</option>
                          <option value="failed">Failed</option>
                        </select>
                      ) : (
                        <span className={`status-badge status-${payment.status}`}>
                          {payment.status?.charAt(0).toUpperCase() + payment.status?.slice(1)}
                        </span>
                      )}
                    </span>
                    {isEditing && (
                      <span>
                        <button 
                          onClick={() => removePayment(index)}
                          className="remove-payment-btn"
                          title="Remove payment"
                        >
                          🗑️
                        </button>
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-payments">No payment history available</p>
            )}
          </div>
        </div>

        <div className="modal-footer">
          {isEditing ? (
            <div className="edit-actions">
              <button 
                onClick={handleSave}
                className="save-btn"
                disabled={loading}
              >
                {loading ? 'Saving...' : '💾 Save Changes'}
              </button>
              <button 
                onClick={handleCancel}
                className="cancel-btn"
                disabled={loading}
              >
                ❌ Cancel
              </button>
            </div>
          ) : (
            <button className="btn-close" onClick={onClose}>
              Close
            </button>
          )}
        </div>
      </div>
      
      {/* Admin Login Modal */}
      {showAdminLogin && (
        <AdminLogin
          onClose={() => setShowAdminLogin(false)}
          onSuccess={handleAdminLoginSuccess}
          purpose={`edit ${customer.name}'s details`}
        />
      )}
    </div>
  );
};

export default CustomerDetailsSimple;