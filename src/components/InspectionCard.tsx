import React, { useState, useEffect } from 'react';
import { InspectionDetails } from '../types';
import { StatusBadge } from './StatusBadge';
import { ClipboardCheck, Calendar, MapPin, Leaf, FileCheck, Clock, ExternalLink, CheckCircle2, Edit2, Cloud } from 'lucide-react';
import { saveVehicleDate } from '../utils/apiCustomDates';

interface InspectionCardProps {
  inspection: InspectionDetails;
  plate?: string;
  customDate?: string;
}

export const InspectionCard: React.FC<InspectionCardProps> = ({ inspection, plate = '', customDate }) => {
  const { inspectionStation, ecoCategory, certificateNumber } = inspection;
  const [copied, setCopied] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [tempDate, setTempDate] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [activeCustomDate, setActiveCustomDate] = useState(customDate);
  useEffect(() => {
    setActiveCustomDate(customDate);
  }, [customDate]);

  let finalExpiryDate = inspection.expiryDate;
  let finalRemainingDays = inspection.remainingDays;
  let finalStatus = inspection.status;
  let finalStatusText = inspection.statusText;

  if (activeCustomDate) {
    const d = new Date(activeCustomDate);
    if (!isNaN(d.getTime())) {
      finalExpiryDate = d.toLocaleDateString('bg-BG');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const diffTime = d.getTime() - today.getTime();
      finalRemainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (finalRemainingDays < 0) {
        finalStatus = 'expired';
        finalStatusText = 'Изтекъл';
      } else if (finalRemainingDays <= 30) {
        finalStatus = 'expiring';
        finalStatusText = 'Изтичащ';
      } else {
        finalStatus = 'valid';
        finalStatusText = 'Валиден';
      }
    }
  }

  const confirmSave = async () => {
    if (!plate) return;
    setIsSaving(true);
    try {
      const success = await saveVehicleDate(plate, 'gtp_expiration', tempDate);
      if (success) {
        setActiveCustomDate(tempDate);
        setIsEditing(false);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDaiCheck = () => {
    if (plate) {
      navigator.clipboard.writeText(plate);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
    window.open('https://rta.government.bg/services/check-inspection/index.html', '_blank', 'noopener,noreferrer');
  };

  const badgeText = finalStatus === 'no_data' && !activeCustomDate ? 'Изисква CAPTCHA' : finalStatusText;

  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden transition-all h-full flex flex-col justify-between border border-slate-800/90">
      <div>
        {/* Toast Notification */}
        {showToast && (
          <div className="absolute -top-12 left-0 right-0 flex justify-center z-10 animate-in slide-in-from-top-4 fade-in duration-300">
            <div className="bg-emerald-500/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg border border-emerald-400/30 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Датите за {plate} са запазени!
            </div>
          </div>
        )}

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
          <StatusBadge status={finalStatus} customText={badgeText} />
        </div>

        {/* Content details */}
        <div className="space-y-3.5 relative">
          {/* Expiration Date */}
          <div className="py-2 space-y-3 border-b border-slate-800/50">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Валиден до
              </span>
              
              {!isEditing && plate && (
                <button
                  onClick={() => {
                    setTempDate(activeCustomDate || '');
                    setIsEditing(true);
                  }}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  title="Редактирай дата"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="flex flex-col gap-2 p-3 bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700 animate-in fade-in zoom-in-95 duration-200 shadow-xl">
                <label className="text-xs text-slate-400">Въведете дата на изтичане:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={tempDate}
                    onChange={(e) => setTempDate(e.target.value)}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    onClick={confirmSave}
                    disabled={isSaving}
                    className="px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-50"
                  >
                    Запази
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
                  >
                    Отказ
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-end gap-2">
                <span className="text-sm font-bold text-slate-100 font-mono flex items-center gap-2">
                  {finalExpiryDate}
                </span>
                {activeCustomDate && <span className="text-[10px] text-cyan-400/80 bg-cyan-400/10 px-1.5 py-0.5 rounded border border-cyan-400/20">Ръчно</span>}
              </div>
            )}
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
          {finalStatus !== 'no_data' || activeCustomDate ? (
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-purple-400" />
                Оставащо време
              </span>
              {finalRemainingDays < 0 ? (
                <span className="text-xs font-bold text-rose-400">
                  Изтекъл преди {Math.abs(finalRemainingDays)} дни
                </span>
              ) : finalRemainingDays <= 14 ? (
                <span className="text-xs font-extrabold text-amber-300 animate-pulse">
                  Остават само {finalRemainingDays} дни!
                </span>
              ) : (
                <span className="text-xs font-bold text-emerald-400">
                  Остават {finalRemainingDays} дни
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

        {activeCustomDate && (
          <div className="flex items-center justify-end text-[10px] text-slate-500 mb-2">
            <span className="flex items-center gap-1">
              <Cloud className="w-3 h-3 text-cyan-500" />
              Синхронизирано в облака
            </span>
          </div>
        )}

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
