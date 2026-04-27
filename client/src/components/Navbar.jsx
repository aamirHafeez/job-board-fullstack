import { BriefcaseBusiness, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/jobs', label: 'Browse Jobs' },
  { to: '/post-job', label: 'Post a Job' },
  { to: '/dashboard', label: 'Dashboard' }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, signout, user } = useAuth();

  async function handleSignout() {
    await signout();
    setIsOpen(false);
  }

  return (
    <header className="site-header">
      <nav className="navbar container" aria-label="Main navigation">
        <Link className="brand" to="/" onClick={() => setIsOpen(false)}>
          <span className="brand-mark" aria-hidden="true">
            <BriefcaseBusiness size={22} />
          </span>
          <span>TalentBoard</span>
        </Link>

        <button
          className="icon-button menu-button"
          type="button"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className={`nav-links ${isOpen ? 'is-open' : ''}`}>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}

          <div className="nav-auth">
            {isAuthenticated ? (
              <>
                <span className="nav-user">{user.name}</span>
                <button className="button button-secondary nav-auth-button" type="button" onClick={handleSignout}>
                  <LogOut size={17} aria-hidden="true" />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/signin"
                  className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                  onClick={() => setIsOpen(false)}
                >
                  Sign in
                </NavLink>
                <NavLink
                  to="/signup"
                  className={({ isActive }) =>
                    isActive ? 'button button-primary nav-auth-button' : 'button button-primary nav-auth-button'
                  }
                  onClick={() => setIsOpen(false)}
                >
                  Sign up
                </NavLink>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
