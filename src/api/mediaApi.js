import api from './axios';
import { buildFormData } from '../utils/buildFormData';

export function fetchMedia(params = {}) {
  return api.get('/admin/media', { params }).then((res) => res.data);
}

export function uploadMedia(payload) {
  return api.post('/admin/media', buildFormData(payload)).then((res) => res.data);
}

export function deleteMedia(id) {
  return api.delete(`/admin/media/${id}`).then((res) => res.data);
}
