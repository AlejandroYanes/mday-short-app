import { useEffect } from 'react';
import { create } from 'zustand'

import { authAPI } from '../api/auth';
import { monday } from '../utils/monday';
import { APP_STATUS, DEFAULT_EMAIL, DEFAULT_NAME, DEFAULT_USER, DEFAULT_WORKSPACE } from '../utils/constants';

const useAuthStore = create((set) => ({
  status: APP_STATUS.UNKNOWN,
  user: null,
  workspace: null,
  sessionToken: null,
  updateStore: (state) => set((prev) => ({ ...prev, ...state })),
}));

const useAuth = () => useAuthStore((state) => state);

const resolveSessionToken = () => useAuthStore.getState().sessionToken;

const updateAuthStatus = (status) => {
  useAuthStore.getState().updateStore({ status });
}

const AuthProvider = ({ children }) => {
  const { updateStore } = useAuth();

  const handleInitialisation = async () => {
    try {
      const mondayContext = await monday.get('context');

      // These are meant to be able to work locally outside of Monday.com
      let workspace = DEFAULT_WORKSPACE;
      let user = DEFAULT_USER;
      let name = DEFAULT_NAME;
      let email = DEFAULT_EMAIL;

      const query = await monday.api(`query {
        me {
          is_guest
          email
          name
          id
        }
      }`);

      if (mondayContext.data) {
        workspace = Number(mondayContext.data.workspaceId);
        user = Number(mondayContext.data.user.id);
      }

      if (query?.data?.me) {
        name = query.data.me.name;
        email = query.data.me.email;
      }

      const response = await authAPI.check({ workspace, user, name, email });

      if (response.ok) {
        const { status, sessionToken } = await response.json();

        switch (status) {
          case 'found':
            updateStore({
              status: APP_STATUS.AUTHENTICATED,
              user,
              name,
              email,
              workspace,
              sessionToken,
            });
            break;
          case 'pending':
            updateStore({
              status: APP_STATUS.PENDING,
              user,
              name,
              email,
              workspace,
            });
            break;
          case 'invited':
            updateStore({
              status: APP_STATUS.INVITED,
              user,
              name,
              email,
              workspace,
            });
            break;
          case 'not-found':
            updateStore({
              status: APP_STATUS.NEEDS_SETUP,
              user,
              name,
              email,
              workspace,
            });
            break;
          default:
            updateStore({ status: APP_STATUS.AUTH_FAILED });
            break;
        }
      } else {
        updateStore({ status: APP_STATUS.AUTH_FAILED });
      }
    } catch (e) {
      console.error(e);
      updateStore({ status: APP_STATUS.AUTH_FAILED });
    }
  }

  useEffect(() => {
    // Notice this method notifies the monday platform that user gains a first value in an app.
    // Read more about it here: https://developer.monday.com/apps/docs/mondayexecute#value-created-for-user/
    // monday.execute("valueCreatedForUser");
    handleInitialisation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}

export {
  AuthProvider,
  useAuth,
  resolveSessionToken,
  updateAuthStatus,
};
