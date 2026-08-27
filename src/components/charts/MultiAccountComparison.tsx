import React, { useState } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { calculateAllPeriodsRatios } from '../../utils/financialCalculations';
import { Building2, Layers, CheckSquare, Square, ArrowUpDown } from 'lucide-react';

export const MultiAccountComparison: React.FC = () => {
  const { allCompaniesWithConsolidated, compareCompanyIds, setCompareCompanyIds } = useFinancial();
  const [selectedMetric, setSelectedMetric] = useState<'turnover' | 'margins' | 'roe' | 'ccc'>('turnover');

  // 計算每個被選中公司的最新一期比率
  const comparisonData = allCompaniesWithConsolidated
    .filter((c) => compareCompanyIds.includes(c.id))
    .map((c) => {
      const periodsWithRatios = calculateAllPeriodsRatios(c.periods);
      const latest = periodsWithRatios[periodsWithRatios.length - 1];
      return {
        id: c.id,
        name: c.name.length > 10 ? c.name.slice(0, 8) + '..' : c.name,
        fullName: c.name,
        code: c.code,
        industry: c.industry,
        isConsolidated: c.isConsolidatedGroup,
        revenue: latest ? Math.round(latest.revenue / 1000) : 0,
        grossMargin: latest ? latest.ratios.grossMargin : 0,
        operatingMargin: latest ? latest.ratios.operatingMargin : 0,
        netMargin: latest ? latest.ratios.netMargin : 0,
        arTurnover: latest ? latest.ratios.arTurnover : 0,
        dso: latest ? latest.ratios.dso : 0,
        inventoryTurnover: latest ? latest.ratios.inventoryTurnover : 0,
        dsi: latest ? latest.ratios.dsi : 0,
        roe: latest ? latest.ratios.roe : 0,
        ccc: latest ? latest.ratios.cashConversionCycle : 0,
        currentRatio: latest ? latest.ratios.currentRatio : 0,
      };
    });

  const toggleCompany = (id: string) => {
    if (compareCompanyIds.includes(id)) {
      if (compareCompanyIds.length > 1) {
        setCompareCompanyIds(compareCompanyIds.filter((item) => item !== id));
      }
    } else {
      setCompareCompanyIds([...compareCompanyIds, id]);
    }
  };

  return (
    <div className="rounded-2xl sm:rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm p-4.5 sm:p-6 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5 sm:mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-cyan-400 flex-shrink-0" />
            <h3 className="text-base font-bold text-white tracking-tight">
              多帳戶 / 多公司跨主體財務對比 (Benchmark)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            橫向對比母公司、子公司及集團合併報表之週轉效率、獲利能力與資金槓桿指標
          </p>
        </div>

        {/* Metric Selector */}
        <div className="flex items-center bg-slate-950/70 p-1 rounded-xl sm:rounded-2xl border border-slate-800 self-start lg:self-auto text-xs font-medium overflow-x-auto max-w-full scrollbar-none">
          <button
            onClick={() => setSelectedMetric('turnover')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg sm:rounded-xl transition whitespace-nowrap min-h-[32px] ${
              selectedMetric === 'turnover' ? 'bg-cyan-600 text-white shadow-sm font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            週轉率對比
          </button>
          <button
            onClick={() => setSelectedMetric('margins')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg sm:rounded-xl transition whitespace-nowrap min-h-[32px] ${
              selectedMetric === 'margins' ? 'bg-cyan-600 text-white shadow-sm font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            毛利/淨利率
          </button>
          <button
            onClick={() => setSelectedMetric('roe')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg sm:rounded-xl transition whitespace-nowrap min-h-[32px] ${
              selectedMetric === 'roe' ? 'bg-cyan-600 text-white shadow-sm font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ROE 回報
          </button>
          <button
            onClick={() => setSelectedMetric('ccc')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg sm:rounded-xl transition whitespace-nowrap min-h-[32px] ${
              selectedMetric === 'ccc' ? 'bg-cyan-600 text-white shadow-sm font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            現金循環 (CCC)
          </button>
        </div>
      </div>

      {/* Account Inclusion Toggles */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-4 p-3 sm:p-3.5 bg-slate-950/60 rounded-xl sm:rounded-2xl border border-slate-800">
        <span className="text-xs font-semibold text-slate-300 mr-1 sm:mr-2 flex items-center gap-1.5 w-full sm:w-auto mb-1 sm:mb-0">
          <Building2 className="w-3.5 h-3.5 text-slate-400" />
          參與對比主體：
        </span>
        {allCompaniesWithConsolidated.map((comp) => {
          const checked = compareCompanyIds.includes(comp.id);
          return (
            <button
              key={comp.id}
              onClick={() => toggleCompany(comp.id)}
              className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg sm:rounded-xl text-xs font-medium transition min-h-[32px] ${
                checked
                  ? 'bg-blue-600/30 text-blue-200 border border-blue-500/40 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {checked ? (
                <CheckSquare className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
              ) : (
                <Square className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              )}
              <span>{comp.name}</span>
            </button>
          );
        })}
      </div>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {selectedMetric === 'turnover' ? (
            <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
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
              <Bar dataKey="arTurnover" name="應收帳款週轉率" fill="#38bdf8" radius={[6, 6, 0, 0]} maxBarSize={36} />
              <Bar dataKey="inventoryTurnover" name="存貨週轉率" fill="#818cf8" radius={[6, 6, 0, 0]} maxBarSize={36} />
            </BarChart>
          ) : selectedMetric === 'margins' ? (
            <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
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
              <Bar dataKey="grossMargin" name="毛利率 (Gross Margin)" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={32} />
              <Bar dataKey="operatingMargin" name="營業利益率 (Operating Margin)" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={32} />
              <Bar dataKey="netMargin" name="淨利率 (Net Margin)" fill="#f59e0b" radius={[6, 6, 0, 0]} maxBarSize={32} />
            </BarChart>
          ) : selectedMetric === 'roe' ? (
            <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
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
              <Bar dataKey="roe" name="股東權益報酬率 (ROE)" fill="#f59e0b" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          ) : (
            <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit="天" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '1rem',
                  color: '#f8fafc',
                  fontSize: '0.82rem',
                }}
                formatter={(val: any, name: any) => [`${val} 天`, name]}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="dso" name="應收天數 (DSO)" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={28} />
              <Bar dataKey="dsi" name="存貨天數 (DSI)" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={28} />
              <Bar dataKey="ccc" name="現金轉換循環 (CCC)" fill="#0ea5e9" radius={[6, 6, 0, 0]} maxBarSize={28} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Cross-Account Benchmark Table Summary with horizontal scroll and sticky name column */}
      <div className="mt-4 sm:mt-5 overflow-x-auto rounded-xl sm:rounded-2xl border border-slate-800">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
            <tr>
              <th className="py-2.5 sm:py-3 px-3 sm:px-4 sticky left-0 bg-slate-950 z-10 min-w-[130px]">帳戶主體</th>
              <th className="py-2.5 sm:py-3 px-3 sm:px-4 min-w-[100px]">產業領域</th>
              <th className="py-2.5 sm:py-3 px-3 sm:px-4 text-right min-w-[100px]">營收 (百萬)</th>
              <th className="py-2.5 sm:py-3 px-3 sm:px-4 text-right min-w-[120px]">應收週轉</th>
              <th className="py-2.5 sm:py-3 px-3 sm:px-4 text-right min-w-[120px]">存貨週轉</th>
              <th className="py-2.5 sm:py-3 px-3 sm:px-4 text-right min-w-[90px]">毛利率</th>
              <th className="py-2.5 sm:py-3 px-3 sm:px-4 text-right min-w-[90px]">ROE</th>
              <th className="py-2.5 sm:py-3 px-3 sm:px-4 text-right min-w-[90px]">CCC</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-200">
            {comparisonData.map((row) => (
              <tr key={row.id} className="hover:bg-slate-800/30 transition">
                <td className="py-2.5 sm:py-3 px-3 sm:px-4 font-medium sticky left-0 bg-slate-900 z-10">
                  <div className="flex items-center gap-1.5 sm:gap-2 truncate">
                    {row.isConsolidated && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50 flex-shrink-0"></span>
                    )}
                    <span className="truncate">{row.fullName}</span>
                  </div>
                </td>
                <td className="py-2.5 sm:py-3 px-3 sm:px-4 text-slate-400">{row.industry}</td>
                <td className="py-2.5 sm:py-3 px-3 sm:px-4 text-right font-mono">${row.revenue.toLocaleString()}</td>
                <td className="py-2.5 sm:py-3 px-3 sm:px-4 text-right font-mono text-blue-300">{row.arTurnover} 次 ({row.dso}天)</td>
                <td className="py-2.5 sm:py-3 px-3 sm:px-4 text-right font-mono text-indigo-300">{row.inventoryTurnover} 次 ({row.dsi}天)</td>
                <td className="py-2.5 sm:py-3 px-3 sm:px-4 text-right font-mono text-emerald-300">{row.grossMargin}%</td>
                <td className="py-2.5 sm:py-3 px-3 sm:px-4 text-right font-mono text-amber-300 font-semibold">{row.roe}%</td>
                <td className="py-2.5 sm:py-3 px-3 sm:px-4 text-right font-mono text-cyan-300">{row.ccc} 天</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

