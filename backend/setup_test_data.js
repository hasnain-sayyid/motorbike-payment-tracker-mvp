// Test Data Setup for MVP Demo
// Run this file to populate your system with sample customers for testing

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'motorbike_payments.db');
const db = new sqlite3.Database(dbPath);

// Sample customers for testing the automation
const testCustomers = [
  {
    name: "Rajesh Kumar",
    phone: "+919876543210",
    monthlyAmount: 8500,
    dueDate: new Date().getDate(), // Due today
    status: "pending"
  },
  {
    name: "Priya Sharma", 
    phone: "+919876543211",
    monthlyAmount: 12000,
    dueDate: new Date().getDate() - 2, // 2 days overdue
    status: "overdue"
  },
  {
    name: "Amit Singh",
    phone: "+919876543212", 
    monthlyAmount: 9500,
    dueDate: new Date().getDate() + 3, // Due in 3 days
    status: "pending"
  },
  {
    name: "Sneha Patel",
    phone: "+919876543213",
    monthlyAmount: 11000,
    dueDate: new Date().getDate() - 1, // 1 day overdue
    status: "overdue"
  },
  {
    name: "Vikram Mehta",
    phone: "+919876543214",
    monthlyAmount: 7500,
    dueDate: 15, // Due on 15th of month
    status: "paid"
  }
];

console.log('🚀 Adding test customers for MVP demonstration...\n');

// Insert test customers
testCustomers.forEach((customer, index) => {
  db.run(
    'INSERT OR REPLACE INTO customers (name, phone, monthlyAmount, dueDate, status, notes) VALUES (?, ?, ?, ?, ?, ?)',
    [customer.name, customer.phone, customer.monthlyAmount, customer.dueDate, customer.status, 'Test customer for MVP demo'],
    function(err) {
      if (err) {
        console.error(`❌ Error adding ${customer.name}:`, err.message);
      } else {
        const statusIcon = customer.status === 'paid' ? '✅' : customer.status === 'overdue' ? '🔴' : '🟡';
        console.log(`${statusIcon} Added: ${customer.name} - ₹${customer.monthlyAmount} due on ${customer.dueDate}th (${customer.status})`);
      }
      
      // Close database after last insertion
      if (index === testCustomers.length - 1) {
        setTimeout(() => {
          db.close((err) => {
            if (err) {
              console.error('❌ Error closing database:', err.message);
            } else {
              console.log('\n✅ Test data setup complete!');
              console.log('\n🎯 Next steps:');
              console.log('1. Start the system: double-click start.bat');
              console.log('2. Open http://localhost:3000');
              console.log('3. Test manual reminders');
              console.log('4. Wait for 10:00 AM for automatic reminders');
              console.log('5. Monitor backend console for SMS activity\n');
            }
          });
        }, 100);
      }
    }
  );
});