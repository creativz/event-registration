# Email Setup Guide for Malikhaing Pinoy Expo 2025

## 📧 Email Service Options

### Option 1: EmailJS (Recommended for Frontend)
EmailJS allows you to send emails directly from your frontend application without a backend server.

### Option 2: Backend Email Service
For production, you might want to use a backend service like SendGrid, Mailgun, or AWS SES.

---

## 🚀 Setting Up EmailJS

### Step 1: Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### Step 2: Create Email Service
1. In EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions
5. Note down your **Service ID**

### Step 3: Create Email Template
1. Go to "Email Templates"
2. Click "Create New Template"
3. Use this template structure:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Registration Confirmation - Malikhaing Pinoy Expo 2025</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1f2937; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .qr-code { text-align: center; margin: 20px 0; }
        .qr-code img { max-width: 300px; border: 2px solid #ddd; }
        .footer { background: #e5e7eb; padding: 15px; text-align: center; font-size: 12px; }
        .highlight { background: #fef3c7; padding: 10px; border-left: 4px solid #f59e0b; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎨 Malikhaing Pinoy Expo 2025</h1>
            <p>Registration Confirmation</p>
        </div>
        
        <div class="content">
            <h2>Hello {{to_name}}!</h2>
            
            <p>Thank you for registering for the <strong>Malikhaing Pinoy Expo 2025</strong>! Your registration has been confirmed.</p>
            
            <div class="highlight">
                <strong>Registration ID:</strong> {{registration_id}}<br>
                <strong>Registration Date:</strong> {{registration_date}}
            </div>
            
            <h3>Your Registration Details:</h3>
            <ul>
                <li><strong>Name:</strong> {{first_name}} {{last_name}}</li>
                <li><strong>Email:</strong> {{email}}</li>
                <li><strong>Institution:</strong> {{institution}}</li>
                <li><strong>Designation:</strong> {{designation}}</li>
                <li><strong>Contact:</strong> {{contact_number}}</li>
            </ul>
            
            <h3>Event Days You'll Be Attending:</h3>
            <p>{{event_days}}</p>
            
            <div class="qr-code">
                <h3>Your Entry QR Code</h3>
                <p>Please present this QR code at the event entrance for verification:</p>
                <img src="{{qr_code}}" alt="QR Code for Event Entry" />
                <p><small>Registration ID: {{registration_id}}</small></p>
            </div>
            
            <div class="highlight">
                <strong>Important:</strong> Please save this email and have your QR code ready when you arrive at the event. 
                You can either show the QR code on your phone or print it out.
            </div>
            
            <h3>Event Information:</h3>
            <p><strong>Venue:</strong> [Event Venue Address]</p>
            <p><strong>Date:</strong> September 3-7, 2025</p>
            <p><strong>Time:</strong> 9:00 AM - 6:00 PM daily</p>
            
            <p>If you have any questions, please contact us at [contact email].</p>
            
            <p>We look forward to seeing you at the Malikhaing Pinoy Expo 2025!</p>
        </div>
        
        <div class="footer">
            <p>This is an automated confirmation email. Please do not reply to this email.</p>
            <p>&copy; 2025 Malikhaing Pinoy Expo. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
```

4. Note down your **Template ID**

### Step 4: Get Public Key
1. Go to "Account" → "API Keys"
2. Copy your **Public Key**

### Step 5: Update Configuration
Update the `EMAILJS_CONFIG` in `src/services/emailService.ts`:

```typescript
const EMAILJS_CONFIG = {
  serviceId: 'your_service_id_here',
  templateId: 'your_template_id_here', 
  publicKey: 'your_public_key_here',
};
```

---

## 🧪 Testing Email Functionality

### Method 1: Development Mode (Current)
The system currently runs in simulation mode and shows email previews in development:

1. **Register a new participant** through the registration form
2. **Check browser console** for email simulation logs
3. **Email preview modal** will appear showing the exact email content
4. **Verify QR code** is included in the email

### Method 2: Real Email Testing (After EmailJS Setup)
1. **Configure EmailJS** following the steps above
2. **Update the configuration** in the code
3. **Register a new participant**
4. **Check your email** for the actual confirmation email
5. **Verify QR code** displays correctly

### Method 3: Admin Dashboard Testing
1. **Go to Admin Dashboard** (`/admin/dashboard`)
2. **Find any registration** in the list
3. **Click "Resend Email"** button
4. **Check email delivery** and content

---

## 🔧 Troubleshooting

### EmailJS Issues
- **Service not working**: Check if your email service is properly configured
- **Template errors**: Verify template variables match the code
- **Rate limits**: Free EmailJS accounts have monthly limits

### QR Code Issues
- **QR code not showing**: Check if the base64 image is properly generated
- **QR code too small**: Adjust the CSS in the email template
- **QR code broken**: Verify the image data is valid

### Development Testing
- **No email preview**: Check browser console for errors
- **Modal not showing**: Ensure you're in development mode
- **Console logs**: Look for "📧 SIMULATION" messages

---

## 📊 Email Analytics (EmailJS Pro)

With EmailJS Pro, you can:
- Track email delivery rates
- Monitor open rates
- View click-through rates
- Get detailed analytics

---

## 🔒 Security Considerations

### For Production
1. **Use environment variables** for API keys
2. **Implement rate limiting**
3. **Add email validation**
4. **Use HTTPS** for all communications
5. **Consider backend email service** for better security

### Environment Variables
Create a `.env` file:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

Then update the configuration:

```typescript
const EMAILJS_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
};
```

---

## 🎯 Quick Test Checklist

- [ ] EmailJS account created
- [ ] Email service configured
- [ ] Email template created
- [ ] Configuration updated in code
- [ ] Test registration submitted
- [ ] Email received successfully
- [ ] QR code displays correctly
- [ ] All registration details shown
- [ ] Event days listed properly
- [ ] Admin resend email works

---

## 📞 Support

If you encounter issues:
1. Check EmailJS documentation
2. Review browser console for errors
3. Verify all configuration values
4. Test with a simple email first
5. Contact EmailJS support if needed

The system is designed to gracefully fall back to simulation mode if EmailJS is not configured or fails, so your application will continue to work while you set up email functionality.
