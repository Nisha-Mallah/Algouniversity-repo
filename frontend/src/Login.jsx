import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Logged in successfully!');
        localStorage.setItem('authToken', data.token);
        setTimeout(() => {
          navigate('/home');
        }, 2000);
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Network error, please try again later');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex vh-100"
      style={{
        backgroundColor: '#f4f9fc', // Soft light blue
        overflow: 'hidden',
      }}
    >
      {/* Left half */}
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{
          flex: 1,
          backgroundColor: '#ffebcd', // Light beige
          color: '#8b0000', // Dark red
          fontFamily: `'Dancing Script', cursive`, // Fancy font
          fontSize: '2.5rem',
          padding: '20px',
          boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h1 style={{ fontSize: '3.5rem', textShadow: '2px 2px 4px #aaa' }}>
          Welcome to Code Techie!
        </h1>
        <p style={{ fontSize: '1.5rem', textAlign: 'center' }}>
          Unlock your coding potential with us. Dive into a world of innovation and creativity.
        </p>
      </div>

      {/* Right half */}
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          flex: 1,
          backgroundColor: '#fffbea', // Light yellow
        }}
      >
        <div
          className="card shadow"
          style={{
            maxWidth: '400px',
            backgroundColor: '#fff',
            borderRadius: '10px',
            border: '2px solid #ffa500', // Orange border
            boxShadow: '0 4px 15px rgba(255, 165, 0, 0.7)', // Orange glow
          }}
        >
          <div className="card-body">
            <h2 className="card-title text-center" style={{ color: '#8b0000' }}>
              Login
            </h2>

            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn w-100"
                style={{
                  backgroundColor: '#ffa500', // Orange
                  color: '#fff', // White text
                  fontWeight: 'bold',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px',
                }}
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <p className="mt-3 text-center" style={{ fontWeight: 'bold', color: '#8b0000' }}>
              Don&apos;t have an account?{' '}
              <a
                href="/signup"
                style={{
                  color: '#ffa500', // Orange
                  fontWeight: 'bold',
                  textDecoration: 'none',
                }}
              >
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
