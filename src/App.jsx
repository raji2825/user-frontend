import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import AdminDashboard from './pages/AdminDashboard';
import AdminBookingsPage from './pages/AdminBookingApproval';
import Login from './pages/Login';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin/bookings" element={<AdminBookingsPage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;