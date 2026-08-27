import React from 'react';
import { useFinancial } from '../../context/FinancialContext';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  PackageCheck,
  Percent,
  Award,
} from 'lucide-react';

export const KpiSummaryGrid: React.FC = () => {
  const { activeCompanyPeriodsWithRatios, latestPeriod } = useFinancial();

  if (!latestPeriod || activeCompanyPeriodsWithRatios.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-900/50 rounded-3xl border border-slate-800 text-slate-400">
        暫無財務比率數據，請新增或匯入財務報表。
      </div>
    );
  }

  const prevPeriod = activeCompanyPeriodsWithRatios.length > 1
    ? activeCompanyPeriodsWithRatios[activeCompanyPeriodsWithRatios.length - 2]
    : undefined;

  const curRatios = latestPeriod.ratios;
  const prevRatios = prevPeriod?.ratios;

  // Helper for YoY calculation
  const calcDelta = (current: number, previous: number | undefined, isPercentPoint = false) => {
    if (previous === undefined || previous === 0) return null;
    const diff = current - previous;
    const isUp = diff > 0;
    const text = isPercentPoint
      ? `${isUp ? '+' : ''}${diff.toFixed(2)} %p`
      : `${isUp ? '+' : ''}${diff.toFixed(2)}`;
    return { diff, isUp, text };
  };

  const arDelta = calcDelta(curRatios.arTurnover, prevRatios?.arTurnover);
  const invDelta = calcDelta(curRatios.inventoryTurnover, prevRatios?.inventoryTurnover);
  const grossDelta = calcDelta(curRatios.grossMargin, prevRatios?.grossMargin, true);
  const roeDelta = calcDelta(curRatios.roe, prevRatios?.roe, true);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      
      {/* 1. 應收帳款週轉率 & DSO (Bento Card) */}
      <div className="bg-slate-900/50 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 transition-all shadow-sm flex flex-col justify-between group backdrop-blur-sm">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-400" />
              應收帳款週轉率
            </span>
            <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${
              curRatios.dso <= 65 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
              curRatios.dso <= 90 ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
              'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}>
              {curRatios.dso <= 65 ? '收現優異' : curRatios.dso <= 90 ? '收現穩健' : '帳齡偏長'}
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-2">
            <div>
              <div className="text-3xl font-bold tracking-tight text-white">
                {curRatios.arTurnover} <span className="text-sm font-normal text-slate-400">次/年</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">
                平均收現天數 (DSO): <span className="font-semibold text-blue-400">{curRatios.dso} 天</span>
              </div>
            </div>
            {arDelta && (
              <div className={`flex items-center text-xs font-semibold px-2 py-1 rounded-lg ${
                arDelta.isUp ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
              }`}>
                {arDelta.isUp ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
                {arDelta.text}
              </div>
            )}
          </div>
        </div>

        {/* Bento Progress Meter */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${Math.min(100, (curRatios.arTurnover / 10) * 100)}%` }}
            ></div>
          </div>
          <div className="text-[11px] text-slate-500 flex justify-between">
            <span>期末應收: ${(latestPeriod.accountsReceivable / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })}M</span>
            <span>基準 &gt; 6.0次</span>
          </div>
        </div>
      </div>

      {/* 2. 存貨週轉率 & DSI (Bento Card) */}
      <div className="bg-slate-900/50 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 transition-all shadow-sm flex flex-col justify-between group backdrop-blur-sm">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <PackageCheck className="w-4 h-4 text-indigo-400" />
              存貨週轉率
            </span>
            <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${
              curRatios.dsi <= 75 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
              curRatios.dsi <= 110 ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
              'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}>
              {curRatios.dsi <= 75 ? '動銷強勁' : curRatios.dsi <= 110 ? '去化穩健' : '庫存偏高'}
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-2">
            <div>
              <div className="text-3xl font-bold tracking-tight text-white">
                {curRatios.inventoryTurnover} <span className="text-sm font-normal text-slate-400">次/年</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">
                平均銷貨天數 (DSI): <span className="font-semibold text-indigo-400">{curRatios.dsi} 天</span>
              </div>
            </div>
            {invDelta && (
              <div className={`flex items-center text-xs font-semibold px-2 py-1 rounded-lg ${
                invDelta.isUp ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
              }`}>
                {invDelta.isUp ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
                {invDelta.text}
              </div>
            )}
          </div>
        </div>

        {/* Bento Progress Meter */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-indigo-500 rounded-full"
              style={{ width: `${Math.min(100, (curRatios.inventoryTurnover / 8) * 100)}%` }}
            ></div>
          </div>
          <div className="text-[11px] text-slate-500 flex justify-between">
            <span>期末存貨: ${(latestPeriod.inventory / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })}M</span>
            <span>基準 &gt; 4.5次</span>
          </div>
        </div>
      </div>

      {/* 3. 營業毛利率 (Bento Card) */}
      <div className="bg-slate-900/50 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 transition-all shadow-sm flex flex-col justify-between group backdrop-blur-sm">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Percent className="w-4 h-4 text-emerald-400" />
              營業毛利率
            </span>
            <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${
              curRatios.grossMargin >= 35 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
              curRatios.grossMargin >= 20 ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
              'bg-slate-800 text-slate-300 border border-slate-700'
            }`}>
              {curRatios.grossMargin >= 35 ? '定價優勢' : curRatios.grossMargin >= 20 ? '毛利穩健' : '薄利微利'}
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-2">
            <div>
              <div className="text-3xl font-bold tracking-tight text-white">
                {curRatios.grossMargin}%
              </div>
              <div className="text-xs text-slate-400 mt-1">
                營業利益率: <span className="font-semibold text-emerald-400">{curRatios.operatingMargin}%</span>
              </div>
            </div>
            {grossDelta && (
              <div className={`flex items-center text-xs font-semibold px-2 py-1 rounded-lg ${
                grossDelta.isUp ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
              }`}>
                {grossDelta.isUp ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
                {grossDelta.text}
              </div>
            )}
          </div>
        </div>

        {/* Bento Progress Meter */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${Math.min(100, (curRatios.grossMargin / 60) * 100)}%` }}
            ></div>
          </div>
          <div className="text-[11px] text-slate-500 flex justify-between">
            <span>營收: ${(latestPeriod.revenue / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })}M</span>
            <span>基準 &gt; 30%</span>
          </div>
        </div>
      </div>

      {/* 4. 股東權益報酬率 (ROE) (Bento Card) */}
      <div className="bg-slate-900/50 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 transition-all shadow-sm flex flex-col justify-between group backdrop-blur-sm">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              股東權益報酬率 (ROE)
            </span>
            <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${
              curRatios.roe >= 18 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
              curRatios.roe >= 10 ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
              'bg-slate-800 text-slate-300 border border-slate-700'
            }`}>
              {curRatios.roe >= 18 ? '股東回報高' : curRatios.roe >= 10 ? '回報良好' : '待改善'}
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-2">
            <div>
              <div className="text-3xl font-bold tracking-tight text-white">
                {curRatios.roe}%
              </div>
              <div className="text-xs text-slate-400 mt-1">
                稅後淨利率: <span className="font-semibold text-amber-400">{curRatios.netMargin}%</span> • EPS: <span className="font-semibold text-amber-400">${curRatios.eps}</span>
              </div>
            </div>
            {roeDelta && (
              <div className={`flex items-center text-xs font-semibold px-2 py-1 rounded-lg ${
                roeDelta.isUp ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
              }`}>
                {roeDelta.isUp ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
                {roeDelta.text}
              </div>
            )}
          </div>
        </div>

        {/* Bento Progress Meter */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-amber-500 rounded-full"
              style={{ width: `${Math.min(100, (curRatios.roe / 35) * 100)}%` }}
            ></div>
          </div>
          <div className="text-[11px] text-slate-500 flex justify-between">
            <span>淨利: ${(latestPeriod.netIncome / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })}M</span>
            <span>基準 &gt; 15%</span>
          </div>
        </div>
      </div>

    </div>
  );
};

