// Payment Tracker API
import { exportCustomersToExcel, exportSingleCustomerToExcel, importCustomersFromExcel } from './utils/excelUtils';

// Always use localhost for local development, even in production build
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (isLocalhost 
    ? 'http://localhost:5000'
    : process.env.NODE_ENV === 'production' 
      ? 'https://motorbike-payment-tracker-api.onrender.com' 
      : 'http://localhost:5000');

// Mock data for demonstration
const ORIGINAL_MOCK_CUSTOMERS = [
  {
    id: 1,
    name: "Hasnain",
    phone: "0000000",
    bikeDetails: "Honda CB 2024",
    bikePrice: 150000,
    downPayment: 30000,
    totalAmount: 150000,
    monthlyAmount: 5000,
    dueDate: "14",
    status: "active",
    nextDue: new Date(2026, 0, 14).toISOString(),
    lastPayment: new Date(2025, 11, 14).toISOString(),
    paymentHistory: [
      { id: 1, amount: 30000, date: '2025-06-15', type: 'down_payment', status: 'completed' },
      { id: 2, amount: 5000, date: '2025-07-14', type: 'monthly', status: 'completed' },
      { id: 3, amount: 5000, date: '2025-08-14', type: 'monthly', status: 'completed' },
      { id: 4, amount: 5000, date: '2025-09-14', type: 'monthly', status: 'completed' },
      { id: 5, amount: 5000, date: '2025-10-14', type: 'monthly', status: 'completed' },
      { id: 6, amount: 5000, date: '2025-11-14', type: 'monthly', status: 'completed' },
      { id: 7, amount: 5000, date: '2025-12-14', type: 'monthly', status: 'completed' }
    ]
  },
  {
    id: 2,
    name: "Ahmad",
    phone: "0000000",
    bikeDetails: "Yamaha FZ 2024",
    bikePrice: 120000,
    downPayment: 20000,
    totalAmount: 120000,
    monthlyAmount: 4000,
    dueDate: "20",
    status: "overdue",
    nextDue: new Date(2025, 11, 20).toISOString(),
    lastPayment: new Date(2025, 10, 20).toISOString(),
    paymentHistory: [
      { id: 8, amount: 20000, date: '2025-05-20', type: 'down_payment', status: 'completed' },
      { id: 9, amount: 4000, date: '2025-06-20', type: 'monthly', status: 'completed' },
      { id: 10, amount: 4000, date: '2025-07-20', type: 'monthly', status: 'completed' },
      { id: 11, amount: 4000, date: '2025-08-20', type: 'monthly', status: 'completed' },
      { id: 12, amount: 4000, date: '2025-09-20', type: 'monthly', status: 'completed' },
      { id: 13, amount: 4000, date: '2025-10-20', type: 'monthly', status: 'completed' }
    ]
  }
];

// Session storage for mock data persistence
const STORAGE_KEY = 'motorbike_payment_tracker_customers';

// Initialize session data from localStorage or default data
const initializeSessionData = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsedData = JSON.parse(stored);
      // Ensure the data is an array and not empty
      if (Array.isArray(parsedData) && parsedData.length > 0) {
        return parsedData;
      }
    }
  } catch (error) {
    console.error('Error loading stored data:', error);
  }
  // If no valid stored data, initialize with original mock data
  const initialData = [...ORIGINAL_MOCK_CUSTOMERS];
  saveSessionData(initialData);
  return initialData;
};

const saveSessionData = (customers) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
    console.log('Data saved to localStorage:', customers.length, 'customers');
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

// Add a simple test function
export const testLocalStorage = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const parsed = JSON.parse(stored);
    console.log('LocalStorage contains:', parsed.length, 'customers');
    parsed.forEach((customer, index) => {
      console.log(`${index + 1}. ${customer.name} - ${customer.paymentHistory?.length || 0} payments`);
    });
    return { success: true, count: parsed.length };
  } else {
    console.log('No data in localStorage');
    return { success: false, message: 'No data found' };
  }
};

let sessionMockCustomers = initializeSessionData();

// Reset function for development/testing
export const resetMockData = () => {
  if (process.env.NODE_ENV === 'production') {
    sessionMockCustomers = [...ORIGINAL_MOCK_CUSTOMERS];
    saveSessionData(sessionMockCustomers);
    return { success: true, message: 'Mock data reset to defaults' };
  }
  return { success: false, message: 'Reset only available in production mode' };
};

