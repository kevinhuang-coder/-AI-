export interface FinancialPeriod {
  id: string;
  year: number;
  period: string; // e.g. "2024 全年", "2024 Q3"
  isQuarterly?: boolean;
  quarter?: 1 | 2 | 3 | 4;
  
  // 損益表數據 (Income Statement) - 單位: 千元 (NTD in Thousands)
  revenue: number;              // 營業收入
  costOfGoodsSold: number;      // 營業成本
  grossProfit: number;          // 營業毛利
  operatingExpenses: number;    // 營業費用
  operatingIncome: number;      // 營業利益 (EBIT)
  netIncome: number;            // 稅後淨利
  taxExpense?: number;          // 所得稅費用
  interestExpense?: number;     // 利息費用
  sharesOutstanding: number;    // 流通在外股數 (千股)
  nonOperatingIncome?: number;  // 營業外收入及利益 (業外收益)

  // 資產負債表數據 (Balance Sheet)
  accountsReceivable: number;   // 應收帳款及票據
  contractAssets?: number;      // 流動合約資產 (IFRS 15 未請款債權)
  inventory: number;            // 存貨
  accountsPayable: number;      // 應付帳款及票據
  currentAssets: number;        // 流動資產
  currentLiabilities: number;   // 流動負債
  totalAssets: number;          // 資產總額
  totalLiabilities: number;     // 負債總額
  stockholdersEquity: number;   // 股東權益總額
  cashAndEquivalents: number;   // 現金及約當現金
  interestBearingDebt?: number; // 純計息負債 (短期借款+長債+公司債)
  leaseLiabilities?: number;    // 租賃負債 (IFRS 16)

  // 現金流量表數據 (Cash Flow Statement)
  operatingCashFlow: number;    // 營業活動現金流量
  capitalExpenditures: number;  // 資本支出 (PP&E CapEx)
  intangibleCapEx?: number;     // 購置電腦軟體及無形資產支出
  leasePrincipalRepayment?: number; // 償還租賃負債本金 (IFRS 16 籌資現金流)
}

export interface CalculatedRatios {
  // 營運週轉能力指標 (Activity & Turnover Ratios)
  arTurnover: number;           // 應收帳款週轉率 (次)
  dso: number;                  // 應收帳款週轉天數 (天) (含合約資產之真實天數)
  inventoryTurnover: number;    // 存貨週轉率 (次)
  dsi: number;                  // 存貨週轉天數 (天)
  apTurnover: number;           // 應付帳款週轉率 (次)
  dpo: number;                  // 應付帳款週轉天數 (天)
  operatingCycle: number;       // 營業週期 (DSO + DSI) (天)
  cashConversionCycle: number;  // 現金轉換循環 (CCC = DSO + DSI - DPO) (天)
  totalAssetTurnover: number;   // 總資產週轉率 (次)

  // 獲利能力指標 (Profitability Ratios)
  grossMargin: number;          // 營業毛利率 (%)
  operatingMargin: number;      // 營業利益率 (%)
  netMargin: number;            // 稅後淨利率 (%)
  roe: number;                  // 股東權益報酬率 (%)
  roa: number;                  // 資產報酬率 (%)
  eps: number;                  // 每股盈餘 EPS (元)
  
  // 杜邦分析拆解 (DuPont Analysis)
  dupontNetMargin: number;      // 淨利率 (%)
  dupontAssetTurnover: number;  // 資產週轉率 (次)
  dupontEquityMultiplier: number; // 權益乘數 (倍)
  dupontRoe: number;            // 計算得出的 ROE (%)

  // 償債與資本結構指標 (Solvency & Capital Structure)
  currentRatio: number;         // 流動比率 (%)
  quickRatio: number;           // 速動比率 (%)
  debtRatio: number;            // 總負債比率 (%)
  debtToEquity: number;         // 負債權益比 (%)
  interestCoverageRatio: number;// 利息保障倍數 (倍)
  interestBearingDebtRatio: number; // 純計息負債比率 (%)
  operatingFloat: number;       // 營運無息負債/浮存金 (千元)
  netDebt: number;              // 淨計息負債 (千元)

