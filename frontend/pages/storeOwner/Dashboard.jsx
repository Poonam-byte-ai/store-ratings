import React, { useEffect, useState } from 'react';
import api from '../../src/api/axios';
import Banner from '../../components/Banner.jsx';

export default function StoreOwnerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/store-owner/dashboard');

      const dashboardData = response.data;

      // Backend returns averageRating as a string
      // because it uses .toFixed(2).
      const averageRating =
        dashboardData.averageRating !== null &&
        dashboardData.averageRating !== undefined
          ? Number(dashboardData.averageRating)
          : 0;

      setData({
        ...dashboardData,
        averageRating,
        ratingCount: Number(dashboardData.ratingCount || 0),
        raters: Array.isArray(dashboardData.raters)
          ? dashboardData.raters
          : [],
      });

    } catch (err) {
      console.error(
        'Error loading store owner dashboard:',
        err
      );

      setError(
        err.response?.data?.message ||
        'Could not load store owner dashboard'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="page">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="page">

      <h1>My store</h1>

      <Banner
        type="error"
        message={error}
      />

      {!error && !data?.store && (
        <div className="card">
          <p>
            No store is registered to this account yet.
          </p>
        </div>
      )}

      {data?.store && (
        <>
          {/* Store Information */}
          <div className="card">

            <h2>{data.store.name}</h2>

            <p className="muted">
              {data.store.address || 'No address provided'}
            </p>

            {data.store.email && (
              <p className="muted">
                {data.store.email}
              </p>
            )}

            <div className="store-rating-row">

              <strong>
                Average Rating:
              </strong>

              <span>
                ⭐ {data.averageRating.toFixed(1)}
              </span>

            </div>

            <div className="store-rating-row">

              <strong>
                Total Ratings:
              </strong>

              <span>
                {data.ratingCount}
              </span>

            </div>

          </div>

          {/* Users who rated the store */}
          <div className="card">

            <h2>
              Users Who Rated This Store
            </h2>

            {data.raters.length === 0 ? (

              <p className="muted">
                No users have rated this store yet.
              </p>

            ) : (

              <div className="table-container">

                <table>

                  <thead className="data-table owner-ratings-table">
                    <tr>
                      <th>User Name</th>
                      <th>Email</th>
                      <th>Rating</th>
                      <th>Date</th>
                    </tr>
                  </thead>

                  <tbody>

                    {data.raters.map((rating) => (

                      <tr key={rating.id}>

                        <td>
                          {rating.user?.name ||
                            'Unknown User'}
                        </td>

                        <td>
                          {rating.user?.email ||
                            '-'}
                        </td>

                        <td>
                          ⭐ {Number(rating.rating)}
                        </td>

                        <td>
                          {rating.created_at
                            ? new Date(
                                rating.created_at
                              ).toLocaleDateString()
                            : '-'}
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </div>
        </>
      )}

    </div>
  );
}