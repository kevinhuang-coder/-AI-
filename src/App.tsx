import React from 'react';
import { FinancialProvider, useFinancial } from './context/FinancialContext';
import { Navbar } from './components/header/Navbar';
import { MetricFilterTabs } from './components/metrics/MetricFilterTabs';
import { KpiSummaryGrid } from './components/metrics/KpiSummaryGrid';
import { TurnoverAnalysisChart } from './components/charts/TurnoverAnalysisChart';
import { ProfitabilityChart } from './components/charts/ProfitabilityChart';
import { DuPontDecomposition } from './components/charts/DuPontDecomposition';
import { FinancialHealthRadar } from './components/charts/FinancialHealthRadar';
import { MultiAccountComparison } from './components/charts/MultiAccountComparison';
import { AiForecastChart } from './components/charts/AiForecastChart';
import { FinancialDataTable } from './components/tables/FinancialDataTable';
import { AiInsightPanel } from './components/ai/AiInsightPanel';
import { DataEditorModal } from './components/modals/DataEditorModal';
import { PdfReportModal } from './components/modals/PdfReportModal';
import {
  LayoutGrid,
  RotateCcw,
  Percent,
  GitFork,
  Activity,
  Layers,
  Sparkles,
  Table,
  SlidersHorizontal,
  FileText,
  ShieldAlert,
  Info,
} from 'lucide-react';

