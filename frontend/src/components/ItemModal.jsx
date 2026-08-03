import { FaTimes } from 'react-icons/fa';
import { formatPrice } from '../utils/format';

export default function ItemModal({ item, image, meta, chips = [], priceSuffix = '', bookLabel = 'Book Now', onClose, onBook }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/90" />
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl max-w-md w-full shadow-2xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 z-10 w-7 h-7 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors" aria-label="Close">
          <FaTimes className="text-[10px]" />
        </button>
        <div className="flex gap-0">
          <div className="w-28 sm:w-32 h-28 sm:h-32 shrink-0 bg-gray-800 relative overflow-hidden">
            {image && <img src={image} alt={item.name} className="w-full h-full object-cover rounded-l-2xl" />}
          </div>
          <div className="flex-1 p-3.5">
            <div className="flex items-start justify-between mb-1.5">
              <div>
                <h3 className="font-display font-bold text-white text-sm leading-tight">{item.name}</h3>
                <p className="text-gray-500 text-[10px] mt-0.5">{meta}</p>
              </div>
              <span className="text-xs font-display font-bold text-white whitespace-nowrap ml-2">{formatPrice(item.price)}<span className="text-gray-600 text-[9px] font-normal">{priceSuffix}</span></span>
            </div>
            <p className="text-gray-400 text-[11px] leading-relaxed line-clamp-3 mb-2.5">{item.description}</p>
            {chips.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2.5">
                {chips.slice(0, 4).map((c) => (
                  <span key={c} className="text-[9px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded border border-gray-700">{c}</span>
                ))}
                {chips.length > 4 && <span className="text-[9px] text-gray-500">+{chips.length - 4}</span>}
              </div>
            )}
            <button onClick={onBook} className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-white bg-black px-3 py-1.5 rounded-lg transition-all">
              {bookLabel} &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
