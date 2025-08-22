import { RegistrationData } from '../types';

// Function URLs
const FUNCTION_BASE_URL = 'https://us-central1-microsite-baac6.cloudfunctions.net';
const sendConfirmationEmailUrl = `${FUNCTION_BASE_URL}/sendConfirmationEmailHttp`;
const testEmailUrl = `${FUNCTION_BASE_URL}/testEmailHttp`;

export const emailService = {
  // Send confirmation email with QR code
  async sendConfirmationEmail(registration: RegistrationData): Promise<boolean> {
    try {
      console.log('📧 SENDING REAL EMAIL via HTTP Functions...');
      console.log('📧 To:', registration.email);
      console.log('📧 Function URL:', sendConfirmationEmailUrl);
      
      // Call HTTP Function to send real email
      console.log('📧 Calling HTTP Function with data:', { registration });
      const response = await fetch(sendConfirmationEmailUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ registration }),
      });
      
      console.log('📧 HTTP Response status:', response.status);
      const data = await response.json();
      console.log('📧 Function data:', data);
      
      if (data.success) {
        console.log('✅ Email sent successfully!');
        console.log('📧 Message ID:', data.messageId);
        console.log('📧 Response:', data.response);
        return true;
      } else {
        console.error('❌ Email sending failed:', data);
        return false;
      }
      
    } catch (error: any) {
      console.error('❌ Error calling email function:', error);
      console.error('❌ Error details:', error.message);
      console.error('❌ Error code:', error.code);
      console.error('❌ Error stack:', error.stack);
      
      // Fallback to simulation mode if Firebase Function fails
      console.log('🔄 Falling back to simulation mode...');
      return this.simulateEmailSending(registration);
    }
  },

  // Simulate email sending (fallback)
  async simulateEmailSending(registration: RegistrationData): Promise<boolean> {
    try {
      const emailContent = this.generateEmailContent(registration);
      
      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('📧 SIMULATION MODE: Email would be sent to:', registration.email);
      console.log('📧 Email content preview:', emailContent.substring(0, 200) + '...');
      
      // In development, show email preview
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        this.showEmailPreview(registration, emailContent);
      }
      
      return true;
    } catch (error) {
      console.error('Error in email simulation:', error);
      return false;
    }
  },

  // Test email sending
  async testEmail(testEmail: string): Promise<boolean> {
    try {
      console.log('🧪 Testing email with HTTP Functions...');
      console.log('📧 Test email:', testEmail);
      console.log('📧 Function URL:', testEmailUrl);
      
      const response = await fetch(testEmailUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testEmail }),
      });
      
      console.log('📧 HTTP Response status:', response.status);
      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Test email sent successfully!');
        console.log('📧 Message ID:', data.messageId);
        console.log('📧 Response:', data.response);
        return true;
      } else {
        console.error('❌ Test email failed:', data);
        return false;
      }
      
    } catch (error: any) {
      console.error('❌ Error testing email:', error);
      return false;
    }
  },

  // Generate email content with QR code (for preview only)
  generateEmailContent(registration: RegistrationData): string {
    const registrationId = registration.shortId || registration.qrCodeData || registration.id;
    const emailContent = `
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
              <strong>Registration Date:</strong> ${registration.registrationDate.toLocaleDateString()}
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
              ${registration.eventDays.wedSept3 ? '<li>Wednesday, September 3: Creative Domain Showcase</li>' : ''}
              ${registration.eventDays.thursSept4 ? '<li>Thursday, September 4: Opening Program</li>' : ''}
              ${registration.eventDays.friSept5 ? '<li>Friday, September 5: Creative Domain Showcase</li>' : ''}
              ${registration.eventDays.satSept6 ? '<li>Saturday, September 6: Creative Domain Showcase</li>' : ''}
              ${registration.eventDays.sunSept7 ? '<li>Sunday, September 7: Closing Program</li>' : ''}
              ${registration.eventDays.notAttending ? '<li>Not Attending</li>' : ''}
            </ul>
            
            <div class="qr-code">
              <h3>Your Entry QR Code</h3>
              <p>Please present this QR code at the event entrance for verification:</p>
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${registrationId}" alt="QR Code for Event Entry" />
              <p><small>Registration ID: ${registrationId}</small></p>
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
            <p>This is an automated confirmation email. Please do not reply to this email.</p>
            <p>&copy; 2025 Malikhaing Pinoy Expo. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    return emailContent;
  },

  // Show email preview in development
  showEmailPreview(registration: RegistrationData, emailContent: string): void {
    // Create a modal to show the email content
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
      background: white;
      padding: 20px;
      border-radius: 8px;
      max-width: 800px;
      max-height: 80vh;
      overflow-y: auto;
      position: relative;
    `;

    content.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2 style="margin: 0;">📧 Email Preview (Simulation Mode)</h2>
        <button onclick="this.closest('.email-preview-modal').remove()" 
                style="background: #ef4444; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
          Close
        </button>
      </div>
      <div style="margin-bottom: 15px;">
        <strong>To:</strong> ${registration.email}<br>
        <strong>Subject:</strong> Registration Confirmation - Malikhaing Pinoy Expo 2025<br>
        <strong>Status:</strong> 🔄 Simulation Mode (Firebase Functions not available)
      </div>
      <div style="border: 1px solid #ddd; padding: 20px; border-radius: 4px;">
        ${emailContent}
      </div>
    `;

    modal.className = 'email-preview-modal';
    modal.appendChild(content);
    document.body.appendChild(modal);
  }
};