// Fix existing payments with wrong status
export const fixPaymentStatuses = () => {
  if (process.env.NODE_ENV === 'production') {
    const currentData = initializeSessionData();
    let fixedCount = 0;
    
    currentData.forEach(customer => {
      if (customer.paymentHistory) {
        customer.paymentHistory.forEach(payment => {
          // Fix any recorded payments that are marked as pending
          if (payment.status === 'pending' && payment.amount > 0) {
            payment.status = 'completed';
            fixedCount++;
          }
        });
      }
    });
    
    if (fixedCount > 0) {
      saveSessionData(currentData);
      sessionMockCustomers = currentData;
    }
    
    return { success: true, message: `Fixed ${fixedCount} payment statuses`, count: fixedCount };
  }
  return { success: false, message: 'Fix only available in production mode' };
};

// Customer management
export const fetchCustomers = async () => {
  // Always use API when running on localhost
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  // Always use API for localhost, regardless of build mode
  if (isLocalhost) {
    const response = await fetch(`${API_BASE_URL}/api/customers`);
    if (!response.ok) throw new Error('Failed to fetch customers');
    return response.json();
  }
  
  // For production deployment on external servers, use session mock data
  if (process.env.NODE_ENV === 'production') {
    // Always read fresh data from localStorage
    const freshData = initializeSessionData();
    sessionMockCustomers = freshData;
    return new Promise(resolve => {
      setTimeout(() => resolve([...freshData]), 300);
    });
  }
  
  const response = await fetch(`${API_BASE_URL}/api/customers`);
  if (!response.ok) throw new Error('Failed to fetch customers');
  return response.json();
};

export const fetchCustomer = async (id) => {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  if (isLocalhost) {
    const response = await fetch(`${API_BASE_URL}/api/customers/${id}`);
    if (!response.ok) throw new Error('Failed to fetch customer');
    return response.json();
  }
  
  // For production deployment, use session mock data
  if (process.env.NODE_ENV === 'production') {
    const customer = sessionMockCustomers.find(c => c.id === parseInt(id));
    if (!customer) throw new Error('Customer not found');
    return new Promise(resolve => {
      setTimeout(() => resolve({ ...customer }), 300);
    });
  }
  
  const response = await fetch(`${API_BASE_URL}/api/customers/${id}`);
  if (!response.ok) throw new Error('Failed to fetch customer');
  return response.json();
};

// Alias for consistency
export const getCustomer = fetchCustomer;

export const createCustomer = async (customerData) => {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  if (isLocalhost) {
    const response = await fetch(`${API_BASE_URL}/api/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });
    if (!response.ok) throw new Error('Failed to create customer');
    return response.json();
  }
  
  // For production deployment, add to session mock data
  if (process.env.NODE_ENV === 'production') {
    return new Promise(resolve => {
      const newCustomer = {
        id: Date.now(),
        ...customerData,
        status: 'active',
        nextDue: new Date().toISOString(),
        lastPayment: null,
        paymentHistory: []
      };
      
      // If customer has a down payment, add it to payment history
      if (customerData.downPayment && customerData.downPayment > 0) {
        newCustomer.paymentHistory.push({
          id: Date.now() + 1,
          amount: customerData.downPayment,
          date: new Date().toISOString(),
          type: 'down_payment',
          status: 'completed',
          notes: 'Initial down payment'
        });
        newCustomer.lastPayment = new Date().toISOString();
      }
      
      sessionMockCustomers.push(newCustomer);
      saveSessionData(sessionMockCustomers); // Persist to localStorage
      setTimeout(() => resolve(newCustomer), 500);
    });
  }

  const response = await fetch(`${API_BASE_URL}/api/customers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customerData),
  });
  if (!response.ok) throw new Error('Failed to create customer');
  return response.json();
};

export const updateCustomer = async (id, customerData) => {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  if (isLocalhost) {
    const response = await fetch(`${API_BASE_URL}/api/customers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });
    if (!response.ok) throw new Error('Failed to update customer');
    return response.json();
  }
  
  // For production deployment, update session mock data
  if (process.env.NODE_ENV === 'production') {
    return new Promise((resolve) => {
      setTimeout(() => {
        const customerIndex = sessionMockCustomers.findIndex(c => c.id === parseInt(id));
        if (customerIndex !== -1) {
          // Update the customer in session storage
          sessionMockCustomers[customerIndex] = {
            ...sessionMockCustomers[customerIndex],
            ...customerData,
            id: parseInt(id), // Ensure ID stays as number
            lastUpdated: new Date().toISOString()
          };
          saveSessionData(sessionMockCustomers); // Persist to localStorage
          resolve(sessionMockCustomers[customerIndex]);
        } else {
          throw new Error('Customer not found');
        }
      }, 500);
    });
  }

  const response = await fetch(`${API_BASE_URL}/api/customers/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customerData),
  });
  if (!response.ok) throw new Error('Failed to update customer');
  return response.json();
};

