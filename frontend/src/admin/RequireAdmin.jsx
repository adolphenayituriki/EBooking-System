import { Link, Navigate } from 'react-router-dom';
import { FaUserShield } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function RequireAdmin({ children }) {
  const { user, isAdmin } = useAuth();

  if (!user) return <Navigate to="/" replace />;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-card border border-gray-200 p-10 text-center max-w-md w-full">
          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FaUserShield className="text-xl text-gray-400" />
          </div>
          <h1 className="font-display font-bold text-xl text-gray-900">Admin access required</h1>
          <p className="text-gray-500 text-sm mt-2">Your account doesn't have admin permissions.</p>
          <Link to="/" className="btn-primary mt-6">Back to Home</Link>
        </div>
      </div>
    );
  }

  return children;
}
