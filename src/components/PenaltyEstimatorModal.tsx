import React from 'react';
import { X, AlertCircle, ShieldAlert, Gavel, FileWarning } from 'lucide-react';

interface PenaltyEstimatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PenaltyEstimatorModal: React.FC<PenaltyEstimatorModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-card rounded-2xl max-w-2xl w-full p-6 sm:p-8 relative border border-slate-700 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">
                Справка за Глоби и Санкции (Закон за движение по пътищата)
              </h2>
              <p className="text-xs text-slate-400">
                Законови последици при управление на МПС с изтекли документи в България
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fine 1: Insurance */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-rose-500/30 space-y-2">
              <div className="flex items-center justify-between text-rose-400 font-bold text-sm">
                <span className="flex items-center gap-1.5">
                  <Gavel className="w-4 h-4" /> Без Гражданска отговорност
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-xs">от 250 до 2000 лв.</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Глоба за физически лица: <strong>250 лв.</strong> (първо нарушение) или <strong>500 лв.</strong> (повторно). За юридически лица и ЕТ имуществена санкция от <strong>2000 лв.</strong> Допълнително: временно спиране на МПС от движение!
              </p>
            </div>

            {/* Fine 2: GTP */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between text-amber-400 font-bold text-sm">
                <span className="flex items-center gap-1.5">
                  <FileWarning className="w-4 h-4" /> Без ГТП (Техн. преглед)
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-xs">от 50 до 1500 лв.</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Глоба от <strong>50 лв.</strong> при шофиране с изтекъл ГТП + 5 контролни точки. Внимание: застрахователят може да откаже изплащане на щета при ПТП!
              </p>
            </div>

            {/* Fine 3: Vignette */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between text-amber-400 font-bold text-sm">
                <span className="flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> Без Е-Винетка (BG Toll)
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-xs">300 лв. компенсация</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Компенсаторна такса от <strong>300 лв.</strong> за лек автомобил (при заплащане в 14-дневен срок). При отказ: акт и глоба <strong>1800 лв.</strong> от камерите на БГ Тол!
              </p>
            </div>

            {/* Fine 4: Tax */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-slate-300 font-bold text-sm">
                <span className="flex items-center gap-1.5">
                  <FileWarning className="w-4 h-4" /> Неплатен Данък МПС
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-xs">Лихви + Невъзможен ГТП</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Начисляват се законови лихви за забава. Всички пунктове за ГТП са свързани онлайн с общините — <strong>не можете да преминете ГТП</strong> без платена такса МПС!
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/50 text-xs text-cyan-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <p>
              Данните са базирани на ЗДвП и Наредба № Н-32 за периодичните прегледи за проверка на техническата изправност на пътните превозни средства.
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold transition-colors cursor-pointer"
            >
              Затвори
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
