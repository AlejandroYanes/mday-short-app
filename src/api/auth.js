import { BASE_URL } from '../utils/constants';

export const authAPI = {
  check: ({ workspace, user }) => (
    fetch(`${BASE_URL}/api/mday/auth/check?workspace${workspace}&user=${user}`)
      .then((res) => res.json())
  ),
  setup: ({ workspace, user }) => (
    fetch(`${BASE_URL}/api/mday/auth/setup?workspace${workspace}&user=${user}`)
      .then((res) => res.json())
  ),
};
