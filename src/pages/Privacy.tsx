import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import './Home.css';

const Privacy: React.FC = () => {
  return (
    <div className="privacy-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Helmet>
        <title>Privacy Policy | ArcadeDeck</title>
        <meta name="description" content="Read our privacy policy to understand how we protect your data and how we use cookies and Google AdSense on ArcadeDeck." />
        <meta property="og:title" content="Privacy Policy | ArcadeDeck" />
        <meta property="og:url" content="https://arcadedeck.net/privacy" />
      </Helmet>
      <Navbar />
      <div className="container" style={{ paddingTop: '120px', flex: 1, color: '#fff', paddingBottom: '60px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Privacy <span style={{ color: '#00d2ff' }}>Policy</span></h1>
        <div style={{ lineHeight: '1.8', fontSize: '1rem', maxWidth: '900px', background: 'rgba(255,255,255,0.05)', padding: '40px', borderRadius: '15px' }}>
          <h2>1. Introduction</h2>
          <p>At ArcadeDeck, we value your privacy. This policy explains how we collect and use information when you visit our website.</p>
          
          <h2 style={{ marginTop: '20px' }}>2. Google AdSense & Cookies</h2>
          <p>We use Google AdSense to serve ads. Google, as a third-party vendor, uses cookies to serve ads on our site. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our site and/or other sites on the Internet.</p>
          <p>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" style={{ color: '#00d2ff' }}>Google Ads Settings</a>.</p>

          <h2 style={{ marginTop: '20px' }}>3. Data Collection</h2>
          <p>We do not collect personally identifiable information unless voluntarily provided by the user (e.g., setting a Gamer ID). Game scores and leaderboards are stored to enhance the competitive experience.</p>

          <h2 style={{ marginTop: '20px' }}>4. Security</h2>
          <p>We implement security measures to protect your data, but please remember that no method of transmission over the internet is 100% secure.</p>

          <h2 style={{ marginTop: '20px' }}>5. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at help@arcadedeck.net.</p>

          <div style={{ marginTop: '3rem', borderTop: '1px solid rgba(255, 255, 255, 0.2)', paddingTop: '2rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#00d2ff' }}>Color Spin Rush Game Privacy Policy</h2>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '1rem' }}>
              Last Updated: March 26, 2024<br />
              Effective Date: Immediately
            </p>
            <p>Welcome to "Color Spin Rush" mobile game (the "App"). This Privacy Policy explains how your information is collected, used, and shared in connection with the App, provided by Developer_BenjaminK ("we," us, or "our"). We are committed to protecting your privacy.</p>

            <h3 style={{ marginTop: '1.5rem', color: '#00d2ff' }}>1. Information We Collect</h3>
            <p>We may collect the following types of information from and about you when you use the App:</p>
            <ul>
              <li><strong>Gameplay Data:</strong> Information related to your gameplay, such as your scores, progress, combos, lives, and achieved levels. This data is used to track your performance, update leaderboards (if applicable), and improve your gaming experience.</li>
              <li><strong>Technical Information:</strong> When you use the App, we may automatically collect certain technical information, including:
                <ul>
                  <li>Your device's Internet Protocol (IP) address.</li>
                  <li>Device type, model, operating system version.</li>
                  <li>Device identifiers (e.g., Advertising ID, if you grant permission, for ad personalization and measurement purposes).</li>
                  <li>App usage data (e.g., features used, time spent in the App).</li>
                </ul>
              </li>
              <li><strong>Information Provided by You:</strong> If you choose to interact with certain features (e.g., if future updates introduce account creation or support features), you may voluntarily provide us with information such as your email address or a display name.</li>
            </ul>

            <h3 style={{ marginTop: '1.5rem', color: '#00d2ff' }}>2. How We Use Your Information</h3>
            <p>We use the information we collect for the following purposes:</p>
            <ul>
              <li><strong>To Provide and Maintain the App:</strong> To operate the game, track scores, manage progression, and ensure its functionality.</li>
              <li><strong>To Improve the App:</strong> To analyze how users interact with the App, identify bugs, and enhance features and gameplay based on usage patterns.</li>
              <li><strong>To Personalize Your Experience:</strong> To tailor the content and ads you see within the App.</li>
              <li><strong>For Advertising:</strong> To serve you ads. We work with advertising partners who may use your information to provide more relevant advertising.</li>
              <li><strong>To Communicate with You:</strong> If you provide contact information, we may use it to respond to your inquiries or send you updates about the App.</li>
            </ul>

            <h3 style={{ marginTop: '1.5rem', color: '#00d2ff' }}>3. Sharing Your Information with Third Parties</h3>
            <p>We may share your information in the following circumstances:</p>
            <ul>
              <li><strong>With Advertising Partners:</strong> We use Google AdMob to serve advertisements within the App. AdMob may collect and use data (including device identifiers and usage data) to provide personalized ads, measure ad performance, and for other purposes outlined in their privacy policy.
                <ul>
                  <li>Google AdMob Privacy Policy: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">https://policies.google.com/privacy</a></li>
                </ul>
              </li>
              <li><strong>With Analytics Providers:</strong> We may use third-party analytics services (e.g., Google Analytics) to help us measure traffic and usage trends for the App. These services collect and process aggregated data.</li>
              <li><strong>For Legal Reasons:</strong> We may disclose your information if required by law, to comply with a legal process, or to protect our rights, property, or safety, or that of our users.</li>
            </ul>

            <h3 style={{ marginTop: '1.5rem', color: '#00d2ff' }}>4. Children's Privacy</h3>
            <p>The App is not intended for children under the age of 13 (or the applicable age of digital consent in your region). We do not knowingly collect personal information from children under this age. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately so we can take steps to remove that information.</p>

            <h3 style={{ marginTop: '1.5rem', color: '#00d2ff' }}>5. Data Security</h3>
            <p>We take reasonable measures to protect the information we collect from unauthorized access, use, or disclosure. However, no method of transmission over the internet or electronic storage is 100% secure.</p>

            <h3 style={{ marginTop: '1.5rem', color: '#00d2ff' }}>6. Your Choices and Controls</h3>
            <ul>
              <li><strong>Local Data:</strong> Most gameplay data is stored locally on your device.</li>
              <li><strong>Advertising Preferences:</strong> You may be able to limit ad tracking or reset your device's advertising ID through your device's operating system settings. You can also review Google's Privacy Policy for more information on how they use data.</li>
              <li><strong>Opt-Out:</strong> If we implement future features requiring more extensive data collection, we will provide clear opt-out mechanisms.</li>
            </ul>

            <h3 style={{ marginTop: '1.5rem', color: '#00d2ff' }}>7. Changes to This Privacy Policy</h3>
            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy within the App or on our website. Your continued use of the App after any changes constitutes your acceptance of the new Privacy Policy.</p>

            <h3 style={{ marginTop: '1.5rem', color: '#00d2ff' }}>8. Contact Us</h3>
            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
            <p style={{ fontSize: '1.2rem', color: '#00d2ff' }}>help@arcadedeck.net</p>
          </div>
        </div>
      </div>
      <footer className="footer">
        <div className="container footer-container">
          <p>&copy; 2026 ArcadeDeck. All rights reserved.</p>
          <div className="footer-links">
            <Link to="/about" className="footer-link">About Us</Link>
            <Link to="/privacy" className="footer-link">Privacy Policy</Link>
            <Link to="/contact" className="footer-link">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Privacy;
