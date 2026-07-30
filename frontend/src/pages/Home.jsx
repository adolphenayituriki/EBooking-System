import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaUtensils, FaWater, FaDumbbell, FaBed, FaSwimmingPool, FaStar, FaArrowRight, FaWifi, FaConciergeBell, FaCar, FaChevronLeft, FaChevronRight, FaShieldAlt, FaHeadset, FaGem, FaArrowUp, FaPercent, FaCalendarAlt, FaUserFriends, FaCheck, FaSpa, FaHotel, FaMapMarkerAlt, FaQuoteLeft, FaPhoneAlt, FaEnvelope, FaClock, FaStarHalfAlt, FaRegCalendarCheck, FaAward, FaHandshake, FaImages, FaTimes } from 'react-icons/fa';
import { getRooms } from '../services/api';
import { formatPrice } from '../utils/format';
import BookingModal from '../components/BookingModal';

const summaries = [
  {
    to: '/rooms',
    icon: FaBed,
    title: 'Rooms',
    desc: 'Standard, Deluxe, Suites & Presidential. 45 rooms across 5 categories.',
    items: ['Free WiFi', 'Air Conditioning', 'Mini Bar', 'Room Service'],
  },
  {
    to: '/services',
    icon: FaSpa,
    title: 'Services',
    desc: 'Spa, fine dining, gym, pool & 24/7 concierge.',
    items: ['Spa & Massage', 'Fine Dining', 'Fitness Center', 'Infinity Pool'],
  },
  {
    to: '/halls',
    icon: FaUsers,
    title: 'Event Halls',
    desc: 'Weddings, conferences & private events for up to 500 guests.',
    items: ['Full Catering', 'AV Equipment', 'On-site Parking', 'Event Staff'],
  },
];

const trustStats = [
  { icon: FaStar, value: '4.9', label: 'Rating', sub: 'Based on 1,240+ reviews' },
  { icon: FaUsers, value: '15K+', label: 'Happy Guests', sub: 'Served since 2018' },
  { icon: FaHotel, value: '45', label: 'Luxury Rooms', sub: 'Across 5 categories' },
  { icon: FaAward, value: '12', label: 'Years of Excellence', sub: 'Award-winning service' },
];

const perks = [
  { icon: FaShieldAlt, text: 'Best Price Guarantee' },
  { icon: FaHeadset, text: '24/7 Support' },
  { icon: FaGem, text: 'Premium Experience' },
  { icon: FaCheck, text: 'Instant Confirmation' },
];

const testimonials = [
  { name: 'Grace Uwimana', role: 'Business Traveler', text: 'Absolutely stunning hotel. The service is world-class and the rooms are impeccable.', rating: 5 },
  { name: 'James Mukasa', role: 'Event Planner', text: 'We hosted our wedding at Golden Garden and it was magical. The staff went above and beyond.', rating: 5 },
  { name: 'Sarah Niyonzima', role: 'Vacation Guest', text: 'The spa experience was heavenly. Best massage I have ever had.', rating: 5 },
  { name: 'David Mugisha', role: 'Corporate Client', text: 'The conference facilities are top-notch. Our international guests were impressed.', rating: 5 },
];

