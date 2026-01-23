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
  const [deletedPaymentIds, setDeletedPaymentIds] = useState([]); // Track deleted payments

  // Update editedCustomer when customer prop changes (e.g., after recording a payment)
  useEffect(() => {
    if (!isEditing) { // Only update if not currently editing
      setEditedCustomer(customer);
      setDeletedPaymentIds([]); // Reset deleted payments when not editing
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
      id: Date.now(), // Temporary ID
      amount: 0,
      paymentDate: new Date().toISOString().split('T')[0],
      notes: ''
    };
    
    setEditedCustomer(prev => ({
      ...prev,
      paymentHistory: [...(prev.paymentHistory || []), newPayment]
    }));
  };

  const removePayment = (paymentIndex) => {
    const paymentToRemove = editedCustomer.paymentHistory[paymentIndex];
    
    // If it's a real payment from database (not a temporary one), track it for deletion
    if (paymentToRemove.id < 1000000000000) {
      setDeletedPaymentIds(prev => [...prev, paymentToRemove.id]);
    }
    
    setEditedCustomer(prev => ({
      ...prev,
      paymentHistory: prev.paymentHistory?.filter((_, index) => index !== paymentIndex) || []
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Step 1: Delete removed payments from database
      for (const paymentId of deletedPaymentIds) {
        try {
          await api.deletePayment(paymentId);
          console.log(`Payment ${paymentId} deleted`);
        } catch (deleteError) {
          console.error('Error deleting payment:', deleteError);
          alert(`Failed to delete payment ID ${paymentId}. Please try again.`);
          setLoading(false);
          return;
        }
      }
      
      // Step 2: Save new payments to database (payments with temporary IDs >= 1000000000000)
      const newPayments = editedCustomer.paymentHistory?.filter(payment => 
        payment.id >= 1000000000000 // These are temporary IDs from Date.now()
      ) || [];
      
      // Save each new payment via POST /api/payments
      for (const payment of newPayments) {
        try {
          await api.recordPayment({
            customerId: customer.id,
            amount: parseFloat(payment.amount) || 0,
            paymentDate: payment.paymentDate || payment.date || new Date().toISOString().split('T')[0],
            notes: payment.notes || ''
          });
        } catch (paymentError) {
          console.error('Error saving payment:', paymentError);
          alert(`Failed to save payment of ${payment.amount}. Please try again.`);
          setLoading(false);
          return;
        }
      }
      
      // Step 3: Update customer details (without payment history)
      const customerData = {
        name: editedCustomer.name,
        phone: editedCustomer.phone,
        bikeDetails: editedCustomer.bikeDetails,
        bikePrice: editedCustomer.bikePrice,
        downPayment: editedCustomer.downPayment,
        totalAmount: editedCustomer.totalAmount,
        monthlyAmount: editedCustomer.monthlyAmount,
        dueDate: editedCustomer.dueDate,
        agreementDate: editedCustomer.agreementDate,
        status: editedCustomer.status,
        notes: editedCustomer.notes
      };
      
      await api.updateCustomer(customer.id, customerData);
      
      // Step 4: Refresh customer data from server to get updated payment history
      const refreshedCustomer = await api.getCustomer(customer.id);
      
      setIsEditing(false);
      setDeletedPaymentIds([]); // Clear deleted payments list
      
      // Call parent onEdit to refresh the data
      if (onEdit) {
        onEdit(refreshedCustomer);
    setDeletedPaymentIds([]); // Clear deleted payments when canceling
      }
      
      alert('Customer details and payments saved successfully!');
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
    if (!dateString) return 'N/A';
    // Parse the date string as local date to avoid timezone issues
    const date = dateString.includes('T') ? dateString.split('T')[0] : dateString;
    const [year, month, day] = date.split('-');
    return `${month}/${day}/${year}`;
  };

  // Calculate total paid from payment history (all payments are considered completed)
  const totalPaid = editedCustomer.paymentHistory?.reduce((sum, payment) => 
    sum + Number(payment.amount || 0), 0) || 0;
    
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
                <span className="label">Agreement Date:</span>
                {isEditing ? (
                  <input
                    type="date"
                    value={editedCustomer.agreementDate || ''}
                    onChange={(e) => handleInputChange('agreementDate', e.target.value)}
                    className="edit-input"
                  />
                ) : (
                  <span className="value">
                    {customer.agreementDate ? new Date(customer.agreementDate).toLocaleDateString() : 'Not set'}
                  </span>
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
                  <span>Notes</span>
                  {isEditing && <span>Actions</span>}
                </div>
                {editedCustomer.paymentHistory.map((payment, index) => (
                  <div key={payment.id || index} className="payment-row">
                    <span>
                      {isEditing ? (
                        <input
                          type="date"
                          value={(payment.paymentDate || payment.date)?.split('T')[0] || ''}
                          onChange={(e) => handlePaymentHistoryChange(index, 'paymentDate', e.target.value)}
                          className="payment-input"
                        />
                      ) : (
                        formatDate(payment.paymentDate || payment.date)
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
                        <input
                          type="text"
                          value={payment.notes || ''}
                          onChange={(e) => handlePaymentHistoryChange(index, 'notes', e.target.value)}
                          className="payment-input"
                          placeholder="Payment notes"
                        />
                      ) : (
                        payment.notes || '-'
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