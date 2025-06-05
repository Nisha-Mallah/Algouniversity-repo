import React, { useState, useEffect } from 'react';

export default function ProblemList() {
  const [problems, setProblems] = useState([]);
  const [error, setError] = useState('');
  const API_BASE_URL = __API_BASE_URL__; // Replace with your API URL if needed

  // Fetch Problems on Component Mount
  useEffect(() => {
    fetchProblems();
  }, []);

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

  return (
    <div className="container mt-5">
      <h2>List of Problems</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <ol>
        {problems.map((problem, index) => (
          <li key={problem._id} className="mb-4">
            <h4>{problem.title}</h4>
            <p><strong>Problem Statement:</strong> {problem.problemStatement}</p>
            <p><strong>Example Input:</strong> {problem.exampleInput}</p>
            <p><strong>Example Output:</strong> {problem.exampleOutput}</p>
            <p><strong>Constraints:</strong> {problem.constraints}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
