import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { FaSpinner, FaTrash, FaTimes } from 'react-icons/fa';
import { adminGetBookings, adminUpdateBookingStatus, adminDeleteBooking } from '../services/api';
import { formatPrice } from '../utils/format';
import StatusBadge from './StatusBadge';

const statuses = ['Pending', 'Confirmed', 'Cancelled', 'Completed'];
const types = ['Room', 'Service', 'Hall'];

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [busy, setBusy] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    const params = {};
    if (statusFilter) params.status = statusFilter;
    if (typeFilter) params.bookingType = typeFilter;
    adminGetBookings(params)
      .then(setBookings)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [statusFilter, typeFilter]);

  useEffect(() => { load(); }, [load]);

  const changeStatus = (id, status) => {
    setBusy(id);
    adminUpdateBookingStatus(id, status)
      .then(() => { toast.success('Booking updated'); load(); })
      .catch((e) => toast.error(e.message))
      .finally(() => setBusy(null));
  };

  const remove = (id) => {
    setBusy(id);
    adminDeleteBooking(id)
      .then(() => { toast.success('Booking deleted'); setConfirmDelete(null); load(); })
      .catch((e) => toast.error(e.message))
      .finally(() => setBusy(null));
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all reservations across rooms, services and halls.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field !py-2.5 w-auto text-sm cursor-pointer">
            <option value="">All statuses</option>
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="input-field !py-2.5 w-auto text-sm cursor-pointer">
            <option value="">All types</option>
            {types.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><FaSpinner className="animate-spin text-gray-400 text-2xl" /></div>
      ) : bookings.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-card">
          <p className="font-semibold text-gray-600">No bookings found</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting the filters.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  <th className="px-5 py-3.5 font-medium">Guest</th>
                  <th className="px-5 py-3.5 font-medium">Item</th>
                  <th className="px-5 py-3.5 font-medium">Dates</th>
                  <th className="px-5 py-3.5 font-medium">Guests</th>
                  <th className="px-5 py-3.5 font-medium">Total</th>
                  <th className="px-5 py-3.5 font-medium">Status</th>
                  <th className="px-5 py-3.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5 min-w-[160px]">
                      <p className="font-semibold text-gray-900">{b.guestName}</p>
                      <p className="text-xs text-gray-400 truncate max-w-[200px]">{b.email}</p>
                    </td>
                    <td className="px-5 py-3.5 min-w-[160px]">
                      <p className="text-gray-900">{b.itemId?.name || '—'}</p>
                      <p className="text-xs text-gray-400">{b.bookingType}</p>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {b.bookingType === 'Room' ? (
                        <span className="text-gray-600">
                          {b.checkIn ? new Date(b.checkIn).toLocaleDateString() : '—'} &rarr; {b.checkOut ? new Date(b.checkOut).toLocaleDateString() : '—'}
                        </span>
                      ) : (
                        <span className="text-gray-600">
                          {b.date ? new Date(b.date).toLocaleDateString() : '—'}{b.time ? `, ${b.time}` : ''}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">{b.guests}</td>
                    <td className="px-5 py-3.5 font-display font-bold text-gray-900 whitespace-nowrap">{formatPrice(b.totalPrice)}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={b.status} /></td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <select
                          value={b.status}
                          onChange={(e) => changeStatus(b._id, e.target.value)}
                          disabled={busy === b._id}
                          className="input-field !py-2 text-xs w-auto cursor-pointer"
                        >
                          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <button
                          onClick={() => setConfirmDelete(b)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          aria-label="Delete booking"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete confirm modal */}
      {confirmDelete && (
        <div className="overlay" onClick={() => setConfirmDelete(null)}>
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-modal animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-bold text-gray-900 text-lg">Delete booking?</h3>
              <button onClick={() => setConfirmDelete(null)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100" aria-label="Close">
                <FaTimes className="text-xs" />
              </button>
            </div>
            <p className="text-gray-500 text-sm">
              Booking for <strong className="text-gray-900">{confirmDelete.guestName}</strong> ({confirmDelete.itemId?.name || confirmDelete.bookingType}) will be permanently removed.
            </p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setConfirmDelete(null)} className="btn-outline flex-1 !py-2.5">Cancel</button>
              <button onClick={() => remove(confirmDelete._id)} disabled={busy === confirmDelete._id} className="btn-primary flex-1 !py-2.5 bg-red-500 hover:bg-red-600">
                {busy === confirmDelete._id ? <FaSpinner className="animate-spin" /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
