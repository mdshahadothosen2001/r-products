import React from 'react';

interface AdDisplayProps {
  imageUrl: string;
  link?: string;
  alt?: string;
  className?: string;
  imageHeight?: number | string; // pixels (number) or tailwind class (string)
  caption?: string;
  showOverlay?: boolean;
  ctaText?: string;
  overlayOpacity?: number; // 0.0 - 1.0
  showBorder?: boolean;
  borderClass?: string; // e.g. 'border border-gray-200'
}

export default function AdDisplay({
  imageUrl,
  link,
  alt = 'Advertisement',
  className = '',
  imageHeight,
  caption,
  showOverlay = true,
  ctaText,
  overlayOpacity = 0.3,
  showBorder = true,
  borderClass = 'border border-gray-200',
}: AdDisplayProps) {
  const style: React.CSSProperties = {};
  let extraClass = '';
  if (typeof imageHeight === 'number') {
    style.maxHeight = `${imageHeight}px`;
  } else if (typeof imageHeight === 'string' && imageHeight.trim()) {
    // allow passing tailwind height like 'h-24'
    extraClass = imageHeight;
  }

  const imgEl = (
    <img
      src={imageUrl}
      alt={alt}
      loading="lazy"
      style={style}
      className={`w-full object-contain rounded-lg shadow-md ${extraClass} ${className}`}
    />
  );

  const overlay = caption ? (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
      <div className="text-white px-4 py-2 rounded-md backdrop-blur-sm" style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity})` }}>
        <div className="text-sm sm:text-base font-semibold">{caption}</div>
        {ctaText && (
          <div className="mt-2">
            <span className="inline-block bg-indigo-600 text-white text-xs sm:text-sm px-3 py-1 rounded hover:bg-indigo-700 transition-colors">
              {ctaText}
            </span>
          </div>
        )}
      </div>
    </div>
  ) : null;

  const content = (
    <div className="relative w-full">
      {imgEl}
      {showOverlay && overlay}
    </div>
  );

  // wrapper applies border, rounding and overflow handling
  const wrapped = (
    <div className={`my-6 ${showBorder ? borderClass : ''} rounded-lg overflow-hidden`}>
      {content}
    </div>
  );

  if (link) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" className="block">
        {wrapped}
      </a>
    );
  }

  return wrapped;
}
