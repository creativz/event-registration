import * as XLSX from 'xlsx';
import { RegistrationData } from '../types';

export const exportToExcel = (data: RegistrationData[], filename: string = 'event-registrations') => {
  try {
    // Transform data for export
    const exportData = data.map(registration => ({
      'Email Address': registration.email,
      'Last Name': registration.lastName,
      'First Name': registration.firstName,
      'Institution/Organization': registration.institution,
      'Designation': registration.designation,
      'Contact Number': registration.contactNumber,
      'Wed Sept 3 - Creative Domain Showcase': registration.eventDays.wedSept3 ? 'Yes' : 'No',
      'Thurs Sept 4 - Opening Program': registration.eventDays.thursSept4 ? 'Yes' : 'No',
      'Fri Sept 5 - Creative Domain Showcase': registration.eventDays.friSept5 ? 'Yes' : 'No',
      'Sat Sept 6 - Creative Domain Showcase': registration.eventDays.satSept6 ? 'Yes' : 'No',
      'Sun Sept 7 - Closing Program': registration.eventDays.sunSept7 ? 'Yes' : 'No',
      'Not Attending': registration.eventDays.notAttending ? 'Yes' : 'No',
      'Registration Date': registration.registrationDate.toLocaleDateString(),
      'Registration Time': registration.registrationDate.toLocaleTimeString(),
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Auto-size columns
    const columnWidths = [
      { wch: 25 }, // Email Address
      { wch: 15 }, // Last Name
      { wch: 15 }, // First Name
      { wch: 25 }, // Institution/Organization
      { wch: 20 }, // Designation
      { wch: 18 }, // Contact Number
      { wch: 35 }, // Wed Sept 3
      { wch: 30 }, // Thurs Sept 4
      { wch: 35 }, // Fri Sept 5
      { wch: 35 }, // Sat Sept 6
      { wch: 30 }, // Sun Sept 7
      { wch: 15 }, // Not Attending
      { wch: 18 }, // Registration Date
      { wch: 18 }, // Registration Time
    ];
    worksheet['!cols'] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const fullFilename = `${filename}-${timestamp}.xlsx`;

    // Save file
    XLSX.writeFile(workbook, fullFilename);

    return fullFilename;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw new Error('Failed to export data');
  }
};

export const exportToCSV = (data: RegistrationData[], filename: string = 'event-registrations') => {
  try {
    // Transform data for export
    const exportData = data.map(registration => ({
      'Email Address': registration.email,
      'Last Name': registration.lastName,
      'First Name': registration.firstName,
      'Institution/Organization': registration.institution,
      'Designation': registration.designation,
      'Contact Number': registration.contactNumber,
      'Wed Sept 3 - Creative Domain Showcase': registration.eventDays.wedSept3 ? 'Yes' : 'No',
      'Thurs Sept 4 - Opening Program': registration.eventDays.thursSept4 ? 'Yes' : 'No',
      'Fri Sept 5 - Creative Domain Showcase': registration.eventDays.friSept5 ? 'Yes' : 'No',
      'Sat Sept 6 - Creative Domain Showcase': registration.eventDays.satSept6 ? 'Yes' : 'No',
      'Sun Sept 7 - Closing Program': registration.eventDays.sunSept7 ? 'Yes' : 'No',
      'Not Attending': registration.eventDays.notAttending ? 'Yes' : 'No',
      'Registration Date': registration.registrationDate.toLocaleDateString(),
      'Registration Time': registration.registrationDate.toLocaleTimeString(),
    }));

    // Convert to CSV
    const csvContent = XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(exportData));

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().split('T')[0];
    const fullFilename = `${filename}-${timestamp}.csv`;
    
    link.href = URL.createObjectURL(blob);
    link.download = fullFilename;
    link.click();

    return fullFilename;
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    throw new Error('Failed to export data');
  }
};
