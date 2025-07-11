import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import NoteSection from './NoteSection';

function QueryForm() {
  const [formData, setFormData] = useState({
    customer_name: '',
    description: '',
    status: 'Open',
    resolution: ''
  });
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:8000/api/queries/${id}/`)
        .then(res => setFormData(res.data))
        .catch(err => console.error('Error fetching query:', err));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    console.log('Submitting formData:', formData);

    const request = id
      ? axios.put(`http://localhost:8000/api/queries/${id}/`, formData)
      : axios.post(`http://localhost:8000/api/queries/`, formData);

    request
      .then(() => {
        alert(id ? 'Query updated!' : 'Query created!');
        navigate('/');
      })
      .catch(err => {
        console.error('Submission error:', err.response?.data || err.message);
        setError(JSON.stringify(err.response?.data || 'Unknown error', null, 2));
      });
  };

  const formStyles = {
    maxWidth: '600px',
    margin: '20px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
  };

  const fieldStyles = {
    marginBottom: '15px'
  };

  const labelStyles = {
    display: 'block',
    fontWeight: 'bold',
    marginBottom: '5px'
  };

  const inputStyles = {
    width: '100%',
    padding: '10px',
    fontSize: '14px',
    borderRadius: '4px',
    border: '1px solid #ccc'
  };

  const buttonStyles = {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  };

  const errorStyles = {
    color: 'red',
    backgroundColor: '#ffe6e6',
    padding: '10px',
    borderRadius: '4px',
    whiteSpace: 'pre-wrap',
    marginBottom: '10px'
  };

  return (
    <div style={formStyles}>
      <h2 style={{ textAlign: 'center' }}>{id ? 'Edit Query' : 'Add New Query'}</h2>

      {error && <div style={errorStyles}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={fieldStyles}>
          <label style={labelStyles}>Customer Name:</label>
          <input
            type="text"
            name="customer_name"
            value={formData.customer_name}
            onChange={handleChange}
            style={inputStyles}
            required
          />
        </div>

        <div style={fieldStyles}>
          <label style={labelStyles}>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            style={{ ...inputStyles, height: '80px' }}
            required
          />
        </div>

        <div style={fieldStyles}>
          <label style={labelStyles}>Status:</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            style={inputStyles}
          >
            <option value="Open">Open</option>
            <option value="InProgress">InProgress</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div style={fieldStyles}>
          <label style={labelStyles}>Resolution:</label>
          <textarea
            name="resolution"
            value={formData.resolution}
            onChange={handleChange}
            style={{ ...inputStyles, height: '60px' }}
          />
        </div>

        <div style={{ textAlign: 'center' }}>
          <button type="submit" style={buttonStyles}>
            {id ? 'Update' : 'Create'}
          </button>
        </div>
      </form>

      {id && <div style={{ marginTop: '30px' }}><NoteSection queryId={id} /></div>}
    </div>
  );
}

export default QueryForm;
