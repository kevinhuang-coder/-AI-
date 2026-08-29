import React, { useState } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { Layers, DollarSign, ArrowUpRight, TrendingUp, ShieldCheck } from 'lucide-react';

export const CashFlowTrendChart: React.FC = () => {
  const { activeCompanyPeriodsWithRatios, viewMode } = useFinancial();
  const [metricMode, setMetricMode] = useState<'structure' | 'fcf' | 'quality'>('structure');

  if (activeCompanyPeriodsWithRatios.length === 0) return null;

  const chartData = activeCompanyPeriodsWithRatios.map((p) => {
    const ocf = p.operatingCashFlow;
    const capex = p.capitalExpenditures || 0;
    const fcf = p.ratios.freeCashFlow;
    const rigorousFcf = p.ratios.rigorousFcf;
    const netIncome = p.netIncome;
    const coreConversion = p.ratios.coreCashConversionRatio;

    return {
      period: p.period.replace(' 年度', '').replace(' 集團合併', ''),
      ocfMillions: Math.round(ocf / 1000),
      capexMillions: Math.round(capex / 1000),
      fcfMillions: Math.round(fcf / 1000),
      rigorousFcfMillions: Math.round(rigorousFcf / 1000),
      netIncomeMillions: Math.round(netIncome / 1000),
      coreConversion: Number(coreConversion) || 0,
      ocfRaw: ocf,
      fcfRaw: fcf,
    };
  });

  const latest = activeCompanyPeriodsWithRatios[activeCompanyPeriodsWithRatios.length - 1];
  const isInvestor = viewMode === 'investor';

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl sm:rounded-3xl p-4.5 sm:p-6 shadow-sm backdrop-blur-sm">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 sm:mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm shadow-emerald-500/20 flex-shrink-0">
              <Layers className="w-4 h-4 text-emerald-200" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              {isInvestor ? '嚴謹自由現金流與核心獲利含金量' : '現金流量品質與資本支出結構'}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isInvestor
              ? '嚴謹扣除 PP&E、無形資產研發與 IFRS 16 租賃本金，還原真實業主盈餘與本業現金轉化率'
              : '監控本業營運造血 (OCF)、資本支出 (CapEx) 投資節奏與自由現金轉換率'}
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-xl sm:rounded-2xl border border-slate-800 self-start sm:self-auto text-xs font-semibold overflow-x-auto max-w-full scrollbar-none">
          <button
            onClick={() => setMetricMode('structure')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg sm:rounded-xl transition whitespace-nowrap min-h-[32px] cursor-pointer ${
              metricMode === 'structure'
                ? 'bg-emerald-600 text-white shadow-md font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            現金流結構 (百萬)
          </button>
          <button
            onClick={() => setMetricMode('fcf')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg sm:rounded-xl transition whitespace-nowrap min-h-[32px] cursor-pointer ${
              metricMode === 'fcf'
                ? 'bg-cyan-600 text-white shadow-md font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            嚴謹自由現金流 (FCF)
          </button>
          <button
            onClick={() => setMetricMode('quality')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg sm:rounded-xl transition whitespace-nowrap min-h-[32px] cursor-pointer ${
              metricMode === 'quality'
                ? 'bg-indigo-600 text-white shadow-md font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            核心獲利含金量 (%)
          </button>
        </div>
      </div>

      {/* Mini KPI Pill Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 mb-5">
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <span className="text-[11px] text-slate-400 font-medium block">營業現金流 (OCF)</span>
          <span className={`text-sm sm:text-base font-extrabold font-mono mt-0.5 block ${latest.operatingCashFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            NT$ {(latest.operatingCashFlow / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}M
          </span>
        </div>
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <span className="text-[11px] text-slate-400 font-medium block">資本支出 (CapEx)</span>
          <span className="text-sm sm:text-base font-extrabold font-mono text-amber-400 mt-0.5 block">
            NT$ {((latest.capitalExpenditures || 0) / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}M
          </span>
        </div>
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <span className="text-[11px] text-slate-400 font-medium block">嚴謹自由現金流 (FCF)</span>
          <span className={`text-sm sm:text-base font-extrabold font-mono mt-0.5 block ${latest.ratios.rigorousFcf >= 0 ? 'text-cyan-300' : 'text-rose-400'}`}>
            NT$ {(latest.ratios.rigorousFcf / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}M
          </span>
        </div>
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <span className="text-[11px] text-slate-400 font-medium block">核心現金轉換率</span>
          <span className={`text-sm sm:text-base font-extrabold font-mono mt-0.5 block ${Number(latest.ratios.coreCashConversionRatio) >= 100 ? 'text-emerald-400' : Number(latest.ratios.coreCashConversionRatio) > 0 ? 'text-blue-400' : 'text-rose-400'}`}>
            {latest.ratios.coreCashConversionRatio}%
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="fcfAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} vertical={false} />
            <XAxis dataKey="period" stroke="#94a3b8" fontSize={11} tickLine={false} />
            
            {metricMode === 'quality' ? (
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit="%" />
            ) : (
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit="M" />
            )}

            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '16px',
                fontSize: '12px',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
              }}
              formatter={(value: any, name: string) => {
                if (name === '核心獲利現金轉換率') return [`${value}%`, name];
                return [`NT$ ${Number(value).toLocaleString()} 百萬元`, name];
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
            <ReferenceLine y={0} stroke="#64748b" strokeDasharray="3 3" />

            {metricMode === 'structure' && (
              <>
                <Bar dataKey="ocfMillions" name="營業活動現金流 (OCF)" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={45} />
                <Bar dataKey="capexMillions" name="資本支出 (CapEx)" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={45} />
                <Line type="monotone" dataKey="rigorousFcfMillions" name="嚴謹自由現金流 (FCF)" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4, fill: '#06b6d4' }} />
              </>
            )}

            {metricMode === 'fcf' && (
              <>
                <Area type="monotone" dataKey="rigorousFcfMillions" name="嚴謹自由現金流 (FCF)" fill="url(#fcfAreaGrad)" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4, fill: '#06b6d4' }} />
                <Line type="monotone" dataKey="netIncomeMillions" name="稅後淨利 (Net Income)" stroke="#818cf8" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
              </>
            )}

            {metricMode === 'quality' && (
              <>
                <ReferenceLine y={100} stroke="#10b981" strokeDasharray="4 4" label={{ value: '100% 黃金基準', fill: '#10b981', fontSize: 10 }} />
                <Line type="monotone" dataKey="coreConversion" name="核心獲利現金轉換率" stroke="#6366f1" strokeWidth={3} dot={{ r: 5, fill: '#6366f1' }} />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Explanatory Footer with Complete Formulas */}
      <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 gap-2">
        <div className="flex items-start sm:items-center gap-1.5 flex-1">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5 sm:mt-0" />
          <div>
            {metricMode === 'quality' ? (
              <span>
                <strong className="text-slate-300">核心本業現金轉換率公式：</strong>
                <span className="font-mono text-indigo-300">
                  (營業現金流 OCF - 租賃本金償付) ÷ [ 營業利益 (EBIT) × (1 - 20% 法定稅率) ] × 100%
                </span>
                <span className="text-slate-400 ml-1.5 hidden md:inline">（&gt;100% 代表本業獲利 100% 轉化為真金白銀）</span>
              </span>
            ) : (
              <span>
                <strong className="text-slate-300">嚴謹自由現金流 (Rigorous FCF) 完整公式：</strong>
                <span className="font-mono text-cyan-300">
                  營業現金流 (OCF) - 資本支出 (PP&E CapEx) - 無形資產研發支出 - IFRS 16 租賃本金償付
                </span>
              </span>
            )}
          </div>
        </div>
        <div className="text-slate-400 font-mono text-[10px] sm:text-xs flex-shrink-0 self-end sm:self-auto">
          金額單位：新台幣百萬元 (NT$ Millions)
        </div>
      </div>
    </div>
  );
};
