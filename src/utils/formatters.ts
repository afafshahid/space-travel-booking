import { format, parseISO } from 'date-fns';

export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateStr: string): string => {
  try {
    return format(parseISO(dateStr), 'MMM dd, yyyy');
  } catch {
    return dateStr;
  }
};

export const formatDateTime = (dateStr: string): string => {
  try {
    return format(parseISO(dateStr), 'MMM dd, yyyy HH:mm');
  } catch {
    return dateStr;
  }
};

export const formatDistance = (km: number): string => {
  if (km >= 1_000_000) return `${(km / 1_000_000).toFixed(1)}M km`;
  if (km >= 1_000) return `${(km / 1_000).toFixed(1)}K km`;
  return `${km} km`;
};

export const formatDuration = (days: number): string => {
  if (days === 1) return '1 day';
  if (days < 30) return `${days} days`;
  const months = Math.floor(days / 30);
  const remainingDays = days % 30;
  if (remainingDays === 0) return `${months} month${months > 1 ? 's' : ''}`;
  return `${months}mo ${remainingDays}d`;
};

export const getClassName = (cls: string): string => {
  const names: Record<string, string> = {
    economy: 'Economy',
    business: 'Business',
    first_class: 'First Class',
  };
  return names[cls] || cls;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};
