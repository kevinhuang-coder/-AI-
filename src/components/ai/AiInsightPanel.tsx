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

  if (!latestPeriod) return null;

  // 當尚未執行 AI 診斷時，呈現精緻的「點擊啟動」引導卡片
  if (!aiReport) {
    return (
      <div className="rounded-2xl border border-slate-800/80 bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-emerald-950/20 p-4.5 sm:p-6 backdrop-blur-md shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
              <Sparkles className={`w-5 h-5 text-amber-300 ${isLoadingAi ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  AI 價值投資與基本面深度診斷
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-semibold">
                  Powered by Google Gemini 2.5 Flash
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                尚未執行分析。點擊右側按鈕，啟動大模型針對「{activeCompany.name}」進行經濟護城河、獲利現金含金量與 Altman Z 破產防禦之全面嚴謹診斷。
              </p>
              <div className="flex flex-wrap gap-2 mt-2 text-[11px] text-slate-400">
                <span className="px-2 py-0.5 rounded-md bg-slate-800/60 border border-slate-700/50">👑 護城河定價權</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-800/60 border border-slate-700/50">💎 獲利現金含金量</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-800/60 border border-slate-700/50">🏰 Altman Z 安全邊際</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-800/60 border border-slate-700/50">📈 多空投資論點</span>
              </div>
            </div>
          </div>

          <button
            onClick={runAiDiagnostic}
            disabled={isLoadingAi}
            className="flex items-center justify-center space-x-2 px-4.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-900/30 transition disabled:opacity-50 cursor-pointer flex-shrink-0 self-start md:self-center"
          >
            <Sparkles className={`w-4 h-4 ${isLoadingAi ? 'animate-spin' : 'text-amber-300'}`} />
            <span>{isLoadingAi ? 'AI 正在精算診斷中...' : '✨ 立即啟動 AI 深度診斷'}</span>
          </button>
        </div>
      </div>
    );
  }

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
                  AI 價值投資與基本面深度診斷報告
                </h3>
                <span className="text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  Powered by Google Gemini 2.5 Flash
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
                結合 Google Gemini 2.5 Flash 與專業財務分析演算法，深度拆解經濟護城河、核心獲利含金量與 Altman Z 破產防禦
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
            {isInvestor ? (
              latestPeriod.netIncome < 0 ? (
                `【價值投資視角總評】${activeCompany.name} 在 ${latestPeriod.period} 處於「營運虧損與基本面承壓期」，稅後淨損達 NT$ ${(Math.abs(latestPeriod.netIncome) / 1000).toLocaleString()} 百萬元（ROE 錄得 ${r.roe}%，每股虧損 NT$ ${r.eps}）。雖然營業毛利率錄得 ${r.grossMargin}%，但嚴謹自由現金流為實質赤字 NT$ ${(r.rigorousFcf / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })} 百萬元，且 Altman Z 破產防禦分數僅 ${r.altmanZScore} 分（落入 ${r.altmanZZone === 'distress' ? '財務困境警戒區' : '灰色考驗區'}），整體缺乏價值投資安全邊際，應嚴密防範營運失血與流動性風險。`
              ) : r.economicMoat === 'wide' ? (
                `【價值投資視角總評】${activeCompany.name} 在 ${latestPeriod.period} 展現出「寬廣經濟護城河 (Wide Moat)」，營業毛利率 ${r.grossMargin}% 與 ROE ${r.roe}% 展現出強大的定價自主權與長期資本複利潛力。核心本業現金轉換率達 ${r.coreCashConversionRatio}%，創造嚴謹自由現金流 NT$ ${(r.rigorousFcf / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })} 百萬元，Altman Z 錄得 ${r.altmanZScore} 分（處於 安全堡壘區），具備極高基本面安全邊際。`
              ) : (
                `【價值投資視角總評】${activeCompany.name} 在 ${latestPeriod.period} 展現出「${r.economicMoat === 'narrow' ? '中度競爭壁壘' : '一般競爭結構'}」，營業毛利率 ${r.grossMargin}%，ROE 錄得 ${r.roe}%。核心本業現金轉換率達 ${r.coreCashConversionRatio}%，自由現金流為 NT$ ${(r.rigorousFcf / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })} 百萬元，Altman Z 破產防禦分數為 ${r.altmanZScore} 分（處於 ${r.altmanZZone === 'safe' ? '安全堡壘區' : r.altmanZZone === 'grey' ? '灰色過渡區' : '警戒區'}）。`
              )
            ) : (
              aiReport.executiveSummary
            )}
          </p>
        </div>

        {/* Strengths & Weaknesses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
          
          {/* Strengths / Bull Points */}
          <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-emerald-950/20 border border-emerald-900/30">
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2.5 sm:mb-3">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{isInvestor ? (latestPeriod.netIncome < 0 ? '🟢 潛在轉機契機與防禦亮點' : '🟢 多方看好理由 (Bull Case Thesis)') : '核心財務優勢與經營亮點'}</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {isInvestor ? (
                latestPeriod.netIncome < 0 ? (
                  <>
                    <li className="flex items-start space-x-2">
                      <span className="text-emerald-400 mt-0.5">•</span>
                      <span>
                        <strong>日常本業現金流入：</strong>
                        {latestPeriod.operatingCashFlow >= 0
                          ? `本期營業活動現金流仍錄得 NT$ ${(latestPeriod.operatingCashFlow / 1000).toLocaleString()} 百萬元，日常營運未全面斷流。`
                          : `日常營運現金目前呈流出狀態，需密切關注流動性融資支撐。`}
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-emerald-400 mt-0.5">•</span>
                      <span>
                        <strong>基礎產品銷貨毛利：</strong>營業毛利率維持在 {r.grossMargin}%，仍具備基礎銷貨毛利空間。
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-emerald-400 mt-0.5">•</span>
                      <span>
                        <strong>轉型重整契機：</strong>若能加速處分虧損事業、優化費用結構與倉儲物流，未來具備潛在轉虧為盈之轉機題材。
                      </span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-start space-x-2">
                      <span className="text-emerald-400 mt-0.5">•</span>
                      <span><strong>卓越資本回報力：</strong>ROE 達 {r.roe}%，每股盈餘 EPS 達 NT$ {r.eps}，展現長期複利滾動潛力。</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-emerald-400 mt-0.5">•</span>
                      <span><strong>真金白銀本業造血：</strong>核心現金轉換率 {r.coreCashConversionRatio}%，營業現金流遠高於帳面利潤，盈餘品質極佳。</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-emerald-400 mt-0.5">•</span>
                      <span><strong>安全堡壘防禦：</strong>Altman Z-Score {r.altmanZScore} 分，純計息負債比僅 {r.interestBearingDebtRatio}%，具備穿越景氣週期的抗風險底氣。</span>
                    </li>
                  </>
                )
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
              <span>{isInvestor ? '🔴 空方隱憂與風險地雷提示 (Bear Case Risks)' : '潛在風險警訊與改善空間'}</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {isInvestor ? (
                latestPeriod.netIncome < 0 ? (
                  <>
                    <li className="flex items-start space-x-2">
                      <span className="text-amber-400 mt-0.5">•</span>
                      <span><strong>實質虧損侵蝕淨值：</strong>稅後淨損達 NT$ ${(Math.abs(latestPeriod.netIncome) / 1000).toLocaleString()} 百萬元（EPS NT$ ${r.eps}），股東權益持續遭到實質減損。</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-amber-400 mt-0.5">•</span>
                      <span><strong>自由現金流失血赤字：</strong>嚴謹自由現金流為淨流出 NT$ ${(Math.abs(r.rigorousFcf) / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })} 百萬元，現金失血且不具備配發股息能力。</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-amber-400 mt-0.5">•</span>
                      <span><strong>破產防禦落入警戒區：</strong>Altman Z 分數僅 {r.altmanZScore} 分（處於困境警戒區），財務結構脆弱，需高度防範債務展延與流動性風險。</span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-start space-x-2">
                      <span className="text-amber-400 mt-0.5">•</span>
                      <span><strong>資本支出折舊壓力：</strong>本期資本支出 NT$ ${(latestPeriod.capitalExpenditures / 1000).toLocaleString()} 百萬元，需追蹤未來新產能投產後的毛利支撐力。</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-amber-400 mt-0.5">•</span>
                      <span><strong>同業競爭與毛利防禦：</strong>面對產業價格戰，需嚴密防範毛利率是否出現逐季下滑跡象。</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-amber-400 mt-0.5">•</span>
                      <span><strong>估值防禦與市場預期：</strong>若市場給予高評價，需確保營收成長率能如期兌現以支撐估值倍數。</span>
                    </li>
                  </>
                )
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
                ? (latestPeriod.netIncome < 0
                    ? `目前本業呈虧損狀態，毛利率為 ${r.grossMargin}%，尚未形成堅實之長期經濟護城河，面對激烈市場競爭缺乏定價保護。`
                    : `毛利率達 ${r.grossMargin}%，技術或品牌護城河深度評定為「${r.economicMoat === 'wide' ? '寬廣護城河' : r.economicMoat === 'narrow' ? '中度護城河' : '一般結構'}」，具備相應定價能力。`)
                : aiReport.turnoverAnalysis.arAssessment}
            </p>
          </div>

          {/* Right Block */}
          <div className="bg-slate-950/50 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-800">
            <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5 mb-2">
              <TrendingUp className="w-3.5 h-3.5 flex-shrink-0" />
              {isInvestor ? '核心現金轉換與自由現金流造血' : '獲利能力與杜邦驅動拆解'}
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isInvestor
                ? (r.rigorousFcf < 0
                    ? `嚴謹自由現金流為赤字 NT$ ${(r.rigorousFcf / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })} 百萬元，本期未能產生實質自由現金流，需提防後續營運資金調度壓力。`
                    : `核心本業現金轉換率為 ${r.coreCashConversionRatio}%，產生自由現金流 NT$ ${(r.rigorousFcf / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })} 百萬元，為未來營運再投資提供現金後盾。`)
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
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        latestPeriod.netIncome < 0
                          ? 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
                          : r.roe >= 15
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                          : 'bg-blue-950/80 text-blue-300 border border-blue-800/60'
                      }`}>
                        {latestPeriod.netIncome < 0 ? '評級: 承壓虧損' : r.roe >= 15 ? '評級: 優質複利' : '評級: 穩健平平'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed">
                      {latestPeriod.netIncome < 0
                        ? `當前 ROE 為負值 (${r.roe}%)，本業實質虧損，完全不具備長期複利滾動條件，價值投資人應避免盲目抄底，嚴防價值陷阱。`
                        : `具備長期高 ROE (${r.roe}%) 與良好獲利能力，適合價值型投資者逢回檔分批評估長期持有價值。`}
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] text-emerald-300">
                    <span className="font-semibold text-slate-400">關鍵關注: </span>
                    {latestPeriod.netIncome < 0 ? '追蹤何時由虧轉盈及毛利回升' : '追蹤每季毛利率與 EPS 成長性'}
                  </div>
                </div>

                <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-200">股息與自由現金保護</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        r.rigorousFcf <= 0
                          ? 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
                          : r.rigorousFcf > 0 && r.coreCashConversionRatio >= 90
                          ? 'bg-blue-950/80 text-blue-300 border border-blue-800/60'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}>
                        {r.rigorousFcf <= 0 ? '評級: 失血吃緊' : r.rigorousFcf > 0 && r.coreCashConversionRatio >= 90 ? '評級: 充沛造血' : '評級: 尚可維持'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed">
                      {r.rigorousFcf <= 0
                        ? `自由現金流為淨流出 (NT$ ${(r.rigorousFcf / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })}M)，現金處於失血狀態，短期內不具備股息發放底氣。`
                        : `自由現金流充沛，具備持續穩定配發現金股息之造血底氣，下行防禦性高。`}
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] text-blue-300">
                    <span className="font-semibold text-slate-400">關鍵關注: </span>
                    {r.rigorousFcf <= 0 ? '防範再籌資稀釋與現金存量消耗' : '檢驗資本支出對 FCF 之佔用比率'}
                  </div>
                </div>

                <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-200">破產防禦與安全邊際</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        r.altmanZZone === 'safe'
                          ? 'bg-purple-950/80 text-purple-300 border border-purple-800/60'
                          : r.altmanZZone === 'grey'
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                          : 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
                      }`}>
                        {r.altmanZZone === 'safe' ? '評級: 堡壘級' : r.altmanZZone === 'grey' ? '評級: 觀察區' : '評級: 困境警戒'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed">
                      {r.altmanZZone === 'safe'
                        ? `Altman Z-Score 達 ${r.altmanZScore} 分，負債結構穩固，即使遭遇大環境逆風亦無財務危機隱憂。`
                        : r.altmanZZone === 'grey'
                        ? `Altman Z 分數為 ${r.altmanZScore} 分（處於灰色過渡區），需密切留意營運資金週轉與短期借款展延能力。`
                        : `Altman Z-Score 僅 ${r.altmanZScore} 分（落入破產困境警戒區），缺乏安全邊際，需高度防範債務違約風險。`}
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] text-purple-300">
                    <span className="font-semibold text-slate-400">關鍵關注: </span>
                    {r.altmanZZone === 'distress' ? '嚴密防範流動性危機與信用風險' : '確保流動比率維持在 180% 以上'}
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

