import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { firebaseService } from '../services/firebaseService';
import { exportToExcel, exportToCSV } from '../utils/exportUtils';
import { RegistrationData } from '../types';
import { Download, FileSpreadsheet, FileText, Users, Eye, EyeOff, LogOut, RefreshCw, Mail, QrCode, Calendar, Search, Filter, ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard: React.FC = () => {
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [registrationCount, setRegistrationCount] = useState(0);
  const [selectedRegistration, setSelectedRegistration] = useState<RegistrationData | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterInstitution, setFilterInstitution] = useState('');
  const [filterEventDay, setFilterEventDay] = useState('');
  const [filterEmailStatus, setFilterEmailStatus] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Manual entry modal states
  const [showManualEntryModal, setShowManualEntryModal] = useState(false);
  const [manualEntryForm, setManualEntryForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    institution: '',
    designation: '',
    eventDays: {
      wedSept3: false,
      thursSept4: false,
      friSept5: false,
      satSept6: false,
      sunSept7: false,
      notAttending: false
    }
  });
  const [manualEntryLoading, setManualEntryLoading] = useState(false);
  
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

  // Filter and search logic
  const filteredRegistrations = useMemo(() => {
    return registrations.filter(registration => {
      // Search term filter
      const searchMatch = searchTerm === '' || 
        registration.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registration.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registration.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registration.contactNumber.includes(searchTerm) ||
        registration.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registration.designation.toLowerCase().includes(searchTerm.toLowerCase());

      // Institution filter
      const institutionMatch = filterInstitution === '' || 
        registration.institution.toLowerCase().includes(filterInstitution.toLowerCase());

      // Event day filter
      const eventDayMatch = filterEventDay === '' || 
        (filterEventDay === 'wedSept3' && registration.eventDays.wedSept3) ||
        (filterEventDay === 'thursSept4' && registration.eventDays.thursSept4) ||
        (filterEventDay === 'friSept5' && registration.eventDays.friSept5) ||
        (filterEventDay === 'satSept6' && registration.eventDays.satSept6) ||
        (filterEventDay === 'sunSept7' && registration.eventDays.sunSept7) ||
        (filterEventDay === 'notAttending' && registration.eventDays.notAttending);

      // Email status filter
      const emailStatusMatch = filterEmailStatus === '' || 
        (filterEmailStatus === 'sent' && registration.emailSent) ||
        (filterEmailStatus === 'pending' && !registration.emailSent);

      return searchMatch && institutionMatch && eventDayMatch && emailStatusMatch;
    });
  }, [registrations, searchTerm, filterInstitution, filterEventDay, filterEmailStatus]);

  // Pagination logic
  const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRegistrations = filteredRegistrations.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterInstitution, filterEventDay, filterEmailStatus]);

  // Get unique institutions for filter dropdown
  const uniqueInstitutions = useMemo(() => {
    const institutions = registrations.map(r => r.institution);
    return [...new Set(institutions)].sort();
  }, [registrations]);

  // Manual entry handlers
  const handleManualEntrySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setManualEntryLoading(true);
    
    try {
      // Validate form
      if (!manualEntryForm.firstName || !manualEntryForm.lastName || !manualEntryForm.email) {
        toast.error('Please fill in all required fields (First Name, Last Name, Email)');
        return;
      }

      // Check if at least one event day is selected
      const hasEventDay = Object.values(manualEntryForm.eventDays).some(day => day);
      if (!hasEventDay) {
        toast.error('Please select at least one event day');
        return;
      }

      // Add manual registration
      const registrationId = await firebaseService.addRegistration(manualEntryForm);
      
      toast.success('Walk-in participant registered successfully!');
      
      // Reset form and close modal
      setManualEntryForm({
        firstName: '',
        lastName: '',
        email: '',
        contactNumber: '',
        institution: '',
        designation: '',
        eventDays: {
          wedSept3: false,
          thursSept4: false,
          friSept5: false,
          satSept6: false,
          sunSept7: false,
          notAttending: false
        }
      });
      setShowManualEntryModal(false);
      
      // Refresh data
      loadData();
      
    } catch (error) {
      toast.error('Failed to register walk-in participant');
      console.error('Manual entry error:', error);
    } finally {
      setManualEntryLoading(false);
    }
  };

  const handleManualEntryInputChange = (field: string, value: string | boolean) => {
    if (field.startsWith('eventDays.')) {
      const eventDay = field.split('.')[1];
      setManualEntryForm(prev => ({
        ...prev,
        eventDays: {
          ...prev.eventDays,
          [eventDay]: value as boolean
        }
      }));
    } else {
      setManualEntryForm(prev => ({
        ...prev,
        [field]: value
      }));
    }
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
                  Admin Dashboard
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
                onClick={() => navigate('/attendance')}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span>Attendance Dashboard</span>
              </button>
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

          {/* Search and Filter Controls */}
          <div className="mb-6 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, phone, institution, or designation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                <select
                  value={filterInstitution}
                  onChange={(e) => setFilterInstitution(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">All Institutions</option>
                  {uniqueInstitutions.map(institution => (
                    <option key={institution} value={institution}>{institution}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Day</label>
                <select
                  value={filterEventDay}
                  onChange={(e) => setFilterEventDay(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">All Event Days</option>
                  <option value="wedSept3">Wednesday, Sept 3</option>
                  <option value="thursSept4">Thursday, Sept 4</option>
                  <option value="friSept5">Friday, Sept 5</option>
                  <option value="satSept6">Saturday, Sept 6</option>
                  <option value="sunSept7">Sunday, Sept 7</option>
                  <option value="notAttending">Not Attending</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Status</label>
                <select
                  value={filterEmailStatus}
                  onChange={(e) => setFilterEmailStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="sent">Email Sent</option>
                  <option value="pending">Email Pending</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Items per Page</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                </select>
              </div>
            </div>

            {/* Results Summary */}
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredRegistrations.length)} of {filteredRegistrations.length} results
                {searchTerm && ` for "${searchTerm}"`}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowManualEntryModal(true)}
                  className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Walk-in</span>
                </button>
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
                  onClick={loadData}
                  className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>

          {/* Data Table */}
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
                {currentRegistrations.map((registration) => (
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                {/* Page Numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 border rounded-md text-sm font-medium ${
                        currentPage === pageNum
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {filteredRegistrations.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>No registrations found matching your criteria</p>
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
                                        <p className="text-sm text-gray-600 mb-2">Registration ID: {selectedRegistration.shortId || selectedRegistration.qrCodeData || selectedRegistration.id}</p>
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

      {/* Manual Entry Modal */}
      {showManualEntryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Add Walk-in Participant</h3>
              <button
                onClick={() => setShowManualEntryModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleManualEntrySubmit} className="p-6 space-y-6">
              {/* Personal Information */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Personal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={manualEntryForm.firstName}
                      onChange={(e) => handleManualEntryInputChange('firstName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={manualEntryForm.lastName}
                      onChange={(e) => handleManualEntryInputChange('lastName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter last name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={manualEntryForm.email}
                      onChange={(e) => handleManualEntryInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      value={manualEntryForm.contactNumber}
                      onChange={(e) => handleManualEntryInputChange('contactNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter contact number"
                    />
                  </div>
                </div>
              </div>

              {/* Organization Information */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Organization Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Institution/Organization
                    </label>
                    <input
                      type="text"
                      value={manualEntryForm.institution}
                      onChange={(e) => handleManualEntryInputChange('institution', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter institution or organization"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Designation/Position
                    </label>
                    <input
                      type="text"
                      value={manualEntryForm.designation}
                      onChange={(e) => handleManualEntryInputChange('designation', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter designation or position"
                    />
                  </div>
                </div>
              </div>

              {/* Event Days Selection */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">
                  Event Days <span className="text-red-500">*</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={manualEntryForm.eventDays.wedSept3}
                      onChange={(e) => handleManualEntryInputChange('eventDays.wedSept3', e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Wednesday, September 3 - Creative Domain Showcase</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={manualEntryForm.eventDays.thursSept4}
                      onChange={(e) => handleManualEntryInputChange('eventDays.thursSept4', e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Thursday, September 4 - Opening Program</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={manualEntryForm.eventDays.friSept5}
                      onChange={(e) => handleManualEntryInputChange('eventDays.friSept5', e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Friday, September 5 - Creative Domain Showcase</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={manualEntryForm.eventDays.satSept6}
                      onChange={(e) => handleManualEntryInputChange('eventDays.satSept6', e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Saturday, September 6 - Creative Domain Showcase</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={manualEntryForm.eventDays.sunSept7}
                      onChange={(e) => handleManualEntryInputChange('eventDays.sunSept7', e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Sunday, September 7 - Closing Program</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={manualEntryForm.eventDays.notAttending}
                      onChange={(e) => handleManualEntryInputChange('eventDays.notAttending', e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Not Attending</span>
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowManualEntryModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={manualEntryLoading}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {manualEntryLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Registering...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Register Participant</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
