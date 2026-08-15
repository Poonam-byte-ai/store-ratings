import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Banner from '../components/Banner.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'store_owner') navigate('/store-owner');
      else navigate('/stores');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Log in</h1>
        <p className="auth-sub">Welcome back — enter your details.</p>
        <Banner type="error" message={error} />

        <label>Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} required />

        <label>Password</label>
        <input type="password" name="password" value={form.password} onChange={handleChange} required />

        <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
          {loading ? 'Logging in…' : 'Log in'}
        </button>

        <p className="auth-footer">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </form>
    </div>
  );
}
