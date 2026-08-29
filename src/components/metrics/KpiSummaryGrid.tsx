import React from 'react';
import { useFinancial } from '../../context/FinancialContext';
import {
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Crown,
  Sparkles,
  Coins,
  Activity,
} from 'lucide-react';

export const KpiSummaryGrid: React.FC = () => {
  const { activeCompanyPeriodsWithRatios, latestPeriod } = useFinancial();

  if (!latestPeriod || activeCompanyPeriodsWithRatios.length === 0) return null;

  const curRatios = latestPeriod.ratios;
  const prevPeriod =
    activeCompanyPeriodsWithRatios.length > 1
      ? activeCompanyPeriodsWithRatios[activeCompanyPeriodsWithRatios.length - 2]
      : null;
  const prevRatios = prevPeriod?.ratios;

  // Delta calculation helper
  const calcDelta = (current: number, previous?: number, isPercentage = false) => {
    if (previous === undefined || previous === null || isNaN(previous)) return null;
    const diff = current - previous;
    const isUp = diff >= 0;
    const text = isPercentage
      ? `${isUp ? '+' : ''}${diff.toFixed(1)}%p`
      : `${isUp ? '+' : ''}${diff.toFixed(2)}`;
    return { diff, isUp, text };
  };

  const roeDelta = calcDelta(curRatios.roe, prevRatios?.roe, true);
  const zDelta = calcDelta(curRatios.altmanZScore, prevRatios?.altmanZScore);

  // Format currency in Billions / Millions NTD
  const formatMoney = (val: number) => {
    if (Math.abs(val) >= 1000000) {
      return `$${(val / 1000000).toFixed(1)} 億`;
    }
    return `$${(val / 1000).toFixed(0)} M`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
      
      {/* 1. 經濟護城河評級 (Economic Moat) */}
      <div className="bg-slate-900/40 hover:bg-slate-900/60 border border-slate-800/60 hover:border-slate-700/80 rounded-2xl p-4 transition-all flex flex-col justify-between backdrop-blur-md shadow-xs">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              經濟護城河
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              curRatios.economicMoat === 'wide' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' :
              curRatios.economicMoat === 'narrow' ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20' :
              'bg-slate-800 text-slate-400'
            }`}>
              {curRatios.economicMoat === 'wide' ? '寬護城河' : curRatios.economicMoat === 'narrow' ? '窄護城河' : '無顯著壁壘'}
            </span>
          </div>

          <div className="flex items-baseline justify-between gap-2">
            <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {curRatios.grossMargin}%
              <span className="text-xs font-normal text-slate-400 ml-1.5">毛利率</span>
            </div>
            {roeDelta && (
              <div className={`flex items-center text-[11px] font-semibold font-mono ${
                roeDelta.isUp ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {roeDelta.isUp ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                {roeDelta.text}
              </div>
            )}
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
          <span>ROE 複利率</span>
          <span className="font-semibold text-amber-400 font-mono">{curRatios.roe}%</span>
        </div>
      </div>

      {/* 2. 核心獲利含金量 (Cash Conversion) */}
      <div className="bg-slate-900/40 hover:bg-slate-900/60 border border-slate-800/60 hover:border-slate-700/80 rounded-2xl p-4 transition-all flex flex-col justify-between backdrop-blur-md shadow-xs">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
              獲利現金含金量
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              curRatios.coreCashConversionRatio >= 100 ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' :
              curRatios.coreCashConversionRatio >= 70 ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20' :
              'bg-amber-500/10 text-amber-300 border border-amber-500/20'
            }`}>
              {curRatios.coreCashConversionRatio >= 100 ? '真金白銀' : curRatios.coreCashConversionRatio >= 70 ? '正常落袋' : '獲利滯留'}
            </span>
          </div>

          <div className="flex items-baseline justify-between gap-2">
            <div className="text-xl sm:text-2xl font-bold text-white tracking-tight font-mono">
              {curRatios.coreCashConversionRatio}%
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              標準 &ge; 100%
            </span>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
          <span>營業現金流 (OCF)</span>
          <span className="font-semibold text-cyan-400 font-mono">
            {formatMoney(latestPeriod.operatingCashFlow)}
          </span>
        </div>
      </div>

      {/* 3. 審計嚴謹自由現金流 (Rigorous FCF) */}
      <div className="bg-slate-900/40 hover:bg-slate-900/60 border border-slate-800/60 hover:border-slate-700/80 rounded-2xl p-4 transition-all flex flex-col justify-between backdrop-blur-md shadow-xs">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              嚴謹自由現金流
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              curRatios.rigorousFcf > 0 ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' :
              'bg-rose-500/10 text-rose-300 border border-rose-500/20'
            }`}>
              {curRatios.rigorousFcf > 0 ? '實質淨流入' : '淨赤字'}
            </span>
          </div>

          <div className="flex items-baseline justify-between gap-2">
            <div className={`text-xl sm:text-2xl font-bold tracking-tight font-mono ${
              curRatios.rigorousFcf >= 0 ? 'text-white' : 'text-rose-400'
            }`}>
              {formatMoney(curRatios.rigorousFcf)}
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
          <span>扣除 CapEx 資本支出</span>
          <span className="font-semibold text-slate-300 font-mono">
            {formatMoney(latestPeriod.capitalExpenditures)}
          </span>
        </div>
      </div>

      {/* 4. 破產防禦力 (Altman Z-Score) */}
      <div className="bg-slate-900/40 hover:bg-slate-900/60 border border-slate-800/60 hover:border-slate-700/80 rounded-2xl p-4 transition-all flex flex-col justify-between backdrop-blur-md shadow-xs">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 truncate">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
              Altman Z 破產防禦
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
              curRatios.altmanZZone === 'safe' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' :
              curRatios.altmanZZone === 'grey' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' :
              'bg-rose-500/10 text-rose-300 border border-rose-500/20'
            }`}>
              {curRatios.altmanZZone === 'safe' ? '安全堡壘' : curRatios.altmanZZone === 'grey' ? '灰色區域' : '警戒'}
            </span>
          </div>

          <div className="flex items-baseline justify-between gap-2">
            <div className="text-xl sm:text-2xl font-bold text-white tracking-tight font-mono">
              {curRatios.altmanZScore}
              <span className="text-xs font-normal text-slate-400 font-sans ml-1">分</span>
            </div>
            {zDelta && (
              <div className={`flex items-center text-[11px] font-semibold font-mono ${
                zDelta.isUp ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {zDelta.isUp ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                {zDelta.text}
              </div>
            )}
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
          <span>純計息負債比</span>
          <span className="font-semibold text-indigo-300 font-mono">
            {curRatios.interestBearingDebtRatio}%
          </span>
        </div>
      </div>

    </div>
  );
};
