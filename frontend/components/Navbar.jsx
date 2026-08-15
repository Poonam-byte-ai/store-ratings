import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const roleLinks = {
  admin: [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/stores', label: 'Stores' },
  ],
  normal: [{ to: '/stores', label: 'Stores' }],
  store_owner: [{ to: '/store-owner', label: 'My Store' }],
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          Store<span>Ratings</span>
        </Link>

        {user && (
          <nav className="nav-links">
            {(roleLinks[user.role] || []).map((link) => (
              <Link key={link.to} to={link.to}>
                {link.label}
              </Link>
            ))}
            <Link to="/change-password">Change Password</Link>
          </nav>
        )}

        <div className="navbar-right">
          {user ? (
            <>
              <span className="user-chip">{user.name} · {user.role.replace('_', ' ')}</span>
              <button className="btn btn-ghost" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <Link className="btn btn-ghost" to="/login">Log in</Link>
              <Link className="btn btn-primary" to="/signup">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
