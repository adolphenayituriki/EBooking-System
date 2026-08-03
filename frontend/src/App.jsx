import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import Services from './pages/Services';
import HallBooking from './pages/HallBooking';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import RequireAdmin from './admin/RequireAdmin';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminBookings from './admin/AdminBookings';
import AdminItems from './admin/AdminItems';
import AdminUsers from './admin/AdminUsers';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function Shell() {
  const { pathname } = useLocation();

  if (pathname.startsWith('/admin')) {
    return (
      <Routes>
        <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
          <Route index element={<AdminDashboard />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="rooms" element={<AdminItems type="rooms" />} />
          <Route path="services" element={<AdminItems type="services" />} />
          <Route path="halls" element={<AdminItems type="halls" />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
        <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/services" element={<Services />} />
          <Route path="/halls" element={<HallBooking />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Shell />
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="light"
          toastStyle={{
            borderRadius: '12px',
            padding: '12px 16px',
            fontFamily: '"DM Sans", system-ui, sans-serif',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          }}
          progressStyle={{
            background: '#000',
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}
