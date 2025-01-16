import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import { Camera } from 'lucide-react';

export default function QRScanner() {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    });

    scanner.render(onScanSuccess, onScanError);

    function onScanSuccess(decodedText: string) {
      scanner.clear();
      const caseId = decodedText.split('/').pop();
      if (caseId) {
        navigate(`/cases/${caseId}`);
      }
    }

    function onScanError(err: string) {
      setError(err);
    }

    return () => {
      scanner.clear();
    };
  }, [navigate]);

  return (
    <div className="max-w-lg mx-auto mt-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="text-center mb-6">
          <Camera className="h-12 w-12 text-blue-600 mx-auto mb-2" />
          <h2 className="text-xl font-semibold">Scan QR Code</h2>
          <p className="text-sm text-gray-500 mt-1">
            Position the QR code within the camera view
          </p>
        </div>
        
        <div id="reader" className="w-full"></div>
        
        {error && (
          <p className="text-red-500 text-sm text-center mt-4">{error}</p>
        )}
      </div>
    </div>
  );
}