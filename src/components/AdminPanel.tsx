import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { firebaseService } from '../services/firebaseService';
import { exportToExcel, exportToCSV } from '../utils/exportUtils';
import { RegistrationData } from '../types';
import { Download, FileSpreadsheet, FileText, Users, Eye, EyeOff } from 'lucide-react';

const AdminPanel: React.FC = () => {
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [showData, setShowData] = useState(false);
  const [registrationCount, setRegistrationCount] = useState(0);

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

  if (loading) {
    return (
      <div className="card text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading data...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Admin Panel</h2>
          <p className="text-gray-600">Manage event registrations and export data</p>
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
          <Download className="w-4 h-4" />
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
  );
};

export default AdminPanel;
