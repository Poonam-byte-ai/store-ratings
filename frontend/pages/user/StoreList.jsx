import React, { useEffect, useState } from 'react';
import api from '../../src/api/axios';
import StarRating from '../../components/StarRating.jsx';
import Banner from '../../components/Banner.jsx';

export default function StoreList() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState({
    name: '',
    address: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState(null);

  const load = async () => {
    setLoading(true);
    setError('');

    try {
      const params = {};

      if (search.name.trim()) {
        params.name = search.name.trim();
      }

      if (search.address.trim()) {
        params.address = search.address.trim();
      }

      const { data } = await api.get('/stores', {
        params,
      });

      const storeList = Array.isArray(data)
        ? data
        : Array.isArray(data?.stores)
          ? data.stores
          : [];

      setStores(storeList);
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
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    load();
  };

  const rate = async (storeId, value) => {
    setSavingId(storeId);
    setError('');

    try {
      // Find the store currently being rated.
      const store = stores.find(
        (item) => item.id === storeId
      );

      // Check whether the current user already has a rating.
      const hasExistingRating =
        store?.myRating !== undefined &&
        store?.myRating !== null &&
        Number(store.myRating) > 0;

      if (hasExistingRating) {
        // Existing rating -> UPDATE using PUT
        await api.put(
          `/stores/${storeId}/rating`,
          {
            rating: value,
          }
        );
      } else {
        // No existing rating -> CREATE using POST
        await api.post(
          `/stores/${storeId}/rating`,
          {
            rating: value,
          }
        );
      }

      // Immediately update user's rating on screen.
      setStores((previousStores) =>
        previousStores.map((store) =>
          store.id === storeId
            ? {
                ...store,
                myRating: value,
              }
            : store
        )
      );

      // Reload so the overall average rating is updated.
      await load();

    } catch (err) {
      console.error('Error submitting rating:', err);

      setError(
        err.response?.data?.message ||
        'Could not submit rating'
      );
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="page">

      <h1>Stores</h1>

      <form
        className="filter-bar"
        onSubmit={handleSearch}
      >
        <input
          placeholder="Search by name"
          value={search.name}
          onChange={(e) =>
            setSearch({
              ...search,
              name: e.target.value,
            })
          }
        />

        <input
          placeholder="Search by address"
          value={search.address}
          onChange={(e) =>
            setSearch({
              ...search,
              address: e.target.value,
            })
          }
        />

        <button
          className="btn btn-primary"
          type="submit"
        >
          Search
        </button>
      </form>

      <Banner
        type="error"
        message={error}
      />

      {loading ? (
        <p>Loading stores...</p>
      ) : stores.length === 0 ? (
        <p className="empty">
          No stores found.
        </p>
      ) : (
        <div className="store-grid">

          {stores.map((store) => {

            // Support either backend field name.
            const averageRating =
              store.averageRating !== undefined &&
              store.averageRating !== null
                ? Number(store.averageRating)
                : store.avgRating !== undefined &&
                  store.avgRating !== null
                  ? Number(store.avgRating)
                  : 0;

            const myRating =
              store.myRating
                ? Number(store.myRating)
                : 0;

            return (
              <div
                className="store-card"
                key={store.id}
              >

                <h3>
                  {store.name}
                </h3>

                <p className="muted">
                  {store.address || 'No address provided'}
                </p>

                <div className="store-rating-row">

                  <span>
                    Overall:
                  </span>

                  <StarRating
                    value={averageRating}
                    size="sm"
                  />

                  <span className="muted">
                    {averageRating > 0
                      ? averageRating.toFixed(1)
                      : 'No ratings yet'}
                  </span>

                </div>

                <div className="store-rating-row">

                  <span>
                    Your rating:
                  </span>

                  <StarRating
                    value={myRating}
                    onRate={(value) =>
                      rate(store.id, value)
                    }
                    size="md"
                  />

                  {savingId === store.id && (
                    <span className="muted">
                      Saving...
                    </span>
                  )}

                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}