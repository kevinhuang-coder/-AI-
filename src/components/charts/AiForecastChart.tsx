import React, { useState } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceArea,
  ReferenceLine,
} from 'recharts';
import { Sparkles, TrendingUp, Compass, CheckCircle, Info } from 'lucide-react';

export const AiForecastChart: React.FC = () => {
  const { aiReport, activeCompany } = useFinancial();
  const [forecastMetric, setForecastMetric] = useState<'revenue' | 'turnover' | 'margins' | 'roe'>('revenue');

  if (!aiReport || !aiReport.forecastSeries || aiReport.forecastSeries.length === 0) {
    return null;
  }

  const series = aiReport.forecastSeries.map((item) => ({
    ...item,
    revenueMillions: Math.round(item.revenue / 1000),
    netIncomeMillions: Math.round(item.netIncome / 1000),
  }));

  const forecastStartIndex = series.findIndex((s) => s.isForecast);
  const forecastStartLabel = forecastStartIndex >= 0 ? series[forecastStartIndex].period : '';

  return (
    <div className="rounded-2xl sm:rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm p-4.5 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 sm:mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shadow-indigo-500/20 flex-shrink-0">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              AI 多變量趨勢預測模型 (Next Periods Forecast)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            結合歷年週轉動能、毛利彈性與時序迴歸模型預估未來營收、週轉率與利潤走勢
          </p>
        </div>

        {/* Forecast Metric Selector */}
        <div className="flex items-center bg-slate-950/70 p-1 rounded-xl sm:rounded-2xl border border-slate-800 self-start sm:self-auto text-xs font-medium overflow-x-auto max-w-full scrollbar-none">
          <button
            onClick={() => setForecastMetric('revenue')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg sm:rounded-xl transition whitespace-nowrap min-h-[32px] ${
              forecastMetric === 'revenue'
                ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            營收與獲利預測
          </button>
          <button
            onClick={() => setForecastMetric('turnover')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg sm:rounded-xl transition whitespace-nowrap min-h-[32px] ${
              forecastMetric === 'turnover'
                ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            週轉率預測
          </button>
          <button
            onClick={() => setForecastMetric('margins')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg sm:rounded-xl transition whitespace-nowrap min-h-[32px] ${
              forecastMetric === 'margins'
                ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            毛利率走勢
          </button>
          <button
            onClick={() => setForecastMetric('roe')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg sm:rounded-xl transition whitespace-nowrap min-h-[32px] ${
              forecastMetric === 'roe'
                ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ROE 預測
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {forecastMetric === 'revenue' ? (
            <ComposedChart data={series} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="forecastArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="period" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit="M" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '1rem',
                  color: '#f8fafc',
                  fontSize: '0.82rem',
                }}
                formatter={(val: any, name: any) => [`NT$ ${Number(val).toLocaleString()} 百萬`, name]}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
              
              {forecastStartLabel && (
                <ReferenceLine x={forecastStartLabel} stroke="#a855f7" strokeDasharray="3 3" label={{ value: '▶ 預測區間', fill: '#c084fc', fontSize: 9, position: 'insideTopLeft' }} />
              )}

              <Bar dataKey="revenueMillions" name="營收 (百萬)" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={28} />
              <Area type="monotone" dataKey="netIncomeMillions" name="淨利 (百萬)" stroke="#a855f7" strokeWidth={3} fill="url(#forecastArea)" dot={{ r: 4, fill: '#a855f7' }} />
            </ComposedChart>
          ) : forecastMetric === 'turnover' ? (
            <ComposedChart data={series} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="period" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit="次" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '1rem',
                  color: '#f8fafc',
                  fontSize: '0.82rem',
                }}
                formatter={(val: any, name: any) => [`${val} 次/年`, name]}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />

              {forecastStartLabel && (
                <ReferenceLine x={forecastStartLabel} stroke="#a855f7" strokeDasharray="3 3" label={{ value: '▶ 預測區間', fill: '#c084fc', fontSize: 9, position: 'insideTopLeft' }} />
              )}

              <Line type="monotone" dataKey="arTurnover" name="應收週轉 (次)" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4, fill: '#38bdf8' }} />
              <Line type="monotone" dataKey="inventoryTurnover" name="存貨週轉 (次)" stroke="#818cf8" strokeWidth={3} dot={{ r: 4, fill: '#818cf8' }} />
            </ComposedChart>
          ) : forecastMetric === 'margins' ? (
            <ComposedChart data={series} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="period" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '1rem',
                  color: '#f8fafc',
                  fontSize: '0.82rem',
                }}
                formatter={(val: any, name: any) => [`${val}%`, name]}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />

              {forecastStartLabel && (
                <ReferenceLine x={forecastStartLabel} stroke="#a855f7" strokeDasharray="3 3" label={{ value: '▶ 預測區間', fill: '#c084fc', fontSize: 9, position: 'insideTopLeft' }} />
              )}

              <Line type="monotone" dataKey="grossMargin" name="毛利率 (Gross Margin %)" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} />
            </ComposedChart>
          ) : (
            <ComposedChart data={series} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="period" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '1rem',
                  color: '#f8fafc',
                  fontSize: '0.82rem',
                }}
                formatter={(val: any, name: any) => [`${val}%`, name]}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />

              {forecastStartLabel && (
                <ReferenceLine x={forecastStartLabel} stroke="#a855f7" strokeDasharray="3 3" label={{ value: '▶ 預測區間', fill: '#c084fc', fontSize: 9, position: 'insideTopLeft' }} />
              )}

              <Line type="monotone" dataKey="roe" name="股東權益報酬率 (ROE %)" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b' }} />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Forecast Intelligence Summary Card */}
      <div className="mt-4 sm:mt-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-indigo-950/20 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-300 flex-wrap gap-y-1">
            <Compass className="w-4 h-4 flex-shrink-0" />
            <span>AI 決策預測摘要 ({aiReport.forecast.nextPeriod})</span>
            <span className="bg-indigo-900/60 text-indigo-200 px-2.5 py-0.5 rounded-full border border-indigo-700/60 text-[10px] font-mono">
              信心度: {aiReport.forecast.confidenceLevel}%
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            {aiReport.forecast.trendCommentary}
          </p>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4 text-xs bg-slate-950/80 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border border-slate-800 flex-shrink-0 w-full sm:w-auto justify-around sm:justify-start">
          <div>
            <span className="text-slate-400 block text-[10px] sm:text-[11px]">預估營收成長</span>
            <span className="font-bold text-indigo-300 text-xs sm:text-sm font-mono">
              {aiReport.forecast.predictedRevenueGrowth >= 0 ? '+' : ''}{aiReport.forecast.predictedRevenueGrowth}%
            </span>
          </div>
          <div className="w-px h-8 bg-slate-800"></div>
          <div>
            <span className="text-slate-400 block text-[10px] sm:text-[11px]">預估目標 ROE</span>
            <span className="font-bold text-amber-300 text-xs sm:text-sm font-mono">
              {aiReport.forecast.predictedRoe}%
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
