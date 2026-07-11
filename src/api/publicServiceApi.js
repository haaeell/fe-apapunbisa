import api from './axios';

export function fetchPublicServices(params = {}) {
  return api.get('/services', { params }).then((res) => res.data);
}

export function fetchPublicServiceBySlug(slug) {
  return api.get(`/services/${slug}`).then((res) => res.data);
}
