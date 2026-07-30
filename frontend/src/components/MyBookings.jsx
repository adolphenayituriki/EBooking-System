import { useState, useEffect } from 'react';
import { FaTimes, FaSpinner, FaCalendarCheck, FaBed, FaGlassCheers, FaSpa, FaClock } from 'react-icons/fa';
import { getBookings } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/format';

const typeIcons = { Room: FaBed, Service: FaSpa, Hall: FaGlassCheers };
const statusColors = {
  Pending: 'bg-gray-100 text-gray-700 border-gray-200',
  Confirmed: 'bg-gray-100 text-gray-700 border-gray-200',
  Cancelled: 'bg-gray-100 text-gray-700 border-gray-200',
  Completed: 'bg-gray-100 text-gray-600 border-gray-200',
};

export default function MyBookings({ onClose }) {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      getBookings(user.email)
        .then(setBookings)
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [user]);

  return (
    <div className="overlay animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-modal animate-scale-in flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="bg-black p-6 text-white flex items-center justify-between">
          <div>
            <h3 className="font-display text-xl font-bold">My Bookings</h3>
            <p className="text-gray-400 text-sm">{user?.name} — {bookings.length} booking{bookings.length !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors">
            <FaTimes className="text-sm" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex justify-center py-16"><FaSpinner className="animate-spin text-gray-500 text-2xl" /></div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaCalendarCheck className="text-2xl text-gray-400" />
              </div>
              <p className="font-semibold text-gray-600">No bookings yet</p>
              <p className="text-gray-400 text-sm mt-1">Your reservations will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => {
                const Icon = typeIcons[b.bookingType] || FaCalendarCheck;
                return (
                  <div key={b._id} className="card p-4 flex items-start gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                      <Icon className="text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{b.itemId?.name || b.guestName}</p>
                          <p className="text-gray-500 text-xs mt-0.5">{b.bookingType} — {b.guests} guest{b.guests > 1 ? 's' : ''}</p>
                        </div>
                        <span className={`badge border text-xs ${statusColors[b.status] || statusColors.Pending}`}>
                          {b.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><FaClock /> {new Date(b.createdAt).toLocaleDateString()}</span>
                        <span className="font-semibold text-gray-900">{formatPrice(b.totalPrice)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
