import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../src/api/axios';
import Banner from '../../components/Banner.jsx';
import StarRating from '../../components/StarRating.jsx';

export default function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/admin/users/${id}`)
      .then(({ data }) => setUser(data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load user'));
  }, [id]);

  return (
    <div className="page-narrow">
      <Link to="/admin/users" className="back-link">← Back to users</Link>
      <h1>User details</h1>
      <Banner type="error" message={error} />

      {user && (
        <div className="card detail-card">
          <div className="detail-row"><span>Name</span><strong>{user.name}</strong></div>
          <div className="detail-row"><span>Email</span><strong>{user.email}</strong></div>
          <div className="detail-row"><span>Address</span><strong>{user.address || '—'}</strong></div>
          <div className="detail-row"><span>Role</span><strong className={`role-badge role-${user.role}`}>{user.role.replace('_', ' ')}</strong></div>
          {user.role === 'store_owner' && (
            <div className="detail-row">
              <span>Store rating</span>
              <div className="inline-rating">
                <StarRating value={user.rating || 0} size="sm" />
                <strong>{user.rating ? user.rating.toFixed(1) : 'No ratings yet'}</strong>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
