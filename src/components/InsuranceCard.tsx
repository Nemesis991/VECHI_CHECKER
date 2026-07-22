import React, { useState } from 'react';
import { InsuranceDetails } from '../types';
import { StatusBadge } from './StatusBadge';
import { ShieldCheck, Calendar, Building2, FileText, ExternalLink, CheckCircle2, Clock } from 'lucide-react';

interface InsuranceCardProps {
  insurance: InsuranceDetails;
  plate?: string;
}

export const InsuranceCard: React.FC<InsuranceCardProps> = ({ insurance, plate = '' }) => {
  const { status, statusText, insurer, expiryDate, policyNumber, remainingDays, annualCostBgn } = insurance;
  const [copied, setCopied] = useState(false);

  const handleGuaranteeFundCheck = () => {
    if (plate) {
      navigator.clipboard.writeText(plate);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
    window.open('https://www.guaranteefund.org/bg/%D0%B8%D0%BD%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%B5%D0%BD-%D1%86%D0%B5%D0%BD%D1%82%D1%8A%D1%80-%D0%B8-%D1%81%D0%BF%D1%80%D0%B0%D0%B2%D0%BA%D0%B8/%D1%83%D1%81%D0%BB%D1%83%D0%B3%D0%B8/%D0%BF%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BA%D0%B0-%D0%B7%D0%B0-%D0%B2%D0%B0%D0%BB%D0%B8%D0%B4%D0%BD%D0%B0-%D0%B7%D0%B0%D1%81%D1%82%D1%80%D0%B0%D1%85%D0%BE%D0%B2%D0%BA%D0%B0-%D0%B3%D1%80a%D0%B6%D0%B4%D0%B0%D0%BD%D1%81%D0%BA%D0%B0-%D0%BE%D1%82%D0%B3%D0%BE%D0%B2%D0%BE%D1%80%D0%BD%D0%BE%D1%81%D1%82-%D0%BD%D0%B0-%D0%B0%D0%B2%D1%82%D0%BE%D0%BC%D0%BE%D0%B1%D0%B8%D0%BB%D0%B8%D1%81%D1%82%D0%B8%D1%82%D0%B5', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden transition-all h-full flex flex-col justify-between border border-slate-800/90">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Гражданска отговорност</h3>
              <p className="text-xs text-slate-400">Задължителна застраховка ГО</p>
            </div>
          </div>
          <StatusBadge status={status} customText={statusText} />
        </div>

        {/* Content details */}
        <div className="space-y-3.5">
          {/* Insurer */}
          <div className="flex items-center justify-between py-1 border-b border-slate-800/50">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              Застраховател
            </span>
            <span className="text-sm font-bold text-slate-100">{insurer}</span>
          </div>

          {/* Expiration date */}
          <div className="flex items-center justify-between py-1 border-b border-slate-800/50">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              Дата на изтичане
            </span>
            <span className="text-sm font-bold text-slate-100 font-mono">{expiryDate}</span>
          </div>

          {/* Policy Number */}
          <div className="flex items-center justify-between py-1 border-b border-slate-800/50">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              Номер на полица
            </span>
            <span className="text-xs font-mono font-bold text-slate-300">{policyNumber}</span>
          </div>

          {/* Remaining days counter box */}
          {status !== 'no_data' ? (
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-cyan-400" />
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

      {/* Footer advice */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Приблизителна цена:</span>
          <span className="font-extrabold text-white font-mono">
            {status === 'no_data' ? 'Няма данни' : `~${annualCostBgn} лв. / год.`}
          </span>
        </div>
        
        <button
          type="button"
          onClick={handleGuaranteeFundCheck}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:via-indigo-500 hover:to-blue-500 text-white text-xs sm:text-sm font-extrabold rounded-xl shadow-lg shadow-purple-900/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Бърза проверка в Гаранционен фонд</span>
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
