import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaUtensils, FaWater, FaDumbbell, FaBed, FaSwimmingPool, FaStar, FaArrowRight, FaWifi, FaConciergeBell, FaCar, FaChevronLeft, FaChevronRight, FaShieldAlt, FaHeadset, FaGem, FaArrowUp, FaPercent, FaCalendarAlt, FaUserFriends, FaCheck, FaSpa, FaHotel, FaMapMarkerAlt, FaQuoteLeft, FaPhoneAlt, FaEnvelope, FaClock, FaStarHalfAlt, FaRegCalendarCheck, FaAward, FaHandshake, FaImages, FaTimes, FaChevronDown, FaSpinner } from 'react-icons/fa';
import { getRooms, getRoomAvailability } from '../services/api';
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

const heroSlides = [
  'https://images.unsplash.com/photo-1687986261123-b17f08f2796c?w=1600&q=80',
  'https://images.unsplash.com/photo-1682773083912-ff5ee5fa557b?w=1600&q=80',
  'https://images.unsplash.com/photo-1605559911928-e03606ea0dc0?w=1600&q=80',
  'https://images.unsplash.com/photo-1722291731448-3afe029611a6?w=1600&q=80',
  'https://images.unsplash.com/photo-1758592112679-d73165845e06?w=1600&q=80',
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
  const [searchResults, setSearchResults] = useState(null);
  const [searchMeta, setSearchMeta] = useState({ searched: false, loading: false, error: '', checkIn: '', checkOut: '', guests: '1' });
  const [bookingPrefill, setBookingPrefill] = useState(null);
  const [bgIndex, setBgIndex] = useState(0);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [galleryVisible, setGalleryVisible] = useState(3);
  const resultsRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setBgIndex((i) => (i + 1) % heroSlides.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const filteredGallery = galleryImages.filter((img) => galleryFilter === 'All' || img.category === galleryFilter);
  const galleryCount = filteredGallery.length;
  const galleryMax = Math.max(0, galleryCount - galleryVisible);
  const currentGallery = Math.min(galleryIndex, galleryMax);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setGalleryVisible(w < 640 ? 1 : w < 1024 ? 2 : 3);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    setGalleryIndex(0);
  }, [galleryFilter]);

  useEffect(() => {
    if (galleryCount <= galleryVisible) return;
    const timer = setInterval(() => {
      setGalleryIndex((i) => (i >= galleryMax ? 0 : i + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [galleryCount, galleryVisible, galleryMax]);

  const galleryPrev = () => setGalleryIndex((i) => (i <= 0 ? galleryMax : i - 1));
  const galleryNext = () => setGalleryIndex((i) => (i >= galleryMax ? 0 : i + 1));

  const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const handleSearch = async () => {
    const { checkIn, checkOut, guests } = search;
    const invalid = !checkIn || !checkOut
      ? 'Please select both check-in and check-out dates.'
      : new Date(checkOut) <= new Date(checkIn)
        ? 'Check-out must be after check-in.'
        : '';
    if (invalid) {
      setSearchResults(null);
      setSearchMeta({ searched: true, loading: false, error: invalid, checkIn, checkOut, guests });
      return;
    }
    setSearchMeta({ searched: true, loading: true, error: '', checkIn, checkOut, guests });
    try {
      const available = await getRoomAvailability({ checkIn, checkOut, guests });
      setSearchResults(available?.length ? available : []);
    } catch {
      const available = rooms.filter((r) => Number(r.capacity) >= Number(guests));
      setSearchResults(available);
    } finally {
      setSearchMeta((m) => ({ ...m, loading: false }));
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  };

  const clearSearch = () => {
    setSearch({ checkIn: '', checkOut: '', guests: '1' });
    setSearchResults(null);
    setSearchMeta((m) => ({ ...m, searched: false, error: '' }));
  };

  const nights = searchMeta.checkIn && searchMeta.checkOut
    ? Math.max(1, Math.ceil((new Date(searchMeta.checkOut) - new Date(searchMeta.checkIn)) / 86400000))
    : 1;

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
      <section className="relative min-h-[85vh] flex items-center overflow-hidden -mt-[104px] pt-[104px] md:-mt-[140px] md:pt-[140px]">
        <div className="absolute inset-0">
          {heroSlides.map((src, i) => (
            <div
              key={src}
              className={`absolute inset-0 bg-gray-900 bg-cover bg-center animate-hero-zoom transition-opacity duration-[2000ms] ease-in-out ${i === bgIndex ? 'opacity-100' : 'opacity-0'}`}
              style={{ backgroundImage: `url('${src}')` }}
            />
          ))}
          <div className="absolute inset-0 bg-black/60" />
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
                <Link to="/contact" className="inline-flex items-center gap-2 border-2 border-gray-600 text-white hover:bg-gray-800 font-semibold px-7 py-3 rounded-xl transition-all text-sm hover:-translate-y-0.5">
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
            <div className="lg:col-span-2 animate-in-delay-2">
              <div className="bg-gray-900 rounded-3xl p-7 border border-gray-700 shadow-2xl">
                <h3 className="text-white font-display font-semibold text-base mb-5">Check Availability</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-gray-400 text-xs font-medium block mb-1.5">Check-in</label>
                    <div className="relative">
                      <FaCalendarAlt className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
                      <input type="date" value={search.checkIn} onChange={(e) => setSearch(s => ({ ...s, checkIn: e.target.value }))} className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 pl-10 pr-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-all [color-scheme:dark]" />
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs font-medium block mb-1.5">Check-out</label>
                    <div className="relative">
                      <FaCalendarAlt className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
                      <input type="date" value={search.checkOut} onChange={(e) => setSearch(s => ({ ...s, checkOut: e.target.value }))} min={search.checkIn || undefined} className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 pl-10 pr-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-all [color-scheme:dark]" />
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs font-medium block mb-1.5">Guests</label>
                    <div className="relative">
                      <FaUserFriends className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
                      <select value={search.guests} onChange={(e) => setSearch(s => ({ ...s, guests: e.target.value }))} className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 pl-10 pr-8 text-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-all appearance-none cursor-pointer">
                        <option className="bg-gray-800 text-white" value="1">1 Guest</option>
                        <option className="bg-gray-800 text-white" value="2">2 Guests</option>
                        <option className="bg-gray-800 text-white" value="3">3 Guests</option>
                        <option className="bg-gray-800 text-white" value="4">4+ Guests</option>
                      </select>
                      <FaChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
                    </div>
                  </div>
                  <button onClick={handleSearch} className="flex items-center justify-center w-full bg-white text-black text-center font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 text-sm">
                    Search Rooms
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setBgIndex(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === bgIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'}`}
            />
          ))}
        </div>
      </section>

      {/* Search results */}
      {searchMeta.searched && (
        <section ref={resultsRef} className="py-10 bg-black border-t border-gray-800 scroll-mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-white">Available Rooms</h2>
                {searchMeta.error ? (
                  <p className="text-sm text-red-400 mt-1">{searchMeta.error}</p>
                ) : searchMeta.loading ? (
                  <p className="text-sm text-gray-400 mt-1">Checking availability for your dates&hellip;</p>
                ) : (
                  <p className="text-sm text-gray-400 mt-1">
                    {searchResults?.length || 0} room{searchResults?.length !== 1 ? 's' : ''} found for {searchMeta.guests} guest{Number(searchMeta.guests) > 1 ? 's' : ''} &middot; {fmtDate(searchMeta.checkIn)} &rarr; {fmtDate(searchMeta.checkOut)} ({nights} night{nights > 1 ? 's' : ''})
                  </p>
                )}
              </div>
              <button onClick={clearSearch} className="text-xs font-semibold text-gray-400 hover:text-white transition-colors">
                &times; Clear search
              </button>
            </div>

            {searchMeta.loading ? (
              <div className="flex items-center justify-center gap-2 text-gray-400 text-sm py-16">
                <FaSpinner className="animate-spin" /> Checking availability&hellip;
              </div>
            ) : searchMeta.error ? (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 text-center">
                <p className="text-white font-display font-semibold text-lg mb-2">We need more info</p>
                <p className="text-gray-400 text-sm">Please pick check-in and check-out dates to see available rooms.</p>
              </div>
            ) : searchResults?.length === 0 ? (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 text-center">
                <p className="text-white font-display font-semibold text-lg mb-2">No rooms available</p>
                <p className="text-gray-400 text-sm mb-5">No rooms match your dates and guest count. Try different dates or fewer guests.</p>
                <Link to="/rooms" className="inline-flex items-center gap-2 bg-white text-black font-semibold px-5 py-2.5 rounded-xl text-sm transition-all hover:bg-gray-200">
                  View all rooms <FaArrowRight className="text-[10px]" />
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {searchResults.map((room, i) => (
                  <div key={room._id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:bg-gray-800 transition-all duration-300 group">
                    <div className="relative h-40 bg-gray-800 overflow-hidden">
                      <img src={roomImages[i % roomImages.length]} alt={room.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      <span className="absolute top-3 left-3 bg-gray-800 text-gray-200 text-[10px] font-semibold px-2 py-0.5 rounded-md">{room.type}</span>
                      <span className="absolute top-3 right-3 flex items-center gap-1 bg-green-500/15 text-green-400 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-green-500/30">
                        <FaCheck className="text-[8px]" /> Available
                      </span>
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h3 className="font-display font-bold text-white text-sm leading-tight">{room.name}</h3>
                        <span className="flex items-center gap-1 text-[11px] text-gray-400 whitespace-nowrap"><FaUserFriends className="text-[10px]" /> {room.capacity}</span>
                      </div>
                      <p className="text-gray-400 text-[11px] mb-3 line-clamp-2 leading-relaxed">{room.description}</p>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                        <div>
                          <span className="text-base font-display font-bold text-white">{formatPrice(room.price)}</span>
                          <span className="text-gray-500 text-[10px]">/night</span>
                        </div>
                        <button onClick={() => { setBookingRoom(room); setBookingPrefill({ checkIn: searchMeta.checkIn, checkOut: searchMeta.checkOut, guests: Number(searchMeta.guests) }); }} className="bg-white text-black text-[11px] font-semibold px-4 py-2 rounded-lg transition-all hover:shadow-lg hover:-translate-y-0.5">
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Promo bar */}
      <section className="bg-black py-3 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-sm text-gray-300">
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 lg:gap-0 lg:divide-x lg:divide-gray-800">
            {trustStats.map(({ icon: Icon, value, label, sub }) => (
              <div key={label} className="text-center lg:px-6">
                <Icon className="text-gray-500 text-base mx-auto mb-3" />
                <p className="text-3xl lg:text-4xl font-display font-bold text-white tracking-tight leading-none"><AnimatedCounter value={value} /></p>
                <p className="text-gray-400 text-sm font-semibold mt-2">{label}</p>
                <div className="w-6 h-px bg-gray-800 mx-auto my-2.5" />
                <p className="text-gray-600 text-xs">{sub}</p>
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
              <Link key={title} to={to} className="group block border border-gray-800 rounded-2xl p-6 hover:border-gray-600 transition-colors duration-300">
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center group-hover:border-gray-500 transition-colors duration-300 shrink-0">
                      <Icon className="text-gray-400 text-sm group-hover:text-white transition-colors duration-300" />
                    </span>
                    <h3 className="text-lg font-display font-bold text-white">{title}</h3>
                  </div>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">{desc}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {items.map((item) => (
                      <span key={item} className="text-[11px] text-gray-400 border border-gray-700 rounded-full px-3 py-1 group-hover:border-gray-600 transition-colors duration-300">{item}</span>
                    ))}
                  </div>
                  <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-gray-300 group-hover:text-white transition-colors duration-300">
                    View All <FaArrowRight className="text-[11px] group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
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

        <div className="text-center mt-6">
          <Link to="/rooms" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors hover:-translate-y-0.5 inline-block group">
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
                className={`text-xs font-semibold px-4 py-1.5 rounded-lg transition-all hover:-translate-y-0.5 ${galleryFilter === cat ? 'bg-white text-black' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-gray-800">
              <div className="flex transition-transform duration-500 ease-out -mx-2.5" style={{ transform: `translateX(-${currentGallery * (100 / galleryVisible)}%)` }}>
                {filteredGallery.map((img, i) => (
                  <div key={i} className="shrink-0 px-2.5" style={{ width: `${100 / galleryVisible}%` }}>
                    <div className="relative h-52 sm:h-64 md:h-80 rounded-xl overflow-hidden border border-gray-800 group">
                      <img src={img.src} alt={`Akarabo Hotel ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <span className="absolute bottom-3 left-3 bg-black/60 border border-gray-700 text-gray-200 text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">{img.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={galleryPrev} disabled={galleryCount <= galleryVisible} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-gray-900 hover:bg-gray-800 border border-gray-700 flex items-center justify-center text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg z-10" aria-label="Previous images">
              <FaChevronLeft className="text-xs" />
            </button>
            <button onClick={galleryNext} disabled={galleryCount <= galleryVisible} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-10 h-10 rounded-full bg-gray-900 hover:bg-gray-800 border border-gray-700 flex items-center justify-center text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg z-10" aria-label="Next images">
              <FaChevronRight className="text-xs" />
            </button>

            <div className="flex items-center justify-center gap-1.5 mt-5">
              {Array.from({ length: galleryMax + 1 }).map((_, i) => (
                <button key={i} onClick={() => setGalleryIndex(i)} aria-label={`Go to slide ${i + 1}`} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentGallery ? 'w-6 bg-white' : 'w-1.5 bg-gray-700 hover:bg-gray-600'}`} />
              ))}
            </div>
          </div>
          <div className="text-center mt-6">
            <Link to="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors hover:-translate-y-0.5 inline-block group">
              <FaImages className="text-xs" /> View Full Gallery <FaArrowRight className="text-[10px] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-10 bg-black overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-gray-600 text-xs font-medium uppercase tracking-[0.2em]">Guest Reviews</span>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mt-1">Testimonials</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 border border-gray-800 rounded-full px-4 py-2">
                <FaStar className="text-amber-400 text-sm" />
                <span className="font-display font-bold text-white text-sm">4.9</span>
                <span className="text-gray-500 text-xs">/ 5 &middot; 1,240+ reviews</span>
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
        </div>

        <div ref={testimonialScrollRef} className="flex gap-5 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-2 scroll-smooth scrollbar-hide">
          {testimonials.map(({ name, role, text, rating }) => (
            <div key={name} className="relative min-w-[300px] sm:min-w-[340px] bg-gray-900/40 border border-gray-800 rounded-2xl p-6 shrink-0 hover:border-gray-600 hover:-translate-y-1 transition-all duration-300 group">
              <FaQuoteLeft className="absolute top-6 right-6 text-3xl text-gray-800 group-hover:text-gray-700 transition-colors" />
              <div className="flex gap-0.5 mb-4">
                {[...Array(rating)].map((_, j) => <FaStar key={j} className="text-amber-400 text-[11px]" />)}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-5">&ldquo;{text}&rdquo;</p>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-800">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 ring-1 ring-gray-700 flex items-center justify-center text-[11px] font-bold text-white shrink-0">
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
                <input type="email" placeholder="your@email.com" className="flex-1 min-w-0 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600" />
                <button className="bg-white text-black hover:bg-gray-200 font-semibold px-3 py-2 rounded-xl transition-all text-sm whitespace-nowrap shrink-0">Subscribe</button>
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

      {bookingRoom && <BookingModal item={bookingRoom} type="Room" onClose={() => { setBookingRoom(null); setBookingPrefill(null); }} initial={bookingPrefill} />}

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
