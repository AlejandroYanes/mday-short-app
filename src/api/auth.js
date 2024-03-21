import { BASE_URL } from '../utils/constants';

export const authAPI = {
  check: ({ workspace, user }) => (
    fetch(`${BASE_URL}/api/mday/auth/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ workspace, user }),
    })
  ),
  setup: ({ user, workspace, name, wslug }) => (
    fetch(`${BASE_URL}/api/mday/auth/setup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user, workspace, name, wslug }),
    })
  ),
};
