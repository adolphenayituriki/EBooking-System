const API = '/api';

const fetch_ = async (url, opts = {}) => {
  const headers = { 'Content-Type': 'application/json' };
  const stored = localStorage.getItem('user');
  if (stored) headers['x-user-id'] = JSON.parse(stored).id;
  const res = await fetch(`${API}${url}`, { headers, ...opts, body: opts.body });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
};

export const getRooms = () => fetch_('/rooms');
export const getRoomAvailability = (params) => fetch_(`/rooms/availability?checkIn=${params.checkIn}&checkOut=${params.checkOut}&guests=${params.guests}`);
export const getServices = (cat) => fetch_(cat ? `/services?category=${cat}` : '/services');
export const getHalls = (type) => fetch_(type ? `/halls?type=${type}` : '/halls');
export const createBooking = (data) => fetch_('/bookings', { method: 'POST', body: JSON.stringify(data) });
export const getBookings = (email) => fetch_(`/bookings?email=${email}`);
export const signup = (data) => fetch_('/auth/signup', { method: 'POST', body: JSON.stringify(data) });
export const signin = (data) => fetch_('/auth/signin', { method: 'POST', body: JSON.stringify(data) });
export const guestSignup = (data) => fetch_('/auth/guest', { method: 'POST', body: JSON.stringify(data) });
export const getMe = () => fetch_('/auth/me');

export const adminGetStats = () => fetch_('/admin/stats');
export const adminGetRecentBookings = () => fetch_('/admin/recent-bookings');
export const adminGetBookings = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return fetch_(`/admin/bookings${qs ? `?${qs}` : ''}`);
};
export const adminUpdateBookingStatus = (id, status) => fetch_(`/admin/bookings/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
export const adminDeleteBooking = (id) => fetch_(`/admin/bookings/${id}`, { method: 'DELETE' });
export const adminGetUsers = () => fetch_('/admin/users');
export const adminSetUserRole = (id, role) => fetch_(`/admin/users/${id}/role`, { method: 'PUT', body: JSON.stringify({ role }) });
export const adminCreateItem = (type, data) => fetch_(`/admin/items/${type}`, { method: 'POST', body: JSON.stringify(data) });
export const adminUpdateItem = (type, id, data) => fetch_(`/admin/items/${type}/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const adminDeleteItem = (type, id) => fetch_(`/admin/items/${type}/${id}`, { method: 'DELETE' });
