import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('krishione_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const MandiService = {
  getPrices: (query = '') => api.get(query ? `/mandiprices/search?q=${encodeURIComponent(query)}` : '/mandiprices/search'),
  getMandis: () => api.get('/mandiprices/mandis'),
  getCommodities: () => api.get('/mandiprices/commodities'),
  syncEAnugya: () => api.post('/mandiprices/sync-eanugya'),
  syncDataGov: () => api.post('/mandiprices/sync')
};

export const SlotService = {
  getSlots: (mandiId, type, date) => {
    let url = '/slots';
    const params = new URLSearchParams();
    if (mandiId) params.append('mandiId', mandiId);
    if (type) params.append('type', type);
    if (date) params.append('date', date);
    if (params.toString()) url += `?${params.toString()}`;
    return api.get(url);
  },
  bookSlot: (slotId) => api.post('/slots/book', { slotId }),
  getMyBookings: () => api.get('/slots/my-bookings'),
  cancelBooking: (bookingId) => api.post(`/slots/cancel/${bookingId}`)
};

export const AuthService = {
  login: (phone, password) => api.post('/auth/login', { phone, password }),
  register: (phone, password, name, role = 'FARMER', preferredLanguage = 'hi') =>
    api.post('/auth/register', { phone, password, name, role, preferredLanguage }),
  getProfile: () => api.get('/auth/me')
};

export const AdminService = {
  getAnalytics: () => api.get('/admin/analytics'),
  createSlot: (data) => api.post('/admin/slots', data),
  overridePrice: (data) => api.put('/admin/prices', data)
};

export default api;
