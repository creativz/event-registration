import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { firebaseService } from '../services/firebaseService';
import { DailyAttendance, AttendanceRecord } from '../types';
import { Users, Calendar, Download, FileSpreadsheet, FileText, LogOut, RefreshCw, Eye, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import * as XLSX from 'xlsx';

const AttendanceDashboard: React.FC = () => {
  const [attendanceSummary, setAttendanceSummary] = useState<DailyAttendance[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [dayAttendees, setDayAttendees] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signOut, authUser } = useAuth();

  useEffect(() => {
    loadAttendanceSummary();
  }, []);

  const loadAttendanceSummary = async () => {
    setLoading(true);
    try {
      const summary = await firebaseService.getAttendanceSummary();
      setAttendanceSummary(summary);
    } catch (error) {
      toast.error('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const loadDayAttendees = async (eventDay: string) => {
    setLoading(true);
    try {
      const attendees = await firebaseService.getDailyAttendance(eventDay);
      setDayAttendees(attendees);
      setSelectedDay(eventDay);
    } catch (error) {
      toast.error('Failed to load day attendees');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
      navigate('/admin/login');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const exportDayAttendanceToExcel = async (eventDay: string, dayName: string) => {
    try {
      const attendees = await firebaseService.getDailyAttendance(eventDay);
      
      // Transform data for Excel export
      const exportData = attendees.map(attendee => ({
        'Participant Name': attendee.participantName,
        'Email Address': attendee.participantEmail,
        'Institution/Organization': attendee.institution,
        'Check-in Date': attendee.checkInTime.toLocaleDateString(),
        'Check-in Time': attendee.checkInTime.toLocaleTimeString(),
        'Checked in by': attendee.checkedInBy,
        'Registration ID': attendee.registrationId || '',
        'QR Code Data': attendee.qrCodeData || '',
        'Event Day': dayName
      }));

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Auto-size columns
      const columnWidths = [
        { wch: 25 }, // Participant Name
        { wch: 30 }, // Email Address
        { wch: 30 }, // Institution/Organization
        { wch: 20 }, // Designation
        { wch: 18 }, // Contact Number
        { wch: 15 }, // Check-in Date
        { wch: 15 }, // Check-in Time
        { wch: 20 }, // Checked in by
        { wch: 15 }, // Registration ID
        { wch: 35 }, // Event Day
      ];
      worksheet['!cols'] = columnWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const safeDayName = dayName.replace(/[^a-zA-Z0-9]/g, '-');
      const fullFilename = `attendance-${safeDayName}-${timestamp}.xlsx`;

      // Save file
      XLSX.writeFile(workbook, fullFilename);
      
      toast.success(`Excel attendance report exported for ${dayName}`);
    } catch (error) {
      toast.error('Failed to export Excel attendance report');
      console.error('Excel export error:', error);
    }
  };

  const exportDayAttendanceToCSV = async (eventDay: string, dayName: string) => {
    try {
      const attendees = await firebaseService.getDailyAttendance(eventDay);
      
      // Transform data for CSV export
      const exportData = attendees.map(attendee => ({
        'Participant Name': attendee.participantName,
        'Email Address': attendee.participantEmail,
        'Institution/Organization': attendee.institution,
        'Check-in Date': attendee.checkInTime.toLocaleDateString(),
        'Check-in Time': attendee.checkInTime.toLocaleTimeString(),
        'Checked in by': attendee.checkedInBy,
        'Registration ID': attendee.registrationId || '',
        'QR Code Data': attendee.qrCodeData || '',
        'Event Day': dayName
      }));

      // Convert to CSV
      const csvContent = XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(exportData));

      // Create and download CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().split('T')[0];
      const safeDayName = dayName.replace(/[^a-zA-Z0-9]/g, '-');
      const fullFilename = `attendance-${safeDayName}-${timestamp}.csv`;
      
      link.href = URL.createObjectURL(blob);
      link.download = fullFilename;
      link.click();
      
      toast.success(`CSV attendance report exported for ${dayName}`);
    } catch (error) {
      toast.error('Failed to export CSV attendance report');
      console.error('CSV export error:', error);
    }
  };

  const exportAllAttendanceToExcel = async () => {
    try {
      const workbook = XLSX.utils.book_new();
      
      // Export each day to a separate worksheet
      for (const day of attendanceSummary) {
        const eventDay = day.date === '2025-09-03' ? 'wedSept3' : 
                        day.date === '2025-09-04' ? 'thursSept4' :
                        day.date === '2025-09-05' ? 'friSept5' :
                        day.date === '2025-09-06' ? 'satSept6' : 'sunSept7';
        
        const attendees = await firebaseService.getDailyAttendance(eventDay);
        
        if (attendees.length > 0) {
          // Transform data for Excel export
          const exportData = attendees.map(attendee => ({
            'Participant Name': attendee.participantName,
            'Email Address': attendee.participantEmail,
            'Institution/Organization': attendee.institution,
            'Check-in Date': attendee.checkInTime.toLocaleDateString(),
            'Check-in Time': attendee.checkInTime.toLocaleTimeString(),
            'Checked in by': attendee.checkedInBy,
            'Registration ID': attendee.registrationId || '',
            'QR Code Data': attendee.qrCodeData || '',
            'Event Day': day.dayName
          }));

          const worksheet = XLSX.utils.json_to_sheet(exportData);
          
          // Auto-size columns
          const columnWidths = [
            { wch: 25 }, // Participant Name
            { wch: 30 }, // Email Address
            { wch: 30 }, // Institution/Organization
            { wch: 20 }, // Designation
            { wch: 18 }, // Contact Number
            { wch: 15 }, // Check-in Date
            { wch: 15 }, // Check-in Time
            { wch: 20 }, // Checked in by
            { wch: 15 }, // Registration ID
            { wch: 35 }, // Event Day
          ];
          worksheet['!cols'] = columnWidths;

          // Add worksheet to workbook
          const safeSheetName = day.dayName.split(',')[0].replace(/[^a-zA-Z0-9]/g, '');
          XLSX.utils.book_append_sheet(workbook, worksheet, safeSheetName);
        }
      }

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const fullFilename = `all-attendance-reports-${timestamp}.xlsx`;

      // Save file
      XLSX.writeFile(workbook, fullFilename);
      
      toast.success('All attendance reports exported to Excel');
    } catch (error) {
      toast.error('Failed to export all attendance reports');
      console.error('All attendance export error:', error);
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const getEventDayName = (dayKey: string): string => {
    const dayNames: { [key: string]: string } = {
      'wedSept3': 'Wednesday, September 3',
      'thursSept4': 'Thursday, September 4',
      'friSept5': 'Friday, September 5',
      'satSept6': 'Saturday, September 6',
      'sunSept7': 'Sunday, September 7'
    };
    return dayNames[dayKey] || dayKey;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading attendance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Calendar className="w-8 h-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Attendance Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {authUser && (
                <div className="text-sm text-gray-600">
                  <span>Logged in as: </span>
                  <span className="font-medium">{authUser.email}</span>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {attendanceSummary.map((day) => {
            const eventDay = day.date === '2025-09-03' ? 'wedSept3' : 
                           day.date === '2025-09-04' ? 'thursSept4' :
                           day.date === '2025-09-05' ? 'friSept5' :
                           day.date === '2025-09-06' ? 'satSept6' : 'sunSept7';
            
            return (
              <div
                key={day.date}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{day.dayName.split(',')[0]}</p>
                    <p className="text-2xl font-bold text-gray-900">{day.totalAttendees}</p>
                    <p className="text-sm text-gray-500">Attendees</p>
                  </div>
                  <Users className="w-8 h-8 text-primary-600" />
                </div>
                
                <div className="space-y-2">
                  <button
                    onClick={() => loadDayAttendees(eventDay)}
                    className="w-full flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                  
                  {day.totalAttendees > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          exportDayAttendanceToExcel(eventDay, day.dayName);
                        }}
                        className="flex items-center justify-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs transition-colors"
                        title="Export to Excel"
                      >
                        <FileSpreadsheet className="w-3 h-3" />
                        <span>Excel</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          exportDayAttendanceToCSV(eventDay, day.dayName);
                        }}
                        className="flex items-center justify-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs transition-colors"
                        title="Export to CSV"
                      >
                        <FileText className="w-3 h-3" />
                        <span>CSV</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Export All Button */}
        <div className="mb-6 flex justify-center">
          <button
            onClick={exportAllAttendanceToExcel}
            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>Export All Attendance Reports (Excel)</span>
          </button>
        </div>

        {/* Day Details */}
        {selectedDay && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {getEventDayName(selectedDay)} - Attendees ({dayAttendees.length})
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => exportDayAttendanceToExcel(selectedDay, getEventDayName(selectedDay))}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Export Excel</span>
                </button>
                <button
                  onClick={() => exportDayAttendanceToCSV(selectedDay, getEventDayName(selectedDay))}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={() => setSelectedDay(null)}
                  className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>Close</span>
                </button>
              </div>
            </div>

            {dayAttendees.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Institution
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Check-in Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Checked in by
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dayAttendees.map((attendee) => (
                      <tr key={attendee.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {attendee.participantName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {attendee.participantEmail}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {attendee.institution}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatTime(attendee.checkInTime)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {attendee.checkedInBy}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>No attendees recorded for this day yet</p>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 text-center space-x-4">
          <button
            onClick={() => navigate('/verify')}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Go to QR Verification
          </button>
          <button
              onClick={() => navigate('/admin/dashboard')}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Admin Dashboard
            </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceDashboard;
