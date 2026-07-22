import React from 'react';
import { CheckResult } from '../types';
import { X, Printer, ShieldCheck, Car } from 'lucide-react';

interface PrintReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: CheckResult;
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({ isOpen, onClose, result }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-card rounded-2xl max-w-3xl w-full p-6 sm:p-8 relative border border-slate-700 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Controls */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800 no-print">
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Printer className="w-5 h-5 text-cyan-400" />
            Предварителен Преглед за Принтиране / PDF
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Принтирай Справката</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Sheet Container */}
        <div className="bg-slate-900 print:bg-white print:text-black text-slate-100 p-6 sm:p-8 rounded-xl border border-slate-800 print:border-none space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-4 border-slate-800 print:border-black">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-cyan-500/20 text-cyan-400 print:bg-slate-100 print:text-black rounded-xl">
                <Car className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white print:text-black">
                  ОФИЦИАЛНА СПРАВКА ЗА МПС
                </h1>
                <p className="text-xs text-slate-400 print:text-slate-600">
                  Електронен регистър на автомобилите в Република България
                </p>
              </div>
            </div>
            <div className="text-right text-xs text-slate-400 print:text-slate-600 font-mono">
              <div>Дата: {result.checkTimestamp}</div>
              <div className="font-bold text-slate-200 print:text-black">Рег. № {result.formattedPlate}</div>
            </div>
          </div>

          {/* Vehicle summary block */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-950/80 print:bg-slate-100 border border-slate-800 print:border-slate-300">
            <div>
              <span className="text-[10px] text-slate-400 print:text-slate-600 uppercase block font-semibold">Марка & Модел</span>
              <span className="text-sm font-bold text-white print:text-black">{result.vehicle.make} {result.vehicle.model}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 print:text-slate-600 uppercase block font-semibold">VIN Номер</span>
              <span className="text-xs font-mono font-bold text-white print:text-black">{result.vehicle.vin}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 print:text-slate-600 uppercase block font-semibold">Година / Гориво</span>
              <span className="text-sm font-bold text-white print:text-black">{result.vehicle.year} г. ({result.vehicle.engineType})</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 print:text-slate-600 uppercase block font-semibold">Категория / Цвят</span>
              <span className="text-xs font-bold text-white print:text-black">{result.vehicle.category} / {result.vehicle.color}</span>
            </div>
          </div>

          {/* Document Status Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-300 print:text-black uppercase tracking-wider">
              Статус на застраховки, прегледи и такси:
            </h3>

            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 print:border-slate-300 text-slate-400 print:text-slate-700 bg-slate-950/50 print:bg-slate-100">
                  <th className="py-2.5 px-3">Документ</th>
                  <th className="py-2.5 px-3">Статус</th>
                  <th className="py-2.5 px-3">Валиден до</th>
                  <th className="py-2.5 px-3">Номер / Полица</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-slate-300">
                <tr>
                  <td className="py-2.5 px-3 font-bold text-slate-200 print:text-black">Гражданска отговорност</td>
                  <td className="py-2.5 px-3 font-semibold text-emerald-400 print:text-black">{result.insurance.statusText}</td>
                  <td className="py-2.5 px-3 font-mono">{result.insurance.expiryDate}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-400 print:text-slate-700">{result.insurance.policyNumber}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-slate-200 print:text-black">Технически преглед (ГТП)</td>
                  <td className="py-2.5 px-3 font-semibold text-purple-400 print:text-black">{result.inspection.statusText} ({result.inspection.ecoCategory})</td>
                  <td className="py-2.5 px-3 font-mono">{result.inspection.expiryDate}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-400 print:text-slate-700">{result.inspection.certificateNumber}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-slate-200 print:text-black">Винетка (Е-винетка)</td>
                  <td className="py-2.5 px-3 font-semibold text-amber-400 print:text-black">{result.vignette.statusText} ({result.vignette.vignetteType})</td>
                  <td className="py-2.5 px-3 font-mono">{result.vignette.expiryDate}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-400 print:text-slate-700">{result.vignette.serialNumber}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-slate-200 print:text-black">Данък МПС</td>
                  <td className="py-2.5 px-3 font-semibold text-emerald-400 print:text-black">{result.tax.statusText} ({result.tax.amountBgn.toFixed(2)} лв.)</td>
                  <td className="py-2.5 px-3 font-mono">{result.tax.dueDate}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-400 print:text-slate-700">{result.tax.municipality}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer certification */}
          <div className="pt-4 border-t border-slate-800 print:border-black flex items-center justify-between text-[10px] text-slate-500 print:text-slate-600 font-mono">
            <span>Автоматично генериран документ. Не изисква печат.</span>
            <span>https://автомобили.бг</span>
          </div>
        </div>
      </div>
    </div>
  );
};
