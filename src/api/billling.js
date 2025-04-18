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

  pauseSubscription: () => fetch(`${API_URL}/billing/subscription/pause`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${resolveSessionToken()}`,
    },
  }).then(handle401),

  unpauseSubscription: () => fetch(`${API_URL}/billing/subscription/unpause`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${resolveSessionToken()}`,
    },
  }).then(handle401),

  cancelSubscription: () => fetch(`${API_URL}/billing/subscription/cancel`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${resolveSessionToken()}`,
    },
  }).then(handle401),

  resumeSubscription: () => fetch(`${API_URL}/billing/subscription/resume`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${resolveSessionToken()}`,
    },
  }).then(handle401),

  getLinkToUpdatePaymentMethod: () => fetch(`${API_URL}/billing/update/payment-method`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${resolveSessionToken()}`,
    },
  }).then(handle401),

  getDetails: () => fetch(`${API_URL}/billing/info`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${resolveSessionToken()}`,
    },
  }).then(handle401).then((response) => response.json()),

  listInvoices: () => fetch(`${API_URL}/billing/invoices`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${resolveSessionToken()}`,
    },
  }).then(handle401).then((response) => response.json()),
};
