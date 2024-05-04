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
  }).then(handle401).then((res) => {
    if (res.ok) {
      return res.json();
    }

    throw new Error('Failed to load domains.');
  }),

  check: (domain) => fetch(`${API_URL}/domains/check`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${resolveSessionToken()}`,
    },
    body: JSON.stringify({ domain }),
  }).then(handle401).then((res) => {
    if (res.ok) {
      return res.json();
    }

    switch (res.status) {
      case 404:
        throw new Error('Domain not found');
      default:
        throw new Error('Failed to check domain.');
    }

  }),

  add: (domain) => fetch(`${API_URL}/domains/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${resolveSessionToken()}`,
    },
    body: JSON.stringify({ domain }),
  }).then(handle401).then((res) => {
    if (res.ok) {
      return res.json();
    }

    switch (res.status) {
      case 409:
        throw new Error('The domain is already in use');
      default:
        throw new Error('Failed to add domain.');
    }
  }),

  remove: (domain) => fetch(`${API_URL}/domains/delete`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${resolveSessionToken()}`,
    },
    body: JSON.stringify({ domain }),
  }).then(handle401).then((res) => {
    if (res.ok) {
      return res.json();
    }

    switch (res.status) {
      case 404:
        throw new Error('Domain not found');
      default:
        throw new Error('Failed to remove domain.');
    }
  }),
};
