import React, { useState, useEffect } from 'react';
import { Users, Building2, Ticket, MessageSquare, Plus, Zap, ShieldAlert } from 'lucide-react';
import { AdminService, MandiService } from '../services/api';

export default function AdminPanel({ lang, showToast }) {
  const [analytics, setAnalytics] = useState(null);
  const [mandis, setMandis] = useState([]);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Slot Form State
  const [mandiId, setMandiId] = useState('');
  const [slotType, setSlotType] = useState('FERTILIZER');
  const [itemName, setItemName] = useState('');
  const [slotDate, setSlotDate] = useState('');
  const [totalCapacity, setTotalCapacity] = useState(25);
  const [startTime, setStartTime] = useState('09:00 AM');
  const [endTime, setEndTime] = useState('12:00 PM');

  // Price Override Form State
  const [selectedPriceId, setSelectedPriceId] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [modalPrice, setModalPrice] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [aRes, mRes, pRes] = await Promise.all([
        AdminService.getAnalytics(),
        MandiService.getMandis(),
        MandiService.getPrices()
      ]);
      if (aRes.data?.success) setAnalytics(aRes.data.data);
      if (mRes.data?.success) {
        setMandis(mRes.data.data);
        if (mRes.data.data.length > 0 && !mandiId) setMandiId(mRes.data.data[0].id);
      }
      if (pRes.data?.success) setPrices(pRes.data.data);
    } catch (e) {
      showToast(lang === 'hi' ? 'एडमिन डेटा लोड करने में समस्या' : 'Failed to load admin governance data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    try {
      const res = await AdminService.createSlot({
        mandiId: Number(mandiId),
        slotType,
        itemName,
        slotDate,
        totalCapacity: Number(totalCapacity),
        startTime,
        endTime
      });
      if (res.data?.success) {
        showToast(lang === 'hi' ? '✅ नया स्लॉट कोटा सफलतापूर्वक जारी किया गया!' : '✅ New slot quota provisioned successfully!');
        setItemName('');
        loadData();
      }
    } catch (e) {
      showToast(lang === 'hi' ? 'स्लॉट निर्माण विफल' : 'Failed to provision slot', 'error');
    }
  };

  const handlePriceSelect = (e) => {
    const id = e.target.value;
    setSelectedPriceId(id);
    const p = prices.find(x => x.id === Number(id));
    if (p) {
      setMinPrice(p.minPrice);
      setMaxPrice(p.maxPrice);
      setModalPrice(p.modalPrice);
    }
  };

  const handleOverridePrice = async (e) => {
    e.preventDefault();
    if (!selectedPriceId) {
      showToast(lang === 'hi' ? 'कृपया पहले एक भाव रिकॉर्ड चुनें' : 'Please select a price record first', 'warning');
      return;
    }
    try {
      const res = await AdminService.overridePrice({
        mandiPriceId: Number(selectedPriceId),
        minPrice: Number(minPrice),
        maxPrice: Number(maxPrice),
        modalPrice: Number(modalPrice)
      });
      if (res.data?.success) {
        showToast(lang === 'hi' ? '⚡ भाव संशोधित! रेडिस कैश स्वतः निष्कासित हुआ।' : '⚡ Price override applied! Redis cache evicted.');
        loadData();
      }
    } catch (e) {
      showToast(lang === 'hi' ? 'भाव संशोधन विफल' : 'Price override failed', 'error');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>{lang === 'hi' ? 'एडमिन नियंत्रण कक्ष लोड हो रहा है...' : 'Loading Admin Control Panel...'}</p>
      </div>
    );
  }

  return (
    <div className="tab-section">
      {/* Top Banner */}
      <div className="glass-card" style={{ background: '#1e293b', color: 'white', marginBottom: '24px' }}>
        <span style={{ background: '#d97706', color: 'white', fontSize: '0.72rem', fontWeight: 800, padding: '3px 10px', borderRadius: '4px', display: 'inline-block', marginBottom: '10px' }}>
          MANDI GOVERNANCE & CONTROL PANEL
        </span>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '6px' }}>
          {lang === 'hi' ? 'मंडी सचिव एवं प्रशासक नियंत्रण कक्ष' : 'Mandi Administrator Control Panel'}
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
          {lang === 'hi'
            ? 'दैनिक टोकन कोटा निर्माण, आपातकालीन भाव संशोधन (रेडिस कैश निष्कासन) तथा लाइव एसएमएस ऑडिट ट्रैकिंग।'
            : 'Slot capacity provisioning, emergency price override (Redis cache eviction), and outbound SMS audit trail.'}
        </p>
      </div>

      {/* Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '24px' }}>
        <div className="glass-card" style={{ textAlign: 'center', padding: '20px' }}>
          <Users size={32} color="#059669" style={{ margin: '0 auto 6px' }} />
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#059669' }}>{analytics?.totalUsers || 0}</div>
          <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>
            {lang === 'hi' ? 'पंजीकृत किसान' : 'Registered Farmers'}
          </div>
        </div>
        <div className="glass-card" style={{ textAlign: 'center', padding: '20px' }}>
          <Building2 size={32} color="#059669" style={{ margin: '0 auto 6px' }} />
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#059669' }}>{analytics?.totalMandis || 0}</div>
          <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>
            {lang === 'hi' ? 'सक्रिय मंडियां' : 'Active Mandis'}
          </div>
        </div>
        <div className="glass-card" style={{ textAlign: 'center', padding: '20px' }}>
          <Ticket size={32} color="#059669" style={{ margin: '0 auto 6px' }} />
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#059669' }}>{analytics?.totalConfirmedBookings || 0}</div>
          <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>
            {lang === 'hi' ? 'सफलतापूर्वक बुक टोकन' : 'Tokens Reserved'}
          </div>
        </div>
        <div className="glass-card" style={{ textAlign: 'center', padding: '20px' }}>
          <MessageSquare size={32} color="#059669" style={{ margin: '0 auto 6px' }} />
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#059669' }}>{analytics?.recentSmsLogs?.length || 0}</div>
          <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>
            {lang === 'hi' ? 'एसएमएस अलर्ट्स प्रेषित' : 'SMS Alerts Sent'}
          </div>
        </div>
      </div>

      {/* Admin Action Forms */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        {/* Create Slot Form */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '6px' }}>
            ➕ {lang === 'hi' ? 'नया स्लॉट कोटा जारी करें' : 'Provision New Slot Quota'}
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '16px' }}>
            {lang === 'hi' ? 'खाद या तुलाई के लिए सीमित टोकन संख्या आवंटित करें' : 'Allocate token capacity for fertilizer distribution or crop intake'}
          </p>

          <form onSubmit={handleCreateSlot} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                  {lang === 'hi' ? 'मंडी चयन' : 'Select Mandi'}
                </label>
                <select value={mandiId} onChange={(e) => setMandiId(e.target.value)} required className="select-control">
                  {mandis.map(m => <option key={m.id} value={m.id}>{m.name} ({m.district})</option>)}
                </select>
              </div>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                  {lang === 'hi' ? 'टोकन श्रेणी' : 'Token Category'}
                </label>
                <select value={slotType} onChange={(e) => setSlotType(e.target.value)} required className="select-control">
                  <option value="FERTILIZER">{lang === 'hi' ? 'खाद वितरण (FERTILIZER)' : 'Fertilizer Distribution (FERTILIZER)'}</option>
                  <option value="CROP_SELLING">{lang === 'hi' ? 'फसल उपार्जन (CROP_SELLING)' : 'Crop Procurement (CROP_SELLING)'}</option>
                  <option value="WAREHOUSE">{lang === 'hi' ? 'गोदाम भंडारण (WAREHOUSE)' : 'Warehouse Storage (WAREHOUSE)'}</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                {lang === 'hi' ? 'सुविधा / सामग्री का नाम' : 'Item / Commodity Name'}
              </label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder={lang === 'hi' ? 'उदा. डीएपी खाद (50 किग्रा बोरी)' : 'e.g. DAP Fertilizer (50kg Bag)'}
                required
                className="input-control"
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '180px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                  {lang === 'hi' ? 'दिनांक' : 'Date'}
                </label>
                <input type="date" value={slotDate} onChange={(e) => setSlotDate(e.target.value)} required className="input-control" />
              </div>
              <div style={{ flex: 1, minWidth: '180px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                  {lang === 'hi' ? 'कुल टोकन संख्या (Capacity)' : 'Total Capacity (Tokens)'}
                </label>
                <input type="number" min="1" max="1000" value={totalCapacity} onChange={(e) => setTotalCapacity(e.target.value)} required className="input-control" />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '180px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                  {lang === 'hi' ? 'प्रारंभ समय' : 'Start Time'}
                </label>
                <input type="text" value={startTime} onChange={(e) => setStartTime(e.target.value)} required className="input-control" />
              </div>
              <div style={{ flex: 1, minWidth: '180px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                  {lang === 'hi' ? 'समाप्ति समय' : 'End Time'}
                </label>
                <input type="text" value={endTime} onChange={(e) => setEndTime(e.target.value)} required className="input-control" />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              <Plus size={18} />
              <span>{lang === 'hi' ? 'टोकन स्लॉट जारी करें' : 'Issue Token Slot'}</span>
            </button>
          </form>
        </div>

        {/* Override Price Form */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '6px' }}>
            ⚡ {lang === 'hi' ? 'आपातकालीन मंडी भाव संशोधन' : 'Emergency Mandi Price Override'}
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '16px' }}>
            {lang === 'hi' ? 'संशोधन करते ही तुरंत रेडिस कैश स्वतः निष्कासित हो जाएगा' : 'Direct database update; Redis cache is evicted immediately'}
          </p>

          <form onSubmit={handleOverridePrice} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                {lang === 'hi' ? 'संशोधन हेतु भाव रिकॉर्ड चुनें' : 'Select Price Record to Override'}
              </label>
              <select value={selectedPriceId} onChange={handlePriceSelect} required className="select-control">
                <option value="">{lang === 'hi' ? '-- भाव रिकॉर्ड चुनें --' : '-- Select Price Record --'}</option>
                {prices.map(p => (
                  <option key={p.id} value={p.id}>{p.mandiName} - {p.commodityName}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '120px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                  {lang === 'hi' ? 'न्यूनतम भाव (₹)' : 'Min Price (₹)'}
                </label>
                <input type="number" step="0.5" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} required className="input-control" />
              </div>
              <div style={{ flex: 1, minWidth: '120px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                  {lang === 'hi' ? 'अधिकतम भाव (₹)' : 'Max Price (₹)'}
                </label>
                <input type="number" step="0.5" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} required className="input-control" />
              </div>
              <div style={{ flex: 1, minWidth: '120px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                  {lang === 'hi' ? 'मॉडल भाव (₹)' : 'Modal Price (₹)'}
                </label>
                <input type="number" step="0.5" value={modalPrice} onChange={(e) => setModalPrice(e.target.value)} required className="input-control" />
              </div>
            </div>

            <button type="submit" className="btn btn-amber btn-block" style={{ marginTop: 'auto' }}>
              <Zap size={18} />
              <span>{lang === 'hi' ? 'भाव अपडेट करें एवं कैश हटाएं' : 'Update Price & Evict Cache'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Recent SMS Audit Logs */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '6px' }}>
          📱 {lang === 'hi' ? 'हाल ही में भेजे गए एसएमएस ऑडिट लॉग्स' : 'Recent SMS Dispatch Audit Logs'}
        </h3>
        <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '16px' }}>
          {lang === 'hi' ? 'प्रत्येक किसान को भेजे गए द्वैभाषिक संदेश की पुष्टि' : 'Verification of bilingual SMS alerts dispatched to farmers'}
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                <th style={{ padding: '10px 14px' }}>{lang === 'hi' ? 'समय' : 'Time'}</th>
                <th style={{ padding: '10px 14px' }}>{lang === 'hi' ? 'मोबाइल' : 'Mobile'}</th>
                <th style={{ padding: '10px 14px' }}>{lang === 'hi' ? 'स्थिति' : 'Status'}</th>
                <th style={{ padding: '10px 14px' }}>{lang === 'hi' ? 'एसएमएस संदेश' : 'SMS Message'}</th>
              </tr>
            </thead>
            <tbody>
              {analytics?.recentSmsLogs?.length > 0 ? (
                analytics.recentSmsLogs.map(log => (
                  <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 14px' }}>{new Date(log.sentAt).toLocaleTimeString()}</td>
                    <td style={{ padding: '10px 14px' }}><strong>{log.phone}</strong></td>
                    <td style={{ padding: '10px 14px', color: '#059669', fontWeight: 700 }}>{log.status}</td>
                    <td style={{ padding: '10px 14px', maxWidth: '450px' }}>{log.message}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>
                    {lang === 'hi' ? 'कोई एसएमएस लॉग उपलब्ध नहीं है' : 'No SMS audit logs recorded yet'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
