# 🚀 Quick Setup Guide - Motorbike Payment Tracker MVP

## 🎯 Your Simple MVP is Ready!

This system automates exactly what you asked for:
- **Input**: Customer data (name, phone, due date, amount)
- **Daily Check**: Automatic at 10:00 AM IST
- **Output**: SMS reminders + status updates

## 🏃‍♂️ Start in 30 Seconds

1. **Double-click `start.bat`** - This starts everything automatically!
2. **Wait 30 seconds** for both servers to start
3. **Open http://localhost:3000** in your browser

That's it! Your automation is running.

## 📱 SMS Setup (Optional - For Production)

### Demo Mode (Default - FREE)
- SMS messages are logged to the backend console
- Perfect for testing the automation logic
- No cost, no signup required

### Production Mode (Real SMS)
1. Sign up at [Twilio.com](https://twilio.com) 
2. Get your Account SID, Auth Token, and Phone Number
3. Create a `.env` file in the `backend` folder:

```env
NODE_ENV=production
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

**Cost**: ~₹0.50 per SMS in India

## 🧪 Testing Your Automation

### 1. Add Test Customers
- Add 2-3 customers with today's date as due date
- Use different phone numbers (yours for testing)

### 2. Test Manual Reminder
- Click "Send Reminder" button next to a customer
- Check the backend console for the SMS message

### 3. Test Daily Automation
- Backend console shows: "Daily reminders scheduled for 10:00 AM IST"
- Or use the test endpoint: `POST http://localhost:5000/api/test-reminders`

## 📊 Monitor Effectiveness

- **Dashboard**: View customer statuses and automation stats
- **Console Logs**: Backend shows detailed reminder activity
- **Customer List**: Visual status indicators (Pending/Overdue/Paid/Reminder Sent)

## 🏆 MVP Success Metrics

Track these to measure if automation reduces manual work:

1. **Daily Time Saved**: No manual reminder calls needed
2. **On-time Payments**: Compare before/after automation
3. **Customer Response**: Faster payments after SMS reminders
4. **Business Growth**: Scale to 50-100 customers easily

## 🆘 Quick Troubleshooting

**Backend not starting?**
```bash
cd backend
npm install
node server.js
```

**Frontend not starting?**
```bash
cd frontend  
npm install
npm start
```

**SMS not working in production?**
- Check `.env` file has correct Twilio credentials
- Verify phone numbers are in +919876543210 format
- Check Twilio account has credits

## 🎉 You're Ready!

Your MVP tests the core hypothesis: **Does automation reduce manual work and improve payment collection?**

Start with 5-10 customers and let it run for a month to see the results!