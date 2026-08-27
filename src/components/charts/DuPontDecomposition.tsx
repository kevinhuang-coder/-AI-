import React from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { GitFork, X, Equal, ArrowRight, TrendingUp, HelpCircle, Activity } from 'lucide-react';

export const DuPontDecomposition: React.FC = () => {
  const { latestPeriod, activeCompany } = useFinancial();

  if (!latestPeriod) return null;

  const r = latestPeriod.ratios;
  const netMargin = r.dupontNetMargin;
  const assetTurnover = r.dupontAssetTurnover;
  const equityMultiplier = r.dupontEquityMultiplier;
  const calculatedRoe = r.dupontRoe;

  // 判斷主要驅動引擎
  let primaryDriver = '獲利能力型 (Net Margin Driven)';
  let driverDesc = 'ROE 成長主要源自優異的產品定價優勢與毛利控制，企業具備良好的定價權與成本結構。';
  let driverBadgeColor = 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';

  if (assetTurnover >= 1.2 && netMargin < 12) {
    primaryDriver = '高資產週轉型 (Turnover Driven)';
    driverDesc = 'ROE 的主要驅動力來自極高的資產運用效率與快速銷貨收現，屬於薄利多銷、高速運轉之營運模式。';
    driverBadgeColor = 'bg-blue-500/10 text-blue-300 border-blue-500/30';
  } else if (equityMultiplier >= 2.8) {
    primaryDriver = '財務槓桿放大型 (Leverage Driven)';
    driverDesc = 'ROE 受到財務槓桿乘數的放大效應，雖提升股東報酬，但需審慎關注負債比率與利息償付負擔。';
    driverBadgeColor = 'bg-amber-500/10 text-amber-300 border-amber-500/30';
  }

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm p-6 sm:p-7 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
            <GitFork className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                杜邦分析三因子拆解 (DuPont Analysis)
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                {latestPeriod.period}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              將股東權益報酬率 (ROE) 拆解為「純益率 × 資產週轉率 × 權益乘數」，洞察獲利本質動能
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className={`text-xs px-3 py-1.5 rounded-xl border font-semibold flex items-center gap-1.5 ${driverBadgeColor}`}>
            <Activity className="w-3.5 h-3.5" />
            <span>歸因模式：{primaryDriver}</span>
          </span>
        </div>
      </div>

      {/* Visual Mathematical Formula Tree - Full Width Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-stretch text-center">
        
        {/* Factor 1: 稅後純益率 */}
        <div className="lg:col-span-3 bg-slate-950/70 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 transition flex flex-col justify-between text-left relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition" />
          
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider font-mono">
                因子 1 • 獲利效益
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-800/60 text-emerald-300">
                純益率
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-100 mt-2">稅後純益率 (Net Margin)</h4>
            
            <div className="text-3xl font-extrabold text-emerald-400 my-2.5 font-mono">
              {netMargin}%
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-800/80">
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 font-mono space-y-1">
              <div className="flex justify-between text-slate-400 text-[10px]">
                <span>稅後淨利</span>
                <span className="text-emerald-400 font-semibold">${latestPeriod.netIncome.toLocaleString()} 千元</span>
              </div>
              <div className="h-px bg-slate-700/60" />
              <div className="flex justify-between text-slate-400 text-[10px]">
                <span>營業收入</span>
                <span className="text-slate-200 font-semibold">${latestPeriod.revenue.toLocaleString()} 千元</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              衡量每 100 元營收所保留之實質淨利，反映核心產品定價權與總體費用控管能力。
            </p>
          </div>
        </div>

        {/* Multiply Sign 1 */}
        <div className="lg:col-span-1 flex items-center justify-center py-2 lg:py-0">
          <div className="w-9 h-9 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-amber-400 font-bold flex items-center justify-center shadow-md">
            <X className="w-4 h-4" />
          </div>
        </div>

        {/* Factor 2: 總資產週轉率 */}
        <div className="lg:col-span-3 bg-slate-950/70 border border-slate-800 hover:border-blue-500/40 rounded-2xl p-5 transition flex flex-col justify-between text-left relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition" />
          
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider font-mono">
                因子 2 • 營運效率
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-950/60 border border-blue-800/60 text-blue-300">
                週轉次數
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-100 mt-2">總資產週轉率 (Asset Turnover)</h4>
            
            <div className="text-3xl font-extrabold text-blue-400 my-2.5 font-mono">
              {assetTurnover} <span className="text-xs font-normal text-slate-400">次/年</span>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-800/80">
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 font-mono space-y-1">
              <div className="flex justify-between text-slate-400 text-[10px]">
                <span>營業收入</span>
                <span className="text-blue-400 font-semibold">${latestPeriod.revenue.toLocaleString()} 千元</span>
              </div>
              <div className="h-px bg-slate-700/60" />
              <div className="flex justify-between text-slate-400 text-[10px]">
                <span>資產總額</span>
                <span className="text-slate-200 font-semibold">${latestPeriod.totalAssets.toLocaleString()} 千元</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              衡量每 1 元資產所能創造的營收動能，反映存貨、應收帳款與固定資產產能利用率。
            </p>
          </div>
        </div>

        {/* Multiply Sign 2 */}
        <div className="lg:col-span-1 flex items-center justify-center py-2 lg:py-0">
          <div className="w-9 h-9 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-amber-400 font-bold flex items-center justify-center shadow-md">
            <X className="w-4 h-4" />
          </div>
        </div>

        {/* Factor 3: 權益乘數 */}
        <div className="lg:col-span-3 bg-slate-950/70 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-5 transition flex flex-col justify-between text-left relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition" />
          
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider font-mono">
                因子 3 • 財務槓桿
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-950/60 border border-indigo-800/60 text-indigo-300">
                槓桿倍數
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-100 mt-2">權益乘數 (Equity Multiplier)</h4>
            
            <div className="text-3xl font-extrabold text-indigo-400 my-2.5 font-mono">
              {equityMultiplier} <span className="text-xs font-normal text-slate-400">倍</span>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-800/80">
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 font-mono space-y-1">
              <div className="flex justify-between text-slate-400 text-[10px]">
                <span>資產總額</span>
                <span className="text-indigo-400 font-semibold">${latestPeriod.totalAssets.toLocaleString()} 千元</span>
              </div>
              <div className="h-px bg-slate-700/60" />
              <div className="flex justify-between text-slate-400 text-[10px]">
                <span>股東權益</span>
                <span className="text-slate-200 font-semibold">${latestPeriod.stockholdersEquity.toLocaleString()} 千元</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              衡量企業運用負債槓桿放大股東回報的倍數，比率越高代表舉債程度與財務風險相對顯著。
            </p>
          </div>
        </div>

      </div>

      {/* Result equals box */}
      <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900/90 to-amber-950/30 border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-5 shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
            <Equal className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-amber-300 font-semibold tracking-wide">
                杜邦綜效結果：股東權益報酬率 (ROE)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-200 font-mono">
                {netMargin}% × {assetTurnover} × {equityMultiplier}
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-0.5">
              {calculatedRoe}% <span className="text-xs text-slate-400 font-normal font-sans ml-1">({latestPeriod.period} 年化股東權益報酬率)</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-300 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 max-w-xl leading-relaxed">
          <div className="font-semibold text-amber-300 mb-1 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>管理決策與驅動解讀：</span>
          </div>
          {driverDesc}
        </div>
      </div>

    </div>
  );
};

