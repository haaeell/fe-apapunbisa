import api from './axios';

export function login(credentials) {
  return api.post('/admin/login', credentials).then((res) => res.data);
}

export function logout() {
  return api.post('/admin/logout').then((res) => res.data);
}

export function fetchProfile() {
  return api.get('/admin/profile').then((res) => res.data);
}
