import React, { useState, useRef, useEffect } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { generateFinancialCopilotResponse } from '../../utils/financialCalculations';
import { directAskGeminiCopilot } from '../../utils/geminiClient';
import {
  Bot,
  Sparkles,
  X,
  Send,
  RotateCcw,
  Building2,
} from 'lucide-react';

export const FloatingFinancialCopilot: React.FC = () => {
  const { activeCompany, latestPeriod, aiReport, viewMode } = useFinancial();

  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: `您好！我是您的專屬「AI 數位財務長與價值投資顧問（Financial Copilot）」。\n我已深入掌握「${activeCompany.name}」的財務報表、經濟護城河、獲利含金量、週轉效率及破產防禦指標。\n\n您可以隨時點選下方快捷問題，或向我提出任何關於營運資本優化、長期存股價值、安全邊際或未來趨勢之情境推演！`,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen, chatHistory]);

  const handleAskQuestion = async (e?: React.FormEvent, directText?: string) => {
    if (e) e.preventDefault();
    const query = (directText || question).trim();
    if (!query || isAsking) return;

    setQuestion('');
    setChatHistory((prev) => [...prev, { role: 'user', text: query }]);
    setIsAsking(true);

    try {
      let answer = '';
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const res = await fetch('/api/financial/ai-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            question: query,
            companyName: activeCompany.name,
            contextData: {
              latestPeriod: latestPeriod?.period,
              revenue: latestPeriod?.revenue,
              ratios: latestPeriod?.ratios,
              aiReportSummary: aiReport?.executiveSummary,
              strengths: aiReport?.strengths,
              risks: aiReport?.weaknessesAndRisks,
            },
          }),
        });

        clearTimeout(timeoutId);

        if (res.ok) {
          const json = await res.json();
          if (json.answer && typeof json.answer === 'string' && json.answer.trim().length > 10) {
            answer = json.answer.trim();
          }
        }
      } catch (apiErr) {
        console.warn('Remote AI Chat API unavailable or timed out, checking browser direct Gemini:', apiErr);
      }

      // 若後端 API 未回傳，嘗試以瀏覽器直連 Gemini
      if (!answer) {
        try {
          const directAns = await directAskGeminiCopilot(query, activeCompany.name, {
            latestPeriod: latestPeriod?.period,
            revenue: latestPeriod?.revenue,
            ratios: latestPeriod?.ratios,
            aiReportSummary: aiReport?.executiveSummary,
            strengths: aiReport?.strengths,
            risks: aiReport?.weaknessesAndRisks,
          });
          if (directAns) answer = directAns;
        } catch (directErr) {
          console.warn('Browser direct Gemini also skipped:', directErr);
        }
      }

      // 若皆未配置 Key，調用內建頂級審計財務推演引擎
      if (!answer) {
        answer = generateFinancialCopilotResponse(query, activeCompany.name, latestPeriod, aiReport);
      }

      setChatHistory((prev) => [
        ...prev,
        { role: 'assistant', text: answer },
      ]);
    } catch (err: any) {
      const fallbackAnswer = generateFinancialCopilotResponse(query, activeCompany.name, latestPeriod, aiReport);
      setChatHistory((prev) => [
        ...prev,
        { role: 'assistant', text: fallbackAnswer },
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  const handleClearHistory = () => {
    setChatHistory([
      {
        role: 'assistant',
        text: `已重置對話記錄。我是您的 AI 財務顧問，隨時準備好為「${activeCompany.name}」進行深度財務診斷、護城河評估與策略推演！`,
      },
    ]);
  };

  const sampleQuestions = viewMode === 'investor'
    ? [
        '這家公司具備長期的經濟護城河 (Moat) 與定價壁壘嗎？',
        '檢驗本期的獲利含金量 (OCF/Net) 是否為真金白銀？',
        '評估 Altman Z-Score 破產防禦分數與下行安全邊際？',
        '站在價值投資角度，多空投資論點 (Bull vs Bear) 如何解讀？',
      ]
    : [
        '目前的應收帳款週轉天數是否需要調整信用政策？',
        '如何藉由縮短存貨週轉天數改善現金轉換循環 (CCC)？',
        '分析杜邦三因子中 ROE 的主要驅動力與弱點？',
        '預測次年度營收成長與獲利率面臨哪些主要風險？',
      ];


  return (
    <>
      {/* 1. Floating Trigger Button (FAB) */}
      <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          title="開啟 AI 財務顧問即時諮詢 (Financial Copilot)"
          className={`group flex items-center space-x-2 px-4 py-3 rounded-full shadow-2xl transition-all duration-300 cursor-pointer active:scale-95 ${
            isOpen
              ? 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700'
              : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white hover:shadow-indigo-500/30 hover:scale-105 border border-indigo-400/30'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <Bot className="w-5 h-5" />
            {!isOpen && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-900 rounded-full animate-pulse"></span>
            )}
          </div>
          <span className="text-xs sm:text-sm font-bold tracking-tight">
            {isOpen ? '收起 AI 顧問' : 'AI 財務顧問'}
          </span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300 hidden sm:inline" />
        </button>
      </div>

      {/* 2. Floating Pop-up Chat Window */}
      {isOpen && (
        <div className="fixed bottom-36 sm:bottom-20 right-3 sm:right-6 w-[calc(100vw-24px)] sm:w-[460px] max-h-[72vh] sm:max-h-[640px] h-[580px] bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden animate-fade-in text-xs font-sans">
          
          {/* Top Window Header */}
          <div className="px-4 sm:px-5 py-3.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight flex items-center gap-1.5 truncate">
                  <span>AI 財務戰略顧問</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-300 font-mono">
                    Copilot
                  </span>
                </h4>
                <p className="text-[10px] sm:text-[11px] text-slate-400 truncate flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-slate-500 flex-shrink-0" />
                  <span className="truncate">{activeCompany.name}</span>
                  {latestPeriod && <span className="text-slate-500">• {latestPeriod.period}</span>}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1 flex-shrink-0">
              <button
                onClick={handleClearHistory}
                title="清空對話記錄"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="關閉視窗"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Suggestion Chips Carousel */}
          <div className="px-3.5 py-2 bg-slate-950/50 border-b border-slate-800/60 overflow-x-auto scrollbar-none flex gap-1.5 flex-shrink-0">
            {sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleAskQuestion(undefined, q)}
                disabled={isAsking}
                className="text-[11px] bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-xl border border-slate-700/60 transition whitespace-nowrap flex-shrink-0 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                💬 {q}
              </button>
            ))}
          </div>

          {/* Chat Message Scroll Area */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3 bg-slate-950/30">
            {chatHistory.map((msg, i) => (
              <div
                key={i}
                className={`flex items-start space-x-2 ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white flex-shrink-0 mt-0.5 shadow-sm">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3 sm:p-3.5 rounded-2xl max-w-[90%] leading-relaxed whitespace-pre-line text-xs ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-600/20 font-medium'
                      : 'bg-slate-900 text-slate-100 border border-slate-800 rounded-tl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isAsking && (
              <div className="flex items-center space-x-2 text-indigo-400 text-xs italic pl-8">
                <Sparkles className="w-3.5 h-3.5 animate-spin flex-shrink-0" />
                <span>AI 顧問正在精算財報數據並推演回答...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-slate-950/90 border-t border-slate-800 flex-shrink-0">
            <form onSubmit={handleAskQuestion} className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="輸入問題（例：若應收天數縮短 5 天，釋放多少現金？）"
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm sm:text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[38px]"
              />
              <button
                type="submit"
                disabled={!question.trim() || isAsking}
                className="flex items-center justify-center space-x-1 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition disabled:opacity-50 shadow-md shadow-blue-600/20 min-h-[38px] cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">發送</span>
              </button>
            </form>
            <div className="mt-1.5 flex items-center justify-between text-[9px] text-slate-500">
              <span>※ AI 顧問分析係供管理決策參考，不構成法定審計擔保。</span>
              <span className="text-slate-600">CFO Inference Engine</span>
            </div>
          </div>

        </div>
      )}
    </>
  );
};
