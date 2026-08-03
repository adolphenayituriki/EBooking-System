const API = '/api';

const NETWORK_ERROR = 'Unable to connect to the server. Please check your internet connection and try again.';

const friendly = (msg) => {
  const m = String(msg || '').trim();
  if (!m || /Request failed/.test(m)) return 'Something went wrong. Please try again.';
  if (/Failed to fetch|NetworkError|network error|ECONNREFUSED|timed out|timeout/i.test(m)) return NETWORK_ERROR;
  return m;
};

const fetch_ = async (url, opts = {}) => {
  const headers = { 'Content-Type': 'application/json' };
  const stored = localStorage.getItem('user');
  if (stored) headers['x-user-id'] = JSON.parse(stored).id;
  let res;
  try {
    res = await fetch(`${API}${url}`, { headers, ...opts, body: opts.body });
  } catch {
    throw new Error(NETWORK_ERROR);
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(friendly(err.error));
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
