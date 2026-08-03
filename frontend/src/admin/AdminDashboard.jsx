import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBed, FaSpa, FaGlassCheers, FaUsers, FaCalendarCheck, FaMoneyBillWave, FaSpinner, FaArrowRight } from 'react-icons/fa';
import { adminGetStats, adminGetRecentBookings } from '../services/api';
import { formatPrice } from '../utils/format';
import StatusBadge from './StatusBadge';

const itemNames = { Room: 'Room', Service: 'Service', Hall: 'Hall' };

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminGetStats(), adminGetRecentBookings()])
      .then(([s, r]) => { setStats(s); setRecent(r); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = stats ? [
    { label: 'Total Bookings', value: stats.bookings, icon: FaCalendarCheck },
    { label: 'Revenue', value: formatPrice(stats.revenue), icon: FaMoneyBillWave },
    { label: 'Rooms', value: stats.rooms, icon: FaBed },
    { label: 'Services', value: stats.services, icon: FaSpa },
    { label: 'Halls', value: stats.halls, icon: FaGlassCheers },
    { label: 'Users', value: stats.users, icon: FaUsers },
  ] : [];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Overview of your hotel's activity.</p>
        </div>
        <Link to="/admin/bookings" className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-black transition-colors">
          All bookings <FaArrowRight className="text-[10px]" />
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><FaSpinner className="animate-spin text-gray-400 text-2xl" /></div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
            {cards.map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-card">
                <span className="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center mb-3">
                  <Icon className="text-white text-sm" />
                </span>
                <p className="text-lg font-display font-bold text-gray-900 leading-none truncate">{value}</p>
                <p className="text-xs text-gray-500 mt-1.5">{label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-display font-semibold text-gray-900">Recent bookings</h2>
              <Link to="/admin/bookings" className="text-xs font-semibold text-gray-500 hover:text-black transition-colors">View all</Link>
            </div>
            <div className="divide-y divide-gray-50">
              {recent.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-12">No bookings yet.</p>
              ) : (
                recent.map((b) => (
                  <div key={b._id} className="flex items-center gap-3 px-5 py-3.5">
                    <span className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-[10px] font-bold text-gray-500 shrink-0">
                      {itemNames[b.bookingType]?.slice(0, 2).toUpperCase()}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{b.itemId?.name || b.guestName}</p>
                      <p className="text-xs text-gray-400 truncate">{b.guestName} &middot; {new Date(b.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="hidden sm:block">
                      <StatusBadge status={b.status} />
                    </div>
                    <span className="text-sm font-display font-bold text-gray-900 whitespace-nowrap">{formatPrice(b.totalPrice)}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
