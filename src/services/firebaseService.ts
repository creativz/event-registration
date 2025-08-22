import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy,
  Timestamp,
  updateDoc,
  doc,
  where
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { RegistrationData, AttendanceRecord, DailyAttendance } from '../types';
import { qrCodeService } from './qrCodeService';
import { emailService } from './emailService';

const COLLECTION_NAME = 'registrations';
const ATTENDANCE_COLLECTION = 'attendance';

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
      
      // Generate a short ID first
      const shortId = qrCodeService.generateShortId();
      
      // Generate QR code for the registration using the short ID
      const { qrCode, qrCodeData } = await qrCodeService.generateQRCode(shortId);
      
      // Update the document with QR code data and short ID
      await updateDoc(doc(db, COLLECTION_NAME, registrationId), {
        qrCode,
        qrCodeData,
        shortId: shortId, // Store the short ID for easy lookup
        emailSent: false
      });
      
      // Get the complete registration data for email
      const completeRegistration: RegistrationData = {
        id: registrationId,
        ...data,
        registrationDate: registrationData.registrationDate.toDate(),
        qrCode,
        qrCodeData,
        shortId: shortId,
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

  // Get registration by short ID
  async getRegistrationByShortId(shortId: string): Promise<RegistrationData | null> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('shortId', '==', shortId)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }
      
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      
      return {
        id: doc.id,
        ...data,
        registrationDate: data.registrationDate.toDate(),
        emailSentDate: data.emailSentDate ? data.emailSentDate.toDate() : undefined,
      } as RegistrationData;
    } catch (error) {
      console.error('Error getting registration by short ID:', error);
      return null;
    }
  },

  // Record attendance
  async recordAttendance(
    registration: RegistrationData, 
    eventDay: string, 
    checkedInBy: string,
    qrCodeData?: string
  ): Promise<string> {
    try {
      const attendanceData: Omit<AttendanceRecord, 'id' | 'checkInTime'> = {
        registrationId: registration.id!,
        participantName: `${registration.firstName} ${registration.lastName}`,
        participantEmail: registration.email,
        institution: registration.institution,
        eventDay,
        checkedInBy,
        qrCodeData
      };

      const docRef = await addDoc(collection(db, ATTENDANCE_COLLECTION), {
        ...attendanceData,
        checkInTime: Timestamp.now()
      });

      return docRef.id;
    } catch (error) {
      console.error('Error recording attendance:', error);
      throw new Error('Failed to record attendance');
    }
  },

  // Get daily attendance
  async getDailyAttendance(eventDay: string): Promise<AttendanceRecord[]> {
    try {
      const q = query(
        collection(db, ATTENDANCE_COLLECTION),
        where('eventDay', '==', eventDay),
        orderBy('checkInTime', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          checkInTime: data.checkInTime.toDate(),
        } as AttendanceRecord;
      });
    } catch (error) {
      console.error('Error getting daily attendance:', error);
      throw new Error('Failed to get daily attendance');
    }
  },

  // Get all attendance records
  async getAllAttendance(): Promise<AttendanceRecord[]> {
    try {
      const q = query(collection(db, ATTENDANCE_COLLECTION), orderBy('checkInTime', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          checkInTime: data.checkInTime.toDate(),
        } as AttendanceRecord;
      });
    } catch (error) {
      console.error('Error getting all attendance:', error);
      throw new Error('Failed to get attendance records');
    }
  },

  // Get attendance summary for all days
  async getAttendanceSummary(): Promise<DailyAttendance[]> {
    try {
      const eventDays = [
        { key: 'wedSept3', name: 'Wednesday, September 3', date: '2025-09-03' },
        { key: 'thursSept4', name: 'Thursday, September 4', date: '2025-09-04' },
        { key: 'friSept5', name: 'Friday, September 5', date: '2025-09-05' },
        { key: 'satSept6', name: 'Saturday, September 6', date: '2025-09-06' },
        { key: 'sunSept7', name: 'Sunday, September 7', date: '2025-09-07' }
      ];

      const summary: DailyAttendance[] = [];

      for (const day of eventDays) {
        const attendees = await this.getDailyAttendance(day.key);
        summary.push({
          date: day.date,
          dayName: day.name,
          attendees,
          totalAttendees: attendees.length
        });
      }

      return summary;
    } catch (error) {
      console.error('Error getting attendance summary:', error);
      throw new Error('Failed to get attendance summary');
    }
  },

  // Update participant's event day registration
  async updateEventDayRegistration(registrationId: string, eventDay: string, isRegistered: boolean): Promise<boolean> {
    try {
      const docRef = doc(db, COLLECTION_NAME, registrationId);
      
      // Update the specific event day
      await updateDoc(docRef, {
        [`eventDays.${eventDay}`]: isRegistered,
        // If registering for a day, ensure "notAttending" is false
        ...(isRegistered && { 'eventDays.notAttending': false })
      });
      
      console.log(`Updated ${eventDay} registration to ${isRegistered} for participant ${registrationId}`);
      return true;
    } catch (error) {
      console.error('Error updating event day registration:', error);
      return false;
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
