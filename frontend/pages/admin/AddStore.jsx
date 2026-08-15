import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../src/api/axios';
import Banner from '../../components/Banner.jsx';

export default function AddStore() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '', owner_id: '' });
  const [owners, setOwners] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  const loadOwners = async () => {
    try {
      const { data } = await api.get('/admin/store-owners');

      console.log('Store owners response:', data);

      setOwners(
        Array.isArray(data)
          ? data
          : Array.isArray(data?.owners)
            ? data.owners
            : []
      );

    } catch (err) {
      console.error('Could not load store owners:', err);

      setError(
        err.response?.data?.message ||
        'Could not load store owners'
      );
    } finally {
      setOwnersLoading(false);
    }
  };

  loadOwners();
}, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await api.post('/admin/stores', { ...form, owner_id: form.owner_id || null });
      setSuccess('Store created successfully');
      setTimeout(() => navigate('/admin/stores'), 700);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create store');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-narrow">
      <h1>Add store</h1>
      <form className="card form" onSubmit={handleSubmit}>
        <Banner type="error" message={error} />
        <Banner type="success" message={success} />

        <label>Store name</label>
        <input name="name" value={form.name} onChange={handleChange} required />
        <span className="hint">20–60 characters ({form.name.length}/60)</span>

        <label>Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} />

        <label>Address</label>
        <textarea name="address" value={form.address} onChange={handleChange} maxLength={400} rows={3} />

        <label>Store owner (optional)</label>
        <select name="owner_id" value={form.owner_id} onChange={handleChange}>
          <option value="">— None yet —</option>
          {owners.map((o) => (
            <option key={o.id} value={o.id}>{o.name} ({o.email})</option>
          ))}
        </select>
        <span className="hint">Only users with the "store owner" role appear here.</span>

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Creating…' : 'Create store'}
        </button>
      </form>
    </div>
  );
}
