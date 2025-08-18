import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE = 'http://localhost:5000';

export default function AdminBookingApproval() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchPendingBookings = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/api/bookings/pending`);
        setBookings(res.data);
      } catch (err) {
        setMessage('Failed to load bookings');
        toast.error('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchPendingBookings();
  }, []);

  const approveBooking = async (id) => {
    try {
      const res = await axios.put(`${API_BASE}/api/bookings/${id}/approve`);
      toast.success(res.data.message);
      setBookings(bookings.filter((b) => b._id !== id));
    } catch (err) {
      toast.error('Failed to approve booking');
    }
  };

  const rejectBooking = async (id) => {
    try {
      const res = await axios.put(`${API_BASE}/api/bookings/${id}/reject`);
      toast.success(res.data.message);
      setBookings(bookings.filter((b) => b._id !== id));
    } catch (err) {
      toast.error('Failed to reject booking');
    }
  };

  return (
    <div className="container mt-5 pt-5 py-4">
      <ToastContainer />
      <h2 className="text-center mb-5">Pending Hotel Bookings</h2>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : bookings.length === 0 ? (
        <p className="text-center text-muted">No pending bookings found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Hotel</th>
                <th>Room Type</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Guests</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td>{b.name}</td>
                  <td>{b.email}</td>
                  <td>{b.hotelId?.name || 'N/A'}</td>
                  <td>{b.roomType}</td>
                  <td>{b.checkIn}</td>
                  <td>{b.checkOut}</td>
                  <td>{b.adults + b.children}</td>
                  <td>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => approveBooking(b._id)}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => rejectBooking(b._id)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {message && <p className="text-danger text-center">{message}</p>}
    </div>
  );
}