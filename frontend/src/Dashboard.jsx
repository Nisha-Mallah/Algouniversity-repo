import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [problems, setProblems] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    problemStatement: '',
    exampleInput: '',
    exampleOutput: '',
    constraints: '',
  });
  const [error, setError] = useState('');
  const API_BASE_URL = __API_BASE_URL__;

  // Fetch Problems Function
  const fetchProblems = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/problems`);
      const data = await response.json();
      if (response.ok) {
        setProblems(data);
      } else {
        setError('Failed to fetch problems');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission (Add Problem)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/problems`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchProblems(); // Refresh Problems
        setFormData({ title: '', problemStatement: '', exampleInput: '', exampleOutput: '', constraints: '' });
      } else {
        setError('Failed to add problem');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  // Handle Delete Problem
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/problems/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchProblems(); // Refresh Problems
      } else {
        setError('Failed to delete problem');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Dashboard: Add or Delete Problems</h2>
      {error && <div className="alert alert-danger text-center">{error}</div>}

      {/* Navigation Link */}
      <div className="d-flex justify-content-center mb-4">
        <Link to="/problems" className="btn btn-secondary">
          View All Problems
        </Link>
      </div>

      {/* Add Problem Form */}
      <div className="card p-4 mb-4">
        <h4>Add a New Problem</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Problem Statement</label>
            <textarea
              name="problemStatement"
              className="form-control"
              value={formData.problemStatement}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Example Input</label>
            <textarea
              name="exampleInput"
              className="form-control"
              value={formData.exampleInput}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Example Output</label>
            <textarea
              name="exampleOutput"
              className="form-control"
              value={formData.exampleOutput}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Constraints</label>
            <textarea
              name="constraints"
              className="form-control"
              value={formData.constraints}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Add Problem</button>
        </form>
      </div>

      {/* List Problems with Details and Delete Option */}
      <div className="card">
        <div className="card-header text-center">
          <h4>Existing Problems</h4>
        </div>
        <ul className="list-group list-group-flush">
          {problems.map((problem) => (
            <li key={problem._id} className="list-group-item">
              <h5>{problem.title}</h5>
              <p><strong>Statement:</strong> {problem.problemStatement}</p>
              <p><strong>Example Input:</strong> {problem.exampleInput}</p>
              <p><strong>Example Output:</strong> {problem.exampleOutput}</p>
              <p><strong>Constraints:</strong> {problem.constraints}</p>
              <button
                className="btn btn-danger btn-sm mt-2"
                onClick={() => handleDelete(problem._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
