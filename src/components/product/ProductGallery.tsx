"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useCallback, useState } from "react";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion) return;

      const rect = event.currentTarget.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      setZoomOrigin({ x, y });
    },
    [prefersReducedMotion]
  );

  const galleryImages =
    images.length > 0
      ? images
      : ["https://images.unsplash.com/photo-1505744386214-5093af933ab0?w=1200&q=80"];

  return (
    <div className="space-y-4">
      <div
        className="relative aspect-square overflow-hidden rounded-xl border border-border bg-surface-elevated"
        onMouseEnter={() => !prefersReducedMotion && setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <motion.div
          className="relative h-full w-full"
          animate={
            prefersReducedMotion
              ? {}
              : {
                  scale: isZoomed ? 1.6 : 1,
                }
          }
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
          }}
        >
          <Image
            src={galleryImages[activeIndex]}
            alt={`${productName} — imagen ${activeIndex + 1}`}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </motion.div>

        {!prefersReducedMotion && (
          <div className="pointer-events-none absolute bottom-3 right-3 rounded-md bg-background/80 px-2.5 py-1 text-[11px] font-medium text-muted backdrop-blur-sm">
            Pase el cursor para ampliar
          </div>
        )}
      </div>

      {galleryImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {galleryImages.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200 sm:h-20 sm:w-20 ${
                activeIndex === index
                  ? "border-accent shadow-sm"
                  : "border-border opacity-70 hover:border-accent/30 hover:opacity-100"
              }`}
              aria-label={`Ver imagen ${index + 1}`}
              aria-pressed={activeIndex === index}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
