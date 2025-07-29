import React, { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [hotels, setHotels] = useState([]);
  const [form, setForm] = useState({ name: "", location: "", price: "" });

  const fetchHotels = async () => {
    const res = await axios.get("http://localhost:5000/api/hotels");
    setHotels(res.data);
  };

  const addHotel = async () => {
    if (!form.name || !form.location || !form.price) return;
    await axios.post("http://localhost:5000/api/hotels", form);
    fetchHotels();
    setForm({ name: "", location: "", price: "" });
  };

  const deleteHotel = async (id) => {
    await axios.delete(`http://localhost:5000/api/hotels/${id}`);
    fetchHotels();
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="mb-4">Hotel List</h2>

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Hotel Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
        </div>
        <div className="col-md-3">
          <input
            type="number"
            className="form-control"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
        </div>
        <div className="col-md-3">
          <button className="btn btn-primary w-100" onClick={addHotel}>
            Add Hotel
          </button>
        </div>
      </div>

      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Price (₹)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {hotels.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">
                No hotels available.
              </td>
            </tr>
          ) : (
            hotels.map((hotel) => (
              <tr key={hotel._id}>
                <td>{hotel.name}</td>
                <td>{hotel.location}</td>
                <td>{hotel.price}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteHotel(hotel._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
