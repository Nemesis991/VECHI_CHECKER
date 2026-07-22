import React, { useState, useEffect } from 'react';
import { Search, Loader2, Sparkles, X, Car, Hash, CornerDownLeft, RotateCcw, History } from 'lucide-react';
import { SAMPLE_PRESETS } from '../data/mockData';
import { sanitizePlateInput, sanitizeVINInput, formatPlateDisplay } from '../utils/plateUtils';

interface SearchSectionProps {
  onCheck: (params: { plate: string; vin: string }) => void;
  isLoading: boolean;
  activePlate?: string;
}

export const SearchSection: React.FC<SearchSectionProps> = ({
  onCheck,
  isLoading,
  activePlate = '',
}) => {
  const [plateValue, setPlateValue] = useState(activePlate);
  const [vinValue, setVinValue] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('bg_car_recent_plates');
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (activePlate) {
      setPlateValue(activePlate);
      setVinValue('');
    }
  }, [activePlate]);

  const saveToRecent = (plate: string) => {
    if (!plate) return;
    const formatted = formatPlateDisplay(plate);
    if (!formatted) return;
    const updated = [formatted, ...recentSearches.filter((p) => p !== formatted)].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem('bg_car_recent_plates', JSON.stringify(updated));
    } catch (e) {}
  };

  const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlateValue(sanitizePlateInput(e.target.value));
  };

  const handleVinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVinValue(sanitizeVINInput(e.target.value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!plateValue.trim() && !vinValue.trim()) || isLoading) return;
    if (plateValue) saveToRecent(plateValue);
    onCheck({ plate: plateValue, vin: vinValue });
  };

  const handlePresetSelect = (plate: string) => {
    const sanitized = sanitizePlateInput(plate);
    setPlateValue(sanitized);
    setVinValue('');
    saveToRecent(sanitized);
    onCheck({ plate: sanitized, vin: '' });
  };

  const clearHistory = () => {
    setRecentSearches([]);
    localStorage.removeItem('bg_car_recent_plates');
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 no-print">
      {/* Main Search Card */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 relative overflow-hidden border border-slate-800 shadow-2xl">
        {/* Glow ambient background effects */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Електронен Регистър на МПС
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Проверка по Рег. Номер или VIN
            </h2>
            <p className="text-sm text-slate-400 max-w-lg mx-auto">
              Въведете рег. номер, VIN номер (или и двете) за пълна справка на застраховка, преглед, винетка и данни за автомобила.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col md:flex-row items-stretch gap-4">
              {/* Plate Input Box */}
              <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-400 transition-colors">
                  <Car className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={plateValue}
                  onChange={handlePlateChange}
                  placeholder="Рег. номер (напр. СА1234АВ)"
                  className="w-full pl-11 pr-10 py-4 text-lg font-bold uppercase tracking-wider rounded-xl glass-input text-white placeholder:text-slate-500 placeholder:normal-case placeholder:text-sm focus:outline-none transition-all font-mono"
                  maxLength={10}
                  disabled={isLoading}
                />
                {plateValue && !isLoading && (
                  <button
                    type="button"
                    onClick={() => setPlateValue('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* VIN Input Box */}
              <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-400 transition-colors">
                  <Hash className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={vinValue}
                  onChange={handleVinChange}
                  placeholder="VIN (17-символа)"
                  className="w-full pl-11 pr-10 py-4 text-lg font-bold uppercase tracking-wider rounded-xl glass-input text-white placeholder:text-slate-500 placeholder:normal-case placeholder:text-sm focus:outline-none transition-all font-mono"
                  maxLength={17}
                  disabled={isLoading}
                />
                {vinValue && !isLoading && (
                  <button
                    type="button"
                    onClick={() => setVinValue('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <button
                type="submit"
                disabled={(!plateValue.trim() && !vinValue.trim()) || isLoading}
                className="w-full md:w-auto px-12 py-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-base sm:text-lg font-extrabold rounded-xl shadow-lg shadow-cyan-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                    <span>Проверка...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>Провери</span>
                    <CornerDownLeft className="w-4 h-4 opacity-70 hidden sm:inline" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Preset Test Buttons */}
          <div className="pt-2 border-t border-slate-800/80 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Тестови рег. номера (Демо сценарии):
              </span>
              <span className="text-slate-500 hidden sm:inline">Кликнете за бърза проверка</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SAMPLE_PRESETS.map((preset) => (
                <button
                  key={preset.plate}
                  type="button"
                  onClick={() => handlePresetSelect(preset.plate)}
                  disabled={isLoading}
                  className="group relative p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 text-left transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-mono font-bold text-sm text-slate-100 group-hover:text-cyan-400 transition-colors">
                      {preset.plate}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        preset.statusType === 'valid'
                          ? 'bg-emerald-400'
                          : preset.statusType === 'expiring'
                          ? 'bg-amber-400 animate-ping'
                          : 'bg-rose-500'
                      }`}
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 line-clamp-1">
                    {preset.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Search History */}
          {recentSearches.length > 0 && (
            <div className="flex items-center gap-2 pt-1 overflow-x-auto text-xs no-scrollbar">
              <span className="text-slate-500 flex items-center gap-1 shrink-0 font-medium">
                <History className="w-3 h-3 text-slate-400" />
                Последно проверявани:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {recentSearches.map((plate) => (
                  <button
                    key={plate}
                    type="button"
                    onClick={() => handlePresetSelect(plate)}
                    disabled={isLoading}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 font-mono font-bold transition-all cursor-pointer text-xs"
                  >
                    {plate}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={clearHistory}
                  className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                  title="Изчисти историята"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
