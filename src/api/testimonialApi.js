import api from './axios';
import { buildFormData } from '../utils/buildFormData';

export function fetchTestimonials(params = {}) {
  return api.get('/admin/testimonials', { params }).then((res) => res.data);
}

export function fetchTestimonial(id) {
  return api.get(`/admin/testimonials/${id}`).then((res) => res.data);
}

export function createTestimonial(payload) {
  return api.post('/admin/testimonials', buildFormData(payload)).then((res) => res.data);
}

export function updateTestimonial(id, payload) {
  return api
    .post(`/admin/testimonials/${id}`, buildFormData({ ...payload, _method: 'PUT' }))
    .then((res) => res.data);
}

export function deleteTestimonial(id) {
  return api.delete(`/admin/testimonials/${id}`).then((res) => res.data);
}
