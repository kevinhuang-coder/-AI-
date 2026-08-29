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
import { WelcomeDisclaimerModal } from './components/modals/WelcomeDisclaimerModal';
import { PdfReportModal } from './components/modals/PdfReportModal';
import { BrandFooter } from './components/layout/BrandFooter';

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

        {/* 凱文黃個人品牌與部落格頁尾 */}
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
        <WelcomeDisclaimerModal />
        <PdfReportModal />
      </div>
    </FinancialProvider>
  );
}
