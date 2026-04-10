import { differenceInDays } from 'date-fns';

export const calculateRefund = (travelDate: string): number => {
  const today = new Date();
  const travel = new Date(travelDate);
  const daysUntilTravel = differenceInDays(travel, today);

  // If travel date is in the past or invalid, minimum refund applies
  if (daysUntilTravel < 0) return 25;
  if (daysUntilTravel >= 30) return 100;
  if (daysUntilTravel >= 15) return 75;
  if (daysUntilTravel >= 7) return 50;
  return 25;
};

export const getRefundAmount = (price: number, travelDate: string): number => {
  const percentage = calculateRefund(travelDate);
  return (price * percentage) / 100;
};

export const getRefundMessage = (travelDate: string): string => {
  const pct = calculateRefund(travelDate);
  const today = new Date();
  const travel = new Date(travelDate);
  const daysUntilTravel = differenceInDays(travel, today);

  if (daysUntilTravel < 0) return `${pct}% refund (travel date has passed)`;
  if (daysUntilTravel >= 30) return '100% refund (30+ days before travel)';
  if (daysUntilTravel >= 15) return '75% refund (15-30 days before travel)';
  if (daysUntilTravel >= 7) return '50% refund (7-15 days before travel)';
  return `${pct}% refund (less than 7 days before travel)`;
};
