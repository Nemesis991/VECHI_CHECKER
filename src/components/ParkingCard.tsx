import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Clock, Edit2, CheckCircle2, AlertOctagon, Info } from 'lucide-react';

interface ParkingCardProps {
  plate: string;
}

export const ParkingCard: React.FC<ParkingCardProps> = ({ plate }) => {
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [tempDate, setTempDate] = useState('');

  // Load from localStorage on mount or plate change
  useEffect(() => {
    if (!plate) return;
    try {
      const saved = localStorage.getItem(`parking_permit_${plate}`);
      if (saved) {
        setExpiryDate(saved);
        setTempDate(saved);
      } else {
        setExpiryDate('');
        setTempDate('');
      }
    } catch (e) {
      console.error(e);
    }
  }, [plate]);

  const handleSave = () => {
    if (!plate) return;
    try {
      if (tempDate) {
        localStorage.setItem(`parking_permit_${plate}`, tempDate);
        setExpiryDate(tempDate);
      } else {
        localStorage.removeItem(`parking_permit_${plate}`);
        setExpiryDate('');
      }
      setIsEditing(false);
    } catch (e) {
      console.error(e);
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
        <div className="space-y-3.5">
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
              <div className="flex flex-col gap-2 p-3 bg-slate-900 rounded-xl border border-slate-700 animate-in fade-in duration-200">
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
                    className="px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold rounded-lg transition-colors"
                  >
                    Запази
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setTempDate(expiryDate);
                    }}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-lg transition-colors"
                  >
                    Отказ
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-sm font-bold text-slate-100 font-mono">
                {expiryDate ? new Date(expiryDate).toLocaleDateString('bg-BG') : 'Няма въведена дата'}
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
          <Clock className="w-3 h-3" />
          Запазва се само във вашия браузър
        </span>
      </div>
    </div>
  );
};
