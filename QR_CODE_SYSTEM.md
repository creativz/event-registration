# QR Code System for Event Registration

## Overview

This system generates unique QR codes for each event registration and sends them via email confirmation. The QR codes are used for event day verification and check-in.

## Features

### 1. QR Code Generation
- Each registration gets a unique QR code containing:
  - Registration ID
  - Timestamp
  - Event name
- QR codes are generated as base64 images and stored in Firebase

### 2. Email Confirmation
- Automatic email sending after successful registration
- Email includes:
  - Registration details
  - QR code image
  - Event information
  - Instructions for event day

### 3. Admin Dashboard Features
- View all registrations with QR codes
- Email status tracking (sent/pending)
- Ability to resend confirmation emails
- Download QR codes individually
- Export registration data

### 4. Event Day Verification
- QR code verification system at `/verify`
- Manual registration ID lookup
- Real-time verification against Firebase data
- Check-in confirmation

## Implementation Details

### Dependencies Added
```json
{
  "qrcode": "^1.5.3",
  "@types/qrcode": "^1.5.5",
  "nodemailer": "^6.9.7",
  "@types/nodemailer": "^6.4.14"
}
```

### Database Schema Updates
The `RegistrationData` interface now includes:
- `qrCode`: Base64 encoded QR code image
- `qrCodeData`: The data encoded in the QR code
- `emailSent`: Boolean indicating if confirmation email was sent
- `emailSentDate`: Timestamp when email was sent

### Services Created

#### 1. QR Code Service (`src/services/qrCodeService.ts`)
- `generateQRCode()`: Creates QR codes for registrations
- `verifyQRCode()`: Validates QR code data

#### 2. Email Service (`src/services/emailService.ts`)
- `sendConfirmationEmail()`: Sends confirmation emails with QR codes
- `generateEmailContent()`: Creates HTML email templates

### Components Created

#### 1. QR Verification (`src/components/QRVerification.tsx`)
- Event day check-in interface
- QR code scanning and manual verification
- Real-time registration lookup

## Usage

### For Event Organizers
1. Access admin dashboard at `/admin/dashboard`
2. View all registrations with QR codes
3. Monitor email delivery status
4. Resend emails if needed
5. Use verification system at `/verify` during event

### For Attendees
1. Register through the main form
2. Receive confirmation email with QR code
3. Present QR code at event entrance
4. QR code can be shown on phone or printed

### For Event Staff
1. Navigate to `/verify` for check-in
2. Scan QR codes or enter registration IDs manually
3. Verify attendee information
4. Confirm check-in

## Email Integration

The current implementation simulates email sending. For production use, integrate with:
- SendGrid
- Mailgun
- AWS SES
- Or any other email service provider

Update the `emailService.ts` file to use your preferred email service.

## Security Considerations

1. QR codes contain registration IDs that should be kept secure
2. Consider implementing rate limiting for verification attempts
3. Add authentication for the verification system in production
4. Implement logging for verification attempts

## Future Enhancements

1. Real-time QR code scanning with camera
2. Attendance tracking and analytics
3. Multiple event day support
4. Bulk email resending
5. QR code expiration dates
6. Offline verification capability

## API Endpoints

- `POST /api/registrations` - Create registration with QR code
- `GET /api/registrations` - Get all registrations
- `POST /api/verify` - Verify QR code/registration ID
- `POST /api/resend-email` - Resend confirmation email

## Environment Variables

Add these to your `.env` file for email integration:
```
EMAIL_SERVICE=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@yourdomain.com
```
