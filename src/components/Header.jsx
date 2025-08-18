import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const syncAuth = useCallback(() => {
    setIsLoggedIn(!!Cookies.get('token'));
  }, []);

  useEffect(() => {
    syncAuth();
    window.addEventListener('auth-changed', syncAuth);
    return () => window.removeEventListener('auth-changed', syncAuth);
  }, [syncAuth]);

  useEffect(() => {
    syncAuth();
  }, [location, syncAuth]);

  const handleLogout = () => {
    Cookies.remove('token');
    window.dispatchEvent(new Event('auth-changed'));
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">Hotel Booking</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link to="/" className="nav-link fw-bold">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/bookings" className="nav-link fw-bold">Pending</Link>
            </li>
            {isLoggedIn ? (
              <li className="nav-item">
                <button onClick={handleLogout} className="btn btn-light fw-bold text-primary ms-lg-3 mt-2 mt-lg-0">
                  Logout
                </button>
              </li>
            ) : (
              <li className="nav-item">
                <Link to="/login" className="nav-link fw-bold">Login</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;