/* eslint-disable max-len */
import { useEffect } from 'react';
import { create } from 'zustand'

import { authAPI } from '../api/auth';
import { monday } from '../utils/monday';
import { APP_STATUS, DEFAULT_EMAIL, DEFAULT_NAME, DEFAULT_TOKEN, DEFAULT_WORKSPACE } from '../utils/constants';

/* This currently does not work
 * @typedef {{
 *  status: 'AUTHENTICATED' | 'NEEDS_SETUP' | 'PENDING' | 'INVITED' | 'INACTIVE' | 'VIEW_ONLY' | 'UNKNOWN' | 'FAILED',
 *  name: string | null,
 *  email: string | null,
 *  role: 'OWNER' | 'USER' | 'GUEST' | null,
 *  workspace: number | null,
 *  token: string | null,
 *  updateStore: (state: Partial<AuthSlice>) => void,
 * }} AuthSlice
 *
 * @typedef {import('zustand').UseBoundStore<import('zustand').StoreApi<AuthSlice>>} AuthStore
 *
 * @type {AuthStore}
 */
const useAuthStore = create((set) => ({
  status: APP_STATUS.UNKNOWN,
  name: null,
  email: null,
  role: null,
  workspace: null,
  token: null,
  isPremium: false,
  isFreeTrial: false,
  updateStore: (state) => set((prev) => ({ ...prev, ...state })),
}));

const useAuth = () => useAuthStore((state) => state);

const resolveSessionToken = () => useAuthStore.getState().token;

const updateStore = (state) => {
  useAuthStore.getState().updateStore(state);
};

const updateAuthStatus = (status) => {
  useAuthStore.getState().updateStore({ status });
}

export const handleInitialisation = async () => {
  try {
    const mondayContext = await monday.get('context');
    const mondayToken = await monday.get('sessionToken');

    // These are meant to be able to work locally outside of Monday.com
    let workspace = DEFAULT_WORKSPACE;
    let name = DEFAULT_NAME;
    let email = DEFAULT_EMAIL;
    let token = DEFAULT_TOKEN;

    const query = await monday.api(`query {
        me {
          email
          name
          id
        }
      }`);

    if (mondayContext.data) {
      workspace = Number(mondayContext.data.workspaceId);
    }

    if (mondayToken.data) {
      token = mondayToken.data;
    }

    if (query?.data?.me) {
      name = query.data.me.name;
      email = query.data.me.email;
    }

    const response = await authAPI.check({ workspace, name, email, token });

    if (response.ok) {
      const { status, token: sessionToken, role, isPremium, isFreeTrial } = await response.json();

      switch (status) {
        case 'found':
          updateStore({
            status: APP_STATUS.AUTHENTICATED,
            name,
            email,
            role,
            workspace,
            token: sessionToken,
            isPremium,
            isFreeTrial,
          });
          break;
        case 'needs-billing':
          updateStore({
            status: APP_STATUS.NEEDS_BILLING,
            name,
            email,
            workspace,
            token,
          });
          break;
        case 'pending':
          updateStore({
            status: APP_STATUS.PENDING,
            name,
            email,
            workspace,
          });
          break;
        case 'invited':
          updateStore({
            status: APP_STATUS.INVITED,
            name,
            email,
            workspace,
          });
          break;
        case 'inactive':
          updateStore({
            status: APP_STATUS.INACTIVE,
            name,
            email,
            workspace,
          });
          break;
        case 'view-only':
          updateStore({
            status: APP_STATUS.VIEW_ONLY,
            name,
            email,
            workspace,
          });
          break;
        case 'not-found':
          updateStore({
            status: APP_STATUS.NEEDS_SETUP,
            name,
            email,
            workspace,
            token,
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

const AuthProvider = ({ children }) => {
  useEffect(() => {
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
