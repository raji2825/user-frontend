import { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE = 'http://localhost:5000';

export default function Home() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    name: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    adults: 1,
    children: 0,
    address: '',
    city: '',
    state: '',
    pincode: '',
    roomType: 'Single',
    gender: ''
  });

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/api/hotels`);
        const data = res.data;
        const list = Array.isArray(data) ? data : data?.hotels || [];
        setHotels(list);
      } catch (e) {
        console.error('Fetch hotels failed:', e.response?.status, e.response?.data || e.message);
        setError(e?.response?.data?.message || e.message || 'Failed to load hotels');
        toast.error('Failed to load hotels');
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const handleInputChange = (e) => {
    setBookingDetails({ ...bookingDetails, [e.target.name]: e.target.value });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      const bookingPayload = {
        ...bookingDetails,
        hotelId: selectedHotel._id,
      };

      await axios.post(`${API_BASE}/api/bookings`, bookingPayload);
      toast.success('Booking request sent! Awaiting admin approval.');

      setSelectedHotel(null);
      setBookingDetails({
        name: '',
        email: '',
        phone: '',
        checkIn: '',
        checkOut: '',
        guests: 1,
        adults: 1,
        children: 0,
        address: '',
        city: '',
        state: '',
        pincode: '',
        roomType: 'Single',
        gender: ''
      });
    } catch (err) {
      console.error('Booking failed:', err);
      toast.error('Failed to submit booking');
    }
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4 text-center text-primary">Available Hotels</h1>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2">Loading hotels...</p>
        </div>
      ) : error ? (
        <p className="text-danger text-center">{error}</p>
      ) : hotels.length === 0 ? (
        <p className="text-center">No hotels found.</p>
      ) : (
        <div className="row g-4">
          {hotels.map((hotel) => {
            const raw = hotel.imageUrl || hotel.image || hotel.photo || '';
            const imageUrl = raw.startsWith('http') ? raw : `${API_BASE}${raw.startsWith('/') ? '' : '/'}${raw}`;

            return (
              <div className="col-md-6 col-lg-4" key={hotel._id || hotel.id}>
                <div className="card h-100 shadow-sm border-0 rounded-4">
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={hotel.name}
                      className="card-img-top rounded-top-4"
                      style={{ height: '200px', objectFit: 'cover' }}
                      onError={(e) => (e.target.style.display = 'none')}
                    />
                  )}
                  <div className="card-body d-flex flex-column">
  <h5 className="card-title fw-semibold">{hotel.name}</h5>
  <p className="card-text text-muted mb-2">{hotel.address}</p>
  <div className="mb-3">
    <span
      className={`badge me-2 ${
        hotel.rating >= 4.5
          ? 'bg-success' // Excellent - green
          : hotel.rating >= 3
          ? 'bg-warning text-dark' // Average - yellow
          : 'bg-danger' // Poor - red
      }`}
    >
      ⭐ {hotel.rating}
    </span>
    <span className="badge bg-info">₹{hotel.rate} / night</span>
  </div>
  <button
    className="btn btn-outline-primary mt-auto w-100"
    onClick={() => setSelectedHotel(hotel)}
  >
    Book Now
  </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Booking Modal */}
      {selectedHotel && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4">
              <div className="modal-header">
                <h5 className="modal-title">Book: {selectedHotel.name}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedHotel(null)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleBookingSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Your Name</label>
                      <input type="text" className="form-control" name="name" value={bookingDetails.name} onChange={handleInputChange} required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Email</label>
                      <input type="email" className="form-control" name="email" value={bookingDetails.email} onChange={handleInputChange} required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Phone</label>
                      <input type="tel" className="form-control" name="phone" value={bookingDetails.phone} onChange={handleInputChange} required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Room Type</label>
                      <select className="form-select" name="roomType" value={bookingDetails.roomType} onChange={handleInputChange} required>
                        <option value="Single">Single</option>
                        <option value="Double">Double</option>
                        <option value="Suite">Suite</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Check-In</label>
                      <input type="date" className="form-control" name="checkIn" value={bookingDetails.checkIn} onChange={handleInputChange} required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Check-Out</label>
                      <input type="date" className="form-control" name="checkOut" value={bookingDetails.checkOut} onChange={handleInputChange} required />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Gender</label>
                      <select className="form-select" name="gender" value={bookingDetails.gender || ''} onChange={handleInputChange} required>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Adults</label>
                      <input type="number" className="form-control" name="adults" value={bookingDetails.adults} onChange={handleInputChange} min="0" required />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Children</label>
                      <input type="number" className="form-control" name="children" value={bookingDetails.children} onChange={handleInputChange} min="0" />
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label">Address</label>
                      <input type="text" className="form-control" name="address" value={bookingDetails.address} onChange={handleInputChange} required />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">City</label>
                      <input type="text" className="form-control" name="city" value={bookingDetails.city} onChange={handleInputChange} required />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">State</label>
                      <input type="text" className="form-control" name="state" value={bookingDetails.state} onChange={handleInputChange} required />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Pin Code</label>
                      <input type="text" className="form-control" name="pincode" value={bookingDetails.pincode} onChange={handleInputChange} required />
                    </div>
                  </div>
                  <div className="d-flex justify-content-center mt-3">
  <button type="submit" className="btn btn-primary px-4">Confirm Booking</button>
</div>

                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}