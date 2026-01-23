# Dynamic Status Implementation

## Overview
This document describes the implementation of the dynamic customer status system that automatically updates based on payment records and due dates.

## Status Types

The system now supports three main statuses:

1. **Paid** - Customer has made the payment for the current month
2. **Pending (Due)** - Payment is not yet made, and either:
   - Today's date is before the due date (upcoming payment)
   - Today's date equals the due date (payment due TODAY)
3. **Overdue** - Today's date is past the due date and payment has not been made

## How It Works

### Dynamic Status Calculation

The status is calculated dynamically whenever customers are fetched from the database:

```javascript
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
  
  // If today is the due date or before, status is pending
  return 'pending';
}
```

### Automatic Status Updates

The system automatically updates customer statuses in the following scenarios:

1. **When fetching all customers** (`getAllCustomers`)
   - Status is calculated for each customer
   - Database is updated if the calculated status differs from the stored status
   - Returns customers with the correct status

2. **When fetching a specific customer** (`getCustomerById`)
   - Status is calculated dynamically
   - Database is updated if needed
   - Returns customer with the correct status

3. **When fetching customers due for payment** (`getCustomersDue`)
   - Only returns customers where payment is not marked as 'paid'
   - Status is calculated dynamically for each customer

4. **When recording a payment** (`addPayment`)
   - Customer status is immediately updated to 'paid'

### Monthly Status Reset

At the beginning of each month (1st day at 00:01 AM IST), all customers with 'paid' status are automatically reset to 'pending':

```javascript
cron.schedule('1 0 1 * *', () => {
  db.resetMonthlyStatuses((err) => {
    if (err) {
      console.error('❌ Error resetting monthly statuses:', err);
    } else {
      console.log('✅ All paid customer statuses have been reset to pending');
    }
  });
});
```

## Implementation Details

### Backend Changes

#### `database.js`

1. **New Function: `calculateCustomerStatus`**
   - Takes a customer object as input
   - Returns the calculated status based on current date and payment status

2. **Modified: `getAllCustomers`**
   - Now calculates status dynamically for each customer
   - Updates the database if status has changed
   - Returns customers with correct status

3. **Modified: `getCustomerById`**
   - Calculates status dynamically
   - Updates database if needed
   - Returns customer with correct status

4. **Modified: `getCustomersDue`**
   - Changed query to exclude 'paid' customers instead of specific statuses
   - Calculates status dynamically for returned customers

5. **New Function: `resetMonthlyStatuses`**
   - Resets all 'paid' statuses to 'pending' at the start of each month

#### `server.js`

1. **New Cron Job: Monthly Status Reset**
   - Runs at 00:01 AM on the 1st of every month
   - Calls `resetMonthlyStatuses` to reset all paid customers to pending

### Status Display in Frontend

The frontend already had proper status display logic in `CustomerList.js`:

- **Green** (#28a745) - Paid
- **Yellow** (#ffc107) - Pending/Due
- **Red** (#dc3545) - Overdue
- **Blue** (#17a2b8) - Reminder Sent

The dynamic status calculation ensures these colors are always accurate.

## Benefits

1. **Automatic Updates** - No manual intervention needed to update statuses
2. **Real-Time Accuracy** - Status is always calculated based on current date
3. **Monthly Reset** - Paid customers automatically reset for the new month
4. **Consistent State** - Database stays in sync with calculated statuses
5. **Better Tracking** - Clearer visibility of overdue vs. due payments

## Testing

To test the implementation:

1. **Create test customers** with different due dates:
   - Due date in the past (should show as overdue)
   - Due date today (should show as pending/due)
   - Due date in the future (should show as pending)

2. **Record a payment** - Status should immediately change to 'paid'

3. **Wait for the due date to pass** - Status should automatically change from pending to overdue

4. **Wait for month to change** - All paid statuses should reset to pending

## Important Notes

- The `reminder_sent` status is preserved during automatic updates to maintain reminder tracking
- Status calculation happens server-side to ensure consistency
- The system uses the day of the month (1-31) for due date comparisons
- Monthly reset occurs automatically via cron job at the start of each month
