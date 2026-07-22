import React, { useState } from 'react';
import { CheckResult } from '../types';
import { X, Bell, Calendar, Mail, Check, Download, ExternalLink } from 'lucide-react';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: CheckResult;
  plate?: string;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({ isOpen, onClose, result, plate = '' }) => {
  const [email, setEmail] = useState('');
  const [selectedDocs, setSelectedDocs] = useState<string[]>(['insurance', 'inspection', 'vignette']);
  const [isSaved, setIsSaved] = useState(false);

  const customDates = result.customDates || {};

  const getDisplayDate = (customDate?: string, defaultDate?: string) => {
    if (customDate) {
      const d = new Date(customDate);
      if (!isNaN(d.getTime())) return d.toLocaleDateString('bg-BG');
    }
    return defaultDate || 'Няма данни';
  };

  const insuranceDate = getDisplayDate(customDates.go_expiration, result.insurance.expiryDate);
  const inspectionDate = getDisplayDate(customDates.gtp_expiration, result.inspection.expiryDate);
  const vignetteDate = getDisplayDate(customDates.vignette_expiration, result.vignette.expiryDate);
  
  const parkingPermitRaw = customDates.parking_permit_expiration;
  const parkingPermitDate = parkingPermitRaw ? new Date(parkingPermitRaw).toLocaleDateString('bg-BG') : null;

  React.useEffect(() => {
    if (isOpen && parkingPermitDate && !selectedDocs.includes('parking')) {
      setSelectedDocs(prev => [...prev, 'parking']);
    }
  }, [isOpen, parkingPermitDate]);

  if (!isOpen) return null;

  const toggleDoc = (key: string) => {
    if (selectedDocs.includes(key)) {
      setSelectedDocs(selectedDocs.filter((d) => d !== key));
    } else {
      setSelectedDocs([...selectedDocs, key]);
    }
  };

  const handleSaveReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 2500);
  };

  const downloadIcsCalendar = () => {
    const eventText = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Проверка на МПС//BG
BEGIN:VEVENT
SUMMARY:Напомняне: Изтичащи документи МПС ${result.formattedPlate}
DESCRIPTION:Гражданска отговорност: ${insuranceDate}\\nГТП: ${inspectionDate}\\nВинетка: ${vignetteDate}${parkingPermitDate ? `\\nПаркиране и Зони: ${parkingPermitDate}` : ''}
DTSTART:20260801T090000Z
DTEND:20260801T100000Z
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([eventText], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Напомняне_${result.formattedPlate.replace(/\\s+/g, '')}.ics`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-card rounded-2xl max-w-lg w-full p-6 sm:p-8 relative border border-slate-700 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">
                Заяви Известие за Изтичане
              </h2>
              <p className="text-xs text-slate-400">
                Получете безплатно известие 14 дни преди изтичане на документ за {result.formattedPlate}
              </p>
            </div>
          </div>

          {isSaved ? (
            <div className="p-6 rounded-2xl bg-emerald-950/50 border border-emerald-500/30 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-emerald-300">Напомнянето е успешно активирано!</h3>
              <p className="text-xs text-slate-300">
                Ще ви изпратим имейл на <strong>{email}</strong> преди изтичането на избраните документи.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSaveReminder} className="space-y-5">
              {/* Email field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  Вашият Имейл адрес
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ivan.petrov@example.com"
                  className="w-full px-4 py-3 rounded-xl glass-input text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              {/* Document Toggles */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">
                  Изберете за кои документи да следим:
                </label>
                <div className="space-y-2">
                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:bg-slate-800/80 transition-colors">
                    <span className="text-xs font-semibold text-slate-200">
                      Гражданска отговорност ({insuranceDate})
                    </span>
                    <input
                      type="checkbox"
                      checked={selectedDocs.includes('insurance')}
                      onChange={() => toggleDoc('insurance')}
                      className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-500 bg-slate-950 border-slate-700"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:bg-slate-800/80 transition-colors">
                    <span className="text-xs font-semibold text-slate-200">
                      Технически преглед ГТП ({inspectionDate})
                    </span>
                    <input
                      type="checkbox"
                      checked={selectedDocs.includes('inspection')}
                      onChange={() => toggleDoc('inspection')}
                      className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-500 bg-slate-950 border-slate-700"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:bg-slate-800/80 transition-colors">
                    <span className="text-xs font-semibold text-slate-200">
                      Винетка ({vignetteDate})
                    </span>
                    <input
                      type="checkbox"
                      checked={selectedDocs.includes('vignette')}
                      onChange={() => toggleDoc('vignette')}
                      className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-500 bg-slate-950 border-slate-700"
                    />
                  </label>
                  
                  {parkingPermitDate && (
                    <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:bg-slate-800/80 transition-colors">
                      <span className="text-xs font-semibold text-slate-200">
                        Абонамент за паркиране ({parkingPermitDate})
                      </span>
                      <input
                        type="checkbox"
                        checked={selectedDocs.includes('parking')}
                        onChange={() => toggleDoc('parking')}
                        className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-500 bg-slate-950 border-slate-700"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="w-full sm:flex-1 py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Bell className="w-4 h-4" />
                  <span>Запази Известие</span>
                </button>

                <button
                  type="button"
                  onClick={downloadIcsCalendar}
                  className="w-full sm:w-auto py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
                  title="Свали .ics файл за Google Calendar / Apple Calendar"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>Свали Календар (.ics)</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
