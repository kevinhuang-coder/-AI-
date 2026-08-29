import React from 'react';
import { useFinancial } from '../../context/FinancialContext';
import {
  Building2,
  TrendingUp,
  Briefcase,
  Layers,
  Info,
} from 'lucide-react';

export const AnalyticsControlBar: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    activeCompany,
    latestPeriod,
  } = useFinancial();

  return (
    <div className="bg-slate-900/60 border border-slate-800/90 rounded-2xl sm:rounded-3xl p-3 sm:p-4 backdrop-blur-md shadow-sm relative">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
        
        {/* Left Side: Perspective Switcher */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          
          {/* Perspective View Switcher */}
          <div className="flex items-center bg-slate-950/90 p-1 rounded-xl border border-slate-800 text-xs font-medium shadow-inner">
            <button
              onClick={() => setViewMode('manager')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer min-h-[32px] ${
                viewMode === 'manager'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
              title="切換為企業經理人視角：營運資金、週轉天數與杜邦分析"
            >
              <Briefcase className="w-3.5 h-3.5 text-blue-300 flex-shrink-0" />
              <span>經理人視角 (CFO)</span>
            </button>

            <button
              onClick={() => setViewMode('investor')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer min-h-[32px] ${
                viewMode === 'investor'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
              title="切換為價值投資視角：經濟護城河、獲利含金量與自由現金流"
            >
              <TrendingUp className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
              <span>價值投資視角</span>
            </button>
          </div>

        </div>

        {/* Right Status Pill: Current Entity, Period & Currency */}
        <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800/80 self-start lg:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0"></span>
          <span className="text-slate-300 font-semibold truncate max-w-[160px] sm:max-w-[220px]">
            {activeCompany.name}
          </span>
          <span className="text-indigo-400 font-mono">({activeCompany.code})</span>
          <span className="text-slate-600">•</span>
          <span className="text-cyan-300 font-medium font-mono">
            {latestPeriod?.period || '最新期別'}
          </span>
        </div>

      </div>
    </div>
  );
};
