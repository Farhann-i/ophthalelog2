import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera } from 'lucide-react';

export default function QRScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

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
        
        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
            style={{ display: 'none' }}
          />
          <div className="absolute inset-0 border-2 border-blue-500 opacity-50 rounded-lg" />
        </div>

        <p className="text-sm text-gray-500 text-center mt-4">
          Make sure the QR code is well-lit and clearly visible
        </p>
      </div>
    </div>
  );
}