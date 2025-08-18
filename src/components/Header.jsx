import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const syncAuth = () => setIsLoggedIn(!!Cookies.get('token'));

  useEffect(() => {
    syncAuth();
    window.addEventListener('auth-changed', syncAuth);
    return () => window.removeEventListener('auth-changed', syncAuth);
  }, []);

  useEffect(() => {
    syncAuth();
  }, [location]);

  const handleLogout = () => {
    Cookies.remove('token');
    window.dispatchEvent(new Event('auth-changed'));
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">
          Hotel Booking
        </Link>
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
          <ul className="navbar-nav ms-auto gap-2">
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link fw-bold" to="/admin-dashboard">
                    AdminDashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link fw-bold" to="/admin/bookings">
                    Admin Approve
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-light text-primary fw-bold ms-lg-2"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="nav-link fw-bold" to="/login">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;