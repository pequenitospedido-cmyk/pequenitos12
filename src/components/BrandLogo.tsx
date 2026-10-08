import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

interface BrandLogoProps {
  className?: string;
}

/**
 * BrandLogo priority:
 * 1. If a custom logo is configured in `site_settings` (`siteSettings.logoUrl`), use it.
 * 2. Otherwise use `/brand/logo.png` (from `/public/brand/logo.png`).
 * 3. If `/brand/logo.png` is not placed yet or fails to load, fallback to the PEQUEÑITOS wordmark.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({ className = '' }) => {
  const { siteSettings } = useStore();
  const [customLogoError, setCustomLogoError] = useState(false);
  const [defaultLogoError, setDefaultLogoError] = useState(false);

  useEffect(() => {
    setCustomLogoError(false);
  }, [siteSettings.logoUrl]);

  const activeLogoSrc =
    siteSettings.logoUrl && !customLogoError
      ? siteSettings.logoUrl
      : !defaultLogoError
      ? '/brand/logo.png'
      : null;

  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4FA6EE] rounded-lg shrink-0 ${className}`}
      aria-label={`${siteSettings.siteName || 'PEQUEÑITOS'} - Inicio`}
    >
      {activeLogoSrc ? (
        <img
          src={activeLogoSrc}
          alt={siteSettings.siteName || 'PEQUEÑITOS'}
          className="h-9 md:h-10 w-auto object-contain"
          onError={() => {
            if (siteSettings.logoUrl && !customLogoError) {
              setCustomLogoError(true);
            } else {
              setDefaultLogoError(true);
            }
          }}
          referrerPolicy="no-referrer"
        />
      ) : (
        <span className="font-display text-xl md:text-2xl font-semibold tracking-tight text-[#2D2A26] whitespace-nowrap flex items-center gap-1.5">
          <span className="inline-flex items-center tracking-tight">
            <span className="text-[#4FA6EE]">P</span>
            <span className="text-[#F48B7B]">e</span>
            <span className="text-[#53C59B]">q</span>
            <span className="text-[#EAB308]">u</span>
            <span className="text-[#4FA6EE]">e</span>
            <span className="text-[#F48B7B]">ñ</span>
            <span className="text-[#53C59B]">i</span>
            <span className="text-[#EAB308]">t</span>
            <span className="text-[#4FA6EE]">o</span>
            <span className="text-[#F48B7B]">s</span>
          </span>
        </span>
      )}
    </Link>
  );
};
