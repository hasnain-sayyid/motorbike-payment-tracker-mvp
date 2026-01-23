const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./motorbike_payments.db');

const missingCustomers = [
  {
    name: 'Sara Khan',
    phone: '9345678901',
    monthlyAmount: 4500,
    dueDate: 23,
    status: 'pending',
    notes: 'Due today - payment due on 23rd'
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

console.log('Adding missing customers...\n');

const stmt = db.prepare('INSERT INTO customers (name, phone, monthlyAmount, dueDate, status, notes) VALUES (?, ?, ?, ?, ?, ?)');

missingCustomers.forEach(c => {
  stmt.run(c.name, c.phone, c.monthlyAmount, c.dueDate, c.status, c.notes);
  console.log(`✅ Added: ${c.name} - Due: ${c.dueDate}th`);
});

stmt.finalize(() => {
  console.log('\n📊 Complete customer list:\n');
  db.all('SELECT * FROM customers ORDER BY dueDate ASC', [], (err, rows) => {
    if (err) {
      console.error('Error:', err);
    } else {
      const today = 23;
      console.log(`Total: ${rows.length} customers\n`);
      rows.forEach((c, i) => {
        let expectedStatus = c.status === 'paid' ? '✅ Paid' :
                            today > c.dueDate ? '🔴 Overdue' :
                            today === c.dueDate ? '🟡 Due Today' :
                            '⚪ Pending';
        
        console.log(`${i + 1}. ${c.name} - ₹${c.monthlyAmount} - Due: ${c.dueDate}th - ${expectedStatus}`);
      });
      
      console.log('\n🎯 Dynamic Status Test Cases:');
      console.log('   • Ali Ahmed (Due 10th) → Will show as OVERDUE (past due date)');
      console.log('   • Hasnain (Due 14th, Paid) → Will show as PAID');
      console.log('   • Fatima Ali (Due 15th, Paid) → Will show as PAID');
      console.log('   • Sara Khan (Due 23rd) → Will show as DUE/PENDING (today is 23rd)');
      console.log('   • Ahmed Raza (Due 28th) → Will show as PENDING (future due date)');
    }
    db.close();
  });
});
