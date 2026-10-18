import React, { useState, useEffect } from 'react';
import { Search, Volume2, RefreshCw, ExternalLink, Sparkles, Building2 } from 'lucide-react';
import { MandiService } from '../services/api';

export default function MandiRatesView({ lang, showToast }) {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [district, setDistrict] = useState('');
  const [commodity, setCommodity] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [speakingText, setSpeakingText] = useState(null);

  useEffect(() => {
    loadPrices();
  }, []);

  const loadPrices = async (q = '') => {
    try {
      setLoading(true);
      const res = await MandiService.getPrices(q);
      if (res.data.success) {
        setPrices(res.data.data);
      }
    } catch (e) {
      showToast('मंडी भाव लोड करने में समस्या', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncEAnugya = async () => {
    try {
      setSyncing(true);
      const res = await MandiService.syncEAnugya();
      if (res.data.success) {
        showToast(`✅ ई-अनुज्ञा भाव सफलतापूर्वक सिंक हुए! (${res.data.data.syncedRecords} रिकॉर्ड्स)`);
        loadPrices();
      }
    } catch (e) {
      showToast('सिंक विफल हुआ', 'error');
    } finally {
      setSyncing(false);
    }
  };

  const speakRate = (p) => {
    if (!('speechSynthesis' in window)) {
      showToast('स्पीच सिंथेसाइज़र समर्थित नहीं है', 'warning');
      return;
    }
    window.speechSynthesis.cancel();

    const text = lang === 'hi'
      ? `आज ${p.mandiName} में ${p.commodityName} का मॉडल भाव ₹${p.modalPrice} प्रति क्विंटल है। न्यूनतम भाव ₹${p.minPrice} और अधिकतम भाव ₹${p.maxPrice} प्रति क्विंटल है।`
      : `Today at ${p.mandiName}, the modal price for ${p.commodityName} is ₹${p.modalPrice} per quintal. Minimum is ₹${p.minPrice} and maximum is ₹${p.maxPrice}.`;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.95;

    setSpeakingText(text);
    utterance.onend = () => setSpeakingText(null);
    utterance.onerror = () => setSpeakingText(null);

    window.speechSynthesis.speak(utterance);
  };

  const districts = [...new Set(prices.map(p => p.district))].sort();
  const commodities = [...new Set(prices.map(p => p.commodityName))].sort();

  const filteredPrices = prices.filter(p => {
    const matchDist = !district || p.district === district;
    const matchCrop = !commodity || p.commodityName === commodity;
    return matchDist && matchCrop;
  });

  return (
    <div className="tab-section">
      {/* Hero Banner */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)',
        color: 'white',
        padding: '32px',
        marginBottom: '24px',
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
            background: 'rgba(255,255,255,0.15)',
            padding: '4px 14px',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: '600',
            marginBottom: '12px'
          }}>
            <Sparkles size={14} color="#34d399" />
            <span>{lang === 'hi' ? 'मध्य प्रदेश ई-अनुज्ञा दैनिक आवक एवं Agmarknet लाइव भाव' : 'MP e-Anugya & Agmarknet Real-time Rates'}</span>
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>
            {lang === 'hi' ? 'आज का मंडी भाव जानें — सुनकर या खोजकर' : 'Discover Today’s Mandi Rates — Read or Listen'}
          </h2>
          <p style={{ color: '#d1fae5', fontSize: '0.95rem' }}>
            {lang === 'hi'
              ? 'इंटरनेट कियोस्क पर जाने की जरूरत नहीं। अपनी मंडी या फसल का नाम लिखें या 🔊 स्पीकर बटन दबाकर हिंदी में आज का भाव सुनें।'
              : 'Zero kiosk dependency. Search your mandi or crop, or click 🔊 to listen to today’s rates in spoken audio.'}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={handleSyncEAnugya}
            disabled={syncing}
            className="btn btn-emerald"
          >
            <RefreshCw size={18} className={syncing ? 'animate-spin' : ''} />
            <span>{syncing ? (lang === 'hi' ? 'सिंक हो रहा है...' : 'Syncing...') : (lang === 'hi' ? 'ई-अनुज्ञा भाव सिंक करें' : 'Sync e-Anugya Rates')}</span>
          </button>
          <a
            href="https://eanugya.mp.gov.in/Inward_Quote.aspx"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-white"
          >
            <span>🏛️ {lang === 'hi' ? 'ई-अनुज्ञा पोर्टल' : 'Official Portal'}</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-card" style={{ padding: '16px 20px', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ flex: 1, minWidth: '280px', position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={18} color="#64748b" style={{ position: 'absolute', left: '14px' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              loadPrices(e.target.value);
            }}
            placeholder={lang === 'hi' ? 'मंडी का नाम (उदा. इंदौर, उज्जैन) या फसल (गेहूं, चना, सोयाबीन)...' : 'Search Mandi or Crop...'}
            className="input-control"
            style={{ paddingLeft: '42px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <select value={district} onChange={(e) => setDistrict(e.target.value)} className="select-control" style={{ minWidth: '180px' }}>
            <option value="">{lang === 'hi' ? 'सभी जिले (All Districts)' : 'All Districts'}</option>
            {districts.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={commodity} onChange={(e) => setCommodity(e.target.value)} className="select-control" style={{ minWidth: '180px' }}>
            <option value="">{lang === 'hi' ? 'सभी फसलें (All Commodities)' : 'All Commodities'}</option>
            {commodities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Audio Reading Banner */}
      {speakingText && (
        <div style={{
          background: '#0f172a',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          borderLeft: '5px solid #10b981'
        }}>
          <div>🔊 <strong>{lang === 'hi' ? 'सुनाया जा रहा है:' : 'Speaking:'}</strong> {speakingText}</div>
          <button onClick={() => window.speechSynthesis.cancel()} className="btn btn-sm btn-rose">
            {lang === 'hi' ? 'रोकें (Stop)' : 'Stop'}
          </button>
        </div>
      )}

      {/* Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>{lang === 'hi' ? 'सरकारी ई-अनुज्ञा मंडी भाव लोड हो रहे हैं...' : 'Loading mandi prices...'}</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {filteredPrices.map(p => (
            <div key={p.id} className="glass-card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#047857', background: '#ecfdf5', padding: '3px 10px', borderRadius: '9999px' }}>
                    {p.commodityCategory}
                  </span>
                  <button
                    onClick={() => speakRate(p)}
                    style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', width: '38px', height: '38px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    title="बोलकर सुनें / Listen Rate"
                  >
                    <Volume2 size={18} color="#059669" />
                  </button>
                </div>

                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                  {p.commodityName}
                </h3>
                <div style={{ fontSize: '0.88rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
                  <Building2 size={16} />
                  <span>{p.mandiName} ({p.district})</span>
                </div>

                <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '12px', padding: '14px', textAlign: 'center', marginBottom: '14px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                    {lang === 'hi' ? 'मॉडल भाव (Modal Rate)' : 'Modal Rate'}
                  </div>
                  <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#059669', lineHeight: 1.2 }}>
                    ₹{Number(p.modalPrice).toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>
                    {lang === 'hi' ? '₹ प्रति क्विंटल' : '₹ / Quintal'}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '8px 12px', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span>{lang === 'hi' ? 'न्यूनतम:' : 'Min:'} <strong>₹{Number(p.minPrice).toLocaleString('en-IN')}</strong></span>
                  <span>{lang === 'hi' ? 'अधिकतम:' : 'Max:'} <strong>₹{Number(p.maxPrice).toLocaleString('en-IN')}</strong></span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #f1f5f9', fontSize: '0.75rem', color: '#64748b' }}>
                <span>📅 {p.arrivalDate}</span>
                <span style={{ background: '#e2e8f0', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>{p.source}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
