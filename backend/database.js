const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Detect if we're actually on a cloud platform (not just production mode for SMS)
const isCloudPlatform = process.env.RENDER || process.env.RAILWAY_ENVIRONMENT;

// Use local path for local development, even in production mode
const dbPath = isCloudPlatform
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
          bikeDetails TEXT,
          bikePrice REAL,
          downPayment REAL,
          totalAmount REAL,
          monthlyAmount REAL NOT NULL,
          dueDate INTEGER NOT NULL,
          agreementDate DATE,
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
          
          // Add missing columns to existing table if they don't exist
          db.run('ALTER TABLE customers ADD COLUMN bikeDetails TEXT', () => {});
          db.run('ALTER TABLE customers ADD COLUMN bikePrice REAL', () => {});
          db.run('ALTER TABLE customers ADD COLUMN downPayment REAL', () => {});
          db.run('ALTER TABLE customers ADD COLUMN totalAmount REAL', () => {});
          db.run('ALTER TABLE customers ADD COLUMN agreementDate DATE', () => {});
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

  // Helper function to calculate status dynamically
  calculateCustomerStatus: function (customer) {
    const today = new Date().getDate();
    const dueDate = customer.dueDate;
    
    // If already paid, keep the paid status
    if (customer.status === 'paid') {
      return 'paid';
    }
    
    // If today is past the due date, status is overdue
    if (today > dueDate) {
      return 'overdue';
    }
    
    // If today is the due date, status is pending (due)
    if (today === dueDate) {
      return 'pending';
    }
    
    // If today is before the due date, status is pending
    return 'pending';
  },

  // Customer management
  getAllCustomers: function (callback) {
    db.all(
      'SELECT * FROM customers ORDER BY dueDate ASC',
      (err, customers) => {
        if (err) {
          callback(err, null);
          return;
        }
        
        // Calculate dynamic status for each customer
        if (customers) {
          customers = customers.map(customer => {
            const calculatedStatus = module.exports.calculateCustomerStatus(customer);
            
            // Update status in database if it changed (except for reminder_sent)
            if (calculatedStatus !== customer.status && customer.status !== 'reminder_sent') {
              db.run(
                'UPDATE customers SET status = ? WHERE id = ?',
                [calculatedStatus, customer.id],
                (updateErr) => {
                  if (updateErr) {
                    console.error(`Error updating status for customer ${customer.id}:`, updateErr);
                  }
                }
              );
            }
            
            return { ...customer, status: calculatedStatus };
          });
        }
        
        callback(null, customers);
      }
    );
  },

  getCustomerById: function (id, callback) {
    db.get(
      'SELECT * FROM customers WHERE id = ?',
      [id],
      (err, customer) => {
        if (err || !customer) {
          callback(err, customer);
          return;
        }
        
        // Calculate dynamic status
        const calculatedStatus = module.exports.calculateCustomerStatus(customer);
        
        // Update status in database if it changed (except for reminder_sent)
        if (calculatedStatus !== customer.status && customer.status !== 'reminder_sent') {
          db.run(
            'UPDATE customers SET status = ? WHERE id = ?',
            [calculatedStatus, customer.id],
            (updateErr) => {
              if (updateErr) {
                console.error(`Error updating status for customer ${customer.id}:`, updateErr);
              }
            }
          );
        }
        
        callback(null, { ...customer, status: calculatedStatus });
      }
    );
  },

  createCustomer: function (customerData, callback) {
    const { name, phone, bikeDetails, bikePrice, downPayment, totalAmount, monthlyAmount, dueDate, agreementDate, notes } = customerData;
    
    db.run(
      `INSERT INTO customers (name, phone, bikeDetails, bikePrice, downPayment, totalAmount, monthlyAmount, dueDate, agreementDate, notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, phone, bikeDetails || null, bikePrice || null, downPayment || null, totalAmount || null, monthlyAmount, dueDate, agreementDate || null, notes || ''],
      function (err) {
        callback(err, this?.lastID);
      }
    );
  },

  updateCustomer: function (id, customerData, callback) {
    // Extract all customer fields
    const { name, phone, bikeDetails, bikePrice, downPayment, totalAmount, monthlyAmount, dueDate, agreementDate, status, notes } = customerData;
    
    db.run(
      `UPDATE customers SET 
        name = ?, 
        phone = ?, 
        bikeDetails = ?,
        bikePrice = ?,
        downPayment = ?,
        totalAmount = ?,
        monthlyAmount = ?, 
        dueDate = ?, 
        agreementDate = ?,
        status = ?, 
        notes = ? 
      WHERE id = ?`,
      [name, phone, bikeDetails || null, bikePrice || null, downPayment || null, totalAmount || null, monthlyAmount, dueDate, agreementDate || null, status, notes || '', id],
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
       WHERE dueDate <= ? AND status != 'paid'
       ORDER BY dueDate ASC`,
      [today],
      (err, customers) => {
        if (err) {
          callback(err, null);
          return;
        }
        
        // Calculate dynamic status for each customer
        if (customers) {
          customers = customers.map(customer => {
            const calculatedStatus = module.exports.calculateCustomerStatus(customer);
            return { ...customer, status: calculatedStatus };
          });
        }
        
        callback(null, customers);
      }
    );
  },

  // Payment history
  addPayment: function (customerId, amount, paymentDate, notes, callback) {
    db.run(
      'INSERT INTO payment_history (customerId, amount, paymentDate, notes) VALUES (?, ?, ?, ?)',
      [customerId, amount, paymentDate || new Date().toISOString(), notes || ''],
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
  },

  // Reset statuses at the start of each month
  resetMonthlyStatuses: function (callback) {
    db.run(
      `UPDATE customers SET status = 'pending' WHERE status = 'paid'`,
      callback
    );
  }
};