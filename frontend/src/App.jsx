import React, { useState, useEffect } from 'react';
import { Sprout, Globe, LogIn, LogOut, Ticket, Store, Shield, ClipboardList } from 'lucide-react';
import MandiRatesView from './components/MandiRatesView';
import SlotBookingView from './components/SlotBookingView';
import MyBookingsView from './components/MyBookingsView';
import AdminPanel from './components/AdminPanel';
import DigitalReceiptModal from './components/DigitalReceiptModal';
import AuthModal from './components/AuthModal';
import LoginPage from './components/LoginPage';

export default function App() {
  const [lang, setLang] = useState(() => {
    const savedUser = localStorage.getItem('krishione_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.preferredLanguage) return parsed.preferredLanguage;
      } catch (e) {}
    }
    return localStorage.getItem('krishione_lang') || 'hi';
  });

  const [activeTab, setActiveTab] = useState('mandiprices');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('krishione_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [guestMode, setGuestMode] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [receiptBooking, setReceiptBooking] = useState(null);
  const [toasts, setToasts] = useState([]);

  const handleSetLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem('krishione_lang', newLang);
  };

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleLoginSuccess = (userData) => {
    const userObj = {
      id: userData.userId,
      phone: userData.phone,
      name: userData.name,
      role: userData.role,
      preferredLanguage: userData.preferredLanguage || lang
    };
    setUser(userObj);
    if (userData.preferredLanguage) {
      handleSetLang(userData.preferredLanguage);
    } else {
      handleSetLang(lang);
    }
    localStorage.setItem('krishione_token', userData.token);
    localStorage.setItem('krishione_user', JSON.stringify(userObj));
    setGuestMode(false);
  };

  const handleLogout = () => {
    setUser(null);
    setGuestMode(false);
    localStorage.removeItem('krishione_token');
    localStorage.removeItem('krishione_user');
    showToast(lang === 'hi' ? 'लॉगआउट संपन्न' : 'Logged out successfully');
    setActiveTab('mandiprices');
  };

  const handleTabClick = (tab) => {
    if (tab === 'admin') {
      if (!user || (user.role !== 'MANDI_ADMIN' && user.role !== 'SUPER_ADMIN')) {
        showToast(lang === 'hi' ? '⚠️ पहले मंडी सचिव या सुपर एडमिन से लॉगिन करें।' : '⚠️ Please login as Mandi Admin or Super Admin first.', 'warning');
        setAuthModalOpen(true);
        return;
      }
    }
    if (tab === 'mybookings' && !user) {
      showToast(lang === 'hi' ? '⚠️ पहले लॉगिन करें।' : '⚠️ Please login first.', 'warning');
      setAuthModalOpen(true);
      return;
    }
    setActiveTab(tab);
  };

  // If user is not logged in and not browsing as guest, show LoginPage first!
  if (!user && !guestMode) {
    return (
      <>
        <LoginPage
          lang={lang}
          setLang={handleSetLang}
          onLoginSuccess={handleLoginSuccess}
          onBrowseGuest={() => {
            setGuestMode(true);
            showToast(lang === 'hi' ? '👀 अतिथि मोड: केवल भाव देखने हेतु' : '👀 Guest mode: view rates only');
          }}
          showToast={showToast}
        />
        {/* Toast Notifications */}
        <div className="toast-container">
          {toasts.map(t => (
            <div key={t.id} className="toast" style={{ borderLeftColor: t.type === 'error' ? 'var(--rose)' : t.type === 'warning' ? 'var(--amber)' : '#10b981' }}>
              {t.message}
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <div>
      {/* Top Banner */}
      <div className="gov-topbar">
        <div className="container topbar-content">
          <div className="topbar-left">
            <span className="emblem-dot"></span>
            <span>{lang === 'hi' ? 'मध्यप्रदेश शासन • कृषि उपज मंडी समिति (e-Anugya & Agmarknet एकीकृत)' : 'Government of MP • Agricultural Marketing Board'}</span>
          </div>
          <div className="topbar-right">
            <button onClick={() => handleSetLang(lang === 'hi' ? 'en' : 'hi')} className="lang-btn">
              <Globe size={14} />
              <span>{lang === 'hi' ? 'English में देखें' : 'हिंदी में देखें'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="app-header">
        <div className="container header-container">
          <div className="brand">
            <div className="brand-logo">
              <Sprout size={28} />
            </div>
            <div>
              <h1 className="brand-title">कृषि-वन <span className="badge-v2">v2.0</span></h1>
              <p className="brand-subtitle">{lang === 'hi' ? 'किसानों का अपना संपूर्ण मंडी भाव एवं टोकन पोर्टल' : 'Unified Agricultural Portal & Slot System'}</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="main-nav">
            <button
              onClick={() => handleTabClick('mandiprices')}
              className={`nav-tab ${activeTab === 'mandiprices' ? 'active' : ''}`}
            >
              <Store size={18} />
              <span>{lang === 'hi' ? 'दैनिक मंडी भाव' : 'Mandi Rates'}</span>
            </button>
            <button
              onClick={() => handleTabClick('slots')}
              className={`nav-tab ${activeTab === 'slots' ? 'active' : ''}`}
            >
              <Ticket size={18} />
              <span>{lang === 'hi' ? 'खाद व तुलाई टोकन' : 'Tokens'}</span>
            </button>
            <button
              onClick={() => handleTabClick('mybookings')}
              className={`nav-tab ${activeTab === 'mybookings' ? 'active' : ''}`}
            >
              <ClipboardList size={18} />
              <span>{lang === 'hi' ? 'मेरी रसीदें' : 'My Passes'}</span>
            </button>
            <button
              onClick={() => handleTabClick('admin')}
              className={`nav-tab ${activeTab === 'admin' ? 'active' : ''}`}
            >
              <Shield size={18} />
              <span>{lang === 'hi' ? 'प्रशासन' : 'Admin'}</span>
            </button>
          </nav>

          {/* User Section */}
          <div>
            {user ? (
              <div className="user-badge">
                <div className="avatar-circle">{user.name.charAt(0)}</div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span className="user-name">{user.name}</span>
                  <span className="user-role-badge">{user.role}</span>
                </div>
                <button onClick={handleLogout} className="btn-icon-logout" title="Logout">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button onClick={() => setAuthModalOpen(true)} className="btn btn-outline">
                <LogIn size={16} />
                <span>{lang === 'hi' ? 'लॉगिन / पंजीयन' : 'Login / Register'}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="container main-content">
        {activeTab === 'mandiprices' && (
          <MandiRatesView lang={lang} showToast={showToast} />
        )}
        {activeTab === 'slots' && (
          <SlotBookingView
            lang={lang}
            user={user}
            onLoginRequired={() => setAuthModalOpen(true)}
            onBookingConfirmed={(booking) => setReceiptBooking(booking)}
            showToast={showToast}
          />
        )}
        {activeTab === 'mybookings' && (
          <MyBookingsView
            lang={lang}
            user={user}
            onShowReceipt={(booking) => setReceiptBooking(booking)}
            showToast={showToast}
          />
        )}
        {activeTab === 'admin' && (
          <AdminPanel lang={lang} showToast={showToast} />
        )}
      </main>

      {/* Modals */}
      {receiptBooking && (
        <DigitalReceiptModal
          booking={receiptBooking}
          onClose={() => setReceiptBooking(null)}
          lang={lang}
        />
      )}

      {authModalOpen && (
        <AuthModal
          onClose={() => setAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
          lang={lang}
          showToast={showToast}
        />
      )}

      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className="toast" style={{ borderLeftColor: t.type === 'error' ? 'var(--rose)' : t.type === 'warning' ? 'var(--amber)' : '#10b981' }}>
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}

