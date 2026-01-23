require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const twilio = require('twilio');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize database
db.init();

// Twilio configuration (replace with your credentials)
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || 'your_account_sid';
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || 'your_auth_token';
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || '+1234567890';

// Initialize Twilio client (in production mode only)
const twilioClient = process.env.NODE_ENV === 'production' ? 
  twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN) : null;

// SMS Templates
const createReminderMessage = (customerName, amount, dueDate) => {
  const currentDate = new Date();
  const today = currentDate.getDate();
  const daysOverdue = today - dueDate;
  
  if (daysOverdue > 0) {
    return `Hi ${customerName}! 🏍️ Your motorbike installment of ₹${amount} was due on ${dueDate}th and is now ${daysOverdue} day(s) overdue. Please make the payment ASAP to avoid penalties. For support, reply to this message. Thank you!`;
  } else if (daysOverdue === 0) {
    return `Hi ${customerName}! 🏍️ URGENT: Your motorbike installment of ₹${amount} is due TODAY (${dueDate}th). Please make the payment before end of day. For support, reply to this message. Thank you!`;
  } else {
    return `Hi ${customerName}! 🏍️ Reminder: Your motorbike installment of ₹${amount} is due on ${dueDate}th (${Math.abs(daysOverdue)} days remaining). Please ensure timely payment. Thank you!`;
  }
};

// Function to send SMS reminder
const sendSMSReminder = async (customer) => {
  try {
    const message = createReminderMessage(customer.name, customer.monthlyAmount, customer.dueDate);
    
    if (process.env.NODE_ENV === 'production' && twilioClient) {
      // Production mode - actually send SMS
      const result = await twilioClient.messages.create({
        body: message,
        from: TWILIO_PHONE_NUMBER,
        to: customer.phone
      });
      
      console.log(`📱 SMS sent to ${customer.name} (${customer.phone}): ${result.sid}`);
      return { success: true, sid: result.sid };
    } else {
      // Development mode - just log the message
      console.log(`📱 SMS (Demo Mode) to ${customer.name} (${customer.phone}):`);
      console.log(`📱 Message: ${message}`);
      return { success: true, demo: true };
    }
  } catch (error) {
    console.error(`❌ Failed to send SMS to ${customer.name}:`, error);
    return { success: false, error: error.message };
  }
};

