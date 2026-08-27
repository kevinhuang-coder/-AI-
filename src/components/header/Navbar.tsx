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

          {/* Center: Account Switcher */}
          <div className="flex items-center space-x-3">
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
                <div className="max-w-[100px] xs:max-w-[130px] sm:max-w-[180px] truncate">
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
                                ? 'bg-indigo-600/20 text-indigo-300 border-l-4 border-indigo-500'
                                : 'hover:bg-slate-800/60 text-slate-300'
                            }`}
                          >
                            <div className="mt-0.5">
                              {comp.isConsolidatedGroup ? (
                                <Layers className={`w-4 h-4 ${isSelected ? 'text-cyan-300' : 'text-cyan-400'}`} />
                              ) : (
                                <Building2 className={`w-4 h-4 ${isSelected ? 'text-indigo-300' : 'text-slate-400'}`} />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold truncate">{comp.name}</span>
                                {comp.isConsolidatedGroup && (
                                  <span className="text-[10px] bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-800 ml-1">
                                    綜合合併
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                                {comp.code} • {comp.industry}
                              </p>
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
                        <span>匯入財報文件 (支援 PDF / CSV)</span>
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
              title="上傳 PDF 或 CSV 財務報告書"
            >
              <Upload className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
              <span className="hidden md:inline">匯入財報 (PDF/CSV)</span>
              <span className="md:hidden">匯入</span>
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

