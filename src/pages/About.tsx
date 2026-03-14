import React from 'react';
import Navbar from '../components/Navbar';
import './Home.css'; // Reuse common styles

const About: React.FC = () => {
  return (
    <div className="about-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div className="container" style={{ paddingTop: '120px', flex: 1, color: '#fff' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>About <span style={{ color: '#00d2ff' }}>ArcadeDeck</span></h1>
        <div style={{ lineHeight: '1.8', fontSize: '1.1rem', maxWidth: '800px' }}>
          <p>Welcome to ArcadeDeck, your ultimate destination for high-quality web-based gaming experiences.</p>
          <p>Our mission is to provide a seamless, interactive, and fun environment for gamers around the world. Whether you're looking for a quick break or an immersive challenge, ArcadeDeck offers a curated selection of the best browser games.</p>
          <p>Built with modern technology and a passion for gaming, we are constantly expanding our library and improving our platform to serve you better.</p>
          <h2 style={{ marginTop: '3rem', color: '#00d2ff' }}>Our Vision</h2>
          <p>We believe that gaming should be accessible to everyone, anywhere. No downloads, no complicated setups—just pure fun directly in your browser.</p>
        </div>
      </div>
      <footer className="footer" style={{ marginTop: 'auto' }}>
        <div className="container">
          <p>&copy; 2026 ArcadeDeck. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default About;
