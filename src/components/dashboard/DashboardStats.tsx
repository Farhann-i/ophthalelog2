import React, { useEffect, useState } from 'react';
import { Users, FileText, Clock, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';
import { casesService } from '../../services/cases.service';
import type { Case } from '../../types';

export function DashboardStats() {
  const [stats, setStats] = useState({
    totalCases: 0,
    recentCases: [] as Case[],
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [total, recent] = await Promise.all([
          casesService.getTotalCases(),
          casesService.getRecentCases(5)
        ]);
        
        setStats({
          totalCases: total,
          recentCases: recent,
          loading: false,
          error: '',
        });
      } catch (err) {
        setStats(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load dashboard stats',
        }));
      }
    };

    fetchStats();
  }, []);

  if (stats.loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Cases</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalCases}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recent Cases</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.recentCases.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/cases/new"
            className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100"
          >
            <FileText className="h-6 w-6 text-blue-600 mr-3" />
            <span className="font-medium text-blue-900">Add New Case</span>
          </Link>
          
          <Link
            to="/scan"
            className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100"
          >
            <QrCode className="h-6 w-6 text-green-600 mr-3" />
            <span className="font-medium text-green-900">Scan QR Code</span>
          </Link>
          
          <Link
            to="/cases"
            className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100"
          >
            <Users className="h-6 w-6 text-purple-600 mr-3" />
            <span className="font-medium text-purple-900">View All Cases</span>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Cases</h2>
        <div className="space-y-4">
          {stats.recentCases.map((case_) => (
            <Link
              key={case_.id}
              to={`/cases/${case_.id}`}
              className="block p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{case_.summary}</p>
                  <p className="text-sm text-gray-500">Patient ID: {case_.patientId}</p>
                </div>
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}