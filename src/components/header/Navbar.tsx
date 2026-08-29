import React, { useState } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { BrandLogo } from '../brand/BrandLogo';
import {
  TrendingUp,
  Building2,
  FileText,
  Sparkles,
  Plus,
  RotateCcw,
  ChevronDown,
  Layers,
  SlidersHorizontal,
  Upload,
  Globe,
  ExternalLink,
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
    setEditingCompany,
    resetToSampleData,
  } = useFinancial();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#020617]/90 backdrop-blur-md border-b border-slate-800 text-slate-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Left: Brand Logo & Personal Title */}
          <div className="flex items-center space-x-3">
            <BrandLogo size={36} />
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  凱文黃的價值投資智策
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded uppercase tracking-wider hidden sm:inline-block font-semibold">
                  審計防禦 × 護城河
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden lg:flex items-center gap-1.5">
                <span>《凱文黃的知識天地》專屬工具</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">會計師高考及格・四大審計實務思維</span>
              </p>
            </div>
          </div>

          {/* Center: Company Selector (Clean & Uncrowded) */}
          <div className="flex items-center">
            <div className="relative">
              <button
                id="company-selector-btn"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs sm:text-sm font-medium transition text-left focus:outline-none focus:ring-2 focus:ring-indigo-500/50 min-h-[38px] cursor-pointer shadow-sm"
              >
                {activeCompany.isConsolidatedGroup ? (
                  <Layers className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                ) : (
                  <Building2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                )}
                <div className="max-w-[120px] xs:max-w-[160px] sm:max-w-[220px] truncate">
                  <span className="text-slate-200 font-semibold block truncate text-xs sm:text-sm">{activeCompany.name}</span>
                  <span className="text-[10px] text-slate-400 block font-mono leading-none">{activeCompany.code}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs sm:bg-transparent"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="fixed sm:absolute left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 top-16 sm:top-full mt-2 sm:w-84 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl z-50 py-2 divide-y divide-slate-800 max-h-[80vh] flex flex-col">
                    <div className="px-3.5 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      切換分析帳戶 / 集團合併實體
                    </div>

                    <div className="py-1 overflow-y-auto max-h-56 sm:max-h-64">
                      {allCompaniesWithConsolidated.map((comp) => {
                        const isSelected = comp.id === activeCompanyId;
                        return (
                          <button
                            key={comp.id}
                            onClick={() => {
                              setActiveCompanyId(comp.id);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3.5 py-2.5 flex items-start space-x-3 transition cursor-pointer ${
                              isSelected
                                ? 'bg-indigo-600/20 text-white'
                                : 'text-slate-300 hover:bg-slate-800/60'
                            }`}
                          >
                            <Building2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-xs sm:text-sm truncate">{comp.name}</span>
                                {comp.isConsolidatedGroup && (
                                   <span className="text-[9px] bg-cyan-950 text-cyan-400 border border-cyan-800/60 px-1.5 py-0.2 rounded font-mono ml-2">
                                    集團合併
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400 flex items-center space-x-2 mt-0.5 font-mono">
                                <span>{comp.code}</span>
                                <span>•</span>
                                <span>{comp.industry}</span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Actions in Dropdown */}
                    <div className="p-2 space-y-1 bg-slate-950/80 mt-auto">
                      <button
                        onClick={() => {
                          setEditingCompany(null);
                          setIsDataEditorOpen(true);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-blue-400 hover:bg-slate-800 rounded-xl transition cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>載入財報 (台股代號 / CSV)</span>
                      </button>
                      <button
                        onClick={() => {
                          resetToSampleData();
                          setIsDropdownOpen(false);
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>重設回預設示範數據</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {/* Import Financial Report Button */}
            <button
              id="import-pdf-csv-btn"
              onClick={() => {
                setEditingCompany(null);
                setIsDataEditorOpen(true);
              }}
              className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold transition min-h-[38px] cursor-pointer"
              title="輸入 4 碼台股代號或匯入標準 CSV 財務數據"
            >
              <Upload className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
              <span className="hidden md:inline">載入財報 (台股代號/CSV)</span>
              <span className="md:hidden">載入</span>
            </button>

            {/* AI Diagnose Action */}
            <button
              id="run-ai-btn"
              onClick={runAiDiagnostic}
              disabled={isLoadingAi}
              className="flex items-center space-x-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-900/30 transition disabled:opacity-50 min-h-[38px] cursor-pointer"
            >
              <Sparkles className={`w-4 h-4 ${isLoadingAi ? 'animate-spin text-amber-300' : 'text-amber-300'}`} />
              <span className="hidden sm:inline">
                {isLoadingAi ? 'AI 運算中...' : 'AI 智能診斷'}
              </span>
              <span className="sm:hidden">
                {isLoadingAi ? '運算中' : 'AI 診斷'}
              </span>
            </button>

            {/* Export PDF Button */}
            <button
              id="export-pdf-btn"
              onClick={() => setIsPdfModalOpen(true)}
              className="flex items-center space-x-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs sm:text-sm font-medium transition min-h-[38px] cursor-pointer"
              title="匯出專業財務 PDF 報告"
            >
              <FileText className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="hidden sm:inline">匯出 PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>

            {/* Data Management Modal Toggle */}
            <button
              id="data-manage-btn"
              onClick={() => {
                setEditingCompany(activeCompany.isConsolidatedGroup ? null : activeCompany);
                setIsDataEditorOpen(true);
              }}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition min-h-[38px] min-w-[38px] flex items-center justify-center cursor-pointer"
              title="編輯/檢視財務數據"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {/* Direct Blog Link Button */}
            <a
              href="https://kevin-huang-cpa.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden xl:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition min-h-[38px] cursor-pointer group"
              title="前往《凱文黃的知識天地》個人官方部落格"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>凱文黃知識庫</span>
              <ExternalLink className="w-3 h-3 text-emerald-400/70 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

        </div>
      </div>
    </header>
  );
};