const defaultRooms = [
  { _id: '1', name: 'Standard Single', type: 'Single', price: 80, capacity: 1, description: 'Cozy room with modern amenities for solo travelers, offering views of Kigali\'s green hills.', amenities: ['WiFi', 'TV', 'AC', 'Mini Bar'], floor: 1 },
  { _id: '2', name: 'Classic Double', type: 'Double', price: 130, capacity: 2, description: 'Spacious room with queen bed overlooking the Kigali skyline. Ideal for couples or colleagues.', amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Safe'], floor: 2 },
  { _id: '3', name: 'Luxury Suite', type: 'Suite', price: 250, capacity: 2, description: 'Elegant suite with separate living area and panoramic views of Kigali\'s rolling hills.', amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Safe', 'Bathtub', 'Balcony'], floor: 4 },
  { _id: '4', name: 'Deluxe Room', type: 'Deluxe', price: 180, capacity: 2, description: 'Premium room with refined decor inspired by Rwandan artistry and modern comfort.', amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Safe', 'Coffee Maker'], floor: 3 },
  { _id: '5', name: 'Presidential Suite', type: 'Presidential', price: 500, capacity: 4, description: 'The ultimate luxury with private butler service, jacuzzi, and breathtaking views across Kigali.', amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Safe', 'Bathtub', 'Balcony', 'Jacuzzi', 'Private Pool'], floor: 5 },
];

const roomImages = [
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&q=80',
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80',
  'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&q=80',
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80',
];

const galleryImages = [
  { src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80', category: 'Rooms' },
  { src: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80', category: 'Pool' },
  { src: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600&q=80', category: 'Dining' },
  { src: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80', category: 'Spa' },
  { src: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&q=80', category: 'Exterior' },
  { src: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&q=80', category: 'Events' },
];

const galleryCategories = ['All', 'Rooms', 'Pool', 'Dining', 'Spa', 'Exterior', 'Events'];

function AnimatedCounter({ value }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const match = value.match(/^([\d.]+)(.*)$/);
  const target = match ? parseFloat(match[1]) : 0;
  const suffix = match ? match[2] : '';

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) { setCount(target); clearInterval(timer); }
          else setCount(current);
        }, 20);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  const display = target % 1 === 0 ? Math.round(count) : count.toFixed(1);
  return <span ref={ref}>{display}{suffix}</span>;
}

export default function Home() {
  const [rooms, setRooms] = useState([]);
  const scrollRef = useRef(null);
  const testimonialScrollRef = useRef(null);
  const roomsRef = useRef(null);
  const [scrollPos, setScrollPos] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [testimonialScrollPos, setTestimonialScrollPos] = useState(0);
  const [testimonialMaxScroll, setTestimonialMaxScroll] = useState(0);
  const [showBackTop, setShowBackTop] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingRoom, setBookingRoom] = useState(null);
  const [galleryFilter, setGalleryFilter] = useState('All');
  const [search, setSearch] = useState({ checkIn: '', checkOut: '', guests: '1' });

  const handleSearch = () => {
    roomsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    getRooms()
      .then((data) => { if (data?.length) setRooms(data); else setRooms(defaultRooms); })
      .catch(() => setRooms(defaultRooms));
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => { setScrollPos(el.scrollLeft); setMaxScroll(el.scrollWidth - el.clientWidth); };
    update();
    el.addEventListener('scroll', update);
    window.addEventListener('resize', update);
    return () => { el.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, [rooms]);

  useEffect(() => {
    const el = testimonialScrollRef.current;
    if (!el) return;
    const update = () => { setTestimonialScrollPos(el.scrollLeft); setTestimonialMaxScroll(el.scrollWidth - el.clientWidth); };
    update();
    el.addEventListener('scroll', update);
    window.addEventListener('resize', update);
    return () => { el.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);

  useEffect(() => {
    const onScroll = () => setShowBackTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 340, behavior: 'smooth' });
  };

  const scrollTestimonial = (dir) => {
    testimonialScrollRef.current?.scrollBy({ left: dir * 340, behavior: 'smooth' });
  };

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden -mt-[124px] pt-[124px]">
        <div className="absolute inset-0">
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80')] bg-cover bg-center animate-hero-zoom" />
          <div className="absolute inset-0 bg-black" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 pb-16 pt-0 w-full">
          <div className="grid lg:grid-cols-5 gap-10 items-center">
            <div className="lg:col-span-3 animate-in">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[56px] font-display font-bold text-white leading-[1.15] mb-4">
                Akarabo Hotel & Spa
              </h1>
              <p className="text-sm sm:text-base text-gray-300 max-w-lg mb-8 leading-relaxed">
                Kigali, Rwanda
              </p>
              <div className="flex flex-wrap gap-4 mb-10">
                <Link to="/rooms" className="inline-flex items-center gap-2 bg-white text-black font-semibold px-7 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm whitespace-nowrap">
                  Book Your Stay <FaArrowRight className="text-[10px]" />
                </Link>
                <Link to="/contact" className="inline-flex items-center gap-2 border-2 border-gray-600 text-white hover:bg-gray-800 font-semibold px-7 py-3 rounded-xl transition-all text-sm">
                  Contact
                </Link>
              </div>
              <div className="flex flex-wrap gap-x-7 gap-y-2 text-gray-400 text-xs">
                {perks.map(({ icon: Icon, text }) => (
                  <span key={text} className="flex items-center gap-1.5">
                    <Icon className="text-gray-400 text-[10px]" />
                    {text}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick booking widget - glass effect */}
            <div className="lg:col-span-2 hidden lg:block animate-in-delay-2">
              <div className="bg-gray-900 rounded-3xl p-7 border border-gray-700 shadow-2xl">
                <h3 className="text-white font-display font-semibold text-base mb-5">Check Availability</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-400 text-xs font-medium block mb-1.5">Check-in</label>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
                      <input type="date" value={search.checkIn} onChange={(e) => setSearch(s => ({ ...s, checkIn: e.target.value }))} className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 pl-10 pr-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-all [color-scheme:dark]" />
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs font-medium block mb-1.5">Check-out</label>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
                      <input type="date" value={search.checkOut} onChange={(e) => setSearch(s => ({ ...s, checkOut: e.target.value }))} min={search.checkIn || undefined} className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 pl-10 pr-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-all [color-scheme:dark]" />
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs font-medium block mb-1.5">Guests</label>
                    <div className="relative">
                      <FaUserFriends className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
                      <select value={search.guests} onChange={(e) => setSearch(s => ({ ...s, guests: e.target.value }))} className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 pl-10 pr-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-all appearance-none">
                        <option className="text-gray-800" value="1">1 Guest</option>
                        <option className="text-gray-800" value="2">2 Guests</option>
                        <option className="text-gray-800" value="3">3 Guests</option>
                        <option className="text-gray-800" value="4">4+ Guests</option>
                      </select>
                    </div>
                  </div>
                  <button onClick={handleSearch} className="block w-full bg-white text-black text-center font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 text-sm">
                    Search Rooms
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promo bar */}
      <section className="bg-black py-3 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-2.5 text-sm text-gray-300">
          <span>Book <strong className="text-white">7 days</strong> ahead & save</span>
          <span className="bg-gray-800 text-gray-300 font-bold px-2.5 py-0.5 rounded-md text-xs">20% OFF</span>
          <button onClick={() => roomsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="text-white font-semibold hover:text-gray-300 underline underline-offset-2 ml-1 transition-colors">
            Book Now →
          </button>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-gray-600 text-xs font-medium uppercase tracking-[0.2em]">Our Numbers</span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {trustStats.map(({ icon: Icon, value, label, sub }, i) => (
              <div key={label} className="relative bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-5 text-center hover:bg-gray-800 hover:border-gray-700 transition-all duration-500 group">
                <div className="w-8 h-8 mx-auto mb-3 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center group-hover:bg-gray-700 transition-colors duration-300">
                  <Icon className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300" />
                </div>
                <p className="text-2xl lg:text-3xl font-display font-bold text-white mb-0.5 tracking-tight"><AnimatedCounter value={value} /></p>
                <p className="text-gray-400 text-xs sm:text-sm font-semibold">{label}</p>
                <div className="w-6 h-px bg-gray-800 mx-auto my-2" />
                <p className="text-gray-600 text-[11px]">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rooms / Services / Halls summary */}
      <section className="py-10 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-5">
            {summaries.map(({ to, icon: Icon, title, desc, items }) => (
              <Link
                key={title}
                to={to}
                className="group bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:bg-gray-800 transition-all duration-300"
              >
                <Icon className="text-xl text-gray-400 mb-3 group-hover:text-white transition-colors duration-300" />
                <h3 className="text-lg font-display font-bold text-white mb-1.5">{title}</h3>
                <p className="text-gray-400 text-sm mb-3 leading-relaxed">{desc}</p>
                <ul className="space-y-1.5 mb-4">
                  {items.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-gray-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-600 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-gray-300 group-hover:text-white transition-colors group-hover:gap-3">
                  View All <FaArrowRight className="text-[11px]" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Rooms */}
      <section ref={roomsRef} className="py-10 overflow-hidden bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white">Rooms</h2>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <button onClick={() => scroll(-1)} disabled={scrollPos <= 0} className="w-9 h-9 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:bg-gray-800 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed" aria-label="Scroll left">
                <FaChevronLeft className="text-[10px]" />
              </button>
              <button onClick={() => scroll(1)} disabled={scrollPos >= maxScroll - 1} className="w-9 h-9 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:bg-gray-800 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed" aria-label="Scroll right">
                <FaChevronRight className="text-[10px]" />
              </button>
            </div>
          </div>
        </div>

        <div ref={scrollRef} className="flex gap-5 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-2 scroll-smooth scrollbar-hide">
          {rooms.map((room, i) => (
            <div key={room._id} className="min-w-[270px] sm:min-w-[310px] bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shrink-0 hover:bg-gray-800 transition-all duration-300 group">
              <button onClick={() => setSelectedRoom(room)} className="w-full h-44 bg-gray-800 relative overflow-hidden cursor-pointer text-left">
                <img src={roomImages[i % roomImages.length]} alt={room.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 bg-gray-800 text-gray-200 text-[10px] font-semibold px-2 py-0.5 rounded-md">{room.type}</span>
                <span className="absolute bottom-3 right-3 bg-gray-800 text-gray-300 text-[10px] font-medium px-2 py-0.5 rounded-md">Floor {room.floor || '-'}</span>
              </button>
              <div className="p-4">
                <h3 className="font-display font-bold text-white text-sm mb-1">{room.name}</h3>
                <p className="text-gray-400 text-[11px] mb-3 line-clamp-2 leading-relaxed">{room.description}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {room.amenities?.slice(0, 3).map((a) => (
                    <span key={a} className="text-[9px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded border border-gray-700">{a}</span>
                  ))}
                  {room.amenities?.length > 3 && <span className="text-[9px] text-gray-500">+{room.amenities.length - 3}</span>}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                  <div>
                    <span className="text-base font-display font-bold text-white">{formatPrice(room.price)}</span>
                    <span className="text-gray-500 text-[10px]">/night</span>
                  </div>
                  <Link to="/rooms" className="text-[11px] font-semibold text-gray-300 hover:text-white transition-colors">Book Now &rarr;</Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/rooms" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors group">
            View All Rooms <FaArrowRight className="text-[10px] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Amenities */}
      <section className="py-8 bg-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
            {[
              { icon: FaWifi, label: 'Free WiFi' },
              { icon: FaConciergeBell, label: '24/7 Concierge' },
              { icon: FaCar, label: 'Free Parking' },
              { icon: FaSwimmingPool, label: 'Pool Access' },
              { icon: FaDumbbell, label: 'Gym Access' },
              { icon: FaUtensils, label: 'Breakfast Included' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5 text-gray-400">
                <Icon className="text-gray-500 text-sm" />
                <span className="text-xs font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-10 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white">Gallery</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {galleryCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setGalleryFilter(cat)}
                className={`text-xs font-semibold px-4 py-1.5 rounded-lg transition-all ${galleryFilter === cat ? 'bg-white text-black' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {galleryImages.filter((img) => galleryFilter === 'All' || img.category === galleryFilter).map((img, i) => (
              <div key={i} className={`relative overflow-hidden rounded-xl group cursor-pointer ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
                <img src={img.src} alt={`Akarabo Hotel ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 min-h-[160px]" loading="lazy" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors group">
              <FaImages className="text-xs" /> View Full Gallery <FaArrowRight className="text-[10px] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-10 bg-black overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white">Testimonials</h2>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <button onClick={() => scrollTestimonial(-1)} disabled={testimonialScrollPos <= 0} className="w-9 h-9 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:bg-gray-800 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed" aria-label="Previous testimonial">
                <FaChevronLeft className="text-[10px]" />
              </button>
              <button onClick={() => scrollTestimonial(1)} disabled={testimonialScrollPos >= testimonialMaxScroll - 1} className="w-9 h-9 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:bg-gray-800 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed" aria-label="Next testimonial">
                <FaChevronRight className="text-[10px]" />
              </button>
            </div>
          </div>
        </div>

        <div ref={testimonialScrollRef} className="flex gap-4 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-2 scroll-smooth scrollbar-hide">
          {testimonials.map(({ name, role, text, rating }) => (
            <div key={name} className="min-w-[280px] sm:min-w-[320px] bg-gray-900 border border-gray-800 rounded-xl p-5 shrink-0 hover:bg-gray-800 transition-all duration-300">
              <div className="flex gap-0.5 mb-3">
                {[...Array(rating)].map((_, j) => <FaStar key={j} className="text-gray-400 text-[11px]" />)}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-4 italic line-clamp-3">&ldquo;{text}&rdquo;</p>
              <div className="flex items-center gap-3 pt-3 border-t border-gray-800">
                <div className="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0">
                  {name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{name}</p>
                  <p className="text-gray-500 text-xs">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA + Newsletter */}
      <section className="py-10 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1549638441-b787d2e11f14?w=1600&q=80')] bg-cover bg-center opacity-5" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-8 items-center">
            <div className="md:col-span-3">
              <h2 className="text-xl md:text-2xl font-display font-bold text-white mt-2 mb-2 leading-tight">
                Book Your Stay at Akarabo Hotel
              </h2>
              <p className="text-gray-400 text-sm mb-4 max-w-md">Book now and enjoy exclusive rates.</p>
              <div className="flex flex-wrap gap-3">
                <Link to="/rooms" className="inline-flex items-center gap-2 bg-white text-black font-semibold px-5 py-2.5 rounded-xl transition-all hover:bg-gray-200 hover:-translate-y-0.5 text-sm shadow-lg">
                  Book Your Stay <FaArrowRight className="text-[10px]" />
                </Link>
                <Link to="/contact" className="inline-flex items-center gap-2 border-2 border-gray-700 text-white hover:bg-gray-800 font-semibold px-5 py-2.5 rounded-xl transition-all text-sm">
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Newsletter */}
            <div className="md:col-span-2 bg-gray-900 rounded-2xl border border-gray-800 p-5">
              <h3 className="text-white font-display font-semibold text-sm mb-1">Stay Updated</h3>
              <p className="text-gray-400 text-xs mb-3">Get exclusive offers straight to your inbox.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="your@email.com" className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600" />
                <button className="bg-white text-black hover:bg-gray-200 font-semibold px-3.5 py-2.5 rounded-xl transition-all text-sm whitespace-nowrap">Subscribe</button>
              </div>
              <p className="text-gray-600 text-[10px] mt-2">No spam. Unsubscribe anytime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Room detail modal */}
      {selectedRoom && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={() => setSelectedRoom(null)}>
          <div className="absolute inset-0 bg-black/90" />
          <div className="relative bg-gray-900 border border-gray-700 rounded-2xl max-w-md w-full shadow-2xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedRoom(null)} className="absolute top-3 right-3 z-10 w-7 h-7 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors">
              <FaTimes className="text-[10px]" />
            </button>
            <div className="flex gap-0">
              <div className="w-28 sm:w-32 h-28 sm:h-32 shrink-0">
                <img src={roomImages[rooms.indexOf(selectedRoom) % roomImages.length]} alt={selectedRoom.name} className="w-full h-full object-cover rounded-l-2xl" />
              </div>
              <div className="flex-1 p-3.5">
                <div className="flex items-start justify-between mb-1.5">
                  <div>
                    <h3 className="font-display font-bold text-white text-sm leading-tight">{selectedRoom.name}</h3>
                    <p className="text-gray-500 text-[10px] mt-0.5">{selectedRoom.type} &middot; Floor {selectedRoom.floor || '-'}</p>
                  </div>
                  <span className="text-xs font-display font-bold text-white whitespace-nowrap ml-2">{formatPrice(selectedRoom.price)}<span className="text-gray-600 text-[9px] font-normal">/nt</span></span>
                </div>
                <p className="text-gray-400 text-[11px] leading-relaxed line-clamp-2 mb-2.5">{selectedRoom.description}</p>
                <div className="flex flex-wrap gap-1 mb-2.5">
                  {selectedRoom.amenities?.slice(0, 3).map((a) => (
                    <span key={a} className="text-[9px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded border border-gray-700">{a}</span>
                  ))}
                  {selectedRoom.amenities?.length > 3 && <span className="text-[9px] text-gray-500">+{selectedRoom.amenities.length - 3}</span>}
                </div>
                <button onClick={() => { setBookingRoom(selectedRoom); setSelectedRoom(null); }} className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-white bg-black px-3 py-1.5 rounded-lg transition-all">
                  Book Now &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {bookingRoom && <BookingModal item={bookingRoom} type="Room" onClose={() => setBookingRoom(null)} />}

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-6 right-6 z-40 w-10 h-10 bg-gray-800 hover:bg-gray-700 text-white rounded-xl border border-gray-700 flex items-center justify-center transition-all duration-300 hover:-translate-y-1 ${
          showBackTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        aria-label="Back to top"
      >
        <FaArrowUp className="text-sm" />
      </button>
    </>
  );
}
