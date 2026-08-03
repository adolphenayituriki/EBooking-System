import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { FaSpinner, FaShieldAlt, FaUser } from 'react-icons/fa';
import { adminGetUsers, adminSetUserRole } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AdminUsers() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    adminGetUsers()
      .then(setUsers)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleRole = (u) => {
    const next = u.role === 'admin' ? 'customer' : 'admin';
    setBusy(u._id);
    adminSetUserRole(u._id, next)
      .then(() => { toast.success(`${u.name} is now ${next === 'admin' ? 'an admin' : 'a customer'}`); load(); })
      .catch((e) => toast.error(e.message))
      .finally(() => setBusy(null));
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900">Users</h1>
        <p className="text-gray-500 text-sm mt-1">Accounts registered on the platform and their roles.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><FaSpinner className="animate-spin text-gray-400 text-2xl" /></div>
      ) : users.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-card">
          <p className="font-semibold text-gray-600">No users yet</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  <th className="px-5 py-3.5 font-medium">User</th>
                  <th className="px-5 py-3.5 font-medium">Contact</th>
                  <th className="px-5 py-3.5 font-medium">Role</th>
                  <th className="px-5 py-3.5 font-medium">Joined</th>
                  <th className="px-5 py-3.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-[11px] font-bold text-gray-500 shrink-0">
                          {u.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{u.name}</p>
                          {u._id === me?.id && <p className="text-[10px] text-gray-400">You</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">{u.email}{u.phone ? <span className="text-gray-400 text-xs block">{u.phone}</span> : null}</td>
                    <td className="px-5 py-3.5">
                      <span className={`badge ${u.role === 'admin' ? 'bg-black text-white border-black' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                        {u.role === 'admin' ? <FaShieldAlt className="text-[9px]" /> : <FaUser className="text-[9px]" />}
                        {u.role === 'admin' ? 'Admin' : 'Customer'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end">
                        {u._id === me?.id ? (
                          <span className="text-xs text-gray-300">Protected</span>
                        ) : (
                          <button
                            onClick={() => toggleRole(u)}
                            disabled={busy === u._id}
                            className="text-xs font-semibold text-gray-600 hover:text-black transition-colors"
                          >
                            {busy === u._id ? <FaSpinner className="animate-spin mx-1" /> : u.role === 'admin' ? 'Remove admin' : 'Make admin'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
