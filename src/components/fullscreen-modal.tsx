"use client";

import { useEffect } from 'react';
import { X, Download, Heart, RotateCcw, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { GeneratedImage } from './ai-image-generator';

interface FullscreenModalProps {
  image: GeneratedImage | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (imageId: string) => void;
  onToggleFavorite: (imageId: string) => void;
  onRemix: (imageId: string) => void;
  onDelete: (imageId: string) => void;
  isFavorite: boolean;
}

export function FullscreenModal({
  image,
  isOpen,
  onClose,
  onDownload,
  onToggleFavorite,
  onRemix,
  onDelete,
  isFavorite
}: FullscreenModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !image) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
      >
        <X className="h-6 w-6" />
      </Button>

      {/* Image */}
      <div className="relative max-w-[90vw] max-h-[90vh] w-full h-full">
        <Image
          src={image.url}
          alt={image.prompt}
          fill
          className="object-contain"
          unoptimized
        />
      </div>

      {/* Image info and controls */}
      <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-lg mb-1 line-clamp-2">{image.prompt}</h3>
            <p className="text-sm text-gray-300">
              Generated on {new Date(image.timestamp).toLocaleDateString()}
            </p>
          </div>
          
          <div className="flex gap-2 flex-shrink-0">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onToggleFavorite(image.id)}
              className={isFavorite ? 'bg-red-500 hover:bg-red-600' : ''}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onRemix(image.id)}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onDownload(image.id)}
            >
              <Download className="h-4 w-4" />
            </Button>
            
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                onDelete(image.id);
                onClose();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Background click to close */}
      <div 
        className="absolute inset-0 -z-10" 
        onClick={onClose}
      />
    </div>
  );
}