import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  slot?: string;
  style?: React.CSSProperties;
  format?: 'auto' | 'fluid' | 'rectangle';
  placeholderText?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ slot, style, format = 'auto', placeholderText = "ADVERTISEMENT SPACE" }) => {
  const adPushed = useRef(false);

  useEffect(() => {
    // React StrictMode runs useEffect twice in dev. 
    // We only want to push once per component instance.
    if (adPushed.current) return;

    try {
      // @ts-ignore
      const adsbygoogle = window.adsbygoogle || [];
      adsbygoogle.push({});
      adPushed.current = true;
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  // Filter out margin from style for the placeholder to avoid double margin
  const { margin, marginTop, marginBottom, marginLeft, marginRight, ...otherStyles } = style || {};

  // Placeholder style before approval
  const placeholderStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px dashed rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    color: 'rgba(255, 255, 255, 0.3)',
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
      {/* Actual AdSense code */}
      <ins className="adsbygoogle"
           style={{ 
             display: 'block', 
             width: '100%',
             height: 'auto',
             minHeight: '120px',
             textDecoration: 'none'
           }}
           data-ad-client="ca-pub-6365186183616155"
           data-ad-slot={slot || "XXXXXXXXXX"}
           data-ad-format={format}
           data-full-width-responsive="true">
        {/* Placeholder text before approval */}
        <div style={placeholderStyle}>
           {placeholderText}
        </div>
      </ins>
    </div>
  );
};

export default AdBanner;
