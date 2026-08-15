import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../src/api/axios';
import Banner from '../../components/Banner.jsx';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(({ data }) => setStats(data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load dashboard'));
  }, []);

  return (
    <div className="page">
      <h1>Admin dashboard</h1>
      <Banner type="error" message={error} />

      {stats && (
        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-number">{stats.totalUsers}</span>
            <span className="stat-label">Total users</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats.totalStores}</span>
            <span className="stat-label">Total stores</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{stats.totalRatings}</span>
            <span className="stat-label">Total ratings submitted</span>
          </div>
        </div>
      )}

      <div className="quick-actions">
        <Link className="btn btn-primary" to="/admin/users/new">+ Add user</Link>
        <Link className="btn btn-primary" to="/admin/stores/new">+ Add store</Link>
        <Link className="btn btn-ghost" to="/admin/users">View users</Link>
        <Link className="btn btn-ghost" to="/admin/stores">View stores</Link>
      </div>
    </div>
  );
}