  // 現金流量與品質指標 (Cash Flow Quality)
  ocfToNetIncome: number;       // 營業現金流對淨利比 (%)
  freeCashFlow: number;         // 標準自由現金流 (千元)
  rigorousFcf: number;          // 審計嚴謹版自由現金流 (扣無形資產與租賃本金) (千元)
  coreCashConversionRatio: number; // 核心本業營業現金轉換率 (%)

  // 價值投資指標 (Value Investor Metrics)
  altmanZScore: number;         // Altman Z-Score 破產防禦分數
  altmanZZone: 'safe' | 'grey' | 'distress'; // 安全區 / 灰色區 / 困境區
  economicMoat: 'wide' | 'narrow' | 'none';  // 經濟護城河 (寬 / 窄 / 無)
  earningsQualityScore: number; // 獲利含金量評分 (0 - 100)
}

export type ViewMode = 'manager' | 'investor';


export interface PeriodWithRatios extends FinancialPeriod {
  ratios: CalculatedRatios;
}

export interface AccountEntity {
  id: string;
  name: string;
  code: string;
  industry: string;
  currency: string;
  description: string;
  isConsolidatedGroup?: boolean;
  periods: FinancialPeriod[];
}

export type MetricCategory = 'turnover' | 'profitability' | 'solvency' | 'dupont' | 'cashflow' | 'all';

export interface MetricDefinition {
  id: keyof CalculatedRatios | 'revenue' | 'netIncome' | 'operatingIncome' | 'operatingCashFlow';
  name: string;
  shortName: string;
  category: MetricCategory;
  unit: string;
  description: string;
  formula: string;
  benchmarkGood: number;
  benchmarkWarning: number;
  higherIsBetter: boolean;
}

export interface AiDiagnosticReport {
  overallScore: number; // 0 - 100
  healthRating: '極佳 (Excellent)' | '良好 (Healthy)' | '穩健 (Moderate)' | '需注意 (Watchlist)' | '高風險 (High Risk)';
  executiveSummary: string;
  strengths: string[];
  weaknessesAndRisks: string[];
  turnoverAnalysis: {
    arAssessment: string;
    inventoryAssessment: string;
    cccAssessment: string;
  };
  profitabilityAnalysis: {
    marginAssessment: string;
    dupontDrivers: string;
  };
  forecast: {
    nextPeriod: string;
    predictedRevenueGrowth: number;
    predictedNetMargin: number;
    predictedArTurnover: number;
    predictedInventoryTurnover: number;
    predictedRoe: number;
    confidenceLevel: number;
    trendCommentary: string;
  };
  forecastSeries: Array<{
    period: string;
    isForecast: boolean;
    revenue: number;
    netIncome: number;
    grossMargin: number;
    arTurnover: number;
    inventoryTurnover: number;
    roe: number;
  }>;
  strategicRecommendations: Array<{
    priority: '高' | '中' | '一般';
    category: string;
    action: string;
    expectedImpact: string;
  }>;
}

export interface BenchmarkComparisonItem {
  companyName: string;
  companyCode: string;
  industry: string;
  revenue: number;
  grossMargin: number;
  netMargin: number;
  arTurnover: number;
  dso: number;
  inventoryTurnover: number;
  dsi: number;
  roe: number;
  currentRatio: number;
  debtRatio: number;
}

export type ChangeActionType = 
  | 'edit_field'
  | 'add_period'
  | 'remove_period'
  | 'import_pdf'
  | 'import_csv'
  | 'save_company'
  | 'manual_snapshot'
  | 'restore_version';

export interface FinancialChangeRecord {
  id: string;
  timestamp: number;
  timeFormatted: string;
  companyId: string;
  companyName: string;
  actionType: ChangeActionType;
  actionLabel: string;
  description: string;
  summary: {
    periodsCount: number;
    latestPeriod: string;
    latestRevenue: number;
    latestNetIncome: number;
    latestGrossProfit: number;
    latestTotalAssets: number;
  };
  snapshot: {
    name: string;
    code: string;
    industry: string;
    currency: string;
    description: string;
    periods: FinancialPeriod[];
  };
}
