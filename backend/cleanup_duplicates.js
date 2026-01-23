const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./motorbike_payments.db');

console.log('Cleaning up duplicate customers...\n');

// First, let's see what we have
db.all('SELECT id, name, phone FROM customers ORDER BY id', [], (err, rows) => {
  if (err) {
    console.error('Error:', err);
    db.close();
    return;
  }
  
  console.log('Current customers:');
  rows.forEach(r => console.log(`  ID ${r.id}: ${r.name} - ${r.phone}`));
  
  // Keep only unique customers - delete duplicates
  // Keep the first Hasnain (id 1), first Ali (id 2), first Fatima (id 4), first Sara (id 6), first Ahmed (id 8)
  const idsToDelete = [3, 5, 7, 9]; // Adjust based on actual IDs
  
  console.log('\nDeleting duplicate entries...');
  
  const deleteStmt = db.prepare('DELETE FROM customers WHERE id = ?');
  
  let deleted = 0;
  idsToDelete.forEach(id => {
    deleteStmt.run(id, (err) => {
      if (!err) {
        deleted++;
        console.log(`✅ Deleted duplicate ID ${id}`);
      }
    });
  });
  
  deleteStmt.finalize(() => {
    console.log(`\n📊 Remaining customers:\n`);
    db.all('SELECT id, name, phone, monthlyAmount, dueDate, status FROM customers ORDER BY dueDate ASC', [], (err, rows) => {
      if (err) {
        console.error('Error:', err);
      } else {
        console.log(`Total: ${rows.length} unique customers\n`);
        rows.forEach((c, i) => {
          console.log(`${i + 1}. ${c.name} - Phone: ${c.phone} - Due: ${c.dueDate}th - Amount: ₹${c.monthlyAmount} - Status: ${c.status}`);
        });
      }
      db.close();
    });
  });
});
