import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../src/api/axios';
import Banner from '../../components/Banner.jsx';

export default function AddUser() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '', role: 'normal' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await api.post('/admin/users', form);
      setSuccess('User created successfully');
      setTimeout(() => navigate('/admin/users'), 700);
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      setError(apiErrors ? apiErrors.map((e) => e.msg).join(', ') : err.response?.data?.message || 'Could not create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-narrow">
      <h1>Add user</h1>
      <form className="card form" onSubmit={handleSubmit}>
        <Banner type="error" message={error} />
        <Banner type="success" message={success} />

        <label>Full name</label>
        <input name="name" value={form.name} onChange={handleChange} required />
        <span className="hint">20–60 characters ({form.name.length}/60)</span>

        <label>Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} required />

        <label>Address</label>
        <textarea name="address" value={form.address} onChange={handleChange} maxLength={400} rows={3} />

        <label>Password</label>
        <input type="password" name="password" value={form.password} onChange={handleChange} required />
        <span className="hint">8–16 characters, 1 uppercase letter, 1 special character</span>

        <label>Role</label>
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="normal">Normal user</option>
          <option value="admin">Admin</option>
          <option value="store_owner">Store owner</option>
        </select>

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Creating…' : 'Create user'}
        </button>
      </form>
    </div>
  );
}
