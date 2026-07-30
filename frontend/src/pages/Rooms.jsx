import { useState, useEffect } from 'react';
import { FaBed, FaUsers, FaWifi, FaCheckCircle, FaStar, FaFilter } from 'react-icons/fa';
import { getRooms } from '../services/api';
import { formatPrice } from '../utils/format';
import BookingModal from '../components/BookingModal';

const types = ['All', 'Single', 'Double', 'Suite', 'Deluxe', 'Presidential'];

const defaultRooms = [
  { _id: '1', name: 'Standard Single', type: 'Single', price: 80, capacity: 1, description: 'Cozy room with modern amenities for solo travelers, offering views of Kigali\'s green hills. Features a comfortable single bed and a workspace area.', amenities: ['WiFi', 'TV', 'AC', 'Mini Bar'], floor: 1 },
  { _id: '2', name: 'Classic Double', type: 'Double', price: 130, capacity: 2, description: 'Spacious room with queen bed overlooking the Kigali skyline. Perfect for couples or business partners visiting Rwanda.', amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Safe'], floor: 2 },
  { _id: '3', name: 'Luxury Suite', type: 'Suite', price: 250, capacity: 2, description: 'Elegant suite with separate living area and panoramic views of Kigali\'s rolling hills, featuring premium Rwandan-inspired furnishings.', amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Safe', 'Bathtub', 'Balcony'], floor: 4 },
  { _id: '4', name: 'Deluxe Room', type: 'Deluxe', price: 180, capacity: 2, description: 'Premium room with refined decor inspired by Rwandan artistry, top-tier comfort, and modern conveniences.', amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Safe', 'Coffee Maker'], floor: 3 },
  { _id: '5', name: 'Presidential Suite', type: 'Presidential', price: 500, capacity: 4, description: 'The ultimate luxury experience with private butler service, jacuzzi, and breathtaking views across Kigali from the top floor.', amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Safe', 'Bathtub', 'Balcony', 'Jacuzzi', 'Private Pool'], floor: 5 },
];

const roomImages = {
  Single: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&q=80',
  Double: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80',
  Suite: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&q=80',
  Deluxe: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',
  Presidential: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80',
};

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRooms()
      .then((data) => { if (data?.length) setRooms(data); else setRooms(defaultRooms); })
      .catch(() => setRooms(defaultRooms))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'All' ? rooms : rooms.filter((r) => r.type === filter);

  return (
    <>
      <section className="page-hero">
        <div className="absolute inset-0 overflow-hidden">
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1600&q=80')] bg-cover bg-center animate-hero-zoom" />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-gray-300 font-semibold text-sm uppercase tracking-widest">Accommodation</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mt-3 mb-4 animate-in">
            Our <span className="text-gray-300">Rooms</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">
            Discover our range of luxurious rooms and suites in the heart of Kigali, each designed for your ultimate comfort
          </p>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
          <FaFilter className="text-gray-400 shrink-0" />
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                filter === t
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t}
            </button>
          ))}
          <span className="text-gray-400 text-sm ml-auto shrink-0">{filtered.length} room{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-56 bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((room, i) => (
              <div key={room._id} className="card group flex flex-col" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="h-56 bg-gray-200 relative overflow-hidden">
                  <img
                    src={roomImages[room.type] || roomImages.Single}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="badge bg-white/90 text-gray-800 backdrop-blur-sm">{room.type}</span>
                  </div>
                  {room.type === 'Presidential' && (
                    <div className="absolute top-4 right-4">
                      <span className="badge bg-gray-800 text-white">
                        <FaStar className="text-white text-[10px]" /> Premium
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-display text-xl font-bold text-gray-900 mb-1">{room.name}</h3>
                  <p className="text-gray-500 text-sm mb-4 leading-relaxed flex-1">{room.description}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1.5">
                      <FaUsers className="text-gray-500" /> {room.capacity} {room.capacity === 1 ? 'Guest' : 'Guests'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FaWifi className="text-gray-500" /> WiFi
                    </span>
                    <span className="flex items-center gap-1.5 text-gray-400">
                      Floor {room.floor || '-'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {room.amenities?.slice(0, 4).map((a) => (
                      <span key={a} className="badge bg-gray-100 text-gray-700 border border-gray-200">
                        <FaCheckCircle className="text-gray-500 text-[10px]" /> {a}
                      </span>
                    ))}
                    {room.amenities?.length > 4 && (
                      <span className="badge bg-gray-100 text-gray-500">+{room.amenities.length - 4}</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                    <div>
                      <span className="text-2xl font-display font-bold text-gray-900">{formatPrice(room.price)}</span>
                      <span className="text-gray-400 text-sm"> / night</span>
                    </div>
                    <button onClick={() => setSelected(room)} className="btn-primary text-sm py-2.5 px-5">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <FaBed className="text-5xl text-gray-200 mx-auto mb-4" />
            <h3 className="font-display text-xl font-bold text-gray-600 mb-2">No rooms found</h3>
            <p className="text-gray-400">Try selecting a different category</p>
          </div>
        )}
      </section>

      {selected && <BookingModal item={selected} type="Room" onClose={() => setSelected(null)} />}
    </>
  );
}
