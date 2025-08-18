import { RegistrationData } from '../types';

export const emailService = {
  // Send confirmation email with QR code
  async sendConfirmationEmail(registration: RegistrationData): Promise<boolean> {
    try {
      // For now, we'll simulate email sending
      // In a real implementation, you would integrate with a service like SendGrid, Mailgun, or AWS SES
      
      const emailContent = this.generateEmailContent(registration);
      
      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Email sent successfully to:', registration.email);
      console.log('Email content:', emailContent);
      
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  },

  // Generate email content with QR code
  generateEmailContent(registration: RegistrationData): string {
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
              <strong>Registration ID:</strong> ${registration.id}<br>
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
              <img src="${registration.qrCode}" alt="QR Code for Event Entry" />
              <p><small>Registration ID: ${registration.id}</small></p>
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
    `;
    
    return emailContent;
  }
};
