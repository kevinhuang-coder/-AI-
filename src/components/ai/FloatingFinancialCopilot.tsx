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
  ShieldCheck,
  Coins,
  TrendingUp,
  Activity,
  Copy,
  Check,
  ChevronRight,
} from 'lucide-react';

interface QuestionCategory {
  id: 'moat' | 'cashflow' | 'dupont' | 'health';
  label: string;
  icon: React.ReactNode;
  questions: string[];
}

export const FloatingFinancialCopilot: React.FC = () => {
  const { activeCompany, latestPeriod, aiReport } = useFinancial();

  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<'moat' | 'cashflow' | 'dupont' | 'health'>('moat');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; text: string; time: string }>>([
    {
      role: 'assistant',
      text: `您好！我是「AI 財務分析助手（Financial Copilot）」👋\n我已載入「${activeCompany.name}」連續 5 年官方審定年報四大表。\n\n您可以點擊下方的【快捷分析問題】，或直接向我詢問關於護城河定價權、現金流含金量、杜邦拆解或營運週轉的任何問題！`,
      time: '剛剛',
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

  const categories: QuestionCategory[] = [
    {
      id: 'moat',
      label: '護城河與價值',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />,
      questions: [
        '這家公司具備長期的經濟護城河 (Moat) 與定價壁壘嗎？',
        '檢驗本期獲利含金量 (OCF/Net) 是否為真金白銀？',
        '站在價值投資角度，多空投資論點 (Bull vs. Bear) 如何客觀解讀？',
        '評估 Altman Z-Score 破產防禦分數與財務安全邊際？',
      ],
    },
    {
      id: 'cashflow',
      label: '現金流與週轉',
      icon: <Coins className="w-3.5 h-3.5 text-emerald-400" />,
      questions: [
        '嚴謹自由現金流 (Rigorous FCF) 與資本支出合理性評估？',
        '應收帳款天數 (DSO) 與存貨天數 (DSI) 是否有積壓風險？',
        '若現金轉換循環 (CCC) 縮短 5 天，能釋放多少營運資金？',
      ],
    },
    {
      id: 'dupont',
      label: '杜邦與獲利成長',
      icon: <TrendingUp className="w-3.5 h-3.5 text-blue-400" />,
      questions: [
        '杜邦三因子拆解：ROE 主要是靠淨利率、週轉率還是槓桿驅動？',
        '純計息負債比與利息保障倍數是否處於安全警戒線？',
        '次年度營收成長與毛利率面臨哪些主要下行風險情境？',
      ],
    },
    {
      id: 'health',
      label: '快速財務體檢',
      icon: <Activity className="w-3.5 h-3.5 text-indigo-400" />,
      questions: [
        '請對這家公司進行 30 秒核心財務四大表健康總體檢',
        '這家公司近 5 年是否有持續成長的長期複利潛能？',
      ],
    },
  ];

  const handleAskQuestion = async (e?: React.FormEvent, directText?: string) => {
    if (e) e.preventDefault();
    const query = (directText || question).trim();
    if (!query || isAsking) return;

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    setQuestion('');
    setChatHistory((prev) => [...prev, { role: 'user', text: query, time: timeStr }]);
    setIsAsking(true);

    try {
      let answer = '';
      // 1. 嘗試後端 Serverless API
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
        console.warn('Remote AI Chat API unavailable or timed out, checking direct Gemini:', apiErr);
      }

      // 2. 若後端 API 未回傳，嘗試直連 Gemini
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

      // 3. 本地精密財務推演引擎
      if (!answer) {
        answer = generateFinancialCopilotResponse(query, activeCompany.name, latestPeriod, aiReport);
      }

      setChatHistory((prev) => [
        ...prev,
        { role: 'assistant', text: answer, time: timeStr },
      ]);
    } catch (err: any) {
      const fallbackAnswer = generateFinancialCopilotResponse(query, activeCompany.name, latestPeriod, aiReport);
      setChatHistory((prev) => [
        ...prev,
        { role: 'assistant', text: fallbackAnswer, time: timeStr },
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  const handleClearHistory = () => {
    setChatHistory([
      {
        role: 'assistant',
        text: `已重置對話記錄。我是「AI 財務分析助手」，隨時準備好為「${activeCompany.name}」進行深度財務分析與情境推演！`,
        time: '剛剛',
      },
    ]);
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const currentQuestions = categories.find((c) => c.id === selectedCategoryTab)?.questions || [];

  return (
    <>
      {/* 1. Floating Trigger Button (FAB) */}
      <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          title="開啟 AI 財務分析助手 (Financial Copilot)"
          className={`group flex items-center space-x-2.5 px-4 py-3 rounded-full shadow-2xl transition-all duration-300 cursor-pointer active:scale-95 border ${
            isOpen
              ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-750'
              : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white hover:shadow-emerald-500/30 hover:scale-105 border-emerald-400/40'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <Bot className="w-5 h-5" />
            {!isOpen && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-900 rounded-full animate-pulse"></span>
            )}
          </div>
          <span className="text-xs sm:text-sm font-bold tracking-tight">
            {isOpen ? '收起助手' : 'AI 財務分析助手'}
          </span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300 hidden sm:inline" />
        </button>
      </div>

      {/* 2. Floating Pop-up Chat Window */}
      {isOpen && (
        <div className="fixed bottom-36 sm:bottom-20 right-3 sm:right-6 w-[calc(100vw-24px)] sm:w-[480px] max-h-[76vh] sm:max-h-[660px] h-[600px] bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden animate-fade-in text-xs font-sans">
          
          {/* Top Window Header */}
          <div className="px-4 sm:px-5 py-3.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight flex items-center gap-1.5 truncate">
                  <span>AI 財務分析助手</span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-mono border border-emerald-500/30 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                    Gemini 2.5 Flash
                  </span>
                </h4>
                <p className="text-[10px] sm:text-[11px] text-slate-400 truncate flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-slate-500 flex-shrink-0" />
                  <span className="truncate text-slate-300 font-medium">{activeCompany.name}</span>
                  {latestPeriod && <span className="text-slate-500">• {latestPeriod.period}</span>}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1 flex-shrink-0">
              <button
                onClick={handleClearHistory}
                title="清空對話記錄"
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="關閉視窗"
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Categorized Preset Question Selector */}
          <div className="bg-slate-950/70 border-b border-slate-800/80 flex-shrink-0">
            {/* Category Tabs */}
            <div className="flex items-center space-x-1 px-3 pt-2 pb-1.5 overflow-x-auto scrollbar-none">
              {categories.map((cat) => {
                const isActive = selectedCategoryTab === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryTab(cat.id)}
                    className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition cursor-pointer ${
                      isActive
                        ? 'bg-slate-800 text-white border border-slate-700 shadow-xs'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`}
                  >
                    {cat.icon}
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Questions List Carousel / Grid */}
            <div className="px-3 pb-2 pt-1 overflow-x-auto scrollbar-none flex gap-1.5">
              {currentQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAskQuestion(undefined, q)}
                  disabled={isAsking}
                  className="text-[11px] bg-slate-900/90 hover:bg-emerald-950/40 text-slate-300 hover:text-emerald-300 px-2.5 py-1 rounded-xl border border-slate-800 hover:border-emerald-500/30 transition whitespace-nowrap flex-shrink-0 flex items-center gap-1 cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  <span>{q}</span>
                  <ChevronRight className="w-3 h-3 text-slate-500 opacity-60" />
                </button>
              ))}
            </div>
          </div>

          {/* Chat Message Scroll Area */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3.5 bg-slate-950/40 scrollbar-thin">
            {chatHistory.map((msg, i) => (
              <div
                key={i}
                className={`flex items-start space-x-2 ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white flex-shrink-0 mt-0.5 shadow-sm">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                
                <div className="max-w-[90%] space-y-1">
                  <div
                    className={`p-3 sm:p-3.5 rounded-2xl leading-relaxed whitespace-pre-line text-xs relative group ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none shadow-md shadow-emerald-900/20 font-medium'
                        : 'bg-slate-900 text-slate-100 border border-slate-800/90 rounded-tl-none shadow-sm'
                    }`}
                  >
                    {msg.text}

                    {/* Copy button for Assistant messages */}
                    {msg.role === 'assistant' && (
                      <button
                        onClick={() => handleCopy(msg.text, i)}
                        title="複製回答"
                        className="absolute top-2 right-2 p-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition opacity-0 group-hover:opacity-100 cursor-pointer"
                      >
                        {copiedIndex === i ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    )}
                  </div>
                  
                  <div className={`text-[9px] text-slate-500 px-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}

            {isAsking && (
              <div className="flex items-center space-x-2 text-emerald-400 text-xs italic pl-8 py-1">
                <Sparkles className="w-3.5 h-3.5 animate-spin flex-shrink-0 text-amber-300" />
                <span>AI 助手正在計算官方財報數據並推演分析中...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-slate-950/95 border-t border-slate-800 flex-shrink-0">
            <form onSubmit={handleAskQuestion} className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="輸入問題（例：若毛利率提升 2%，對 ROE 影響多少？）"
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm sm:text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[38px]"
              />
              <button
                type="submit"
                disabled={!question.trim() || isAsking}
                className="flex items-center justify-center space-x-1 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition disabled:opacity-50 shadow-md shadow-emerald-900/30 min-h-[38px] cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">發送</span>
              </button>
            </form>
            <div className="mt-1.5 flex items-center justify-between text-[9px] text-slate-500">
              <span>※ AI 助手分析僅供研究與決策輔助參考，不構成投資或審計意見。</span>
              <span className="text-slate-600">Financial Inference Engine</span>
            </div>
          </div>

        </div>
      )}
    </>
  );
};
