import api from './axios';
import { buildFormData } from '../utils/buildFormData';

export function fetchSettings() {
  return api.get('/admin/settings').then((res) => res.data);
}

export function updateSettings(payload) {
  return api
    .post('/admin/settings', buildFormData({ ...payload, _method: 'PUT' }))
    .then((res) => res.data);
}
