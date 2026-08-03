import { useState, useEffect } from 'react';
import { FaBed, FaUsers, FaStar, FaFilter } from 'react-icons/fa';
import { getRooms } from '../services/api';
import { formatPrice } from '../utils/format';
import BookingModal from '../components/BookingModal';
import Spinner from '../components/Spinner';
import ItemModal from '../components/ItemModal';

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
  const [preview, setPreview] = useState(null);
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
          <span className="text-gray-300 font-semibold text-xs uppercase tracking-widest">Accommodation</span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mt-2 mb-2 animate-in">
            Our <span className="text-gray-300">Rooms</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-sm">
            Discover our range of luxurious rooms and suites in the heart of Kigali, each designed for your ultimate comfort
          </p>
        </div>
      </section>

      <section className="py-10 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <FaFilter className="text-gray-400 shrink-0" />
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  filter === t
                    ? 'bg-white text-black shadow-md'
                    : 'bg-gray-900 border border-gray-800 text-gray-400 hover:bg-gray-800 hover:border-gray-700'
                }`}
            >
              {t}
            </button>
          ))}
          <span className="text-gray-400 text-sm ml-auto shrink-0">{filtered.length} room{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <Spinner size="text-2xl" label="Loading rooms..." />
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((room, i) => (
              <div key={room._id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-0.5 hover:border-gray-700 group transition-all duration-300 flex flex-col" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="h-40 bg-gray-800 relative overflow-hidden cursor-pointer group" onClick={() => setPreview(room)}>
                  <img
                    src={roomImages[room.type] || roomImages.Single}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 relative"
                    loading="lazy"
                  />
                  <Spinner className="absolute inset-0" size="text-xl" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="bg-gray-900/80 text-gray-200 text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-sm">{room.type}</span>
                  </div>
                  {room.type === 'Presidential' && (
                    <div className="absolute top-2.5 right-2.5">
                      <span className="flex items-center gap-1 bg-black/70 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                        <FaStar className="text-amber-400 text-[10px]" /> Premium
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-display text-base font-bold text-white mb-1 leading-tight">{room.name}</h3>
                  <p className="text-gray-400 text-[13px] mb-2.5 leading-relaxed flex-1">{room.description}</p>

                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-2.5">
                    <span className="flex items-center gap-1">
                      <FaUsers className="text-gray-400 text-[11px]" /> {room.capacity} {room.capacity === 1 ? 'Guest' : 'Guests'}
                    </span>
                    <span className="flex items-center gap-1 text-gray-400">
                      Floor {room.floor || '-'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {room.amenities?.slice(0, 4).map((a) => (
                      <span key={a} className="text-[10px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded-md border border-gray-700">{a}</span>
                    ))}
                    {room.amenities?.length > 4 && (
                      <span className="text-[10px] bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded-md border border-gray-700">+{room.amenities.length - 4}</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-gray-800 mt-auto">
                    <div>
                      <span className="text-lg font-display font-bold text-white">{formatPrice(room.price)}</span>
                      <span className="text-gray-500 text-xs"> / night</span>
                    </div>
                    <button onClick={() => setSelected(room)} className="bg-white hover:bg-gray-200 text-black text-xs font-semibold px-3.5 py-2 rounded-xl transition-all hover:-translate-y-0.5">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-10">
            <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-3">
              <FaBed className="text-xl text-gray-400" />
            </div>
            <h3 className="font-display text-lg font-bold text-gray-300 mb-1">No rooms found</h3>
            <p className="text-gray-400 text-sm">Try selecting a different category</p>
          </div>
        )}
        </div>
      </section>

      {selected && <BookingModal item={selected} type="Room" onClose={() => setSelected(null)} />}

      {preview && (
        <ItemModal
          item={preview}
          image={roomImages[preview.type] || roomImages.Single}
          meta={`${preview.type} · Floor ${preview.floor || '-'}`}
          chips={preview.amenities || []}
          priceSuffix="/ night"
          onClose={() => setPreview(null)}
          onBook={() => { setSelected(preview); setPreview(null); }}
        />
      )}
    </>
  );
}
