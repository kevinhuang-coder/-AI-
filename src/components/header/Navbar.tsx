import React, { useState } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { BrandLogo } from '../brand/BrandLogo';
import {
  Building2,
  FileText,
  Sparkles,
  ChevronDown,
  Layers,
  SlidersHorizontal,
  Upload,
  Globe,
  ExternalLink,
  Search,
  Check,
  ShieldCheck,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    allCompaniesWithConsolidated,
    activeCompanyId,
    activeCompany,
    setActiveCompanyId,
    runAiDiagnostic,
    isLoadingAi,
    setIsPdfModalOpen,
    setIsDataEditorOpen,
    setIsDisclaimerOpen,
    setEditingCompany,
    resetToSampleData,
  } = useFinancial();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#080c14]/80 backdrop-blur-xl border-b border-slate-800/60 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15 gap-4">
          
          {/* Left: Clean Brand Logo & Title */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <BrandLogo size={32} />
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm sm:text-base text-white tracking-tight">
                價值決策
              </span>
              <span className="text-slate-500 text-xs hidden xs:inline">•</span>
              <span className="text-slate-300 text-xs font-medium hidden xs:inline">
                凱文黃的知識天地
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium hidden md:inline">
                5年官方年報
              </span>
            </div>
          </div>

          {/* Center: Company Selector */}
          <div className="relative">
            <button
              id="company-selector-btn"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-700/60 text-xs font-medium transition cursor-pointer shadow-xs max-w-[200px] sm:max-w-[280px]"
            >
              {activeCompany.isConsolidatedGroup ? (
                <Layers className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
              ) : (
                <Building2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
              )}
              <span className="text-slate-200 font-semibold truncate text-xs">
                {activeCompany.name}
              </span>
              <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                {activeCompany.code}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400 flex-shrink-0 ml-auto" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-72 sm:w-80 rounded-2xl bg-slate-900/95 backdrop-blur-2xl border border-slate-800 shadow-2xl z-50 py-1.5 divide-y divide-slate-800/80">
                  <div className="px-3.5 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    選擇分析企業
                  </div>

                  <div className="py-1 max-h-64 overflow-y-auto">
                    {allCompaniesWithConsolidated.map((comp) => {
                      const isSelected = comp.id === activeCompanyId;
                      return (
                        <button
                          key={comp.id}
                          onClick={() => {
                            setActiveCompanyId(comp.id);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-2 flex items-center justify-between text-xs transition cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-500/10 text-emerald-300 font-semibold'
                              : 'text-slate-300 hover:bg-slate-800/60'
                          }`}
                        >
                          <div className="truncate mr-2">
                            <span className="block truncate">{comp.name}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{comp.code}</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-1.5 space-y-1">
                    <button
                      onClick={() => {
                        setEditingCompany(null);
                        setIsDataEditorOpen(true);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-1.5 text-xs text-indigo-400 hover:bg-slate-800/60 rounded-lg transition cursor-pointer font-medium"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>搜尋台股代號 / 匯入 CSV</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right: Clean Unified Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Disclaimer Modal Trigger */}
            <button
              onClick={() => setIsDisclaimerOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium transition cursor-pointer"
              title="查看使用須知與法律免責聲明"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">使用須知</span>
            </button>

            {/* Search/Import Trigger */}
            <button
              id="import-pdf-csv-btn"
              onClick={() => {
                setEditingCompany(null);
                setIsDataEditorOpen(true);
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium transition cursor-pointer"
              title="搜尋台股 4 碼代號或上傳 CSV"
            >
              <Upload className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">搜尋/載入</span>
            </button>

            {/* AI Diagnose Action */}
            <button
              id="run-ai-btn"
              onClick={runAiDiagnostic}
              disabled={isLoadingAi}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition disabled:opacity-50 cursor-pointer whitespace-nowrap"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isLoadingAi ? 'animate-spin' : ''}`} />
              <span>{isLoadingAi ? '診斷中...' : 'AI 深度診斷'}</span>
            </button>

            {/* Export PDF Button */}
            <button
              id="export-pdf-btn"
              onClick={() => setIsPdfModalOpen(true)}
              className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium transition cursor-pointer"
              title="匯出專業 PDF 報告"
            >
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>匯出 PDF</span>
            </button>

            {/* Blog Portal Link */}
            <a
              href="https://kevin-huang-cpa.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-emerald-400 text-xs font-medium transition cursor-pointer group"
              title="前往《凱文黃的知識天地》部落格"
            >
              <Globe className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400" />
              <span className="hidden lg:inline">部落格</span>
              <ExternalLink className="w-2.5 h-2.5 text-slate-500 group-hover:text-emerald-400" />
            </a>
          </div>

        </div>
      </div>
    </header>
  );
};
