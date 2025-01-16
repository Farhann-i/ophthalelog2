import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { casesService } from '../../services/cases.service';
import { CaseCard } from './CaseCard';
import type { Case } from '../../types';
import { AlertCircle } from 'lucide-react';

export default function CaseList() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);
        setError('');
        const fetchedCases = await casesService.getCases();
        setCases(fetchedCases);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load cases');
        console.error('Error fetching cases:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, [retryCount]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-800 mb-2">Failed to Load Cases</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => setRetryCount(count => count + 1)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Cases</h1>
        <Link
          to="/cases/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Add New Case
        </Link>
      </div>

      {cases.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No cases found. Create your first case!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((case_) => (
            <CaseCard key={case_.id} case_={case_} />
          ))}
        </div>
      )}
    </div>
  );
}