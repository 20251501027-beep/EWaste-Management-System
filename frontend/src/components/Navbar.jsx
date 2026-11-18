import { useLocation } from 'react-router-dom';
import './Navbar.css';

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/register': 'Register E-Waste',
  '/pickups': 'Pickup Requests',
  '/rewards': 'Eco Rewards',
};

export default function Navbar({ onMenuClick }) {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] || 'EcoLoop';

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="navbar-menu-btn" onClick={onMenuClick} aria-label="Open menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div className="navbar-title-wrap">
          <h1 className="navbar-title">{title}</h1>
          <p className="navbar-date">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      <div className="navbar-right">
        {/* User Profile */}
        <div className="navbar-profile">
          <div className="navbar-avatar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className="navbar-profile-info">
            <span className="navbar-profile-name">Eco Admin</span>
            <span className="navbar-profile-role">Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
}
