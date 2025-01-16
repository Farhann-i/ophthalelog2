import React from 'react';
import QRCode from 'react-qr-code';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  caseId: string;
}

export function QRCodeModal({ isOpen, onClose, caseId }: Props) {
  if (!isOpen) return null;

  const qrValue = `${window.location.origin}/cases/${caseId}`;

  const downloadQRCode = () => {
    const svg = document.getElementById('qr-code');
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
        downloadLink.download = `case-${caseId}-qr.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-4">Case QR Code</h3>
          <div className="flex justify-center mb-4">
            <QRCode
              id="qr-code"
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
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}