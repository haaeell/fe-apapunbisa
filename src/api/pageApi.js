import api from './axios';
import { buildFormData } from '../utils/buildFormData';

export function fetchLandingPage() {
  return api.get('/admin/pages').then((res) => res.data);
}

export function updateLandingPage(payload) {
  return api
    .post('/admin/pages', buildFormData({ ...payload, _method: 'PUT' }))
    .then((res) => res.data);
}
