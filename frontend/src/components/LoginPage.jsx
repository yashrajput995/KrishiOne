import React, { useState } from 'react';
import { Sprout, Globe, User, Phone, Lock, CheckCircle2, ShieldCheck, Store, Ticket, Smartphone, LogIn, ArrowRight } from 'lucide-react';
import { AuthService } from '../services/api';

export default function LoginPage({ lang, setLang, onLoginSuccess, onBrowseGuest, showToast }) {
  const [isRegister, setIsRegister] = useState(false);
  const [phone, setPhone] = useState('9876543210');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');
  const [role, setRole] = useState('FARMER');
  const [loading, setLoading] = useState(false);

  const handleLanguageSelect = (selectedLang) => {
    setLang(selectedLang);
    localStorage.setItem('krishione_lang', selectedLang);
  };

  const fillCreds = (p, pass) => {
    setPhone(p);
    setPassword(pass);
  };

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
        res = await AuthService.register(phone, password, name, role, lang);
      } else {
        res = await AuthService.login(phone, password);
      }

      if (res.data.success) {
        const userData = res.data.data;
        // If user logged in and has a language preference saved, or sync active session language
        onLoginSuccess(userData);
        showToast(
          lang === 'hi'
            ? `✅ स्वागत है, ${userData.name}!`
            : `✅ Welcome back, ${userData.name}!`
        );
      }
    } catch (e) {
      const err = e.response?.data?.message || (lang === 'hi' ? 'प्रमाणीकरण विफल रहा' : 'Authentication failed');
      showToast(`❌ ${err}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const t = {
    hi: {
      govBadge: "मध्यप्रदेश शासन • राज्य कृषि विपणन बोर्ड (e-Anugya & Agmarknet)",
      portalTitle: "कृषि-वन",
      portalSub: "KrishiOne Agricultural Portal",
      headline: "किसानों का अपना संपूर्ण डिजिटल मंडी एवं खाद टोकन सेवा केंद्र",
      subtext: "मध्य प्रदेश की सभी मंडियों के दैनिक सत्यापित भाव जानें, बोलकर सुनें, तथा खाद एवं फसल विक्रय के लिए 100% सुरक्षित अग्रिम टोकन आरक्षित करें।",
      featRatesTitle: "दैनिक सत्यापित मंडी भाव",
      featRatesDesc: "ई-अनुज्ञा एवं Agmarknet के वास्तविक आंकड़े, ऑडियो रीडआउट के साथ।",
      featSlotsTitle: "शून्य डबल-बुकिंग खाद टोकन",
      featSlotsDesc: "4-स्तरीय लॉकिंग (रेडिस + डीबी रो लॉक) द्वारा खाद वितरण में पूर्ण पारदर्शिता।",
      featPassTitle: "डिजिटल गेट-पास व क्यूआर रसीद",
      featPassDesc: "मंडी प्रवेश द्वार पर त्वरित सत्यापन हेतु फोन पर तत्काल रसीद व एसएमएस।",
      langPrompt: "🌐 अपनी पसंदीदा भाषा चुनें / Choose Your Preferred Language:",
      formTitleLogin: "पोर्टल लॉगिन / प्रवेश",
      formTitleRegister: "नया खाता पंजीयन",
      formSubLogin: "अपने 10-अंकीय मोबाइल नंबर व पासवर्ड से प्रवेश करें",
      formSubRegister: "अपनी भूमिका, नाम, मोबाइल नंबर व पासवर्ड भरकर तत्काल खाता बनाएं",
      demoPresetLabel: "परीक्षण हेतु त्वरित खाता चुनें (Quick Test Preset):",
      lblSelectRole: "पंजीयन हेतु भूमिका / पद चुनें:",
      lblFarmer: "👨‍🌾 किसान",
      lblAdmin: "👮 मंडी सचिव",
      lblSuper: "🏛️ सुपर एडमिन",
      lblName: "पूरा नाम (Full Name)",
      lblPhone: "10-अंकीय मोबाइल नंबर",
      lblPassword: "पासवर्ड",
      phName: "उदा. रमेश पटेल",
      phPhone: "9876543210",
      btnSubmitLogin: "लॉगिन करें (Sign In)",
      btnSubmitRegister: "खाता बनाएं (Register)",
      toggleTextLogin: "क्या आपका खाता नहीं है?",
      toggleBtnLogin: "नया खाता पंजीयन करें",
      toggleTextRegister: "पहले से खाता है?",
      toggleBtnRegister: "लॉगिन करें (Sign In)",
      browseGuest: "👀 अतिथि के रूप में केवल मंडी भाव देखें (Browse Rates as Guest)"
    },
    en: {
      govBadge: "Government of MP • Agricultural Marketing Board (e-Anugya & Agmarknet Integrated)",
      portalTitle: "KrishiOne",
      portalSub: "Unified Agricultural Portal & Slot System",
      headline: "Dedicated Digital Mandi Rates & Fertilizer Token Center for Farmers",
      subtext: "Explore official daily verified mandi rates across Madhya Pradesh, listen via spoken audio, and reserve 100% verified tokens for fertilizer and crop selling.",
      featRatesTitle: "Daily Verified Mandi Rates",
      featRatesDesc: "Real-time e-Anugya & Agmarknet government data with audio readout.",
      featSlotsTitle: "Zero Double-Booking Tokens",
      featSlotsDesc: "4-tier concurrency locking (Redis + DB Row Lock) for transparent distribution.",
      featPassTitle: "Digital Gate Pass & QR Receipt",
      featPassDesc: "Instant verifiable SMS confirmation and digital pass for gate entry.",
      langPrompt: "🌐 Choose Your Preferred Language / अपनी पसंदीदा भाषा चुनें:",
      formTitleLogin: "Sign In / Portal Login",
      formTitleRegister: "Account Registration",
      formSubLogin: "Enter your 10-digit mobile number and password to sign in",
      formSubRegister: "Select role, full name, phone number, and password to register",
      demoPresetLabel: "Quick Test Account Preset:",
      lblSelectRole: "Select Account Role:",
      lblFarmer: "👨‍🌾 Farmer",
      lblAdmin: "👮 Mandi Admin",
      lblSuper: "🏛️ Super Admin",
      lblName: "Full Name",
      lblPhone: "10-Digit Mobile Number",
      lblPassword: "Password",
      phName: "e.g. Ramesh Patel",
      phPhone: "9876543210",
      btnSubmitLogin: "Sign In",
      btnSubmitRegister: "Create Account",
      toggleTextLogin: "Don't have an account?",
      toggleBtnLogin: "Register New Account",
      toggleTextRegister: "Already have an account?",
      toggleBtnRegister: "Sign In",
      browseGuest: "👀 Browse Mandi Rates as Guest"
    }
  }[lang || 'hi'];

  return (
    <div className="auth-gateway-screen">
      <div className="gateway-container">
        {/* Left Branding & Highlights */}
        <div className="gateway-hero">
          <div className="gov-badge-pill">
            <span className="emblem-dot"></span>
            <span>{t.govBadge}</span>
          </div>

          <div className="brand-hero-block">
            <div className="brand-hero-icon">
              <Sprout size={36} color="#ffffff" />
            </div>
            <div>
              <h1 className="gateway-brand-title">{t.portalTitle} <span className="badge-v2">v2.0</span></h1>
              <p className="gateway-brand-subtitle">{t.portalSub}</p>
            </div>
          </div>

          <h2 className="gateway-headline">{t.headline}</h2>
          <p className="gateway-subtext">{t.subtext}</p>

          <div className="gateway-features">
            <div className="feat-item">
              <div className="feat-icon">🌾</div>
              <div>
                <strong>{t.featRatesTitle}</strong>
                <p>{t.featRatesDesc}</p>
              </div>
            </div>
            <div className="feat-item">
              <div className="feat-icon">🛡️</div>
              <div>
                <strong>{t.featSlotsTitle}</strong>
                <p>{t.featSlotsDesc}</p>
              </div>
            </div>
            <div className="feat-item">
              <div className="feat-icon">📱</div>
              <div>
                <strong>{t.featPassTitle}</strong>
                <p>{t.featPassDesc}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Auth Card */}
        <div className="gateway-card glass-card">
          {/* STEP 1: LANGUAGE SELECTION CARDS */}
          <div className="lang-selector-box">
            <label className="lang-selector-title">{t.langPrompt}</label>
            <div className="lang-cards-grid">
              <button
                type="button"
                className={`lang-choice-card ${lang === 'hi' ? 'active' : ''}`}
                onClick={() => handleLanguageSelect('hi')}
              >
                <span className="lang-main">हिंदी</span>
                <span className="lang-sub">सम्पूर्ण पोर्टल हिंदी में</span>
                {lang === 'hi' && <span className="check-mark">✓</span>}
              </button>
              <button
                type="button"
                className={`lang-choice-card ${lang === 'en' ? 'active' : ''}`}
                onClick={() => handleLanguageSelect('en')}
              >
                <span className="lang-main">English</span>
                <span className="lang-sub">Complete portal in English</span>
                {lang === 'en' && <span className="check-mark">✓</span>}
              </button>
            </div>
          </div>

          {/* STEP 2: LOGIN / REGISTER FORM */}
          <div className="gateway-form-header">
            <h3>{isRegister ? t.formTitleRegister : t.formTitleLogin}</h3>
            <p>{isRegister ? t.formSubRegister : t.formSubLogin}</p>
          </div>

          {/* Quick Demo Preset Selectors (Shown in Login mode) */}
          {!isRegister && (
            <div className="demo-presets-box">
              <span className="demo-preset-label">{t.demoPresetLabel}</span>
              <div className="demo-btn-group">
                <button
                  type="button"
                  onClick={() => fillCreds('9876543210', 'password123')}
                  className="btn btn-outline btn-sm"
                >
                  {t.lblFarmer}
                </button>
                <button
                  type="button"
                  onClick={() => fillCreds('9876543211', 'password123')}
                  className="btn btn-outline btn-sm"
                >
                  {t.lblAdmin}
                </button>
                <button
                  type="button"
                  onClick={() => fillCreds('9876543212', 'password123')}
                  className="btn btn-outline btn-sm"
                >
                  {t.lblSuper}
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {isRegister && (
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <ShieldCheck size={16} color="#059669" /> {t.lblSelectRole}
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setRole('FARMER')}
                    className={`btn btn-sm ${role === 'FARMER' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ padding: '8px 2px', fontSize: '0.78rem' }}
                  >
                    {t.lblFarmer}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('MANDI_ADMIN')}
                    className={`btn btn-sm ${role === 'MANDI_ADMIN' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ padding: '8px 2px', fontSize: '0.78rem' }}
                  >
                    {t.lblAdmin}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('SUPER_ADMIN')}
                    className={`btn btn-sm ${role === 'SUPER_ADMIN' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ padding: '8px 2px', fontSize: '0.78rem' }}
                  >
                    {t.lblSuper}
                  </button>
                </div>
              </div>
            )}

            {isRegister && (
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={14} /> {t.lblName}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.phName}
                  required
                  className="input-control"
                />
              </div>
            )}

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={14} /> {t.lblPhone}
              </label>
              <input
                type="tel"
                maxLength="10"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t.phPhone}
                required
                className="input-control"
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lock size={14} /> {t.lblPassword}
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

            <button type="submit" disabled={loading} className="btn btn-primary btn-block">
              {loading ? (lang === 'hi' ? 'कृपया प्रतीक्षा करें...' : 'Please wait...') : isRegister ? t.btnSubmitRegister : t.btnSubmitLogin}
            </button>
          </form>

          {/* Toggle Register/Login */}
          <div className="gateway-toggle-footer">
            <span>{isRegister ? t.toggleTextRegister : t.toggleTextLogin}</span>
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="gateway-toggle-btn"
            >
              {isRegister ? t.toggleBtnRegister : t.toggleBtnLogin}
            </button>
          </div>

          {/* Browse as Guest Option */}
          <button
            type="button"
            onClick={onBrowseGuest}
            className="btn-browse-guest"
          >
            <span>{t.browseGuest}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
