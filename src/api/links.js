import { BASE_URL } from '../utils/constants';
import { resolveSessionToken } from '../providers/auth';

export const linksAPI = {
  list: () => fetch(`${BASE_URL}/api/mday/links/list`, {
    headers: {
      'Authorization': `Bearer ${resolveSessionToken()}`,
    },
  }).then((res) => res.json()),
  create: (link) => fetch(`${BASE_URL}/api/mday/links/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${resolveSessionToken()}`,
    },
    body: JSON.stringify(link),
  }),
  update: (link) => fetch(`${BASE_URL}/api/mday/links/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${resolveSessionToken()}`,
    },
    body: JSON.stringify(link),
  }),
  delete: (id) => fetch(`${BASE_URL}/api/mday/links/delete/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${resolveSessionToken()}`,
    },
  }),
};
