import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Banner from '../components/Banner.jsx';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.name.length < 20 || form.name.length > 60) {
      setError('Name must be between 20 and 60 characters');
      return;
    }
    if (form.address.length > 400) {
      setError('Address must be at most 400 characters');
      return;
    }
    const pwOk = form.password.length >= 8 && form.password.length <= 16
      && /[A-Z]/.test(form.password) && /[^A-Za-z0-9]/.test(form.password);
    if (!pwOk) {
      setError('Password must be 8-16 characters, with at least one uppercase letter and one special character');
      return;
    }

    setLoading(true);
    try {
      await signup(form);
      navigate('/stores'); // signup always creates a 'normal' role user
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      setError(apiErrors ? apiErrors.map((e) => e.msg).join(', ') : err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Create account</h1>
        <p className="auth-sub">Sign up to start rating stores.</p>
        <Banner type="error" message={error} />

        <label>Full name</label>
        <input name="name" value={form.name} onChange={handleChange} required />
        <span className="hint">20–60 characters ({form.name.length}/60)</span>

        <label>Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} required />

        <label>Address</label>
        <textarea name="address" value={form.address} onChange={handleChange} maxLength={400} rows={3} />
        <span className="hint">{form.address.length}/400</span>

        <label>Password</label>
        <input type="password" name="password" value={form.password} onChange={handleChange} required />
        <span className="hint">8–16 characters, 1 uppercase letter, 1 special character</span>

        <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
          {loading ? 'Creating account…' : 'Sign up'}
        </button>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}
