import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import { games } from '../data/games';
import type { Game } from '../data/games';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import './MyGames.css';

interface GameWithRank extends Game {
  rank?: number;
  score?: number;
  subScore?: number;
}

const MyGames = () => {
  const [rankedGames, setRankedGames] = useState<GameWithRank[]>([]);
  const [noRankGames, setNoRankGames] = useState<GameWithRank[]>([]);
  const [loading, setLoading] = useState(true);
  const nickname = localStorage.getItem('player_nickname') || 'Explorer';

  useEffect(() => {
    const fetchMyRanks = async () => {
      setLoading(true);
      const ranked: GameWithRank[] = [];
      const noRank: GameWithRank[] = [];

      try {
        const promises = games.map(async (game) => {
          // To find rank, we need to fetch the leaderboard and find the user's position
          // Or we can fetch the user's score first
          const userQuery = query(
            collection(db, "leaderboards"),
            where("gameId", "==", game.id),
            where("name", "==", nickname),
            limit(1)
          );
          const userSnap = await getDocs(userQuery);

          if (userSnap.empty) {
            noRank.push(game);
            return;
          }

          const userData = userSnap.docs[0].data();
          const userScore = userData.score;
          const userSubScore = userData.subScore || 0;

          // Now find how many people have a better score
          // This logic depends on the game's sorting (e.g., ID 5 is different)
          if (game.id === '5') {
            // Lower subScore is better for same score
            // Rank = count(score > userScore) + count(score == userScore && subScore < userSubScore) + 1
            // But Firestore doesn't support complex OR counts easily without multiple queries
            // For simplicity, let's fetch the top leaderboard (up to 100) and find the index
            const lbQuery = query(
              collection(db, "leaderboards"),
              where("gameId", "==", game.id),
              orderBy("score", "desc"),
              limit(100)
            );
            const lbSnap = await getDocs(lbQuery);
            const docs = lbSnap.docs.map(d => d.data());
            // Sort manually for ID 5
            docs.sort((a, b) => {
              if (b.score !== a.score) return b.score - a.score;
              return (a.subScore || 0) - (b.subScore || 0);
            });
            const index = docs.findIndex(d => d.name === nickname);
            const rank = index !== -1 ? index + 1 : 101; // > 100 if not in top 100

            if (rank >= 1 && rank <= 3) {
              ranked.push({ ...game, rank, score: userScore, subScore: userSubScore });
            } else {
              noRank.push(game);
            }
          } else {
            // Default: Higher score, then higher subScore is better
            const lbQuery = query(
              collection(db, "leaderboards"),
              where("gameId", "==", game.id),
              orderBy("score", "desc"),
              orderBy("subScore", "desc"),
              limit(100)
            );
            const lbSnap = await getDocs(lbQuery);
            const docs = lbSnap.docs.map(d => d.data());
            const index = docs.findIndex(d => d.name === nickname);
            const rank = index !== -1 ? index + 1 : 101;

            if (rank >= 1 && rank <= 3) {
              ranked.push({ ...game, rank, score: userScore, subScore: userSubScore });
            } else {
              noRank.push(game);
            }
          }
        });

        await Promise.all(promises);

        // Sort ranked games by rank (1st, then 2nd, then 3rd)
        ranked.sort((a, b) => (a.rank || 0) - (b.rank || 0));
        
        setRankedGames(ranked);
        setNoRankGames(noRank);
      } catch (error) {
        console.error("Error fetching my ranks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyRanks();
  }, [nickname]);

  return (
    <div className="my-games-page">
      <Helmet>
        <title>My Ranking - ArcadeDeck</title>
      </Helmet>
      <Navbar />
      <div className="container">
        <header className="my-games-header">
          <h1>My <span>Ranking</span></h1>
          <p className="subtitle">Track your performance across all universes</p>
          <div className="nickname-badge">Operator: {nickname}</div>
        </header>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Scanning universes for your records...</p>
          </div>
        ) : (
          <div className="my-games-content">
            <section className="ranked-section">
              <h2 className="section-title">🏆 Top 3 Achievements</h2>
              {rankedGames.length > 0 ? (
                <div className="my-games-grid">
                  {rankedGames.map(game => (
                    <div key={game.id} className={`my-game-card rank-${game.rank}`}>
                      <div className="rank-badge-large">
                        {game.rank === 1 ? '🥇' : game.rank === 2 ? '🥈' : '🥉'}
                        <span className="rank-num">{game.rank}st</span>
                      </div>
                      <img src={game.thumbnail} alt={game.title} className="card-thumb" />
                      <div className="card-info">
                        <h3>{game.title}</h3>
                        <div className="score-info">
                          <span className="score-val">{game.score?.toLocaleString()}</span>
                          <span className="score-label">Score</span>
                        </div>
                        <Link to={`/play/${game.id}`} className="play-again-btn">Play Again</Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>You haven't reached the Top 3 in any game yet. Time to level up!</p>
                </div>
              )}
            </section>

            <section className="no-rank-section">
              <h2 className="section-title">🚀 Missions for You</h2>
              <p className="section-desc">Games where you haven't secured a top rank yet.</p>
              <div className="my-games-list">
                {noRankGames.map(game => (
                  <Link key={game.id} to={`/play/${game.id}`} className="mini-game-card">
                    <img src={game.thumbnail} alt={game.title} />
                    <div className="mini-info">
                      <h4>{game.title}</h4>
                      <span className="genre-tag">{game.genres[0]}</span>
                    </div>
                    <span className="go-arrow">→</span>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyGames;
