import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';
import type { Case } from '../types';

const mockCases: Case[] = [
  {
    id: '1',
    patientId: 'P001',
    summary: 'Bilateral Diabetic Retinopathy',
    clinicalFindings: 'Moderate NPDR with DME',
    images: [],
    tags: ['diabetic retinopathy', 'DME'],
    externalLinks: [],
    createdBy: 'demo',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Add more mock cases here
];

export default function CaseList() {
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

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {mockCases.map((case_) => (
            <li key={case_.id}>
              <Link to={`/cases/${case_.id}`} className="block hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Eye className="h-5 w-5 text-gray-400" />
                      <p className="ml-2 text-sm font-medium text-blue-600 truncate">
                        {case_.summary}
                      </p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {case_.tags[0]}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <Tag className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        {case_.tags.join(', ')}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      <p>
                        Added on{' '}
                        <time dateTime={case_.createdAt.toISOString()}>
                          {format(case_.createdAt, 'MMM d, yyyy')}
                        </time>
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}