export const deleteCustomer = async (id) => {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  if (isLocalhost) {
    const response = await fetch(`${API_BASE_URL}/api/customers/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete customer');
    return response.json();
  }
  
  // For production deployment, remove from session mock data
  if (process.env.NODE_ENV === 'production') {
    return new Promise(resolve => {
      const customerIndex = sessionMockCustomers.findIndex(c => c.id === parseInt(id));
      if (customerIndex !== -1) {
        sessionMockCustomers.splice(customerIndex, 1);
        saveSessionData(sessionMockCustomers); // Persist to localStorage
      }
      setTimeout(() => resolve({ success: true, message: 'Customer deleted successfully' }), 300);
    });
  }

  const response = await fetch(`${API_BASE_URL}/api/customers/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete customer');
  return response.json();
};

// Payment management
export const fetchCustomersDue = async () => {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  if (isLocalhost) {
    const response = await fetch(`${API_BASE_URL}/api/customers-due`);
    if (!response.ok) throw new Error('Failed to fetch customers due');
    return response.json();
  }
  
  // For production deployment, use session mock data
  if (process.env.NODE_ENV === 'production') {
    const dueCustomers = sessionMockCustomers.filter(c => c.status === 'overdue' || c.status === 'pending');
    return new Promise(resolve => {
      setTimeout(() => resolve(dueCustomers), 300);
    });
  }

  const response = await fetch(`${API_BASE_URL}/api/customers-due`);
  if (!response.ok) throw new Error('Failed to fetch customers due');
  return response.json();
};

export const recordPayment = async (paymentData) => {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  if (isLocalhost) {
    const response = await fetch(`${API_BASE_URL}/api/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });
    if (!response.ok) throw new Error('Failed to record payment');
    return response.json();
  }
  
  // For production deployment, add payment to session mock data
  if (process.env.NODE_ENV === 'production') {
    return new Promise(resolve => {
      // Read fresh data from localStorage
      const currentData = initializeSessionData();
      
      const customerIndex = currentData.findIndex(c => c.id === parseInt(paymentData.customerId));
      
      if (customerIndex !== -1) {
        const newPayment = {
          id: Date.now(),
          amount: Number(paymentData.amount),
          paymentDate: paymentData.paymentDate || new Date().toISOString(),
          type: 'monthly',
          status: 'completed', // Always set as completed for recorded payments
          notes: paymentData.notes || 'Payment recorded'
        };
        
        // Ensure paymentHistory exists
        if (!currentData[customerIndex].paymentHistory) {
          currentData[customerIndex].paymentHistory = [];
        }
        
        // Add payment to customer's payment history
        currentData[customerIndex].paymentHistory.push(newPayment);
        
        // Update customer's last payment date
        currentData[customerIndex].lastPayment = new Date().toISOString();
        
        // Update customer status to 'paid' when payment is recorded
        currentData[customerIndex].status = 'paid';
        
        // Save updated data to localStorage
        saveSessionData(currentData);
        
        // Update the in-memory copy
        sessionMockCustomers = currentData;
      }
      
      setTimeout(() => resolve({
        success: true,
        message: 'Payment recorded successfully!',
        payment: {
          id: Date.now(),
          ...paymentData,
          recordedAt: new Date().toISOString()
        }
      }), 300);
    });
  }

  const response = await fetch(`${API_BASE_URL}/api/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(paymentData),
  });
  if (!response.ok) throw new Error('Failed to record payment');
  return response.json();
};

export const deletePayment = async (paymentId) => {
  // Always use the real backend API for deleting payments
  const response = await fetch(`${API_BASE_URL}/api/payments/${paymentId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to delete payment' }));
    throw new Error(error.error || 'Failed to delete payment');
  }
  
  return response.json();
};

export const fetchPaymentHistory = async (customerId) => {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  if (isLocalhost) {
    const response = await fetch(`${API_BASE_URL}/api/customers/${customerId}/payments`);
    if (!response.ok) throw new Error('Failed to fetch payment history');
    return response.json();
  }
  
  // For production deployment, get payment history from session mock data
  if (process.env.NODE_ENV === 'production') {
    return new Promise(resolve => {
      const customer = sessionMockCustomers.find(c => c.id === parseInt(customerId));
      const paymentHistory = customer?.paymentHistory || [];
      setTimeout(() => resolve(paymentHistory), 300);
    });
  }

  const response = await fetch(`${API_BASE_URL}/api/customers/${customerId}/payments`);
  if (!response.ok) throw new Error('Failed to fetch payment history');
  return response.json();
};

// Reminder management
export const sendManualReminder = async (customerId) => {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  if (isLocalhost) {
    const response = await fetch(`${API_BASE_URL}/api/send-reminder/${customerId}`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to send reminder');
    return response.json();
  }
  
  // For production deployment, simulate reminder sent
  if (process.env.NODE_ENV === 'production') {
    return new Promise(resolve => {
      setTimeout(() => resolve({
        success: true,
        demo: true,
        message: 'Reminder sent successfully (Demo Mode)',
        customerId: customerId
      }), 1000);
    });
  }

  const response = await fetch(`${API_BASE_URL}/api/send-reminder/${customerId}`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to send reminder');
  return response.json();
};

export const testReminders = async () => {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  if (isLocalhost) {
    const response = await fetch(`${API_BASE_URL}/api/test-reminders`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to test reminders');
    return response.json();
  }
  
  // For production deployment, simulate test reminders
  if (process.env.NODE_ENV === 'production') {
    return new Promise(resolve => {
      setTimeout(() => resolve({
        success: true,
        message: 'Test reminders processed: 2 reminders sent (Demo Mode)',
        processed: 2
      }), 1500);
    });
  }

  const response = await fetch(`${API_BASE_URL}/api/test-reminders`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to test reminders');
  return response.json();
};

export const sendTestSMS = async (phoneNumber, message) => {
  const response = await fetch(`${API_BASE_URL}/api/test-sms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ phoneNumber, message }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to send test SMS');
  }
  return response.json();
};

// Utility
export const fetchPaymentStatuses = async () => {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  if (isLocalhost) {
    const response = await fetch(`${API_BASE_URL}/api/payment-statuses`);
    if (!response.ok) throw new Error('Failed to fetch payment statuses');
    return response.json();
  }
  
  // For production deployment, return static statuses
  if (process.env.NODE_ENV === 'production') {
    return new Promise(resolve => {
      setTimeout(() => resolve(['paid', 'pending', 'overdue', 'active']), 200);
    });
  }

  const response = await fetch(`${API_BASE_URL}/api/payment-statuses`);
  if (!response.ok) throw new Error('Failed to fetch payment statuses');
  return response.json();
};

// Excel Export/Import Functions
export const exportAllCustomersToExcel = async () => {
  try {
    const customers = await fetchCustomers();
    return exportCustomersToExcel(customers);
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'Failed to export customers to Excel'
    };
  }
};

