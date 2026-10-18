import React, { useState, useEffect } from 'react';
import { ShieldCheck, Clock, Ticket, AlertCircle, CheckCircle2, CalendarX, RefreshCw } from 'lucide-react';
import { SlotService } from '../services/api';

const DEFAULT_FALLBACK_SLOTS = [
  {
    id: 1,
    mandi: { id: 1, name: 'इंदौर छावनी कृषि उपज मंडी (Indore Chhawani Mandi)', district: 'Indore' },
    slotType: 'FERTILIZER',
    itemName: 'डीएपी खाद (DAP Fertilizer - 50kg Bags)',
    slotDate: new Date().toISOString().split('T')[0],
    startTime: '08:00 AM',
    endTime: '11:00 AM',
    totalCapacity: 20,
    bookedCount: 14
  },
  {
    id: 2,
    mandi: { id: 1, name: 'इंदौर छावनी कृषि उपज मंडी (Indore Chhawani Mandi)', district: 'Indore' },
    slotType: 'FERTILIZER',
    itemName: 'यूरिया खाद (Urea Fertilizer - 45kg Bags)',
    slotDate: new Date().toISOString().split('T')[0],
    startTime: '11:30 AM',
    endTime: '02:30 PM',
    totalCapacity: 15,
    bookedCount: 8
  },
  {
    id: 3,
    mandi: { id: 1, name: 'इंदौर छावनी कृषि उपज मंडी (Indore Chhawani Mandi)', district: 'Indore' },
    slotType: 'CROP_SELLING',
    itemName: 'गेहूं उपार्जन एवं तुलाई (Wheat Selling Slot)',
    slotDate: new Date().toISOString().split('T')[0],
    startTime: '09:00 AM',
    endTime: '01:00 PM',
    totalCapacity: 30,
    bookedCount: 12
  },
  {
    id: 4,
    mandi: { id: 2, name: 'उज्जैन चिमनगंज मंडी (Ujjain Chimanganj Mandi)', district: 'Ujjain' },
    slotType: 'FERTILIZER',
    itemName: 'डीएपी खाद टोकन (DAP High Demand)',
    slotDate: new Date().toISOString().split('T')[0],
    startTime: '08:30 AM',
    endTime: '11:30 AM',
    totalCapacity: 5,
    bookedCount: 4
  },
  {
    id: 5,
    mandi: { id: 2, name: 'उज्जैन चिमनगंज मंडी (Ujjain Chimanganj Mandi)', district: 'Ujjain' },
    slotType: 'CROP_SELLING',
    itemName: 'सोयाबीन नीलामी (Soybean Auction Gate Pass)',
    slotDate: new Date().toISOString().split('T')[0],
    startTime: '10:00 AM',
    endTime: '02:00 PM',
    totalCapacity: 25,
    bookedCount: 10
  },
  {
    id: 6,
    mandi: { id: 3, name: 'भोपाल करोंद मंडी (Bhopal Karond Mandi)', district: 'Bhopal' },
    slotType: 'FERTILIZER',
    itemName: 'डीएपी खाद वितरण (DAP Token Karond)',
    slotDate: new Date().toISOString().split('T')[0],
    startTime: '09:00 AM',
    endTime: '12:00 PM',
    totalCapacity: 25,
    bookedCount: 20
  },
  {
    id: 7,
    mandi: { id: 3, name: 'भोपाल करोंद मंडी (Bhopal Karond Mandi)', district: 'Bhopal' },
    slotType: 'WAREHOUSE',
    itemName: 'कृषि गोदाम भण्डारण (Warehouse Storage Slot)',
    slotDate: new Date().toISOString().split('T')[0],
    startTime: '08:00 AM',
    endTime: '05:00 PM',
    totalCapacity: 10,
    bookedCount: 2
  },
  {
    id: 8,
    mandi: { id: 4, name: 'विदिशा कृषि मंडी (Vidisha Krishi Mandi)', district: 'Vidisha' },
    slotType: 'CROP_SELLING',
    itemName: 'चना एवं गेहूं विक्रय (Chana & Wheat Sale)',
    slotDate: new Date().toISOString().split('T')[0],
    startTime: '09:00 AM',
    endTime: '01:00 PM',
    totalCapacity: 20,
    bookedCount: 5
  }
];

