const nodemailer = require('nodemailer');

// Test sending a real email with the working Microsoft configuration
const testEmailConfig = {
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false,
  auth: {
    user: 'malikhaingpinoy@dti.gov.ph',
    pass: 'vkhxrmhbyqychhwf'
  },
  debug: true,
  logger: true,
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false
  }
};

console.log('🎉 Testing Real Email Sending with Microsoft...');
console.log('📧 From:', testEmailConfig.auth.user);
console.log('🔑 Password Length:', testEmailConfig.auth.pass.length, 'characters');

const transporter = nodemailer.createTransport(testEmailConfig);

// Test sending a real email
console.log('\n🧪 Sending real test email...');

// You can change this to your actual email address for testing
const recipientEmail = 'your-email@example.com'; // CHANGE THIS TO YOUR EMAIL

const mailOptions = {
  from: 'malikhaingpinoy@dti.gov.ph',
  to: recipientEmail,
  subject: '🎨 Malikhaing Pinoy Expo 2025 - Email Test',
  text: 'This is a test email from the Malikhaing Pinoy Expo 2025 registration system.',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1f2937; color: white; padding: 20px; text-align: center;">
        <h1>🎨 Malikhaing Pinoy Expo 2025</h1>
        <p>Email System Test</p>
      </div>
      
      <div style="padding: 20px; background: #f9fafb;">
        <h2>✅ Email System Working!</h2>
        <p>This is a test email to verify that the Microsoft email configuration is working correctly.</p>
        
        <div style="background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0;">
          <strong>Test Details:</strong><br>
          • From: malikhaingpinoy@dti.gov.ph<br>
          • To: ${recipientEmail}<br>
          • Server: smtp-mail.outlook.com:587<br>
          • Authentication: ✅ Working<br>
          • Password: 16-character app password
        </div>
        
        <h3>Next Steps:</h3>
        <ul>
          <li>✅ Email authentication is working</li>
          <li>✅ SMTP connection is successful</li>
          <li>✅ Ready to send registration confirmations</li>
          <li>✅ QR codes will be included in real emails</li>
        </ul>
        
        <p><strong>Event Information:</strong></p>
        <ul>
          <li><strong>Venue:</strong> SMX Convention Center, SM Aura Premier, Taguig City</li>
          <li><strong>Date:</strong> September 3-7, 2025</li>
          <li><strong>Time:</strong> 9:00 AM - 6:00 PM daily</li>
        </ul>
        
        <p>If you received this email, the Microsoft email system is working perfectly!</p>
      </div>
      
      <div style="background: #e5e7eb; padding: 15px; text-align: center; font-size: 12px;">
        <p>This is a test email from the Malikhaing Pinoy Expo 2025 registration system.</p>
        <p>&copy; 2025 Malikhaing Pinoy Expo. All rights reserved.</p>
      </div>
    </div>
  `
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log('❌ Email sending failed:', error.message);
    console.log('💡 Make sure to change the recipient email address in the script');
  } else {
    console.log('✅ Email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📧 Response:', info.response);
    console.log('🎉 Your Microsoft email system is fully operational!');
    console.log('📧 Check your email at:', recipientEmail);
  }
});

console.log('\n📝 Instructions:');
console.log('1. Change the recipientEmail variable to your actual email address');
console.log('2. Run this script again: node test-real-email.js');
console.log('3. Check your email to confirm delivery');
console.log('4. Once confirmed, your email system is ready for production!');
