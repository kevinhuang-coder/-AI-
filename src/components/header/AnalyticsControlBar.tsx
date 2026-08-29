import React from 'react';
import { useFinancial } from '../../context/FinancialContext';
import {
  Building2,
  TrendingUp,
  Calendar,
  Layers,
  Zap,
  Info,
} from 'lucide-react';

export const AnalyticsControlBar: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    timeFrequency,
    setTimeFrequency,
    activeCompany,
    latestPeriod,
  } = useFinancial();

  return (
    <div className="bg-slate-900/60 border border-slate-800/90 rounded-2xl sm:rounded-3xl p-3 sm:p-4 backdrop-blur-md shadow-sm relative">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
        
        {/* Left & Middle: Perspective & Time Frequency Switchers */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5">
          
          {/* 1. Dual Perspective Switcher (Manager vs Investor) */}
          <div className="flex items-center bg-slate-950/90 p-1 rounded-xl border border-slate-800 text-xs font-medium shadow-inner">
            <button
              id="view-mode-manager-btn"
              onClick={() => setViewMode('manager')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer min-h-[32px] ${
                viewMode === 'manager'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
              title="切換為企業經營視角：營運資金、週轉天數與內部資金效率"
            >
              <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
              <span>企業經營視角</span>
            </button>
            <button
              id="view-mode-investor-btn"
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

          <div className="hidden sm:block w-px h-6 bg-slate-800"></div>

          {/* 2. Time Frequency Switcher: Annual vs TTM */}
          <div className="flex items-center bg-slate-950/90 p-1 rounded-xl border border-slate-800 text-xs font-medium shadow-inner">
            <button
              onClick={() => setTimeFrequency('annual')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer min-h-[32px] ${
                timeFrequency === 'annual'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
              title="歷年官方年度財報（消除短期雜音，綜觀 3~5 年資本配置）"
            >
              <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
              <span>歷年年報</span>
            </button>

            <button
              onClick={() => setTimeFrequency('ttm')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer min-h-[32px] ${
                timeFrequency === 'ttm'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
              title="近四季滾動累計 TTM（以 4 季加總換算類整年，兼具最新時效與淡旺季平滑）"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
              <span>近4季 TTM</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-900/80 text-cyan-200 font-mono border border-cyan-700/50">
                類整年
              </span>
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
