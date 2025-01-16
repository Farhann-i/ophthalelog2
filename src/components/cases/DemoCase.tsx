import React from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Tag, User } from 'lucide-react';
import ImageAnnotator from '../ImageAnnotator';

const demoCase = {
  id: 'demo-1',
  patientId: 'P001',
  summary: 'Bilateral Diabetic Retinopathy',
  clinicalFindings: 'Moderate NPDR with DME',
  images: [
    {
      id: 'img1',
      url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80',
      type: 'anterior',
      annotations: []
    }
  ],
  tags: ['diabetic retinopathy', 'DME', 'bilateral'],
  createdBy: 'Dr. Smith',
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15')
};

export default function DemoCase() {
  const { id } = useParams();

  if (id !== 'demo-1') {
    return <div>Case not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{demoCase.summary}</h2>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <User className="mr-1.5 h-4 w-4" />
            <span>Patient ID: {demoCase.patientId}</span>
          </div>
        </div>

        <div className="px-6 py-4">
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Calendar className="mr-1.5 h-4 w-4" />
            <time dateTime={demoCase.createdAt.toISOString()}>
              {demoCase.createdAt.toLocaleDateString()}
            </time>
          </div>

          <div className="prose max-w-none mb-6">
            <h3 className="text-lg font-medium text-gray-900">Clinical Findings</h3>
            <p>{demoCase.clinicalFindings}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {demoCase.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  <Tag className="mr-1 h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Images</h3>
            {demoCase.images.map((image) => (
              <div key={image.id} className="mb-4">
                <ImageAnnotator
                  imageUrl={image.url}
                  annotations={image.annotations}
                  onAnnotationAdd={() => {}}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}