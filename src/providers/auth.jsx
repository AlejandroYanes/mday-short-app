import { useEffect } from 'react';
import mondaySdk from 'monday-sdk-js';
import { create } from 'zustand'

import { authAPI } from '../api/auth';
import { APP_STATUS, DEFAULT_NAME, DEFAULT_USER, DEFAULT_WORKSPACE } from '../utils/constants';

const monday = mondaySdk();

const useAuthStore = create((set) => ({
  status: APP_STATUS.UNKNOWN,
  user: null,
  workspace: null,
  sessionToken: null,
  updateStatus: (status) => set((prev) => ({ ...prev, status })),
  initialize: (state) => set((prev) => ({ ...prev, ...state })),
}));

const useAuth = () => useAuthStore((state) => state);

const resolveSessionToken = () => useAuthStore.getState().sessionToken;

const updateAuthStatus = (status) => {
  useAuthStore.getState().updateStatus(status);
}

const AuthProvider = ({ children }) => {
  const { initialize, updateStatus } = useAuth();

  const handleInitialisation = async () => {
    try {
      const mondayContext = await monday.get('context');
      let workspaceId = DEFAULT_WORKSPACE;
      let userId = DEFAULT_USER;
      let userName = DEFAULT_NAME;

      const query = await monday.api(`query {
        me {
          is_guest
          name
          id
        }
      }`);

      if (mondayContext.data) {
        workspaceId = Number(mondayContext.data.workspaceId);
        userId = Number(mondayContext.data.user.id);
      }

      if (query?.data?.me) {
        userName = query.data.me.name;
      }

      const response = await authAPI.check({ workspace: workspaceId, user: userId, name: userName });

      if (response.ok) {
        const { status, sessionToken } = await response.json();

        if (status === 'found') {
          initialize({
            status: APP_STATUS.AUTHENTICATED,
            user: userId,
            name: userName,
            workspace: workspaceId,
            sessionToken,
          });
        } else {
          initialize({
            status: APP_STATUS.NEEDS_SETUP,
            user: userId,
            name: userName,
            workspace: workspaceId,
          });
        }
      } else {
        updateStatus(APP_STATUS.AUTH_FAILED);
      }
    } catch (e) {
      console.error(e);
      updateStatus(APP_STATUS.AUTH_FAILED);
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
