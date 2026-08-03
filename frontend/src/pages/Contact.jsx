import { useState } from 'react';
import {
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock,
  FaPaperPlane, FaCheckCircle, FaExclamationTriangle, FaSpinner,
  FaUser, FaCommentDots, FaTag,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { API_BASE } from '../services/api';

const contactInfo = [
  { icon: FaMapMarkerAlt, label: 'Visit Us', value: 'KN 5 Road, Kigali, Rwanda', sub: 'Open in Google Maps' },
  { icon: FaPhone, label: 'Call Us', value: '+250 788 123 456', sub: '24/7 Available' },
  { icon: FaEnvelope, label: 'Email Us', value: 'info@akarabohotel.rw', sub: 'Reply within 1 hour' },
  { icon: FaClock, label: 'Working Hours', value: '24/7 Front Desk', sub: 'Always at your service' },
];

function FormField({ label, field, type = 'text', icon: Icon, error, ...props }) {
  const inputClasses = `w-full pl-8 pr-3 py-2.5 bg-gray-800/60 border rounded-xl text-sm text-white placeholder:text-gray-500 focus:ring-2 focus:ring-gray-400/30 focus:border-gray-400 outline-none transition-all duration-200 resize-none ${error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-700 hover:border-gray-600'}`;

  return (
    <div>
      <label className="text-sm font-medium text-gray-300 mb-1 flex items-center gap-1.5">
        {Icon && <Icon className="text-gray-400 text-xs" />}
        {label}
      </label>
      <div className="relative">
        {Icon && <Icon className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[10px]" />}
        {type === 'textarea' ? (
          <textarea className={inputClasses} rows={3} value={props.value} onChange={props.onChange} placeholder={props.placeholder} />
        ) : (
          <input type={type} className={inputClasses} value={props.value} onChange={props.onChange} placeholder={props.placeholder} />
        )}
      </div>
      {error && (
        <p className="flex items-center gap-1 text-red-500 text-xs mt-1 font-medium">
          <FaExclamationTriangle className="text-[10px]" />
          {error}
        </p>
      )}
    </div>
  );
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.phone.trim()) errs.phone = 'Phone is required';
    else if (form.phone.replace(/\s/g, '').length < 10) errs.phone = 'Enter a valid phone number';
    if (!form.subject.trim()) errs.subject = 'Subject is required';
    if (!form.message.trim()) errs.message = 'Message is required';
    else if (form.message.trim().length < 10) errs.message = 'Message must be at least 10 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.warning(
        <div>
          <p className="font-semibold">Please fix the errors</p>
          <p className="text-sm opacity-80">Check the highlighted fields below</p>
        </div>,
        { autoClose: 3000 }
      );
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to send message');
      setSent(true);
      toast.success(
        <div>
          <p className="font-semibold">Message Sent Successfully!</p>
          <p className="text-sm opacity-80">We will get back to you at {form.email} within 24 hours.</p>
        </div>,
        { autoClose: 5000 }
      );
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSent(false), 3000);
    } catch {
      toast.error('Something went wrong. Please try again or call us.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="page-hero">
        <div className="absolute inset-0 overflow-hidden">
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80')] bg-cover bg-center animate-hero-zoom" />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-gray-300 font-semibold text-xs uppercase tracking-widest">Get in Touch</span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mt-2 mb-2 animate-in">
            Contact <span className="text-gray-300">Us</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-sm">
            We would love to hear from you. Reach out for reservations, inquiries, or feedback.
          </p>
        </div>
      </section>

      <section className="py-10 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 -mt-8 relative z-10 mb-6">
          {contactInfo.map(({ icon: Icon, label, value, sub }, i) => (
            <div key={label} className="bg-gray-900 border border-gray-800 rounded-2xl p-3 text-center shadow-card hover:shadow-card-hover hover:-translate-y-1 hover:border-gray-700 group transition-all duration-300 animate-in-delay-1" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="w-8 h-8 bg-gray-800 group-hover:bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-2 transition-colors">
                <Icon className="text-gray-400 group-hover:text-white transition-colors text-xs" />
              </div>
              <h3 className="font-display font-semibold text-white text-xs mb-1">{label}</h3>
              <p className="text-gray-200 font-medium text-xs">{value}</p>
              <p className="text-gray-500 text-[10px] mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-card p-4">
              <div className="mb-3">
                <h2 className="font-display text-lg font-bold text-white mb-1">Send Us a Message</h2>
                <p className="text-gray-400 text-sm">Fill out the form below and our team will get back to you shortly.</p>
              </div>

              {sent && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 mb-3 flex items-start gap-2 animate-slide-down">
                  <FaCheckCircle className="text-green-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-green-300 text-sm">Message Sent!</p>
                    <p className="text-green-400 text-xs">Thank you for reaching out. We will respond within 24 hours.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormField label="Full Name" field="name" icon={FaUser} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Jean Hakizimana" error={errors.name} />
                  <FormField label="Email Address" field="email" type="email" icon={FaEnvelope} value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@email.com" error={errors.email} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormField label="Phone Number" field="phone" icon={FaPhone} value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+250 788 000 000" error={errors.phone} />
                  <FormField label="Subject" field="subject" icon={FaTag} value={form.subject} onChange={(e) => set('subject', e.target.value)} placeholder="e.g. Room Reservation" error={errors.subject} />
                </div>
                <FormField label="Your Message" field="message" type="textarea" icon={FaCommentDots} value={form.message} onChange={(e) => set('message', e.target.value)} placeholder="Tell us how we can help you..." error={errors.message} />

                <button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-200 text-black font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 w-full sm:w-auto">
                  {loading ? (
                    <><FaSpinner className="animate-spin" /> Sending...</>
                  ) : (
                    <><FaPaperPlane /> Send Message</>
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-card overflow-hidden h-full min-h-[220px]">
              <iframe
                title="Akarabo Hotel Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.5!2d29.87!3d-1.94!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwNTYnMjQuMCJTIDI5wrA1MicxMi4wRQ!5e0!3m2!1sen!2srw!4v1"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '220px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
        </div>
      </section>
    </>
  );
}
