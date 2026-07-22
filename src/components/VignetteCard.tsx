import React from 'react';
import { VignetteDetails } from '../types';
import { StatusBadge } from './StatusBadge';
import { Ticket, Calendar, Barcode, Clock, Tag } from 'lucide-react';

interface VignetteCardProps {
  vignette: VignetteDetails;
}

export const VignetteCard: React.FC<VignetteCardProps> = ({ vignette }) => {
  const { vignetteType, status, statusText, expiryDate, remainingDays, serialNumber, priceBgn } = vignette;

  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden transition-all h-full flex flex-col justify-between border border-slate-800/90">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Винетка (Е-винетка)</h3>
              <p className="text-xs text-slate-400">BG Toll електронна винетка</p>
            </div>
          </div>
          <StatusBadge status={status} customText={statusText} />
        </div>

        {/* Content details */}
        <div className="space-y-3.5">
          {/* Vignette Type */}
          <div className="flex items-center justify-between py-1 border-b border-slate-800/50">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-500" />
              Вид винетка
            </span>
            <span className="text-sm font-extrabold text-amber-300">{vignetteType}</span>
          </div>

          {/* Expiration date */}
          <div className="flex items-center justify-between py-1 border-b border-slate-800/50">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              Валидна до
            </span>
            <span className="text-sm font-bold text-slate-100 font-mono">{expiryDate}</span>
          </div>

          {/* Serial Number */}
          <div className="flex items-center justify-between py-1 border-b border-slate-800/50">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Barcode className="w-3.5 h-3.5 text-slate-500" />
              Сериен номер / ID
            </span>
            <span className="text-xs font-mono font-bold text-slate-300">{serialNumber}</span>
          </div>

          {/* Remaining Days Box */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              Оставащо време
            </span>
            {remainingDays < 0 ? (
              <span className="text-xs font-bold text-rose-400">
                Изтекла преди {Math.abs(remainingDays)} дни
              </span>
            ) : remainingDays <= 14 ? (
              <span className="text-xs font-extrabold text-amber-300 animate-pulse">
                Остават само {remainingDays} дни!
              </span>
            ) : (
              <span className="text-xs font-bold text-emerald-400">
                Остават {remainingDays} дни
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer price */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <span className="text-slate-400">Държавна такса:</span>
        <span className="font-extrabold text-white font-mono">{priceBgn} лв.</span>
      </div>
    </div>
  );
};
