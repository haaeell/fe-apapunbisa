import api from './axios';

export function fetchFaqs(params = {}) {
  return api.get('/admin/faqs', { params }).then((res) => res.data);
}

export function fetchFaq(id) {
  return api.get(`/admin/faqs/${id}`).then((res) => res.data);
}

export function createFaq(payload) {
  return api.post('/admin/faqs', payload).then((res) => res.data);
}

export function updateFaq(id, payload) {
  return api.put(`/admin/faqs/${id}`, payload).then((res) => res.data);
}

export function deleteFaq(id) {
  return api.delete(`/admin/faqs/${id}`).then((res) => res.data);
}
