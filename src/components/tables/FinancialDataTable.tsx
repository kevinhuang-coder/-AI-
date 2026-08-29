import React, { useState } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { Table, Download, FileSpreadsheet, Percent, RotateCcw, ShieldCheck, DollarSign } from 'lucide-react';

export const FinancialDataTable: React.FC = () => {
  const { activeCompanyPeriodsWithRatios, activeCompany } = useFinancial();
  const [statementTab, setStatementTab] = useState<'ratios' | 'income' | 'balance' | 'cashflow'>('ratios');

  if (activeCompanyPeriodsWithRatios.length === 0) return null;

  // 匯出 CSV 檔
  const exportToCsv = () => {
    let headers: string[] = [];
    let rows: (string | number)[][] = [];

    const periods = activeCompanyPeriodsWithRatios.map((p) => p.period);

    if (statementTab === 'ratios') {
      headers = ['財務比率指標項目', '單位', ...periods];
      rows = [
        ['應收帳款週轉率', '次/年', ...activeCompanyPeriodsWithRatios.map((p) => p.ratios.arTurnover)],
        ['應收帳款週轉天數 (DSO)', '天', ...activeCompanyPeriodsWithRatios.map((p) => p.ratios.dso)],
        ['存貨週轉率', '次/年', ...activeCompanyPeriodsWithRatios.map((p) => p.ratios.inventoryTurnover)],
        ['存貨週轉天數 (DSI)', '天', ...activeCompanyPeriodsWithRatios.map((p) => p.ratios.dsi)],
        ['應付帳款週轉天數 (DPO)', '天', ...activeCompanyPeriodsWithRatios.map((p) => p.ratios.dpo)],
        ['現金轉換循環 (CCC)', '天', ...activeCompanyPeriodsWithRatios.map((p) => p.ratios.cashConversionCycle)],
        ['總資產週轉率', '次', ...activeCompanyPeriodsWithRatios.map((p) => p.ratios.totalAssetTurnover)],
        ['營業毛利率 (Gross Margin)', '%', ...activeCompanyPeriodsWithRatios.map((p) => p.ratios.grossMargin)],
        ['營業利益率 (Operating Margin)', '%', ...activeCompanyPeriodsWithRatios.map((p) => p.ratios.operatingMargin)],
        ['稅後純益率 (Net Margin)', '%', ...activeCompanyPeriodsWithRatios.map((p) => p.ratios.netMargin)],
        ['股東權益報酬率 (ROE)', '%', ...activeCompanyPeriodsWithRatios.map((p) => p.ratios.roe)],
        ['資產報酬率 (ROA)', '%', ...activeCompanyPeriodsWithRatios.map((p) => p.ratios.roa)],
        ['每股盈餘 (EPS)', '元', ...activeCompanyPeriodsWithRatios.map((p) => p.ratios.eps)],
        ['流動比率', '%', ...activeCompanyPeriodsWithRatios.map((p) => p.ratios.currentRatio)],
        ['速動比率', '%', ...activeCompanyPeriodsWithRatios.map((p) => p.ratios.quickRatio)],
        ['負債比率', '%', ...activeCompanyPeriodsWithRatios.map((p) => p.ratios.debtRatio)],
        ['營運現金流/淨利比', '%', ...activeCompanyPeriodsWithRatios.map((p) => p.ratios.ocfToNetIncome)],
      ];
    } else if (statementTab === 'income') {
      headers = ['損益表項目', '單位: 千元', ...periods];
      rows = [
        ['營業收入 (Revenue)', 'NTD', ...activeCompanyPeriodsWithRatios.map((p) => p.revenue)],
        ['營業成本 (COGS)', 'NTD', ...activeCompanyPeriodsWithRatios.map((p) => p.costOfGoodsSold)],
        ['營業毛利 (Gross Profit)', 'NTD', ...activeCompanyPeriodsWithRatios.map((p) => p.grossProfit)],
        ['營業費用 (OpEx)', 'NTD', ...activeCompanyPeriodsWithRatios.map((p) => p.operatingExpenses)],
        ['營業利益 (EBIT)', 'NTD', ...activeCompanyPeriodsWithRatios.map((p) => p.operatingIncome)],
        ['稅後淨利 (Net Income)', 'NTD', ...activeCompanyPeriodsWithRatios.map((p) => p.netIncome)],
        ['流通在外股數', '千股', ...activeCompanyPeriodsWithRatios.map((p) => p.sharesOutstanding)],
      ];
    } else if (statementTab === 'balance') {
      headers = ['資產負債項目', '單位: 千元', ...periods];
      rows = [
        ['現金及約當現金', 'NTD', ...activeCompanyPeriodsWithRatios.map((p) => p.cashAndEquivalents)],
        ['應收帳款及票據', 'NTD', ...activeCompanyPeriodsWithRatios.map((p) => p.accountsReceivable)],
        ['存貨 (Inventory)', 'NTD', ...activeCompanyPeriodsWithRatios.map((p) => p.inventory)],
        ['流動資產合計', 'NTD', ...activeCompanyPeriodsWithRatios.map((p) => p.currentAssets)],
        ['資產總額 (Total Assets)', 'NTD', ...activeCompanyPeriodsWithRatios.map((p) => p.totalAssets)],
        ['應付帳款及票據', 'NTD', ...activeCompanyPeriodsWithRatios.map((p) => p.accountsPayable)],
        ['流動負債合計', 'NTD', ...activeCompanyPeriodsWithRatios.map((p) => p.currentLiabilities)],
        ['負債總額 (Total Liabilities)', 'NTD', ...activeCompanyPeriodsWithRatios.map((p) => p.totalLiabilities)],
        ['股東權益總額 (Equity)', 'NTD', ...activeCompanyPeriodsWithRatios.map((p) => p.stockholdersEquity)],
      ];
    } else {
      headers = ['現金流量項目', '單位: 千元', ...periods];
      rows = [
        ['營業活動現金流量 (OCF)', 'NTD', ...activeCompanyPeriodsWithRatios.map((p) => p.operatingCashFlow)],
        ['資本支出 (CapEx)', 'NTD', ...activeCompanyPeriodsWithRatios.map((p) => p.capitalExpenditures)],
        ['自由現金流量 (FCF)', 'NTD', ...activeCompanyPeriodsWithRatios.map((p) => p.ratios.freeCashFlow)],
      ];
    }

    const csvContent =
      '\uFEFF' +
      [headers.join(','), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${activeCompany.name}_${statementTab}_財務報表.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="rounded-2xl sm:rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm p-4.5 sm:p-6 shadow-sm">
      {/* Header & Statement Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5 sm:mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <Table className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <h3 className="text-base font-bold text-white tracking-tight">
              完整財務報表與比率明細表
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            提供歷期損益表、資產負債表、現金流量表與各類週轉獲利指標精準對照
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start lg:self-auto flex-wrap gap-y-2">
          {/* Sub-tabs */}
          <div className="flex items-center bg-slate-950/70 p-1 rounded-xl sm:rounded-2xl border border-slate-800 text-xs font-medium overflow-x-auto max-w-full scrollbar-none">
            <button
              onClick={() => setStatementTab('ratios')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg sm:rounded-xl transition whitespace-nowrap min-h-[32px] ${
                statementTab === 'ratios' ? 'bg-blue-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              財務比率指標
            </button>
            <button
              onClick={() => setStatementTab('income')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg sm:rounded-xl transition whitespace-nowrap min-h-[32px] ${
                statementTab === 'income' ? 'bg-blue-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              損益表
            </button>
            <button
              onClick={() => setStatementTab('balance')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg sm:rounded-xl transition whitespace-nowrap min-h-[32px] ${
                statementTab === 'balance' ? 'bg-blue-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              資產負債表
            </button>
            <button
              onClick={() => setStatementTab('cashflow')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg sm:rounded-xl transition whitespace-nowrap min-h-[32px] ${
                statementTab === 'cashflow' ? 'bg-blue-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              現金流量表
            </button>
          </div>

          {/* Export CSV Button */}
          <button
            onClick={exportToCsv}
            className="flex items-center space-x-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/60 text-xs font-medium transition min-h-[32px]"
            title="匯出 CSV 試算表"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span className="inline">匯出 CSV</span>
          </button>
        </div>
      </div>

      {/* Table Data View */}
      <div className="overflow-x-auto rounded-xl sm:rounded-2xl border border-slate-800">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
            <tr>
              <th className="py-2.5 sm:py-3 px-3 sm:px-4 min-w-[180px] sm:min-w-[200px] sticky left-0 bg-slate-950 z-20 border-r border-slate-800/80 shadow-[2px_0_6px_rgba(0,0,0,0.3)]">項目名稱</th>
              <th className="py-2.5 sm:py-3 px-2 sm:px-3 text-center min-w-[60px] sm:min-w-[70px]">單位</th>
              {activeCompanyPeriodsWithRatios.map((p, idx) => (
                <th
                  key={p.id}
                  className={`py-2.5 sm:py-3 px-3 sm:px-4 text-right min-w-[100px] sm:min-w-[110px] ${
                    idx === activeCompanyPeriodsWithRatios.length - 1
                      ? 'bg-blue-950/40 text-blue-200 font-bold border-l border-blue-900/40'
                      : ''
                  }`}
                >
                  {p.period}
                  {idx === activeCompanyPeriodsWithRatios.length - 1 && (
                    <span className="block text-[10px] text-blue-400 font-normal">最新期</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-200 font-mono">
            {statementTab === 'ratios' && (
              <>
                <tr className="bg-slate-950/40 text-slate-400 font-sans font-semibold">
                  <td colSpan={activeCompanyPeriodsWithRatios.length + 2} className="py-2.5 px-4 text-[11px] text-blue-400">
                    一、營運與週轉效率 (Activity & Turnover)
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 font-sans font-medium text-slate-200 sticky left-0 bg-slate-900 z-10 border-r border-slate-800/80 shadow-[2px_0_6px_rgba(0,0,0,0.3)]">應收帳款週轉率</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">次/年</td>
                  {activeCompanyPeriodsWithRatios.map((p) => (
                    <td key={p.id} className="py-2.5 px-4 text-right text-blue-300">{p.ratios.arTurnover}</td>
                  ))}
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 font-sans font-medium text-slate-200 sticky left-0 bg-slate-900 z-10 border-r border-slate-800/80 shadow-[2px_0_6px_rgba(0,0,0,0.3)]">應收帳款週轉天數 (DSO)</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">天</td>
                  {activeCompanyPeriodsWithRatios.map((p) => (
                    <td key={p.id} className="py-2.5 px-4 text-right text-blue-300">{p.ratios.dso}</td>
                  ))}
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 font-sans font-medium text-slate-200 sticky left-0 bg-slate-900 z-10 border-r border-slate-800/80 shadow-[2px_0_6px_rgba(0,0,0,0.3)]">存貨週轉率</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">次/年</td>
                  {activeCompanyPeriodsWithRatios.map((p) => (
                    <td key={p.id} className="py-2.5 px-4 text-right text-indigo-300">{p.ratios.inventoryTurnover}</td>
                  ))}
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 font-sans font-medium text-slate-200 sticky left-0 bg-slate-900 z-10 border-r border-slate-800/80 shadow-[2px_0_6px_rgba(0,0,0,0.3)]">存貨週轉天數 (DSI)</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">天</td>
                  {activeCompanyPeriodsWithRatios.map((p) => (
                    <td key={p.id} className="py-2.5 px-4 text-right text-indigo-300">{p.ratios.dsi}</td>
                  ))}
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 font-sans font-medium text-slate-200 sticky left-0 bg-slate-900 z-10 border-r border-slate-800/80 shadow-[2px_0_6px_rgba(0,0,0,0.3)]">現金轉換循環 (CCC)</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">天</td>
                  {activeCompanyPeriodsWithRatios.map((p) => (
                    <td key={p.id} className="py-2.5 px-4 text-right font-bold text-cyan-300">{p.ratios.cashConversionCycle}</td>
                  ))}
                </tr>

                <tr className="bg-slate-950/40 text-slate-400 font-sans font-semibold">
                  <td colSpan={activeCompanyPeriodsWithRatios.length + 2} className="py-2.5 px-4 text-[11px] text-emerald-400">
                    二、獲利能力與報酬 (Profitability & Returns)
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 font-sans font-medium text-slate-200 sticky left-0 bg-slate-900 z-10 border-r border-slate-800/80 shadow-[2px_0_6px_rgba(0,0,0,0.3)]">營業毛利率 (Gross Margin)</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">%</td>
                  {activeCompanyPeriodsWithRatios.map((p) => (
                    <td key={p.id} className="py-2.5 px-4 text-right text-emerald-300">{p.ratios.grossMargin}%</td>
                  ))}
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 font-sans font-medium text-slate-200 sticky left-0 bg-slate-900 z-10 border-r border-slate-800/80 shadow-[2px_0_6px_rgba(0,0,0,0.3)]">營業利益率 (Operating Margin)</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">%</td>
                  {activeCompanyPeriodsWithRatios.map((p) => (
                    <td key={p.id} className="py-2.5 px-4 text-right text-emerald-300">{p.ratios.operatingMargin}%</td>
                  ))}
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 font-sans font-medium text-slate-200 sticky left-0 bg-slate-900 z-10 border-r border-slate-800/80 shadow-[2px_0_6px_rgba(0,0,0,0.3)]">稅後純益率 (Net Margin)</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">%</td>
                  {activeCompanyPeriodsWithRatios.map((p) => (
                    <td key={p.id} className="py-2.5 px-4 text-right text-emerald-300">{p.ratios.netMargin}%</td>
                  ))}
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 font-sans font-medium text-slate-200 sticky left-0 bg-slate-900 z-10 border-r border-slate-800/80 shadow-[2px_0_6px_rgba(0,0,0,0.3)]">股東權益報酬率 (ROE)</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">%</td>
                  {activeCompanyPeriodsWithRatios.map((p) => (
                    <td key={p.id} className="py-2.5 px-4 text-right font-bold text-amber-300">{p.ratios.roe}%</td>
                  ))}
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 font-sans font-medium text-slate-200 sticky left-0 bg-slate-900 z-10 border-r border-slate-800/80 shadow-[2px_0_6px_rgba(0,0,0,0.3)]">資產報酬率 (ROA)</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">%</td>
                  {activeCompanyPeriodsWithRatios.map((p) => (
                    <td key={p.id} className="py-2.5 px-4 text-right text-amber-300">{p.ratios.roa}%</td>
                  ))}
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 font-sans font-medium text-slate-200 sticky left-0 bg-slate-900 z-10 border-r border-slate-800/80 shadow-[2px_0_6px_rgba(0,0,0,0.3)]">每股盈餘 (EPS)</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">元</td>
                  {activeCompanyPeriodsWithRatios.map((p) => (
                    <td key={p.id} className="py-2.5 px-4 text-right font-bold text-amber-300">${p.ratios.eps}</td>
                  ))}
                </tr>

                <tr className="bg-slate-950/40 text-slate-400 font-sans font-semibold">
                  <td colSpan={activeCompanyPeriodsWithRatios.length + 2} className="py-2.5 px-4 text-[11px] text-indigo-400">
                    三、償債與財務結構 (Solvency & Liquidity)
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 font-sans font-medium text-slate-200 sticky left-0 bg-slate-900 z-10 border-r border-slate-800/80 shadow-[2px_0_6px_rgba(0,0,0,0.3)]">流動比率 (Current Ratio)</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">%</td>
                  {activeCompanyPeriodsWithRatios.map((p) => (
                    <td key={p.id} className="py-2.5 px-4 text-right text-slate-300">{p.ratios.currentRatio}%</td>
                  ))}
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 font-sans font-medium text-slate-200 sticky left-0 bg-slate-900 z-10 border-r border-slate-800/80 shadow-[2px_0_6px_rgba(0,0,0,0.3)]">速動比率 (Quick Ratio)</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">%</td>
                  {activeCompanyPeriodsWithRatios.map((p) => (
                    <td key={p.id} className="py-2.5 px-4 text-right text-slate-300">{p.ratios.quickRatio}%</td>
                  ))}
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 font-sans font-medium text-slate-200 sticky left-0 bg-slate-900 z-10 border-r border-slate-800/80 shadow-[2px_0_6px_rgba(0,0,0,0.3)]">負債比率 (Debt Ratio)</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">%</td>
                  {activeCompanyPeriodsWithRatios.map((p) => (
                    <td key={p.id} className="py-2.5 px-4 text-right text-slate-300">{p.ratios.debtRatio}%</td>
                  ))}
                </tr>
              </>
            )}

            {statementTab === 'income' && (
              <>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 font-sans font-medium text-slate-200 sticky left-0 bg-slate-900 z-10 border-r border-slate-800/80 shadow-[2px_0_6px_rgba(0,0,0,0.3)]">營業收入 (Revenue)</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">千元</td>
                  {activeCompanyPeriodsWithRatios.map((p) => (
                    <td key={p.id} className="py-2.5 px-4 text-right font-bold text-white">{p.revenue.toLocaleString()}</td>
                  ))}
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 font-sans font-medium text-slate-200 sticky left-0 bg-slate-900 z-10 border-r border-slate-800/80 shadow-[2px_0_6px_rgba(0,0,0,0.3)]">營業成本 (COGS)</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">千元</td>
                  {activeCompanyPeriodsWithRatios.map((p) => (
                    <td key={p.id} className="py-2.5 px-4 text-right text-rose-300">({p.costOfGoodsSold.toLocaleString()})</td>
                  ))}
                </tr>
                <tr className="hover:bg-slate-800/30 bg-slate-950/40 font-bold">
                  <td className="py-2.5 px-4 font-sans text-emerald-400 sticky left-0 bg-slate-900 z-10 border-r border-slate-800/80 shadow-[2px_0_6px_rgba(0,0,0,0.3)]">營業毛利 (Gross Profit)</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">千元</td>
                  {activeCompanyPeriodsWithRatios.map((p) => (
                    <td key={p.id} className="py-2.5 px-4 text-right text-emerald-300">{p.grossProfit.toLocaleString()}</td>
                  ))}
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 font-sans font-medium text-slate-200 sticky left-0 bg-slate-900 z-10 border-r border-slate-800/80 shadow-[2px_0_6px_rgba(0,0,0,0.3)]">營業費用 (OpEx)</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">千元</td>
                  {activeCompanyPeriodsWithRatios.map((p) => (
                    <td key={p.id} className="py-2.5 px-4 text-right text-rose-300">({p.operatingExpenses.toLocaleString()})</td>
                  ))}
                </tr>
                <tr className="hover:bg-slate-800/30 font-semibold">
                  <td className="py-2.5 px-4 font-sans text-blue-400 sticky left-0 bg-slate-900 z-10 border-r border-slate-800/80 shadow-[2px_0_6px_rgba(0,0,0,0.3)]">營業利益 (EBIT)</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">千元</td>
                  {activeCompanyPeriodsWithRatios.map((p) => (
                    <td key={p.id} className={`py-2.5 px-4 text-right ${p.operatingIncome < 0 ? 'text-rose-400 font-bold' : 'text-blue-300'}`}>
                      {p.operatingIncome < 0 ? `(${Math.abs(p.operatingIncome).toLocaleString()})` : p.operatingIncome.toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-slate-800/30 bg-amber-950/20 font-bold">
                  <td className="py-2.5 px-4 font-sans text-amber-400 sticky left-0 bg-slate-900 z-10 border-r border-slate-800/80 shadow-[2px_0_6px_rgba(0,0,0,0.3)]">稅後淨利 (Net Income)</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">千元</td>
                  {activeCompanyPeriodsWithRatios.map((p) => (
                    <td key={p.id} className={`py-2.5 px-4 text-right ${p.netIncome < 0 ? 'text-rose-400 font-bold' : 'text-amber-300'}`}>
                      {p.netIncome < 0 ? `(${Math.abs(p.netIncome).toLocaleString()})` : p.netIncome.toLocaleString()}
                    </td>
                  ))}
                </tr>
              </>
            )}

            {statementTab === 'balance' && (
              <>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 font-sans font-medium text-slate-200 sticky left-0 bg-slate-900 z-10 border-r border-slate-800/80 shadow-[2px_0_6px_rgba(0,0,0,0.3)]">現金及約當現金</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">千元</td>
                  {activeCompanyPeriodsWithRatios.map((p) => (
                    <td key={p.id} className="py-2.5 px-4 text-right">{p.cashAndEquivalents.toLocaleString()}</td>
                  ))}
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 font-sans font-medium text-slate-200 sticky left-0 bg-slate-900 z-10 border-r border-slate-800/80 shadow-[2px_0_6px_rgba(0,0,0,0.3)]">應收帳款及票據</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">千元</td>
                  {activeCompanyPeriodsWithRatios.map((p) => (
                    <td key={p.id} className="py-2.5 px-4 text-right text-blue-300">{p.accountsReceivable.toLocaleString()}</td>
                  ))}
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 font-sans font-medium text-slate-200 sticky left-0 bg-slate-900 z-10 border-r border-slate-800/80 shadow-[2px_0_6px_rgba(0,0,0,0.3)]">存貨 (Inventory)</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">千元</td>
                  {activeCompanyPeriodsWithRatios.map((p) => (
                    <td key={p.id} className="py-2.5 px-4 text-right text-indigo-300">{p.inventory.toLocaleString()}</td>
                  ))}
                </tr>
                <tr className="hover:bg-slate-800/30 font-semibold bg-slate-950/30">
                  <td className="py-2.5 px-4 font-sans text-slate-300 sticky left-0 bg-slate-900 z-10 border-r border-slate-800/80 shadow-[2px_0_6px_rgba(0,0,0,0.3)]">流動資產合計</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">千元</td>
                  {activeCompanyPeriodsWithRatios.map((p) => (
                    <td key={p.id} className="py-2.5 px-4 text-right">{p.currentAssets.toLocaleString()}</td>
                  ))}
                </tr>
                <tr className="hover:bg-slate-800/30 font-bold text-white bg-blue-950/20">
                  <td className="py-2.5 px-4 font-sans text-blue-300 sticky left-0 bg-slate-900 z-10 border-r border-slate-800/80 shadow-[2px_0_6px_rgba(0,0,0,0.3)]">資產總額 (Total Assets)</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">千元</td>
                  {activeCompanyPeriodsWithRatios.map((p) => (
                    <td key={p.id} className="py-2.5 px-4 text-right text-white">{p.totalAssets.toLocaleString()}</td>
                  ))}
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 font-sans font-medium text-slate-200 sticky left-0 bg-slate-900 z-10 border-r border-slate-800/80 shadow-[2px_0_6px_rgba(0,0,0,0.3)]">流動負債合計</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">千元</td>
                  {activeCompanyPeriodsWithRatios.map((p) => (
                    <td key={p.id} className="py-2.5 px-4 text-right">{p.currentLiabilities.toLocaleString()}</td>
                  ))}
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 font-sans font-medium text-slate-200 sticky left-0 bg-slate-900 z-10 border-r border-slate-800/80 shadow-[2px_0_6px_rgba(0,0,0,0.3)]">負債總額 (Total Liabilities)</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">千元</td>
                  {activeCompanyPeriodsWithRatios.map((p) => (
                    <td key={p.id} className="py-2.5 px-4 text-right">{p.totalLiabilities.toLocaleString()}</td>
                  ))}
                </tr>
                <tr className="hover:bg-slate-800/30 font-bold bg-amber-950/20">
                  <td className="py-2.5 px-4 font-sans text-amber-400 sticky left-0 bg-slate-900 z-10 border-r border-slate-800/80 shadow-[2px_0_6px_rgba(0,0,0,0.3)]">股東權益總額 (Equity)</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">千元</td>
                  {activeCompanyPeriodsWithRatios.map((p) => (
                    <td key={p.id} className="py-2.5 px-4 text-right text-amber-300">{p.stockholdersEquity.toLocaleString()}</td>
                  ))}
                </tr>
              </>
            )}

            {statementTab === 'cashflow' && (
              <>
                <tr className="hover:bg-slate-800/30 font-semibold">
                  <td className="py-2.5 px-4 font-sans text-emerald-400 sticky left-0 bg-slate-900 z-10 border-r border-slate-800/80 shadow-[2px_0_6px_rgba(0,0,0,0.3)]">營業活動現金流量 (OCF)</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">千元</td>
                  {activeCompanyPeriodsWithRatios.map((p) => (
                    <td key={p.id} className={`py-2.5 px-4 text-right font-bold ${p.operatingCashFlow < 0 ? 'text-rose-400' : 'text-emerald-300'}`}>
                      {p.operatingCashFlow < 0 ? `(${Math.abs(p.operatingCashFlow).toLocaleString()})` : p.operatingCashFlow.toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 font-sans font-medium text-slate-200 sticky left-0 bg-slate-900 z-10 border-r border-slate-800/80 shadow-[2px_0_6px_rgba(0,0,0,0.3)]">資本支出 (CapEx)</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">千元</td>
                  {activeCompanyPeriodsWithRatios.map((p) => (
                    <td key={p.id} className="py-2.5 px-4 text-right text-rose-300">({p.capitalExpenditures.toLocaleString()})</td>
                  ))}
                </tr>
                <tr className="hover:bg-slate-800/30 font-bold bg-cyan-950/30">
                  <td className="py-2.5 px-4 font-sans text-cyan-400 sticky left-0 bg-slate-900 z-10 border-r border-slate-800/80 shadow-[2px_0_6px_rgba(0,0,0,0.3)]">自由現金流量 (Free Cash Flow)</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">千元</td>
                  {activeCompanyPeriodsWithRatios.map((p) => (
                    <td key={p.id} className={`py-2.5 px-4 text-right font-bold ${p.ratios.freeCashFlow < 0 ? 'text-rose-400' : 'text-cyan-300'}`}>
                      {p.ratios.freeCashFlow < 0 ? `(${Math.abs(p.ratios.freeCashFlow).toLocaleString()})` : p.ratios.freeCashFlow.toLocaleString()}
                    </td>
                  ))}
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
