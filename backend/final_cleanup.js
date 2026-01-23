const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./motorbike_payments.db');

db.run('DELETE FROM customers WHERE id IN (6, 8)', [], (err) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('✅ Deleted remaining duplicates\n');
  }
  
  db.all('SELECT * FROM customers ORDER BY dueDate', [], (err, rows) => {
    if (err) {
      console.error('Error:', err);
    } else {
      console.log(`📊 Final customer list (${rows.length} customers):\n`);
      rows.forEach((r, i) => {
        console.log(`${i + 1}. ${r.name}`);
        console.log(`   Phone: ${r.phone}`);
        console.log(`   Monthly Amount: ₹${r.monthlyAmount}`);
        console.log(`   Due Date: ${r.dueDate}th`);
        console.log(`   Status: ${r.status}`);
        console.log('');
      });
    }
    db.close();
  });
});
