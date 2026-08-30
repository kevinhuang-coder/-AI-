import React from 'react';
import { useFinancial } from '../../context/FinancialContext';
import {
  TrendingUp,
  ShieldCheck,
  Building2,
  Calendar,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';

export const AnalyticsControlBar: React.FC = () => {
  const {
    activeCompany,
    latestPeriod,
    activeCompanyPeriodsWithRatios,
  } = useFinancial();

  const cleanCode = (activeCompany.code || '').replace(/[^0-9]/g, '');

  return (
    <div className="bg-slate-900/60 border border-slate-800/90 rounded-2xl sm:rounded-3xl p-3 sm:p-4 backdrop-blur-md shadow-sm relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        
        {/* Left Side: Dedicated Value Investing Mode Badge & Verification Status */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center space-x-2 bg-emerald-950/40 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-emerald-300 shadow-sm">
            <TrendingUp className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>價值投資與護城河深度分析視角</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900/70 text-emerald-200 font-mono border border-emerald-700/50 hidden md:inline">
              Graham & Buffett 哲學
            </span>
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-950/60 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>5年純年度官方年報</span>
            <span className="text-slate-500 font-mono text-[11px]">({activeCompanyPeriodsWithRatios.length} 期)</span>
          </div>

          {/* 🏛️ 官方會計師查核簽證金章 (Audit Provenance Badge) */}
          <div className="flex items-center space-x-1.5 bg-indigo-950/40 border border-indigo-500/30 px-3 py-1.5 rounded-xl text-xs text-indigo-300 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
            <span className="font-semibold">{activeCompany.auditFirm || latestPeriod?.auditFirm || '四大會計師事務所'}</span>
            <span className="text-slate-500">•</span>
            <span className="text-indigo-200">{activeCompany.auditors || latestPeriod?.auditors || '會計師簽證'}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-900/60 text-indigo-200 border border-indigo-700/40 hidden lg:inline">
              {activeCompany.auditOpinion || latestPeriod?.auditOpinion || '無保留意見'}
            </span>
          </div>
        </div>

        {/* Right Status Pill & Direct MOPS Cross-Check Link */}
        <div className="flex items-center space-x-2 text-xs text-slate-400 flex-wrap gap-2">
          {cleanCode && (
            <a
              href={`https://mops.twse.com.tw/mops/web/t05st01?step=1&TYPEK=all&code=${cleanCode}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-950/60 hover:bg-blue-900/80 border border-blue-600/40 text-blue-300 hover:text-white font-semibold transition cursor-pointer shadow-xs"
              title="一鍵直連台灣公開資訊觀測站 (MOPS) 原始簽證報表進行 1:1 核對"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
              <span>MOPS 官方對帳直連</span>
            </a>
          )}

          <div className="flex items-center space-x-2 bg-slate-950/80 px-3.5 py-1.5 rounded-xl border border-slate-800/80">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0"></span>
            <span className="text-slate-300 font-semibold truncate max-w-[160px] sm:max-w-[220px]">
              {activeCompany.name}
            </span>
            <span className="text-indigo-400 font-mono">({activeCompany.code})</span>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-300 font-medium font-mono">
              {latestPeriod?.period || '最新期別'}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
