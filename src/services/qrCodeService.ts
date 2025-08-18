import QRCode from 'qrcode';

export const qrCodeService = {
  // Generate QR code for a registration
  async generateQRCode(registrationId: string): Promise<{ qrCode: string; qrCodeData: string }> {
    try {
      // Create QR code data with registration ID and timestamp
      const qrData = {
        registrationId,
        timestamp: new Date().toISOString(),
        event: 'Malikhaing Pinoy Expo 2025'
      };
      
      const qrCodeData = JSON.stringify(qrData);
      
      // Generate QR code as base64
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
        qrCodeData
      };
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new Error('Failed to generate QR code');
    }
  },

  // Verify QR code data
  verifyQRCode(qrCodeData: string): { registrationId: string; timestamp: string; event: string } | null {
    try {
      const data = JSON.parse(qrCodeData);
      if (data.registrationId && data.timestamp && data.event) {
        return data;
      }
      return null;
    } catch (error) {
      console.error('Error verifying QR code:', error);
      return null;
    }
  }
};
