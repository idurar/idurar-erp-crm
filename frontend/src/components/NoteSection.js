import React, { useEffect, useState } from 'react';
import axios from 'axios';

function NoteSection({ queryId }) {
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:8000/api/queries/${queryId}/`)
      .then(res => setNotes(res.data.notes))
      .catch(() => setError('Unable to load notes.'));
  }, [queryId]);

  const addNote = () => {
    if (!noteText.trim()) return;

    axios.post(`http://localhost:8000/api/queries/${queryId}/add_note/`, { note_text: noteText })
      .then(res => {
        setNotes(prev => [...prev, res.data]);
        setNoteText('');
        setError('');
      })
      .catch(() => setError('Failed to add note.'));
  };

  const deleteNote = (noteId) => {
    axios.delete(`http://localhost:8000/api/queries/${queryId}/notes/${noteId}/`)
      .then(() => {
        setNotes(prev => prev.filter(n => n.id !== noteId));
        setError('');
      })
      .catch(() => setError('Failed to delete note.'));
  };

  const containerStyle = {
    marginTop: '30px',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  };

  const headingStyle = {
    marginBottom: '10px',
    fontSize: '20px',
    fontWeight: 'bold',
    textAlign: 'center'
  };

  const listStyle = {
    listStyleType: 'none',
    padding: 0,
    marginBottom: '10px'
  };

  const noteItemStyle = {
    backgroundColor: '#fff',
    padding: '10px',
    borderRadius: '6px',
    marginBottom: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  };

  const textAreaStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    resize: 'vertical',
    fontSize: '14px',
    marginBottom: '10px'
  };

  const buttonStyle = {
    padding: '8px 14px',
    fontSize: '14px',
    borderRadius: '5px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    marginLeft: '10px'
  };

  const errorStyle = {
    color: 'red',
    marginBottom: '10px',
    fontSize: '14px'
  };

  return (
    <div style={containerStyle}>
      <h3 style={headingStyle}>Notes</h3>

      {error && <div style={errorStyle}>{error}</div>}

      <ul style={listStyle}>
        {notes.map(n => (
          <li key={n.id} style={noteItemStyle}>
            <span>{n.note_text}</span>
            <button style={{ ...buttonStyle, backgroundColor: '#dc3545' }} onClick={() => deleteNote(n.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <textarea
        style={textAreaStyle}
        placeholder="Write a note..."
        value={noteText}
        onChange={e => setNoteText(e.target.value)}
      />

      <div style={{ textAlign: 'right' }}>
        <button style={buttonStyle} onClick={addNote}>Add Note</button>
      </div>
    </div>
  );
}

export default NoteSection;
