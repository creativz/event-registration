export interface RegistrationData {
  id?: string;
  email: string;
  lastName: string;
  firstName: string;
  institution: string;
  designation: string;
  contactNumber: string;
  eventDays: {
    wedSept3: boolean;
    thursSept4: boolean;
    friSept5: boolean;
    satSept6: boolean;
    sunSept7: boolean;
    notAttending: boolean;
  };
  registrationDate: Date;
  qrCode?: string; // Base64 encoded QR code image
  qrCodeData?: string; // The data encoded in the QR code (short ID)
  shortId?: string; // Short 6-character ID for easy reference
  emailSent?: boolean; // Whether confirmation email was sent
  emailSentDate?: Date; // When the email was sent
}

export interface AttendanceRecord {
  id?: string;
  registrationId: string;
  participantName: string;
  participantEmail: string;
  institution: string;
  eventDay: string; // 'wedSept3', 'thursSept4', 'friSept5', 'satSept6', 'sunSept7'
  checkInTime: Date;
  checkedInBy: string; // Admin email who verified the QR code
  qrCodeData?: string; // QR code data used for verification
}

export interface DailyAttendance {
  date: string;
  dayName: string;
  attendees: AttendanceRecord[];
  totalAttendees: number;
}

export interface EventDetails {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  price: {
    earlyBird: number;
    regular: number;
    vip: number;
  };
  earlyBirdDeadline: string;
}
