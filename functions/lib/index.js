"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.testEmailHttp = exports.sendConfirmationEmailHttp = void 0;
const functions = __importStar(require("firebase-functions"));
const nodemailer = __importStar(require("nodemailer"));
// Microsoft Email Configuration
const emailConfig = {
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false,
    auth: {
        user: 'malikhaingpinoy@dti.gov.ph',
        pass: 'vkhxrmhbyqychhwf',
    },
    tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false,
    },
};
// Create transporter
const transporter = nodemailer.createTransport(emailConfig);
/**
 * Generate email content for registration confirmation
 * @param registration - Registration data
 * @returns HTML email content
 */
function generateEmailContent(registration) {
    const eventDays = [];
    if (registration.eventDays.wedSept3) {
        eventDays.push('<li>Wednesday, September 3: Creative Domain Showcase</li>');
    }
    if (registration.eventDays.thursSept4) {
        eventDays.push('<li>Thursday, September 4: Opening Program</li>');
    }
    if (registration.eventDays.friSept5) {
        eventDays.push('<li>Friday, September 5: Creative Domain Showcase</li>');
    }
    if (registration.eventDays.satSept6) {
        eventDays.push('<li>Saturday, September 6: Creative Domain Showcase</li>');
    }
    if (registration.eventDays.sunSept7) {
        eventDays.push('<li>Sunday, September 7: Closing Program</li>');
    }
    if (registration.eventDays.notAttending) {
        eventDays.push('<li>Not Attending</li>');
    }
    const registrationId = registration.shortId ||
        registration.qrCodeData || registration.id;
    const registrationDate = new Date(registration.registrationDate)
        .toLocaleDateString();
    return `
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
          <h2>Hello ${registration.firstName} ${registration.lastName}!</h2>
          
          <p>Thank you for registering for the <strong>Malikhaing Pinoy Expo 2025</strong>! Your registration has been confirmed.</p>
          
          <div class="highlight">
            <strong>Registration ID:</strong> ${registrationId}<br>
            <strong>Registration Date:</strong> ${registrationDate}
          </div>
          
          <h3>Your Registration Details:</h3>
          <ul>
            <li><strong>Name:</strong> ${registration.firstName} ${registration.lastName}</li>
            <li><strong>Email:</strong> ${registration.email}</li>
            <li><strong>Institution:</strong> ${registration.institution}</li>
            <li><strong>Designation:</strong> ${registration.designation}</li>
            <li><strong>Contact:</strong> ${registration.contactNumber}</li>
          </ul>
          
          <h3>Event Days You'll Be Attending:</h3>
          <ul>
            ${eventDays.join('')}
          </ul>
          
          <div class="qr-code">
            <h3>Your Entry QR Code</h3>
            <p>Please present this QR code at the event entrance for verification:</p>
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${registrationId}" alt="QR Code for Event Entry" style="max-width: 300px; height: auto; border: 2px solid #ddd; display: block; margin: 0 auto;" />
            <p><small>Registration ID: ${registrationId}</small></p>
            <p style="font-size: 12px; color: #666; margin-top: 10px;">
              <strong>Note:</strong> If the QR code image doesn't display properly, please save this email and open it on your phone or computer. 
              You can also print it out and bring it to the event.
            </p>
          </div>
          
          <div class="highlight">
            <strong>Important:</strong> Please save this email and have your QR code ready when you arrive at the event. 
            You can either show the QR code on your phone or print it out.
          </div>
          
          <h3>Event Information:</h3>
          <p><strong>Venue:</strong> SMX Convention Center, SM Aura Premier, Taguig City</p>
          <p><strong>Date:</strong> September 3-7, 2025</p>
          <p><strong>Time:</strong> 9:00 AM - 6:00 PM daily</p>
          
          <p>If you have any questions, please contact us at malikhaingpinoy@dti.gov.ph.</p>
          
          <p>We look forward to seeing you at the Malikhaing Pinoy Expo 2025!</p>
        </div>
        
        <div class="footer">
          <p>This is an automated confirmation email sent via Microsoft Outlook. Please do not reply to this email.</p>
          <p>&copy; 2025 Malikhaing Pinoy Expo. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
// Firebase Function to send confirmation email (HTTP function with CORS)
exports.sendConfirmationEmailHttp = functions.https.onRequest(async (req, res) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Origin', 'https://microsite-baac6.web.app');
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send('');
        return;
    }
    try {
        console.log('🚀 HTTP Function called with data:', JSON.stringify(req.body, null, 2));
        const { registration } = req.body;
        if (!registration || !registration.email) {
            console.error('❌ Missing registration data or email');
            res.status(400).json({ success: false, error: 'Registration data and email are required' });
            return;
        }
        console.log('📧 Sending confirmation email to:', registration.email);
        console.log('📧 Registration ID:', registration.shortId || registration.id);
        const mailOptions = {
            from: 'malikhaingpinoy@dti.gov.ph',
            to: registration.email,
            subject: 'Registration Confirmation - Malikhaing Pinoy Expo 2025',
            html: generateEmailContent(registration),
        };
        console.log('📧 Mail options prepared, sending email...');
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully:', info.messageId);
        console.log('📧 Response:', info.response);
        // Set CORS headers for response
        res.set('Access-Control-Allow-Origin', 'https://microsite-baac6.web.app');
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.json({
            success: true,
            messageId: info.messageId,
            response: info.response,
        });
    }
    catch (error) {
        console.error('❌ Error sending email:', error);
        console.error('❌ Error details:', error instanceof Error ? error.message : 'Unknown error');
        // Set CORS headers for error response
        res.set('Access-Control-Allow-Origin', 'https://microsite-baac6.web.app');
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Test function to verify email configuration (HTTP function with CORS)
exports.testEmailHttp = functions.https.onRequest(async (req, res) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Origin', 'https://microsite-baac6.web.app');
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send('');
        return;
    }
    try {
        console.log('🧪 HTTP Test function called with data:', JSON.stringify(req.body, null, 2));
        const { testEmail } = req.body;
        if (!testEmail) {
            console.error('❌ Missing test email address');
            res.status(400).json({ success: false, error: 'Test email address is required' });
            return;
        }
        console.log('🧪 Testing email configuration with:', testEmail);
        const mailOptions = {
            from: 'malikhaingpinoy@dti.gov.ph',
            to: testEmail,
            subject: '🎨 Malikhaing Pinoy Expo 2025 - Email Test',
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
              • To: ${testEmail}<br>
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
      `,
        };
        console.log('📧 Test mail options prepared, sending test email...');
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Test email sent successfully:', info.messageId);
        console.log('📧 Test response:', info.response);
        // Set CORS headers for response
        res.set('Access-Control-Allow-Origin', 'https://microsite-baac6.web.app');
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.json({
            success: true,
            messageId: info.messageId,
            response: info.response,
        });
    }
    catch (error) {
        console.error('❌ Error sending test email:', error);
        console.error('❌ Test error details:', error instanceof Error ? error.message : 'Unknown error');
        // Set CORS headers for error response
        res.set('Access-Control-Allow-Origin', 'https://microsite-baac6.web.app');
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
//# sourceMappingURL=index.js.map