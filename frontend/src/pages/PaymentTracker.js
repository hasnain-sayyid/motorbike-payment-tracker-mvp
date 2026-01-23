import React, { useState, useEffect } from 'react';
import CustomerList from '../components/CustomerList';
import CustomerForm from '../components/CustomerForm';
import PaymentForm from '../components/PaymentForm';
import CustomerDetails from '../components/CustomerDetailsSimple';
import ExcelManager from '../components/ExcelManager';
import AdminStatus from '../components/AdminStatus';
import AdminLogin from '../components/AdminLogin';
import { useLanguage } from '../contexts/LanguageContext';
import { useAdmin } from '../contexts/AdminContext';
import * as api from '../api';
import './PaymentTracker.css';

const PaymentTracker = () => {
  const { t } = useLanguage();
  const { isAdminAuthenticated } = useAdmin();
  const [customers, setCustomers] = useState([]);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetailsCustomer, setShowDetailsCustomer] = useState(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await api.fetchCustomers();
        setCustomers(data);
        setError(null);
      } catch (err) {
        console.error('Error loading customers:', err);
        setError(t('failedToLoad'));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [t]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await api.fetchCustomers();
      setCustomers(data);
      setError(null);
    } catch (err) {
      console.error('Error loading customers:', err);
      setError(t('failedToLoad'));
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

  const handleViewDetails = (customer) => {
    setShowDetailsCustomer(customer);
  };

  const handleEditFromDetails = (customer) => {
    // When editing from details modal, refresh the data and close
    setShowDetailsCustomer(null);
    loadCustomers(); // Refresh the customer list
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
      
      // Store the customer ID whose details modal was open
      const openCustomerId = showDetailsCustomer?.id;
      
      // Refresh customer list with fresh data
      const updatedCustomers = await api.fetchCustomers();
      setCustomers(updatedCustomers);
      
      // Update the customer details modal if it was open
      if (openCustomerId) {
        const updatedCustomer = updatedCustomers.find(c => c.id === openCustomerId);
        if (updatedCustomer) {
          setShowDetailsCustomer(updatedCustomer);
        }
      }
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

  const handleTestSMS = async () => {
    const phoneNumber = prompt('Enter phone number to test SMS (with country code, e.g. +1234567890):');
    if (!phoneNumber) return;
    
    const message = prompt('Enter test message:', 'Hello! This is a test message from Motorbike Payment Tracker. 🏍️');
    if (!message) return;

    try {
      const response = await api.sendTestSMS(phoneNumber, message);
      if (response.demo) {
        alert('Test SMS sent (Demo Mode)! Check the browser console for the message.');
      } else {
        alert(`SMS sent successfully! ${response.message}`);
      }
    } catch (err) {
      console.error('Error sending test SMS:', err);
      alert('Failed to send test SMS: ' + err.message);
    }
  };

  const handleResetData = async () => {
    // Check if admin is authenticated (skip check if called after successful login)
    if (!isAdminAuthenticated) {
      setShowAdminLogin(true);
      return;
    }

    if (!window.confirm('⚠️ WARNING: This will permanently delete ALL customer data!\n\nThis action cannot be undone. Are you absolutely sure?')) {
      return;
    }

    try {
      const response = await api.resetMockData();
      alert(response.message);
      loadCustomers();
    } catch (err) {
      console.error('Error resetting data:', err);
      alert('Failed to reset data');
    }
  };

  const handleCustomersImported = (importedCustomers) => {
    // Refresh the customer list after import
    loadCustomers();
  };

  const handleAdminLoginSuccess = () => {
    setShowAdminLogin(false);
    // After successful login, proceed with reset data
    setTimeout(() => {
      handleResetData();
    }, 100);
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
          <h3>{t('connectionError')}</h3>
          <p>{error}</p>
          <button onClick={loadCustomers} className="btn-retry">
            {t('tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-tracker">
      <AdminStatus />
      
      <div className="header-section">
        <div className="header-content">
          <h1>🏍️ {t('title')}</h1>
          <p>{t('subtitle')}</p>
        </div>
        
        <div className="header-actions">
          <button onClick={handleAddCustomer} className="btn-primary">
            ➕ {t('addCustomer')}
          </button>
          
          <button onClick={handleTestReminders} className="btn-secondary">
            🧪 {t('testReminders')}
          </button>

          <button 
            onClick={handleTestSMS}
            className="btn-secondary"
            style={{background: '#9C27B0', color: 'white'}}
            title="Send test SMS to any phone number"
          >
            📱 Test SMS
          </button>

          <button 
            onClick={handleResetData} 
            className="btn-secondary"
            style={{background: '#dc3545', color: 'white'}}
            title={isAdminAuthenticated ? "Reset all data to defaults (Password Protected)" : "Reset all data (Admin Login Required)"}
          >
            {isAdminAuthenticated ? '🔄 Reset Data' : '🔒 Reset Data'}
          </button>
        </div>
      </div>

      <ExcelManager onCustomersImported={handleCustomersImported} />

      <CustomerList
        customers={customers}
        onEditCustomer={handleEditCustomer}
        onDeleteCustomer={handleDeleteCustomer}
        onRecordPayment={handleRecordPayment}
        onSendReminder={handleSendReminder}
        onViewDetails={handleViewDetails}
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

      {showDetailsCustomer && (
        <CustomerDetails
          customer={showDetailsCustomer}
          onClose={() => setShowDetailsCustomer(null)}
          onEdit={handleEditFromDetails}
        />
      )}

      {showAdminLogin && (
        <AdminLogin
          onSuccess={handleAdminLoginSuccess}
          onClose={() => setShowAdminLogin(false)}
          purpose="reset customer data"
        />
      )}
    </div>
  );
};

export default PaymentTracker;