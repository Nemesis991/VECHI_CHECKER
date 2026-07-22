import React, { useState, useEffect } from 'react';
import { TaxDetails } from '../types';
import { StatusBadge } from './StatusBadge';
import { Landmark, Calendar, Coins, CheckCircle2, AlertOctagon, ExternalLink, Clock, Edit2, Cloud } from 'lucide-react';
import { saveVehicleDate } from '../utils/apiCustomDates';

interface TaxCardProps {
  tax: TaxDetails;
  plate?: string;
  customDate?: string;
}

export const TaxCard: React.FC<TaxCardProps> = ({ tax, plate = '', customDate }) => {
  const { municipality, taxYear, amountBgn } = tax;
  const [copied, setCopied] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [tempDate, setTempDate] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [activeCustomDate, setActiveCustomDate] = useState(customDate);
  useEffect(() => {
    setActiveCustomDate(customDate);
  }, [customDate]);

  let finalDueDate = tax.dueDate;
  let finalStatus = tax.status;
  let isPaid = finalStatus === 'paid';
  let remainingDays = 0;

  if (activeCustomDate) {
    const d = new Date(activeCustomDate);
    if (!isNaN(d.getTime())) {
      finalDueDate = d.toLocaleDateString('bg-BG');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const diffTime = d.getTime() - today.getTime();
      remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (remainingDays < 0) {
        finalStatus = 'expired';
        isPaid = false;
      } else if (remainingDays <= 30) {
        finalStatus = 'expiring';
        isPaid = true; // Technically paid but expiring soon
      } else {
        finalStatus = 'valid';
        isPaid = true;
      }
    }
  } else if (finalDueDate && finalDueDate !== 'Няма данни') {
      const parts = finalDueDate.split('.');
      if (parts.length === 3) {
          const d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T23:59:59`);
          if (!isNaN(d.getTime())) {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const diffTime = d.getTime() - today.getTime();
              remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          }
      }
  }

  const confirmSave = async () => {
    if (!plate) return;
    setIsSaving(true);
    try {
      const success = await saveVehicleDate(plate, 'tax_expiration', tempDate);
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

  const handleEgovCheck = () => {
    if (plate) {
      navigator.clipboard.writeText(plate);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
    window.open('https://egov.bg/', '_blank', 'noopener,noreferrer');
  };

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
          <StatusBadge status={finalStatus} customText={activeCustomDate ? (finalStatus === 'valid' ? 'Платен' : finalStatus === 'expiring' ? 'Изтичащ' : 'Неплатен') : tax.statusText} />
        </div>

        {/* Content details */}
        <div className="space-y-3.5 relative">
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
              {finalStatus === 'no_data' && !activeCustomDate ? 'Справка сума' : isPaid ? 'Платена сума' : 'Дължима сума'}
            </span>
            <span className={`text-base font-extrabold font-mono ${finalStatus === 'no_data' && !activeCustomDate ? 'text-slate-400 text-sm' : isPaid ? 'text-emerald-400' : 'text-rose-400'}`}>
              {finalStatus === 'no_data' && !activeCustomDate ? 'Няма данни' : `${amountBgn.toFixed(2)} лв.`}
            </span>
          </div>

          {/* Status highlight banner */}
          <div className={`p-3 rounded-xl border flex items-center justify-between ${
            finalStatus === 'no_data' && !activeCustomDate
              ? 'bg-slate-900/50 border-slate-800/50 text-slate-500'
              : isPaid
                ? 'bg-emerald-950/30 border-emerald-500/20 text-emerald-300'
                : 'bg-rose-950/30 border-rose-500/30 text-rose-300'
          }`}>
            <span className="text-xs flex items-center gap-1.5 font-medium">
              {finalStatus === 'no_data' && !activeCustomDate ? <AlertOctagon className="w-4 h-4 text-slate-600" /> : isPaid ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertOctagon className="w-4 h-4 text-rose-400" />}
              {finalStatus === 'no_data' && !activeCustomDate ? 'Липсват данни за задължения' : isPaid ? 'Данъкът е платен (или ръчно въведен)' : 'Неплатен данък МПС'}
            </span>
            {!isPaid && finalStatus !== 'no_data' && (
              <span className="text-[11px] font-mono underline cursor-pointer hover:text-white">
                Плати с отстъпка
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer deadline */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-3">
        <div className="py-1">
            <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {activeCustomDate ? 'Срок по въведена дата:' : 'Срок за плащане:'}
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
                <div className="flex flex-col gap-2 p-3 mt-2 bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700 animate-in fade-in zoom-in-95 duration-200 shadow-xl">
                <label className="text-xs text-slate-400">Въведете дата:</label>
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
                <div className="flex items-center justify-end mt-1 gap-2">
                    <span className="font-semibold text-slate-200 font-mono">{finalDueDate}</span>
                    {activeCustomDate && <span className="text-[10px] text-cyan-400/80 bg-cyan-400/10 px-1.5 py-0.5 rounded border border-cyan-400/20">Ръчно</span>}
                </div>
            )}
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
          onClick={handleEgovCheck}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:via-indigo-500 hover:to-blue-500 text-white text-xs sm:text-sm font-extrabold rounded-xl shadow-lg shadow-purple-900/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Проверка на Местни Данъци & Такси</span>
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
