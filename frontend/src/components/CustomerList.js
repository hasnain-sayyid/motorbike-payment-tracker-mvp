import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './CustomerList.css';

const CustomerList = ({ 
  customers, 
  onEditCustomer, 
  onDeleteCustomer, 
  onRecordPayment, 
  onSendReminder,
  onViewDetails 
}) => {
  const { t } = useLanguage();
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
        return t('paid');
      case 'pending':
        return t('due');
      case 'overdue':
        return t('overdue');
      case 'reminder_sent':
        return t('overdue');
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

  const sortCustomersByStatus = (customersToSort) => {
    const statusOrder = { overdue: 1, pending: 2, reminder_sent: 1, paid: 3 };
    return [...customersToSort].sort((a, b) => {
      const priorityA = statusOrder[a.status] || 4;
      const priorityB = statusOrder[b.status] || 4;
      return priorityA - priorityB;
    });
  };

  const sortedCustomers = sortCustomersByStatus(customers);

  return (
    <div className="customer-list">
      <div className="list-header">
        <h2>{t('customerPaymentTracking')}</h2>
        <div className="stats">
          <span className="stat">
            <span className="stat-number">{sortedCustomers.length}</span>
            <span className="stat-label">{t('totalCustomers')}</span>
          </span>
          <span className="stat">
            <span className="stat-number">
              {(() => {
                const overdueCount = sortedCustomers.filter(c => c.status === 'overdue').length;
                const pendingCount = sortedCustomers.filter(c => c.status === 'pending').length;
                const total = overdueCount + pendingCount;
                console.log('Due/Overdue Stats Debug:', {
                  overdueCount,
                  pendingCount, 
                  total,
                  customerStatuses: sortedCustomers.map(c => ({ name: c.name, status: c.status }))
                });
                return total;
              })()}
            </span>
            <span className="stat-label">{t('dueOverdue')}</span>
          </span>
          <span className="stat">
            <span className="stat-number">
              {sortedCustomers.filter(c => c.status === 'paid').length}
            </span>
            <span className="stat-label">{t('paidThisMonth')}</span>
          </span>
        </div>
      </div>

      {sortedCustomers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>{t('noCustomers')}</h3>
          <p>{t('addCustomer')}</p>
        </div>
      ) : (
        <div className="customer-grid">
          {sortedCustomers.map((customer) => (
            <div 
              key={customer.id} 
              className={`customer-card ${isDue(customer) ? 'due' : ''}`}
            >
              <div className="customer-header">
                <div className="customer-info">
                  <h3>
                    {customer.name}
                    <button 
                      onClick={() => onViewDetails(customer)}
                      className="btn-details"
                      title={t('details')}
                    >
                      📊 {t('details')}
                    </button>
                  </h3>
                  <p className="phone">
                    {customer.phone}
                    <button 
                      onClick={() => onEditCustomer(customer)}
                      className="btn-edit-phone"
                      title={t('phoneNumber')}
                    >
                      📞
                    </button>
                  </p>
                </div>
                <div 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(customer.status) }}
                >
                  {getStatusText(customer.status)}
                </div>
              </div>

              <div className="customer-details">
                {customer.bikeDetails && (
                  <div className="detail-item">
                    <span className="label">Bike:</span>
                    <span className="value">{customer.bikeDetails}</span>
                  </div>
                )}
                <div className="detail-item">
                  <span className="label">{t('monthlyAmount')}:</span>
                  <span className="value">{customer.monthlyAmount}</span>
                </div>
                <div className="detail-item">
                  <span className="label">{t('dueDate')}:</span>
                  <span className="value">{customer.dueDate} {t('ofEachMonth')}</span>
                </div>
                {customer.lastReminderSent && (
                  <div className="detail-item">
                    <span className="label">Last Reminder:</span>
                    <span className="value">{formatDate(customer.lastReminderSent)}</span>
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
                      💰 {t('recordPayment')}
                    </button>
                    <button 
                      onClick={() => onSendReminder(customer.id)}
                      className="btn-action btn-reminder"
                    >
                      📱 {t('sendReminder')}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerList;