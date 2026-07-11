import api from './axios';

export function submitContact(payload) {
  return api.post('/contacts', payload).then((res) => res.data);
}
