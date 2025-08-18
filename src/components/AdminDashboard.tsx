import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { firebaseService } from '../services/firebaseService';
import { exportToExcel, exportToCSV } from '../utils/exportUtils';
import { RegistrationData } from '../types';
import { Download, FileSpreadsheet, FileText, Users, Eye, EyeOff, LogOut, RefreshCw, Mail, QrCode } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard: React.FC = () => {
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [showData, setShowData] = useState(false);
  const [registrationCount, setRegistrationCount] = useState(0);
  const [selectedRegistration, setSelectedRegistration] = useState<RegistrationData | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const navigate = useNavigate();
  const { signOut, authUser } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [regData, count] = await Promise.all([
        firebaseService.getRegistrations(),
        firebaseService.getRegistrationCount()
      ]);
      setRegistrations(regData);
      setRegistrationCount(count);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      const filename = await exportToExcel(registrations);
      toast.success(`Data exported to ${filename}`);
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  const handleExportCSV = async () => {
    try {
      const filename = await exportToCSV(registrations);
      toast.success(`Data exported to ${filename}`);
    } catch (error) {
      toast.error('Failed to export data');
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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getEventDaysSummary = (eventDays: RegistrationData['eventDays']) => {
    const selectedDays = [];
    if (eventDays.wedSept3) selectedDays.push('Wed Sept 3');
    if (eventDays.thursSept4) selectedDays.push('Thurs Sept 4');
    if (eventDays.friSept5) selectedDays.push('Fri Sept 5');
    if (eventDays.satSept6) selectedDays.push('Sat Sept 6');
    if (eventDays.sunSept7) selectedDays.push('Sun Sept 7');
    if (eventDays.notAttending) selectedDays.push('Not Attending');
    
    return selectedDays.length > 0 ? selectedDays.join(', ') : 'None selected';
  };

  const handleResendEmail = async (registrationId: string) => {
    try {
      const success = await firebaseService.resendConfirmationEmail(registrationId);
      if (success) {
        toast.success('Confirmation email resent successfully');
        loadData(); // Refresh data to update email status
      } else {
        toast.error('Failed to resend confirmation email');
      }
    } catch (error) {
      toast.error('Error resending email');
    }
  };

  const openQRModal = (registration: RegistrationData) => {
    setSelectedRegistration(registration);
    setShowQRModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading data...</p>
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
                <Users className="w-8 h-8 text-primary-600" />
                <h1 className="text-2xl font-bold text-gray-900">
                  Malikhaing Pinoy Expo 2025 - Admin Dashboard
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
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Event Management</h2>
              <p className="text-gray-600">Manage registrations and export data for the Malikhaing Pinoy Expo 2025</p>
            </div>
            <div className="flex items-center space-x-2 mt-4 sm:mt-0">
              <Users className="w-5 h-5 text-primary-600" />
              <span className="text-lg font-semibold text-primary-600">
                {registrationCount} Registrations
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={handleExportExcel}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export to Excel</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Export to CSV</span>
            </button>
            <button
              onClick={() => setShowData(!showData)}
              className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {showData ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{showData ? 'Hide Data' : 'Show Data'}</span>
            </button>
            <button
              onClick={loadData}
              className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>

          {showData && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Organization
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event Days
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      QR Code & Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registered
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {registrations.map((registration) => (
                    <tr key={registration.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {registration.firstName} {registration.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{registration.email}</div>
                          <div className="text-sm text-gray-500">{registration.contactNumber}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm text-gray-900">{registration.institution}</div>
                          <div className="text-sm text-gray-500">{registration.designation}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs">
                          {getEventDaysSummary(registration.eventDays)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openQRModal(registration)}
                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                            title="View QR Code"
                          >
                            <QrCode className="w-4 h-4" />
                            <span className="text-sm">View QR</span>
                          </button>
                          <div className="flex flex-col">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              registration.emailSent 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {registration.emailSent ? 'Email Sent' : 'Email Pending'}
                            </span>
                            {registration.emailSent && registration.emailSentDate && (
                              <span className="text-xs text-gray-500 mt-1">
                                {formatDate(registration.emailSentDate)}
                              </span>
                            )}
                          </div>
                          {!registration.emailSent && (
                            <button
                              onClick={() => handleResendEmail(registration.id!)}
                              className="flex items-center space-x-1 text-orange-600 hover:text-orange-800"
                              title="Resend Email"
                            >
                              <Mail className="w-4 h-4" />
                              <span className="text-sm">Resend</span>
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(registration.registrationDate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {registrations.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>No registrations found</p>
            </div>
          )}
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRModal && selectedRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">QR Code - {selectedRegistration.firstName} {selectedRegistration.lastName}</h3>
              <button
                onClick={() => setShowQRModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="text-center">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Registration ID: {selectedRegistration.id}</p>
                <p className="text-sm text-gray-600">Email: {selectedRegistration.email}</p>
              </div>
              
              {selectedRegistration.qrCode ? (
                <div className="mb-4">
                  <img 
                    src={selectedRegistration.qrCode} 
                    alt="QR Code" 
                    className="mx-auto border border-gray-300 rounded-lg"
                    style={{ maxWidth: '250px' }}
                  />
                </div>
              ) : (
                <div className="mb-4 p-4 bg-gray-100 rounded-lg">
                  <p className="text-gray-500">QR Code not available</p>
                </div>
              )}
              
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => setShowQRModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Close
                </button>
                {selectedRegistration.qrCode && (
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = selectedRegistration.qrCode!;
                      link.download = `qr-code-${selectedRegistration.id}.png`;
                      link.click();
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Download QR
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
