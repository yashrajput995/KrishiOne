import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Printer, CheckCircle2 } from 'lucide-react';

export default function DigitalReceiptModal({ booking, onClose, lang }) {
  if (!booking) return null;

  const qrData = JSON.stringify({
    code: booking.bookingCode,
    mandiId: booking.mandiId,
    date: booking.slotDate,
    phone: booking.farmerPhone
  });

  return (
    <div className="modal-overlay">
      <div className="receipt-card glass-modal" style={{ maxWidth: '580px', border: '2px solid #059669' }}>
        <div style={{
          background: '#064e3b',
          color: 'white',
          padding: '22px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div>
            <span style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '9999px', display: 'inline-block', marginBottom: '4px' }}>
              मध्यप्रदेश राज्य कृषि विपणन बोर्ड
            </span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>प्रवेश एवं वितरण टोकन पास</h2>
            <p style={{ fontSize: '0.8rem', color: '#a7f3d0' }}>Official e-Mandi Digital Token Pass</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '4px' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          {/* Token Banner */}
          <div style={{
            background: '#f0fdf4',
            border: '2px dashed #059669',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
            marginBottom: '20px'
          }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#047857', textTransform: 'uppercase' }}>
              {lang === 'hi' ? 'टोकन क्रमांक' : 'TOKEN NUMBER'}
            </div>
            <h1 style={{ fontFamily: 'monospace', fontSize: '2.4rem', fontWeight: 900, color: '#064e3b', letterSpacing: '2px', margin: '4px 0' }}>
              {booking.bookingCode}
            </h1>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#047857', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={14} /> CONFIRMED (पुष्टीकृत)
            </span>
          </div>

          {/* Details & QR Code */}
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '12px', background: 'white', textAlign: 'center' }}>
              <QRCodeSVG value={qrData} size={120} fgColor="#064e3b" />
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', marginTop: '6px' }}>
                गेट पर स्कैन कराएं
              </div>
            </div>

            <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}>
                <span style={{ color: '#64748b' }}>किसान नाम:</span>
                <strong>{booking.farmerName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}>
                <span style={{ color: '#64748b' }}>मोबाइल:</span>
                <strong>{booking.farmerPhone}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}>
                <span style={{ color: '#64748b' }}>मंडी केंद्र:</span>
                <strong>{booking.mandiName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}>
                <span style={{ color: '#64748b' }}>सुविधा/सामग्री:</span>
                <strong>{booking.itemName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}>
                <span style={{ color: '#64748b' }}>दिनांक:</span>
                <strong>{booking.slotDate}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}>
                <span style={{ color: '#64748b' }}>समय सीमा:</span>
                <strong style={{ color: '#059669' }}>{booking.startTime} - {booking.endTime}</strong>
              </div>
            </div>
          </div>

          <div style={{ background: '#f8fafc', borderLeft: '4px solid #059669', padding: '12px', borderRadius: '4px', fontSize: '0.82rem', color: '#475569', marginBottom: '20px' }}>
            ℹ️ <strong>महत्वपूर्ण निर्देश:</strong> कृपया अपने साथ आधार कार्ड एवं किसान बही/खसरा अवश्य लाएं। टोकन समय समाप्त होने के बाद यह पास स्वतः अमान्य हो जाएगा।
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => window.print()} className="btn btn-outline" style={{ flex: 1 }}>
              <Printer size={18} />
              <span>पास प्रिंट करें</span>
            </button>
            <button onClick={onClose} className="btn btn-primary" style={{ flex: 1 }}>
              <span>संपन्न / बंद करें</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