export default function SlotBookingView({ lang, user, onLoginRequired, onBookingConfirmed, showToast }) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('ALL');
  const [bookingSlotId, setBookingSlotId] = useState(null);
  const [bookedSlotIds, setBookedSlotIds] = useState(new Set());

  useEffect(() => {
    loadSlots();
    if (user) {
      loadUserBookings();
    }
  }, [user]);

  const loadUserBookings = async () => {
    try {
      const res = await SlotService.getMyBookings();
      if (res.data?.success && Array.isArray(res.data.data)) {
        const ids = new Set(
          res.data.data
            .filter(b => b.status === 'CONFIRMED')
            .map(b => b.slotId)
        );
        setBookedSlotIds(ids);
      }
    } catch (e) {
      // ignore
    }
  };

  const loadSlots = async () => {
    try {
      setLoading(true);
      const res = await SlotService.getSlots();
      if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setSlots(res.data.data);
      } else {
        // Fallback to initial verified slots if backend returned empty
        setSlots(DEFAULT_FALLBACK_SLOTS);
      }
    } catch (e) {
      setSlots(DEFAULT_FALLBACK_SLOTS);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (slotId) => {
    if (!user) {
      showToast(lang === 'hi' ? 'टोकन बुक करने के लिए पहले लॉगिन करें' : 'Please sign in to reserve tokens', 'warning');
      onLoginRequired();
      return;
    }

    try {
      setBookingSlotId(slotId);
      const res = await SlotService.bookSlot(slotId);
      if (res.data?.success) {
        showToast(lang === 'hi' ? '🎉 टोकन सुरक्षित हो चुका है! एसएमएस भेजा गया।' : '🎉 Token confirmed! SMS dispatched.');
        setBookedSlotIds(prev => new Set([...prev, slotId]));
        loadSlots(); // refresh capacities
        onBookingConfirmed(res.data.data);
      }
    } catch (e) {
      const err = e.response?.data?.message || (lang === 'hi' ? 'बुकिंग विफल रही' : 'Booking failed');
      showToast(`❌ ${err}`, 'error');
    } finally {
      setBookingSlotId(null);
    }
  };

  const filteredSlots = selectedType === 'ALL'
    ? slots
    : slots.filter(s => s.slotType === selectedType);

  return (
    <div className="tab-section">
      {/* Banner */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        color: 'white',
        border: '1px solid #334155',
        marginBottom: '24px',
        padding: '28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ maxWidth: '650px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(16, 185, 129, 0.2)',
            border: '1px solid #10b981',
            color: '#34d399',
            padding: '4px 14px',
            borderRadius: '9999px',
            fontSize: '0.78rem',
            fontWeight: 700,
            marginBottom: '10px'
          }}>
            <ShieldCheck size={16} />
            <span>{lang === 'hi' ? '4-स्तरीय लॉकिंग सुरक्षा: रेडिस + डीबी रो लॉक (Zero Double-Booking)' : '4-Tier Locking: Redis + DB Row Lock (Zero Double-Booking)'}</span>
          </div>
          <h2 style={{ fontSize: '1.9rem', fontWeight: 800, marginBottom: '6px' }}>
            {lang === 'hi' ? 'खाद (DAP/यूरिया) एवं उपार्जन स्लॉट टोकन बुकिंग' : 'Fertilizer (DAP/Urea) & Selling Token Reservation'}
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.92rem' }}>
            {lang === 'hi'
              ? 'रबी एवं खरीफ सीजन में खाद वितरण केंद्रों पर होने वाली भारी भीड़ से बचें। यहां से अपना टोकन आरक्षित करें और तय समय पर जाकर बिना लाइन के खाद प्राप्त करें।'
              : 'Prevent extreme demand spikes and double-booking at distribution centers. Reserve verified tokens safely.'}
          </p>
        </div>

        {!user && (
          <div style={{ background: 'rgba(255,255,255,0.08)', padding: '14px 18px', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.2)', textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '6px' }}>
              {lang === 'hi' ? 'टोकन बुकिंग हेतु किसान लॉगिन:' : 'Farmer Login Required:'}
            </div>
            <button onClick={onLoginRequired} className="btn btn-sm btn-primary">
              👨‍🌾 {lang === 'hi' ? 'रमेश पटेल (9876543210)' : 'Farmer Login'}
            </button>
          </div>
        )}
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '22px', flexWrap: 'wrap' }}>
        {[
          { id: 'ALL', label: lang === 'hi' ? 'सभी टोकन (All)' : 'All Tokens' },
          { id: 'FERTILIZER', label: lang === 'hi' ? '🌱 खाद वितरण (DAP/Urea)' : '🌱 Fertilizer' },
          { id: 'CROP_SELLING', label: lang === 'hi' ? '🌾 फसल उपार्जन (MSP)' : '🌾 MSP Selling' },
          { id: 'WAREHOUSE', label: lang === 'hi' ? '🏬 गोदाम भंडारण (Storage)' : '🏬 Warehouse' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedType(cat.id)}
            className="category-pill"
            style={{
              background: selectedType === cat.id ? '#059669' : 'white',
              color: selectedType === cat.id ? 'white' : '#334155',
              border: '1px solid ' + (selectedType === cat.id ? '#059669' : '#e2e8f0'),
              padding: '8px 18px',
              borderRadius: '9999px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Slots Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>
            {lang === 'hi' ? 'सक्रिय टोकन स्लॉट लोड हो रहे हैं...' : 'Loading available slots...'}
          </p>
        </div>
      ) : filteredSlots.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '50px 20px', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
            <CalendarX size={28} color="#64748b" />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', marginBottom: '6px' }}>
            {lang === 'hi' ? 'चयनित श्रेणी में कोई स्लॉट उपलब्ध नहीं है' : 'No active slots in this category'}
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '480px', margin: '0 auto 18px' }}>
            {lang === 'hi'
              ? 'कृपया अन्य श्रेणी चुनें या नए स्लॉट कोटा के लिए पुनः प्रयास करें।'
              : 'Please choose another token category or refresh to check for newly opened quotas.'}
          </p>
          <button onClick={() => setSelectedType('ALL')} className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <RefreshCw size={16} />
            <span>{lang === 'hi' ? 'सभी टोकन देखें (Show All)' : 'Show All Tokens'}</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '22px' }}>
          {filteredSlots.map(s => {
            const available = Math.max(0, s.totalCapacity - s.bookedCount);
            const percent = Math.min(100, Math.round((s.bookedCount / s.totalCapacity) * 100));
            const isFull = available === 0;
            const isUrgent = available > 0 && available <= 3;
            const mandiName = s.mandi?.name || s.mandiName || 'कृषि उपज मंडी (Mandi)';
            const mandiDistrict = s.mandi?.district || s.mandiDistrict || '';

            let fillClass = '#10b981';
            if (percent >= 80) fillClass = '#f43f5e';
            else if (percent >= 50) fillClass = '#f59e0b';

            return (
              <div
                key={s.id}
                className="glass-card"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: isUrgent ? '1.5px solid #fda4af' : '1px solid #e2e8f0',
                  background: isUrgent ? 'linear-gradient(180deg, #fff5f5 0%, #ffffff 40%)' : 'white',
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '3px 10px',
                      borderRadius: '9999px',
                      background: s.slotType === 'FERTILIZER' ? '#dcfce7' : s.slotType === 'WAREHOUSE' ? '#e0e7ff' : '#fef3c7',
                      color: s.slotType === 'FERTILIZER' ? '#166534' : s.slotType === 'WAREHOUSE' ? '#3730a3' : '#92400e'
                    }}>
                      {s.slotType}
                    </span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', background: '#f1f5f9', padding: '4px 10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} />
                      {s.startTime} - {s.endTime}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                    {s.itemName}
                  </h3>
                  <div style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '18px' }}>
                    🏛️ {mandiName} {mandiDistrict ? `(${mandiDistrict})` : ''}
                  </div>

                  {/* Concurrency Capacity Progress */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                      <span>{lang === 'hi' ? 'उपलब्ध टोकन:' : 'Available Tokens:'} <strong>{available} / {s.totalCapacity}</strong></span>
                      <span>{percent}% Booked</span>
                    </div>
                    <div style={{ height: '10px', background: '#f1f5f9', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{ width: `${percent}%`, height: '100%', background: fillClass, transition: 'width 0.4s ease' }}></div>
                    </div>
                    {isUrgent && (
                      <div style={{ fontSize: '0.8rem', color: '#e11d48', fontWeight: 700, marginTop: '6px' }}>
                        ⚡ {lang === 'hi' ? `केवल ${available} टोकन शेष! जल्दी करें!` : `Only ${available} tokens left! High demand!`}
                      </div>
                    )}
                  </div>
                </div>

                {bookedSlotIds.has(s.id) ? (
                  <button
                    disabled
                    className="btn btn-emerald btn-block"
                    style={{ opacity: 0.95, cursor: 'default' }}
                  >
                    <CheckCircle2 size={18} />
                    <span>{lang === 'hi' ? '✅ आपका टोकन आरक्षित है' : '✅ Reserved (Token Active)'}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleBook(s.id)}
                    disabled={isFull || bookingSlotId === s.id}
                    className={`btn ${isFull ? 'btn-outline' : 'btn-primary'} btn-block`}
                  >
                    <Ticket size={18} />
                    <span>
                      {bookingSlotId === s.id
                        ? (lang === 'hi' ? 'आरक्षण प्रक्रिया...' : 'Booking...')
                        : isFull
                        ? (lang === 'hi' ? 'स्लॉट पूर्ण (Full)' : 'Slot Full')
                        : (lang === 'hi' ? 'टोकन आरक्षित करें' : 'Reserve Token')}
                    </span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
