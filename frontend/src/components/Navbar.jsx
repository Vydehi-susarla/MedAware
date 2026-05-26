import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, LogOut, HeartHandshake, LayoutDashboard, PlusCircle, Search } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <HeartHandshake size={28} className="icon-logo" style={{ color: 'var(--accent-color)' }} />
          MedAware <span style={{ fontWeight: 400, fontSize: '1rem', color: 'var(--text-secondary)', marginLeft: '0.25rem' }}>(Waste to Worth)</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {user && (
            <ul className="navbar-links" style={{ display: 'flex', gap: '1rem' }}>
              <li>
                <Link 
                  to="/" 
                  className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Search size={18} /> Browse
                </Link>
              </li>
              <li>
                <Link 
                  to="/donate" 
                  className={`navbar-link ${location.pathname === '/donate' ? 'active' : ''}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <PlusCircle size={18} /> Donate
                </Link>
              </li>
              <li>
                <Link 
                  to="/dashboard" 
                  className={`navbar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <LayoutDashboard size={18} /> Dashboard
                </Link>
              </li>
            </ul>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={toggleTheme} 
              className="btn btn-secondary" 
              style={{ 
                minHeight: '40px', 
                width: '40px', 
                padding: 0, 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Hi, {user.name}
                </span>
                <button 
                  onClick={handleLogout} 
                  className="btn btn-secondary"
                  style={{ 
                    minHeight: '40px', 
                    padding: '0 0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.85rem'
                  }}
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
