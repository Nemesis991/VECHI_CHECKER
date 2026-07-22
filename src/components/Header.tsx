import React from 'react';
import { Car, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

interface HeaderProps {
  onOpenPenaltiesInfo: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenPenaltiesInfo }) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 transition-all no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand logo & title */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 text-white shadow-lg shadow-cyan-500/20 ring-1 ring-white/20">
            <Car className="w-6 h-6 sm:w-7 sm:h-7" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-slate-950 animate-ping" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-slate-950" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-1.5">
                Проверка на МПС
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Официален Регистър
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden xs:block">
              Бърза проверка за Гражданска отговорност, ГТП, Винетка и Данък
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenPenaltiesInfo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all"
            title="Информация за глоби при изтекли документи"
          >
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Справка за Глоби</span>
          </button>

          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Система на МВР & КАТ</span>
          </div>
        </div>
      </div>
    </header>
  );
};
