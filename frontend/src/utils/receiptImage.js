import QRCode from 'qrcode';
import { formatPrice } from './format';

export const bookingRefOf = (b) => `AKB-${String(b?._id || '').slice(-6).toUpperCase()}`;

export const bookingFmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : '\u2014');

export const bookingNightsOf = (b) => (b?.bookingType === 'Room' && b?.checkIn && b?.checkOut
  ? Math.max(1, Math.ceil((new Date(b.checkOut) - new Date(b.checkIn)) / 86400000))
  : 1);

export const bookingQrValue = (b) => [
  'Akarabo Hotel & Spa',
  `Ref: ${bookingRefOf(b)}`,
  `Guest: ${b?.guestName || ''}`,
  `Item: ${b?.itemId?.name || ''}`,
  `Type: ${b?.bookingType || ''}`,
  `Guests: ${b?.guests || 1}`,
  `Total: ${formatPrice(b?.totalPrice)}`,
  `Status: ${b?.status || ''}`,
].join('\n');

const FONT = '"Inter", "Segoe UI", "Helvetica Neue", Arial, sans-serif';
const INK = '#111827';
const GRAY = '#6b7280';
const LIGHT = '#f3f4f6';
const BORDER = '#e5e7eb';

const loadFonts = async () => {
  try {
    await Promise.race([
      Promise.all([400, 600, 700].map((w) => document.fonts.load(`${w} 16px Inter`))),
      new Promise((r) => setTimeout(r, 3000)),
    ]);
  } catch {
    // fall back to system fonts
  }
};

const loadImage = (src) => new Promise((resolve) => {
  const img = new Image();
  img.onload = () => resolve(img);
  img.onerror = () => resolve(null);
  img.src = src;
});

const roundRect = (ctx, x, y, w, h, r) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
};

const wrapText = (ctx, text, maxWidth) => {
  const words = String(text || '').split(/\s+/);
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [''];
};

const drawLabelValue = (ctx, x, y, label, value, valueColor = INK) => {
  ctx.fillStyle = GRAY;
  ctx.font = '600 9px ' + FONT;
  ctx.fillText(label.toUpperCase(), x, y);
  ctx.fillStyle = valueColor;
  ctx.font = '600 14px ' + FONT;
  ctx.fillText(value, x, y + 18);
};

