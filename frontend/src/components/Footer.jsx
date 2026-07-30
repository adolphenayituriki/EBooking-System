import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHotel, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaInstagram, FaTwitter, FaArrowRight, FaPaperPlane, FaCheck, FaArrowUp } from 'react-icons/fa';

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/rooms', label: 'Our Rooms' },
  { to: '/services', label: 'Services' },
  { to: '/halls', label: 'Event Halls' },
  { to: '/contact', label: 'Contact' },
];

const services = [
  { to: '/rooms', label: 'Room Booking' },
  { to: '/services', label: 'Massage & Spa' },
  { to: '/halls', label: 'Hall Reservation' },
  { to: '/services', label: 'Fine Dining' },
  { to: '/halls', label: 'Event Planning' },
];

const contactItems = [
  { icon: FaMapMarkerAlt, text: 'KN 5 Road, Kigali, Rwanda' },
  { icon: FaPhone, text: '+250 788 123 456' },
  { icon: FaEnvelope, text: 'info@akarabohotel.rw' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(''); setTimeout(() => setSubscribed(false), 3000); }
  };

  return (
    <footer className="bg-black text-white relative border-t border-gray-800">
      {/* Book Your Stay strip */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            <h3 className="text-lg sm:text-xl font-display font-bold text-white">Book Your Stay at Akarabo Hotel</h3>
            <p className="text-gray-500 text-sm mt-0.5">Book now and enjoy exclusive rates.</p>
          </div>
          <Link to="/rooms" className="inline-flex items-center gap-2 bg-white text-black font-semibold px-6 py-3 rounded-xl transition-all text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap">
            Book Your Stay <FaArrowRight className="text-[10px]" />
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="flex flex-col">
                <span className="text-lg font-display font-bold tracking-[0.15em] leading-tight text-white">AKARABO</span>
                <span className="text-[9px] font-medium tracking-[0.3em] uppercase text-gray-500">Hotel & Spa</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-6">
              Where luxury meets comfort. Experience world-class hospitality, breathtaking views, and unforgettable moments.
            </p>
            <div className="flex gap-2.5">
              {[FaFacebookF, FaInstagram, FaTwitter].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200">
                  <Icon className="text-[11px]" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-gray-500 text-sm hover:text-white transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Services</h4>
            <ul className="space-y-2.5">
              {services.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-gray-500 text-sm hover:text-white transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div className="lg:col-span-4">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Contact Us</h4>
            <div className="space-y-3 mb-6">
              {contactItems.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-2.5 text-gray-500 text-sm">
                  <Icon className="text-gray-600 mt-0.5 shrink-0 text-[11px]" />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Stay Updated</h4>
            <p className="text-gray-500 text-[11px] mb-3">Get exclusive offers straight to your inbox.</p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-all"
                required
              />
              <button type="submit" className="px-3.5 py-2 bg-white text-black hover:bg-gray-100 rounded-lg transition-all text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap">
                {subscribed ? <><FaCheck className="text-[10px]" /> Sent</> : <><FaPaperPlane className="text-[10px]" /> Subscribe</>}
              </button>
            </form>
            <p className="text-gray-600 text-[10px] mt-2">No spam. Unsubscribe anytime.</p>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-[11px]">&copy; {new Date().getFullYear()} Akarabo Hotel & Spa. All rights reserved.</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-7 h-7 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
            aria-label="Back to top"
          >
            <FaArrowUp className="text-[10px]" />
          </button>
        </div>
      </div>
    </footer>
  );
}
