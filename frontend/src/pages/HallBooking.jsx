import { useState, useEffect } from 'react';
import {
  FaGlassCheers, FaUsers, FaCheckCircle, FaFilter,
  FaMicrophone, FaSeedling, FaBuilding, FaChair,
} from 'react-icons/fa';
import { getHalls } from '../services/api';
import { formatPrice } from '../utils/format';
import BookingModal from '../components/BookingModal';
import Spinner from '../components/Spinner';
import ItemModal from '../components/ItemModal';

const types = [
  { value: 'All', label: 'All Venues', icon: FaFilter },
  { value: 'Conference', label: 'Conference', icon: FaMicrophone },
  { value: 'Wedding', label: 'Wedding', icon: FaGlassCheers },
  { value: 'Banquet', label: 'Banquet', icon: FaChair },
  { value: 'Meeting', label: 'Meeting', icon: FaBuilding },
  { value: 'Garden', label: 'Garden', icon: FaSeedling },
];

const typeConfig = {
  Conference: { gradient: 'from-gray-700 to-gray-900', accent: 'bg-gray-100 text-gray-700', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&q=80', icon: FaMicrophone },
  Wedding: { gradient: 'from-gray-700 to-gray-900', accent: 'bg-gray-100 text-gray-700', image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80', icon: FaGlassCheers },
  Banquet: { gradient: 'from-gray-700 to-gray-900', accent: 'bg-gray-100 text-gray-700', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80', icon: FaChair },
  Meeting: { gradient: 'from-gray-700 to-gray-900', accent: 'bg-gray-100 text-gray-700', image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=600&q=80', icon: FaBuilding },
  Garden: { gradient: 'from-gray-700 to-gray-900', accent: 'bg-gray-100 text-gray-700', image: 'https://images.unsplash.com/photo-1526047932273-34113c170e08?w=600&q=80', icon: FaSeedling },
};

const defaultHalls = [
  { _id: '1', name: 'Victory Conference Hall', type: 'Conference', capacity: 100, price: 500, description: 'State-of-the-art conference hall with projector and premium sound system, ideal for business meetings in Kigali.', amenities: ['Projector', 'Sound System', 'WiFi', 'Whiteboard', 'Mic'], images: ['https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&q=80'] },
  { _id: '2', name: 'Golden Garden', type: 'Wedding', capacity: 200, price: 1500, description: 'Beautiful outdoor garden venue for dream Rwandan weddings with stunning floral arrangements and Kigali views.', amenities: ['Stage', 'Lighting', 'Sound System', 'Parking', 'Bridal Suite'], images: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80'] },
  { _id: '3', name: 'Royal Banquet Hall', type: 'Banquet', capacity: 150, price: 800, description: 'Elegant indoor banquet hall for grand celebrations, receptions, and corporate gala dinners.', amenities: ['Stage', 'Lighting', 'Sound System', 'Kitchen Access', 'Parking'], images: ['https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80'] },
  { _id: '4', name: 'Executive Meeting Room', type: 'Meeting', capacity: 20, price: 150, description: 'Intimate meeting room for corporate discussions and board meetings in a professional setting.', amenities: ['Projector', 'WiFi', 'Whiteboard', 'Coffee Service'], images: ['https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=600&q=80'] },
  { _id: '5', name: 'Sunset Terrace', type: 'Garden', capacity: 80, price: 600, description: 'Open-air terrace overlooking Kigali with stunning sunset views, perfect for cocktail parties and receptions.', amenities: ['Lighting', 'Sound System', 'Bar Service', 'Parking'], images: ['https://images.unsplash.com/photo-1526047932273-34113c170e08?w=600&q=80'] },
];

export default function HallBooking() {
  const [halls, setHalls] = useState([]);
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHalls()
      .then((data) => { if (data?.length) setHalls(data); else setHalls(defaultHalls); })
      .catch(() => setHalls(defaultHalls))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'All' ? halls : halls.filter((h) => h.type === filter);

  return (
    <>
      <section className="page-hero">
        <div className="absolute inset-0 overflow-hidden">
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1598605272254-16f0c0ecdfa5?w=1600&q=80')] bg-cover bg-center animate-hero-zoom" />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-gray-300 font-semibold text-xs uppercase tracking-widest">Venues</span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mt-2 mb-2 animate-in">
            Event <span className="text-gray-300">Halls</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-sm">
            From intimate meetings to grand Rwandan weddings, find the perfect venue for your special event in Kigali
          </p>
        </div>
      </section>

      <section className="py-10 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {types.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  filter === value
                    ? 'bg-white text-black shadow-md'
                    : 'bg-gray-900 border border-gray-800 text-gray-400 hover:bg-gray-800 hover:border-gray-700'
              }`}
            >
              <Icon className="text-xs" /> {label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <Spinner size="text-2xl" label="Loading venues..." />
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((hall, i) => {
              const cfg = typeConfig[hall.type] || typeConfig.Conference;
              const Icon = cfg.icon;
              return (
                <div key={hall._id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-0.5 hover:border-gray-700 group transition-all duration-300 flex flex-col" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="h-40 bg-gray-800 relative overflow-hidden cursor-pointer group" onClick={() => setPreview(hall)}>
                    {(hall.images?.[0] || cfg.image) && (
                      <img
                        src={hall.images?.[0] || cfg.image}
                        alt={hall.type}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="bg-gray-900/80 text-gray-200 text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-sm">{hall.type}</span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-white text-xs font-medium">
                        <FaUsers className="text-[10px]" />
                        Up to {hall.capacity} guests
                      </div>
                      <div className="w-7 h-7 bg-black/60 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        <Icon className="text-white text-[10px]" />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-display text-lg font-bold text-white mb-1.5">{hall.name}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-3 flex-1">{hall.description}</p>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {hall.amenities?.slice(0, 4).map((a) => (
                        <span key={a} className="flex items-center gap-1 text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded-md border border-gray-700">
                          <FaCheckCircle className="text-gray-500 text-[10px]" /> {a}
                        </span>
                      ))}
                      {hall.amenities?.length > 4 && (
                        <span className="text-[10px] bg-gray-800 text-gray-500 px-2 py-0.5 rounded-md border border-gray-700">+{hall.amenities.length - 4}</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-800 mt-auto">
                      <div>
                    <span className="text-lg font-display font-bold text-white">{formatPrice(hall.price)}</span>
                    <span className="text-gray-500 text-sm"> / event</span>
                      </div>
                      <button onClick={() => setSelected(hall)} className="bg-white hover:bg-gray-200 text-black text-sm font-semibold px-4 py-2 rounded-xl transition-all hover:-translate-y-0.5">
                        Book Hall
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-10">
            <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-3">
              <FaGlassCheers className="text-xl text-gray-400" />
            </div>
            <h3 className="font-display text-lg font-bold text-gray-300 mb-1">No venues found</h3>
            <p className="text-gray-400 text-sm">Try selecting a different category</p>
          </div>
        )}
        </div>
      </section>

      {selected && <BookingModal item={selected} type="Hall" onClose={() => setSelected(null)} />}

      {preview && (
        <ItemModal
          item={preview}
          image={preview.images?.[0] || (typeConfig[preview.type] || typeConfig.Conference).image}
          meta={`${preview.type} · Up to ${preview.capacity} guests`}
          chips={preview.amenities || []}
          priceSuffix=" / event"
          bookLabel="Book Hall"
          onClose={() => setPreview(null)}
          onBook={() => { setSelected(preview); setPreview(null); }}
        />
      )}
    </>
  );
}
