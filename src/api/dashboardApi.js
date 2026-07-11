import api from './axios';

export function fetchDashboard() {
  return api.get('/admin/dashboard').then((res) => res.data);
}
