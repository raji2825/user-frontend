import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE = 'http://localhost:5000';

const AdminDashboard = () => {
  const [message, setMessage] = useState('');
  const [hotels, setHotels] = useState([]);
  const [loadingHotels, setLoadingHotels] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    address: '',
    rating: '',
    rate: '',
    imageFile: null,
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [rowBusy, setRowBusy] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    address: '',
    rating: '',
    rate: '',
    imageFile: null,
    preview: null,
  });

  const authHeaders = () => {
    const token = Cookies.get('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };
  const [isEdit ,setIsEdit] = useState(false)

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/admin/admin-dashboard`, {
          headers: authHeaders(),
        });
        setMessage(res.data?.message || 'Welcome, Admin');
      } catch {
        setMessage('Access Denied');
      }
    };

    const fetchHotels = async () => {
      try {
        setLoadingHotels(true);
        const res = await axios.get(`${API_BASE}/api/admin/hotels`, {
          headers: authHeaders(),
        });
        const data = res.data;
        const list = Array.isArray(data) ? data : data?.hotels || [];
        setHotels(list);
      } catch (e) {
        setError(e?.response?.data?.message || e.message || 'Failed to load hotels');
      } finally {
        setLoadingHotels(false);
      }
    };

    fetchAdminData();
    fetchHotels();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imageFile') {
      const file = files?.[0] || null;
      setForm((f) => ({ ...f, imageFile: file }));
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(file ? URL.createObjectURL(file) : null);
      return;
    }
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    setError('');
    if (!form.name.trim()) return setError('Hotel name is required'), false;
    if (!form.address.trim()) return setError('Address is required'), false;
    const rating = Number(form.rating);
    if (Number.isNaN(rating) || rating < 1 || rating > 5)
      return setError('Rating must be between 1 and 5'), false;
    const rate = Number(form.rate);
    if (Number.isNaN(rate) || rate < 0) return setError('Rate must be a non-negative number'), false;
    if (!form.imageFile) return setError('Hotel image is required'), false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {

      if(isEdit){
 let res;
      if (form.imageFile) {
        setError('');
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('address', form.address);
      fd.append('rating', form.rating);
      fd.append('rate', form.rate);
      fd.append('image', form.imageFile);
        res = await axios.put(`${API_BASE}/api/admin/hotels/${editingId}`, fd, {
          headers: authHeaders(),
        });
      } 
      }else{
setSubmitting(true);
      setError('');
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('address', form.address);
      fd.append('rating', form.rating);
      fd.append('rate', form.rate);
      fd.append('image', form.imageFile);

      const res = await axios.post(`${API_BASE}/api/admin/hotels`, fd, {
        headers: authHeaders(),
      });

      const created = res.data?.hotel || res.data;
      if (created) setHotels((prev) => [created, ...prev]);

      setForm({ name: '', address: '', rating: '', rate: '', imageFile: null });
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      }
       
    } catch (e) {
      console.error('CREATE HOTEL ERROR:', e);
      setError(e?.response?.data?.message || e.message || 'Failed to add hotel');
    } finally {
      setSubmitting(false);
    }
  };
  const startEdit = (h) => {
    setEditingId(h._id );
    setIsEdit(true)
    setForm({
      name: h.name || '',
      address: h.address || '',
      rating: String(h.rating ?? ''),
      rate: String(h.rate ?? ''),
      imageFile: `${API_BASE}${h.imageUrl}`,
      preview: null,
    });
  };

  const cancelEdit = () => {
    if (editForm.preview) URL.revokeObjectURL(editForm.preview);
    setEditingId(null);
    setEditForm({ name: '', address: '', rating: '', rate: '', imageFile: null, preview: null });
  };

  // const handleEditChange = (e) => {
  //   const { name, value, files } = e.target;
  //   if (name === 'imageFile') {
  //     const file = files?.[0] || null;
  //     if (editForm.preview) URL.revokeObjectURL(editForm.preview);
  //     setEditForm((f) => ({ ...f, imageFile: file, preview: file ? URL.createObjectURL(file) : null }));
  //     return;
  //   }
  //   setEditForm((f) => ({ ...f, [name]: value }));
  // };

  // const saveEdit = async (hotelId) => {
  //   try {
  //     setRowBusy(true);
  //     setError('');

  //     let res;
  //     if (editForm.imageFile) {
  //       const fd = new FormData();
  //       fd.append('name', editForm.name);
  //       fd.append('address', editForm.address);
  //       fd.append('rating', editForm.rating);
  //       fd.append('rate', editForm.rate);
  //       fd.append('image', editForm.imageFile);
  //       res = await axios.put(`${API_BASE}/api/admin/hotels/${hotelId}`, fd, {
  //         headers: authHeaders(),
  //       });
  //     } else {
  //       res = await axios.put(`${API_BASE}/api/admin/hotels/${hotelId}`, {
  //         name: editForm.name,
  //         address: editForm.address,
  //         rating: Number(editForm.rating),
  //         rate: Number(editForm.rate),
  //       }, {
  //         headers: { ...authHeaders(), 'Content-Type': 'application/json' },
  //       });
  //     }
 
  //     const updated = res.data?.hotel || res.data;
  //     setHotels((prev) =>
  //       prev.map((x) => (String(x._id || x.id) === String(hotelId) ? { ...x, ...updated } : x))
  //     );
  //     cancelEdit();
  //   } catch (e) {
  //     console.error('UPDATE HOTEL ERROR:', e);
  //     setError(e?.response?.data?.message || e.message || 'Failed to update hotel');
  //   } finally {
  //     setRowBusy(false);
  //   }
  // };
console.log("hotel",hotels);

  const deleteHotel = async (hotelId) => {
    const ok = window.confirm('Delete this hotel?');
    if (!ok) return;

    try {
      setRowBusy(true);
      setError('');
      await axios.delete(`${API_BASE}/api/admin/hotels/${hotelId}`, {
        headers: authHeaders(),
      });
      setHotels((prev) => prev.filter((x) => String(x._id || x.id) !== String(hotelId)));
      if (editingId === hotelId) cancelEdit();
    } catch (e) {
      console.error('DELETE HOTEL ERROR:', e);
      setError(e?.response?.data?.message || e.message || 'Failed to delete hotel');
    } finally {
      setRowBusy(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
      <h1>Admin Dashboard</h1>
      <p>{message}</p>

      {/* Create Form */}
      <section className="container my-4 p-4 border rounded shadow-sm">
        <h2 className="mb-4">Create Hotel</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label">Hotel Name</label>
              <input type="text" name="name" className="form-control" value={form.name} onChange={handleChange} required />
            </div>
            <div className="col-12">
              <label className="form-label">Address</label>
              <textarea name="address" className="form-control" rows={3} value={form.address} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Rating (1–5)</label>
              <input type="number" name="rating" className="form-control" min="1" max="5" step="0.1" value={form.rating} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Rate (₹)</label>
              <input type="number" name="rate" className="form-control" min="0" step="0.01" value={form.rate} onChange={handleChange} required />
            </div>
            <div className="col-12">
              <label className="form-label">Hotel Image</label>
              <input type="file" name="imageFile" className="form-control" accept="image/*" onChange={handleChange} required />
            </div>
            {previewUrl && (
              <div className="col-12">
                <strong>Preview:</strong>
                <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: 240, borderRadius: 8 }} />
              </div>
            )}
            <div className="col-12">
               
              {isEdit ? <div className="d-flex justify-content-center mt-3">
  <button 
    type="submit" 
    className="btn btn-primary btn-sm px-4" 
    disabled={submitting}
  >
    Update
  </button>
</div>:<div className="d-flex justify-content-center mt-6">
  <button type="submit" className="btn btn-primary default" disabled={submitting}>
    {submitting ? 'Adding…' : 'Add Hotel'}
  </button>
</div>
}
            </div>
          </div>
        </form>
      </section>
        <div className="container my-4">
  <div className="row">
    {hotels && hotels.map((h) => {
      const isEditing = h._id === editingId;

      return (
        <div className="col-lg-6 mb-4" key={h._id}>
          <div className="card h-100 shadow-sm border-0">
            <div className="row g-0">
              <div className="col-md-5">
                <img
                  src={`${API_BASE}${h.imageUrl}`}
                  alt={h.name}
                  className="img-fluid rounded-start h-100"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="col-md-7">
                <div className="card-body d-flex flex-column justify-content-between h-100">
                  <div>
                    <h5 className="card-title fw-bold">{h.name || 'No Name'}</h5>
                    <p className="card-text mb-1"><strong>Address:</strong> {h.address || 'No Address'}</p>
                    <p className="card-text mb-1"><strong>Rating:</strong> {h.rating ?? 'N/A'}</p>
                    <p className="card-text"><strong>Rate:</strong> ₹{h.rate ?? 'N/A'}</p>
                  </div>
                  <div className="d-flex gap-2 mt-3">
                    <button className="btn btn-primary btn-sm" onClick={() => startEdit(h)}>Edit</button>
                    {isEditing ? (
                      <button className="btn btn-secondary btn-sm" onClick={cancelEdit}>Cancel</button>
                    ) : (
                      <button className="btn btn-danger btn-sm" onClick={() => deleteHotel(h._id)}>Delete</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    })}
  </div>
</div>


        
      
    </div> 
  );
};

export default AdminDashboard;