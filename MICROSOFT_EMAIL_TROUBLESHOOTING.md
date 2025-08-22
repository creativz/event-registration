# Microsoft Email Troubleshooting Guide

## 🔍 Issue: 8-Character Password Instead of 16-Character App Password

### Problem Description
You received an 8-character password instead of the expected 16-character app password from Microsoft.

### Possible Causes & Solutions

#### 1. **Using Regular Password Instead of App Password**
- **Cause**: You might be using your regular Microsoft account password instead of an app password
- **Solution**: Generate a proper app password

**Steps to Generate App Password:**
1. Go to [Microsoft Account Security](https://account.microsoft.com/security)
2. Sign in with your Microsoft account
3. Click "Advanced security options"
4. Under "App passwords", click "Create a new app password"
5. Name it "Event Registration System"
6. Copy the generated 16-character password

#### 2. **Account Type Issues**
- **Cause**: Different Microsoft account types have different authentication methods
- **Solution**: Check your account type and use appropriate authentication

**Account Types:**
- **Personal Microsoft Account** (Outlook.com, Hotmail.com): Use app passwords
- **Work/School Account** (Office 365): May use regular password or require admin setup
- **Government Account** (.gov.ph): May have special security requirements

#### 3. **Government Email Special Requirements**
Since you're using `MalikhaingPinoy@dti.gov.ph`, this is likely a government email with special security:

**For Government Microsoft 365 Accounts:**
1. **Contact your IT Administrator** - Government accounts often have restricted app password generation
2. **Use Modern Authentication** - May require OAuth2 instead of app passwords
3. **Check Security Policies** - Government accounts may have specific security requirements

### Alternative Solutions

#### Option 1: Use Regular Password (if allowed)
If your government account allows regular password authentication:

```javascript
const EMAIL_CONFIG = {
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false,
  auth: {
    user: 'MalikhaingPinoy@dti.gov.ph',
    pass: 'your-regular-password' // Use your regular password
  }
};
```

#### Option 2: Use OAuth2 Authentication
For government accounts, OAuth2 might be required:

```javascript
const EMAIL_CONFIG = {
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false,
  auth: {
    type: 'OAuth2',
    user: 'MalikhaingPinoy@dti.gov.ph',
    clientId: 'your-client-id',
    clientSecret: 'your-client-secret',
    refreshToken: 'your-refresh-token'
  }
};
```

#### Option 3: Use Microsoft Graph API
For government accounts, Microsoft Graph API might be more appropriate:

```javascript
// Use Microsoft Graph API instead of SMTP
const graphConfig = {
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  tenantId: 'your-tenant-id'
};
```

### Testing Your Current Setup

#### 1. Test SMTP Connection
Create a test script to verify your credentials:

```javascript
// test-email.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false,
  auth: {
    user: 'MalikhaingPinoy@dti.gov.ph',
    pass: 'CIDO2025' // Your 8-character password
  },
  debug: true,
  logger: true
});

// Test connection
transporter.verify(function(error, success) {
  if (error) {
    console.log('❌ Connection failed:', error);
  } else {
    console.log('✅ Server is ready to take our messages');
  }
});
```

#### 2. Test Email Sending
```javascript
// Test sending an email
const mailOptions = {
  from: 'MalikhaingPinoy@dti.gov.ph',
  to: 'test@example.com',
  subject: 'Test Email',
  text: 'This is a test email'
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log('❌ Email error:', error);
  } else {
    console.log('✅ Email sent:', info.response);
  }
});
```

### Government Email Specific Steps

#### 1. Contact DTI IT Administrator
Since this is a government email, contact your IT administrator to:
- Enable app password generation
- Configure SMTP access
- Set up proper authentication methods

#### 2. Check Government Security Policies
Government emails often have:
- **Restricted app access**
- **Required security policies**
- **Specific authentication methods**
- **Audit requirements**

#### 3. Alternative Government Email Solutions
Consider these alternatives for government emails:
- **Use Microsoft Graph API** instead of SMTP
- **Set up a service account** specifically for email sending
- **Use government-approved email services**
- **Configure OAuth2 authentication**

### Quick Fix for Development

For immediate testing, you can use a different email service:

#### Option A: Use Gmail SMTP
```javascript
const EMAIL_CONFIG = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your-gmail@gmail.com',
    pass: 'your-gmail-app-password'
  }
};
```

#### Option B: Use SendGrid
```javascript
const EMAIL_CONFIG = {
  host: 'smtp.sendgrid.net',
  port: 587,
  secure: false,
  auth: {
    user: 'apikey',
    pass: 'your-sendgrid-api-key'
  }
};
```

### Next Steps

1. **Test your current 8-character password** with the test script above
2. **Contact your IT administrator** for proper app password setup
3. **Consider using Microsoft Graph API** for government accounts
4. **Set up OAuth2 authentication** if required
5. **Use alternative email service** for immediate testing

### Support Resources

- **Microsoft 365 Government Support**: https://www.microsoft.com/en-us/microsoft-365/government
- **DTI IT Support**: Contact your internal IT department
- **Microsoft Graph API Documentation**: https://docs.microsoft.com/en-us/graph/
- **Nodemailer Documentation**: https://nodemailer.com/

Let me know the results of testing your current 8-character password, and I can help you with the next steps!