// Daily reminder job - runs at 10:00 AM every day
cron.schedule('0 10 * * *', async () => {
  console.log('\n🔄 === DAILY PAYMENT REMINDER CHECK STARTED ===');
  console.log(`🕙 Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);
  
  db.getCustomersDue((err, customers) => {
    if (err) {
      console.error('❌ Error fetching due customers:', err);
      return;
    }
    
    console.log(`📋 Found ${customers.length} customers with due/overdue payments`);
    
    if (customers.length === 0) {
      console.log('✅ No reminders needed today!');
      console.log('=== DAILY CHECK COMPLETED ===\n');
      return;
    }
    
    let processedCount = 0;
    let sentCount = 0;
    
    customers.forEach(async (customer) => {
      const today = new Date();
      const lastReminder = customer.lastReminderSent ? new Date(customer.lastReminderSent) : null;
      const daysSinceLastReminder = lastReminder ? Math.floor((today - lastReminder) / (1000 * 60 * 60 * 24)) : 999;
      const daysOverdue = today.getDate() - customer.dueDate;
      
      console.log(`👤 ${customer.name}: ${daysOverdue > 0 ? daysOverdue + ' days overdue' : daysOverdue === 0 ? 'due today' : 'upcoming due'}, last reminder: ${daysSinceLastReminder} days ago`);
      
      // Send reminder if no reminder sent in the last 2 days (reduced from 3)
      if (daysSinceLastReminder >= 2) {
        const smsResult = await sendSMSReminder(customer);
        
        if (smsResult.success) {
          sentCount++;
          // Update customer status and last reminder sent date
          const newStatus = daysOverdue > 0 ? 'overdue' : 'reminder_sent';
          db.updateCustomerStatus(customer.id, newStatus, today.toISOString(), (err) => {
            if (err) {
              console.error(`❌ Failed to update ${customer.name} status:`, err);
            } else {
              console.log(`✅ ${customer.name}: Reminder sent, status → ${newStatus}`);
            }
          });
        }
      } else {
        console.log(`⏭️ ${customer.name}: Skipped (reminded ${daysSinceLastReminder} days ago)`);
      }
      
      processedCount++;
      if (processedCount === customers.length) {
        console.log(`\n📊 Summary: ${sentCount}/${customers.length} reminders sent`);
        console.log('=== DAILY CHECK COMPLETED ===\n');
      }
    });
  });
}, {
  scheduled: true,
  timezone: "Asia/Kolkata"
});

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL, 'https://frontend-blue-seven-42.vercel.app']
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Health check endpoints
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    mode: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    mode: process.env.NODE_ENV || 'development',
    service: 'motorbike-payment-tracker-api'
  });
});

// Customer management endpoints
app.get('/api/customers', (req, res) => {
  db.getAllCustomers((err, customers) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(customers || []);
    }
  });
});

app.get('/api/customers/:id', (req, res) => {
  db.getCustomerById(req.params.id, (err, customer) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!customer) {
      res.status(404).json({ error: 'Customer not found' });
    } else {
      res.json(customer);
    }
  });
});

app.post('/api/customers', (req, res) => {
  const { name, phone, monthlyAmount, dueDate, notes } = req.body;
  
  if (!name || !phone || !monthlyAmount || !dueDate) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  db.createCustomer(name, phone, monthlyAmount, dueDate, notes, (err, customerId) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      console.log(`✅ New customer added: ${name} (ID: ${customerId})`);
      res.status(201).json({ 
        id: customerId, 
        message: 'Customer created successfully',
        customer: { id: customerId, name, phone, monthlyAmount, dueDate, notes }
      });
    }
  });
});

app.put('/api/customers/:id', (req, res) => {
  const { name, phone, monthlyAmount, dueDate, status, notes } = req.body;
  
  db.updateCustomer(req.params.id, name, phone, monthlyAmount, dueDate, status, notes, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      console.log(`✅ Customer updated: ${name} (ID: ${req.params.id})`);
      res.json({ message: 'Customer updated successfully' });
    }
  });
});

app.delete('/api/customers/:id', (req, res) => {
  db.deleteCustomer(req.params.id, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      console.log(`✅ Customer deleted (ID: ${req.params.id})`);
      res.json({ message: 'Customer deleted successfully' });
    }
  });
});

// Payment tracking endpoints
app.get('/api/customers-due', (req, res) => {
  db.getCustomersDue((err, customers) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(customers || []);
    }
  });
});

app.post('/api/payments', (req, res) => {
  const { customerId, amount, notes } = req.body;
  
  if (!customerId || !amount) {
    return res.status(400).json({ error: 'Customer ID and amount are required' });
  }
  
  db.addPayment(customerId, amount, notes, (err, paymentId) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      console.log(`💰 Payment recorded: ₹${amount} for customer ID ${customerId}`);
      res.status(201).json({ 
        id: paymentId, 
        message: 'Payment recorded successfully' 
      });
    }
  });
});

app.get('/api/customers/:id/payments', (req, res) => {
  db.getPaymentHistory(req.params.id, (err, payments) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(payments || []);
    }
  });
});

// Manual reminder endpoint
app.post('/api/send-reminder/:customerId', async (req, res) => {
  db.getCustomerById(req.params.customerId, async (err, customer) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    const smsResult = await sendSMSReminder(customer);
    
    if (smsResult.success) {
      // Update reminder sent status
      const today = new Date();
      db.updateCustomerStatus(customer.id, 'reminder_sent', today.toISOString(), (err) => {
        if (err) {
          console.error('Failed to update reminder status:', err);
        }
      });
      
      res.json({ 
        message: 'Reminder sent successfully',
        demo: smsResult.demo || false
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to send reminder',
        details: smsResult.error
      });
    }
  });
});

// Get payment statuses
app.get('/api/payment-statuses', (req, res) => {
  res.json(db.getPaymentStatuses());
});

// Dashboard stats for monitoring automation effectiveness
app.get('/api/dashboard-stats', (req, res) => {
  db.all('SELECT COUNT(*) as total FROM customers', [], (err, totalResult) => {
    if (err) return res.status(500).json({ error: err.message });
    
    db.all('SELECT COUNT(*) as due FROM customers WHERE dueDate <= ? AND status IN ("pending", "overdue")', 
           [new Date().getDate()], (err, dueResult) => {
      if (err) return res.status(500).json({ error: err.message });
      
      db.all('SELECT COUNT(*) as overdue FROM customers WHERE dueDate < ? AND status = "overdue"', 
             [new Date().getDate()], (err, overdueResult) => {
        if (err) return res.status(500).json({ error: err.message });
        
        db.all('SELECT COUNT(*) as paid FROM customers WHERE status = "paid"', [], (err, paidResult) => {
          if (err) return res.status(500).json({ error: err.message });
          
          res.json({
            totalCustomers: totalResult[0].total,
            dueToday: dueResult[0].due,
            overdue: overdueResult[0].overdue,
            paidThisMonth: paidResult[0].paid,
            lastUpdateTime: new Date().toISOString(),
            nextReminderCheck: '10:00 AM IST tomorrow'
          });
        });
      });
    });
  });
});

// Test endpoint for manual reminder check (development only)
app.post('/api/test-reminders', async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Not allowed in production' });
  }
  
  console.log('🧪 Manual reminder test triggered...');
  
  db.getCustomersDue((err, customers) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    const results = [];
    let processed = 0;
    
    if (customers.length === 0) {
      return res.json({ message: 'No customers due for payment', customers: [] });
    }
    
    customers.forEach(async (customer) => {
      const smsResult = await sendSMSReminder(customer);
      results.push({
        customer: customer.name,
        phone: customer.phone,
        status: smsResult.success ? 'sent' : 'failed',
        demo: smsResult.demo || false
      });
      
      processed++;
      if (processed === customers.length) {
        res.json({ 
          message: `Processed ${customers.length} customers`,
          results: results
        });
      }
    });
  });
});

// Test SMS endpoint - send SMS to any number
app.post('/api/test-sms', async (req, res) => {
  const { phoneNumber, message } = req.body;
  
  if (!phoneNumber || !message) {
    return res.status(400).json({ error: 'Phone number and message are required' });
  }
  
  console.log(`🧪 Test SMS requested to ${phoneNumber}: ${message}`);
  
  try {
    if (process.env.NODE_ENV === 'production' && twilioClient) {
      // Send real SMS
      const result = await twilioClient.messages.create({
        body: message,
        from: TWILIO_PHONE_NUMBER,
        to: phoneNumber
      });
      
      console.log(`✅ Real SMS sent successfully! SID: ${result.sid}`);
      res.json({ 
        success: true, 
        message: 'SMS sent successfully!',
        sid: result.sid,
        demo: false
      });
    } else {
      // Demo mode
      console.log(`📱 SMS (Demo Mode) to ${phoneNumber}:`);
      console.log(`📱 Message: ${message}`);
      res.json({ 
        success: true, 
        message: 'SMS sent (Demo Mode) - check console',
        demo: true
      });
    }
  } catch (error) {
    console.error('❌ SMS sending failed:', error);
    
    // Handle Twilio trial account limitations
    if (error.code === 21608) {
      res.status(400).json({ 
        success: false, 
        error: 'Phone number not verified',
        message: 'Twilio Trial Account: You can only send SMS to verified phone numbers. Please verify your phone number at https://console.twilio.com/us1/develop/phone-numbers/manage/verified or upgrade your Twilio account.',
        trialLimitation: true
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Payment Tracker Server running on http://localhost:${PORT}`);
  console.log(`🕙 Daily reminders scheduled for 10:00 AM IST`);
  console.log(`📱 SMS Mode: ${process.env.NODE_ENV === 'production' ? 'Production' : 'Demo'}`);
});