import React, { useState } from 'react';
import { InspectionDetails } from '../types';
import { StatusBadge } from './StatusBadge';
import { ClipboardCheck, Calendar, MapPin, Leaf, FileCheck, Clock, ExternalLink, CheckCircle2 } from 'lucide-react';

interface InspectionCardProps {
  inspection: InspectionDetails;
  plate?: string;
}

export const InspectionCard: React.FC<InspectionCardProps> = ({ inspection, plate = '' }) => {
  const { status, statusText, expiryDate, remainingDays, inspectionStation, ecoCategory, certificateNumber } = inspection;
  const [copied, setCopied] = useState(false);

  const handleDaiCheck = () => {
    if (plate) {
      navigator.clipboard.writeText(plate);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
    window.open('https://rta.government.bg/services/check-inspection/index.html', '_blank', 'noopener,noreferrer');
  };

  const badgeText = status === 'no_data' ? 'Изисква CAPTCHA' : statusText;

  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden transition-all h-full flex flex-col justify-between border border-slate-800/90">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Технически преглед (ГТП)</h3>
              <p className="text-xs text-slate-400">Годишен технически преглед</p>
            </div>
          </div>
          <StatusBadge status={status} customText={badgeText} />
        </div>

        {/* Content details */}
        <div className="space-y-3.5">
          {/* Expiration Date */}
          <div className="flex items-center justify-between py-1 border-b border-slate-800/50">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              Валиден до
            </span>
            <span className="text-sm font-bold text-slate-100 font-mono">{expiryDate}</span>
          </div>

          {/* Inspection Station */}
          <div className="flex items-center justify-between py-1 border-b border-slate-800/50">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              Пункт за ГТП
            </span>
            <span className="text-xs font-semibold text-slate-200 max-w-[200px] text-right truncate">
              {inspectionStation}
            </span>
          </div>

          {/* Eco Category Badge */}
          <div className="flex items-center justify-between py-1 border-b border-slate-800/50">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              Еко група (ЕКО стикер)
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              {ecoCategory}
            </span>
          </div>

          {/* Certificate Number */}
          <div className="flex items-center justify-between py-1 border-b border-slate-800/50">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-slate-500" />
              Удостоверение №
            </span>
            <span className="text-xs font-mono font-bold text-slate-300">{certificateNumber}</span>
          </div>

          {/* Remaining Days Box */}
          {status !== 'no_data' ? (
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-purple-400" />
                Оставащо време
              </span>
              {remainingDays < 0 ? (
                <span className="text-xs font-bold text-rose-400">
                  Изтекъл преди {Math.abs(remainingDays)} дни
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
          ) : (
            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/50 flex items-center justify-between">
              <span className="text-xs text-slate-500 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-600" />
                Оставащо време
              </span>
              <span className="text-xs font-bold text-slate-500">Няма данни</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer advice & DAI check button */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Периодичност:</span>
          <span className="font-semibold text-slate-200">1 път годишно</span>
        </div>

        <button
          type="button"
          onClick={handleDaiCheck}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:via-indigo-500 hover:to-blue-500 text-white text-xs sm:text-sm font-extrabold rounded-xl shadow-lg shadow-purple-900/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Бърза проверка в ДАИ</span>
        </button>

        {copied && (
          <div className="p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 animate-in fade-in zoom-in-95 duration-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Номерът е копиран!</span>
          </div>
        )}
      </div>
    </div>
  );
};
