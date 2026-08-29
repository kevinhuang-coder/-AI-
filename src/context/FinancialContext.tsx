import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import {
  AccountEntity,
  FinancialPeriod,
  PeriodWithRatios,
  MetricCategory,
  AiDiagnosticReport,
  FinancialChangeRecord,
  ChangeActionType,
  ViewMode,
} from '../types/financial';
import { SAMPLE_COMPANIES, buildConsolidatedCompany } from '../data/sampleCompanies';
import {
  calculateAllPeriodsRatios,
  generateLocalAiReport,
} from '../utils/financialCalculations';
import { fetchTaiwanStockFinancials } from '../utils/stockFetcher';

interface FinancialContextType {
  companies: AccountEntity[];
  allCompaniesWithConsolidated: AccountEntity[];
  activeCompanyId: string;
  activeCompany: AccountEntity;
  activeCompanyPeriodsWithRatios: PeriodWithRatios[];
  latestPeriod: PeriodWithRatios | undefined;
  compareCompanyIds: string[];
  selectedCategory: MetricCategory;
  selectedMetrics: string[];
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  aiReport: AiDiagnosticReport | null;
  isLoadingAi: boolean;
  aiError: string | null;
  changeHistory: FinancialChangeRecord[];
  setActiveCompanyId: (id: string) => void;
  setSelectedCategory: (category: MetricCategory) => void;
  setSelectedMetrics: (metrics: string[]) => void;
  setCompareCompanyIds: (ids: string[]) => void;
  runAiDiagnostic: () => Promise<void>;
  addOrUpdateCompany: (company: AccountEntity, logChange?: boolean, customLogDesc?: string) => void;
  deleteCompany: (companyId: string) => void;
  resetToSampleData: () => void;
  addChangeRecord: (
    company: AccountEntity,
    actionType: ChangeActionType,
    actionLabel: string,
    description: string
  ) => void;
  deleteChangeRecord: (recordId: string) => void;
  clearChangeHistory: () => void;
  isPdfModalOpen: boolean;
  setIsPdfModalOpen: (open: boolean) => void;
  isDataEditorOpen: boolean;
  setIsDataEditorOpen: (open: boolean) => void;
  editingCompany: AccountEntity | null;
  setEditingCompany: (company: AccountEntity | null) => void;
  loadStockByCode: (code: string) => Promise<boolean>;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'financial_analyzer_companies_v1';
const HISTORY_STORAGE_KEY = 'financial_analyzer_history_v1';

export const FinancialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 從 LocalStorage 讀取自訂公司或使用預設範例
  const [companies, setCompanies] = useState<AccountEntity[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load companies from localStorage', e);
    }
    return SAMPLE_COMPANIES;
  });

  const [activeCompanyId, setActiveCompanyId] = useState<string>('company-tech-group');
  const [compareCompanyIds, setCompareCompanyIds] = useState<string[]>([
    'company-tech-group',
    'company-precision-mfg',
    'company-ecommerce-retail',
  ]);
  const [selectedCategory, setSelectedCategory] = useState<MetricCategory>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('manager');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([
    'arTurnover',
    'dso',
    'inventoryTurnover',
    'dsi',
    'grossMargin',
    'operatingMargin',
    'netMargin',
    'roe',
    'cashConversionCycle',
  ]);

  const [aiReport, setAiReport] = useState<AiDiagnosticReport | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isDataEditorOpen, setIsDataEditorOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<AccountEntity | null>(null);

  // 最近修改歷史紀錄 (Change History)
  const [changeHistory, setChangeHistory] = useState<FinancialChangeRecord[]>(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load history from localStorage', e);
    }
    return [];
  });

  // 當歷史紀錄變動時儲存到 LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(changeHistory));
    } catch (e) {
      console.warn('Failed to persist history to localStorage', e);
    }
  }, [changeHistory]);

  // 當公司資料變動時儲存到 LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(companies));
    } catch (e) {
      console.warn('Failed to persist companies to localStorage', e);
    }
  }, [companies]);

  // 合併綜合集團報表
  const consolidatedCompany = useMemo(() => {
    return buildConsolidatedCompany(companies);
  }, [companies]);

  const allCompaniesWithConsolidated = useMemo(() => {
    return [...companies, consolidatedCompany];
  }, [companies, consolidatedCompany]);

  // 當前選中的公司
  const activeCompany = useMemo(() => {
    const found = allCompaniesWithConsolidated.find(c => c.id === activeCompanyId);
    return found || allCompaniesWithConsolidated[0] || consolidatedCompany;
  }, [allCompaniesWithConsolidated, activeCompanyId, consolidatedCompany]);

  // 當前選中公司的期間（直接依官方申報期別由舊至新計算財務比率，無人工合成 TTM）
  const activeCompanyPeriodsWithRatios = useMemo(() => {
    if (!activeCompany || !activeCompany.periods || activeCompany.periods.length === 0) {
      return [];
    }
    const sortedPeriods = [...activeCompany.periods].sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return (a.quarter || 0) - (b.quarter || 0);
    });
    return calculateAllPeriodsRatios(sortedPeriods);
  }, [activeCompany]);

  const latestPeriod = useMemo(() => {
    if (activeCompanyPeriodsWithRatios.length === 0) return undefined;
    return activeCompanyPeriodsWithRatios[activeCompanyPeriodsWithRatios.length - 1];
  }, [activeCompanyPeriodsWithRatios]);

  // 自動執行快速在地 AI 財務健檢作為預設報表
  useEffect(() => {
    if (activeCompanyPeriodsWithRatios.length > 0) {
      const defaultReport = generateLocalAiReport(activeCompany.name, activeCompanyPeriodsWithRatios);
      setAiReport(defaultReport);
    }
  }, [activeCompany.id, activeCompanyPeriodsWithRatios]);

  // 觸發遠端 Gemini API 深入 AI 診斷
  const runAiDiagnostic = async () => {
    if (activeCompanyPeriodsWithRatios.length === 0) return;
    setIsLoadingAi(true);
    setAiError(null);

    try {
      const res = await fetch('/api/financial/ai-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: activeCompany.name,
          industry: activeCompany.industry,
          currency: activeCompany.currency,
          periodsData: activeCompanyPeriodsWithRatios.map(p => ({
            period: p.period,
            year: p.year,
            revenue: p.revenue,
            grossProfit: p.grossProfit,
            operatingIncome: p.operatingIncome,
            netIncome: p.netIncome,
            accountsReceivable: p.accountsReceivable,
            inventory: p.inventory,
            accountsPayable: p.accountsPayable,
            totalAssets: p.totalAssets,
            stockholdersEquity: p.stockholdersEquity,
            operatingCashFlow: p.operatingCashFlow,
            ratios: {
              arTurnover: p.ratios.arTurnover,
              dso: p.ratios.dso,
              inventoryTurnover: p.ratios.inventoryTurnover,
              dsi: p.ratios.dsi,
              grossMargin: p.ratios.grossMargin,
              operatingMargin: p.ratios.operatingMargin,
              netMargin: p.ratios.netMargin,
              roe: p.ratios.roe,
              currentRatio: p.ratios.currentRatio,
              cashConversionCycle: p.ratios.cashConversionCycle,
              dupontNetMargin: p.ratios.dupontNetMargin,
              dupontAssetTurnover: p.ratios.dupontAssetTurnover,
              dupontEquityMultiplier: p.ratios.dupontEquityMultiplier,
            },
          })),
        }),
      });

      const json = await res.json();
      const fallback = generateLocalAiReport(activeCompany.name, activeCompanyPeriodsWithRatios);

      if (json.data) {
        const raw = json.data;
        const normalizedRisks = (Array.isArray(raw.weaknessesAndRisks) && raw.weaknessesAndRisks.length > 0)
          ? raw.weaknessesAndRisks
          : (Array.isArray(raw.weaknesses) && raw.weaknesses.length > 0)
          ? raw.weaknesses
          : (Array.isArray(raw.risks) && raw.risks.length > 0)
          ? raw.risks
          : (Array.isArray(raw.potentialRisks) && raw.potentialRisks.length > 0)
          ? raw.potentialRisks
          : fallback.weaknessesAndRisks;

        const normalizedStrengths = (Array.isArray(raw.strengths) && raw.strengths.length > 0)
          ? raw.strengths
          : (Array.isArray(raw.advantages) && raw.advantages.length > 0)
          ? raw.advantages
          : fallback.strengths;

        setAiReport({
          ...fallback,
          ...raw,
          strengths: normalizedStrengths,
          weaknessesAndRisks: normalizedRisks,
          strategicRecommendations: (Array.isArray(raw.strategicRecommendations) && raw.strategicRecommendations.length > 0)
            ? raw.strategicRecommendations
            : fallback.strategicRecommendations,
        });
      } else {
        // Fallback to local report
        setAiReport(fallback);
      }
    } catch (err: any) {
      console.warn('AI diagnostic fetch error, falling back to rule-based engine', err);
      const fallback = generateLocalAiReport(activeCompany.name, activeCompanyPeriodsWithRatios);
      setAiReport(fallback);
      setAiError(err.message || 'AI 診斷使用本地財務演算法生成');
    } finally {
      setIsLoadingAi(false);
    }
  };

  const addChangeRecord = (
    company: AccountEntity,
    actionType: ChangeActionType,
    actionLabel: string,
    description: string
  ) => {
    if (!company || !company.periods) return;
    const sortedPeriods = [...company.periods].sort((a, b) => a.year - b.year);
    const latest = sortedPeriods[sortedPeriods.length - 1];
    const now = new Date();
    const timeFormatted = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const record: FinancialChangeRecord = {
      id: `history-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      timeFormatted,
      companyId: company.id,
      companyName: company.name || '自訂企業',
      actionType,
      actionLabel,
      description,
      summary: {
        periodsCount: sortedPeriods.length,
        latestPeriod: latest ? latest.period : '無',
        latestRevenue: latest ? latest.revenue : 0,
        latestNetIncome: latest ? latest.netIncome : 0,
        latestGrossProfit: latest ? latest.grossProfit : 0,
        latestTotalAssets: latest ? latest.totalAssets : 0,
      },
      snapshot: {
        name: company.name,
        code: company.code,
        industry: company.industry,
        currency: company.currency,
        description: company.description,
        periods: JSON.parse(JSON.stringify(sortedPeriods)),
      },
    };

    setChangeHistory(prev => [record, ...prev].slice(0, 30));
  };

  const deleteChangeRecord = (recordId: string) => {
    setChangeHistory(prev => prev.filter(r => r.id !== recordId));
  };

  const clearChangeHistory = () => {
    setChangeHistory([]);
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  };

  const addOrUpdateCompany = (company: AccountEntity, logChange: boolean = true, customLogDesc?: string) => {
    setCompanies(prev => {
      const idx = prev.findIndex(c => c.id === company.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = company;
        return next;
      }
      return [...prev, company];
    });
    setActiveCompanyId(company.id);

    if (logChange) {
      addChangeRecord(
        company,
        'save_company',
        '儲存財務數據',
        customLogDesc || `儲存「${company.name}」共 ${company.periods.length} 個財務期別數值`
      );
    }
  };

  const deleteCompany = (companyId: string) => {
    const target = companies.find(c => c.id === companyId);
    setCompanies(prev => prev.filter(c => c.id !== companyId));
    if (activeCompanyId === companyId) {
      setActiveCompanyId(companies[0]?.id || 'consolidated-group');
    }
    if (target) {
      addChangeRecord(
        target,
        'remove_period',
        '刪除企業帳戶',
        `已刪除企業「${target.name}」`
      );
    }
  };

  const resetToSampleData = () => {
    setCompanies(SAMPLE_COMPANIES);
    setActiveCompanyId(SAMPLE_COMPANIES[0].id);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  const loadStockByCode = async (stockCode: string): Promise<boolean> => {
    try {
      const company = await fetchTaiwanStockFinancials(stockCode);
      addOrUpdateCompany(company, true, `自台灣證交所與金融資料庫載入「${company.name}」官方財報`);
      setActiveCompanyId(company.id);
      return true;
    } catch (err: any) {
      console.error('loadStockByCode error:', err);
      throw err;
    }
  };

  return (
    <FinancialContext.Provider
      value={{
        companies,
        allCompaniesWithConsolidated,
        activeCompanyId,
        activeCompany,
        activeCompanyPeriodsWithRatios,
        latestPeriod,
        compareCompanyIds,
        selectedCategory,
        selectedMetrics,
        viewMode,
        setViewMode,
        aiReport,
        isLoadingAi,
        aiError,
        changeHistory,
        setActiveCompanyId,
        setSelectedCategory,
        setSelectedMetrics,
        setCompareCompanyIds,
        runAiDiagnostic,
        addOrUpdateCompany,
        deleteCompany,
        resetToSampleData,
        addChangeRecord,
        deleteChangeRecord,
        clearChangeHistory,
        isPdfModalOpen,
        setIsPdfModalOpen,
        isDataEditorOpen,
        setIsDataEditorOpen,
        editingCompany,
        setEditingCompany,
        loadStockByCode,
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancial = () => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
};
