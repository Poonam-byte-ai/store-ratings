import React, { useState } from 'react';
import api from '../src/api/axios';
import Banner from '../components/Banner.jsx';

export default function ChangePassword() {
  const [form, setForm] = useState({ oldPassword: '', newPassword: '' });
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
      await api.put('/auth/password', form);
      setSuccess('Password updated successfully');
      setForm({ oldPassword: '', newPassword: '' });
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      setError(apiErrors ? apiErrors.map((e) => e.msg).join(', ') : err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-narrow">
      <h1>Change password</h1>
      <form className="card form" onSubmit={handleSubmit}>
        <Banner type="error" message={error} />
        <Banner type="success" message={success} />

        <label>Current password</label>
        <input type="password" name="oldPassword" value={form.oldPassword} onChange={handleChange} required />

        <label>New password</label>
        <input type="password" name="newPassword" value={form.newPassword} onChange={handleChange} required />
        <span className="hint">8–16 characters, 1 uppercase letter, 1 special character</span>

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </div>
  );
}
