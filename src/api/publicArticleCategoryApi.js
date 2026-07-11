import api from './axios';

export function fetchPublicArticleCategories() {
  return api.get('/article-categories').then((res) => res.data);
}
