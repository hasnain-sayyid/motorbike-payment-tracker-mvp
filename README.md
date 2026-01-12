# 🏍️ Motorbike Payment Tracker MVP

**Simple automation for motorbike installment payment tracking and reminders**

## 🎯 The MVP Workflow (Your Exact Requirements)

1. **📝 Input**: Add customers (name, phone, due date, amount)
2. **🤖 Daily Automation**: System checks at 10:00 AM IST for due payments
3. **📱 Smart Reminders**: Sends SMS to due/overdue customers automatically  
4. **✅ Status Updates**: Marks customers as "Reminder Sent" after SMS

**Goal**: Test if automated reminders reduce manual work and improve on-time payments

## 🚀 Quick Start (30 Seconds)

1. **Double-click `start.bat`** ← This starts everything!
2. **Wait 30 seconds** for servers to initialize
3. **Open http://localhost:3000** in browser
4. **Add test customers** or run: `cd backend && node setup_test_data.js`

## 📱 SMS Modes

- **Demo Mode (Default)**: Messages logged to console - FREE testing
- **Production Mode**: Real SMS via Twilio - ~₹0.50 per message

## 🔧 Features Built for You

✅ **Customer Management**: Add/edit your 5-10 customers easily  
✅ **Automated Daily Checks**: No manual monitoring needed  
✅ **Smart Reminders**: Different messages for due vs overdue  
✅ **Cloud Deployment**: Ready for Render (backend) + Vercel (frontend)

## 🌐 Deployment

### Quick Deploy:
- **Windows**: `./deploy.bat`
- **Mac/Linux**: `./deploy.sh`

### Platforms:
- **Backend**: [Render](https://render.com) (Free tier: 750 hours/month)
- **Frontend**: [Vercel](https://vercel.com) (Free tier: Unlimited)

### Full Guide:
See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment instructions.  
✅ **Status Tracking**: Visual dashboard shows who needs attention  
✅ **Manual Override**: Send immediate reminders when needed  
✅ **Test Mode**: Safe testing without sending real SMS  

## 📊 MVP Success Metrics

Track these over 1 month to validate your automation:

- **Time Saved**: No more manual reminder calls daily
- **Payment Collection**: Compare on-time payment rates before/after
- **Customer Response**: Faster payments after automated SMS
- **Business Scale**: Easily handle 50-100 customers later

## 🎯 Simple Tech Stack

- **Backend**: Node.js + SQLite (lightweight, no database setup)
- **Frontend**: React (clean customer dashboard)  
- **SMS**: Twilio (industry standard, reliable delivery)
- **Automation**: Cron jobs (runs automatically every day)

## 💰 Cost Analysis

- **Development**: FREE (already built!)
- **Testing**: FREE (demo mode)
- **Production SMS**: ~₹0.50 per message
- **10 customers × 12 reminders/year = ₹60/year**
- **Server hosting**: ₹500-2000/month (optional - can run locally)

## 🆘 Support

See `SETUP_GUIDE.md` for detailed setup instructions and troubleshooting.

---

**This MVP validates your core business hypothesis: Does automation improve payment collection while reducing manual work?**"