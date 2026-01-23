# Deploy Backend to Render

Visit: https://render.com/

1. Create account (free)
2. Click "New +" → "Web Service"
3. Connect to your GitHub repository
4. Select the repository: motorbike-payment-tracker
5. Configure:
   - **Name**: motorbike-payment-tracker-api
   - **Root Directory**: backend
   - **Environment**: Node
   - **Build Command**: npm install
   - **Start Command**: npm start
   - **Instance Type**: Free

6. Add Environment Variables:
   - NODE_ENV: production
   - FRONTEND_URL: https://frontend-blue-seven-42.vercel.app

7. Click "Create Web Service"

Once deployed, you'll get a URL like: https://motorbike-payment-tracker-api-xxxx.onrender.com

Then update the frontend API configuration to use this URL.