import { useState, useEffect, useCallback } from 'react';
import { FaTimes, FaCalendarAlt, FaUser, FaPhone, FaEnvelope, FaClock, FaUsers, FaCheckCircle, FaArrowRight, FaArrowLeft, FaSpinner, FaBed, FaGlassCheers, FaSpa, FaUserCheck, FaRegCalendarCheck, FaCommentDots } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { createBooking } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/format';

const typeIcons = { Room: FaBed, Service: FaSpa, Hall: FaGlassCheers };
const typeLabels = { Room: 'Room', Service: 'Service', Hall: 'Event Hall' };

const steps = [
  { num: 1, label: 'Your Details' },
  { num: 2, label: 'Booking Info' },
  { num: 3, label: 'Review & Confirm' },
];

function FormField({ label, icon: Icon, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {Icon && <Icon className="inline mr-1.5 text-gray-500 text-xs" />}
        {label}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-red-500 text-xs mt-1.5 font-medium animate-slide-down">
          <FaTimes className="text-[8px] bg-red-500 text-white rounded-full p-0.5" />
          {error}
        </p>
      )}
    </div>
  );
}

export default function BookingModal({ item, type, onClose }) {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    guestName: user?.name || '', email: user?.email || '', phone: user?.phone || '',
    checkIn: '', checkOut: '', date: '', time: '',
    guests: 1, specialRequests: '',
  });

  const set = (key, val) => {
    setForm((p) => ({ ...p, [key]: val }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: '' }));
  };

  const validateStep = useCallback(() => {
    const errs = {};
    if (step === 0) {
      if (!form.guestName.trim()) errs.guestName = 'Full name is required';
      if (!form.email.trim()) errs.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email address';
      if (!form.phone.trim()) errs.phone = 'Phone number is required';
      else if (form.phone.replace(/\s/g, '').length < 10) errs.phone = 'Enter a valid phone number';
    }
    if (step === 1) {
      if (type === 'Room') {
        if (!form.checkIn) errs.checkIn = 'Check-in date is required';
        if (!form.checkOut) errs.checkOut = 'Check-out date is required';
        if (form.checkIn && form.checkOut && new Date(form.checkOut) <= new Date(form.checkIn))
          errs.checkOut = 'Check-out must be after check-in';
      } else {
        if (!form.date) errs.date = 'Date is required';
        if (!form.time) errs.time = 'Time is required';
      }
      if (!form.guests || form.guests < 1) errs.guests = 'At least 1 guest required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [step, form, type]);

  const next = () => {
    if (validateStep()) setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await createBooking({
        ...form,
        bookingType: type,
        itemId: item._id,
        userId: user?.id || null,
        isGuest: !user,
        totalPrice: item.price * (type === 'Room' ? Math.max(1, Math.ceil((new Date(form.checkOut) - new Date(form.checkIn)) / 86400000)) : 1),
      });
      toast.success(
        <div>
          <p className="font-semibold">Booking Confirmed!</p>
          <p className="text-sm opacity-80">We will contact you shortly at {form.email}</p>
        </div>,
        { autoClose: 4000 }
      );
      onClose();
    } catch {
      toast.error(
        <div>
          <p className="font-semibold">Booking Failed</p>
          <p className="text-sm opacity-80">Something went wrong. Please try again or call us.</p>
        </div>,
        { autoClose: 5000 }
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const Icon = typeIcons[type] || FaBed;
  const nights = type === 'Room' && form.checkIn && form.checkOut
    ? Math.max(1, Math.ceil((new Date(form.checkOut) - new Date(form.checkIn)) / 86400000))
    : 1;
  const subtotal = item.price * nights;

  return (
    <div className="overlay animate-fade-in" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-modal animate-scale-in flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with item info */}
        <div className="bg-gradient-to-r from-gray-900 to-black px-6 pt-5 pb-4 text-white relative">
          <button onClick={onClose} className="absolute top-3 right-3 w-7 h-7 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors">
            <FaTimes className="text-[11px]" />
          </button>

          <div className="flex items-center gap-3.5 mb-4">
            <div className="w-11 h-11 bg-gray-800 rounded-xl flex items-center justify-center shrink-0">
              <Icon className="text-gray-400 text-lg" />
            </div>
            <div className="min-w-0">
              <h3 className="font-display text-lg font-bold leading-tight truncate">{item.name}</h3>
              <p className="text-gray-400 text-sm">
                  <span className="font-semibold text-white">{formatPrice(item.price)}</span>
                  {type === 'Room' ? ' / night' : type === 'Hall' ? ' / event' : ''}
                {' '}&middot;{' '}
                <span className="text-gray-400">{typeLabels[type] || type}</span>
              </p>
            </div>
          </div>

          {user && (
            <div className="bg-gray-800 rounded-lg px-3.5 py-2 mb-3 flex items-center gap-2 text-sm">
              <FaUserCheck className="text-gray-400 shrink-0" />
              <span className="text-gray-400 text-xs">Booking as <strong className="text-white">{user.name}</strong></span>
            </div>
          )}

          {/* Step progress */}
          <div className="flex items-center gap-0">
            {steps.map((s, i) => (
              <div key={s.label} className="flex-1 flex items-center">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                    i <= step ? 'bg-white text-black' : 'bg-gray-700 text-gray-400'
                  }`}>
                    {i < step ? <FaCheckCircle className="text-[10px]" /> : s.num}
                  </div>
                  <span className={`text-[10px] font-medium hidden sm:block transition-colors duration-300 ${
                    i <= step ? 'text-white' : 'text-white/40'
                  }`}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-px mx-2 transition-colors duration-300 ${
                    i < step ? 'bg-white' : 'bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 0: Personal Details */}
          {step === 0 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h4 className="font-display text-base font-semibold text-gray-900 mb-1">Personal Information</h4>
                <p className="text-gray-400 text-xs mb-4">Enter your contact details so we can reach you</p>
              </div>
              <FormField label="Full Name" icon={FaUser} error={errors.guestName}>
                <div className="relative">
                  <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                  <input
                    className={`w-full pl-9 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 focus:bg-white outline-none transition-all duration-200 ${errors.guestName ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''}`}
                    value={form.guestName}
                    onChange={(e) => set('guestName', e.target.value)}
                    placeholder="e.g. Jean Hakizimana"
                  />
                </div>
              </FormField>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Email Address" icon={FaEnvelope} error={errors.email}>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                    <input
                      type="email"
                      className={`w-full pl-9 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 focus:bg-white outline-none transition-all duration-200 ${errors.email ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''}`}
                      value={form.email}
                      onChange={(e) => set('email', e.target.value)}
                      placeholder="you@email.com"
                    />
                  </div>
                </FormField>
                <FormField label="Phone Number" icon={FaPhone} error={errors.phone}>
                  <div className="relative">
                    <FaPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                    <input
                      className={`w-full pl-9 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 focus:bg-white outline-none transition-all duration-200 ${errors.phone ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''}`}
                      value={form.phone}
                      onChange={(e) => set('phone', e.target.value)}
                      placeholder="+250 788 000 000"
                    />
                  </div>
                </FormField>
              </div>
            </div>
          )}

          {/* Step 1: Booking Info */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h4 className="font-display text-base font-semibold text-gray-900 mb-1">Booking Details</h4>
                <p className="text-gray-400 text-xs mb-4">Tell us when and how many guests</p>
              </div>
              {type === 'Room' ? (
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Check-in Date" icon={FaCalendarAlt} error={errors.checkIn}>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                      <input
                        type="date"
                        className={`w-full pl-9 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 focus:bg-white outline-none transition-all duration-200 ${errors.checkIn ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''}`}
                        value={form.checkIn}
                        onChange={(e) => set('checkIn', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </FormField>
                  <FormField label="Check-out Date" icon={FaCalendarAlt} error={errors.checkOut}>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                      <input
                        type="date"
                        className={`w-full pl-9 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 focus:bg-white outline-none transition-all duration-200 ${errors.checkOut ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''}`}
                        value={form.checkOut}
                        onChange={(e) => set('checkOut', e.target.value)}
                        min={form.checkIn || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </FormField>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Date" icon={FaCalendarAlt} error={errors.date}>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                      <input
                        type="date"
                        className={`w-full pl-9 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 focus:bg-white outline-none transition-all duration-200 ${errors.date ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''}`}
                        value={form.date}
                        onChange={(e) => set('date', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </FormField>
                  <FormField label="Preferred Time" icon={FaClock} error={errors.time}>
                    <div className="relative">
                      <FaClock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                      <input
                        type="time"
                        className={`w-full pl-9 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 focus:bg-white outline-none transition-all duration-200 ${errors.time ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''}`}
                        value={form.time}
                        onChange={(e) => set('time', e.target.value)}
                      />
                    </div>
                  </FormField>
                </div>
              )}
              <FormField label="Number of Guests" icon={FaUsers} error={errors.guests}>
                <div className="relative">
                  <FaUsers className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                  <input
                    type="number"
                    min={1}
                    max={type === 'Hall' ? 500 : 10}
                    className={`w-full pl-9 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 focus:bg-white outline-none transition-all duration-200 ${errors.guests ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''}`}
                    value={form.guests}
                    onChange={(e) => set('guests', Math.max(1, +e.target.value))}
                  />
                </div>
              </FormField>
              <FormField label="Special Requests (optional)" icon={FaCommentDots}>
                <div className="relative">
                  <FaCommentDots className="absolute left-3.5 top-3 text-gray-400 text-xs" />
                  <textarea
                    className="w-full pl-9 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 focus:bg-white outline-none transition-all duration-200 resize-none"
                    rows={3}
                    value={form.specialRequests}
                    onChange={(e) => set('specialRequests', e.target.value)}
                    placeholder="e.g. extra pillows, dietary needs, accessibility..."
                  />
                </div>
              </FormField>

              {type === 'Room' && form.checkIn && form.checkOut && (
                <div className="bg-gray-100 rounded-xl px-4 py-3 border border-gray-200 flex items-center justify-between">
                  <span className="text-sm text-gray-600">Estimated total</span>
                  <span className="font-display font-bold text-gray-900 text-lg">{formatPrice(subtotal)}</span>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h4 className="font-display text-base font-semibold text-gray-900 mb-1">Review Your Booking</h4>
                <p className="text-gray-400 text-xs mb-2">Please confirm your details before submitting</p>
              </div>

              <div className="bg-gray-50 rounded-xl border border-gray-200 divide-y divide-gray-200">
                <div className="px-4 py-3">
                  <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Personal Details</p>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Guest</span>
                      <span className="font-medium text-gray-800">{form.guestName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Email</span>
                      <span className="font-medium text-gray-800">{form.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Phone</span>
                      <span className="font-medium text-gray-800">{form.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-3">
                  <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Booking Details</p>
                  <div className="space-y-1.5 text-sm">
                    {type === 'Room' ? (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Check-in</span>
                          <span className="font-medium text-gray-800">{new Date(form.checkIn).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Check-out</span>
                          <span className="font-medium text-gray-800">{new Date(form.checkOut).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Duration</span>
                          <span className="font-medium text-gray-800">{nights} night{nights > 1 ? 's' : ''}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Date</span>
                          <span className="font-medium text-gray-800">{new Date(form.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Time</span>
                          <span className="font-medium text-gray-800">{form.time}</span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-500">Guests</span>
                      <span className="font-medium text-gray-800">{form.guests}</span>
                    </div>
                    {form.specialRequests && (
                      <div className="flex justify-between items-start">
                        <span className="text-gray-500 shrink-0">Requests</span>
                        <span className="font-medium text-gray-800 text-right ml-4 text-xs">{form.specialRequests}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-4 py-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">Total</span>
                  <div className="text-right">
                    <span className="text-xl font-display font-bold text-gray-900">{formatPrice(subtotal)}</span>
                    {type === 'Room' && form.checkIn && form.checkOut && (
                      <p className="text-[10px] text-gray-400">{formatPrice(item.price)} x {nights} night{nights > 1 ? 's' : ''}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 border border-gray-200 rounded-xl p-3.5 flex items-start gap-2.5">
                <FaCheckCircle className="text-gray-600 mt-0.5 shrink-0" />
                <p className="text-xs text-gray-800 leading-relaxed">
                  By confirming, you agree to Akarabo Hotel's booking terms. You will receive a confirmation email at <strong className="text-gray-900">{form.email}</strong> within minutes.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 flex items-center justify-between gap-3 bg-white">
          {step > 0 ? (
            <button onClick={() => setStep((s) => s - 1)} className="inline-flex items-center gap-1.5 text-gray-600 hover:text-gray-900 font-medium px-4 py-2.5 rounded-xl transition-all text-sm hover:bg-gray-50">
              <FaArrowLeft className="text-xs" /> Back
            </button>
          ) : (
            <button onClick={onClose} className="inline-flex items-center gap-1.5 text-gray-400 hover:text-gray-600 font-medium px-4 py-2.5 rounded-xl transition-all text-sm">Cancel</button>
          )}

          {step < 2 ? (
            <button onClick={next} className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white font-semibold px-6 py-2.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg text-sm">
              Continue <FaArrowRight className="text-xs" />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading} className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white font-semibold px-6 py-2.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? (
                <><FaSpinner className="animate-spin" /> Processing...</>
              ) : (
                <><FaCheckCircle /> Confirm Booking</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
