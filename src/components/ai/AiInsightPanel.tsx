import React, { useState } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { generateFinancialCopilotResponse } from '../../utils/financialCalculations';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  RotateCcw,
  Zap,
  Send,
  MessageSquare,
  ShieldAlert,
  Target,
  ArrowRight,
  Bot,
} from 'lucide-react';

export const AiInsightPanel: React.FC = () => {
  const { aiReport, activeCompany, runAiDiagnostic, isLoadingAi, latestPeriod, viewMode } =
    useFinancial();

  if (!aiReport || !latestPeriod) return null;

  const r = latestPeriod.ratios;
  const isInvestor = viewMode === 'investor';

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* 1. Main Executive AI Diagnostic Header Card */}
      <div className="rounded-2xl sm:rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm p-4.5 sm:p-6 shadow-sm relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-96 h-96 ${isInvestor ? 'bg-emerald-500/5' : 'bg-blue-500/5'} rounded-full blur-3xl pointer-events-none`}></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-5">
          <div className="flex items-center space-x-3">
            <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${isInvestor ? 'from-emerald-600 to-teal-600 shadow-emerald-500/20' : 'from-blue-600 to-indigo-600 shadow-blue-500/20'} flex items-center justify-center text-white shadow-md flex-shrink-0`}>
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {isInvestor ? 'AI 價值投資與基本面深度診斷報告' : 'AI 財務健康深度診斷戰情報告'}
                </h3>
                <span className={`text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full font-mono font-bold ${
                  isInvestor
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                }`}>
                  {isInvestor ? '價值投資基本面引擎' : 'Gemini 3.7 Flash 驅動'}
                </span>
                <span className={`text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full font-mono font-bold ${
                  aiReport.overallScore >= 80 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  aiReport.overallScore >= 60 ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                  'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  評分：{aiReport.overallScore} 分 • {aiReport.overallRating}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isInvestor
                  ? '經濟護城河評級、獲利含金量 (OCF/Net)、自由現金流造血力與破產防禦'
                  : '自動化多維度異常偵測、杜邦拆解、營運資金效率與經營決策指引'}
              </p>
            </div>
          </div>

          <button
            onClick={runAiDiagnostic}
            disabled={isLoadingAi}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl sm:rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/60 text-xs font-semibold transition self-start sm:self-auto disabled:opacity-50 min-h-[38px] cursor-pointer"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isLoadingAi ? 'animate-spin text-amber-300' : 'text-blue-400'}`} />
            <span>{isLoadingAi ? '重新運算中...' : '重新分析'}</span>
          </button>
        </div>

        {/* Executive Summary Narrative */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800 text-slate-200 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 shadow-inner">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1.5">
            <Bot className="w-4 h-4 text-indigo-400" />
            <span>AI 財務長/投資顧問 核心結論總評</span>
          </div>
          <p className="font-sans text-slate-300 leading-relaxed">
            {isInvestor
              ? `【價值投資視角總評】${activeCompany.name} 在 ${latestPeriod.period} 展現出「${r.economicMoat === 'wide' ? '寬廣經濟護城河 (Wide Moat)' : r.economicMoat === 'narrow' ? '中度競爭壁壘' : '一般競爭結構'}」，營業毛利率 ${r.grossMargin}% 展現良好定價能力。獲利含金量達 ${r.ocfToNetIncome}%（真實現金流落袋扎實），自由現金流為 NT$ ${(r.freeCashFlow / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })} 百萬元，Altman Z 破產防禦分數錄得 ${r.altmanZScore} 分（處於 ${r.altmanZZone === 'safe' ? '安全堡壘區' : '穩定區'}），整體具備高度基本面防禦韌性。`
              : aiReport.executiveSummary}
          </p>
        </div>

        {/* Strengths & Weaknesses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
          
          {/* Strengths / Bull Points */}
          <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-emerald-950/20 border border-emerald-900/30">
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2.5 sm:mb-3">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{isInvestor ? '🟢 多方看好理由 (Bull Case Thesis)' : '核心財務優勢與經營亮點'}</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {isInvestor ? (
                <>
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span><strong>卓越資本回報力：</strong>ROE 達 {r.roe}%，每股盈餘 EPS 達 NT$ {r.eps}，展現長期複利滾動潛力。</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span><strong>真金白銀獲利：</strong>獲利含金量 {r.ocfToNetIncome}%（&gt;100%），營業現金流遠高於帳面淨利，盈餘品質極佳。</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span><strong>安全堡壘防禦：</strong>Altman Z-Score {r.altmanZScore} 分，破產風險極低，具備穿越景氣週期的抗風險底氣。</span>
                  </li>
                </>
              ) : (
                aiReport.strengths.map((st, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span>{st}</span>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Risks / Bear Points */}
          <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-amber-950/20 border border-amber-900/30">
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2.5 sm:mb-3">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{isInvestor ? '🔴 空方隱憂與風險提示 (Bear Case Risks)' : '潛在風險警訊與改善空間'}</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {isInvestor ? (
                <>
                  <li className="flex items-start space-x-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span><strong>資本支出折舊壓力：</strong>本期資本支出 NT$ ${(latestPeriod.capitalExpenditures / 1000).toLocaleString()} 百萬元，需追蹤未來新產能投產後的毛利支撐力。</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span><strong>同業競爭與毛利防禦：</strong>面對全球供應鏈景氣波動，需嚴密防範毛利率是否出現逐季下滑跡象。</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span><strong>估值防禦與市場預期：</strong>若市場給予過高評價，需確保營收成長率能如期兌現以支撐本益比。</span>
                  </li>
                </>
              ) : (
                aiReport.weaknessesAndRisks.map((wk, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>{wk}</span>
                  </li>
                ))
              )}
            </ul>
          </div>

        </div>

        {/* Detailed Assessment Subsections */}
        <div className="mt-4 sm:mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 pt-4 sm:pt-5 border-t border-slate-800">
          
          {/* Left Block */}
          <div className="bg-slate-950/50 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-800">
            <span className="text-xs font-semibold text-blue-300 flex items-center gap-1.5 mb-2">
              <RotateCcw className="w-3.5 h-3.5 flex-shrink-0" />
              {isInvestor ? '經濟護城河與定價壁壘評級' : '應收帳款與存貨週轉評估'}
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isInvestor
                ? `毛利率達 ${r.grossMargin}%，代表企業對下游客戶具備堅實的定價自主權，技術或品牌護城河深度評定為「${r.economicMoat === 'wide' ? '寬廣護城河' : '中度護城河'}」，具備長期抗通膨能力。`
                : aiReport.turnoverAnalysis.arAssessment}
            </p>
          </div>

          {/* Right Block */}
          <div className="bg-slate-950/50 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-800">
            <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5 mb-2">
              <TrendingUp className="w-3.5 h-3.5 flex-shrink-0" />
              {isInvestor ? '獲利含金量與自由現金流造血' : '獲利能力與杜邦驅動拆解'}
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isInvestor
                ? `營業現金流對淨利比為 ${r.ocfToNetIncome}%，產生自由現金流 NT$ ${(r.freeCashFlow / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })} 百萬元，為未來股息發放、再投資研發提供了堅實無虞的現金後盾。`
                : aiReport.profitabilityAnalysis.dupontDrivers}
            </p>
          </div>

        </div>

        {/* Strategic Recommendations Matrix */}
        <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-slate-800">
          <div className="flex items-center space-x-2 text-xs font-bold text-indigo-300 uppercase tracking-wider mb-3">
            <Target className="w-4 h-4 flex-shrink-0" />
            <span>{isInvestor ? '價值投資人長期策略指引 (Investment Guidance)' : '高階管理階層決策行動方案建議'}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {isInvestor ? (
              <>
                <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-200">長線複利潛力</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">評級: 優質</span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed">
                      具備長期高 ROE ({r.roe}%) 與高獲利含金量，適合價值型投資者逢回檔分批建立長期核心持股。
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] text-emerald-300">
                    <span className="font-semibold text-slate-400">關鍵關注: </span>
                    追蹤每季毛利率與 EPS 成長性
                  </div>
                </div>

                <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-200">股息與自由現金保護</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-950/80 text-blue-300 border border-blue-800/60">評級: 充沛</span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed">
                      自由現金流充沛，具備持續穩定配發高額現金股息之強大造血底氣，下行防禦性高。
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] text-blue-300">
                    <span className="font-semibold text-slate-400">關鍵關注: </span>
                    檢驗資本支出對 FCF 之佔用比率
                  </div>
                </div>

                <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-200">破產防禦與安全邊際</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-800/60">評級: 堡壘級</span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed">
                      Altman Z-Score 達 {r.altmanZScore} 分，負債結構穩固，即使遭遇大環境逆風亦無財務危機隱憂。
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] text-purple-300">
                    <span className="font-semibold text-slate-400">關鍵關注: </span>
                    確保流動比率維持在 200% 以上
                  </div>
                </div>
              </>
            ) : (
              aiReport.strategicRecommendations.map((rec, i) => (
                <div key={i} className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-200">{rec.category}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        rec.priority === '高' ? 'bg-rose-950/80 text-rose-300 border border-rose-800/60' : 'bg-blue-950/80 text-blue-300 border border-blue-800/60'
                      }`}>
                        優先度: {rec.priority}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed">
                      {rec.action}
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] text-indigo-300">
                    <span className="font-semibold text-slate-400">預期成效: </span>
                    {rec.expectedImpact}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Floating Copilot Guide Notice */}
        <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <Bot className="w-4 h-4 text-indigo-400" />
            <span>
              {isInvestor
                ? '想了解更多估值與長期存股潛力？點擊右下角「AI 財務顧問」進行投資人問答 ➔'
                : '需要更多情境推演或細部諮詢？點擊右下角「AI 財務顧問」隨時開展 CFO 對話 ➔'}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">{isInvestor ? 'Investor Copilot' : 'CFO Copilot'}</span>
        </div>

      </div>
    </div>
  );
};

