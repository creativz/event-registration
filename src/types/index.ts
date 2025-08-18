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
  qrCodeData?: string; // The data encoded in the QR code (registration ID)
  emailSent?: boolean; // Whether confirmation email was sent
  emailSentDate?: Date; // When the email was sent
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
