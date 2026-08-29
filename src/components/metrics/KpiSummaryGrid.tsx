import React from 'react';
import { useFinancial } from '../../context/FinancialContext';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  PackageCheck,
  Percent,
  Award,
  ShieldCheck,
  Gem,
  Waves,
  Castle,
} from 'lucide-react';

export const KpiSummaryGrid: React.FC = () => {
  const { activeCompanyPeriodsWithRatios, latestPeriod, viewMode } = useFinancial();

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

  // 1. 價值投資者專屬視角 (Investor Mode KPI Cards)
  if (viewMode === 'investor') {
    const ocfDelta = calcDelta(curRatios.ocfToNetIncome, prevRatios?.ocfToNetIncome, true);
    const roeDelta = calcDelta(curRatios.roe, prevRatios?.roe, true);
    const zDelta = calcDelta(curRatios.altmanZScore, prevRatios?.altmanZScore);

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* 1. 經濟護城河評級 (Economic Moat) */}
        <div className="bg-slate-900/50 border border-slate-800 hover:border-emerald-500/50 rounded-2xl sm:rounded-3xl p-4.5 sm:p-6 transition-all shadow-sm flex flex-col justify-between group backdrop-blur-sm">
          <div>
            <div className="flex items-center justify-between mb-3 gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 truncate">
                <Castle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                經濟護城河評級
              </span>
              <span className={`text-[10px] sm:text-[11px] font-bold px-2 sm:px-2.5 py-0.5 rounded-full flex-shrink-0 ${
                curRatios.economicMoat === 'wide' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30' :
                curRatios.economicMoat === 'narrow' ? 'bg-blue-500/10 text-blue-300 border border-blue-500/30' :
                'bg-slate-800 text-slate-400 border border-slate-700'
              }`}>
                {curRatios.economicMoat === 'wide' ? '👑 寬護城河' : curRatios.economicMoat === 'narrow' ? '🛡️ 窄護城河' : '無顯著壁壘'}
              </span>
            </div>

            <div className="flex items-baseline justify-between mt-1 sm:mt-2 gap-2">
              <div>
                <div className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  {curRatios.economicMoat === 'wide' ? '強大定價權' : curRatios.economicMoat === 'narrow' ? '中度壁壘' : '競爭激烈'}
                </div>
                <div className="text-[11px] sm:text-xs text-slate-400 mt-1">
                  毛利 <span className="font-semibold text-emerald-400 font-mono">{curRatios.grossMargin}%</span> • ROE <span className="font-semibold text-amber-400 font-mono">{curRatios.roe}%</span>
                </div>
              </div>
              {roeDelta && (
                <div className={`flex items-center text-xs font-semibold px-2 py-1 rounded-lg flex-shrink-0 ${
                  roeDelta.isUp ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
                }`}>
                  {roeDelta.isUp ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
                  {roeDelta.text}
                </div>
              )}
            </div>
          </div>

          <div className="mt-3.5 sm:mt-4 pt-3 border-t border-slate-800/80">
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-1.5">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${curRatios.economicMoat === 'wide' ? 95 : curRatios.economicMoat === 'narrow' ? 65 : 35}%` }}
              ></div>
            </div>
            <div className="text-[10px] sm:text-[11px] text-slate-500 flex justify-between">
              <span>長期資本回報力</span>
              <span>{curRatios.economicMoat === 'wide' ? '具定價溢價' : '一般競爭'}</span>
            </div>
          </div>
        </div>

        {/* 2. 獲利含金量 (Earnings Quality) */}
        <div className="bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 rounded-2xl sm:rounded-3xl p-4.5 sm:p-6 transition-all shadow-sm flex flex-col justify-between group backdrop-blur-sm">
          <div>
            <div className="flex items-center justify-between mb-3 gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 truncate">
                <Gem className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                獲利含金量 (OCF/Net)
              </span>
              <span className={`text-[10px] sm:text-[11px] font-bold px-2 sm:px-2.5 py-0.5 rounded-full flex-shrink-0 ${
                curRatios.ocfToNetIncome >= 100 ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' :
                curRatios.ocfToNetIncome >= 70 ? 'bg-blue-500/10 text-blue-300 border border-blue-500/30' :
                'bg-amber-500/10 text-amber-300 border border-amber-500/30'
              }`}>
                {curRatios.ocfToNetIncome >= 100 ? '💎 真金白銀' : curRatios.ocfToNetIncome >= 70 ? '正常落袋' : '⚠️ 利潤滯留'}
              </span>
            </div>

            <div className="flex items-baseline justify-between mt-1 sm:mt-2 gap-2">
              <div>
                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
                  {curRatios.ocfToNetIncome} <span className="text-xs sm:text-sm font-normal text-slate-400 font-sans">%</span>
                </div>
                <div className="text-[11px] sm:text-xs text-slate-400 mt-1">
                  營業現金流 / 稅後淨利（基準 &gt; 100%）
                </div>
              </div>
              {ocfDelta && (
                <div className={`flex items-center text-xs font-semibold px-2 py-1 rounded-lg flex-shrink-0 ${
                  ocfDelta.isUp ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
                }`}>
                  {ocfDelta.isUp ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
                  {ocfDelta.text}
                </div>
              )}
            </div>
          </div>

          <div className="mt-3.5 sm:mt-4 pt-3 border-t border-slate-800/80">
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-1.5">
              <div
                className="h-full bg-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(10, curRatios.ocfToNetIncome))}%` }}
              ></div>
            </div>
            <div className="text-[10px] sm:text-[11px] text-slate-500 flex justify-between">
              <span>現金流入 ${(latestPeriod.operatingCashFlow / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })}M</span>
              <span>真實現金轉化</span>
            </div>
          </div>
        </div>

        {/* 3. 自由現金流 (Free Cash Flow) */}
        <div className="bg-slate-900/50 border border-slate-800 hover:border-cyan-500/50 rounded-2xl sm:rounded-3xl p-4.5 sm:p-6 transition-all shadow-sm flex flex-col justify-between group backdrop-blur-sm">
          <div>
            <div className="flex items-center justify-between mb-3 gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 truncate">
                <Waves className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                自由現金流 (FCF)
              </span>
              <span className={`text-[10px] sm:text-[11px] font-bold px-2 sm:px-2.5 py-0.5 rounded-full flex-shrink-0 ${
                curRatios.freeCashFlow > 0 ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' :
                'bg-rose-500/10 text-rose-300 border border-rose-500/30'
              }`}>
                {curRatios.freeCashFlow > 0 ? '充沛造血' : '現金吃緊'}
              </span>
            </div>

            <div className="flex items-baseline justify-between mt-1 sm:mt-2 gap-2">
              <div>
                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
                  ${(curRatios.freeCashFlow / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })} <span className="text-xs sm:text-sm font-normal text-slate-400 font-sans">百萬</span>
                </div>
                <div className="text-[11px] sm:text-xs text-slate-400 mt-1">
                  營運現金扣除資本支出 (CAPEX)
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3.5 sm:mt-4 pt-3 border-t border-slate-800/80">
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-1.5">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(15, (curRatios.freeCashFlow / (latestPeriod.revenue || 1)) * 100 * 3))}%` }}
              ></div>
            </div>
            <div className="text-[10px] sm:text-[11px] text-slate-500 flex justify-between">
              <span>資本支出 ${(latestPeriod.capitalExpenditures / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })}M</span>
              <span>股息/研發底氣</span>
            </div>
          </div>
        </div>

        {/* 4. Altman Z-Score 破產防禦分 */}
        <div className="bg-slate-900/50 border border-slate-800 hover:border-purple-500/50 rounded-2xl sm:rounded-3xl p-4.5 sm:p-6 transition-all shadow-sm flex flex-col justify-between group backdrop-blur-sm">
          <div>
            <div className="flex items-center justify-between mb-3 gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 truncate">
                <ShieldCheck className="w-4 h-4 text-purple-400 flex-shrink-0" />
                Altman Z 破產防禦分
              </span>
              <span className={`text-[10px] sm:text-[11px] font-bold px-2 sm:px-2.5 py-0.5 rounded-full flex-shrink-0 ${
                curRatios.altmanZZone === 'safe' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' :
                curRatios.altmanZZone === 'grey' ? 'bg-blue-500/10 text-blue-300 border border-blue-500/30' :
                'bg-rose-500/10 text-rose-300 border border-rose-500/30'
              }`}>
                {curRatios.altmanZZone === 'safe' ? '🏰 安全堡壘' : curRatios.altmanZZone === 'grey' ? '⚖️ 灰色區' : '🚨 困境警戒'}
              </span>
            </div>

            <div className="flex items-baseline justify-between mt-1 sm:mt-2 gap-2">
              <div>
                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
                  {curRatios.altmanZScore} <span className="text-xs sm:text-sm font-normal text-slate-400 font-sans">分</span>
                </div>
                <div className="text-[11px] sm:text-xs text-slate-400 mt-1">
                  安全線 &gt; 2.99 ｜ 破產風險極低
                </div>
              </div>
              {zDelta && (
                <div className={`flex items-center text-xs font-semibold px-2 py-1 rounded-lg flex-shrink-0 ${
                  zDelta.isUp ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
                }`}>
                  {zDelta.isUp ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
                  {zDelta.text}
                </div>
              )}
            </div>
          </div>

          <div className="mt-3.5 sm:mt-4 pt-3 border-t border-slate-800/80">
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-1.5">
              <div
                className="h-full bg-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (curRatios.altmanZScore / 4) * 100)}%` }}
              ></div>
            </div>
            <div className="text-[10px] sm:text-[11px] text-slate-500 flex justify-between">
              <span>流動比率 {curRatios.currentRatio}%</span>
              <span>負債比 {curRatios.debtRatio}%</span>
            </div>
          </div>
        </div>

      </div>
    );
  }

  // 2. 企業經營者視角 (Manager Mode KPI Cards)
  const arDelta = calcDelta(curRatios.arTurnover, prevRatios?.arTurnover);
  const invDelta = calcDelta(curRatios.inventoryTurnover, prevRatios?.inventoryTurnover);
  const grossDelta = calcDelta(curRatios.grossMargin, prevRatios?.grossMargin, true);
  const roeDelta = calcDelta(curRatios.roe, prevRatios?.roe, true);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      
      {/* 1. 應收帳款週轉率 & DSO (Bento Card) */}
      <div className="bg-slate-900/50 border border-slate-800 hover:border-slate-700 rounded-2xl sm:rounded-3xl p-4.5 sm:p-6 transition-all shadow-sm flex flex-col justify-between group backdrop-blur-sm">
        <div>
          <div className="flex items-center justify-between mb-3 gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 truncate">
              <Clock className="w-4 h-4 text-blue-400 flex-shrink-0" />
              應收帳款週轉率
            </span>
            <span className={`text-[10px] sm:text-[11px] font-medium px-2 sm:px-2.5 py-0.5 rounded-full flex-shrink-0 ${
              curRatios.dso <= 65 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
              curRatios.dso <= 90 ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
              'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}>
              {curRatios.dso <= 65 ? '收現優異' : curRatios.dso <= 90 ? '收現穩健' : '帳齡偏長'}
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-1 sm:mt-2 gap-2">
            <div>
              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
                {curRatios.arTurnover} <span className="text-xs sm:text-sm font-normal text-slate-400 font-sans">次/年</span>
              </div>
              <div className="text-[11px] sm:text-xs text-slate-400 mt-1">
                平均收現 (DSO): <span className="font-semibold text-blue-400 font-mono">{curRatios.dso} 天</span>
              </div>
            </div>
            {arDelta && (
              <div className={`flex items-center text-xs font-semibold px-2 py-1 rounded-lg flex-shrink-0 ${
                arDelta.isUp ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
              }`}>
                {arDelta.isUp ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
                {arDelta.text}
              </div>
            )}
          </div>
        </div>

        {/* Bento Progress Meter */}
        <div className="mt-3.5 sm:mt-4 pt-3 border-t border-slate-800/80">
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-1.5">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (curRatios.arTurnover / 10) * 100)}%` }}
            ></div>
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-500 flex justify-between">
            <span>期末: ${(latestPeriod.accountsReceivable / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })}M</span>
            <span>基準 &gt; 6.0次</span>
          </div>
        </div>
      </div>

      {/* 2. 存貨週轉率 & DSI (Bento Card) */}
      <div className="bg-slate-900/50 border border-slate-800 hover:border-slate-700 rounded-2xl sm:rounded-3xl p-4.5 sm:p-6 transition-all shadow-sm flex flex-col justify-between group backdrop-blur-sm">
        <div>
          <div className="flex items-center justify-between mb-3 gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 truncate">
              <PackageCheck className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              存貨週轉率
            </span>
            <span className={`text-[10px] sm:text-[11px] font-medium px-2 sm:px-2.5 py-0.5 rounded-full flex-shrink-0 ${
              curRatios.dsi <= 75 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
              curRatios.dsi <= 110 ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
              'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}>
              {curRatios.dsi <= 75 ? '動銷強勁' : curRatios.dsi <= 110 ? '去化穩健' : '庫存偏高'}
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-1 sm:mt-2 gap-2">
            <div>
              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
                {curRatios.inventoryTurnover} <span className="text-xs sm:text-sm font-normal text-slate-400 font-sans">次/年</span>
              </div>
              <div className="text-[11px] sm:text-xs text-slate-400 mt-1">
                銷貨天數 (DSI): <span className="font-semibold text-indigo-400 font-mono">{curRatios.dsi} 天</span>
              </div>
            </div>
            {invDelta && (
              <div className={`flex items-center text-xs font-semibold px-2 py-1 rounded-lg flex-shrink-0 ${
                invDelta.isUp ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
              }`}>
                {invDelta.isUp ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
                {invDelta.text}
              </div>
            )}
          </div>
        </div>

        {/* Bento Progress Meter */}
        <div className="mt-3.5 sm:mt-4 pt-3 border-t border-slate-800/80">
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-1.5">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (curRatios.inventoryTurnover / 8) * 100)}%` }}
            ></div>
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-500 flex justify-between">
            <span>期末: ${(latestPeriod.inventory / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })}M</span>
            <span>基準 &gt; 4.5次</span>
          </div>
        </div>
      </div>

      {/* 3. 營業毛利率 (Bento Card) */}
      <div className="bg-slate-900/50 border border-slate-800 hover:border-slate-700 rounded-2xl sm:rounded-3xl p-4.5 sm:p-6 transition-all shadow-sm flex flex-col justify-between group backdrop-blur-sm">
        <div>
          <div className="flex items-center justify-between mb-3 gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 truncate">
              <Percent className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              營業毛利率
            </span>
            <span className={`text-[10px] sm:text-[11px] font-medium px-2 sm:px-2.5 py-0.5 rounded-full flex-shrink-0 ${
              curRatios.grossMargin >= 35 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
              curRatios.grossMargin >= 20 ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
              'bg-slate-800 text-slate-300 border border-slate-700'
            }`}>
              {curRatios.grossMargin >= 35 ? '定價優勢' : curRatios.grossMargin >= 20 ? '毛利穩健' : '薄利微利'}
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-1 sm:mt-2 gap-2">
            <div>
              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
                {curRatios.grossMargin}%
              </div>
              <div className="text-[11px] sm:text-xs text-slate-400 mt-1">
                營益率: <span className="font-semibold text-emerald-400 font-mono">{curRatios.operatingMargin}%</span>
              </div>
            </div>
            {grossDelta && (
              <div className={`flex items-center text-xs font-semibold px-2 py-1 rounded-lg flex-shrink-0 ${
                grossDelta.isUp ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
              }`}>
                {grossDelta.isUp ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
                {grossDelta.text}
              </div>
            )}
          </div>
        </div>

        {/* Bento Progress Meter */}
        <div className="mt-3.5 sm:mt-4 pt-3 border-t border-slate-800/80">
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-1.5">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (curRatios.grossMargin / 60) * 100)}%` }}
            ></div>
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-500 flex justify-between">
            <span>營收: ${(latestPeriod.revenue / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })}M</span>
            <span>基準 &gt; 30%</span>
          </div>
        </div>
      </div>

      {/* 4. 股東權益報酬率 (ROE) (Bento Card) */}
      <div className="bg-slate-900/50 border border-slate-800 hover:border-slate-700 rounded-2xl sm:rounded-3xl p-4.5 sm:p-6 transition-all shadow-sm flex flex-col justify-between group backdrop-blur-sm">
        <div>
          <div className="flex items-center justify-between mb-3 gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 truncate">
              <Award className="w-4 h-4 text-amber-400 flex-shrink-0" />
              股東權益報酬率 (ROE)
            </span>
            <span className={`text-[10px] sm:text-[11px] font-medium px-2 sm:px-2.5 py-0.5 rounded-full flex-shrink-0 ${
              curRatios.roe >= 18 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
              curRatios.roe >= 10 ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
              'bg-slate-800 text-slate-300 border border-slate-700'
            }`}>
              {curRatios.roe >= 18 ? '回報高' : curRatios.roe >= 10 ? '良好' : '待改善'}
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-1 sm:mt-2 gap-2">
            <div>
              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
                {curRatios.roe}%
              </div>
              <div className="text-[11px] sm:text-xs text-slate-400 mt-1">
                淨利率: <span className="font-semibold text-amber-400 font-mono">{curRatios.netMargin}%</span> • EPS: <span className="font-semibold text-amber-400 font-mono">${curRatios.eps}</span>
              </div>
            </div>
            {roeDelta && (
              <div className={`flex items-center text-xs font-semibold px-2 py-1 rounded-lg flex-shrink-0 ${
                roeDelta.isUp ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
              }`}>
                {roeDelta.isUp ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
                {roeDelta.text}
              </div>
            )}
          </div>
        </div>

        {/* Bento Progress Meter */}
        <div className="mt-3.5 sm:mt-4 pt-3 border-t border-slate-800/80">
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-1.5">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (curRatios.roe / 35) * 100)}%` }}
            ></div>
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-500 flex justify-between">
            <span>淨利: ${(latestPeriod.netIncome / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })}M</span>
            <span>基準 &gt; 15%</span>
          </div>
        </div>
      </div>

    </div>
  );
};

