import React, { useState, useEffect } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { BrandLogo } from '../brand/BrandLogo';
import {
  ShieldCheck,
  Sparkles,
  BarChart3,
  Award,
  GraduationCap,
  Building2,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  ArrowRight,
  X,
} from 'lucide-react';

const DISCLAIMER_STORAGE_KEY = 'value_decision_disclaimer_accepted_v1';

export const WelcomeDisclaimerModal: React.FC = () => {
  const { isDisclaimerOpen, setIsDisclaimerOpen } = useFinancial();
  const [rememberChoice, setRememberChoice] = useState(true);

  // 初次進站檢查是否已同意過免責聲明
  useEffect(() => {
    try {
      const hasAccepted = localStorage.getItem(DISCLAIMER_STORAGE_KEY);
      if (!hasAccepted) {
        setIsDisclaimerOpen(true);
      }
    } catch (e) {
      console.warn('Failed to access localStorage:', e);
      setIsDisclaimerOpen(true);
    }
  }, [setIsDisclaimerOpen]);

  const handleAccept = () => {
    if (rememberChoice) {
      try {
        localStorage.setItem(DISCLAIMER_STORAGE_KEY, 'true');
      } catch (e) {
        console.warn('Failed to save disclaimer acceptance:', e);
      }
    }
    setIsDisclaimerOpen(false);
  };

  if (!isDisclaimerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-xl overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900/95 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]">
        
        {/* Decorative Top Accent Light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-emerald-500/15 via-blue-500/10 to-transparent blur-2xl pointer-events-none"></div>

        {/* Header */}
        <div className="px-5 sm:px-7 pt-6 pb-4 border-b border-slate-800 flex items-start justify-between relative z-10">
          <div className="flex items-center space-x-3.5">
            <BrandLogo size={42} />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  價值決策 (Value Decision)
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold">
                  使用須知與免責聲明
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                《凱文黃的知識天地》專屬 AI 價值投資財報分析系統
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsDisclaimerOpen(false)}
            title="關閉"
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-5 text-xs text-slate-300 leading-relaxed scrollbar-thin">
          
          {/* Author Intro Banner */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2.5">
            <div className="flex items-center space-x-2 text-slate-200 font-semibold text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>筆者背景與品牌緣起：黃玉龍 (Kevin Huang)</span>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                彰師大會計碩士
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-emerald-300 font-medium">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                會計師高考及格
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                四大事務所審計實務
              </span>
            </div>
            <p className="text-slate-400 text-[11.5px] leading-relaxed pt-1">
              融合會計查核實務思維與巴菲特/葛拉漢價值投資哲學，協助投資人穿透財報表面數字，洞悉企業真實經濟體質與長期護城河。
            </p>
          </div>

          {/* Core System Highlights (3 Pillars) */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>系統 3 大核心理念與特色</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-1">
                <div className="font-bold text-emerald-300 flex items-center gap-1">
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>5年官方真實年報</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  嚴格限定連續 5 年官方審定純年度年報，杜絕單季雜訊與人工假數據。
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-1">
                <div className="font-bold text-blue-300 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>價值投資四大指標</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  經濟護城河、核心獲利含金量、嚴謹自由現金流與 Altman Z 破產防禦。
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-1">
                <div className="font-bold text-indigo-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Gemini 2.5 Flash</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  由使用者按需點擊觸發深度診斷與 Financial Copilot 智能多輪問答。
                </p>
              </div>
            </div>
          </div>

          {/* Legal Disclaimer Box */}
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>使用須知與法律免責聲明 (Legal Disclaimer)</span>
            </div>
            <ul className="space-y-1.5 text-[11.5px] text-slate-300 list-disc list-inside">
              <li>
                <strong>非執業審計簽證或法律意見：</strong>本系統為基本面分析研究輔助工具。筆者現為會計師高考及格、任職於四大事務所，<strong>本系統非以執業會計師名義提供法定財務簽證、稅務確信、法律意見或特定個股投資買賣建議</strong>。
              </li>
              <li>
                <strong>資料來源與審慎評估：</strong>報表數據彙整自公開發行公司官方公告，系統雖力求勾稽嚴謹，使用者在進行重大商業投資決策前，仍應參閱公開資訊觀測站最新公告並獨立評估市場風險。
              </li>
              <li>
                <strong>投資風險自負：</strong>歷史財務數據與 AI 推演僅供學術探討與研究參考，過去績效不代表未來獲利保證，投資人須自負盈虧。
              </li>
            </ul>
          </div>

          {/* Blog link portal */}
          <div className="flex items-center justify-between pt-1 text-[11.5px] text-slate-400">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>歡迎造訪筆者專欄文章：</span>
            </span>
            <a
              href="https://kevin-huang-cpa.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 font-medium hover:underline transition"
            >
              <span>進入「凱文黃的知識天地」</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-5 sm:px-7 py-4 bg-slate-950/80 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <label className="flex items-center space-x-2 text-xs text-slate-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberChoice}
              onChange={(e) => setRememberChoice(e.target.checked)}
              className="w-4 h-4 rounded-md border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900 cursor-pointer"
            />
            <span>記住我的同意紀錄，下次直接進入系統</span>
          </label>

          <button
            onClick={handleAccept}
            className="flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-900/40 transition cursor-pointer active:scale-95"
          >
            <span>我已詳閱並同意使用須知 • 開始體驗</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
