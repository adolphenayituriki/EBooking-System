import { useState, useEffect } from 'react';
import {
  FaClock, FaArrowRight, FaFilter,
  FaSpa, FaUtensils, FaDumbbell, FaSwimmingPool, FaCar, FaTshirt,
} from 'react-icons/fa';
import { getServices } from '../services/api';
import { formatPrice } from '../utils/format';
import BookingModal from '../components/BookingModal';

const categories = [
  { value: 'All', label: 'All Services', icon: FaFilter },
  { value: 'Massage', label: 'Massage', icon: FaSpa },
  { value: 'Spa', label: 'Spa', icon: FaSpa },
  { value: 'Dining', label: 'Dining', icon: FaUtensils },
  { value: 'Fitness', label: 'Fitness', icon: FaDumbbell },
  { value: 'Swimming', label: 'Swimming', icon: FaSwimmingPool },
  { value: 'Transport', label: 'Transport', icon: FaCar },
  { value: 'Laundry', label: 'Laundry', icon: FaTshirt },
];

const categoryColors = {
  Massage: { bg: 'bg-gray-100', text: 'text-gray-700', icon: 'text-gray-500', gradient: 'from-gray-700 to-gray-900', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80' },
  Spa: { bg: 'bg-gray-100', text: 'text-gray-700', icon: 'text-gray-500', gradient: 'from-gray-700 to-gray-900', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=600&q=80' },
  Dining: { bg: 'bg-gray-100', text: 'text-gray-700', icon: 'text-gray-500', gradient: 'from-gray-700 to-gray-900', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80' },
  Fitness: { bg: 'bg-gray-100', text: 'text-gray-700', icon: 'text-gray-500', gradient: 'from-gray-700 to-gray-900', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80' },
  Swimming: { bg: 'bg-gray-100', text: 'text-gray-700', icon: 'text-gray-500', gradient: 'from-gray-700 to-gray-900', image: 'https://images.unsplash.com/photo-1576013551627-0cc20b0db2ab?w=600&q=80' },
  Transport: { bg: 'bg-gray-100', text: 'text-gray-700', icon: 'text-gray-500', gradient: 'from-gray-700 to-gray-900', image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80' },
  Laundry: { bg: 'bg-gray-100', text: 'text-gray-700', icon: 'text-gray-500', gradient: 'from-gray-700 to-gray-900', image: 'https://images.unsplash.com/photo-1545173168-9f1fcc4e6e8a?w=600&q=80' },
  Other: { bg: 'bg-gray-100', text: 'text-gray-700', icon: 'text-gray-500', gradient: 'from-gray-700 to-gray-900', image: '' },
};

const defaultServices = [
  { _id: '1', name: 'Swedish Massage', category: 'Massage', description: 'Full body relaxation massage with essential oils, inspired by Rwandan wellness traditions.', price: 60, duration: '60 min' },
  { _id: '2', name: 'Deep Tissue Massage', category: 'Massage', description: 'Therapeutic massage targeting deep muscle tension, perfect after a day exploring Kigali.', price: 80, duration: '75 min' },
  { _id: '3', name: 'Hot Stone Therapy', category: 'Massage', description: 'Heated stone massage using locally sourced volcanic stones for deep relaxation.', price: 90, duration: '90 min' },
  { _id: '4', name: 'Full Body Spa Treatment', category: 'Spa', description: 'Complete spa experience with Rwandan coffee scrub, body wrap, and rejuvenating facial.', price: 120, duration: '120 min' },
  { _id: '5', name: 'Facial Rejuvenation', category: 'Spa', description: 'Premium facial treatment using natural Rwandan ingredients for glowing skin.', price: 50, duration: '45 min' },
  { _id: '6', name: 'Fine Dining Experience', category: 'Dining', description: '5-course meal featuring Rwandan cuisine at our rooftop restaurant overlooking Kigali.', price: 75, duration: '2 hours' },
  { _id: '7', name: 'Personal Training', category: 'Fitness', description: 'One-on-one fitness session with expert trainer in our hillside-view gym.', price: 40, duration: '60 min' },
  { _id: '8', name: 'Airport Transfer', category: 'Transport', description: 'Luxury sedan pickup or drop-off at Kigali International Airport.', price: 50, duration: 'One Way' },
];

export default function Services() {
  const [services, setServices] = useState([]);
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);
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
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1600&q=80')] bg-cover bg-center animate-hero-zoom" />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-gray-300 font-semibold text-sm uppercase tracking-widest">Wellness & Lifestyle</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mt-3 mb-4 animate-in">
            Our <span className="text-gray-300">Services</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">
            Indulge in our premium services blending modern luxury with Rwandan wellness traditions
          </p>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-2 mb-10 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                filter === value
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon className="text-xs" /> {label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-44 bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-5 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((svc, i) => {
              const colors = categoryColors[svc.category] || categoryColors.Other;
              return (
                <div key={svc._id} className="card group flex flex-col" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="h-44 bg-gray-200 relative overflow-hidden">
                    {colors.image && (
                      <img
                        src={colors.image}
                        alt={svc.category}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                    )}
                    <div className={`absolute inset-0 bg-gradient-to-t ${colors.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                    <div className="absolute top-4 left-4">
                      <span className="badge bg-gray-100 text-gray-700">
                        {svc.category}
                      </span>
                    </div>
                    {svc.duration && (
                      <div className="absolute top-4 right-4">
                        <span className="badge bg-gray-800 text-white">
                          <FaClock className="text-[10px]" /> {svc.duration}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-display text-lg font-bold text-gray-900 mb-2">{svc.name}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed flex-1">{svc.description}</p>

                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                      <div>
                        <span className="text-2xl font-display font-bold text-gray-900">{formatPrice(svc.price)}</span>
                      </div>
                      <button
                        onClick={() => setSelected(svc)}
                        className="flex items-center gap-1.5 bg-gray-900 hover:bg-black text-white font-semibold text-sm py-2.5 px-5 rounded-xl transition-all"
                      >
                        Book Now
                        <FaArrowRight className="text-xs group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FaSpa className="text-2xl text-gray-400" />
            </div>
            <h3 className="font-display text-xl font-bold text-gray-600 mb-2">No services found</h3>
            <p className="text-gray-400">Try selecting a different category</p>
          </div>
        )}
      </section>

      {selected && <BookingModal item={selected} type="Service" onClose={() => setSelected(null)} />}
    </>
  );
}
