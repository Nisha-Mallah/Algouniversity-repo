import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function ProblemDashboard() {
  const [problems, setProblems] = useState([]);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState(null);

  const navigate = useNavigate();

  // Initial form state
  const [formData, setFormData] = useState({
    title: '',
    problemStatement: '',
    examples: [{ input: '', output: '' }],
    testCases: [{ input: '', expectedOutput: '' }],
    constraints: '',
    difficulty: '',
  });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchProblems = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/problems`);
      if (!response.ok) {
        setError('Failed to fetch problems');
        return;
      }
      const data = await response.json();
      setProblems(data);
    } catch (err) {
      setError('Network error');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDynamicChange = (e, index, field, section) => {
    const updatedSection = [...formData[section]];
    updatedSection[index][field] = e.target.value;
    setFormData({ ...formData, [section]: updatedSection });
  };

  const addDynamicField = (section) => {
    setFormData({
      ...formData,
      [section]: [...formData[section], { input: '', output: '' }],
    });
  };

  const removeDynamicField = (index, section) => {
    const updatedSection = formData[section].filter((_, i) => i !== index);
    setFormData({ ...formData, [section]: updatedSection });
  };

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
        setFormData({
          title: '',
          problemStatement: '',
          examples: [{ input: '', output: '' }],
          testCases: [{ input: '', expectedOutput: '' }],
          constraints: '',
          difficulty: '',
        });
        fetchProblems(); 
      } else {
        setError('Failed to add problem');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/problems/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchProblems();
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
    <div
      className="container mt-5 pb-5"
      style={{ backgroundColor: '#fffbea', padding: '20px', borderRadius: '15px' }} // Light yellow background
    >
      {/* Back Button */}
      <div className="position-absolute top-0 start-0 m-3">
        <button
          className="btn"
          style={{
            backgroundColor: '#ffebcd', // Blanched almond
            color: '#8b0000', // Dark red text
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
          fontFamily: `'Dancing Script', cursive`, // Fancy font
          color: '#8b0000', // Dark red text
        }}
      >
        Dashboard: Add or Delete Problems
      </h2>

      {error && <div className="alert alert-danger text-center">{error}</div>}

      <div className="d-flex justify-content-center mb-4">
        <Link
          to="/problems"
          className="btn"
          style={{
            backgroundColor: '#ffebcd',
            color: '#8b0000',
            fontWeight: 'bold',
            border: '2px solid #8b0000',
          }}
        >
          View All Problems
        </Link>
      </div>

      {/* Add Problem Form */}
      <div
        className="card p-4 mb-4"
        style={{
          border: '2px solid #ffa500',
          borderRadius: '10px',
          boxShadow: '0 4px 15px rgba(255, 165, 0, 0.7)', // Orange glow
        }}
      >
        <h4
          style={{
            color: '#8b0000',
            fontFamily: `'Dancing Script', cursive`,
          }}
        >
          Add a New Problem
        </h4>
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
            <label className="form-label">Constraints</label>
            <textarea
              name="constraints"
              className="form-control"
              value={formData.constraints}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Difficulty</label>
            <select
              name="difficulty"
              className="form-select"
              value={formData.difficulty}
              onChange={handleChange}
              required
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Difficult">Difficult</option>
            </select>
          </div>

          <h5>Examples</h5>
          {formData.examples.map((example, index) => (
            <div key={index} className="mb-3">
              <label className="form-label">Example {index + 1}</label>
              <textarea
              placeholder="Input"
              className="form-control mb-2"
              rows="3"
              value={example.input}
              onChange={(e) => handleDynamicChange(e, index, 'input', 'examples')}
              required
            ></textarea>
            <textarea
              placeholder="Output"
              className="form-control"
              rows="3"
              value={example.output}
              onChange={(e) => handleDynamicChange(e, index, 'output', 'examples')}
              required
            ></textarea>
              <button
                type="button"
                className="btn btn-danger mt-2"
                onClick={() => removeDynamicField(index, 'examples')}
              >
                Remove Example
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-secondary mb-3"
            onClick={() => addDynamicField('examples')}
          >
            Add Example
          </button>

          <h5>Test Cases</h5>
          {formData.testCases.map((testCase, index) => (
            <div key={index} className="mb-3">
              <label className="form-label">Test Case {index + 1}</label>
              <textarea
              placeholder="Input"
              className="form-control mb-2"
              rows="3"
              value={testCase.input}
              onChange={(e) => handleDynamicChange(e, index, 'input', 'testCases')}
              required
            ></textarea>
            <textarea
              placeholder="Expected Output"
              className="form-control"
              rows="3"
              value={testCase.expectedOutput}
              onChange={(e) => handleDynamicChange(e, index, 'expectedOutput', 'testCases')}
              required
            ></textarea>
              <button
                type="button"
                className="btn btn-danger mt-2"
                onClick={() => removeDynamicField(index, 'testCases')}
              >
                Remove Test Case
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-secondary mb-3"
            onClick={() => addDynamicField('testCases')}
          >
            Add Test Case
          </button>

          <button type="submit" className="btn btn-primary w-100">
            Add Problem
          </button>
        </form>
      </div>

      {/* List of Problems */}
      <div
        className="card"
        style={{
          border: '2px solid #32cd32',
          boxShadow: '0 4px 15px rgba(50, 205, 50, 0.7)', // Green glow
        }}
      >
        <div className="card-header text-center">
          <h4 style={{ color: '#32cd32' }}>Existing Problems</h4>
        </div>
        <ul className="list-group list-group-flush">
          {problems.map((problem) => (
            <li
              key={problem._id}
              className="list-group-item"
              style={{
                borderBottom: '1px solid #ccc',
                padding: '15px',
              }}
            >
              {editingId === problem._id ? (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setError('');
                    try {
                      const response = await fetch(`${API_BASE_URL}/api/problems/${editingId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(editFormData),
                      });
                      if (response.ok) {
                        setEditingId(null);
                        setEditFormData(null);
                        fetchProblems();
                      } else {
                        setError('Failed to update problem');
                      }
                    } catch (err) {
                      setError('Network error');
                    }
                  }}
                  className="mb-3"
                >
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={editFormData.title}
                    onChange={e => setEditFormData({ ...editFormData, title: e.target.value })}
                    required
                  />
                  <textarea
                    className="form-control mb-2"
                    value={editFormData.problemStatement}
                    onChange={e => setEditFormData({ ...editFormData, problemStatement: e.target.value })}
                    required
                  />
                  <textarea
                    className="form-control mb-2"
                    value={editFormData.constraints}
                    onChange={e => setEditFormData({ ...editFormData, constraints: e.target.value })}
                    required
                  />
                  <select
                    className="form-select mb-2"
                    value={editFormData.difficulty}
                    onChange={e => setEditFormData({ ...editFormData, difficulty: e.target.value })}
                    required
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Difficult">Difficult</option>
                  </select>

                  <h6>Examples</h6>
                  {editFormData.examples.map((example, idx) => (
                    <div key={idx} className="mb-2">
                      <textarea
                        className="form-control mb-1"
                        value={example.input}
                        onChange={e => {
                          const updated = [...editFormData.examples];
                          updated[idx].input = e.target.value;
                          setEditFormData({ ...editFormData, examples: updated });
                        }}
                        placeholder="Example Input"
                        required
                      />
                      <textarea
                        className="form-control mb-1"
                        value={example.output}
                        onChange={e => {
                          const updated = [...editFormData.examples];
                          updated[idx].output = e.target.value;
                          setEditFormData({ ...editFormData, examples: updated });
                        }}
                        placeholder="Example Output"
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-danger btn-sm mb-1"
                        onClick={() => {
                          const updated = editFormData.examples.filter((_, i) => i !== idx);
                          setEditFormData({ ...editFormData, examples: updated });
                        }}
                      >
                        Remove Example
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm mb-2"
                    onClick={() => setEditFormData({
                      ...editFormData,
                      examples: [...editFormData.examples, { input: '', output: '' }]
                    })}
                  >
                    Add Example
                  </button>

                  <h6>Test Cases</h6>
                  {editFormData.testCases.map((testCase, idx) => (
                    <div key={idx} className="mb-2">
                      <textarea
                        className="form-control mb-1"
                        value={testCase.input}
                        onChange={e => {
                          const updated = [...editFormData.testCases];
                          updated[idx].input = e.target.value;
                          setEditFormData({ ...editFormData, testCases: updated });
                        }}
                        placeholder="Test Case Input"
                        required
                      />
                      <textarea
                        className="form-control mb-1"
                        value={testCase.expectedOutput}
                        onChange={e => {
                          const updated = [...editFormData.testCases];
                          updated[idx].expectedOutput = e.target.value;
                          setEditFormData({ ...editFormData, testCases: updated });
                        }}
                        placeholder="Expected Output"
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-danger btn-sm mb-1"
                        onClick={() => {
                          const updated = editFormData.testCases.filter((_, i) => i !== idx);
                          setEditFormData({ ...editFormData, testCases: updated });
                        }}
                      >
                        Remove Test Case
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm mb-2"
                    onClick={() => setEditFormData({
                      ...editFormData,
                      testCases: [...editFormData.testCases, { input: '', expectedOutput: '' }]
                    })}
                  >
                    Add Test Case
                  </button>

                  <div className="d-flex justify-content-end gap-2 mt-3">
                    <button type="submit" className="btn btn-success btn-sm">Save</button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => { setEditingId(null); setEditFormData(null); }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 style={{ color: '#8b0000' }}>{problem.title}</h5>
                    <span
                      className="badge"
                      style={{
                        backgroundColor: '#ffa500',
                        color: '#fff',
                      }}
                    >
                      {problem.difficulty}
                    </span>
                  </div>
                  <p>
                    <strong>Statement:</strong> {problem.problemStatement}
                  </p>
                  <button
                    className="btn btn-warning btn-sm mt-2 me-2"
                    style={{
                      color: '#fff',
                      borderRadius: '5px',
                    }}
                    onClick={() => {
                      setEditingId(problem._id);
                      setEditFormData({
                        title: problem.title,
                        problemStatement: problem.problemStatement,
                        constraints: problem.constraints,
                        difficulty: problem.difficulty,
                        examples: problem.examples || [],
                        testCases: problem.testCases || [],
                      });
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm mt-2"
                    style={{
                      backgroundColor: '#8b0000',
                      color: '#fff',
                      borderRadius: '5px',
                    }}
                    onClick={() => handleDelete(problem._id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
