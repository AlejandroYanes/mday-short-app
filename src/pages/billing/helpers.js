import { Label } from 'monday-ui-react-core';

export function resolveStatusLabel(status) {
  switch (status) {
    case 'paused':
      return ' (Paused)';
    case 'on_trial':
      return ' (On trial)';
    case 'cancelled':
      return ' (Cancelled)';
    default:
      return null;
  }
}

export function resolveStatusColor(status) {
  switch (status) {
    case 'paid':
      return Label.colors.POSITIVE;
    case 'failed':
      return Label.colors.NEGATIVE;
    default:
      return Label.colors.DARK;
  }
}
