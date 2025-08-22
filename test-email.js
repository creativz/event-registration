const nodemailer = require('nodemailer');

// Test your current Microsoft email configuration
const testEmailConfig = {
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false,
  auth: {
    user: 'malikhaingpinoy@dti.gov.ph',
    pass: 'vkhxrmhbyqychhwf' // Your new 16-character password
  },
  debug: true,
  logger: true,
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false
  }
};

console.log('🔍 Testing Microsoft Email Configuration...');
console.log('📧 Email:', testEmailConfig.auth.user);
console.log('🔑 Password Length:', testEmailConfig.auth.pass.length, 'characters');
console.log('🌐 Server:', testEmailConfig.host + ':' + testEmailConfig.port);

const transporter = nodemailer.createTransport(testEmailConfig);

// Test 1: Verify SMTP connection
console.log('\n🧪 Test 1: Verifying SMTP connection...');
transporter.verify(function(error, success) {
  if (error) {
    console.log('❌ Connection failed:', error.message);
    console.log('💡 This might be due to:');
    console.log('   - Incorrect password');
    console.log('   - Account security settings');
    console.log('   - Government account restrictions');
    console.log('   - Need for app password instead of regular password');
  } else {
    console.log('✅ Server is ready to take our messages');
    
    // Test 2: Send a test email
    console.log('\n🧪 Test 2: Sending test email...');
    const mailOptions = {
      from: 'malikhaingpinoy@dti.gov.ph',
      to: 'test@example.com', // Change this to your test email
      subject: 'Test Email - Malikhaing Pinoy Expo 2025',
      text: 'This is a test email from the event registration system.',
      html: `
        <h2>Test Email</h2>
        <p>This is a test email from the Malikhaing Pinoy Expo 2025 registration system.</p>
        <p>If you receive this, the email configuration is working correctly!</p>
        <p><strong>Sent from:</strong> ${testEmailConfig.auth.user}</p>
        <p><strong>Server:</strong> ${testEmailConfig.host}:${testEmailConfig.port}</p>
        <p><strong>Password Length:</strong> ${testEmailConfig.auth.pass.length} characters</p>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('❌ Email sending failed:', error.message);
        console.log('💡 Possible solutions:');
        console.log('   1. Check if your account allows SMTP access');
        console.log('   2. Contact your IT administrator for app password');
        console.log('   3. Try using Microsoft Graph API instead');
      } else {
        console.log('✅ Email sent successfully!');
        console.log('📧 Message ID:', info.messageId);
        console.log('📧 Response:', info.response);
        console.log('🎉 Your Microsoft email configuration is working!');
      }
    });
  }
});

// Test 3: Check alternative configurations
console.log('\n🧪 Test 3: Checking alternative configurations...');

// Alternative 1: Try with different port
const testConfig2 = {
  ...testEmailConfig,
  port: 465,
  secure: true
};

const transporter2 = nodemailer.createTransport(testConfig2);
transporter2.verify(function(error, success) {
  if (error) {
    console.log('❌ Alternative port 465 failed:', error.message);
  } else {
    console.log('✅ Alternative port 465 works!');
  }
});

// Alternative 2: Try without TLS options
const testConfig3 = {
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false,
  auth: {
    user: 'malikhaingpinoy@dti.gov.ph',
    pass: 'vkhxrmhbyqychhwf'
  }
};

const transporter3 = nodemailer.createTransport(testConfig3);
transporter3.verify(function(error, success) {
  if (error) {
    console.log('❌ Basic config failed:', error.message);
  } else {
    console.log('✅ Basic config works!');
  }
});

console.log('\n📋 Summary:');
console.log('If all tests fail, you likely need to:');
console.log('1. Generate a proper 16-character app password');
console.log('2. Contact your IT administrator for government account setup');
console.log('3. Use Microsoft Graph API instead of SMTP');
console.log('4. Consider using an alternative email service');

console.log('\n🔗 Next Steps:');
console.log('- Check the MICROSOFT_EMAIL_TROUBLESHOOTING.md file for detailed solutions');
console.log('- Contact your DTI IT administrator for proper email setup');
console.log('- Consider using Gmail or SendGrid for immediate testing');
