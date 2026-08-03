import { useState, useEffect } from 'react';
import { FaTimes, FaSpinner, FaCalendarCheck, FaBed, FaGlassCheers, FaSpa, FaClock, FaChevronLeft, FaFilePdf, FaImage, FaQrcode, FaReceipt } from 'react-icons/fa';
import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';
import { toast } from 'react-toastify';
import { getBookings } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/format';
import { bookingRefOf as refOf, bookingFmtDate as fmtDate, bookingNightsOf as nightsOf, bookingQrValue, renderReceiptImage } from '../utils/receiptImage';

const typeIcons = { Room: FaBed, Service: FaSpa, Hall: FaGlassCheers };
const typeLabels = { Room: 'Room', Service: 'Service', Hall: 'Event Hall' };
const statusColors = {
  Pending: 'bg-gray-100 text-gray-700 border-gray-200',
  Confirmed: 'bg-gray-100 text-gray-700 border-gray-200',
  Cancelled: 'bg-gray-100 text-gray-700 border-gray-200',
  Completed: 'bg-gray-100 text-gray-600 border-gray-200',
};

export default function MyBookings({ onClose }) {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [qrUrl, setQrUrl] = useState(null);
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    if (user?.email) {
      getBookings(user.email)
        .then(setBookings)
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [user]);

  useEffect(() => {
    setQrUrl(null);
    if (!selected) return;
    QRCode.toDataURL(bookingQrValue(selected), { width: 220, margin: 1, errorCorrectionLevel: 'M', color: { dark: '#111827ff', light: '#ffffffff' } })
      .then(setQrUrl)
      .catch(() => setQrUrl(null));
  }, [selected]);

  const downloadPNG = async () => {
    setDownloading('png');
    try {
      const canvas = await renderReceiptImage(selected);
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = `Akarabo-Receipt-${refOf(selected)}.png`;
      a.click();
      toast.success('Receipt image downloaded');
    } catch {
      toast.error('Could not generate the receipt image. Please try again.');
    } finally {
      setDownloading(null);
    }
  };

  const downloadPDF = async () => {
    setDownloading('pdf');
    try {
      const canvas = await renderReceiptImage(selected);
      const img = canvas.toDataURL('image/jpeg', 0.92);
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const w = 210;
      const h = (canvas.height * w) / canvas.width;
      pdf.addImage(img, 'JPEG', 0, 0, w, h);
      pdf.save(`Akarabo-Receipt-${refOf(selected)}.pdf`);
      toast.success('Receipt PDF downloaded');
    } catch {
      toast.error('Could not generate the receipt PDF. Please try again.');
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="overlay animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-modal animate-scale-in flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="bg-black p-6 text-white flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-display text-xl font-bold">{selected ? 'Booking Receipt' : 'My Bookings'}</h3>
            <p className="text-gray-400 text-sm">
              {selected
                ? refOf(selected)
                : `${user?.name} — ${bookings.length} booking${bookings.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors">
            <FaTimes className="text-sm" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {selected ? (
            <>
              {/* Toolbar */}
              <div className="flex items-center justify-between gap-2 px-6 pt-4 pb-3 border-b border-gray-100 shrink-0">
                <button
                  onClick={() => setSelected(null)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <FaChevronLeft className="text-[10px]" /> All bookings
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={downloadPNG}
                    disabled={!!downloading}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all disabled:opacity-50"
                  >
                    {downloading === 'png' ? <FaSpinner className="animate-spin" /> : <FaImage />} PNG
                  </button>
                  <button
                    onClick={downloadPDF}
                    disabled={!!downloading}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-black text-white hover:bg-gray-800 transition-all disabled:opacity-50"
                  >
                    {downloading === 'pdf' ? <FaSpinner className="animate-spin" /> : <FaFilePdf />} Download PDF
                  </button>
                </div>
              </div>

              {/* Receipt document */}
              <div className="p-6">
                <div className="bg-white rounded-2xl border border-gray-200 text-gray-900 overflow-hidden" style={{ width: 560 }}>
                  {/* Header */}
                  <div className="px-7 pt-7 pb-5 flex items-start justify-between border-b-2 border-gray-900">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 shrink-0">
                        <img src="/Logo.png" alt="Akarabo Hotel & Spa" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-lg font-bold tracking-tight leading-tight">Akarabo Hotel &amp; Spa</p>
                        <p className="text-xs text-gray-500 mt-0.5">KN 5 Road, Kigali, Rwanda</p>
                        <p className="text-xs text-gray-500">+250 788 123 456 &middot; info@akarabohotel.rw</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[10px] font-bold tracking-widest text-gray-500">BOOKING RECEIPT</p>
                      <p className="text-sm font-bold mt-0.5">{refOf(selected)}</p>
                      <span className={`badge border text-xs mt-1.5 ${statusColors[selected.status] || statusColors.Pending}`}>
                        {selected.status}
                      </span>
                    </div>
                  </div>

                  {/* Guest details */}
                  <div className="px-7 py-5 grid grid-cols-3 gap-4 border-b border-gray-200">
                    <div>
                      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Guest</p>
                      <p className="text-sm font-semibold">{selected.guestName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Email</p>
                      <p className="text-sm break-all">{selected.email}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Phone</p>
                      <p className="text-sm">{selected.phone || '\u2014'}</p>
                    </div>
                  </div>

                  {/* Booking details */}
                  <div className="px-7 py-5 grid grid-cols-2 gap-x-6 gap-y-3 border-b border-gray-200">
                    <div>
                      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Booking</p>
                      <p className="text-sm font-semibold">{selected.itemId?.name || selected.guestName}</p>
                      <p className="text-xs text-gray-500">{typeLabels[selected.bookingType] || selected.bookingType}</p>
                    </div>
                    {selected.bookingType === 'Room' ? (
                      <>
                        <div>
                          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Dates</p>
                          <p className="text-sm">{fmtDate(selected.checkIn)}</p>
                          <p className="text-sm">{fmtDate(selected.checkOut)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Duration</p>
                          <p className="text-sm">{nightsOf(selected)} night{nightsOf(selected) > 1 ? 's' : ''}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Date</p>
                          <p className="text-sm">{fmtDate(selected.date)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Time</p>
                          <p className="text-sm">{selected.time || '\u2014'}</p>
                        </div>
                      </>
                    )}
                    <div>
                      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Guests</p>
                      <p className="text-sm">{selected.guests} guest{selected.guests > 1 ? 's' : ''}</p>
                    </div>
                    {selected.specialRequests && (
                      <div className="col-span-2">
                        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Special Requests</p>
                        <p className="text-sm text-gray-600">{selected.specialRequests}</p>
                      </div>
                    )}
                  </div>

                  {/* Billing + QR */}
                  <div className="px-7 py-5 flex items-end justify-between gap-6">
                    <div className="flex-1">
                      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Payment Summary</p>
                      <div className="space-y-1.5 text-sm">
                        <div className="flex justify-between gap-4">
                          <span className="text-gray-500">{typeLabels[selected.bookingType] || selected.bookingType} rate</span>
                          <span className="font-medium">{formatPrice(selected.bookingType === 'Room' ? Math.round((Number(selected.totalPrice) || 0) / nightsOf(selected)) : (Number(selected.totalPrice) || 0))}</span>
                        </div>
                        {selected.bookingType === 'Room' && (
                          <div className="flex justify-between gap-4">
                            <span className="text-gray-500">{nightsOf(selected)} night{nightsOf(selected) > 1 ? 's' : ''}</span>
                            <span className="font-medium">x {nightsOf(selected)}</span>
                          </div>
                        )}
                        <div className="flex justify-between gap-4 border-t-2 border-gray-900 pt-2 mt-2">
                          <span className="font-bold">Total Paid</span>
                          <span className="font-bold">{formatPrice(selected.totalPrice)}</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-3">Payment status: {selected.status}</p>
                    </div>

                    <div className="text-center shrink-0">
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-3 inline-block bg-white">
                        {qrUrl ? (
                          <img src={qrUrl} alt="Booking QR code" width={104} height={104} className="block mx-auto" />
                        ) : (
                          <div className="w-[104px] h-[104px] flex items-center justify-center">
                            <FaSpinner className="animate-spin text-gray-400 text-xl" />
                          </div>
                        )}
                        <p className="text-[9px] font-bold tracking-wider text-gray-500 mt-1.5 flex items-center justify-center gap-1">
                          <FaQrcode /> SCAN TO VERIFY
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-7 pt-4 pb-6 border-t border-gray-200 bg-gray-50">
                    <p className="text-[10px] text-gray-500 text-center leading-relaxed">
                      Thank you for choosing Akarabo Hotel &amp; Spa. Please present this receipt at check-in.
                      <br />
                      For changes or questions call +250 788 123 456 or email info@akarabohotel.rw
                      <br />
                      Generated on {new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : loading ? (
            <div className="flex justify-center py-16"><FaSpinner className="animate-spin text-gray-500 text-2xl" /></div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaCalendarCheck className="text-2xl text-gray-400" />
              </div>
              <p className="font-semibold text-gray-600">No bookings yet</p>
              <p className="text-gray-400 text-sm mt-1">Your reservations will appear here</p>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {bookings.map((b) => {
                const Icon = typeIcons[b.bookingType] || FaCalendarCheck;
                return (
                  <div key={b._id} className="card p-4 flex items-start gap-4 cursor-pointer" onClick={() => setSelected(b)}>
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                      <Icon className="text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{b.itemId?.name || b.guestName}</p>
                          <p className="text-gray-500 text-xs mt-0.5">{typeLabels[b.bookingType] || b.bookingType} — {b.guests} guest{b.guests > 1 ? 's' : ''}</p>
                        </div>
                        <span className={`badge border text-xs ${statusColors[b.status] || statusColors.Pending}`}>
                          {b.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><FaClock /> {fmtDate(b.createdAt)}</span>
                        <span className="font-semibold text-gray-900">{formatPrice(b.totalPrice)}</span>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelected(b); }}
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors px-3 py-1.5 rounded-lg"
                      >
                        <FaReceipt /> View Receipt
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
