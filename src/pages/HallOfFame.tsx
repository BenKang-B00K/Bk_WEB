import React from 'react';
import Navbar from '../components/Navbar';
import GlobalLeaderboard from '../components/GlobalLeaderboard';
import './HallOfFame.css';

const archiveData: any[] = [];

const HallOfFame: React.FC = () => {
  const currentMonth = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="hall-of-fame-page">
      <Navbar />
      <div className="container hof-container">
        <header className="hof-header">
          <h1>🏛️ Hall of Fame Archive</h1>
          <p>The Eternal Records of ArcadeDeck Legends</p>
        </header>

        <section className="archive-section">
          <h2 className="archive-title">✨ Current Leaders ({currentMonth})</h2>
          <GlobalLeaderboard />
        </section>

        <section className="historical-archive">
          <h2 className="archive-title">📂 Monthly Records</h2>
          {archiveData.length > 0 ? (
            <div className="archive-grid">
              {archiveData.map((data, idx) => (
                <div key={idx} className="archive-card">
                  <h3>{data.month}</h3>
                  <ul className="winner-list">
                    {data.winners.map((w: any) => (
                      <li key={w.rank} className={`winner-item rank-${w.rank}`}>
                        <span className="rank-symbol">{w.rank === 1 ? '🥇' : w.rank === 2 ? '🥈' : '🥉'}</span>
                        <span className="winner-name">{w.name}</span>
                        <span className="winner-score">{w.score}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-archive-msg">
              <p>No historical records yet. The legends of {currentMonth} will be archived soon!</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HallOfFame;
