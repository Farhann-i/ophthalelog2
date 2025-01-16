import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Eye, Search, PlusCircle, LogOut, Bell, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { casesService } from '../services/cases.service';
import type { Case } from '../types';

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Case[]>([]);
  const [showSearch, setShowSearch] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = await casesService.searchCases(query);
      setSearchResults(results);
      setShowSearch(true);
    } else {
      setSearchResults([]);
      setShowSearch(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center">
                <Eye className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">OphthalmoLog</span>
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link to="/cases" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900">
                  Cases
                </Link>
                <div className="relative">
                  <div className="flex items-center">
                    <input
                      type="text"
                      placeholder="Search cases..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-8 pr-4 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <Search className="absolute left-2 h-4 w-4 text-gray-400" />
                  </div>
                  
                  {showSearch && searchResults.length > 0 && (
                    <div className="absolute mt-2 w-96 bg-white rounded-md shadow-lg z-50">
                      <div className="p-2">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-sm font-medium text-gray-900">Search Results</h3>
                          <button
                            onClick={() => setShowSearch(false)}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="space-y-2">
                          {searchResults.map((result) => (
                            <Link
                              key={result.id}
                              to={`/cases/${result.id}`}
                              className="block p-2 hover:bg-gray-50 rounded"
                              onClick={() => setShowSearch(false)}
                            >
                              <p className="text-sm font-medium text-gray-900">{result.summary}</p>
                              <p className="text-xs text-gray-500">Patient ID: {result.patientId}</p>
                              <div className="mt-1 flex flex-wrap gap-1">
                                {result.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <Link to="/cases/new" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900">
                  <PlusCircle className="h-4 w-4 mr-1" />
                  New Case
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <button className="p-2 rounded-full text-gray-500 hover:text-gray-900">
                <Bell className="h-6 w-6" />
              </button>
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700 mr-2">{user?.username}</span>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-full text-gray-500 hover:text-gray-900"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}