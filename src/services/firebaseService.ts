import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy,
  Timestamp,
  updateDoc,
  doc
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { RegistrationData } from '../types';
import { qrCodeService } from './qrCodeService';
import { emailService } from './emailService';

const COLLECTION_NAME = 'registrations';

export const firebaseService = {
  // Add a new registration
  async addRegistration(data: Omit<RegistrationData, 'id' | 'registrationDate'>): Promise<string> {
    try {
      const registrationData = {
        ...data,
        registrationDate: Timestamp.now(),
      };
      
      const docRef = await addDoc(collection(db, COLLECTION_NAME), registrationData);
      const registrationId = docRef.id;
      
      // Generate QR code for the registration
      const { qrCode, qrCodeData } = await qrCodeService.generateQRCode(registrationId);
      
      // Update the document with QR code data
      await updateDoc(doc(db, COLLECTION_NAME, registrationId), {
        qrCode,
        qrCodeData,
        emailSent: false
      });
      
      // Get the complete registration data for email
      const completeRegistration: RegistrationData = {
        id: registrationId,
        ...data,
        registrationDate: registrationData.registrationDate.toDate(),
        qrCode,
        qrCodeData,
        emailSent: false
      };
      
      // Send confirmation email with QR code
      const emailSent = await emailService.sendConfirmationEmail(completeRegistration);
      
      // Update email status
      if (emailSent) {
        await updateDoc(doc(db, COLLECTION_NAME, registrationId), {
          emailSent: true,
          emailSentDate: Timestamp.now()
        });
      }
      
      return registrationId;
    } catch (error) {
      console.error('Error adding registration:', error);
      throw new Error('Failed to add registration');
    }
  },

  // Get all registrations
  async getRegistrations(): Promise<RegistrationData[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('registrationDate', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          registrationDate: data.registrationDate.toDate(),
          emailSentDate: data.emailSentDate ? data.emailSentDate.toDate() : undefined,
        } as RegistrationData;
      });
    } catch (error) {
      console.error('Error getting registrations:', error);
      throw new Error('Failed to get registrations');
    }
  },

  // Get registration count
  async getRegistrationCount(): Promise<number> {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      return querySnapshot.size;
    } catch (error) {
      console.error('Error getting registration count:', error);
      throw new Error('Failed to get registration count');
    }
  },

  // Resend confirmation email
  async resendConfirmationEmail(registrationId: string): Promise<boolean> {
    try {
      const registrations = await this.getRegistrations();
      const registration = registrations.find(r => r.id === registrationId);
      
      if (!registration) {
        throw new Error('Registration not found');
      }
      
      const emailSent = await emailService.sendConfirmationEmail(registration);
      
      if (emailSent) {
        await updateDoc(doc(db, COLLECTION_NAME, registrationId), {
          emailSent: true,
          emailSentDate: Timestamp.now()
        });
      }
      
      return emailSent;
    } catch (error) {
      console.error('Error resending confirmation email:', error);
      return false;
    }
  }
};
