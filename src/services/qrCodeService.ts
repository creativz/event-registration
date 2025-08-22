import QRCode from 'qrcode';

// Generate a short 6-character ID
const generateShortId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const qrCodeService = {
  // Generate QR code for registration
  async generateQRCode(shortId: string): Promise<{ qrCode: string; qrCodeData: string }> {
    try {
      // Use the provided short ID instead of generating a new one
      const qrCodeData = shortId;
      
      // Generate QR code image
      const qrCode = await QRCode.toDataURL(qrCodeData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      return {
        qrCode,
        qrCodeData: shortId // Store the short ID
      };
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new Error('Failed to generate QR code');
    }
  },

  // Generate a new short ID (for new registrations)
  generateShortId(): string {
    return generateShortId();
  },

  // Verify QR code data
  verifyQRCode(qrCodeData: string): { registrationId: string } | null {
    try {
      // Check if the QR code data is a valid 6-character ID
      if (qrCodeData && qrCodeData.length === 6 && /^[A-Z0-9]{6}$/.test(qrCodeData)) {
        return {
          registrationId: qrCodeData
        };
      }
      return null;
    } catch (error) {
      console.error('Error verifying QR code:', error);
      return null;
    }
  }
};
