# Firebase Functions Setup Guide

## 🚀 Upgrade to Blaze Plan & Deploy Email Functions

Your Microsoft email configuration is working perfectly! Now you need to upgrade to the Blaze plan and deploy the Firebase Functions to enable real email sending.

### **Step 1: Upgrade to Blaze Plan**

1. **Go to Firebase Console**: https://console.firebase.google.com/project/microsite-baac6/usage/details

2. **Click "Upgrade"** to switch to the Blaze (pay-as-you-go) plan

3. **Add Payment Method**:
   - Credit card required
   - You'll only pay for what you use
   - Free tier includes:
     - 2 million function invocations/month
     - 400,000 GB-seconds of compute time
     - 200,000 CPU-seconds of compute time

4. **Confirm Upgrade**

### **Step 2: Deploy Firebase Functions**

Once upgraded, deploy the email functions:

```bash
cd /Users/zimarcilla/event-landing-page
firebase deploy --only functions
```

You should see:
```
✔  functions: Finished running predeploy script.
✔  functions: functions/sendConfirmationEmail(us-central1) successful create operation.
✔  functions: functions/testEmail(us-central1) successful create operation.
```

### **Step 3: Test Email Sending**

#### Option A: Test with Registration Form
1. Go to: https://microsite-baac6.web.app
2. Register a new participant
3. Check browser console for email logs
4. Check your email for the confirmation

#### Option B: Test with Firebase Console
1. Go to Firebase Console → Functions
2. Find `testEmail` function
3. Click "Test function"
4. Enter test data: `{"testEmail": "your-email@example.com"}`
5. Click "Test function"

### **Step 4: Verify Email Delivery**

1. **Check your email inbox** (and spam folder)
2. **Look for emails from**: malikhaingpinoy@dti.gov.ph
3. **Subject**: "Registration Confirmation - Malikhaing Pinoy Expo 2025"

## 🔧 How It Works

### **Frontend (React App)**
- User fills registration form
- QR code is generated
- Frontend calls Firebase Function

### **Firebase Functions (Backend)**
- Receives registration data
- Sends email via Microsoft SMTP
- Returns success/failure response

### **Email Service (Microsoft)**
- Uses your working 16-character password
- Sends professional HTML emails
- Includes QR codes and event details

## 📧 Email Features

✅ **Professional HTML Design**
✅ **QR Code Integration**
✅ **Event Details**
✅ **Registration Information**
✅ **Microsoft Government Email**
✅ **Real-time Delivery**
✅ **Scalable Infrastructure**

## 💰 Blaze Plan Costs

### **Free Tier (Included)**
- **2 million function invocations/month**
- **400,000 GB-seconds of compute time**
- **200,000 CPU-seconds of compute time**

### **Typical Event Usage**
- **1000 registrations** = ~$0.50-1.00
- **Email sending** = ~$0.10-0.20 per 100 emails
- **Total cost for 1000 participants** = ~$1-2

### **Cost Control**
- Set spending limits in Firebase Console
- Monitor usage in real-time
- Automatic alerts for high usage

## 🛠️ Troubleshooting

### **Upgrade Issues**
- Ensure payment method is valid
- Check billing account permissions
- Contact Firebase support if needed

### **Deployment Issues**
```bash
# Check function logs
firebase functions:log

# Test function locally
firebase emulators:start --only functions
```

### **Email Not Sending**
1. Check Firebase Function logs
2. Verify Microsoft credentials
3. Check function deployment status
4. Test with Firebase Console

## 📋 Function Details

### **sendConfirmationEmail**
- **Trigger**: HTTPS callable function
- **Purpose**: Send registration confirmation emails
- **Input**: Registration data with QR code
- **Output**: Success/failure response

### **testEmail**
- **Trigger**: HTTPS callable function
- **Purpose**: Test email configuration
- **Input**: Test email address
- **Output**: Success/failure response

## 🔒 Security

- **Authentication**: Firebase Auth integration
- **Data**: Encrypted in transit and at rest
- **Credentials**: Stored securely in Firebase
- **Access**: Controlled via Firebase security rules

## 📊 Monitoring

### **Firebase Console**
- Function execution logs
- Performance metrics
- Error tracking
- Usage statistics

### **Email Delivery**
- Microsoft SMTP logs
- Delivery confirmations
- Bounce tracking
- Spam folder monitoring

## 🎯 Next Steps

1. **Upgrade to Blaze plan**
2. **Deploy Firebase Functions**
3. **Test email sending**
4. **Monitor function performance**
5. **Set up alerts and monitoring**

## 📞 Support

- **Firebase Support**: https://firebase.google.com/support
- **Billing Issues**: Firebase Console → Billing
- **Function Issues**: Firebase Console → Functions → Logs
- **Email Issues**: Check Microsoft SMTP configuration

## 🚀 Benefits of Firebase Functions

✅ **Serverless**: No server management
✅ **Scalable**: Automatic scaling
✅ **Secure**: Built-in security
✅ **Integrated**: Works with Firebase ecosystem
✅ **Cost-effective**: Pay only for usage
✅ **Reliable**: Google infrastructure

Your email system will be production-ready once you upgrade and deploy! 🎉
