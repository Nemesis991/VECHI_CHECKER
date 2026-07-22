import React from 'react';
import { StatusType } from '../types';
import { CheckCircle2, AlertTriangle, XCircle, Clock, MinusCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: StatusType;
  customText?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  customText,
  size = 'md',
}) => {
  let badgeStyle = '';
  let Icon = CheckCircle2;
  let label = customText || '';

  switch (status) {
    case 'valid':
    case 'paid':
      badgeStyle = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-emerald-950/20';
      Icon = CheckCircle2;
      if (!label) label = status === 'paid' ? 'Платен' : 'Валиден';
      break;
    case 'expiring':
      badgeStyle = 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-amber-950/20 animate-pulse';
      Icon = Clock;
      if (!label) label = 'Изтича скоро';
      break;
    case 'expired':
    case 'unpaid':
      badgeStyle = 'bg-rose-500/15 text-rose-400 border-rose-500/40 shadow-rose-950/20';
      Icon = XCircle;
      if (!label) label = status === 'unpaid' ? 'Неплатен' : 'Изтекъл';
      break;
    case 'no_data':
      badgeStyle = 'bg-slate-500/15 text-slate-400 border-slate-500/40 shadow-slate-950/20';
      Icon = MinusCircle;
      if (!label) label = 'Няма данни';
      break;
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-semibold gap-1',
    md: 'px-3 py-1 text-xs sm:text-sm font-semibold gap-1.5',
    lg: 'px-3.5 py-1.5 text-sm font-bold gap-2',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border backdrop-blur-md shadow-sm transition-all ${badgeStyle} ${sizeClasses}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      <span>{label}</span>
    </span>
  );
};
