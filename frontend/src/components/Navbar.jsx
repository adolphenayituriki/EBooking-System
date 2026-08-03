import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaPhoneAlt, FaUser, FaSignOutAlt, FaCalendarCheck, FaHome, FaBed, FaSpa, FaUsers, FaEnvelope, FaBell, FaRegCalendarCheck, FaPercent, FaTachometerAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import MyBookings from './MyBookings';

const links = [
  { to: '/', label: 'Home' },
  { to: '/rooms', label: 'Rooms' },
  { to: '/services', label: 'Services' },
  { to: '/halls', label: 'Halls' },
  { to: '/contact', label: 'Contact' },
];

const linkIcons = {
  '/': FaHome,
  '/rooms': FaBed,
  '/services': FaSpa,
  '/halls': FaUsers,
  '/contact': FaEnvelope,
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showBookings, setShowBookings] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifs, setNotifs] = useState([
    { id: 1, icon: FaRegCalendarCheck, title: 'Booking confirmed', desc: 'Your Deluxe Room stay is confirmed for this weekend.', time: '2m ago', read: false },
    { id: 2, icon: FaPercent, title: 'Save 20% this weekend', desc: 'Book 7 days ahead and unlock exclusive rates.', time: '1h ago', read: false },
    { id: 3, icon: FaSpa, title: 'Spa package available', desc: 'New couples massage package is now live.', time: '1d ago', read: true },
  ]);
  const userMenuRefDesktop = useRef(null);
  const userMenuRefMobile = useRef(null);
  const notifRefDesktop = useRef(null);
  const notifRefMobile = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    if (!showUserMenu) return;
    const handleClick = (e) => {
      const inside = [userMenuRefDesktop, userMenuRefMobile].some(
        (r) => r.current && r.current.contains(e.target)
      );
      if (!inside) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showUserMenu]);

  useEffect(() => {
    if (!showNotifs) return;
    const handleClick = (e) => {
      const inside = [notifRefDesktop, notifRefMobile].some(
        (r) => r.current && r.current.contains(e.target)
      );
      if (!inside) setShowNotifs(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showNotifs]);

  const unread = notifs.filter((n) => !n.read).length;
  const markAllRead = () => setNotifs((ps) => ps.map((n) => ({ ...n, read: true })));

  const isHome = pathname === '/';

  const handleBookNow = () => {
    setOpen(false);
    if (user) navigate('/rooms');
    else setShowAuth(true);
  };

  const handleAuthDone = () => { setShowAuth(false); navigate('/rooms'); };

  const Logo = () => (
    <Link to="/" className="flex items-center shrink-0 group" aria-label="Akarabo Hotel & Spa">
      <div className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-colors ${isHome ? 'border-gray-600 group-hover:border-white' : 'border-gray-200 group-hover:border-black'}`}>
        <img src="/Logo.png" alt="Akarabo Hotel & Spa" className="w-full h-full object-cover scale-125" />
      </div>
    </Link>
  );

  const navLinks = (
    <div className="flex items-center justify-center flex-1 gap-0.5">
      {links.map((l) => {
        const isActive = pathname === l.to;
        return (
          <Link
            key={l.to}
            to={l.to}
            className="relative px-4 py-2 text-sm font-medium transition-colors duration-300 group"
          >
            <span className={`${
              isActive
                ? isHome ? 'text-white' : 'text-black'
                : isHome ? 'text-gray-400 group-hover:text-white' : 'text-gray-600 group-hover:text-black'
            }`}>
              {l.label}
            </span>
            <span className={`absolute -bottom-0.5 left-0 h-[2px] rounded-full transition-all duration-300 ${
              isActive ? 'w-full' : 'w-0 group-hover:w-full'
            } ${isHome ? 'bg-white' : 'bg-black'}`} />
          </Link>
        );
      })}
    </div>
  );

  const notifBtn = (ref) => (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setShowNotifs(!showNotifs)}
        className={`relative w-9 h-9 flex items-center justify-center rounded-xl transition-all border ${
          isHome
            ? 'text-gray-200 border-gray-600 bg-gray-800/60 hover:bg-gray-700 hover:text-white'
            : 'text-gray-600 border-gray-300 bg-gray-50 hover:bg-gray-200 hover:text-black'
        } ${showNotifs ? (isHome ? 'bg-gray-700' : 'bg-gray-200') : ''}`}
        aria-label="Notifications"
      >
        <FaBell className="text-sm" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      {showNotifs && (
        <div className="absolute right-0 top-full mt-2 w-80 max-w-[85vw] bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden animate-scale-in">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <p className="text-sm font-semibold text-black">Notifications</p>
            {unread > 0 && (
              <button onClick={markAllRead} className="text-xs font-medium text-gray-500 hover:text-black transition-colors">
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifs.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">No notifications yet</p>
            ) : (
              notifs.map((n) => (
                <div
                  key={n.id}
                  onClick={() => setNotifs((ps) => ps.map((x) => x.id === n.id ? { ...x, read: true } : x))}
                  className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors cursor-pointer border-b border-gray-100 last:border-0 ${
                    n.read ? 'bg-white hover:bg-gray-50' : 'bg-gray-50/70 hover:bg-gray-100'
                  }`}
                >
                  <span className={`w-8 h-8 flex items-center justify-center rounded-lg shrink-0 ${
                    n.read ? 'bg-gray-100 text-gray-400' : 'bg-black text-white'
                  }`}>
                    <n.icon className="text-xs" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className={`text-sm ${n.read ? 'text-gray-500' : 'text-black font-semibold'}`}>{n.title}</span>
                      {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />}
                    </span>
                    <span className="block text-xs text-gray-500 truncate">{n.desc}</span>
                    <span className="block text-[10px] text-gray-400 mt-0.5">{n.time}</span>
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );

  const profileBtn = (compact, menuRef) => user ? (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setShowUserMenu(!showUserMenu)}
        className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all border ${
          isHome
            ? 'text-gray-200 border-gray-600 bg-gray-800/60 hover:bg-gray-700 hover:text-white'
            : 'text-gray-600 border-gray-300 bg-gray-50 hover:bg-gray-200 hover:text-black'
        } ${showUserMenu ? (isHome ? 'bg-gray-700' : 'bg-gray-200') : ''}`}
        aria-label="Account"
      >
        <FaUser className="text-sm" />
      </button>

      {showUserMenu && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 animate-scale-in overflow-hidden">
          <div className="px-4 py-2.5 border-b border-gray-200 mb-1">
            <p className="text-sm font-semibold text-black truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
          <button
            onClick={() => { setShowBookings(true); setShowUserMenu(false); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <FaCalendarCheck className="text-gray-500 text-xs" /> My Bookings
          </button>
          {user.role === 'admin' && (
            <Link
              to="/admin"
              onClick={() => setShowUserMenu(false)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <FaTachometerAlt className="text-gray-500 text-xs" /> Admin Dashboard
            </Link>
          )}
          <hr className="my-1 border-gray-200" />
          <button
            onClick={() => { logout(); setShowUserMenu(false); navigate('/'); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
          >
            <FaSignOutAlt className="text-xs" /> Sign Out
          </button>
        </div>
      )}
    </div>
  ) : compact ? (
    <button
      onClick={() => setShowAuth(true)}
      className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all border ${
        isHome
          ? 'text-gray-200 border-gray-600 bg-gray-800/60 hover:bg-gray-700 hover:text-white'
          : 'text-gray-600 border-gray-300 bg-gray-50 hover:bg-gray-200 hover:text-black'
      }`}
      aria-label="Sign in"
    >
      <FaUser className="text-sm" />
    </button>
  ) : (
    <button
      onClick={() => setShowAuth(true)}
      className={`px-3 py-2 text-sm font-medium rounded-xl transition-all ${
        isHome ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-black hover:bg-gray-100'
      }`}
    >
      <span className="whitespace-nowrap">Sign In</span>
    </button>
  );

  const actions = (
    <div className="flex items-center justify-end gap-1.5 xl:gap-2 shrink-0">
      {notifBtn(notifRefDesktop)}
      {profileBtn(false, userMenuRefDesktop)}
      <button
        onClick={handleBookNow}
        className={`text-sm font-semibold py-2.5 px-4 xl:px-5 rounded-xl whitespace-nowrap transition-all ${
          isHome ? 'bg-white text-black' : 'bg-black text-white'
        }`}
      >
        Book Your Stay &rarr;
      </button>
    </div>
  );

  return (
    <>
      {/* Fixed header wrapper */}
      <div className="fixed top-0 left-0 right-0 z-50">
        {/* Top bar — home page only */}
        {isHome && (
          <div className="hidden md:block bg-black">
            <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between h-9">
              <div className="flex items-center gap-5 text-xs">
                <a href="tel:+250788123456" className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors">
                  <FaPhoneAlt className="text-gray-500 text-[10px]" />
                  +250 788 123 456
                </a>
                <span className="text-gray-700">|</span>
                <a href="mailto:info@akarabohotel.rw" className="text-gray-300 hover:text-white transition-colors">info@akarabohotel.rw</a>
              </div>
              <div className="flex items-center gap-5 text-xs">
                <span className="text-gray-500">&#9733;</span>
                <span className="text-gray-400">Kigali, Rwanda — Open 24/7</span>
              </div>
            </div>
          </div>
        )}

        {/* Navbar */}
        {isHome ? (
          /* Solid black style */
          <div className="flex justify-center pt-5">
            <nav className="w-[92%] max-w-[1340px] rounded-2xl bg-black text-white border border-gray-800">
              <div className="flex items-center justify-between px-5 lg:px-8 py-[18px]">
                <div className="hidden lg:flex items-center justify-between w-full">
                  <div className="w-[22%] shrink-0"><Logo /></div>
                  {navLinks}
                  {actions}
                </div>
                <div className="flex lg:hidden items-center justify-between w-full">
                  <Logo />
                  <div className="flex items-center gap-1.5">
                    {profileBtn(true, userMenuRefMobile)}
                    {notifBtn(notifRefMobile)}
                    <button
                      onClick={() => setOpen(!open)}
                      className="relative z-50 w-10 h-10 flex items-center justify-center rounded-xl text-gray-400"
                      aria-label={open ? 'Close menu' : 'Open menu'}
                    >
                      {open ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
                    </button>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        ) : (
          /* Solid white style */
          <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-5 lg:px-8 py-3 lg:py-[14px]">
              <div className="hidden lg:flex items-center justify-between w-full">
                <div className="w-[22%] shrink-0"><Logo /></div>
                {navLinks}
                {actions}
              </div>
              <div className="flex lg:hidden items-center justify-between w-full">
                <Logo />
                <div className="flex items-center gap-1.5">
                  {profileBtn(true, userMenuRefMobile)}
                  {notifBtn(notifRefMobile)}
                  <button
                    onClick={() => setOpen(!open)}
                    className="relative z-50 w-10 h-10 flex items-center justify-center rounded-xl text-gray-500"
                    aria-label={open ? 'Close menu' : 'Open menu'}
                  >
                    {open ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
                  </button>
                </div>
              </div>
            </div>
          </nav>
        )}
      </div>

      {/* Placeholder for fixed header */}
      <div className={isHome ? 'h-[104px] md:h-[140px]' : 'h-[72px] lg:h-[76px]'} />

      {/* Mobile overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div className={`lg:hidden fixed top-0 right-0 z-50 h-full w-[320px] max-w-[85vw] transition-transform duration-300 ease-out ${
        open ? 'translate-x-0' : 'translate-x-full'
      } bg-white flex flex-col shadow-2xl`}>
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 h-[76px] shrink-0 border-b border-gray-200">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 shrink-0">
            <img src="/Logo.png" alt="Akarabo Hotel & Spa" className="w-full h-full object-cover scale-125" />
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            aria-label="Close menu"
          >
            <FaTimes />
          </button>
        </div>

        <div className="flex flex-col flex-1 min-h-0 overflow-y-auto px-5 pb-6 pt-2">
          {user && (
            <div className="flex items-center gap-3 mb-5 p-3 rounded-2xl bg-gray-50 border border-gray-200">
              <div className="w-11 h-11 bg-black rounded-2xl flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-white">
                  {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-black truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          )}

          <nav className="flex-1 space-y-1.5">
            {links.map((l, i) => {
              const Icon = linkIcons[l.to];
              const isActive = pathname === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-black bg-gray-100'
                      : 'text-gray-600 hover:text-black hover:bg-gray-100'
                  }`}
                  style={{ transitionDelay: `${i * 30}ms` }}
                >
                  <span className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors duration-200 ${
                    isActive ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    <Icon className="text-[13px]" />
                  </span>
                  {l.label}
                  {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-black" />}
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-gray-200 space-y-2 mt-4">
            {user ? (
              <>
                <button
                  onClick={() => { setShowBookings(true); setOpen(false); }}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <FaCalendarCheck className="text-gray-500 text-xs" /> My Bookings
                </button>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setOpen(false)}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <FaTachometerAlt className="text-gray-500 text-xs" /> Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => { logout(); setOpen(false); navigate('/'); }}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-100 transition-colors"
                >
                  <FaSignOutAlt className="text-xs" /> Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => { setShowAuth(true); setOpen(false); }}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <FaUser className="text-xs" /> Sign In
              </button>
            )}
            <button
              onClick={handleBookNow}
              className="w-full py-3 rounded-xl text-sm font-semibold bg-black text-white shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0 mt-2 whitespace-nowrap"
            >
              Book Your Stay &rarr;
            </button>
          </div>
        </div>
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onDone={handleAuthDone} />}
      {showBookings && <MyBookings onClose={() => setShowBookings(false)} />}
    </>
  );
}
