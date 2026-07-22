import React, { useState } from 'react';
import { Car, ShieldCheck, AlertCircle, ExternalLink, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  onOpenPenaltiesInfo: () => void;
  plate?: string;
}

export const Header: React.FC<HeaderProps> = ({ onOpenPenaltiesInfo, plate = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleFinesCheck = () => {
    if (plate) {
      navigator.clipboard.writeText(plate);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
    window.open('https://e-services.mvr.bg/gservices/check-obligations', '_blank', 'noopener,noreferrer');
  };

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
            onClick={handleFinesCheck}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:via-indigo-500 hover:to-blue-500 text-white shadow-lg shadow-purple-900/30 active:scale-[0.98] transition-all border border-transparent"
            title="Проверка на глоби в системата на МВР"
          >
            {copied ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <ExternalLink className="w-4 h-4" />
            )}
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
