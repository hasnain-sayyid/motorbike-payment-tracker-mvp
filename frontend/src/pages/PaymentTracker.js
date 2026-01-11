import React, { useState, useEffect } from 'react';
import CustomerList from '../components/CustomerList';
import CustomerForm from '../components/CustomerForm';
import PaymentForm from '../components/PaymentForm';
import * as api from '../api';
import './PaymentTracker.css';

const PaymentTracker = () => {
  const [customers, setCustomers] = useState([]);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await api.fetchCustomers();
      setCustomers(data);
      setError(null);
    } catch (err) {
      console.error('Error loading customers:', err);
      setError('Failed to load customers. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setShowCustomerForm(true);
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setShowCustomerForm(true);
  };

  const handleDeleteCustomer = async (customerId, customerName) => {
    if (!window.confirm(`Are you sure you want to delete ${customerName}?`)) {
      return;
    }

    try {
      await api.deleteCustomer(customerId);
      alert('Customer deleted successfully');
      loadCustomers();
    } catch (err) {
      console.error('Error deleting customer:', err);
      alert('Failed to delete customer');
    }
  };

  const handleRecordPayment = (customer) => {
    setSelectedCustomer(customer);
    setShowPaymentForm(true);
  };

  const handleSendReminder = async (customerId) => {
    try {
      const response = await api.sendManualReminder(customerId);
      if (response.demo) {
        alert('Reminder sent (Demo Mode)! Check the server console for the message.');
      } else {
        alert('Reminder sent successfully!');
      }
      loadCustomers();
    } catch (err) {
      console.error('Error sending reminder:', err);
      alert('Failed to send reminder');
    }
  };

  const handleCustomerSubmit = async (customerData) => {
    try {
      if (editingCustomer) {
        await api.updateCustomer(editingCustomer.id, customerData);
        alert('Customer updated successfully');
      } else {
        await api.createCustomer(customerData);
        alert('Customer added successfully');
      }
      
      setShowCustomerForm(false);
      setEditingCustomer(null);
      loadCustomers();
    } catch (err) {
      console.error('Error saving customer:', err);
      alert('Failed to save customer');
    }
  };

  const handlePaymentSubmit = async (paymentData) => {
    try {
      await api.recordPayment(paymentData);
      alert('Payment recorded successfully!');
      setShowPaymentForm(false);
      setSelectedCustomer(null);
      loadCustomers();
    } catch (err) {
      console.error('Error recording payment:', err);
      alert('Failed to record payment');
    }
  };

  const handleTestReminders = async () => {
    if (!window.confirm('This will send test reminders to all due customers. Continue?')) {
      return;
    }

    try {
      const response = await api.testReminders();
      alert(`Test reminders processed: ${response.message}`);
      console.log('Test reminder results:', response);
      loadCustomers();
    } catch (err) {
      console.error('Error testing reminders:', err);
      alert('Failed to test reminders');
    }
  };

  if (loading) {
    return (
      <div className="payment-tracker">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading customers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-tracker">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Connection Error</h3>
          <p>{error}</p>
          <button onClick={loadCustomers} className="btn-retry">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-tracker">
      <div className="header-section">
        <div className="header-content">
          <h1>🏍️ Motorbike Payment Tracker</h1>
          <p>Automated payment tracking and reminders for your installment business</p>
        </div>
        
        <div className="header-actions">
          <button onClick={handleAddCustomer} className="btn-primary">
            ➕ Add Customer
          </button>
          
          <button onClick={handleTestReminders} className="btn-secondary">
            🧪 Test Reminders
          </button>
        </div>
      </div>

      <CustomerList
        customers={customers}
        onEditCustomer={handleEditCustomer}
        onDeleteCustomer={handleDeleteCustomer}
        onRecordPayment={handleRecordPayment}
        onSendReminder={handleSendReminder}
      />

      {showCustomerForm && (
        <CustomerForm
          customer={editingCustomer}
          onSubmit={handleCustomerSubmit}
          onCancel={() => {
            setShowCustomerForm(false);
            setEditingCustomer(null);
          }}
        />
      )}

      {showPaymentForm && selectedCustomer && (
        <PaymentForm
          customer={selectedCustomer}
          onSubmit={handlePaymentSubmit}
          onCancel={() => {
            setShowPaymentForm(false);
            setSelectedCustomer(null);
          }}
        />
      )}
    </div>
  );
};

export default PaymentTracker;