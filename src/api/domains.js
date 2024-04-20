import { API_URL } from '../utils/constants';
import { resolveSessionToken } from '../providers/auth';
import { handle401 } from '../utils/auth';

export const domainsApi = {
  list: () => fetch(`${API_URL}/domains/list`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${resolveSessionToken()}`,
    },
  }).then(handle401).then((res) => res.json()),

  check: (domain) => fetch(`${API_URL}/domains/check?domain=${domain}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${resolveSessionToken()}`,
    },
  }).then(handle401).then((res) => res.json()),
};
