export const BASE_URL = process.env.REACT_APP_BASE_URL;
export const DEFAULT_WORKSPACE = (
  window.origin.startsWith('http://localhost') && process.env.REACT_APP_DEFAULT_WORKSPACE
    ? Number(process.env.REACT_APP_DEFAULT_WORKSPACE)
    : null
);
export const DEFAULT_USER = (
  window.origin.startsWith('http://localhost') && process.env.REACT_APP_DEFAULT_USER
    ? Number(process.env.REACT_APP_DEFAULT_USER)
    : null
);

export const APP_STATUS = {
  AUTHENTICATED: 'AUTHENTICATED',
  NEEDS_SETUP: 'NEEDS_SETUP',
  UNKNOWN: 'UNKNOWN',
  AUTH_FAILED: 'FAILED',
}

export const KEBAB_CASE_REGEX = /^[a-z]+(-[a-z]+)*$/;
