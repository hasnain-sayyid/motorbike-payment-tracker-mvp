const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Detect production (Render)
const isProduction = process.env.NODE_ENV === 'production';

// In production, use /tmp (writable on Render)
const dbPath = isProduction
  ? path.join('/tmp', 'motorbike_payments.db')
  : path.join(__dirname, 'motorbike_payments.db');

console.log('📁 Using database at:', dbPath);

// Open database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Database connection error:', err.message);
  } else {
    console.log('✅ Database connected successfully');
  }
});

// Payment statuses
const PAYMENT_STATUSES = [
  { id: 'pending', name: 'Pending', color: '#ffc107' },
  { id: 'overdue', name: 'Overdue', color: '#dc3545' },
  { id: 'paid', name: 'Paid', color: '#28a745' },
  { id: 'reminder_sent', name: 'Reminder Sent', color: '#17a2b8' }
];

module.exports = {
  init: function () {
    console.log('🛠 Initializing database schema...');

    db.serialize(() => {
      // Create customers table
      db.run(`
        CREATE TABLE IF NOT EXISTS customers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          phone TEXT NOT NULL,
          monthlyAmount REAL NOT NULL,
          dueDate INTEGER NOT NULL,
          status TEXT DEFAULT 'pending',
          lastReminderSent DATETIME,
          notes TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('❌ Error creating customers table:', err.message);
        } else {
          console.log('✅ Customers table ready');
        }
      });
      
      // Create payment history table
      db.run(`
        CREATE TABLE IF NOT EXISTS payment_history (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          customerId INTEGER,
          amount REAL NOT NULL,
          paymentDate DATETIME DEFAULT CURRENT_TIMESTAMP,
          notes TEXT,
          FOREIGN KEY (customerId) REFERENCES customers (id)
        )
      `, (err) => {
        if (err) {
          console.error('❌ Error creating payment_history table:', err.message);
        } else {
          console.log('✅ Payment history table ready');
        }
      });
    });
  },

  // Customer management
  getAllCustomers: function (callback) {
    db.all(
      'SELECT * FROM customers ORDER BY dueDate ASC',
      callback
    );
  },

  getCustomerById: function (id, callback) {
    db.get(
      'SELECT * FROM customers WHERE id = ?',
      [id],
      callback
    );
  },

  createCustomer: function (name, phone, monthlyAmount, dueDate, notes, callback) {
    db.run(
      'INSERT INTO customers (name, phone, monthlyAmount, dueDate, notes) VALUES (?, ?, ?, ?, ?)',
      [name, phone, monthlyAmount, dueDate, notes || ''],
      function (err) {
        callback(err, this?.lastID);
      }
    );
  },

  updateCustomer: function (id, name, phone, monthlyAmount, dueDate, status, notes, callback) {
    db.run(
      'UPDATE customers SET name = ?, phone = ?, monthlyAmount = ?, dueDate = ?, status = ?, notes = ? WHERE id = ?',
      [name, phone, monthlyAmount, dueDate, status, notes || '', id],
      callback
    );
  },

  updateCustomerStatus: function (id, status, lastReminderSent, callback) {
    db.run(
      'UPDATE customers SET status = ?, lastReminderSent = ? WHERE id = ?',
      [status, lastReminderSent, id],
      callback
    );
  },

  deleteCustomer: function (id, callback) {
    db.run(
      'DELETE FROM customers WHERE id = ?',
      [id],
      callback
    );
  },

  // Get customers due today or overdue
  getCustomersDue: function (callback) {
    const today = new Date().getDate();
    db.all(
      `SELECT * FROM customers 
       WHERE dueDate <= ? AND status IN ('pending', 'overdue') 
       ORDER BY dueDate ASC`,
      [today],
      callback
    );
  },

  // Payment history
  addPayment: function (customerId, amount, notes, callback) {
    db.run(
      'INSERT INTO payment_history (customerId, amount, notes) VALUES (?, ?, ?)',
      [customerId, amount, notes || ''],
      function (err) {
        if (!err) {
          // Update customer status to paid
          db.run(
            'UPDATE customers SET status = ? WHERE id = ?',
            ['paid', customerId],
            () => callback(err, this?.lastID)
          );
        } else {
          callback(err, null);
        }
      }
    );
  },

  getPaymentHistory: function (customerId, callback) {
    db.all(
      'SELECT * FROM payment_history WHERE customerId = ? ORDER BY paymentDate DESC',
      [customerId],
      callback
    );
  },

  deletePayment: function (id, callback) {
    db.run(
      'DELETE FROM payment_history WHERE id = ?',
      [id],
      callback
    );
  },

  // Utility methods
  getCurrentMonth: function() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  },

  getPaymentStatuses: function () {
    return PAYMENT_STATUSES;
  }
};