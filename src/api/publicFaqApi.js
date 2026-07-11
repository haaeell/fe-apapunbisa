import api from './axios';

export function fetchPublicFaqs(params = {}) {
  return api.get('/faqs', { params }).then((res) => res.data);
}
