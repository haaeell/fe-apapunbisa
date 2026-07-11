import api from './axios';
import { buildFormData } from '../utils/buildFormData';

export function submitServiceRequest(payload) {
  return api.post('/service-requests', buildFormData(payload)).then((res) => res.data);
}
