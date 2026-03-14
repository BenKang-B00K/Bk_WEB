import React from 'react';
import { games } from '../data/games';
import GameCard from './GameCard';
import './GameGrid.css';

interface GameGridProps {
  selectedGenre?: string;
  searchQuery?: string;
  onProductionClick?: () => void;
}

const GameGrid: React.FC<GameGridProps> = ({ selectedGenre = 'All', searchQuery = '', onProductionClick }) => {
  // Filtering logic by genre and search query
  const filteredGames = games.filter(g => {
    const matchesGenre = selectedGenre === 'All' || g.genres.includes(selectedGenre);
    const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         g.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  // Sort by popularity (example IDs: 2, 1, 3)
  const mostPlayed = [...filteredGames].sort((a, b) => {
    const order = ['2', '1', '3'];
    return (order.indexOf(a.id) === -1 ? 99 : order.indexOf(a.id)) - (order.indexOf(b.id) === -1 ? 99 : order.indexOf(b.id));
  });

  // Sort by newest (ID descending)
  const newest = [...filteredGames].sort((a, b) => parseInt(b.id) - parseInt(a.id));

  // If searching or genre is selected, show a single unified grid
  if (selectedGenre !== 'All' || searchQuery !== '') {
    return (
      <section className="game-grid-section">
        <div className="container">
          <h2 className="section-title">
            {searchQuery ? (
              <>Search Results for "<span>{searchQuery}</span>"</>
            ) : (
              <>{selectedGenre} <span>Games</span></>
            )}
          </h2>
          <div className="game-grid">
            {filteredGames.length > 0 ? (
              filteredGames.map((game) => <GameCard key={game.id} game={game} onProductionClick={onProductionClick} />)
            ) : (
              <p style={{ color: '#aaa', padding: '40px 0', textAlign: 'center', width: '100%' }}>No games found matching your criteria.</p>
            )}
          </div>
        </div>
      </section>
    );
  }

  // Default 'All' view
  return (
    <div className="game-grids-container">
      <section className="game-grid-section">
        <div className="container">
          <h2 className="section-title">Most <span>Played</span> Games</h2>
          <div className="game-grid">
            {mostPlayed.map((game) => (
              <GameCard key={game.id} game={game} onProductionClick={onProductionClick} />
            ))}
          </div>
        </div>
      </section>

      <section className="game-grid-section dark-bg">
        <div className="container">
          <h2 className="section-title">Newest <span>Games</span></h2>
          <div className="game-grid">
            {newest.map((game) => (
              <GameCard key={game.id} game={game} onProductionClick={onProductionClick} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default GameGrid;
