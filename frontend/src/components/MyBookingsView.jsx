import React, { useState, useEffect } from 'react';
import { Ticket, QrCode, Calendar, Clock, Building2 } from 'lucide-react';
import { SlotService } from '../services/api';

export default function MyBookingsView({ lang, user, onShowReceipt, showToast }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await SlotService.getMyBookings();
      if (res.data.success) {
        setBookings(res.data.data);
      }
    } catch (e) {
      showToast('रसीदें लोड करने में समस्या', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tab-section">
      <div className="glass-card" style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px', padding: '22px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Ticket size={28} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>
            {lang === 'hi' ? 'मेरे आरक्षित टोकन एवं डिजिटल गेट-पास' : 'My Reserved Tokens & Gate Passes'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            {lang === 'hi'
              ? 'मंडी अथवा खाद वितरण केंद्र पर प्रवेश के समय यही टोकन नंबर व क्यूआर कोड दिखाना अनिवार्य है।'
              : 'Show this verified digital pass and QR code at the mandi security gate for entry.'}
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>{lang === 'hi' ? 'आपकी रसीदें लोड हो रही हैं...' : 'Loading your passes...'}</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '50px' }}>
          <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '14px' }}>
            {lang === 'hi' ? 'आपने अभी तक कोई टोकन बुक नहीं किया है।' : 'You have not booked any tokens yet.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {bookings.map(b => (
            <div
              key={b.id}
              className="glass-card"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px',
                flexWrap: 'wrap',
                gap: '16px'
              }}
            >
              <div>
                <span style={{
                  background: '#064e3b',
                  color: '#34d399',
                  fontFamily: 'monospace',
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  padding: '6px 14px',
                  borderRadius: '6px',
                  letterSpacing: '1px'
                }}>
                  {b.bookingCode}
                </span>
                <h3 style={{ marginTop: '10px', fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                  {b.itemName}
                </h3>
                <div style={{ color: '#64748b', fontSize: '0.88rem', display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '4px' }}>
                  <span>🏛️ {b.mandiName}</span>
                  <span>📅 {b.slotDate}</span>
                  <span>⏰ {b.startTime} - {b.endTime}</span>
                </div>
              </div>

              <div>
                <button onClick={() => onShowReceipt(b)} className="btn btn-outline">
                  <QrCode size={18} />
                  <span>{lang === 'hi' ? 'डिजिटल पास देखें' : 'View Pass & QR'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
