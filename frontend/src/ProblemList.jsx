import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProblemList() {
  const [problems, setProblems] = useState([]);
  const [error, setError] = useState('');
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/problems`);
      if (response.ok) {
        const data = await response.json();
        setProblems(data);
      } else {
        setError('Failed to fetch problems');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div
      className="container mt-5"
      style={{
        backgroundColor: '#fffbea', // Light yellow
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(139, 0, 0, 0.5)', // Dark red shadow
      }}
    >
      {/* Back Button */}
      <div className="position-absolute top-0 start-0 m-3">
        <button
          className="btn"
          style={{
            backgroundColor: '#ffebcd', // Blanched almond
            color: '#8b0000', // Dark red
            fontWeight: 'bold',
            border: '2px solid #8b0000',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(139, 0, 0, 0.5)', // Dark red shadow
          }}
          onClick={() => navigate('/home')}
        >
          <span className="me-2">&#8592;</span> Back
        </button>
      </div>

      <h2
        className="text-center mb-4"
        style={{
          color: '#8b0000', // Dark red
          fontFamily: `'Dancing Script', cursive`,
          backgroundColor: '#ffebcd', // Blanched almond
          padding: '10px',
          borderRadius: '8px',
          boxShadow: '0 4px 15px rgba(139, 0, 0, 0.5)', // Dark red shadow
        }}
      >
        Problem List
      </h2>

      {error && (
        <div
          className="alert alert-danger text-center"
          style={{
            color: '#8b0000',
            backgroundColor: '#ffebcd',
            border: '2px solid #8b0000',
            borderRadius: '8px',
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          border: '2px solid #8b0000',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 4px 10px rgba(139, 0, 0, 0.5)', // Dark red shadow
        }}
      >
        {/* Left Side: Problems */}
        <div
          style={{
            flex: 1,
            backgroundColor: '#ffa500', // Orange
            padding: '20px',
            borderRight: '2px solid #8b0000',
          }}
        >
          <h4
            style={{
              color: '#fff', // White text
              marginBottom: '15px',
              borderBottom: '2px solid #fff',
              paddingBottom: '5px',
            }}
          >
            Problems
          </h4>
          <ol style={{ paddingLeft: '20px' }}>
            {problems.map((problem) => (
              <li key={problem._id} style={{ marginBottom: '12px' }}>
                <button
                  className="btn"
                  onClick={() => navigate(`/problems/${problem._id}`)}
                  style={{
                    backgroundColor: '#fffbea',
                    color: '#8b0000',
                    fontWeight: 'bold',
                    border: '2px solid #8b0000',
                    borderRadius: '8px',
                    width: '100%',
                    textAlign: 'left',
                    padding: '5px 10px',
                  }}
                >
                  {problem.title}
                </button>
              </li>
            ))}
          </ol>
        </div>

        {/* Right Side: Difficulty */}
        <div
          style={{
            width: '200px',
            backgroundColor: '#32cd32', // Lime green
            padding: '20px',
            textAlign: 'center',
          }}
        >
          <h4
            style={{
              color: '#fff', // White text
              marginBottom: '15px',
              borderBottom: '2px solid #fff',
              paddingBottom: '5px',
            }}
          >
            Difficulty
          </h4>
          <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
            {problems.map((problem) => (
              <li key={problem._id} style={{ marginBottom: '14px' }}>
                <div
                  style={{
                    backgroundColor:
                      problem.difficulty === 'Easy'
                        ? '#28A745' // Green for Easy
                        : problem.difficulty === 'Medium'
                        ? '#FFC107' // Yellow for Medium
                        : '#DC3545', // Red for Difficult
                    color: '#fff', // White text
                    fontWeight: 'bold',
                    border: '2px solid #fff',
                    borderRadius: '8px',
                    padding: '5px 10px',
                    textAlign: 'center',
                    boxShadow: `0 2px 10px ${
                      problem.difficulty === 'Easy'
                        ? 'rgba(40, 167, 69, 0.5)' // Green shadow
                        : problem.difficulty === 'Medium'
                        ? 'rgba(255, 193, 7, 0.5)' // Yellow shadow
                        : 'rgba(220, 53, 69, 0.5)' // Red shadow
                    }`,
                  }}
                >
                  {problem.difficulty}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
