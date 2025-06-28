import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
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
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', 
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || 'Signed up successfully!');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.error || 'Something went wrong');
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
        backgroundColor: '#f4f9fc', 
        overflow: 'hidden',
      }}
    >
      {/* Left half */}
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{
          flex: 1,
          backgroundColor: '#ffebcd', 
          color: '#8b0000', 
          fontFamily: `'Dancing Script', cursive`, 
          fontSize: '2.5rem',
          padding: '20px',
          boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h1 style={{ fontSize: '3.5rem', textShadow: '2px 2px 4px #aaa' }}>
          Join Code Techie!
        </h1>
        <p style={{ fontSize: '1.5rem', textAlign: 'center' }}>
          Create your account and start your coding journey with us today.
        </p>
      </div>

      {/* Right half */}
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          flex: 1,
          backgroundColor: '#fffbea'
        }}
      >
        <div
          className="card shadow"
          style={{
            maxWidth: '400px',
            backgroundColor: '#fff',
            borderRadius: '10px',
            border: '2px solid #ffa500', 
            boxShadow: '0 4px 15px rgba(255, 165, 0, 0.7)', 
          }}
        >
          <div className="card-body">
            <h2 className="card-title text-center" style={{ color: '#8b0000' }}>
              Sign Up
            </h2>

            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

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
                  backgroundColor: '#ffa500', 
                  color: '#fff', 
                  fontWeight: 'bold',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px',
                }}
                disabled={loading}
              >
                {loading ? 'Signing up...' : 'Sign Up'}
              </button>
            </form>

            <p className="mt-3 text-center" style={{ fontWeight: 'bold', color: '#8b0000' }}>
              Already have an account?{' '}
              <a
                href="/login"
                style={{
                  color: '#ffa500', 
                  fontWeight: 'bold',
                  textDecoration: 'none',
                }}
              >
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
