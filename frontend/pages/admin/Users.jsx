import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../src/api/axios';
import Banner from '../../components/Banner.jsx';
import SortableTh from '../../components/SortableTh.jsx';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const params = { sortBy, order: sortOrder };
      Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
      const { data } = await api.get('/admin/users', { params });
      setUsers(data.users);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [sortBy, sortOrder]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSort = (field) => {
    if (sortBy === field) setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    else { setSortBy(field); setSortOrder('ASC'); }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    load();
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Users</h1>
        <Link className="btn btn-primary" to="/admin/users/new">+ Add user</Link>
      </div>

      <form className="filter-bar" onSubmit={handleFilterSubmit}>
        <input placeholder="Name" value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
        <input placeholder="Email" value={filters.email} onChange={(e) => setFilters({ ...filters, email: e.target.value })} />
        <input placeholder="Address" value={filters.address} onChange={(e) => setFilters({ ...filters, address: e.target.value })} />
        <select value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value })}>
          <option value="">All roles</option>
          <option value="admin">Admin</option>
          <option value="normal">Normal user</option>
          <option value="store_owner">Store owner</option>
        </select>
        <button className="btn btn-primary" type="submit">Filter</button>
      </form>

      <Banner type="error" message={error} />

      {loading ? <p>Loading…</p> : (
        <table className="data-table">
          <thead>
            <tr>
              <SortableTh label="Name" field="name" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
              <SortableTh label="Email" field="email" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
              <SortableTh label="Address" field="address" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
              <SortableTh label="Role" field="role" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td><Link to={`/admin/users/${u.id}`}>{u.name}</Link></td>
                <td>{u.email}</td>
                <td>{u.address}</td>
                <td><span className={`role-badge role-${u.role}`}>{u.role.replace('_', ' ')}</span></td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={4} className="empty">No users found.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
