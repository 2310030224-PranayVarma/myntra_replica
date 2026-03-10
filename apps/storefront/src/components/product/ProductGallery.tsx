'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { ProductImage } from '@/types';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const activeImage = images[activeIndex];

  const prev = () => setActiveIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setActiveIndex((i) => (i + 1) % images.length);

  if (!images.length) {
    return (
      <div className="aspect-[3/4] bg-gradient-to-br from-pink-100 to-rose-200 rounded-lg flex items-center justify-center">
        <span className="text-6xl">👗</span>
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      {/* Thumbnails */}
      <div className="hidden md:flex flex-col gap-2 w-20 shrink-0">
        {images.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setActiveIndex(i)}
            className={`relative aspect-[3/4] rounded overflow-hidden border-2 transition-colors ${
              i === activeIndex ? 'border-[#ff3f6c]' : 'border-transparent hover:border-gray-300'
            }`}
          >
            <Image
              src={img.url}
              alt={img.alt || `${productName} ${i + 1}`}
              fill
              className="object-cover object-top"
              sizes="80px"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="flex-1 relative">
        <div
          className="relative aspect-[3/4] bg-gray-50 rounded-lg overflow-hidden cursor-zoom-in"
          onClick={() => setIsZoomed(true)}
        >
          <Image
            src={activeImage.url}
            alt={activeImage.alt || productName}
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />

          <button
            className="absolute top-3 right-3 bg-white/80 rounded-full p-1.5 hover:bg-white transition-colors"
            onClick={(e) => { e.stopPropagation(); setIsZoomed(true); }}
          >
            <ZoomIn className="h-4 w-4 text-gray-600" />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1.5 hover:bg-white transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1.5 hover:bg-white transition-colors"
              >
                <ChevronRight className="h-5 w-5 text-gray-700" />
              </button>
            </>
          )}
        </div>

        {/* Mobile dot indicators */}
        {images.length > 1 && (
          <div className="md:hidden flex justify-center gap-1.5 mt-3">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === activeIndex ? 'bg-[#ff3f6c]' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Zoom Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative max-w-3xl max-h-full w-full aspect-[3/4]">
            <Image
              src={activeImage.url}
              alt={activeImage.alt || productName}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>
          <button
            className="absolute top-4 right-4 text-white text-4xl leading-none hover:text-gray-300"
            onClick={() => setIsZoomed(false)}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
