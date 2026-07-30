import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaPhoneAlt, FaUser, FaSignOutAlt, FaCalendarCheck, FaChevronDown } from 'react-icons/fa';
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

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showBookings, setShowBookings] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    if (!showUserMenu) return;
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showUserMenu]);

  const isHome = pathname === '/';

  const handleBookNow = () => {
    setOpen(false);
    if (user) navigate('/rooms');
    else setShowAuth(true);
  };

  const handleAuthDone = () => { setShowAuth(false); navigate('/rooms'); };

  const Logo = () => (
    <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
      <div className="flex flex-col">
        <span className={`text-xl font-display font-bold tracking-[0.2em] leading-tight ${
          isHome ? 'text-white' : 'text-black'
        }`}>
          AKARABO
        </span>
        <span className="text-[10px] font-medium tracking-[0.35em] uppercase text-gray-400">
          Hotel & Spa
        </span>
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

  const actions = (
    <div className="flex items-center justify-end gap-2 w-[22%] shrink-0">
      <a
        href="tel:+250788123456"
        className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all ${
          isHome ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-black hover:bg-gray-100'
        }`}
        aria-label="Call us"
      >
        <FaPhoneAlt className="text-xs" />
      </a>

      {user ? (
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
              isHome ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
            } ${showUserMenu ? (isHome ? 'bg-gray-800' : 'bg-gray-100') : ''}`}
          >
            <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center">
              <span className="text-[11px] font-bold text-white">
                {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            </div>
            <span className="text-sm font-medium max-w-[100px] truncate hidden xl:block">{user.name}</span>
            <FaChevronDown className={`text-[10px] transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
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
              <hr className="my-1 border-gray-200" />
              <button
                onClick={() => { logout(); setShowUserMenu(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                <FaSignOutAlt className="text-xs" /> Sign Out
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => setShowAuth(true)}
          className={`px-3 py-2 text-sm font-medium rounded-xl transition-all ${
            isHome ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-black hover:bg-gray-100'
          }`}
        >
          <span className="whitespace-nowrap">Sign In</span>
        </button>
      )}

      <button
        onClick={handleBookNow}
        className={`text-sm font-semibold py-2.5 px-5 rounded-2xl transition-all ${
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
                  <button
                    onClick={() => setOpen(!open)}
                    className="relative z-50 w-10 h-10 flex items-center justify-center rounded-xl text-gray-400"
                    aria-label={open ? 'Close menu' : 'Open menu'}
                  >
                    {open ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
                  </button>
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
                <button
                  onClick={() => setOpen(!open)}
                  className="relative z-50 w-10 h-10 flex items-center justify-center rounded-xl text-gray-500"
                  aria-label={open ? 'Close menu' : 'Open menu'}
                >
                  {open ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
                </button>
              </div>
            </div>
          </nav>
        )}
      </div>

      {/* Placeholder for fixed header */}
      <div className={isHome ? 'h-[calc(36px+20px+68px)]' : 'h-[68px]'} />

      {/* Mobile overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div className={`lg:hidden fixed top-0 right-0 z-40 h-full w-[280px] max-w-[85vw] transition-transform duration-300 ease-out ${
        open ? 'translate-x-0' : 'translate-x-full'
      } bg-white`}>
        <div className="flex flex-col h-full pt-20 pb-6 px-5">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <FaTimes />
          </button>

          {user && (
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shrink-0">
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

          <nav className="flex-1 space-y-1">
            {links.map((l, i) => {
              const isActive = pathname === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-black bg-gray-100'
                      : 'text-gray-600 hover:text-black hover:bg-gray-100'
                  }`}
                  style={{ transitionDelay: `${i * 30}ms` }}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-gray-200 space-y-2">
            {user ? (
              <>
                <button
                  onClick={() => { setShowBookings(true); setOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <FaCalendarCheck className="text-gray-500 text-xs" /> My Bookings
                </button>
                <button
                  onClick={() => { logout(); setOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-100 transition-colors"
                >
                  <FaSignOutAlt className="text-xs" /> Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => { setShowAuth(true); setOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <FaUser className="text-xs" /> Sign In
              </button>
            )}
            <button
              onClick={handleBookNow}
              className="w-full py-3 rounded-xl text-sm font-semibold bg-black text-white shadow-lg transition-all hover:-translate-y-0.5 mt-2 whitespace-nowrap"
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
