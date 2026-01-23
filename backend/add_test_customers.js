const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./motorbike_payments.db');

const testCustomers = [
  {
    name: 'Ali Ahmed',
    phone: '9234567890',
    monthlyAmount: 3000,
    dueDate: 10,
    status: 'pending',
    notes: 'Overdue customer - due date was 10th'
  },
  {
    name: 'Sara Khan',
    phone: '9345678901',
    monthlyAmount: 4500,
    dueDate: 23,
    status: 'pending',
    notes: 'Due today - payment due on 23rd'
  },
  {
    name: 'Ahmed Raza',
    phone: '9456789012',
    monthlyAmount: 6000,
    dueDate: 28,
    status: 'pending',
    notes: 'Upcoming payment - due on 28th'
  },
  {
    name: 'Fatima Ali',
    phone: '9567890123',
    monthlyAmount: 5500,
    dueDate: 15,
    status: 'paid',
    notes: 'Paid customer - payment received'
  }
];

console.log('Adding test customers...\n');

const stmt = db.prepare('INSERT INTO customers (name, phone, monthlyAmount, dueDate, status, notes) VALUES (?, ?, ?, ?, ?, ?)');

testCustomers.forEach((customer, index) => {
  stmt.run(
    customer.name,
    customer.phone,
    customer.monthlyAmount,
    customer.dueDate,
    customer.status,
    customer.notes,
    (err) => {
      if (err) {
        console.error(`❌ Error adding ${customer.name}:`, err.message);
      } else {
        console.log(`✅ Added: ${customer.name} - Due: ${customer.dueDate}th - Amount: ₹${customer.monthlyAmount}`);
      }
    }
  );
});

stmt.finalize(() => {
  console.log('\n📊 All customers in database:\n');
  db.all('SELECT id, name, phone, monthlyAmount, dueDate, status, notes FROM customers ORDER BY dueDate ASC', [], (err, rows) => {
    if (err) {
      console.error('Error:', err);
    } else {
      console.log(`Total customers: ${rows.length}\n`);
      rows.forEach((customer, index) => {
        const today = new Date().getDate();
        let expectedStatus = customer.status === 'paid' ? 'paid' : 
                            today > customer.dueDate ? 'overdue (will be calculated)' :
                            today === customer.dueDate ? 'due today (will be calculated)' :
                            'pending (will be calculated)';
        
        console.log(`${index + 1}. ${customer.name}`);
        console.log(`   Phone: ${customer.phone}`);
        console.log(`   Amount: ₹${customer.monthlyAmount}`);
        console.log(`   Due Date: ${customer.dueDate}th of each month`);
        console.log(`   Current Status: ${customer.status}`);
        console.log(`   Expected Dynamic Status: ${expectedStatus}`);
        console.log(`   Notes: ${customer.notes}`);
        console.log('');
      });
    }
    db.close();
  });
});
