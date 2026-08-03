import { FaSpinner } from 'react-icons/fa';

export default function Spinner({ size = 'text-2xl', className = '', label }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <FaSpinner className={`animate-spin text-gray-400 ${size}`} />
      {label && <span className="ml-2.5 text-sm font-medium text-gray-500">{label}</span>}
    </div>
  );
}
