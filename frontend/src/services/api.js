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
export const getServices = (cat) => fetch_(cat ? `/services?category=${cat}` : '/services');
export const getHalls = (type) => fetch_(type ? `/halls?type=${type}` : '/halls');
export const createBooking = (data) => fetch_('/bookings', { method: 'POST', body: JSON.stringify(data) });
export const getBookings = (email) => fetch_(`/bookings?email=${email}`);
export const signup = (data) => fetch_('/auth/signup', { method: 'POST', body: JSON.stringify(data) });
export const signin = (data) => fetch_('/auth/signin', { method: 'POST', body: JSON.stringify(data) });
export const guestSignup = (data) => fetch_('/auth/guest', { method: 'POST', body: JSON.stringify(data) });
