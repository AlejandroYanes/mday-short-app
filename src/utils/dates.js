export function formatDate(date, locale = 'en-gb') {
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: '2-digit',
  });
  return date ? dateFormatter.format(new Date(date)) : '';
}

export const stripTimezone = (date) => {
  return date ? new Date(date).toISOString().split('T')[0] : '';
}
