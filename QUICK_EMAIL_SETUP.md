# Quick Email Setup Guide

## 🚨 Current Issue
Your Microsoft government account (`MalikhaingPinoy@dti.gov.ph`) requires proper app password setup through your IT administrator. The 8-character password `CIDO2025` is not working for SMTP authentication.

## 🚀 Quick Solutions

### Option 1: Gmail SMTP (Recommended for Testing)

#### Step 1: Set up Gmail App Password
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification if not already enabled
3. Go to "App passwords"
4. Generate a new app password for "Mail"
5. Copy the 16-character password

#### Step 2: Configure Environment Variables
Create a `.env` file in your project root:

```env
# Email Service Configuration
EMAIL_SERVICE=gmail
GMAIL_EMAIL=your-gmail@gmail.com
GMAIL_PASSWORD=your-16-character-app-password
```

#### Step 3: Test Gmail Configuration
Run the test script with Gmail:

```bash
node test-email.js
```

### Option 2: SendGrid (Professional Email Service)

#### Step 1: Create SendGrid Account
1. Go to [SendGrid](https://sendgrid.com/)
2. Sign up for a free account (100 emails/day)
3. Verify your sender email address

#### Step 2: Get API Key
1. Go to Settings → API Keys
2. Create a new API Key with "Mail Send" permissions
3. Copy the API key

#### Step 3: Configure Environment Variables
```env
# Email Service Configuration
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your-sendgrid-api-key
```

### Option 3: Fix Microsoft Government Account

#### Step 1: Contact DTI IT Administrator
Contact your IT administrator to:
- Enable app password generation for your account
- Configure SMTP access permissions
- Set up proper authentication methods

#### Step 2: Generate Proper App Password
Once enabled, generate a 16-character app password:
1. Go to Microsoft Account Security
2. Click "Advanced security options"
3. Under "App passwords", create new password
4. Name it "Event Registration System"

#### Step 3: Update Configuration
```env
# Email Service Configuration
EMAIL_SERVICE=microsoft
MICROSOFT_EMAIL=MalikhaingPinoy@dti.gov.ph
MICROSOFT_PASSWORD=your-16-character-app-password
```

## 🧪 Testing

### Test Current Configuration
```bash
node test-email.js
```

### Test Registration Form
1. Start development server: `npm run dev`
2. Register a new participant
3. Check browser console for email logs
4. Email preview modal will show the configuration

## 📋 Environment Variables Reference

```env
# Choose email service: 'microsoft', 'gmail', 'sendgrid'
EMAIL_SERVICE=microsoft

# Microsoft Configuration
MICROSOFT_EMAIL=MalikhaingPinoy@dti.gov.ph
MICROSOFT_PASSWORD=your-app-password

# Gmail Configuration
GMAIL_EMAIL=your-gmail@gmail.com
GMAIL_PASSWORD=your-app-password

# SendGrid Configuration
SENDGRID_API_KEY=your-api-key
```

## 🎯 Recommended Action Plan

### Immediate (Today)
1. **Set up Gmail SMTP** for testing and development
2. **Test email functionality** with Gmail
3. **Continue development** with working email service

### Short Term (This Week)
1. **Contact DTI IT Administrator** for Microsoft account setup
2. **Request app password generation** for your account
3. **Test Microsoft configuration** once setup is complete

### Long Term (Next Week)
1. **Switch back to Microsoft** once properly configured
2. **Set up monitoring** for email delivery
3. **Configure backup email service** if needed

## 🔧 Quick Commands

### Switch to Gmail
```bash
export EMAIL_SERVICE=gmail
export GMAIL_EMAIL=your-gmail@gmail.com
export GMAIL_PASSWORD=your-app-password
npm run dev
```

### Switch to SendGrid
```bash
export EMAIL_SERVICE=sendgrid
export SENDGRID_API_KEY=your-api-key
npm run dev
```

### Switch back to Microsoft
```bash
export EMAIL_SERVICE=microsoft
export MICROSOFT_EMAIL=MalikhaingPinoy@dti.gov.ph
export MICROSOFT_PASSWORD=your-16-character-app-password
npm run dev
```

## 📞 Support

- **Gmail Setup**: [Google App Passwords Guide](https://support.google.com/accounts/answer/185833)
- **SendGrid Setup**: [SendGrid Documentation](https://sendgrid.com/docs/)
- **Microsoft Government**: Contact your DTI IT administrator
- **Application Issues**: Check the troubleshooting guides in this project

Choose the option that works best for your timeline and requirements!
