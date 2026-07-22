import React from 'react';
import { CheckResult } from '../types';
import { PlateVisual } from './PlateVisual';
import { ShieldCheck, AlertTriangle, AlertCircle, Printer, Bell, FileText, Share2 } from 'lucide-react';

interface OverallStatusBannerProps {
  result: CheckResult;
  onOpenReminderModal: () => void;
  onOpenPrintModal: () => void;
  onOpenPenaltiesInfo: () => void;
}

export const OverallStatusBanner: React.FC<OverallStatusBannerProps> = ({
  result,
  onOpenReminderModal,
  onOpenPrintModal,
  onOpenPenaltiesInfo,
}) => {
  const { overallStatus, formattedPlate, checkTimestamp, vehicle } = result;

  let bgGradient = 'from-emerald-950/40 via-slate-900/90 to-slate-900/90 border-emerald-500/30';
  let statusTitle = 'Всички документи са изрядни';
  let statusDesc = 'Автомобилът отговаря на изискванията за движение по пътищата на Р. България.';
  let StatusIcon = ShieldCheck;
  let iconColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';

  if (overallStatus === 'warning') {
    bgGradient = 'from-amber-950/40 via-slate-900/90 to-slate-900/90 border-amber-500/40';
    statusTitle = 'Има документ, който изтича скоро!';
    statusDesc = 'Препоръчително е да подновите изтичащите застраховки или прегледи в близките дни.';
    StatusIcon = AlertTriangle;
    iconColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  } else if (overallStatus === 'danger') {
    bgGradient = 'from-rose-950/40 via-slate-900/90 to-slate-900/90 border-rose-500/40';
    statusTitle = 'Внимание: Открити са изтекли документи или неплатен данък!';
    statusDesc = 'Шофирането с изтекла застраховка, ГТП или винетка подлежи на глоби и санкции от КАТ/ПП.';
    StatusIcon = AlertCircle;
    iconColor = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  }

  return (
    <div className={`glass-card rounded-2xl p-6 border bg-gradient-to-r ${bgGradient} shadow-2xl relative overflow-hidden transition-all`}>
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left Side: License Plate + Overall Message */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 w-full lg:w-auto">
          {/* License Plate Display */}
          <div className="shrink-0">
            <PlateVisual plateText={formattedPlate} size="lg" />
            <div className="mt-2 text-center text-[11px] font-medium text-slate-400 font-mono">
              Справка от: {checkTimestamp}
            </div>
          </div>

          {/* Vehicle info & Health Status */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xl sm:text-2xl font-extrabold text-white">
                {vehicle.make} {vehicle.model}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                {vehicle.year} г.
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                {vehicle.engineType}
              </span>
            </div>

            <div className="flex items-start gap-2 pt-1">
              <div className={`p-1.5 rounded-lg border ${iconColor} shrink-0 mt-0.5`}>
                <StatusIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">{statusTitle}</h3>
                <p className="text-xs text-slate-300 max-w-xl">{statusDesc}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Action buttons */}
        <div className="flex items-center gap-2.5 flex-wrap w-full lg:w-auto justify-start lg:justify-end border-t lg:border-t-0 border-slate-800/80 pt-4 lg:pt-0 no-print">
          <button
            onClick={onOpenReminderModal}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 font-semibold text-xs transition-all cursor-pointer shadow-md"
          >
            <Bell className="w-4 h-4 text-cyan-400" />
            <span>Напомняне</span>
          </button>

          <button
            onClick={onOpenPrintModal}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 font-semibold text-xs transition-all cursor-pointer shadow-md"
          >
            <Printer className="w-4 h-4 text-slate-400" />
            <span>Принтирай Справка</span>
          </button>

          {overallStatus !== 'valid' && (
            <button
              onClick={onOpenPenaltiesInfo}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold text-xs transition-all cursor-pointer"
            >
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>Глоби & Санкции</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
