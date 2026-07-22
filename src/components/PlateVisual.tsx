import React from 'react';
import { formatPlateDisplay } from '../utils/plateUtils';

interface PlateVisualProps {
  plateText: string;
  size?: 'sm' | 'md' | 'lg';
  isElectric?: boolean;
}

export const PlateVisual: React.FC<PlateVisualProps> = ({
  plateText,
  size = 'md',
  isElectric = false,
}) => {
  const formatted = formatPlateDisplay(plateText) || 'СА 0000 АВ';

  const containerSizes = {
    sm: 'h-10 px-1 text-base',
    md: 'h-14 sm:h-16 px-1.5 text-xl sm:text-2xl',
    lg: 'h-16 sm:h-20 px-2 text-2xl sm:text-3xl',
  }[size];

  const flagStripWidth = {
    sm: 'w-6 text-[8px]',
    md: 'w-8 sm:w-10 text-[10px] sm:text-xs',
    lg: 'w-10 sm:w-12 text-xs sm:text-sm',
  }[size];

  return (
    <div
      className={`inline-flex items-stretch rounded-lg border-2 border-slate-900 bg-gradient-to-b from-slate-100 via-white to-slate-200 text-slate-950 font-license-plate font-bold shadow-2xl overflow-hidden select-none tracking-wider ${containerSizes}`}
      style={{
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.6), inset 0 2px 2px rgba(255, 255, 255, 0.9), inset 0 -2px 2px rgba(0, 0, 0, 0.2)',
      }}
    >
      {/* EU Left Strip */}
      <div
        className={`flex flex-col justify-between items-center py-1 font-sans ${flagStripWidth} ${
          isElectric
            ? 'bg-emerald-600 text-white'
            : 'bg-blue-700 text-white'
        }`}
      >
        {/* Yellow EU Stars representation */}
        <div className="flex flex-wrap justify-center items-center w-3 h-3 text-[7px] leading-none text-yellow-300 opacity-90">
          ★
        </div>
        {/* BG text */}
        <span className="font-extrabold tracking-widest text-[11px] sm:text-xs leading-none">
          BG
        </span>
      </div>

      {/* Main Plate Number */}
      <div className="flex-1 flex items-center justify-center px-3 font-mono font-black text-slate-950 uppercase tracking-widest drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)]">
        {formatted}
      </div>
    </div>
  );
};
