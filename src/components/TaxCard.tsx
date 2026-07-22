import React from 'react';
import { TaxDetails } from '../types';
import { StatusBadge } from './StatusBadge';
import { Landmark, Calendar, Coins, CheckCircle2, AlertOctagon } from 'lucide-react';

interface TaxCardProps {
  tax: TaxDetails;
}

export const TaxCard: React.FC<TaxCardProps> = ({ tax }) => {
  const { status, statusText, municipality, taxYear, amountBgn, dueDate } = tax;
  const isPaid = status === 'paid';

  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden transition-all h-full flex flex-col justify-between border border-slate-800/90">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${
              isPaid
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
            }`}>
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Данък МПС</h3>
              <p className="text-xs text-slate-400">Местни данъци и такси</p>
            </div>
          </div>
          <StatusBadge status={status} customText={statusText} />
        </div>

        {/* Content details */}
        <div className="space-y-3.5">
          {/* Municipality */}
          <div className="flex items-center justify-between py-1 border-b border-slate-800/50">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Landmark className="w-3.5 h-3.5 text-slate-500" />
              Община по регистрация
            </span>
            <span className="text-xs font-semibold text-slate-100 max-w-[200px] text-right truncate">
              {municipality}
            </span>
          </div>

          {/* Tax Year */}
          <div className="flex items-center justify-between py-1 border-b border-slate-800/50">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              Данъчна година
            </span>
            <span className="text-sm font-bold text-slate-100 font-mono">{taxYear} г.</span>
          </div>

          {/* Amount BGN */}
          <div className="flex items-center justify-between py-1 border-b border-slate-800/50">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-slate-500" />
              {status === 'no_data' ? 'Справка сума' : isPaid ? 'Платена сума' : 'Дължима сума'}
            </span>
            <span className={`text-base font-extrabold font-mono ${status === 'no_data' ? 'text-slate-400 text-sm' : isPaid ? 'text-emerald-400' : 'text-rose-400'}`}>
              {status === 'no_data' ? 'Няма данни' : `${amountBgn.toFixed(2)} лв.`}
            </span>
          </div>

          {/* Status highlight banner */}
          <div className={`p-3 rounded-xl border flex items-center justify-between ${
            status === 'no_data' 
              ? 'bg-slate-900/50 border-slate-800/50 text-slate-500'
              : isPaid
                ? 'bg-emerald-950/30 border-emerald-500/20 text-emerald-300'
                : 'bg-rose-950/30 border-rose-500/30 text-rose-300'
          }`}>
            <span className="text-xs flex items-center gap-1.5 font-medium">
              {status === 'no_data' ? <AlertOctagon className="w-4 h-4 text-slate-600" /> : isPaid ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertOctagon className="w-4 h-4 text-rose-400" />}
              {status === 'no_data' ? 'Липсват данни за задължения' : isPaid ? 'Задължението е отразено като платено' : 'Неплатен данък МПС'}
            </span>
            {!isPaid && status !== 'no_data' && (
              <span className="text-[11px] font-mono underline cursor-pointer hover:text-white">
                Плати с отстъпка
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer deadline */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span>Срок за плащане:</span>
        <span className="font-semibold text-slate-200">{dueDate}</span>
      </div>
    </div>
  );
};
