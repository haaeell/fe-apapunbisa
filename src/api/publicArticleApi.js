import api from './axios';

export function fetchPublicArticles(params = {}) {
  return api.get('/articles', { params }).then((res) => res.data);
}

export function fetchPublicArticleBySlug(slug) {
  return api.get(`/articles/${slug}`).then((res) => res.data);
}
