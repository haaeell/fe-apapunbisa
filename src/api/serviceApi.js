import api from './axios';
import { buildFormData } from '../utils/buildFormData';

export function fetchServices(params = {}) {
  return api.get('/admin/services', { params }).then((res) => res.data);
}

export function fetchService(id) {
  return api.get(`/admin/services/${id}`).then((res) => res.data);
}

export function createService(payload) {
  return api.post('/admin/services', buildFormData(payload)).then((res) => res.data);
}

export function updateService(id, payload) {
  return api
    .post(`/admin/services/${id}`, buildFormData({ ...payload, _method: 'PUT' }))
    .then((res) => res.data);
}

export function deleteService(id) {
  return api.delete(`/admin/services/${id}`).then((res) => res.data);
}
