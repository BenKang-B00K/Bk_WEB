import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

const AD_CLIENT_ID = "ca-pub-2461804849200179";
// Set to true once AdSense site approval moves from "Getting ready" to "Ready".
// While false, we render the placeholder only — no script load, no adsbygoogle.push,
// which avoids 400 Bad Request console noise during review.
const ADSENSE_APPROVED = false;

interface AdBannerProps {
  slot?: string;
  style?: React.CSSProperties;
  format?: 'auto' | 'fluid' | 'rectangle';
  placeholderText?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ slot, style, format = 'auto', placeholderText = "ADVERTISEMENT SPACE" }) => {
  const adPushed = useRef(false);

  useEffect(() => {
    if (!slot) return;
    if (!ADSENSE_APPROVED) return;

    if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
      const script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT_ID}`;
      script.async = true;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    }

    if (!adPushed.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        adPushed.current = true;
      } catch (e) {
        console.error("AdSense error:", e);
      }
    }
  }, [slot]);

  // Filter out margin from style for the placeholder to avoid double margin
  const { margin, marginTop, marginBottom, marginLeft, marginRight, ...otherStyles } = style || {};

  // Placeholder style
  const placeholderStyle: React.CSSProperties = {
    background: 'var(--surface-2)',
    border: '1px dashed var(--border-default)',
    borderRadius: '12px',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.85rem',
    minHeight: '120px',
    width: '100%',
    overflow: 'hidden',
    boxSizing: 'border-box',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontWeight: '700',
    ...otherStyles
  };

  return (
    <div className="ad-container" style={{ 
      width: '100%', 
      textAlign: 'center',
      margin: margin || '20px 0',
      marginTop,
      marginBottom,
      marginLeft,
      marginRight,
      minHeight: '120px'
    }}>
      {slot && ADSENSE_APPROVED ? (
        <ins className="adsbygoogle"
             style={{ 
               display: 'block', 
               width: '100%',
               height: 'auto',
               minHeight: '120px',
               textDecoration: 'none'
             }}
             data-ad-client={AD_CLIENT_ID}
             data-ad-slot={slot}
             data-ad-format={format}
             data-full-width-responsive="true">
        </ins>
      ) : (
        <div style={placeholderStyle}>
           {placeholderText}
        </div>
      )}
    </div>
  );
};

export default AdBanner;
