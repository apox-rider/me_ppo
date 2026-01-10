// src/pages/SurprisePage.jsx
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/superbaseClient';

export default function SurprisePage() {
  const { token } = useParams();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEntry() {
      try {
        const { data, error } = await supabase
          .from('people_thoughts')
          .select('name, relationship, thoughts, created_at')
          .eq('secret_token', token)
          .single();

        if (error) throw error;
        setEntry(data);
      } catch (err) {
        setError('This link is invalid or has expired.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchEntry();
  }, [token]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Opening your surprise...</h2>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: '#e63946' }}>
        <h2>Oops... 🤫</h2>
        <p>{error || 'This secret message doesn\'t exist.'}</p>
        <p>Maybe the link expired or was mistyped?</p>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: '700px',
        margin: '4rem auto',
        padding: '2.5rem',
        background: '#ded7d7ff',
        borderRadius: '12px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
        textAlign: 'center',
        color: "black",
      }}
    >
      <h1 style={{ color: '#2a9d8f' }}>Hey {entry.name}!</h1>

      {entry.relationship && (
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          From your {entry.relationship}
        </p>
      )}

      <div
        style={{
          fontSize: '1.3rem',
          lineHeight: '1.7',
          whiteSpace: 'pre-wrap',
          margin: '2rem 0',
          padding: '1.5rem',
          background: '#f1f8ff',
          borderRadius: '8px',
        }}
      >
        {entry.thoughts}
      </div>

      <small style={{ color: '#777' }}>
        Secret message created on {new Date(entry.created_at).toLocaleDateString()}
      </small>
    </div>
  );
}