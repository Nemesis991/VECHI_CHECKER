import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Clock, Edit2, CheckCircle2, AlertOctagon, Info, Cloud } from 'lucide-react';
import { saveVehicleDate } from '../utils/apiCustomDates';

interface ParkingCardProps {
  plate: string;
  customDate?: string;
}

export const ParkingCard: React.FC<ParkingCardProps> = ({ plate, customDate }) => {
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [tempDate, setTempDate] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (customDate) {
      setExpiryDate(customDate);
      setTempDate(customDate);
    } else {
      setExpiryDate('');
      setTempDate('');
    }
  }, [customDate, plate]);

  const handleSave = async () => {
    if (!plate) return;
    setIsSaving(true);
    try {
      const success = await saveVehicleDate(plate, 'parking_permit_expiration', tempDate);
      if (success) {
        setExpiryDate(tempDate);
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

  // Compute status
  let remainingDays = 0;
  let status: 'valid' | 'expiring' | 'expired' | 'no_data' = 'no_data';
  
  if (expiryDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expDate = new Date(expiryDate);
    const diffTime = expDate.getTime() - today.getTime();
    remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (remainingDays < 0) {
      status = 'expired';
    } else if (remainingDays <= 30) {
      status = 'expiring';
    } else {
      status = 'valid';
    }
  }

  const getStatusText = () => {
    if (status === 'no_data') return 'Не е въведен';
    if (status === 'expired') return 'Изтекъл абонамент';
    if (status === 'expiring') return `Изтича скоро! (${remainingDays} дни)`;
    return `Валиден – остават ${remainingDays} дни`;
  };

  const getBadgeStyles = () => {
    if (status === 'no_data') return 'bg-slate-800 text-slate-400 border-slate-700';
    if (status === 'expired') return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
    if (status === 'expiring') return 'bg-amber-500/20 text-amber-400 border-amber-500/30 animate-pulse';
    return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  };

  const getBannerStyles = () => {
    if (status === 'no_data') return 'bg-slate-900/50 border-slate-800/50 text-slate-500';
    if (status === 'expired') return 'bg-rose-950/30 border-rose-500/30 text-rose-300';
    if (status === 'expiring') return 'bg-amber-950/30 border-amber-500/30 text-amber-300';
    return 'bg-emerald-950/30 border-emerald-500/20 text-emerald-300';
  };

  const StatusIcon = status === 'no_data' ? Info : (status === 'valid' ? CheckCircle2 : AlertOctagon);

  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden transition-all h-full flex flex-col justify-between border border-slate-800/90">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Паркиране и Зони</h3>
              <p className="text-xs text-slate-400">Абонамент за живущи</p>
            </div>
          </div>
          <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getBadgeStyles()}`}>
            {status === 'no_data' ? 'Липсва' : status === 'valid' ? 'Активен' : status === 'expiring' ? 'Изтичащ' : 'Изтекъл'}
          </div>
        </div>

        {/* Content details */}
        <div className="space-y-3.5 relative">
          {/* Toast Notification */}
          {showToast && (
            <div className="absolute -top-12 left-0 right-0 flex justify-center z-10 animate-in slide-in-from-top-4 fade-in duration-300">
              <div className="bg-emerald-500/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg border border-emerald-400/30 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Датите за {plate} са запазени!
              </div>
            </div>
          )}

          {/* Validity tracker section */}
          <div className="py-2 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Валидност на абонамента
              </span>
              
              {!isEditing && (
                <button
                  onClick={() => {
                    setTempDate(expiryDate);
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
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-50"
                  >
                    Запази
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setTempDate(expiryDate);
                    }}
                    disabled={isSaving}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
                  >
                    Отказ
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="text-sm font-bold text-slate-100 font-mono">
                  {expiryDate ? new Date(expiryDate).toLocaleDateString('bg-BG') : 'Няма въведена дата'}
                </div>
                {expiryDate && <span className="text-[10px] text-cyan-400/80 bg-cyan-400/10 px-1.5 py-0.5 rounded ml-1 border border-cyan-400/20">Ръчно</span>}
              </div>
            )}
          </div>

          {/* Status highlight banner */}
          <div className={`p-3 rounded-xl border flex items-center justify-between ${getBannerStyles()}`}>
            <span className="text-xs flex items-center gap-1.5 font-medium">
              <StatusIcon className={`w-4 h-4 ${status === 'valid' ? 'text-emerald-400' : status === 'expiring' ? 'text-amber-400' : status === 'expired' ? 'text-rose-400' : 'text-slate-600'}`} />
              {getStatusText()}
            </span>
          </div>
        </div>
      </div>

      {/* Footer advice */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <Cloud className="w-3 h-3 text-cyan-500" />
          Синхронизирано в облака
        </span>
      </div>
    </div>
  );
};
