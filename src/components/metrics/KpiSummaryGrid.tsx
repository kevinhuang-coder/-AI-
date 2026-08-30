import React from 'react';
import { useFinancial } from '../../context/FinancialContext';
import {
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Crown,
  Sparkles,
  Coins,
  Cpu,
  Globe,
  Building,
  Store,
  Layers,
  Info,
} from 'lucide-react';
import { formatSmartCurrency } from '../../utils/financialCalculations';

export const KpiSummaryGrid: React.FC = () => {
  const { latestPeriod, previousPeriod, activeCompany } = useFinancial();

  if (!latestPeriod) return null;

  const curRatios = latestPeriod.ratios;
  const prevRatios = previousPeriod?.ratios;
  const industryStr = (activeCompany?.industry || '').toLowerCase();

  // 產業類型智慧判別 (Industry Archetype Detection)
  const isFinancial =
    (industryStr.includes('金融保險') ||
      industryStr.includes('金控') ||
      industryStr.includes('商業銀行') ||
      industryStr.includes('人壽保險') ||
      industryStr.includes('證券')) &&
    !industryStr.includes('電子商務') &&
    !industryStr.includes('人力銀行');

  const isRetailOrEcommerce =
    industryStr.includes('電子商務') ||
    industryStr.includes('貿易百貨') ||
    industryStr.includes('觀光餐旅') ||
    industryStr.includes('零售') ||
    industryStr.includes('餐飲') ||
    industryStr.includes('超商') ||
    industryStr.includes('網購');

  const isSoftwareOrSaaS =
    !isFinancial &&
    !isRetailOrEcommerce &&
    (industryStr.includes('軟體') ||
      industryStr.includes('資訊服務') ||
      industryStr.includes('遊戲') ||
      industryStr.includes('saas') ||
      industryStr.includes('人力銀行') ||
      industryStr.includes('數位科技'));

  const isConstruction =
    industryStr.includes('建材營造') ||
    industryStr.includes('營建') ||
    industryStr.includes('地產');

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
  const opmDelta = calcDelta(curRatios.operatingMargin, prevRatios?.operatingMargin, true);
  const zDelta = calcDelta(curRatios.altmanZScore, prevRatios?.altmanZScore);

  // Format currency
  const formatMoney = (val: number) => {
    return formatSmartCurrency(val, { withSymbol: true });
  };

  return (
    <div className="space-y-2.5">
      {/* 產業特徵智慧辨識與分析模型適配提示條 */}
      <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs text-slate-400 gap-2 flex-wrap">
        <div className="flex items-center space-x-2">
          {isSoftwareOrSaaS ? (
            <Globe className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
          ) : isFinancial ? (
            <Building className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          ) : isRetailOrEcommerce ? (
            <Store className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          ) : (
            <Cpu className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
          )}
          <span className="font-semibold text-white">
            所屬產業別：
            <span className="text-cyan-300 ml-1 font-mono">
              {activeCompany?.industry || '台灣上市櫃一般實體'}
            </span>
          </span>
        </div>

        <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
          <Info className="w-3.5 h-3.5 text-slate-500" />
          <span>
            {isSoftwareOrSaaS
              ? '💡 軟體與雲端平台模型：聚焦「營業利益率 (OPM) 與現金流」，已自動過濾無意義之實體存貨天數'
              : isFinancial
              ? '💡 金融控股模型：聚焦「資產報酬率 (ROA) 與槓桿品質」，免除製造業成本公式'
              : isRetailOrEcommerce
              ? '💡 電子商務與零售模型：聚焦「進銷存毛利率、存貨天數與現金轉換循環 (CCC)」'
              : isConstruction
              ? '💡 營建地產模型：聚焦「合約負債預收款與在建工程資本結構」'
              : '💡 製造與硬體模型：聚焦「毛利率護城河、存貨週轉與產能資本支出」'}
          </span>
        </div>
      </div>

      {/* 4 大核心 KPI 指標卡 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        
        {/* 卡片 1：核心獲利護城河 (自適應：軟體業呈現營業利益率；製造與電商業呈現毛利率；金融業呈現ROA) */}
        <div className="bg-slate-900/40 hover:bg-slate-900/60 border border-slate-800/60 hover:border-slate-700/80 rounded-2xl p-4 transition-all flex flex-col justify-between backdrop-blur-md shadow-xs">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                {isSoftwareOrSaaS ? '核心本業利潤率' : isFinancial ? '資產運用報酬 (ROA)' : '經濟護城河 (毛利率)'}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                curRatios.economicMoat === 'wide' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' :
                curRatios.economicMoat === 'narrow' ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20' :
                'bg-slate-800 text-slate-400'
              }`}>
                {isSoftwareOrSaaS
                  ? curRatios.operatingMargin >= 25 ? '頂級利潤率' : curRatios.operatingMargin >= 15 ? '穩健利潤率' : '一般利潤率'
                  : curRatios.economicMoat === 'wide' ? '寬護城河' : curRatios.economicMoat === 'narrow' ? '窄護城河' : '無顯著壁壘'}
              </span>
            </div>

            <div className="flex items-baseline justify-between gap-2">
              <div className="text-xl sm:text-2xl font-bold text-white tracking-tight font-mono">
                {isSoftwareOrSaaS
                  ? `${curRatios.operatingMargin}%`
                  : isFinancial
                  ? `${curRatios.roa}%`
                  : `${curRatios.grossMargin}%`}
                <span className="text-xs font-normal text-slate-400 ml-1.5 font-sans">
                  {isSoftwareOrSaaS ? '營業利益率' : isFinancial ? '資產報酬率' : '毛利率'}
                </span>
              </div>
              {(isSoftwareOrSaaS ? opmDelta : roeDelta) && (
                <div className={`flex items-center text-[11px] font-semibold font-mono ${
                  (isSoftwareOrSaaS ? opmDelta : roeDelta)!.isUp ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {(isSoftwareOrSaaS ? opmDelta : roeDelta)!.isUp ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                  {(isSoftwareOrSaaS ? opmDelta : roeDelta)!.text}
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
            <span>
              {isSoftwareOrSaaS
                ? `輕資產平台 (毛利率 ${curRatios.grossMargin}%)`
                : isFinancial
                ? 'ROE 股東權益報酬率'
                : `營益率 ${curRatios.operatingMargin}%`}
            </span>
            <span className="font-semibold text-amber-400 font-mono">
              {isSoftwareOrSaaS ? `ROE ${curRatios.roe}%` : `ROE ${curRatios.roe}%`}
            </span>
          </div>
        </div>

        {/* 卡片 2：獲利現金含金量 (Cash Conversion) */}
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

        {/* 卡片 3：審計嚴謹自由現金流 (Rigorous FCF) */}
        <div className="bg-slate-900/40 hover:bg-slate-900/60 border border-slate-800/60 hover:border-slate-700/80 rounded-2xl p-4 transition-all flex flex-col justify-between backdrop-blur-md shadow-xs">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                {isSoftwareOrSaaS ? '平台自由現金流' : '嚴謹自由現金流'}
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
            <span>
              {isSoftwareOrSaaS ? '低資本支出 (CapEx)' : '扣除 CapEx 資本支出'}
            </span>
            <span className="font-semibold text-slate-300 font-mono">
              {formatMoney(latestPeriod.capitalExpenditures)}
            </span>
          </div>
        </div>

        {/* 卡片 4：破產防禦力與負債結構 */}
        <div className="bg-slate-900/40 hover:bg-slate-900/60 border border-slate-800/60 hover:border-slate-700/80 rounded-2xl p-4 transition-all flex flex-col justify-between backdrop-blur-md shadow-xs">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 truncate">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                {isSoftwareOrSaaS ? '財務安全 / 淨現金體質' : 'Altman Z 破產防禦'}
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
    </div>
  );
};
