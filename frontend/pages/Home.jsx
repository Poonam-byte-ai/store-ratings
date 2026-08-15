import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const HOME_BY_ROLE = {
  admin: '/admin',
  normal: '/stores',
  store_owner: '/store-owner',
};

const ROLES = [
  {
    key: 'normal',
    title: 'Shoppers',
    tag: 'Normal user',
    className: 'role-normal',
    body: 'Browse every registered store, search by name or address, and rate anything from 1 to 5 stars. Change your mind later? Update your rating any time.',
  },
  {
    key: 'store_owner',
    title: 'Store owners',
    tag: 'Store owner',
    className: 'role-store_owner',
    body: "See exactly who rated your store and when, plus a running average so you always know where you stand.",
  },
  {
    key: 'admin',
    title: 'Administrators',
    tag: 'Admin',
    className: 'role-admin',
    body: 'Add stores and users, keep an eye on platform-wide totals, and filter or sort every list by name, email, address, or role.',
  },
];

export default function Home() {
  const { user } = useAuth();
  const primaryTo = user ? HOME_BY_ROLE[user.role] || '/login' : '/login';
  const primaryLabel = user ? 'Go to my dashboard' : 'Log in';

  return (
    <div className="landing">
      {/* ===== Hero ===== */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <span className="eyebrow">Store Ratings</span>
            <h1>
              Know the store <span className="accent">before you walk in.</span>
            </h1>
            <p className="hero-sub">
              A shared, honest rating system — shoppers rate what they experience,
              store owners see exactly how they're doing, and admins keep the
              whole directory in order.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary" to={primaryTo}>
                {primaryLabel}
              </Link>
              {!user && (
                <Link className="btn btn-ghost" to="/signup">
                  Create an account
                </Link>
              )}
            </div>
          </div>

          <div className="hero-preview" aria-hidden="true">
            <div className="preview-card">
              <div className="preview-card-top">
                <div>
                  <strong>Corner Lane Grocers</strong>
                  <p className="muted">4th Block, Whitefield Main Road</p>
                </div>
                <span className="role-badge role-store_owner">4.6 ★</span>
              </div>
              <div className="preview-stars" aria-hidden="true">
                <span className="star filled">★</span>
                <span className="star filled">★</span>
                <span className="star filled">★</span>
                <span className="star filled">★</span>
                <span className="star">★</span>
              </div>
              <p className="preview-caption">Your rating — tap a star to change it</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Roles ===== */}
      <section className="roles-section">
        <h2 className="section-title">Built around three roles</h2>
        <div className="roles-grid">
          {ROLES.map((role) => (
            <div key={role.key} className="role-card">
              <span className={`role-badge ${role.className}`}>{role.tag}</span>
              <h3>{role.title}</h3>
              <p className="muted">{role.body}</p>
            </div>
          ))}
        </div>
      </section>

      {!user && (
        <section className="cta-strip">
          <p>Ready to see it for yourself?</p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/login">
              Log in
            </Link>
            <Link className="btn btn-ghost" to="/signup">
              Sign up
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
