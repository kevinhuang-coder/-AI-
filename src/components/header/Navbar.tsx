import React, { useState } from 'react';
import { useFinancial } from '../../context/FinancialContext';
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
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    allCompaniesWithConsolidated,
    activeCompanyId,
    activeCompany,
    setActiveCompanyId,
    viewMode,
    setViewMode,
    timeFrequency,
    setTimeFrequency,
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
          
          {/* Logo & Title (Bento Style) */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/20 text-white flex-shrink-0 md:hidden">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-white">智析財策 AI</span>
                <span className="text-xs text-slate-400 font-medium hidden sm:inline-block">Finalyze AI</span>
                <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded uppercase tracking-wider hidden md:inline-block">
                  智慧決策引擎
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden lg:block">
                全方位企業財務報表分析與經營決策系統
              </p>
            </div>
          </div>

          {/* Center: Account Switcher, Time Frequency Switcher & Dual Perspective Toggle */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-wrap gap-y-1">
            {/* Account Selector Dropdown */}
            <div className="relative">
              <button
                id="company-selector-btn"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs sm:text-sm font-medium transition text-left focus:outline-none focus:ring-2 focus:ring-indigo-500/50 min-h-[38px]"
              >
                {activeCompany.isConsolidatedGroup ? (
                  <Layers className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                ) : (
                  <Building2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                )}
                <div className="max-w-[90px] xs:max-w-[120px] sm:max-w-[160px] truncate">
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
                  <div className="fixed sm:absolute left-4 right-4 sm:left-0 sm:right-auto top-16 sm:top-full mt-2 sm:w-80 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl z-50 py-2 divide-y divide-slate-800 max-h-[80vh] flex flex-col">
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
                            className={`w-full text-left px-3.5 py-2.5 flex items-start space-x-3 transition ${
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
                        className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-blue-400 hover:bg-slate-800 rounded-xl transition"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>載入財報 (台股代號 / CSV)</span>
                      </button>
                      <button
                        onClick={() => {
                          resetToSampleData();
                          setIsDropdownOpen(false);
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>重設回預設示範數據</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Time Frequency Switcher: Annual vs TTM vs Quarterly */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-medium">
              <button
                onClick={() => setTimeFrequency('annual')}
                className={`px-2 sm:px-2.5 py-1.5 rounded-lg transition cursor-pointer min-h-[30px] ${
                  timeFrequency === 'annual'
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="歷年官方年度財報（消除短期雜音，綜觀 3~5 年資本配置）"
              >
                <span>歷年年報</span>
              </button>

              <button
                onClick={() => setTimeFrequency('ttm')}
                className={`px-2 sm:px-2.5 py-1.5 rounded-lg transition cursor-pointer min-h-[30px] flex items-center gap-1 ${
                  timeFrequency === 'ttm'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-sm shadow-cyan-600/30 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="近四季滾動累計 TTM（以 4 季加總換算類整年，兼具最新時效與淡旺季平滑）"
              >
                <span>近4季 TTM</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-900/60 text-cyan-200 font-mono hidden md:inline">
                  類整年
                </span>
              </button>

              <button
                onClick={() => setTimeFrequency('quarterly')}
                className={`px-2 sm:px-2.5 py-1.5 rounded-lg transition cursor-pointer min-h-[30px] ${
                  timeFrequency === 'quarterly'
                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="單季獨立數據（檢視最新一季存貨與毛利突發轉折）"
              >
                <span>單季動態</span>
              </button>
            </div>

            {/* Dual Perspective Mode Switcher */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-medium">
              <button
                onClick={() => setViewMode('manager')}
                className={`flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-1.5 rounded-lg transition cursor-pointer min-h-[30px] ${
                  viewMode === 'manager'
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="切換為企業經營與營運資金管理視角"
              >
                <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="hidden xs:inline">企業經營</span>
                <span className="xs:hidden">經營</span>
              </button>
              <button
                onClick={() => setViewMode('investor')}
                className={`flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-1.5 rounded-lg transition cursor-pointer min-h-[30px] ${
                  viewMode === 'investor'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm shadow-emerald-600/30 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="切換為價值投資、護城河與真實獲利品質視角"
              >
                <TrendingUp className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
                <span className="hidden xs:inline">價值投資</span>
                <span className="xs:hidden">投資</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {/* Import Financial Report Button */}
            <button
              id="import-pdf-csv-btn"
              onClick={() => {
                setEditingCompany(null);
                setIsDataEditorOpen(true);
              }}
              className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold transition min-h-[38px]"
              title="輸入 4 碼台股代號或匯入標準 CSV 財務數據"
            >
              <Upload className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
              <span className="hidden md:inline">載入財報 (台股代號/CSV)</span>
              <span className="md:hidden">載入財報</span>
            </button>

            {/* AI Diagnose Action (Bento Indigo Accent Button) */}
            <button
              id="run-ai-btn"
              onClick={runAiDiagnostic}
              disabled={isLoadingAi}
              className="flex items-center space-x-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-900/30 transition disabled:opacity-50 min-h-[38px]"
            >
              <Sparkles className={`w-4 h-4 ${isLoadingAi ? 'animate-spin text-amber-300' : 'text-amber-300'}`} />
              <span className="hidden sm:inline">
                {isLoadingAi ? 'AI 深度運算中...' : 'AI 智能診斷'}
              </span>
              <span className="sm:hidden">
                {isLoadingAi ? '運算中' : 'AI 診斷'}
              </span>
            </button>

            {/* Export PDF Button (Bento Slate Button) */}
            <button
              id="export-pdf-btn"
              onClick={() => setIsPdfModalOpen(true)}
              className="flex items-center space-x-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs sm:text-sm font-medium transition min-h-[38px]"
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
              className="p-2 sm:p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition min-h-[38px] min-w-[38px] flex items-center justify-center"
              title="編輯/檢視財務數據"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

