import React, { useState } from 'react';
import { useFinancial } from '../../context/FinancialContext';
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
  const { aiReport, activeCompany, runAiDiagnostic, isLoadingAi, latestPeriod, activeCompanyPeriodsWithRatios } =
    useFinancial();

  const [question, setQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: `您好！我是您的 AI 財務戰略顧問。我已深度剖析「${activeCompany.name}」的歷年財報、應收帳款與存貨週轉效率及獲利能力。您可以隨時向我提出任何關於營運資本優化、成本定價策略或預測趨勢之問題！`,
    },
  ]);

  if (!aiReport) return null;

  const handleAskQuestion = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!question.trim() || isAsking) return;

    const userText = question.trim();
    setQuestion('');
    setChatHistory((prev) => [...prev, { role: 'user', text: userText }]);
    setIsAsking(true);

    try {
      const res = await fetch('/api/financial/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userText,
          companyName: activeCompany.name,
          contextData: {
            latestPeriod: latestPeriod?.period,
            revenue: latestPeriod?.revenue,
            ratios: latestPeriod?.ratios,
            aiReportSummary: aiReport.executiveSummary,
            strengths: aiReport.strengths,
            risks: aiReport.weaknessesAndRisks,
          },
        }),
      });

      const json = await res.json();
      setChatHistory((prev) => [
        ...prev,
        { role: 'assistant', text: json.answer || '目前 AI 諮詢暫未返回內容，請稍後重試。' },
      ]);
    } catch (err: any) {
      setChatHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `【分析提示】針對「${userText}」：根據當前財報數據，最新應收帳款週轉率為 ${latestPeriod?.ratios.arTurnover} 次（天數 ${latestPeriod?.ratios.dso} 天），存貨週轉率為 ${latestPeriod?.ratios.inventoryTurnover} 次（天數 ${latestPeriod?.ratios.dsi} 天），整體毛利率為 ${latestPeriod?.ratios.grossMargin}%。建議依據本期健康指標採取相應營運資金優化措施。`,
        },
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  const sampleQuestions = [
    '目前的應收帳款週轉天數是否需要調整信用政策？',
    '如何藉由縮短存貨週轉天數改善現金轉換循環 (CCC)？',
    '分析杜邦三因子中 ROE 的主要驅動力與弱點？',
    '預測次年度營收成長與獲利率面臨哪些主要風險？',
  ];

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* 1. Main Executive AI Diagnostic Header Card */}
      <div className="rounded-2xl sm:rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm p-4.5 sm:p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 flex-shrink-0">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2 flex-wrap">
                AI 財務健康深度診斷報告
                <span className="text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 font-mono">
                  Gemini 3.7 Flash 驅動
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                自動化多維度異常偵測、杜邦拆解、營運資金效率與決策指引
              </p>
            </div>
          </div>

          <button
            onClick={runAiDiagnostic}
            disabled={isLoadingAi}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl sm:rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/60 text-xs font-semibold transition self-start sm:self-auto disabled:opacity-50 min-h-[38px]"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isLoadingAi ? 'animate-spin text-amber-300' : 'text-blue-400'}`} />
            <span>{isLoadingAi ? '重新運算中...' : '重新分析'}</span>
          </button>
        </div>

        {/* Executive Summary Narrative */}
        <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-950/60 border border-slate-800 text-slate-200 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6">
          <p className="font-sans">{aiReport.executiveSummary}</p>
        </div>

        {/* Strengths & Weaknesses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
          
          {/* Strengths */}
          <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-emerald-950/20 border border-emerald-900/30">
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2.5 sm:mb-3">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>核心財務優勢與經營亮點</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {(aiReport.strengths && aiReport.strengths.length > 0) ? (
                aiReport.strengths.map((st, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span>{st}</span>
                  </li>
                ))
              ) : (
                <li className="text-slate-400 italic">綜合財務指標評級穩健，各維度均衡發展。</li>
              )}
            </ul>
          </div>

          {/* Risks & Weaknesses */}
          <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-amber-950/20 border border-amber-900/30">
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2.5 sm:mb-3">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>潛在風險警訊與改善空間</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {(aiReport.weaknessesAndRisks && aiReport.weaknessesAndRisks.length > 0) ? (
                aiReport.weaknessesAndRisks.map((wk, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>{wk}</span>
                  </li>
                ))
              ) : (
                <li className="text-slate-400 italic">各項指標皆在基準水準之上，建議持續關注總體經貿景氣與供應鏈交期變數。</li>
              )}
            </ul>
          </div>

        </div>

        {/* Detailed Assessment Subsections */}
        <div className="mt-4 sm:mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 pt-4 sm:pt-5 border-t border-slate-800">
          
          {/* Turnover Assessment */}
          <div className="bg-slate-950/50 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-800">
            <span className="text-xs font-semibold text-blue-300 flex items-center gap-1.5 mb-2">
              <RotateCcw className="w-3.5 h-3.5 flex-shrink-0" />
              應收帳款與存貨週轉評估
            </span>
            <p className="text-xs text-slate-300 leading-relaxed mb-2">
              {aiReport.turnoverAnalysis.arAssessment}
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              {aiReport.turnoverAnalysis.inventoryAssessment}
            </p>
          </div>

          {/* Profitability Assessment */}
          <div className="bg-slate-950/50 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-800">
            <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5 mb-2">
              <TrendingUp className="w-3.5 h-3.5 flex-shrink-0" />
              獲利能力與杜邦驅動拆解
            </span>
            <p className="text-xs text-slate-300 leading-relaxed mb-2">
              {aiReport.profitabilityAnalysis.marginAssessment}
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              {aiReport.profitabilityAnalysis.dupontDrivers}
            </p>
          </div>

        </div>

        {/* Strategic Recommendations Matrix */}
        <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-slate-800">
          <div className="flex items-center space-x-2 text-xs font-bold text-indigo-300 uppercase tracking-wider mb-3">
            <Target className="w-4 h-4 flex-shrink-0" />
            <span>高階管理階層決策行動方案建議</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {aiReport.strategicRecommendations.map((rec, i) => (
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
            ))}
          </div>
        </div>

      </div>

      {/* 2. Interactive AI Financial Advisor Copilot */}
      <div className="rounded-2xl sm:rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm p-4.5 sm:p-6 shadow-sm">
        <div className="flex items-center space-x-2.5 mb-3.5 sm:mb-4">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight">
              AI 財務顧問即時諮詢 (Financial Copilot)
            </h4>
            <p className="text-xs text-slate-400">
              針對當前公司數據進行深度提問、推演不同情境或索取客製化管理建議
            </p>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3.5 sm:mb-4">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuestion(q);
              }}
              className="text-xs bg-slate-800/70 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 sm:px-3 py-1.5 rounded-lg sm:rounded-xl border border-slate-700/50 transition text-left min-h-[32px]"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat History Box */}
        <div className="max-h-60 overflow-y-auto space-y-3 p-3.5 sm:p-4 bg-slate-950/70 rounded-xl sm:rounded-2xl border border-slate-800 mb-3 text-xs">
          {chatHistory.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start space-x-2 sm:space-x-2.5 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}
              <div
                className={`p-3 sm:p-3.5 rounded-2xl max-w-[88%] sm:max-w-[85%] leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isAsking && (
            <div className="flex items-center space-x-2 text-indigo-400 text-xs italic">
              <Sparkles className="w-3.5 h-3.5 animate-spin flex-shrink-0" />
              <span>AI 顧問正在精算財報數據並推演回答...</span>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleAskQuestion} className="flex items-center gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="請輸入財務分析問題（例：若存貨天數縮短 10 天，對現金流量有何影響？）"
            className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl sm:rounded-2xl px-3.5 sm:px-4 py-2.5 text-sm sm:text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[42px]"
          />
          <button
            type="submit"
            disabled={!question.trim() || isAsking}
            className="flex items-center space-x-1.5 px-4 sm:px-5 py-2.5 rounded-xl sm:rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition disabled:opacity-50 shadow-md shadow-blue-600/20 min-h-[42px] flex-shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">發送</span>
          </button>
        </form>

        {/* AI Disclaimer Footnote */}
        <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[10px] text-slate-500 pt-2 border-t border-slate-800/60">
          <span>※ AI 顧問分析與預測數值係供管理決策模擬參考，不構成實質投資或審計擔保。</span>
          <span className="text-slate-600">模型架構：多因子財務診斷引擎</span>
        </div>

      </div>
    </div>
  );
};
