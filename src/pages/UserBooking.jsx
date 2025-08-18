import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE = 'http://localhost:5000';

export default function UserBookings() {
  const [bookings, setBookings] = useState([]);
  const prevStatusMapRef = useRef({});

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = Cookies.get('token');
        const res = await axios.get(`${API_BASE}/api/bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(res);

        // Show alert if status changed
        res.data.forEach((booking) => {
          const prevStatus = prevStatusMapRef.current[booking._id];
          if (prevStatus && prevStatus !== booking.status) {
            if (booking.status === 'approved') {
              alert(`🎉 Your booking for "${booking.hotelId?.name}" has been approved!`);
            } else if (booking.status === 'rejected') {
              alert(`❌ Your booking for "${booking.hotelId?.name}" was rejected.`);
            }
          }
        });

        // Update ref for next comparison
        const updatedMap = {};
        res.data.forEach((booking) => {
          updatedMap[booking._id] = booking.status;
        });
        prevStatusMapRef.current = updatedMap;

        setBookings(res.data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
      }
    };

    fetchBookings();
    const interval = setInterval(fetchBookings, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container py-4 mt-5 pt-5">
      <h2 className="mb-4">Your Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>Hotel</th>
              <th>Room</th>
              <th>Check-In</th>
              <th>Check-Out</th>
              <th>Guests</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td>{b.hotelId?.name || 'N/A'}</td>
                <td>{b.roomType}</td>
                <td>{new Date(b.checkIn).toLocaleDateString()}</td>
                <td>{new Date(b.checkOut).toLocaleDateString()}</td>
                <td>{b.adults + b.children}</td>
                <td>
                  {b.status === 'pending' && <span className="text-warning">Pending</span>}
                  {b.status === 'approved' && <span className="text-success">Approved</span>}
                  {b.status === 'rejected' && <span className="text-danger">Rejected</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
