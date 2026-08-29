import React from 'react';
import { FinancialProvider, useFinancial } from './context/FinancialContext';
import { Navbar } from './components/header/Navbar';
import { MetricFilterTabs } from './components/metrics/MetricFilterTabs';
import { KpiSummaryGrid } from './components/metrics/KpiSummaryGrid';
import { TurnoverAnalysisChart } from './components/charts/TurnoverAnalysisChart';
import { ProfitabilityChart } from './components/charts/ProfitabilityChart';
import { CashFlowTrendChart } from './components/charts/CashFlowTrendChart';
import { DuPontDecomposition } from './components/charts/DuPontDecomposition';
import { FinancialHealthRadar } from './components/charts/FinancialHealthRadar';
import { MultiAccountComparison } from './components/charts/MultiAccountComparison';
import { AiForecastChart } from './components/charts/AiForecastChart';
import { FinancialDataTable } from './components/tables/FinancialDataTable';
import { AiInsightPanel } from './components/ai/AiInsightPanel';
import { FloatingFinancialCopilot } from './components/ai/FloatingFinancialCopilot';
import { DataEditorModal } from './components/modals/DataEditorModal';
import { PdfReportModal } from './components/modals/PdfReportModal';
import { BrandFooter } from './components/layout/BrandFooter';
import { ShieldAlert } from 'lucide-react';

const DashboardContent: React.FC = () => {
  const { selectedCategory } = useFinancial();

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-50 font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
        {/* Category Navigation (Segmented Control) */}
        <MetricFilterTabs />

        {/* Primary Value Investing Metric Cards */}
        <KpiSummaryGrid />

        {/* Dynamic Bento Modules based on selected category */}
        {selectedCategory === 'all' && (
          <div className="space-y-5 sm:space-y-6">
            {/* 核心決策層：AI 財務健康深度診斷與 Financial Copilot 顧問諮詢 */}
            <AiInsightPanel />

            {/* Bento Grid: Turnover & Profitability */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
              <TurnoverAnalysisChart />
              <ProfitabilityChart />
            </div>

            {/* Cash Flow Quality & FCF Generation (Full Width Row) */}
            <CashFlowTrendChart />

            {/* DuPont 3-Factor Decomposition (Full Width Row) */}
            <DuPontDecomposition />

            {/* 5-Dimension Financial Health Radar (Full Width Row) */}
            <FinancialHealthRadar />

            {/* AI Forecast & Multi-Account Bento Modules */}
            <AiForecastChart />
            <MultiAccountComparison />
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
            <CashFlowTrendChart />
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
                  免責聲明與專業決策指引 (Professional Disclaimer)
                </span>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                  純內部決策輔助
                </span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                本系統（Finalyze AI）所展示之各項財務比率分析、杜邦拆解、營運週轉模擬、AI 趨勢預測及顧問諮詢回覆，均基於輸入之財務報表與統計演算法運算生成，僅供企業內部管理研討、情境推演與學術決策輔助參考，<strong>不構成任何形式之法定簽證、公開財務確信、稅務規劃、法律見解或投資買賣建議</strong>。使用者於進行重大經營投資、資金調度或信用授信決策前，應審慎獨立評估，並諮詢合格之執業會計師或專業財務顧問。
              </p>
            </div>
          </div>
        </div>

        {/* 凱文黃個人品牌與部落格專屬頁尾 */}
        <BrandFooter />
      </main>
    </div>
  );
};

export default function App() {
  return (
    <FinancialProvider>
      <div className="min-h-screen bg-[#020617] text-slate-50 antialiased">
        <DashboardContent />
        <FloatingFinancialCopilot />
        <DataEditorModal />
        <PdfReportModal />
      </div>
    </FinancialProvider>
  );
}
