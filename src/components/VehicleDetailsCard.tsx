import React, { useState } from 'react';
import { VehicleDetails } from '../types';
import { Car, Hash, Calendar, Zap, Shield, Copy, Check, Fuel, Info } from 'lucide-react';

interface VehicleDetailsCardProps {
  vehicle: VehicleDetails;
}

export const VehicleDetailsCard: React.FC<VehicleDetailsCardProps> = ({ vehicle }) => {
  const [copiedVin, setCopiedVin] = useState(false);

  const handleCopyVin = () => {
    navigator.clipboard.writeText(vehicle.vin);
    setCopiedVin(true);
    setTimeout(() => setCopiedVin(false), 2000);
  };

  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden transition-all h-full flex flex-col justify-between border border-slate-800/90">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Основни данни</h3>
              <p className="text-xs text-slate-400">Характеристики на МПС</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-800 text-cyan-300 border border-slate-700">
            {vehicle.category}
          </span>
        </div>

        {/* Data Grid */}
        <div className="space-y-3.5">
          {/* Make & Model */}
          <div className="flex items-center justify-between py-1 border-b border-slate-800/50">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-slate-500" />
              Марка & Модел
            </span>
            <span className="text-sm font-extrabold text-white">
              {vehicle.make} {vehicle.model}
            </span>
          </div>

          {/* VIN Number with Copy */}
          <div className="flex items-center justify-between py-1 border-b border-slate-800/50">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-slate-500" />
              VIN номер (Рама)
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono font-bold text-slate-200 tracking-wider">
                {vehicle.vin}
              </span>
              <button
                onClick={handleCopyVin}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Копирай VIN"
              >
                {copiedVin ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Year */}
          <div className="flex items-center justify-between py-1 border-b border-slate-800/50">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              Година на производство
            </span>
            <span className="text-sm font-semibold text-slate-200">
              {vehicle.year} г.
            </span>
          </div>

          {/* Engine & Power */}
          <div className="flex items-center justify-between py-1 border-b border-slate-800/50">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Fuel className="w-3.5 h-3.5 text-slate-500" />
              Гориво / Мощност
            </span>
            <span className="text-sm font-semibold text-slate-200">
              {vehicle.engineType} ({vehicle.powerHp} к.с. / {vehicle.engineCapacityCc} см³)
            </span>
          </div>

          {/* Color */}
          <div className="flex items-center justify-between py-1 border-b border-slate-800/50">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-slate-500" />
              Цвят
            </span>
            <span className="text-xs font-medium text-slate-300">
              {vehicle.color}
            </span>
          </div>

          {/* First Registration */}
          <div className="flex items-center justify-between py-1 border-b border-slate-800/50">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-slate-500" />
              Първа регистрация
            </span>
            <span className="text-xs font-semibold text-slate-300">
              {vehicle.firstRegistrationDate}
            </span>
          </div>

          {/* Country of Origin */}
          <div className="flex items-center justify-between py-1">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-500" />
              Произход (Държава)
            </span>
            <span className="text-xs font-semibold text-slate-300">
              {vehicle.country || 'Няма данни'}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Euro Standard badge */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          Еко стандарт
        </span>
        <span className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/50 font-bold font-mono">
          {vehicle.euroStandard}
        </span>
      </div>
    </div>
  );
};
