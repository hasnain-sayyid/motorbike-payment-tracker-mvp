// Payment Tracker API

const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://motorbike-payment-tracker-api.onrender.com' 
    : 'http://localhost:5000');

// Customer management
export const fetchCustomers = async () => {
  const response = await fetch(`${API_BASE_URL}/api/customers`);
  if (!response.ok) throw new Error('Failed to fetch customers');
  return response.json();
};

export const fetchCustomer = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/customers/${id}`);
  if (!response.ok) throw new Error('Failed to fetch customer');
  return response.json();
};

export const createCustomer = async (customerData) => {
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
  const response = await fetch(`${API_BASE_URL}/api/customers/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete customer');
  return response.json();
};

// Payment management
export const fetchCustomersDue = async () => {
  const response = await fetch(`${API_BASE_URL}/api/customers-due`);
  if (!response.ok) throw new Error('Failed to fetch customers due');
  return response.json();
};

export const recordPayment = async (paymentData) => {
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

export const fetchPaymentHistory = async (customerId) => {
  const response = await fetch(`${API_BASE_URL}/api/customers/${customerId}/payments`);
  if (!response.ok) throw new Error('Failed to fetch payment history');
  return response.json();
};

// Reminder management
export const sendManualReminder = async (customerId) => {
  const response = await fetch(`${API_BASE_URL}/api/send-reminder/${customerId}`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to send reminder');
  return response.json();
};

export const testReminders = async () => {
  const response = await fetch(`${API_BASE_URL}/api/test-reminders`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to test reminders');
  return response.json();
};

// Utility
export const fetchPaymentStatuses = async () => {
  const response = await fetch(`${API_BASE_URL}/api/payment-statuses`);
  if (!response.ok) throw new Error('Failed to fetch payment statuses');
  return response.json();
};
