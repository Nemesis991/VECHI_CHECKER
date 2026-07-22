import React from 'react';
import { CheckResult } from '../types';
import { Calendar, ShieldCheck, ClipboardCheck, Ticket, Landmark, Clock, AlertTriangle } from 'lucide-react';

interface TimelineViewProps {
  result: CheckResult;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ result }) => {
  const events = [
    {
      title: 'Гражданска отговорност',
      date: result.insurance.expiryDate,
      days: result.insurance.remainingDays,
      status: result.insurance.status,
      icon: ShieldCheck,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      subtitle: result.insurance.insurer,
    },
    {
      title: 'Годишен технически преглед (ГТП)',
      date: result.inspection.expiryDate,
      days: result.inspection.remainingDays,
      status: result.inspection.status,
      icon: ClipboardCheck,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      subtitle: result.inspection.inspectionStation,
    },
    {
      title: 'Електронна винетка',
      date: result.vignette.expiryDate,
      days: result.vignette.remainingDays,
      status: result.vignette.status,
      icon: Ticket,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      subtitle: result.vignette.vignetteType,
    },
    {
      title: 'Данък МПС',
      date: result.tax.dueDate,
      days: result.tax.status === 'paid' ? 365 : -1,
      status: result.tax.status === 'paid' ? 'valid' : 'unpaid',
      icon: Landmark,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      subtitle: result.tax.municipality,
    },
  ].sort((a, b) => a.days - b.days);

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white">Хронология на валидност (График)</h3>
        </div>
        <span className="text-xs text-slate-400">Сортирани по най-скоро изтичащи</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {events.map((ev, idx) => {
          const Icon = ev.icon;
          const isExpired = ev.days < 0;
          const isExpiring = ev.days >= 0 && ev.days <= 14;

          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border relative overflow-hidden transition-all flex flex-col justify-between ${
                isExpired
                  ? 'bg-rose-950/20 border-rose-500/30'
                  : isExpiring
                  ? 'bg-amber-950/20 border-amber-500/40'
                  : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg border ${ev.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded ${
                      isExpired
                        ? 'bg-rose-500/20 text-rose-300'
                        : isExpiring
                        ? 'bg-amber-500/20 text-amber-300 animate-pulse'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {isExpired
                      ? 'ИЗТЕКЪЛ'
                      : isExpiring
                      ? `След ${ev.days} дни`
                      : `След ${ev.days} дни`}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-100">{ev.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{ev.subtitle}</p>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Дата:</span>
                <span className="font-bold text-white">{ev.date}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
