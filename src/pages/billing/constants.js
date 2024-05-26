import { billingAPI } from '../../api/billling';

export const SUBSCRIPTION_ACTIONS = {
  PAUSE: 'pause',
  UNPAUSE: 'unpause',
  CANCEL: 'cancel',
  RESUME: 'resume',
};

export const SUBSCRIPTION_ENDPOINTS = {
  [SUBSCRIPTION_ACTIONS.PAUSE]: billingAPI.pauseSubscription,
  [SUBSCRIPTION_ACTIONS.UNPAUSE]: billingAPI.unpauseSubscription,
  [SUBSCRIPTION_ACTIONS.CANCEL]: billingAPI.cancelSubscription,
  [SUBSCRIPTION_ACTIONS.RESUME]: billingAPI.resumeSubscription,
};

export const columns = [
  {
    id: 'invoice-date',
    loadingStateType: 'medium-text',
    title: 'Invoice Date',
    width: 220,
  },
  {
    id: 'status',
    loadingStateType: 'medium-text',
    title: 'Status',
    width: 100,
  },
  {
    id: 'amount',
    loadingStateType: 'medium-text',
    title: 'Amount',
    width: 100,
  },
  {
    id: 'card-details',
    loadingStateType: 'medium-text',
    title: 'Card used',
    // width: 200,
  },
  {
    id: 'actions',
    loadingStateType: 'medium-text',
    title: '',
    width: 80,
  },
];
