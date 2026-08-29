import React from 'react';
import { BrandLogo } from '../brand/BrandLogo';
import {
  ExternalLink,
  BookOpen,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Building2,
  Award,
  Globe,
} from 'lucide-react';

export const BrandFooter: React.FC = () => {
  return (
    <footer className="mt-12 border-t border-slate-800/80 bg-slate-950/70 pt-10 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Main Grid: Author Profile & Blog Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Brand Identity & Mission (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center space-x-3">
              <BrandLogo size={42} />
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <span>凱文黃的價值投資智策</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/70 text-emerald-300 border border-emerald-500/30">
                    個人研究品牌
                  </span>
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  《凱文黃的知識天地》專屬 AI 財報審計與價值投資工具
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              融合<strong>「四大會計師事務所審計查核實務思維」</strong>與<strong>「葛拉漢與巴菲特價值投資哲學」</strong>，穿透財報表面數字，深度驗證經濟護城河、核心獲利含金量與嚴謹自由現金流。
            </p>

            {/* Author Badges */}
            <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-medium">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                彰師大會計碩士
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-emerald-300">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                會計師高考及格
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-blue-300">
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                四大事務所審計實務
              </span>
            </div>
          </div>

          {/* Middle: Blog Quick Navigation (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>《凱文黃的知識天地》部落格專欄</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://kevin-huang-cpa.vercel.app/categories/accounting"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-slate-400 hover:text-cyan-300 transition group"
                >
                  <span>📊 會計審計：IFRS、查核準則與 KAM 拆解</span>
                  <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-cyan-400 transition" />
                </a>
              </li>
              <li>
                <a
                  href="https://kevin-huang-cpa.vercel.app/categories/ai-finance"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-slate-400 hover:text-cyan-300 transition group"
                >
                  <span>🤖 AI × 財稅：智慧賦能與跨界實戰應用</span>
                  <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-cyan-400 transition" />
                </a>
              </li>
              <li>
                <a
                  href="https://kevin-huang-cpa.vercel.app/categories/tax"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-slate-400 hover:text-cyan-300 transition group"
                >
                  <span>💼 稅法實務：營所稅、房地合一與租稅規劃</span>
                  <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-cyan-400 transition" />
                </a>
              </li>
              <li>
                <a
                  href="https://kevin-huang-cpa.vercel.app/posts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-slate-400 hover:text-cyan-300 transition group"
                >
                  <span>📚 閱讀所有文章專題</span>
                  <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-cyan-400 transition" />
                </a>
              </li>
            </ul>
          </div>

          {/* Right: Direct Blog Portal Button (3 cols) */}
          <div className="lg:col-span-3 space-y-3 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>訪問個人官方網站</span>
              </h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                更多關於 AI、會計審計、稅法解析與學習工作法的深度原創文章：
              </p>
            </div>

            <a
              href="https://kevin-huang-cpa.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-900/30 transition-all cursor-pointer group"
            >
              <span>進入「凱文黃的知識天地」</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

        </div>

        {/* Legal & Educational Disclaimer */}
        <div className="pt-6 border-t border-slate-800/80 text-[11px] text-slate-500 space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <strong className="text-slate-400">免責聲明與使用須知：</strong>
          </div>
          <p className="leading-relaxed">
            本工具為《凱文黃的知識天地》個人原創之財報分析與價值投資研究輔助系統，旨在推廣以會計師審計查核邏輯進行企業基本面分析。筆者現為會計師高考及格、任職於四大事務所，<strong>本系統非以執業會計師名義提供審計簽證、稅務確信、法律意見或特定個股之投資買賣建議</strong>。使用者在進行任何重大商業投資決策前，應審慎獨立評估市場風險。
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-slate-400">
            <span>© 2026 凱文黃的知識天地 (Kevin Huang). All Rights Reserved.</span>
            <span className="font-mono text-[10px]">Version 2.5 • Powered by Vite & React</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
