import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import GamePlayer from './pages/GamePlayer';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Contact from './pages/Contact';
import HallOfFame from './pages/HallOfFame';
import MyGames from './pages/MyGames';
import NotFound from './pages/NotFound';
import InstallPWA from './components/InstallPWA';
import UpdateNotification from './components/UpdateNotification';

function App() {
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    document.addEventListener('contextmenu', handleContextMenu);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  return (
    <Router>
      <div className="app-main-layout">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/play/:id" element={<GamePlayer />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/hall-of-fame" element={<HallOfFame />} />
          <Route path="/my-games" element={<MyGames />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <InstallPWA />
        <UpdateNotification />
      </div>
    </Router>
  );
}

export default App;
