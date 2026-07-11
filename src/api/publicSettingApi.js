import api from './axios';

export function fetchPublicSettings() {
  return api.get('/settings').then((res) => res.data);
}
