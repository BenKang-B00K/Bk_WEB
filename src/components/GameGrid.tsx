import React, { useState, useMemo } from 'react';
import { games } from '../data/games';
import GameCard from './GameCard';
import { ITEMS_PER_PAGE } from '../constants/gameConstants';
import './GameGrid.css';

interface GameGridProps {
  selectedGenre?: string;
  onProductionClick?: () => void;
}

const GameGrid: React.FC<GameGridProps> = ({ selectedGenre = 'All', onProductionClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Consolidated and Optimized: Filter and Sort in one go
  const processedGames = useMemo(() => {
    const filtered = selectedGenre === 'All' 
      ? games 
      : games.filter(g => g.genres.includes(selectedGenre));
    
    // Always sort by newest (ID descending)
    return [...filtered].sort((a, b) => parseInt(b.id) - parseInt(a.id));
  }, [selectedGenre]);

  const handleNext = () => {
    if (currentIndex + ITEMS_PER_PAGE < processedGames.length) {
      setCurrentIndex(currentIndex + ITEMS_PER_PAGE);
    }
  };

  const handlePrev = () => {
    if (currentIndex - ITEMS_PER_PAGE >= 0) {
      setCurrentIndex(currentIndex - ITEMS_PER_PAGE);
    }
  };

  // If genre is selected, show a single unified grid
  if (selectedGenre !== 'All') {
    return (
      <section className="game-grid-section">
        <div className="container">
          <h2 className="section-title">
            <>{selectedGenre} <span>Games</span></>
          </h2>
          <div className="game-grid">
            {processedGames.length > 0 ? (
              processedGames.map((game) => <GameCard key={game.id} game={game} onProductionClick={onProductionClick} />)
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">🎮</div>
                <h3 className="empty-state-title">No {selectedGenre} games yet</h3>
                <p className="empty-state-desc">More games in this genre are coming soon. Check back later!</p>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // Default 'All' view with Slider/Carousel
  return (
    <div className="game-grids-container">
      <section className="game-grid-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">All <span>Games</span> <span className="game-count">({processedGames.length})</span></h2>
            <div className="grid-nav-buttons">
              <button 
                className={`nav-btn prev ${currentIndex === 0 ? 'disabled' : ''}`} 
                onClick={handlePrev}
                disabled={currentIndex === 0}
              >
                ←
              </button>
              <button 
                className={`nav-btn next ${currentIndex + ITEMS_PER_PAGE >= processedGames.length ? 'disabled' : ''}`} 
                onClick={handleNext}
                disabled={currentIndex + ITEMS_PER_PAGE >= processedGames.length}
              >
                →
              </button>
            </div>
          </div>
          <div className="game-grid all-games-grid">
            {processedGames.slice(currentIndex, currentIndex + ITEMS_PER_PAGE).map((game) => (
              <GameCard key={game.id} game={game} onProductionClick={onProductionClick} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default GameGrid;
