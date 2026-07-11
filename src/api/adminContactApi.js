import api from './axios';

export function fetchAdminContacts(params = {}) {
  return api.get('/admin/contacts', { params }).then((res) => res.data);
}

export function fetchAdminContact(id) {
  return api.get(`/admin/contacts/${id}`).then((res) => res.data);
}

export function updateAdminContact(id, payload) {
  return api.put(`/admin/contacts/${id}`, payload).then((res) => res.data);
}

export function deleteAdminContact(id) {
  return api.delete(`/admin/contacts/${id}`).then((res) => res.data);
}
