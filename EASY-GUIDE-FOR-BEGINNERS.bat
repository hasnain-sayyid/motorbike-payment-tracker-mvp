@echo off
color 0A
echo.
echo ========================================
echo   SUPER EASY GUIDE - DEPLOY BACKEND
echo ========================================
echo.
echo I'll guide you like you're 9 years old! Let's go! :)
echo.
echo.
echo STEP 1: Look at your Render page in the browser
echo ------------------------------------------------
echo You should see a page with "My project" at the top.
echo You see one thing called "Appointment" - that's okay!
echo.
echo.
echo STEP 2: Find the "+ New service" button
echo -----------------------------------------
echo Look at the BOTTOM LEFT of the list (below "Appointment")
echo You'll see a button that says "+ New service"
echo.
echo ACTION: Click that "+ New service" button
echo.
pause
echo.
echo.
echo STEP 3: Choose "Web Service"
echo ------------------------------
echo After you clicked, a menu will appear with options like:
echo - Web Service
echo - Static Site
echo - etc.
echo.
echo ACTION: Click on "Web Service" (the first one)
echo.
pause
echo.
echo.
echo STEP 4: Connect your GitHub
echo -----------------------------
echo You'll see a page asking to connect a repository.
echo.
echo ACTION: Click the big button that says "Connect a repository"
echo             OR "Connect account" if you see that
echo.
echo NOTE: If GitHub asks you to log in or authorize, just click "Yes" or "Allow"
echo.
pause
echo.
echo.
echo STEP 5: Find your project
echo --------------------------
echo You'll see a list of your GitHub projects.
echo.
echo ACTION: Look for "motorbike-payment-tracker-mvp"
echo         Click the "Connect" button next to it
echo.
echo TIP: If you don't see it, use the search box and type "motorbike"
echo.
pause
echo.
echo.
echo STEP 6: Fill in the form (COPY THESE EXACTLY!)
echo ------------------------------------------------
echo Now you'll see a form with many boxes. Fill them like this:
echo.
echo Box 1 - Name:
echo   Type: motorbike-payment-tracker-api
echo.
echo Box 2 - Region: 
echo   Choose: Oregon (US West) - or any region you like
echo.
echo Box 3 - Branch:
echo   Should already say: main (don't change it)
echo.
echo Box 4 - Root Directory:
echo   Type: backend
echo.
echo Box 5 - Runtime:
echo   Should say: Node (don't change it)
echo.
echo Box 6 - Build Command:
echo   Type: npm install
echo.
echo Box 7 - Start Command:
echo   Type: npm start
echo.
pause
echo.
echo.
echo STEP 7: Add Secret Settings (Environment Variables)
echo -----------------------------------------------------
echo Scroll down a bit. You'll see a section called "Environment Variables"
echo.
echo ACTION: Click the "+ Add Environment Variable" button
echo.
echo First Variable:
echo   Left box (Key): Type NODE_ENV
echo   Right box (Value): Type production
echo.
echo Click "+ Add Environment Variable" again for second one:
echo   Left box (Key): Type FRONTEND_URL
echo   Right box (Value): Type https://frontend-blue-seven-42.vercel.app
echo.
pause
echo.
echo.
echo STEP 8: Create the Service!
echo -----------------------------
echo Scroll all the way down to the bottom of the page.
echo.
echo ACTION: Click the BIG BLUE BUTTON that says "Create Web Service"
echo.
echo.
echo STEP 9: Wait...
echo ----------------
echo Now Render is building your backend! This takes 2-5 minutes.
echo You'll see lots of text scrolling - that's normal!
echo.
echo Wait until you see:
echo - A GREEN DOT next to your service name
echo - Text that says "Live" or "Deployed"
echo.
echo Once you see that, YOU'RE DONE! :)
echo.
echo.
echo ========================================
echo   WHAT HAPPENS NEXT?
echo ========================================
echo.
echo After your backend is "Live":
echo - Go back to your website: https://frontend-blue-seven-42.vercel.app
echo - Try deleting a payment - IT WILL WORK NOW!
echo - Try editing a payment - IT WON'T DUPLICATE!
echo.
echo Your website is now FULLY WORKING! Congratulations! :)
echo.
echo ========================================
echo.
pause
