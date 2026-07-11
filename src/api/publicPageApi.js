import api from './axios';

export function fetchPublicPage(slug) {
  return api.get(`/pages/${slug}`).then((res) => res.data);
}
