import { useState, useEffect } from 'react';
import {
  FaClock, FaArrowRight, FaFilter,
  FaSpa, FaUtensils, FaDumbbell, FaSwimmingPool,
} from 'react-icons/fa';
import { getServices } from '../services/api';
import { formatPrice } from '../utils/format';
import BookingModal from '../components/BookingModal';
import Spinner from '../components/Spinner';
import ItemModal from '../components/ItemModal';

const categories = [
  { value: 'All', label: 'All Services', icon: FaFilter },
  { value: 'Massage', label: 'Massage', icon: FaSpa },
  { value: 'Spa', label: 'Spa', icon: FaSpa },
  { value: 'Dining', label: 'Dining', icon: FaUtensils },
  { value: 'Fitness', label: 'Fitness', icon: FaDumbbell },
  { value: 'Swimming', label: 'Swimming', icon: FaSwimmingPool },
];

const categoryColors = {
  Massage: { bg: 'bg-gray-100', text: 'text-gray-700', icon: 'text-gray-500', gradient: 'from-gray-700 to-gray-900', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80' },
  Spa: { bg: 'bg-gray-100', text: 'text-gray-700', icon: 'text-gray-500', gradient: 'from-gray-700 to-gray-900', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=600&q=80' },
  Dining: { bg: 'bg-gray-100', text: 'text-gray-700', icon: 'text-gray-500', gradient: 'from-gray-700 to-gray-900', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80' },
  Fitness: { bg: 'bg-gray-100', text: 'text-gray-700', icon: 'text-gray-500', gradient: 'from-gray-700 to-gray-900', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80' },
  Swimming: { bg: 'bg-gray-100', text: 'text-gray-700', icon: 'text-gray-500', gradient: 'from-gray-700 to-gray-900', image: 'https://images.unsplash.com/photo-1598605272254-16f0c0ecdfa5?w=600&q=80' },
  Other: { bg: 'bg-gray-100', text: 'text-gray-700', icon: 'text-gray-500', gradient: 'from-gray-700 to-gray-900', image: '' },
};

const defaultServices = [
  { _id: '1', name: 'Swedish Massage', category: 'Massage', description: 'Full body relaxation massage with essential oils, inspired by Rwandan wellness traditions.', price: 60, duration: '60 min', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80' },
  { _id: '2', name: 'Deep Tissue Massage', category: 'Massage', description: 'Therapeutic massage targeting deep muscle tension, perfect after a day exploring Kigali.', price: 80, duration: '75 min', image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600&q=80' },
  { _id: '3', name: 'Hot Stone Therapy', category: 'Massage', description: 'Heated stone massage using locally sourced volcanic stones for deep relaxation.', price: 90, duration: '90 min', image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&q=80' },
  { _id: '4', name: 'Full Body Spa Treatment', category: 'Spa', description: 'Complete spa experience with Rwandan coffee scrub, body wrap, and rejuvenating facial.', price: 120, duration: '120 min', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=600&q=80' },
  { _id: '5', name: 'Facial Rejuvenation', category: 'Spa', description: 'Premium facial treatment using natural Rwandan ingredients for glowing skin.', price: 50, duration: '45 min', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80' },
  { _id: '6', name: 'Fine Dining Experience', category: 'Dining', description: '5-course meal featuring Rwandan cuisine at our rooftop restaurant overlooking Kigali.', price: 75, duration: '2 hours', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80' },
  { _id: '7', name: 'Personal Training', category: 'Fitness', description: 'One-on-one fitness session with an expert trainer in our hillside-view gym.', price: 40, duration: '60 min', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80' },
  { _id: '8', name: 'Pool Access', category: 'Swimming', description: 'Full day access to our infinity pool overlooking the Kigali hills.', price: 15, duration: 'Full Day', image: 'https://images.unsplash.com/photo-1598605272254-16f0c0ecdfa5?w=600&q=80' },
];

export default function Services() {
  const [services, setServices] = useState([]);
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServices()
      .then((data) => { if (data?.length) setServices(data); else setServices(defaultServices); })
      .catch(() => setServices(defaultServices))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'All' ? services : services.filter((s) => s.category === filter);

  return (
    <>
      <section className="page-hero">
        <div className="absolute inset-0 overflow-hidden">
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1687986261123-b17f08f2796c?w=1600&q=80')] bg-cover bg-center animate-hero-zoom" />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-gray-300 font-semibold text-xs uppercase tracking-widest">Wellness & Lifestyle</span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mt-2 mb-2 animate-in">
            Our <span className="text-gray-300">Services</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-sm">
            Indulge in our premium services blending modern luxury with Rwandan wellness traditions
          </p>
        </div>
      </section>

      <section className="py-10 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(({ value, label, icon: Icon }) => (
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
            <Spinner size="text-2xl" label="Loading services..." />
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((svc, i) => {
              const colors = categoryColors[svc.category] || categoryColors.Other;
              return (
                <div key={svc._id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-0.5 hover:border-gray-700 group transition-all duration-300 flex flex-col" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="h-36 bg-gray-800 relative overflow-hidden cursor-pointer group" onClick={() => setPreview(svc)}>
                    {(svc.image || colors.image) && (
                      <img
                        src={svc.image || colors.image}
                        alt={svc.category}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 relative"
                        loading="lazy"
                      />
                    )}
                    {(svc.image || colors.image) && <Spinner className="absolute inset-0" size="text-lg" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="bg-gray-900/80 text-gray-200 text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-sm">
                        {svc.category}
                      </span>
                    </div>
                    {svc.duration && (
                      <div className="absolute top-3 right-3">
                        <span className="flex items-center gap-1 bg-black/70 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                          <FaClock className="text-gray-300 text-[10px]" /> {svc.duration}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-display text-base font-bold text-white mb-1.5">{svc.name}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed flex-1">{svc.description}</p>

                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-800">
                      <div>
                        <span className="text-lg font-display font-bold text-white">{formatPrice(svc.price)}</span>
                      </div>
                      <button
                        onClick={() => setSelected(svc)}
                        className="bg-white hover:bg-gray-200 text-black text-sm font-semibold px-4 py-2 rounded-xl transition-all hover:-translate-y-0.5 inline-flex items-center gap-1.5"
                      >
                        Book Now
                        <FaArrowRight className="text-xs" />
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
              <FaSpa className="text-xl text-gray-400" />
            </div>
            <h3 className="font-display text-lg font-bold text-gray-300 mb-1">No services found</h3>
            <p className="text-gray-400 text-sm">Try selecting a different category</p>
          </div>
        )}
        </div>
      </section>

      {selected && <BookingModal item={selected} type="Service" onClose={() => setSelected(null)} />}

      {preview && (
        <ItemModal
          item={preview}
          image={preview.image || (categoryColors[preview.category] || categoryColors.Other).image}
          meta={`${preview.category}${preview.duration ? ` · ${preview.duration}` : ''}`}
          chips={preview.duration ? [preview.duration] : []}
          onClose={() => setPreview(null)}
          onBook={() => { setSelected(preview); setPreview(null); }}
        />
      )}
    </>
  );
}
