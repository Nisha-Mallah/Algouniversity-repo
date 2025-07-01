import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center vh-100"
      style={{
        backgroundColor: '#fffbea', // Light yellow, matches login page
      }}
    >
      {/* Back Button */}
      <div
        className="position-absolute top-0 start-0 m-3"
        style={{ fontFamily: `'Dancing Script', cursive` }} // Fancy font
      >
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
          onClick={() => handleNavigation('/login')}
        >
          <span className="me-2">&#8592;</span> Back
        </button>
      </div>

      {/* Welcome Header */}
      <h1
        className="display-4 text-center mb-5"
        style={{
          fontFamily: `'Dancing Script', cursive`, // Fancy font
          color: '#8b0000', // Dark red text
          backgroundColor: '#ffebcd', // Blanched almond
          padding: '10px 20px',
          borderRadius: '10px',
          boxShadow: '0 4px 15px rgba(139, 0, 0, 0.5)', // Dark red shadow
        }}
      >
        Welcome to the Home Page
      </h1>

      {/* Action Cards */}
      <div className="container">
        <div className="row g-4">
          {/* Add Problems Card */}
          <div className="col-md-4">
            <div
              className="card shadow"
              style={{
                backgroundColor: '#ffa500', // Orange
                color: '#fff', // White text
                borderRadius: '10px',
                boxShadow: '0 4px 10px rgba(255, 165, 0, 0.6)', // Orange shadow
              }}
            >
              <div className="card-body text-center">
                <h5 className="card-title">Add Problems</h5>
                <p className="card-text">Create and manage problems for the platform.</p>
                <button
                  className="btn"
                  style={{
                    backgroundColor: '#fffbea', // Light yellow
                    color: '#8b0000', // Dark red text
                    fontWeight: 'bold',
                    border: '2px solid #8b0000',
                    borderRadius: '8px',
                  }}
                  onClick={() => handleNavigation('/dashboard')}
                >
                  Go to Problem Adding Section
                </button>
              </div>
            </div>
          </div>

          {/* Solve Problems Card */}
          <div className="col-md-4">
            <div
              className="card shadow"
              style={{
                backgroundColor: '#ff6347', // Tomato red
                color: '#fff', // White text
                borderRadius: '10px',
                boxShadow: '0 4px 10px rgba(255, 99, 71, 0.6)', // Red shadow
              }}
            >
              <div className="card-body text-center">
                <h5 className="card-title">Solve Problems</h5>
                <p className="card-text">Browse and solve available problems.</p>
                <button
                  className="btn"
                  style={{
                    backgroundColor: '#fffbea', // Light yellow
                    color: '#8b0000', // Dark red text
                    fontWeight: 'bold',
                    border: '2px solid #8b0000',
                    borderRadius: '8px',
                  }}
                  onClick={() => handleNavigation('/problems')}
                >
                  Problem List
                </button>
              </div>
            </div>
          </div>

          {/* View Profile Card */}
          <div className="col-md-4">
            <div
              className="card shadow"
              style={{
                backgroundColor: '#32cd32', // Lime green
                color: '#fff', // White text
                borderRadius: '10px',
                boxShadow: '0 4px 10px rgba(50, 205, 50, 0.6)', // Green shadow
              }}
            >
              <div className="card-body text-center">
                <h5 className="card-title">View Profile</h5>
                <p className="card-text">View your profile information.</p>
                <button
                  className="btn"
                  style={{
                    backgroundColor: '#fffbea', // Light yellow
                    color: '#8b0000', // Dark red text
                    fontWeight: 'bold',
                    border: '2px solid #8b0000',
                    borderRadius: '8px',
                  }}
                  onClick={() => handleNavigation('/profile')}
                >
                  View Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
