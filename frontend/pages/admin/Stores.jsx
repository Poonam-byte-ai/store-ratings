import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../src/api/axios';
import Banner from '../../components/Banner.jsx';
import SortableTh from '../../components/SortableTh.jsx';
import StarRating from '../../components/StarRating.jsx';

export default function Stores() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    address: '',
  });

  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError('');

    try {
      // Backend expects "order", not "sortOrder"
      const params = {
        sortBy,
        order: sortOrder,
      };

      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params[key] = value;
        }
      });

      const { data } = await api.get('/admin/stores', {
        params,
      });

      // Backend returns: { stores: [...] }
      setStores(
        Array.isArray(data.stores)
          ? data.stores
          : []
      );
    } catch (err) {
      console.error('Error loading stores:', err);

      setError(
        err.response?.data?.message ||
        'Could not load stores'
      );

      setStores([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [sortBy, sortOrder]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(
        sortOrder === 'ASC' ? 'DESC' : 'ASC'
      );
    } else {
      setSortBy(field);
      setSortOrder('ASC');
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    load();
  };

  return (
    <div className="page">

      <div className="page-header">
        <h1>Stores</h1>

        <Link
          className="btn btn-primary"
          to="/admin/stores/new"
        >
          + Add store
        </Link>
      </div>

      <form
        className="filter-bar"
        onSubmit={handleFilterSubmit}
      >
        <input
          placeholder="Name"
          value={filters.name}
          onChange={(e) =>
            setFilters({
              ...filters,
              name: e.target.value,
            })
          }
        />

        <input
          placeholder="Email"
          value={filters.email}
          onChange={(e) =>
            setFilters({
              ...filters,
              email: e.target.value,
            })
          }
        />

        <input
          placeholder="Address"
          value={filters.address}
          onChange={(e) =>
            setFilters({
              ...filters,
              address: e.target.value,
            })
          }
        />

        <button
          className="btn btn-primary"
          type="submit"
        >
          Filter
        </button>
      </form>

      <Banner
        type="error"
        message={error}
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="data-table">

          <thead>
            <tr>

              <SortableTh
                label="Name"
                field="name"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
              />

              <SortableTh
                label="Email"
                field="email"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
              />

              <SortableTh
                label="Address"
                field="address"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
              />

              <th>Rating</th>

            </tr>
          </thead>

          <tbody>

            {stores.map((store) => {
              const rating = store.averageRating
                ? Number(store.averageRating)
                : 0;

              return (
                <tr key={store.id}>

                  <td>{store.name}</td>

                  <td>{store.email}</td>

                  <td>
                    {store.address || '-'}
                  </td>

                  <td>
                    <div className="inline-rating">

                      <StarRating
                        value={rating}
                        size="sm"
                      />

                      <span className="muted">
                        {rating > 0
                          ? rating.toFixed(1)
                          : '—'}
                      </span>

                    </div>
                  </td>

                </tr>
              );
            })}

            {stores.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="empty"
                >
                  No stores found.
                </td>
              </tr>
            )}

          </tbody>

        </table>
      )}

    </div>
  );
}