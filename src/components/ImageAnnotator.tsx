import React, { useState, useRef } from 'react';
import type { Annotation } from '../types';

interface Props {
  imageUrl: string;
  annotations: Annotation[];
  onAnnotationAdd: (annotation: Omit<Annotation, 'id' | 'createdAt'>) => void;
}

export default function ImageAnnotator({ imageUrl, annotations, onAnnotationAdd }: Props) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<'draw' | 'text'>('draw');
  const [color, setColor] = useState('#FF0000');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [paths, setPaths] = useState<{ x: number; y: number }[][]>([]);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentTool === 'draw') {
      setIsDrawing(true);
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setCurrentPath([{ x, y }]);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || currentTool !== 'draw') return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setCurrentPath((prev) => [...prev, { x, y }]);
    }
  };

  const handleMouseUp = () => {
    if (currentTool === 'draw' && currentPath.length > 0) {
      setPaths((prev) => [...prev, currentPath]);
      onAnnotationAdd({
        type: 'drawing',
        content: JSON.stringify(currentPath),
        position: currentPath[0],
        color,
        createdBy: 'demo',
      });
    }
    setIsDrawing(false);
    setCurrentPath([]);
  };

  const handleTextAdd = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentTool === 'text') {
      const text = prompt('Enter annotation text:');
      if (text) {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          onAnnotationAdd({
            type: 'text',
            content: text,
            position: { x, y },
            color,
            createdBy: 'demo',
          });
        }
      }
    }
  };

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const image = new Image();
    image.src = imageUrl;
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);

      // Draw existing annotations
      annotations.forEach((annotation) => {
        if (annotation.type === 'drawing') {
          const path = JSON.parse(annotation.content);
          ctx.beginPath();
          ctx.strokeStyle = annotation.color;
          ctx.lineWidth = 2;
          path.forEach((point: { x: number; y: number }, index: number) => {
            if (index === 0) {
              ctx.moveTo(point.x, point.y);
            } else {
              ctx.lineTo(point.x, point.y);
            }
          });
          ctx.stroke();
        } else if (annotation.type === 'text') {
          ctx.font = '16px Arial';
          ctx.fillStyle = annotation.color;
          ctx.fillText(annotation.content, annotation.position.x, annotation.position.y);
        }
      });

      // Draw current path
      if (currentPath.length > 0) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        currentPath.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
      }
    };
  }, [imageUrl, annotations, currentPath, color]);

  return (
    <div className="relative">
      <div className="absolute top-4 left-4 z-10 flex space-x-2">
        <button
          onClick={() => setCurrentTool('draw')}
          className={`px-3 py-1 rounded ${
            currentTool === 'draw'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Draw
        </button>
        <button
          onClick={() => setCurrentTool('text')}
          className={`px-3 py-1 rounded ${
            currentTool === 'text'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Text
        </button>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer"
        />
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleTextAdd}
        className="border border-gray-300 rounded-lg shadow-lg"
      />
    </div>
  );
}