export async function renderReceiptImage(b) {
  const W = 620;
  const H = 800;
  const PAD = 36;
  const RIGHT = W - PAD;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  await loadFonts();

  const [logo, qrImg] = await Promise.all([
    loadImage('/Logo.png'),
    loadImage(await QRCode.toDataURL(bookingQrValue(b), { width: 320, margin: 1, errorCorrectionLevel: 'M', color: { dark: '#111827ff', light: '#ffffffff' } })),
  ]);

  ctx.textBaseline = 'top';
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);

  // Accent bar
  ctx.fillStyle = '#111827';
  ctx.fillRect(0, 0, W, 8);

  // Dark header band
  ctx.fillStyle = '#111827';
  ctx.fillRect(0, 8, W, 104);
  if (logo) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(PAD + 30, 8 + 52, 30, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(logo, PAD, 8 + 22, 60, 60);
    ctx.restore();
  } else {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(PAD + 30, 8 + 52, 30, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#ffffff';
  ctx.font = '700 21px ' + FONT;
  ctx.fillText('Akarabo Hotel & Spa', PAD + 76, 8 + 30);
  ctx.font = '400 11px ' + FONT;
  ctx.fillStyle = '#cbd5e1';
  ctx.fillText('KN 5 Road, Kigali, Rwanda', PAD + 76, 8 + 58);
  ctx.fillText('+250 788 123 456  \u00b7  info@akarabohotel.rw', PAD + 76, 8 + 74);

  ctx.fillStyle = '#9ca3af';
  ctx.font = '700 10px ' + FONT;
  ctx.fillText('BOOKING RECEIPT', RIGHT, 8 + 24);
  ctx.textAlign = 'right';
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 16px ' + FONT;
  ctx.fillText(bookingRefOf(b), RIGHT, 8 + 40);
  ctx.textAlign = 'left';

  const status = String(b?.status || 'Pending');
  const statusColor = status === 'Confirmed' ? '#16a34a' : status === 'Cancelled' ? '#dc2626' : '#d97706';
  const pillW = ctx.measureText(status).width + 28;
  ctx.fillStyle = statusColor;
  roundRect(ctx, RIGHT - pillW, 8 + 64, pillW, 24, 12);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 11px ' + FONT;
  ctx.textAlign = 'right';
  ctx.fillText(status, RIGHT - 14, 8 + 69);
  ctx.textAlign = 'left';

  // Guest details
  let y = 8 + 104 + 22;
  ctx.fillStyle = GRAY;
  ctx.font = '700 9px ' + FONT;
  ctx.fillText('GUEST DETAILS', PAD, y);
  y += 34;
  const colW = (W - 2 * PAD) / 3;
  drawLabelValue(ctx, PAD, y, 'Guest', b?.guestName || '\u2014');
  drawLabelValue(ctx, PAD + colW, y, 'Email', b?.email || '\u2014');
  drawLabelValue(ctx, PAD + colW * 2, y, 'Phone', b?.phone || '\u2014');
  y += 66;

  ctx.strokeStyle = BORDER;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PAD, y);
  ctx.lineTo(RIGHT, y);
  ctx.stroke();
  y += 18;

  // Booking details
  ctx.fillStyle = GRAY;
  ctx.font = '700 9px ' + FONT;
  ctx.fillText('BOOKING DETAILS', PAD, y);
  y += 34;

  const itemName = b?.itemId?.name || b?.guestName || '\u2014';
  const typeLabel = b?.bookingType === 'Room' ? 'Room' : b?.bookingType === 'Hall' ? 'Event Hall' : b?.bookingType || '';
  drawLabelValue(ctx, PAD, y, 'Booking', itemName);
  drawLabelValue(ctx, PAD + colW * 1.5, y, 'Type', typeLabel);
  y += 58;

  if (b?.bookingType === 'Room') {
    drawLabelValue(ctx, PAD, y, 'Check-in', bookingFmtDate(b?.checkIn));
    drawLabelValue(ctx, PAD + colW * 1.5, y, 'Check-out', bookingFmtDate(b?.checkOut));
    y += 52;
    drawLabelValue(ctx, PAD, y, 'Duration', `${bookingNightsOf(b)} night${bookingNightsOf(b) > 1 ? 's' : ''}`);
    drawLabelValue(ctx, PAD + colW * 1.5, y, 'Guests', `${b?.guests || 1}`);
  } else {
    drawLabelValue(ctx, PAD, y, 'Date', bookingFmtDate(b?.date));
    drawLabelValue(ctx, PAD + colW * 1.5, y, 'Time', b?.time || '\u2014');
    y += 52;
    drawLabelValue(ctx, PAD, y, 'Guests', `${b?.guests || 1}`);
  }
  y += 52;

  if (b?.specialRequests) {
    ctx.fillStyle = GRAY;
    ctx.font = '600 9px ' + FONT;
    ctx.fillText('SPECIAL REQUESTS', PAD, y);
    ctx.fillStyle = INK;
    ctx.font = '400 12px ' + FONT;
    const lines = wrapText(ctx, b.specialRequests, W - 2 * PAD);
    lines.forEach((ln, i) => ctx.fillText(ln, PAD, y + 16 + i * 17));
    y += 20 + lines.length * 17;
  } else {
    y += 6;
  }

  ctx.strokeStyle = BORDER;
  ctx.beginPath();
  ctx.moveTo(PAD, y);
  ctx.lineTo(RIGHT, y);
  ctx.stroke();
  y += 18;

  // Payment summary + QR
  ctx.fillStyle = GRAY;
  ctx.font = '700 9px ' + FONT;
  ctx.fillText('PAYMENT SUMMARY', PAD, y);
  y += 34;

  const total = Number(b?.totalPrice) || 0;
  const nights = bookingNightsOf(b);
  const rate = nights ? Math.round(total / nights) : total;

  const billingX = PAD;
  const row = (label, value, bold) => {
    ctx.fillStyle = bold ? INK : GRAY;
    ctx.font = bold ? '700 13px ' + FONT : '400 13px ' + FONT;
    ctx.fillText(label, billingX, y);
    ctx.fillStyle = bold ? INK : INK;
    ctx.font = '700 13px ' + FONT;
    ctx.textAlign = 'right';
    ctx.fillText(value, RIGHT - 200, y);
    ctx.textAlign = 'left';
    y += 26;
  };

  row(`${typeLabel || 'Booking'} rate`, formatPrice(rate), false);
  if (b?.bookingType === 'Room') row(`${nights} night${nights > 1 ? 's' : ''}`, `\u00d7 ${nights}`, false);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(billingX, y - 8);
  ctx.lineTo(RIGHT - 200, y - 8);
  ctx.stroke();
  ctx.lineWidth = 1;
  row('Total Paid', formatPrice(total), true);

  ctx.fillStyle = GRAY;
  ctx.font = '400 10px ' + FONT;
  ctx.fillText(`Payment status: ${status}`, billingX, y);

  // QR box
  const qrSize = 104;
  const qrBoxX = RIGHT - 130;
  const qrBoxY = y - 150;
  ctx.strokeStyle = '#d1d5db';
  ctx.lineWidth = 1;
  ctx.setLineDash([6, 5]);
  roundRect(ctx, qrBoxX, qrBoxY, 130, 152, 12);
  ctx.stroke();
  ctx.setLineDash([]);
  if (qrImg) {
    ctx.drawImage(qrImg, qrBoxX + 13, qrBoxY + 12, qrSize, qrSize);
  }
  ctx.fillStyle = GRAY;
  ctx.font = '700 9px ' + FONT;
  ctx.textAlign = 'center';
  ctx.fillText('SCAN TO VERIFY', qrBoxX + 65, qrBoxY + 130);
  ctx.textAlign = 'left';

  // Footer
  y += 34;
  ctx.fillStyle = LIGHT;
  ctx.fillRect(0, y, W, H - y);
  ctx.fillStyle = GRAY;
  ctx.font = '400 10px ' + FONT;
  ctx.textAlign = 'center';
  ctx.fillText('Thank you for choosing Akarabo Hotel & Spa. Please present this receipt at check-in.', W / 2, y + 22);
  ctx.fillText('For changes or questions call +250 788 123 456 or email info@akarabohotel.rw', W / 2, y + 38);
  ctx.font = '400 9px ' + FONT;
  ctx.fillText(`Generated on ${new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}`, W / 2, y + 60);
  ctx.textAlign = 'left';

  return canvas;
}
