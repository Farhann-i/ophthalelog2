import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, Calendar, Tag, QrCode } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import QRCode from 'react-qr-code';
import type { Case } from '../../types';

interface Props {
  case_: Case;
}

export function CaseCard({ case_ }: Props) {
  const [showQR, setShowQR] = useState(false);
  const navigate = useNavigate();
  const qrValue = `${window.location.origin}/cases/${case_.id}`;

  const downloadQRCode = () => {
    const svg = document.getElementById(`qr-${case_.id}`);
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        canvas.width = 256;
        canvas.height = 256;
        ctx?.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `case-${case_.id}-qr.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  const handleViewDetails = () => {
    navigate(`/cases/${case_.id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{case_.summary}</h3>
            <p className="mt-1 text-sm text-gray-500">Patient ID: {case_.patientId}</p>
          </div>
          <button
            onClick={() => setShowQR(true)}
            className="p-2 text-gray-400 hover:text-gray-600"
            title="View QR Code"
          >
            <QrCode className="h-5 w-5" />
          </button>
        </div>
        
        {showQR && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-4">Case QR Code</h3>
                <div className="flex justify-center mb-4">
                  <QRCode
                    id={`qr-${case_.id}`}
                    value={qrValue}
                    size={256}
                    level="H"
                    className="bg-white p-2"
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={downloadQRCode}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => setShowQR(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-4 flex items-center text-sm text-gray-500">
          <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4" />
          <time dateTime={case_.createdAt}>
            {format(parseISO(case_.createdAt), 'MMM d, yyyy')}
          </time>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {case_.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              <Tag className="mr-1 h-3 w-3" />
              {tag}
            </span>
          ))}
        </div>
        
        <div className="mt-6">
          <button
            onClick={handleViewDetails}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}