export const exportCustomerToExcel = async (customerId) => {
  try {
    const customer = await fetchCustomer(customerId);
    return exportSingleCustomerToExcel(customer);
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'Failed to export customer to Excel'
    };
  }
};

export const importCustomersFromExcelFile = async (file) => {
  try {
    console.log('API: Starting import for file:', file.name);
    const result = await importCustomersFromExcel(file);
    console.log('API: Import result received:', result);
    
    if (result.success && result.customers && result.customers.length > 0) {
      // For production deployment, add imported customers to session storage
      console.log('API: Adding customers to session storage');
      
      // Get current data first
      const currentData = initializeSessionData();
      console.log('API: Current data length:', currentData.length);
      
      // Add new customers (avoid duplicates by checking names and phones)
      const newCustomers = result.customers.filter(newCustomer => {
        return !currentData.some(existing => 
          existing.name === newCustomer.name && existing.phone === newCustomer.phone
        );
      });
      
      console.log('API: New customers to add:', newCustomers.length);
      
      // Add the new customers
      newCustomers.forEach(customer => {
        sessionMockCustomers.push(customer);
      });
      
      // Save to localStorage
      saveSessionData(sessionMockCustomers);
      console.log('API: Data saved to localStorage, total customers:', sessionMockCustomers.length);
      
      return {
        ...result,
        addedCount: newCustomers.length,
        message: `Successfully imported ${result.customers.length} customers (${newCustomers.length} new, ${result.customers.length - newCustomers.length} duplicates skipped)`
      };
    }
    
    return result;
  } catch (error) {
    console.error('API: Import error:', error);
    return {
      success: false,
      error: error.message || 'Unknown error',
      message: 'Failed to import customers from Excel: ' + (error.message || 'Unknown error')
    };
  }
};

// Auto-save to Excel (periodic backup)
export const autoSaveToExcel = async () => {
  try {
    const customers = await fetchCustomers();
    const result = exportCustomersToExcel(customers);
    
    if (result.success) {
      console.log(`Auto-backup created: ${result.filename}`);
    }
    
    return result;
  } catch (error) {
    console.error('Auto-save to Excel failed:', error);
    return {
      success: false,
      error: error.message,
      message: 'Auto-save to Excel failed'
    };
  }
};
