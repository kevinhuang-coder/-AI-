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
} from 'recharts';
import { Percent } from 'lucide-react';

export const ProfitabilityChart: React.FC = () => {
  const { activeCompanyPeriodsWithRatios } = useFinancial();
  const [metricMode, setMetricMode] = useState<'margins' | 'returns' | 'amounts'>('margins');

  const chartData = activeCompanyPeriodsWithRatios.map((p) => ({
    period: p.period.replace(' 年度', '').replace(' 集團合併', ''),
    grossMargin: p.ratios.grossMargin,
    operatingMargin: p.ratios.operatingMargin,
    netMargin: p.ratios.netMargin,
    roe: p.ratios.roe,
    roa: p.ratios.roa,
    eps: p.ratios.eps,
    revenue: Math.round(p.revenue / 1000),
    grossProfit: Math.round(p.grossProfit / 1000),
    operatingIncome: Math.round(p.operatingIncome / 1000),
    netIncome: Math.round(p.netIncome / 1000),
  }));

  const latest = activeCompanyPeriodsWithRatios[activeCompanyPeriodsWithRatios.length - 1];

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl sm:rounded-3xl p-4.5 sm:p-6 shadow-sm backdrop-blur-sm">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 sm:mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <Percent className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <h3 className="text-base font-bold text-white tracking-tight">
              獲利能力與股東回報指標
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            監控毛利定價優勢、核心營運本業效率、淨利率品質與資本回報率 (ROE/ROA)
          </p>
        </div>

        {/* View Mode Switcher (Bento Pill) */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl sm:rounded-2xl border border-slate-800 self-start sm:self-auto text-xs font-semibold overflow-x-auto max-w-full scrollbar-none">
          <button
            onClick={() => setMetricMode('margins')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg sm:rounded-xl transition whitespace-nowrap min-h-[32px] ${
              metricMode === 'margins'
                ? 'bg-indigo-600 text-white shadow-md font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            獲利三率 (%)
          </button>
          <button
            onClick={() => setMetricMode('returns')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg sm:rounded-xl transition whitespace-nowrap min-h-[32px] ${
              metricMode === 'returns'
                ? 'bg-indigo-600 text-white shadow-md font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            報酬率 (ROE/ROA)
          </button>
          <button
            onClick={() => setMetricMode('amounts')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg sm:rounded-xl transition whitespace-nowrap min-h-[32px] ${
              metricMode === 'amounts'
                ? 'bg-indigo-600 text-white shadow-md font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            損益額 (M)
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {metricMode === 'margins' ? (
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="grossMarginGradBento" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="period" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#020617',
                  borderColor: '#334155',
                  borderRadius: '1rem',
                  color: '#f8fafc',
                  fontSize: '0.82rem',
                }}
                formatter={(value: any, name: any) => [`${value}%`, name]}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
              
              <Area type="monotone" dataKey="grossMargin" name="毛利率 (Gross Margin)" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#grossMarginGradBento)" />
              <Line type="monotone" dataKey="operatingMargin" name="營業利益率 (Operating Margin)" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4, fill: '#6366f1' }} />
              <Line type="monotone" dataKey="netMargin" name="稅後純益率 (Net Margin)" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4, fill: '#f59e0b' }} />
            </ComposedChart>
          ) : metricMode === 'returns' ? (
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="period" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" stroke="#64748b" tick={{ fontSize: 11 }} unit="%" />
              <YAxis yAxisId="right" orientation="right" stroke="#64748b" tick={{ fontSize: 11 }} unit="元" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#020617',
                  borderColor: '#334155',
                  borderRadius: '1rem',
                  color: '#f8fafc',
                  fontSize: '0.82rem',
                }}
                formatter={(value: any, name: any) => {
                  if (name === '每股盈餘 (EPS)') return [`$${value} 元`, name];
                  return [`${value}%`, name];
                }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
              
              <Bar yAxisId="left" dataKey="roe" name="股東權益報酬率 (ROE)" fill="#f59e0b" radius={[6, 6, 0, 0]} maxBarSize={32} />
              <Bar yAxisId="left" dataKey="roa" name="資產報酬率 (ROA)" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={32} />
              <Line yAxisId="right" type="monotone" dataKey="eps" name="每股盈餘 (EPS)" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} />
            </ComposedChart>
          ) : (
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="period" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit="M" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#020617',
                  borderColor: '#334155',
                  borderRadius: '1rem',
                  color: '#f8fafc',
                  fontSize: '0.82rem',
                }}
                formatter={(value: any, name: any) => [`NT$ ${Number(value).toLocaleString()} 百萬`, name]}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
              
              <Bar dataKey="revenue" name="營業收入" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={28} />
              <Bar dataKey="grossProfit" name="營業毛利" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={28} />
              <Bar dataKey="netIncome" name="稅後淨利" fill="#f59e0b" radius={[6, 6, 0, 0]} maxBarSize={28} />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Metric Commentary Bento Modules */}
      {latest && (
        <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 text-xs">
          <div className="bg-slate-900/80 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border border-slate-800">
            <span className="text-slate-400 block text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider">毛利率 (Gross Margin)</span>
            <span className="text-sm sm:text-base font-bold text-emerald-400 mt-1 block font-mono">{latest.ratios.grossMargin}%</span>
            <span className="text-[10px] sm:text-[11px] text-slate-500 block mt-0.5">
              每 100 元營收創造 {latest.ratios.grossMargin} 元毛利潤
            </span>
          </div>

          <div className="bg-slate-900/80 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border border-slate-800">
            <span className="text-slate-400 block text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider">本業利益率</span>
            <span className="text-sm sm:text-base font-bold text-indigo-400 mt-1 block font-mono">{latest.ratios.operatingMargin}%</span>
            <span className="text-[10px] sm:text-[11px] text-slate-500 block mt-0.5">
              本業扣除管銷研費用後之核心獲利率
            </span>
          </div>

          <div className="bg-slate-900/80 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border border-slate-800">
            <span className="text-slate-400 block text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider">股東報酬率 (ROE)</span>
            <span className="text-sm sm:text-base font-bold text-amber-400 mt-1 block font-mono">{latest.ratios.roe}%</span>
            <span className="text-[10px] sm:text-[11px] text-slate-500 block mt-0.5">
              每股盈餘 EPS 錄得 ${latest.ratios.eps} 元
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

