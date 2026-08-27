import React, { useState } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { RotateCcw } from 'lucide-react';

export const TurnoverAnalysisChart: React.FC = () => {
  const { activeCompanyPeriodsWithRatios } = useFinancial();
  const [viewMode, setViewMode] = useState<'days' | 'times' | 'ccc'>('days');

  const chartData = activeCompanyPeriodsWithRatios.map((p) => ({
    period: p.period.replace(' 年度', '').replace(' 集團合併', ''),
    year: p.year,
    dso: p.ratios.dso,
    dsi: p.ratios.dsi,
    dpo: p.ratios.dpo,
    ccc: p.ratios.cashConversionCycle,
    arTurnover: p.ratios.arTurnover,
    inventoryTurnover: p.ratios.inventoryTurnover,
    revenue: p.revenue / 1000,
    cogs: p.costOfGoodsSold / 1000,
  }));

  const latest = activeCompanyPeriodsWithRatios[activeCompanyPeriodsWithRatios.length - 1];

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-sm backdrop-blur-sm">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <RotateCcw className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              應收帳款與存貨週轉營運分析
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            追蹤資金從投產備料 (DSI) 到銷貨收現 (DSO) 與現金轉換週期 (CCC) 之營運週轉效率
          </p>
        </div>

        {/* View Mode Switcher (Bento Pill) */}
        <div className="flex items-center bg-slate-900 p-1 rounded-2xl border border-slate-800 self-start sm:self-auto text-xs font-semibold">
          <button
            onClick={() => setViewMode('days')}
            className={`px-3 py-1.5 rounded-xl transition ${
              viewMode === 'days'
                ? 'bg-indigo-600 text-white shadow-md font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            週轉天數 (DSO/DSI)
          </button>
          <button
            onClick={() => setViewMode('times')}
            className={`px-3 py-1.5 rounded-xl transition ${
              viewMode === 'times'
                ? 'bg-indigo-600 text-white shadow-md font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            週轉率 (次/年)
          </button>
          <button
            onClick={() => setViewMode('ccc')}
            className={`px-3 py-1.5 rounded-xl transition ${
              viewMode === 'ccc'
                ? 'bg-indigo-600 text-white shadow-md font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            現金循環 (CCC)
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 sm:h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'days' ? (
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="period" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 12 }} unit="天" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#020617',
                  borderColor: '#334155',
                  borderRadius: '1rem',
                  color: '#f8fafc',
                  fontSize: '0.82rem',
                }}
                formatter={(value: any, name: any) => {
                  if (name === '應收帳款天數 (DSO)') return [`${value} 天`, name];
                  if (name === '存貨週轉天數 (DSI)') return [`${value} 天`, name];
                  if (name === '應付帳款天數 (DPO)') return [`${value} 天`, name];
                  return [value, name];
                }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} />
              
              <ReferenceLine y={60} stroke="#3b82f6" strokeDasharray="3 3" label={{ value: 'DSO 優良基準 (60天)', fill: '#60a5fa', fontSize: 10, position: 'right' }} />
              <ReferenceLine y={90} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'DSI 預警閥值 (90天)', fill: '#fbbf24', fontSize: 10, position: 'right' }} />
              
              <Bar dataKey="dso" name="應收帳款天數 (DSO)" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={36} />
              <Bar dataKey="dsi" name="存貨週轉天數 (DSI)" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={36} />
              <Line type="monotone" dataKey="dpo" name="應付帳款天數 (DPO)" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: '#10b981' }} />
            </ComposedChart>
          ) : viewMode === 'times' ? (
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="period" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 12 }} unit="次" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#020617',
                  borderColor: '#334155',
                  borderRadius: '1rem',
                  color: '#f8fafc',
                  fontSize: '0.82rem',
                }}
                formatter={(value: any, name: any) => [`${value} 次/年`, name]}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} />
              
              <Bar dataKey="arTurnover" name="應收帳款週轉率" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={36} />
              <Bar dataKey="inventoryTurnover" name="存貨週轉率" fill="#8b5cf6" radius={[6, 6, 0, 0]} maxBarSize={36} />
            </ComposedChart>
          ) : (
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="period" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 12 }} unit="天" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#020617',
                  borderColor: '#334155',
                  borderRadius: '1rem',
                  color: '#f8fafc',
                  fontSize: '0.82rem',
                }}
                formatter={(value: any, name: any) => [`${value} 天`, name]}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} />
              
              <ReferenceLine y={0} stroke="#475569" />
              <Bar dataKey="ccc" name="現金轉換循環 (CCC = DSO + DSI - DPO)" fill="#0ea5e9" radius={[6, 6, 0, 0]} maxBarSize={42} />
              <Line type="monotone" dataKey="ccc" name="CCC 趨勢走勢" stroke="#38bdf8" strokeWidth={3} dot={{ r: 5, fill: '#38bdf8' }} />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Interactive Metric Footnote in Bento Grid Modules */}
      {latest && (
        <div className="mt-5 pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
            <span className="text-slate-400 block text-[11px] font-semibold uppercase tracking-wider">最新應收天數</span>
            <span className="text-base font-bold text-blue-400 mt-1 block">{latest.ratios.dso} 天</span>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              平均每筆銷貨需 {latest.ratios.dso} 天收回真實現金
            </span>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
            <span className="text-slate-400 block text-[11px] font-semibold uppercase tracking-wider">最新存貨天數</span>
            <span className="text-base font-bold text-indigo-400 mt-1 block">{latest.ratios.dsi} 天</span>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              原料至製品庫存平均留置 {latest.ratios.dsi} 天
            </span>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
            <span className="text-slate-400 block text-[11px] font-semibold uppercase tracking-wider">現金轉換循環</span>
            <span className="text-base font-bold text-cyan-400 mt-1 block">{latest.ratios.cashConversionCycle} 天</span>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              採購至回收現金淨佔用 {latest.ratios.cashConversionCycle} 天營運資本
            </span>
          </div>
        </div>
      )}

    </div>
  );
};

