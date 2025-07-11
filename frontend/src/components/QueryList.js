import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function QueryList() {
  const [queries, setQueries] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          page: currentPage,
          ...(statusFilter && { status: statusFilter })
        };
        const res = await axios.get('http://localhost:8000/api/queries/', { params });
        setQueries(res.data.results);
        setTotalPages(Math.ceil(res.data.count / 5));
        setError('');
      } catch (err) {
        console.error(err);
        setError('Failed to fetch queries. Please check if the backend is running and URL is correct.');
      }
    };

    fetchData();
  }, [currentPage, statusFilter]);

  return (
    <div>
      <h2>Query List</h2>
      <Link to="/add"><button>Add Query</button></Link>

      <div style={{ marginTop: '10px' }}>
        <label>Status Filter: </label>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All</option>
          <option value="Open">Open</option>
          <option value="InProgress">InProgress</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table border="1" cellPadding="8" style={{ marginTop: '10px' }}>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Description</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {queries.map(query => (
            <tr key={query.id}>
              <td>{query.customer_name}</td>
              <td>{query.description}</td>
              <td>{query.status}</td>
              <td>{new Date(query.created_at).toLocaleString()}</td>
              <td>
                <Link to={`/edit/${query.id}`}><button>Edit</button></Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '10px' }}>
        <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>Prev</button>
        <span style={{ margin: '0 10px' }}>{currentPage} / {totalPages}</span>
        <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>Next</button>
      </div>
    </div>
  );
}

export default QueryList;
