import React, { useState } from 'react';
import { X, Lock, Phone, User, Globe, ShieldCheck } from 'lucide-react';
import { AuthService } from '../services/api';

export default function AuthModal({ onClose, onLoginSuccess, lang, showToast }) {
  const [isRegister, setIsRegister] = useState(false);
  const [phone, setPhone] = useState('9876543210');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');
  const [role, setRole] = useState('FARMER');
  const [preferredLang, setPreferredLang] = useState('hi');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let res;
      if (isRegister) {
        if (!name.trim()) {
          showToast(lang === 'hi' ? 'कृपया अपना नाम दर्ज करें' : 'Please enter your name', 'warning');
          setLoading(false);
          return;
        }
        res = await AuthService.register(phone, password, name, role, preferredLang);
      } else {
        res = await AuthService.login(phone, password);
      }
      if (res.data.success) {
        onLoginSuccess(res.data.data);
        onClose();
        showToast(lang === 'hi' ? `✅ स्वागत है, ${res.data.data.name}!` : `✅ Welcome, ${res.data.data.name}!`);
      }
    } catch (e) {
      const err = e.response?.data?.message || (lang === 'hi' ? 'प्रमाणीकरण विफल रहा' : 'Authentication failed');
      showToast(`❌ ${err}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fillCreds = (p, pass) => {
    setPhone(p);
    setPassword(pass);
  };

  return (
    <div className="modal-overlay">
      <div className="glass-modal" style={{ maxWidth: '440px', padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
              {isRegister 
                ? (lang === 'hi' ? 'नया खाता पंजीयन' : 'Account Registration') 
                : (lang === 'hi' ? 'पोर्टल लॉगिन / प्रवेश' : 'Sign In / Login')}
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
              {isRegister
                ? (lang === 'hi' ? 'अपनी भूमिका व विवरण भरकर खाता बनाएं' : 'Select role and details to register')
                : (lang === 'hi' ? 'टोकन व सेवाओं हेतु 10-अंकीय मोबाइल नंबर से लॉगिन करें' : 'Sign in with your 10-digit mobile number')}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={22} color="#64748b" />
          </button>
        </div>

        {/* Demo Quick Selectors (Login mode only) */}
        {!isRegister && (
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '8px', marginBottom: '18px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '6px' }}>
              {lang === 'hi' ? 'परीक्षण हेतु त्वरित खाता चुनें:' : 'Quick Test Account Preset:'}
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button type="button" onClick={() => fillCreds('9876543210', 'password123')} className="btn btn-outline btn-sm" style={{ flex: 1 }}>
                👨‍🌾 {lang === 'hi' ? 'किसान' : 'Farmer'}
              </button>
              <button type="button" onClick={() => fillCreds('9876543211', 'password123')} className="btn btn-outline btn-sm" style={{ flex: 1 }}>
                👮 {lang === 'hi' ? 'मंडी प्रभारी' : 'Admin'}
              </button>
              <button type="button" onClick={() => fillCreds('9876543212', 'password123')} className="btn btn-outline btn-sm" style={{ flex: 1 }}>
                🏛️ {lang === 'hi' ? 'सुपर एडमिन' : 'Super'}
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {isRegister && (
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <ShieldCheck size={14} color="#059669" /> {lang === 'hi' ? 'खाता प्रकार / भूमिका चुनें:' : 'Select Account Role:'}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => setRole('FARMER')}
                  className={`btn btn-sm ${role === 'FARMER' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ padding: '6px 2px', fontSize: '0.76rem' }}
                >
                  👨‍🌾 {lang === 'hi' ? 'किसान' : 'Farmer'}
                </button>
                <button
                  type="button"
                  onClick={() => setRole('MANDI_ADMIN')}
                  className={`btn btn-sm ${role === 'MANDI_ADMIN' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ padding: '6px 2px', fontSize: '0.76rem' }}
                >
                  👮 {lang === 'hi' ? 'मंडी सचिव' : 'Admin'}
                </button>
                <button
                  type="button"
                  onClick={() => setRole('SUPER_ADMIN')}
                  className={`btn btn-sm ${role === 'SUPER_ADMIN' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ padding: '6px 2px', fontSize: '0.76rem' }}
                >
                  🏛️ {lang === 'hi' ? 'सुपर एडमिन' : 'Super'}
                </button>
              </div>
            </div>
          )}

          {isRegister && (
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={14} /> {lang === 'hi' ? 'पूरा नाम (Full Name)' : 'Full Name'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={lang === 'hi' ? "उदा. रमेश पटेल" : "e.g. Ramesh Patel"}
                required
                className="input-control"
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={14} /> 10-अंकीय मोबाइल नंबर
            </label>
            <input
              type="tel"
              maxLength="10"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="9876543210"
              required
              className="input-control"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={14} /> पासवर्ड
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="input-control"
            />
          </div>

          {isRegister && (
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Globe size={14} /> पसंदीदा भाषा
              </label>
              <select value={preferredLang} onChange={(e) => setPreferredLang(e.target.value)} className="select-control">
                <option value="hi">हिंदी (Hindi)</option>
                <option value="en">English</option>
              </select>
            </div>
          )}

          <button type="submit" disabled={loading} className="btn btn-primary btn-block">
            {loading ? 'कृपया प्रतीक्षा करें...' : isRegister ? 'खाता बनाएं (Register)' : 'लॉगिन करें'}
          </button>
        </form>

        <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
          <span>{isRegister ? 'पहले से खाता है?' : 'क्या आपका खाता नहीं है?'}</span>
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            style={{ background: 'none', border: 'none', color: '#059669', fontWeight: 700, cursor: 'pointer', marginLeft: '6px' }}
          >
            {isRegister ? 'लॉगिन करें' : 'नया किसान पंजीयन करें'}
          </button>
        </div>
      </div>
    </div>
  );
}
