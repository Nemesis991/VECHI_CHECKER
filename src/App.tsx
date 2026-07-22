import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchSection } from './components/SearchSection';
import { OverallStatusBanner } from './components/OverallStatusBanner';
import { VehicleDetailsCard } from './components/VehicleDetailsCard';
import { InsuranceCard } from './components/InsuranceCard';
import { InspectionCard } from './components/InspectionCard';
import { VignetteCard } from './components/VignetteCard';
import { TaxCard } from './components/TaxCard';
import { TimelineView } from './components/TimelineView';
import { PenaltyEstimatorModal } from './components/PenaltyEstimatorModal';
import { ReminderModal } from './components/ReminderModal';
import { PrintReportModal } from './components/PrintReportModal';
import { generateMockResult } from './data/mockData';
import { CheckResult } from './types';
import { Loader2, ShieldCheck, Sparkles, RefreshCw, Layers, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activePlate, setActivePlate] = useState<string>('СА 1234 АВ');
  const [result, setResult] = useState<CheckResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStepText, setLoadingStepText] = useState<string>('');

  // Modals
  const [isPenaltiesOpen, setIsPenaltiesOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);

  // Initial check on mount
  useEffect(() => {
    handleExecuteCheck({ plate: 'СА 1234 АВ', vin: '' }, false);
  }, []);

  const handleExecuteCheck = async (params: { plate?: string; vin?: string }, withDelay = true) => {
    const targetPlate = (params.plate || '').trim();
    const targetVin = (params.vin || '').trim();
    if (!targetPlate && !targetVin) return;

    setActivePlate(targetPlate || targetVin);

    setIsLoading(true);
    if (withDelay) {
      setLoadingStepText('Свързване с държавния регистър...');
      setTimeout(() => {
        setLoadingStepText('Справка в системата на BG Toll и външни бази...');
      }, 400);
    }

    try {
      const promises = [];
      if (targetPlate) {
        promises.push(fetch('/api/check-plate/' + encodeURIComponent(targetPlate)).then(res => res.json()));
      }
      if (targetVin) {
        promises.push(fetch('/api/check-plate/' + encodeURIComponent(targetVin)).then(res => res.json()));
      }

      const results = await Promise.all(promises);
      
      let data: any = null;
      if (results.length === 2) {
        data = { ...results[0] };
        data.vehicle = results[1].vehicle;
      } else if (results.length === 1) {
        data = results[0];
      }

      if (!data) throw new Error("No data returned");

      const processData = (newData: any) => {
        setResult(prev => {
          if (!prev) return newData;
          const merged = { ...newData };
          
          // If we just searched a VIN (gets vehicle data, but misses vignette/etc)
          if (newData.vignette.status === 'no_data' && prev.vignette.status !== 'no_data') {
            merged.vignette = prev.vignette;
            merged.insurance = prev.insurance;
            merged.tax = prev.tax;
            merged.inspection = prev.inspection;
            merged.plate = prev.plate;
            merged.formattedPlate = prev.formattedPlate;
          } 
          // If we just searched a Plate (gets vignette, but misses vehicle data)
          else if (newData.vehicle.make === 'Няма данни' && prev.vehicle.make !== 'Няма данни') {
            merged.vehicle = prev.vehicle;
          }
          
          return merged;
        });
        setIsLoading(false);
      };

      if (withDelay) {
        setTimeout(() => processData(data), 800);
      } else {
        processData(data);
      }
    } catch (error) {
      console.error("Error fetching check result:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Background Subtle Gradient Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-1/3 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header Navigation */}
        <Header 
          onOpenPenaltiesInfo={() => setIsPenaltiesOpen(true)} 
          plate={activePlate}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Search Box Section */}
          <SearchSection
            onCheck={(p) => handleExecuteCheck(p, true)}
            isLoading={isLoading}
            activePlate={activePlate}
          />

          {/* Loading Overlay / Spinner state */}
          {isLoading && (
            <div className="glass-card rounded-2xl p-12 text-center border border-cyan-500/30 max-w-2xl mx-auto space-y-4 animate-in fade-in duration-300">
              <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20 animate-ping" />
                <div className="w-16 h-16 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin" />
                <Sparkles className="w-6 h-6 text-cyan-400 absolute" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-white">Проверка в държавния регистър...</h3>
                <p className="text-xs text-cyan-300 font-mono animate-pulse">{loadingStepText}</p>
              </div>
            </div>
          )}

          {/* Dashboard Results Section */}
          {!isLoading && result && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
              {/* Top Overall Status Banner */}
              <OverallStatusBanner
                result={result}
                onOpenReminderModal={() => setIsReminderOpen(true)}
                onOpenPrintModal={() => setIsPrintOpen(true)}
                onOpenPenaltiesInfo={() => setIsPenaltiesOpen(true)}
              />

              {/* Grid of 5 Cards */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-cyan-400" />
                    Детайлна справка по документи
                  </h2>
                  <span className="text-xs text-slate-400 font-mono">
                    Рег. №: <strong className="text-slate-200">{result.formattedPlate}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Card 1: Vehicle Details */}
                  <div className="lg:col-span-1">
                    <VehicleDetailsCard vehicle={result.vehicle} />
                  </div>

                  {/* Card 2: Insurance */}
                  <div className="lg:col-span-1">
                    <InsuranceCard insurance={result.insurance} plate={activePlate} />
                  </div>

                  {/* Card 3: Technical Inspection */}
                  <div className="lg:col-span-1">
                    <InspectionCard inspection={result.inspection} plate={result.plate} />
                  </div>

                  {/* Card 4: Vignette */}
                  <div className="md:col-span-1 lg:col-span-1">
                    <VignetteCard vignette={result.vignette} />
                  </div>

                  {/* Card 5: Vehicle Tax */}
                  <div className="md:col-span-1 lg:col-span-2">
                    <TaxCard tax={result.tax} plate={activePlate} />
                  </div>
                </div>
              </div>

              {/* Expiration Timeline Chronology */}
              <TimelineView result={result} />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md py-8 text-xs text-slate-500 mt-12 no-print">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div className="space-y-1">
              <p className="font-bold text-slate-400">
                Проверка на МПС — Портал за справка на автопарк
              </p>
              <p className="text-[11px] text-slate-500">
                Данните са тестови и се обновяват регулярно. Автоматизирано форматиране на кирилица и латиница.
              </p>
            </div>
            <div className="flex items-center gap-4 text-slate-400 font-medium">
              <button
                onClick={() => setIsPenaltiesOpen(true)}
                className="hover:text-cyan-400 transition-colors cursor-pointer"
              >
                Глоби и Законодателство
              </button>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Активна връзка
              </span>
            </div>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <PenaltyEstimatorModal
        isOpen={isPenaltiesOpen}
        onClose={() => setIsPenaltiesOpen(false)}
      />

      {result && (
        <>
          <ReminderModal
            isOpen={isReminderOpen}
            onClose={() => setIsReminderOpen(false)}
            result={result}
          />

          <PrintReportModal
            isOpen={isPrintOpen}
            onClose={() => setIsPrintOpen(false)}
            result={result}
          />
        </>
      )}
    </div>
  );
}