const DashboardContent: React.FC = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    setIsPdfModalOpen,
    setIsDataEditorOpen,
    setEditingCompany,
    activeCompany,
  } = useFinancial();

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-50 font-sans">
      {/* Bento Sidebar Rail (Desktop) */}
      <aside className="hidden md:flex w-20 border-r border-slate-800 flex-col items-center py-6 space-y-7 bg-[#020617] sticky top-0 h-screen z-30 flex-shrink-0">
        {/* Bento Logo Symbol */}
        <button
          onClick={() => {
            setSelectedCategory('all');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          title="智析財策 AI 首頁 (回到全景大盤)"
          className="w-11 h-11 bg-indigo-600 hover:bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25 cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <div className="w-5 h-5 border-2 border-white rounded-sm rotate-45 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
        </button>

        {/* Bento Icon Dock */}
        <nav className="flex flex-col space-y-4">
          <button
            onClick={() => setSelectedCategory('all')}
            title="全景大盤 (Overview)"
            className={`p-3 rounded-2xl transition-all duration-200 ${
              selectedCategory === 'all'
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-lg shadow-indigo-950/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
          </button>

          <button
            onClick={() => setSelectedCategory('turnover')}
            title="週轉能力 (Turnover & CCC)"
            className={`p-3 rounded-2xl transition-all duration-200 ${
              selectedCategory === 'turnover'
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-lg shadow-indigo-950/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={() => setSelectedCategory('profitability')}
            title="獲利指標 (Profitability & Returns)"
            className={`p-3 rounded-2xl transition-all duration-200 ${
              selectedCategory === 'profitability'
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-lg shadow-indigo-950/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Percent className="w-5 h-5" />
          </button>

          <button
            onClick={() => setSelectedCategory('dupont')}
            title="杜邦拆解 (DuPont Analysis)"
            className={`p-3 rounded-2xl transition-all duration-200 ${
              selectedCategory === 'dupont'
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-lg shadow-indigo-950/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <GitFork className="w-5 h-5" />
          </button>

          <button
            onClick={() => setSelectedCategory('solvency')}
            title="償債與財務結構 (Solvency)"
            className={`p-3 rounded-2xl transition-all duration-200 ${
              selectedCategory === 'solvency'
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-lg shadow-indigo-950/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-5 h-5" />
          </button>

          <button
            onClick={() => setSelectedCategory('cashflow')}
            title="現金流量品質 (Cash Flow)"
            className={`p-3 rounded-2xl transition-all duration-200 ${
              selectedCategory === 'cashflow'
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-lg shadow-indigo-950/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-5 h-5" />
          </button>
        </nav>

        {/* Bottom Quick Tools */}
        <div className="mt-auto flex flex-col space-y-3 pt-4 border-t border-slate-800/80">
          <button
            onClick={() => setIsPdfModalOpen(true)}
            title="匯出 PDF 報告"
            className="p-3 rounded-2xl text-slate-400 hover:text-emerald-400 hover:bg-slate-800/60 transition-colors"
          >
            <FileText className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              setEditingCompany(activeCompany.isConsolidatedGroup ? null : activeCompany);
              setIsDataEditorOpen(true);
            }}
            title="數據管理與匯入"
            className="p-3 rounded-2xl text-slate-400 hover:text-indigo-400 hover:bg-slate-800/60 transition-colors"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* Main App Work Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0">
        <Navbar />

        <main className="flex-1 max-w-7xl w-full mx-auto p-3.5 sm:p-6 lg:p-8 space-y-5 sm:space-y-6">
          {/* Bento Category Navigation Header */}
          <MetricFilterTabs />

          {/* Bento Primary Metric Cards */}
          <KpiSummaryGrid />

          {/* Dynamic Bento Modules based on selected category */}
          {selectedCategory === 'all' && (
            <div className="space-y-5 sm:space-y-6">
              {/* Bento Grid: Turnover & Profitability */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
                <TurnoverAnalysisChart />
                <ProfitabilityChart />
              </div>

              {/* DuPont 3-Factor Decomposition (Full Width Row) */}
              <DuPontDecomposition />

              {/* 5-Dimension Financial Health Radar (Full Width Row) */}
              <FinancialHealthRadar />

              {/* AI Forecast & Multi-Account Bento Modules */}
              <AiForecastChart />
              <MultiAccountComparison />
              <AiInsightPanel />
              <FinancialDataTable />
            </div>
          )}

          {selectedCategory === 'turnover' && (
            <div className="space-y-5 sm:space-y-6">
              <TurnoverAnalysisChart />
              <FinancialHealthRadar />
              <MultiAccountComparison />
              <FinancialDataTable />
            </div>
          )}

          {selectedCategory === 'profitability' && (
            <div className="space-y-5 sm:space-y-6">
              <ProfitabilityChart />
              <DuPontDecomposition />
              <FinancialHealthRadar />
              <FinancialDataTable />
            </div>
          )}

          {selectedCategory === 'dupont' && (
            <div className="space-y-5 sm:space-y-6">
              <DuPontDecomposition />
              <ProfitabilityChart />
              <FinancialHealthRadar />
              <FinancialDataTable />
            </div>
          )}

          {selectedCategory === 'solvency' && (
            <div className="space-y-5 sm:space-y-6">
              <FinancialHealthRadar />
              <DuPontDecomposition />
              <MultiAccountComparison />
              <FinancialDataTable />
            </div>
          )}

          {selectedCategory === 'cashflow' && (
            <div className="space-y-5 sm:space-y-6">
              <TurnoverAnalysisChart />
              <FinancialHealthRadar />
              <FinancialDataTable />
            </div>
          )}

          {/* Bento Disclaimer Card & Footer */}
          <div id="financial-disclaimer" className="p-4 sm:p-5 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm text-slate-400">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div className="space-y-1 text-xs leading-relaxed">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-200 tracking-wide text-xs">
                    免責聲明 (Disclaimer)
                  </span>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-400 border border-slate-700">
                    法定與決策告知
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  本系統（Finalyze AI）所展示之各項財務比率分析、杜邦拆解、營運週轉模擬、AI 趨勢預測及顧問諮詢回覆，均基於輸入之財務報表與統計演算法運算生成，僅供企業內部管理研討、情境推演與學術決策輔助參考，<strong>不構成任何形式之法定簽證、公開財務確信、稅務規劃、法律見解或投資買賣建議</strong>。使用者於進行重大經營投資、資金調度或信用授信決策前，應審慎獨立評估，並諮詢合格之執業會計師或專業財務顧問。
                </p>
              </div>
            </div>
          </div>

          {/* Bento Footer */}
          <footer className="pt-4 pb-6 text-center text-xs text-slate-500">
            <div className="flex flex-wrap items-center justify-center gap-2 font-medium text-slate-400">
              <span className="text-indigo-400 font-semibold">Finalyze AI</span>
              <span>•</span>
              <span>統一財務智慧分析與決策系統 (Unified Financial Intelligence)</span>
              <span>•</span>
              <span className="bg-slate-800/80 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700">
                Bento Grid
              </span>
            </div>
            <p className="mt-2 text-[11px] text-slate-500 max-w-xl mx-auto">
              應收帳款週轉率 (AR) • 存貨週轉率 (Inventory) • 獲利能力三率 • 杜邦三因子拆解 • 多主體合併 • 預測模型
            </p>
          </footer>
        </main>
      </div>

      {/* Mobile Bottom Navigation Dock (Fixed at bottom for mobile screens) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#020617]/95 backdrop-blur-xl border-t border-slate-800/90 px-2 py-1.5 safe-bottom shadow-2xl">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition min-w-[50px] ${
              selectedCategory === 'all'
                ? 'text-indigo-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">全景大盤</span>
          </button>

          <button
            onClick={() => setSelectedCategory('turnover')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition min-w-[50px] ${
              selectedCategory === 'turnover'
                ? 'text-indigo-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <RotateCcw className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">週轉營運</span>
          </button>

          <button
            onClick={() => setSelectedCategory('profitability')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition min-w-[50px] ${
              selectedCategory === 'profitability'
                ? 'text-indigo-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Percent className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">獲利指標</span>
          </button>

          <button
            onClick={() => setSelectedCategory('dupont')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition min-w-[50px] ${
              selectedCategory === 'dupont'
                ? 'text-indigo-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitFork className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">杜邦拆解</span>
          </button>

          <button
            onClick={() => setSelectedCategory('solvency')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition min-w-[50px] ${
              selectedCategory === 'solvency'
                ? 'text-indigo-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">償債結構</span>
          </button>

          <button
            onClick={() => setIsDataEditorOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-400 hover:text-slate-200 transition min-w-[50px]"
          >
            <SlidersHorizontal className="w-5 h-5 mb-0.5 text-slate-400" />
            <span className="text-[10px]">管理數據</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default function App() {
  return (
    <FinancialProvider>
      <div className="min-h-screen bg-[#020617] text-slate-50 antialiased">
        <DashboardContent />
        <DataEditorModal />
        <PdfReportModal />
      </div>
    </FinancialProvider>
  );
}


