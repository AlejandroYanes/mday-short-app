import { API_URL } from '../utils/constants';
import { resolveSessionToken } from '../providers/auth';
import { handle401 } from '../utils/auth';

export const billingAPI = {
  check: ({ workspace, token }) => fetch(`${API_URL}/billing/check`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ workspace, token }),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Failed to check billing status');
    }
  }),

  getCheckoutURL: ({ workspace, email, plan, cycle, token }) => fetch(`${API_URL}/billing/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ workspace, email, plan, cycle, token }),
  }),

  getCustomerPortal: () => fetch(`${API_URL}/billing/portal`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${resolveSessionToken()}`,
    },
  }).then(handle401),
};
