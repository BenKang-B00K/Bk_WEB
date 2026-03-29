import React, { useState, useEffect } from 'react';
import './InstallPWA.css';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const InstallPWA: React.FC = () => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(e as BeforeInstallPromptEvent);
      
      // Show with a slight delay after load
      setTimeout(() => {
        setIsVisible(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Hide if already installed
    window.addEventListener('appinstalled', () => {
      setSupportsPWA(false);
      setIsVisible(false);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!promptInstall) return;

    promptInstall.prompt();
    promptInstall.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the PWA install');
        setIsVisible(false);
      } else {
        console.log('User dismissed the PWA install');
      }
    });
  };

  const closeBanner = () => {
    setIsVisible(false);
    // Remember dismissal for this session
    sessionStorage.setItem('pwa_banner_dismissed', 'true');
  };

  if (!supportsPWA || sessionStorage.getItem('pwa_banner_dismissed')) {
    return null;
  }

  return (
    <div className={`pwa-install-banner ${isVisible ? 'show' : ''}`}>
      <div className="pwa-content">
        <div className="pwa-icon">🎮</div>
        <div className="pwa-text">
          <h3>Install ArcadeDeck</h3>
          <p>Get the best gaming experience on your home screen!</p>
        </div>
        <div className="pwa-actions">
          <button className="install-btn" onClick={onClick}>Install</button>
          <button className="close-btn" onClick={closeBanner}>✕</button>
        </div>
      </div>
    </div>
  );
};

export default InstallPWA;
