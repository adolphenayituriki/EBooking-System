import { Link } from 'react-router-dom';
import { FaHotel, FaHome } from 'react-icons/fa';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-black">
      <div className="text-center px-4 py-20">
        <div className="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-8">
          <FaHotel className="text-4xl text-gray-400" />
        </div>
        <h1 className="text-8xl md:text-9xl font-display font-bold text-white mb-4">404</h1>
        <p className="text-2xl font-display font-semibold text-white mb-2">Page Not Found</p>
        <p className="text-gray-400 max-w-md mx-auto mb-8">
          The page you are looking for does not exist or has been moved. Let us help you find your way back.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-all hover:-translate-y-0.5"
        >
          <FaHome /> Back to Home
        </Link>
      </div>
    </div>
  );
}
