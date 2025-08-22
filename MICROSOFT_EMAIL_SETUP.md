# Microsoft Email Setup Guide for Malikhaing Pinoy Expo 2025

## 📧 Overview

This guide will help you set up Microsoft Outlook/Office 365 as your email service for sending registration confirmation emails with QR codes.

## 🚀 Setup Options

### Option 1: Microsoft SMTP (Recommended)
- Uses Microsoft's SMTP server directly
- More reliable and secure
- Better deliverability
- Full control over email content

### Option 2: Microsoft Graph API
- Modern Microsoft API
- More features and capabilities
- Requires Azure app registration
- Better for enterprise environments

---

## 🔧 Option 1: Microsoft SMTP Setup

### Step 1: Enable 2-Factor Authentication
1. Go to [Microsoft Account Security](https://account.microsoft.com/security)
2. Sign in with your Microsoft account
3. Enable 2-Factor Authentication (required for app passwords)

### Step 2: Generate App Password
1. Go to [Microsoft Account Security](https://account.microsoft.com/security)
2. Click "Advanced security options"
3. Under "App passwords", click "Create a new app password"
4. Name it "Event Registration System"
5. Copy the generated password (16 characters)

### Step 3: Configure Environment Variables
Create a `.env` file in your project root:

```env
# Microsoft Email Configuration
MICROSOFT_EMAIL=your-email@outlook.com
MICROSOFT_PASSWORD=your-16-character-app-password

# Optional: Customize email settings
MICROSOFT_SMTP_HOST=smtp-mail.outlook.com
MICROSOFT_SMTP_PORT=587
```

### Step 4: Update Email Configuration
The system is already configured to use these settings in `src/services/emailService.ts`.

---

## 🔧 Option 2: Microsoft Graph API Setup

### Step 1: Register Azure Application
1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to "Azure Active Directory" → "App registrations"
3. Click "New registration"
4. Name: "Malikhaing Pinoy Expo Email Service"
5. Supported account types: "Accounts in this organizational directory only"
6. Redirect URI: Web → `http://localhost:3000`

### Step 2: Configure Permissions
1. Go to "API permissions"
2. Click "Add a permission"
3. Select "Microsoft Graph"
4. Choose "Application permissions"
5. Add these permissions:
   - `Mail.Send`
   - `Mail.ReadWrite`

### Step 3: Grant Admin Consent
1. Click "Grant admin consent for [Your Organization]"
2. Confirm the permissions

### Step 4: Create Client Secret
1. Go to "Certificates & secrets"
2. Click "New client secret"
3. Add description: "Email Service Secret"
4. Copy the generated secret value

### Step 5: Get Application ID
1. Copy the "Application (client) ID" from the overview page
2. Note the "Directory (tenant) ID"

---

## 🛠️ Backend Implementation

Since this is a frontend-only application, you'll need a backend server to send emails. Here are your options:

### Option A: Firebase Functions (Recommended)
Create a Firebase Function to handle email sending:

```javascript
// functions/index.js
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false,
  auth: {
    user: functions.config().microsoft.email,
    pass: functions.config().microsoft.password
  }
});

exports.sendConfirmationEmail = functions.https.onCall(async (data, context) => {
  const { registration } = data;
  
  const mailOptions = {
    from: functions.config().microsoft.email,
    to: registration.email,
    subject: 'Registration Confirmation - Malikhaing Pinoy Expo 2025',
    html: generateEmailContent(registration)
  };
  
  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error: error.message };
  }
});
```

### Option B: Express.js Backend
Create a simple Express server:

```javascript
// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransporter({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.MICROSOFT_EMAIL,
    pass: process.env.MICROSOFT_PASSWORD
  }
});

app.post('/api/send-email', async (req, res) => {
  const { registration } = req.body;
  
  const mailOptions = {
    from: process.env.MICROSOFT_EMAIL,
    to: registration.email,
    subject: 'Registration Confirmation - Malikhaing Pinoy Expo 2025',
    html: generateEmailContent(registration)
  };
  
  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3001, () => {
  console.log('Email server running on port 3001');
});
```

---

## 🧪 Testing Email Setup

### Development Testing
1. **Start your development server**: `npm run dev`
2. **Register a new participant**
3. **Check browser console** for email simulation logs
4. **Email preview modal** will show the Microsoft email format

### Production Testing
1. **Deploy backend server** (Firebase Functions or Express)
2. **Update frontend** to call backend API
3. **Test registration** with real email sending
4. **Check email delivery** and spam folders

---

## 🔒 Security Best Practices

### Environment Variables
- **Never commit** email credentials to version control
- **Use environment variables** for all sensitive data
- **Rotate app passwords** regularly
- **Use least privilege** permissions

### Email Security
- **Enable 2FA** on Microsoft account
- **Use app passwords** instead of regular passwords
- **Monitor email logs** for suspicious activity
- **Set up email authentication** (SPF, DKIM, DMARC)

---

## 📊 Email Analytics

### Microsoft 365 Admin Center
1. Go to [Microsoft 365 Admin Center](https://admin.microsoft.com)
2. Navigate to "Reports" → "Usage"
3. View email delivery statistics
4. Monitor for delivery issues

### Email Tracking
- **Delivery rates**: Monitor successful deliveries
- **Bounce rates**: Track failed deliveries
- **Spam complaints**: Monitor user feedback
- **Open rates**: Track email engagement

---

## 🔍 Troubleshooting

### Common Issues

#### Authentication Failed
- **Check app password**: Ensure it's correct and not expired
- **Verify 2FA**: Make sure 2-Factor Authentication is enabled
- **Check permissions**: Ensure app has proper permissions

#### Email Not Delivered
- **Check spam folder**: Emails might be marked as spam
- **Verify recipient**: Ensure email address is correct
- **Check server logs**: Look for delivery errors
- **Test with different email**: Try sending to a different address

#### SMTP Connection Issues
- **Check firewall**: Ensure port 587 is not blocked
- **Verify network**: Check internet connection
- **Test SMTP settings**: Use email client to test connection

### Debug Mode
Enable detailed logging:

```javascript
const transporter = nodemailer.createTransporter({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.MICROSOFT_EMAIL,
    pass: process.env.MICROSOFT_PASSWORD
  },
  debug: true, // Enable debug output
  logger: true // Log to console
});
```

---

## 🎯 Quick Setup Checklist

- [ ] Microsoft account with 2FA enabled
- [ ] App password generated
- [ ] Environment variables configured
- [ ] Backend server deployed
- [ ] Frontend updated to use backend
- [ ] Email testing completed
- [ ] Security settings reviewed
- [ ] Monitoring configured

---

## 📞 Support

### Microsoft Support
- [Microsoft 365 Support](https://support.microsoft.com/office)
- [Azure Support](https://azure.microsoft.com/support)
- [SMTP Documentation](https://docs.microsoft.com/en-us/exchange/mail-flow)

### Application Support
If you encounter issues:
1. Check environment variables
2. Verify Microsoft account settings
3. Test SMTP connection
4. Review server logs
5. Contact Microsoft support if needed

---

## 🚀 Next Steps

After setting up Microsoft email:
1. **Test thoroughly** with various email providers
2. **Monitor delivery rates** and adjust as needed
3. **Set up email templates** for different scenarios
4. **Configure email analytics** for insights
5. **Plan for scaling** as event approaches

The Microsoft email integration will provide reliable, professional email delivery for your event registrations!
