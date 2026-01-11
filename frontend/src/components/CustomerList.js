import React from 'react';
import './CustomerList.css';

const CustomerList = ({ 
  customers, 
  onEditCustomer, 
  onDeleteCustomer, 
  onRecordPayment, 
  onSendReminder 
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return '#28a745';
      case 'pending':
        return '#ffc107';
      case 'overdue':
        return '#dc3545';
      case 'reminder_sent':
        return '#17a2b8';
      default:
        return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'paid':
        return 'Paid';
      case 'pending':
        return 'Pending';
      case 'overdue':
        return 'Overdue';
      case 'reminder_sent':
        return 'Reminder Sent';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  const isDue = (customer) => {
    const today = new Date().getDate();
    return customer.dueDate <= today && customer.status !== 'paid';
  };

  return (
    <div className="customer-list">
      <div className="list-header">
        <h2>Customer Payment Tracking</h2>
        <div className="stats">
          <span className="stat">
            <span className="stat-number">{customers.length}</span>
            <span className="stat-label">Total Customers</span>
          </span>
          <span className="stat">
            <span className="stat-number">
              {customers.filter(c => c.status === 'overdue' || isDue(c)).length}
            </span>
            <span className="stat-label">Due/Overdue</span>
          </span>
          <span className="stat">
            <span className="stat-number">
              {customers.filter(c => c.status === 'paid').length}
            </span>
            <span className="stat-label">Paid This Month</span>
          </span>
        </div>
      </div>

      {customers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No customers added yet</h3>
          <p>Add your first customer to start tracking payments</p>
        </div>
      ) : (
        <div className="customer-grid">
          {customers.map((customer) => (
            <div 
              key={customer.id} 
              className={`customer-card ${isDue(customer) ? 'due' : ''}`}
            >
              <div className="customer-header">
                <div className="customer-info">
                  <h3>{customer.name}</h3>
                  <p className="phone">{customer.phone}</p>
                </div>
                <div 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(customer.status) }}
                >
                  {getStatusText(customer.status)}
                </div>
              </div>

              <div className="customer-details">
                <div className="detail-item">
                  <span className="label">Monthly Amount:</span>
                  <span className="value">₹{customer.monthlyAmount}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Due Date:</span>
                  <span className="value">{customer.dueDate}th of each month</span>
                </div>
                {customer.lastReminderSent && (
                  <div className="detail-item">
                    <span className="label">Last Reminder:</span>
                    <span className="value">{formatDate(customer.lastReminderSent)}</span>
                  </div>
                )}
                {customer.notes && (
                  <div className="detail-item">
                    <span className="label">Notes:</span>
                    <span className="value notes">{customer.notes}</span>
                  </div>
                )}
              </div>

              <div className="customer-actions">
                {customer.status !== 'paid' && (
                  <>
                    <button 
                      onClick={() => onRecordPayment(customer)}
                      className="btn-action btn-payment"
                    >
                      💰 Record Payment
                    </button>
                    <button 
                      onClick={() => onSendReminder(customer.id)}
                      className="btn-action btn-reminder"
                    >
                      📱 Send Reminder
                    </button>
                  </>
                )}
                
                <div className="secondary-actions">
                  <button 
                    onClick={() => onEditCustomer(customer)}
                    className="btn-secondary"
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    onClick={() => onDeleteCustomer(customer.id, customer.name)}
                    className="btn-secondary btn-danger"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerList;