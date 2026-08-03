import { NavLink, Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaTachometerAlt, FaCalendarCheck, FaBed, FaSpa, FaGlassCheers, FaUsers, FaSignOutAlt, FaArrowLeft } from 'react-icons/fa';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: FaTachometerAlt, end: true },
  { to: '/admin/bookings', label: 'Bookings', icon: FaCalendarCheck },
  { to: '/admin/rooms', label: 'Rooms', icon: FaBed },
  { to: '/admin/services', label: 'Services', icon: FaSpa },
  { to: '/admin/halls', label: 'Halls', icon: FaGlassCheers },
  { to: '/admin/users', label: 'Users', icon: FaUsers },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-64 bg-black text-white z-30">
        <Link to="/" className="flex items-center gap-3 px-6 h-16 border-b border-gray-800 shrink-0">
          <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-700 shrink-0">
            <img src="/Logo.png" alt="" className="w-full h-full object-cover scale-125" />
          </div>
          <div className="min-w-0">
            <p className="font-display font-bold text-sm leading-none">Akarabo Hotel</p>
            <p className="text-gray-500 text-[10px] mt-1">Admin Panel</p>
          </div>
        </Link>
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? 'bg-white text-black' : 'text-gray-400 hover:text-white hover:bg-gray-900'
                }`
              }
            >
              <Icon className="text-xs" /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800 shrink-0">
          <div className="px-4 py-2 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
            <p className="text-gray-500 text-xs truncate">{user?.email}</p>
          </div>
          <Link to="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-gray-900 transition-colors">
            <FaArrowLeft className="text-xs" /> View Site
          </Link>
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-gray-900 transition-colors">
            <FaSignOutAlt className="text-xs" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 lg:ml-64 min-w-0 flex flex-col">
        {/* Mobile header */}
        <header className="lg:hidden bg-black text-white sticky top-0 z-20">
          <div className="flex items-center justify-between px-4 h-14">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-700">
                <img src="/Logo.png" alt="" className="w-full h-full object-cover scale-125" />
              </div>
              <span className="font-display font-bold text-sm">Admin Panel</span>
            </Link>
            <button onClick={logout} className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-900 text-red-400 hover:text-red-300" aria-label="Sign out">
              <FaSignOutAlt className="text-xs" />
            </button>
          </div>
          <nav className="flex gap-1.5 px-3 pb-2.5 overflow-x-auto scrollbar-hide">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    isActive ? 'bg-white text-black' : 'text-gray-400'
                  }`
                }
              >
                <Icon className="text-[10px]" /> {label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
