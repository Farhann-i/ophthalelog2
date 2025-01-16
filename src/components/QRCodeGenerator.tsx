import React from 'react';
import QRCode from 'react-qr-code';

interface Props {
  caseId: string;
  size?: number;
}

export default function QRCodeGenerator({ caseId, size = 128 }: Props) {
  const qrValue = `${window.location.origin}/cases/${caseId}`;

  const downloadQRCode = () => {
    const svg = document.getElementById('qr-code');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        canvas.width = size;
        canvas.height = size;
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
    <div className="flex flex-col items-center space-y-4">
      <QRCode
        id="qr-code"
        value={qrValue}
        size={size}
        level="H"
        className="bg-white p-2 rounded"
      />
      <button
        onClick={downloadQRCode}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Download QR Code
      </button>
    </div>
  );
}