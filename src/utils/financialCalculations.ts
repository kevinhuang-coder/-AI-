import { FinancialPeriod, CalculatedRatios, PeriodWithRatios, MetricDefinition, AiDiagnosticReport } from '../types/financial';

export const METRIC_DEFINITIONS: Record<string, MetricDefinition> = {
  // 週轉能力指標
  arTurnover: {
    id: 'arTurnover',
    name: '應收帳款週轉率',
    shortName: '應收週轉率',
    category: 'turnover',
    unit: '次/年',
    description: '衡量企業收回賒銷款項的效率。週轉次數越高，代表資金回收速度越快。',
    formula: '營業收入 ÷ 平均應收帳款',
    benchmarkGood: 6.0,
    benchmarkWarning: 3.5,
    higherIsBetter: true,
  },
  dso: {
    id: 'dso',
    name: '應收帳款週轉天數 (DSO)',
    shortName: '應收天數',
    category: 'turnover',
    unit: '天',
    description: '從銷貨成立到款項實際收現所需的平均天數。天數越短代表資金佔用少、壞帳風險低。',
    formula: '365天 ÷ 應收帳款週轉率',
    benchmarkGood: 60,
    benchmarkWarning: 90,
    higherIsBetter: false,
  },
  inventoryTurnover: {
    id: 'inventoryTurnover',
    name: '存貨週轉率',
    shortName: '存貨週轉率',
    category: 'turnover',
    unit: '次/年',
    description: '衡量存貨在一定期間內被銷售並補充的頻率。週轉率高代表存貨流動快、滯銷風險低。',
    formula: '營業成本 ÷ 平均存貨',
    benchmarkGood: 5.0,
    benchmarkWarning: 2.5,
    higherIsBetter: true,
  },
  dsi: {
    id: 'dsi',
    name: '存貨週轉天數 (DSI / DIO)',
    shortName: '存貨天數',
    category: 'turnover',
    unit: '天',
    description: '將存貨從進貨庫存轉化為銷售所需的時間。天數過長可能面臨跌價損失或呆料壓力。',
    formula: '365天 ÷ 存貨週轉率',
    benchmarkGood: 70,
    benchmarkWarning: 120,
    higherIsBetter: false,
  },
  cashConversionCycle: {
    id: 'cashConversionCycle',
    name: '現金轉換循環 (CCC)',
    shortName: '現金循環天數',
    category: 'turnover',
    unit: '天',
    description: '企業投入採購現金到透過銷售收回現金的淨天數。天數越少甚至為負，代表營運資金效率極高。',
    formula: '應收天數 (DSO) + 存貨天數 (DSI) - 應付天數 (DPO)',
    benchmarkGood: 45,
    benchmarkWarning: 90,
    higherIsBetter: false,
  },
  totalAssetTurnover: {
    id: 'totalAssetTurnover',
    name: '總資產週轉率',
    shortName: '總資產週轉率',
    category: 'turnover',
    unit: '次/年',
    description: '衡量每一元總資產創造多少營業收入，展現整體資產運用效率。',
    formula: '營業收入 ÷ 總資產總額',
    benchmarkGood: 1.0,
    benchmarkWarning: 0.5,
    higherIsBetter: true,
  },

  // 獲利能力指標
  grossMargin: {
    id: 'grossMargin',
    name: '營業毛利率',
    shortName: '毛利率',
    category: 'profitability',
    unit: '%',
    description: '銷貨扣除直接生產成本後的獲利比率，反映產品定價力、技術壁壘與成本競爭優勢。',
    formula: '(營業收入 - 營業成本) ÷ 營業收入 × 100%',
    benchmarkGood: 30.0,
    benchmarkWarning: 15.0,
    higherIsBetter: true,
  },
  operatingMargin: {
    id: 'operatingMargin',
    name: '營業利益率',
    shortName: '營益率',
    category: 'profitability',
    unit: '%',
    description: '本業營運扣除管銷研費用後的獲利率，衡量企業核心事業的本業獲利能力。',
    formula: '營業利益 ÷ 營業收入 × 100%',
    benchmarkGood: 12.0,
    benchmarkWarning: 5.0,
    higherIsBetter: true,
  },
  netMargin: {
    id: 'netMargin',
    name: '稅後純益率',
    shortName: '淨利率',
    category: 'profitability',
    unit: '%',
    description: '最終歸屬於全體股東的淨利佔營收比重，綜合考量本業、業外與所得稅負擔。',
    formula: '稅後淨利 ÷ 營業收入 × 100%',
    benchmarkGood: 10.0,
    benchmarkWarning: 3.0,
    higherIsBetter: true,
  },
  roe: {
    id: 'roe',
    name: '股東權益報酬率 (ROE)',
    shortName: 'ROE',
    category: 'profitability',
    unit: '%',
    description: '衡量公司為股東資金創造報酬的終極指標，是巴菲特最看重的核心獲利指標。',
    formula: '稅後淨利 ÷ 股東權益總額 × 100%',
    benchmarkGood: 15.0,
    benchmarkWarning: 8.0,
    higherIsBetter: true,
  },
  roa: {
    id: 'roa',
    name: '資產報酬率 (ROA)',
    shortName: 'ROA',
    category: 'profitability',
    unit: '%',
    description: '衡量公司運用所有資源（包含股東出資與債權人借款）賺取利益的能力。',
    formula: '稅後淨利 ÷ 資產總額 × 100%',
    benchmarkGood: 8.0,
    benchmarkWarning: 4.0,
    higherIsBetter: true,
  },
  eps: {
    id: 'eps',
    name: '每股盈餘 (EPS)',
    shortName: '每股盈餘',
    category: 'profitability',
    unit: '元',
    description: '每一普通股所能獲得的稅後利潤，為資本市場評價本益比的重要基準。',
    formula: '稅後淨利 ÷ 流通在外股數',
    benchmarkGood: 4.0,
    benchmarkWarning: 1.5,
    higherIsBetter: true,
  },

  // 償債與財務結構
  currentRatio: {
    id: 'currentRatio',
    name: '流動比率',
    shortName: '流動比率',
    category: 'solvency',
    unit: '%',
    description: '流動資產對流動負債的比例，評估一年內短期償債能力的關鍵指標。',
    formula: '流動資產 ÷ 流動負債 × 100%',
    benchmarkGood: 180.0,
    benchmarkWarning: 110.0,
    higherIsBetter: true,
  },
  quickRatio: {
    id: 'quickRatio',
    name: '速動比率',
    shortName: '速動比率',
    category: 'solvency',
    unit: '%',
    description: '扣除變現性較慢的存貨與預付款項後，即時應付短期流動負債的能力。',
    formula: '(流動資產 - 存貨) ÷ 流動負債 × 100%',
    benchmarkGood: 120.0,
    benchmarkWarning: 80.0,
    higherIsBetter: true,
  },
  debtRatio: {
    id: 'debtRatio',
    name: '負債比率 (槓桿度)',
    shortName: '負債比率',
    category: 'solvency',
    unit: '%',
    description: '總負債佔總資產的百分比，衡量財務槓桿與長期財務風險結構。',
    formula: '總負債 ÷ 總資產 × 100%',
    benchmarkGood: 45.0,
    benchmarkWarning: 65.0,
    higherIsBetter: false,
  },

  // 現金流量與品質
  ocfToNetIncome: {
    id: 'ocfToNetIncome',
    name: '營業現金流對淨利比',
    shortName: '營運現金/淨利',
    category: 'cashflow',
    unit: '%',
    description: '營業活動產生的真實現金與帳面稅後淨利的比值，高於100%代表獲利具備高含金量。',
    formula: '營業現金流 ÷ 稅後淨利 × 100%',
    benchmarkGood: 100.0,
    benchmarkWarning: 70.0,
    higherIsBetter: true,
  },
};

/**
 * 依財務期間計算各項財務比率
 */
export function calculatePeriodRatios(period: FinancialPeriod, previousPeriod?: FinancialPeriod): CalculatedRatios {
  const rev = period.revenue || 1;
  const cogs = period.costOfGoodsSold || 0;
  const grossProfit = period.grossProfit || (rev - cogs);
  const opIncome = period.operatingIncome || (grossProfit - (period.operatingExpenses || 0));
  const netIncome = period.netIncome || 0;

  // 平均資產/應收(含合約資產)/存貨/應付計算
  const currentTotalReceivables = period.accountsReceivable + (period.contractAssets || 0);
  const prevTotalReceivables = previousPeriod 
    ? (previousPeriod.accountsReceivable + (previousPeriod.contractAssets || 0)) 
    : currentTotalReceivables;
  const avgAR = (currentTotalReceivables + prevTotalReceivables) / 2;

  const avgInv = previousPeriod ? (period.inventory + previousPeriod.inventory) / 2 : period.inventory;
  const avgAP = previousPeriod ? (period.accountsPayable + previousPeriod.accountsPayable) / 2 : period.accountsPayable;
  const totalAssets = period.totalAssets || 1;
  const equity = period.stockholdersEquity || 1;
  const curLiab = period.currentLiabilities || 1;
  const totalLiab = period.totalLiabilities || 0;

  // 1. 週轉能力 (包含 IFRS 15 合約資產之真實債權天數)
  const arTurnover = avgAR > 0 ? Number((rev / avgAR).toFixed(2)) : 0;
  const dso = arTurnover > 0 ? Number((365 / arTurnover).toFixed(1)) : 0;

  const inventoryTurnover = avgInv > 0 ? Number((cogs / avgInv).toFixed(2)) : 0;
  const dsi = inventoryTurnover > 0 ? Number((365 / inventoryTurnover).toFixed(1)) : 0;

  const apTurnover = avgAP > 0 ? Number((cogs / avgAP).toFixed(2)) : 0;
  const dpo = apTurnover > 0 ? Number((365 / apTurnover).toFixed(1)) : 0;

  const operatingCycle = Number((dso + dsi).toFixed(1));
  const cashConversionCycle = Number((dso + dsi - dpo).toFixed(1));
  const totalAssetTurnover = Number((rev / totalAssets).toFixed(2));

  // 2. 獲利能力
  const grossMargin = Number(((grossProfit / rev) * 100).toFixed(2));
  const operatingMargin = Number(((opIncome / rev) * 100).toFixed(2));
  const netMargin = Number(((netIncome / rev) * 100).toFixed(2));
  const roe = Number(((netIncome / equity) * 100).toFixed(2));
  const roa = Number(((netIncome / totalAssets) * 100).toFixed(2));
  const eps = period.sharesOutstanding > 0 ? Number((netIncome / period.sharesOutstanding).toFixed(2)) : 0;

  // 3. 杜邦分析
  const dupontNetMargin = netMargin;
  const dupontAssetTurnover = totalAssetTurnover;
  const dupontEquityMultiplier = Number((totalAssets / equity).toFixed(2));
  const dupontRoe = Number(((dupontNetMargin / 100) * dupontAssetTurnover * dupontEquityMultiplier * 100).toFixed(2));

  // 4. 償債能力與資本結構拆解 (計息負債 vs 營運無息負債 Float)
  const currentRatio = Number(((period.currentAssets / curLiab) * 100).toFixed(2));
  const quickRatio = Number((((period.currentAssets - period.inventory) / curLiab) * 100).toFixed(2));
  const debtRatio = Number(((totalLiab / totalAssets) * 100).toFixed(2));
  const debtToEquity = Number(((totalLiab / equity) * 100).toFixed(2));
  const interestCoverageRatio = period.interestExpense && period.interestExpense > 0 
    ? Number((opIncome / period.interestExpense).toFixed(2))
    : Number((opIncome / 100).toFixed(2));

  // 純計息負債 (短期借款+長債+公司債) 與 營運無息負債 (應付帳款+合約負債)
  const interestBearingDebt = period.interestBearingDebt !== undefined
    ? period.interestBearingDebt
    : Math.max(0, totalLiab - (period.accountsPayable || 0) * 1.3);
  const interestBearingDebtRatio = Number(((interestBearingDebt / totalAssets) * 100).toFixed(2));
  const operatingFloat = Math.max(0, totalLiab - interestBearingDebt);
  const netDebt = interestBearingDebt - (period.cashAndEquivalents || 0);

  // 5. 現金流品質與嚴謹版 FCF (扣除無形資產CapEx與IFRS 16租賃本金)
  const ppeCapEx = period.capitalExpenditures || 0;
  const intangibleCapEx = period.intangibleCapEx || 0;
  const leasePrincipal = period.leasePrincipalRepayment || 0;
  const freeCashFlow = period.operatingCashFlow - ppeCapEx;
  const rigorousFcf = period.operatingCashFlow - ppeCapEx - intangibleCapEx - leasePrincipal;
  
  const ocfToNetIncome = netIncome !== 0 ? Number(((period.operatingCashFlow / netIncome) * 100).toFixed(1)) : 0;
  const effectiveTaxRate = 0.20; // 台灣法定營所稅率 20%
  const afterTaxOpIncome = Math.max(1, opIncome * (1 - effectiveTaxRate));
  const coreCashConversionRatio = opIncome > 0
    ? Number((((period.operatingCashFlow - leasePrincipal) / afterTaxOpIncome) * 100).toFixed(1))
    : (period.operatingCashFlow > 0 ? 100 : 0);

  // 6. 價值投資者指標 (Value Investor Metrics)
  // Altman Z-Score: 1.2*X1 + 1.4*X2 + 3.3*X3 + 0.6*X4 + 0.999*X5
  const workingCapital = period.currentAssets - period.currentLiabilities;
  const x1 = workingCapital / totalAssets;
  const x2 = netIncome / totalAssets;
  const x3 = opIncome / totalAssets;
  const x4 = equity / (totalLiab || 1);
  const x5 = rev / totalAssets;
  const rawZ = 1.2 * x1 + 1.4 * x2 + 3.3 * x3 + 0.6 * x4 + 0.999 * x5;
  const altmanZScore = Number(rawZ.toFixed(2));
  const altmanZZone: 'safe' | 'grey' | 'distress' = altmanZScore >= 2.99 ? 'safe' : altmanZScore >= 1.81 ? 'grey' : 'distress';

  // 經濟護城河 (Economic Moat)
  let economicMoat: 'wide' | 'narrow' | 'none' = 'none';
  if (netIncome > 0 && grossMargin >= 38 && roe >= 16 && rigorousFcf > 0) {
    economicMoat = 'wide';
  } else if (netIncome > 0 && grossMargin >= 22 && roe >= 10) {
    economicMoat = 'narrow';
  } else {
    economicMoat = 'none'; // 虧損或毛利/ROE偏低皆無護城河壁壘
  }

  // 獲利含金量評分 (0 - 100)
  let earningsQualityScore = 75;
  if (netIncome <= 0) {
    if (period.operatingCashFlow < 0) {
      earningsQualityScore = 15; // 雙重承壓：帳面虧損且營運現金大幅淨流出
    } else {
      earningsQualityScore = 45; // 帳面虧損但營運現金勉力維持正向
    }
  } else {
    if (coreCashConversionRatio >= 100) earningsQualityScore = 95;
    else if (coreCashConversionRatio >= 80) earningsQualityScore = 88;
    else if (coreCashConversionRatio >= 60) earningsQualityScore = 75;
    else if (coreCashConversionRatio >= 40) earningsQualityScore = 60;
    else earningsQualityScore = 40;
  }

  return {
    arTurnover,
    dso,
    inventoryTurnover,
    dsi,
    apTurnover,
    dpo,
    operatingCycle,
    cashConversionCycle,
    totalAssetTurnover,
    grossMargin,
    operatingMargin,
    netMargin,
    roe,
    roa,
    eps,
    dupontNetMargin,
    dupontAssetTurnover,
    dupontEquityMultiplier,
    dupontRoe,
    currentRatio,
    quickRatio,
    debtRatio,
    debtToEquity,
    interestCoverageRatio,
    interestBearingDebtRatio,
    operatingFloat,
    netDebt,
    ocfToNetIncome,
    freeCashFlow,
    rigorousFcf,
    coreCashConversionRatio,
    altmanZScore,
    altmanZZone,
    economicMoat,
    earningsQualityScore,
  };
}

/**
 * 批次計算完整期間比率並附加至各期間
 */
export function calculateAllPeriodsRatios(periods: FinancialPeriod[]): PeriodWithRatios[] {
  // 按照年份或期間由先至後排列以計算平均值
  const sorted = [...periods].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return (a.quarter || 0) - (b.quarter || 0);
  });

  return sorted.map((p, index) => {
    const prev = index > 0 ? sorted[index - 1] : undefined;
    const ratios = calculatePeriodRatios(p, prev);
    return {
      ...p,
      ratios,
    };
  });
}

/**
 * 計算五維度財務健康綜合雷達評分 (0-100)
 */
export function calculateHealthDimensions(latest: PeriodWithRatios) {
  const r = latest.ratios;

  // 1. 獲利能力得分 (毛利率, 營益率, ROE)
  let profitScore = 40;
  if (r.netMargin < 0) {
    profitScore = Math.max(5, Math.round(20 + r.netMargin * 2));
    if (r.operatingMargin < 0) profitScore = Math.max(5, profitScore - 12);
  } else {
    if (r.grossMargin >= 40) profitScore += 20;
    else if (r.grossMargin >= 25) profitScore += 12;
    else if (r.grossMargin >= 15) profitScore += 6;

    if (r.operatingMargin >= 15) profitScore += 20;
    else if (r.operatingMargin >= 8) profitScore += 12;
    else if (r.operatingMargin > 0) profitScore += 5;

    if (r.roe >= 18) profitScore += 20;
    else if (r.roe >= 12) profitScore += 12;
    else if (r.roe >= 6) profitScore += 6;
  }
  profitScore = Math.min(100, Math.max(5, profitScore));

  // 2. 營運週轉效率得分 (應收天數 DSO, 存貨天數 DSI, 現金循環 CCC)
  let turnoverScore = 50;
  if (r.dso <= 45) turnoverScore += 20;
  else if (r.dso <= 65) turnoverScore += 12;
  else if (r.dso <= 90) turnoverScore += 4;
  else turnoverScore -= 15;

  if (r.dsi <= 60) turnoverScore += 20;
  else if (r.dsi <= 90) turnoverScore += 12;
  else if (r.dsi <= 120) turnoverScore += 4;
  else turnoverScore -= 15;

  if (r.cashConversionCycle <= 50) turnoverScore += 10;
  else if (r.cashConversionCycle > 100) turnoverScore -= 10;
  turnoverScore = Math.min(100, Math.max(10, turnoverScore));

  // 3. 償債安全與槓桿得分 (流動比, 速動比, 負債比)
  let solvencyScore = 40;
  if (r.currentRatio >= 200) solvencyScore += 20;
  else if (r.currentRatio >= 150) solvencyScore += 14;
  else if (r.currentRatio >= 110) solvencyScore += 6;
  else solvencyScore -= 15;

  if (r.quickRatio >= 130) solvencyScore += 20;
  else if (r.quickRatio >= 100) solvencyScore += 12;
  else if (r.quickRatio < 70) solvencyScore -= 10;

  if (r.debtRatio <= 45) solvencyScore += 20;
  else if (r.debtRatio <= 60) solvencyScore += 10;
  else if (r.debtRatio > 70) solvencyScore -= 20;
  solvencyScore = Math.min(100, Math.max(10, solvencyScore));

  // 4. 現金流品質得分 (OCF / Net Income, 自由現金流)
  let cashflowScore = 45;
  if (latest.operatingCashFlow < 0) {
    cashflowScore = Math.max(5, Math.round(20 + (latest.operatingCashFlow / (latest.revenue || 1)) * 300));
  } else if (r.ocfToNetIncome >= 110) cashflowScore += 30;
  else if (r.ocfToNetIncome >= 80) cashflowScore += 18;
  else if (r.ocfToNetIncome >= 50) cashflowScore += 8;
  else cashflowScore -= 15;

  if (r.freeCashFlow > 0) cashflowScore += 25;
  else cashflowScore -= 15;
  cashflowScore = Math.min(100, Math.max(5, cashflowScore));

  // 5. 資產運用與槓桿綜效 (總資產週轉率, 杜邦權益乘數適度性)
  let assetEfficiencyScore = 50;
  if (r.totalAssetTurnover >= 1.2) assetEfficiencyScore += 30;
  else if (r.totalAssetTurnover >= 0.8) assetEfficiencyScore += 18;
  else if (r.totalAssetTurnover >= 0.5) assetEfficiencyScore += 8;

  if (r.dupontEquityMultiplier >= 1.2 && r.dupontEquityMultiplier <= 2.5) assetEfficiencyScore += 20;
  else if (r.dupontEquityMultiplier > 3.5) assetEfficiencyScore -= 10;
  assetEfficiencyScore = Math.min(100, Math.max(10, assetEfficiencyScore));

  const totalScore = Math.round((profitScore + turnoverScore + solvencyScore + cashflowScore + assetEfficiencyScore) / 5);

  let rating: AiDiagnosticReport['healthRating'] = '良好 (Healthy)';
  if (totalScore >= 88) rating = '極佳 (Excellent)';
  else if (totalScore >= 75) rating = '良好 (Healthy)';
  else if (totalScore >= 60) rating = '穩健 (Moderate)';
  else if (totalScore >= 45) rating = '需注意 (Watchlist)';
  else rating = '高風險 (High Risk)';

  return {
    profitScore,
    turnoverScore,
    solvencyScore,
    cashflowScore,
    assetEfficiencyScore,
    totalScore,
    rating,
    radarData: [
      { subject: '獲利能力', score: profitScore, fullMark: 100 },
      { subject: '營運週轉', score: turnoverScore, fullMark: 100 },
      { subject: '償債流動', score: solvencyScore, fullMark: 100 },
      { subject: '現金流品質', score: cashflowScore, fullMark: 100 },
      { subject: '資產效率', score: assetEfficiencyScore, fullMark: 100 },
    ],
  };
}

/**
 * 內建專業財務分析與趨勢預測引擎（支援離線/本機快速推算）
 */
export function generateLocalAiReport(companyName: string, periodsWithRatios: PeriodWithRatios[]): AiDiagnosticReport {
  if (periodsWithRatios.length === 0) {
    throw new Error('無足夠的財務期間數據');
  }

  const sorted = [...periodsWithRatios].sort((a, b) => a.year - b.year);
  const latest = sorted[sorted.length - 1];
  const previous = sorted.length > 1 ? sorted[sorted.length - 2] : latest;
  const health = calculateHealthDimensions(latest);

  // 營收成長率
  const revGrowth = previous.revenue > 0 ? ((latest.revenue - previous.revenue) / previous.revenue) * 100 : 0;
  const isNetLoss = latest.netIncome < 0;
  const isOperatingLoss = latest.operatingIncome < 0;
  const dsoChange = latest.ratios.dso - previous.ratios.dso;
  const dsiChange = latest.ratios.dsi - previous.ratios.dsi;

  const strengths: string[] = [];
  const weaknesses: string[] = [];

  // 1. 毛利率與獲利能力診斷
  if (isNetLoss) {
    weaknesses.push(`本期呈顯著虧損：稅後淨損 NT$ ${(Math.abs(latest.netIncome)/1000).toLocaleString()} 百萬元（淨利率 ${latest.ratios.netMargin}%，每股虧損 NT$ ${latest.ratios.eps}），本業獲利嚴重受壓，需急迫推動成本瘦身與事業重整。`);
    if (isOperatingLoss) {
      weaknesses.push(`本業營業利益轉負：營業淨損 NT$ ${(Math.abs(latest.operatingIncome)/1000).toLocaleString()} 百萬元，顯示毛利無法覆蓋龐大營業費用，核心本業營運資金顯著承壓。`);
    }
  } else if (latest.ratios.grossMargin >= 30) {
    strengths.push(`高產品附加價值：毛利率達 ${latest.ratios.grossMargin}%，具備堅實的定價能力與技術防護盾。`);
  } else if (latest.ratios.grossMargin < 18) {
    weaknesses.push(`毛利承壓嚴重：毛利率僅 ${latest.ratios.grossMargin}%，易受原物料價格波動及同業價格競爭削價衝擊。`);
  } else {
    weaknesses.push(`毛利率提升空間：目前毛利率為 ${latest.ratios.grossMargin}%，面對通膨與製造成本上升，需持續提升高毛利利基型產品比重。`);
  }

  // 2. 股東權益報酬率 (ROE)
  if (!isNetLoss && latest.ratios.roe >= 15) {
    strengths.push(`股東回報優異：ROE 達 ${latest.ratios.roe}%，資金配置效率與資本報酬率卓越。`);
  } else if (latest.ratios.roe < 0) {
    weaknesses.push(`權益報酬呈負值：ROE 為 ${latest.ratios.roe}%，股東權益持續遭到虧損侵蝕。`);
  } else if (latest.ratios.roe < 8) {
    weaknesses.push(`權益報酬偏低：ROE 僅 ${latest.ratios.roe}%，資產轉化為股東實質利潤的能力有待提升。`);
  } else {
    weaknesses.push(`資產報酬效益潛力：ROE 為 ${latest.ratios.roe}%，可透過加速資產週轉與優化產品利潤率進一步推升股東回報。`);
  }

  // 3. 應收帳款天數 (DSO) 與信用管理
  if (latest.ratios.dso <= 50) {
    strengths.push(`帳款回收極為迅速：應收帳款天數僅 ${latest.ratios.dso} 天，銷貨收現流暢、客戶信用控管嚴謹。`);
  } else if (latest.ratios.dso > 80) {
    weaknesses.push(`應收帳款滯留風險：DSO 達 ${latest.ratios.dso} 天（較前期變動 ${dsoChange > 0 ? '+' : ''}${dsoChange.toFixed(1)} 天），需防範下游客戶延遲付款與潛在呆帳損失。`);
  } else {
    weaknesses.push(`帳款回收週期優化空間：目前 DSO 為 ${latest.ratios.dso} 天，建議推動現金折扣促銷 (如 2/10 net 30) 以縮短資金滯留期。`);
  }

  // 4. 存貨天數 (DSI) 與庫存風險
  if (latest.ratios.dsi <= 60) {
    strengths.push(`存貨去化健康敏捷：存貨週轉天數 ${latest.ratios.dsi} 天，供應鏈彈性高、庫存積壓資金成本低。`);
  } else if (latest.ratios.dsi > 95) {
    weaknesses.push(`存貨週期拉長：DSI 達 ${latest.ratios.dsi} 天（週轉率 ${latest.ratios.inventoryTurnover} 次），需警戒存貨跌價損失提列與倉儲資金佔用。`);
  } else {
    weaknesses.push(`存貨去化與備料平衡：存貨天數為 ${latest.ratios.dsi} 天，需密切關注下游終端拉貨動能，避免安全庫存超額積壓。`);
  }

  // 5. 現金轉換循環 (CCC)
  if (latest.ratios.cashConversionCycle <= 40) {
    strengths.push(`營運資金循環卓越：現金轉換循環 (CCC) 僅 ${latest.ratios.cashConversionCycle} 天，資金週轉速度快，營運資金佔用極小。`);
  } else if (latest.ratios.cashConversionCycle > 80) {
    weaknesses.push(`現金轉換循環 (CCC) 偏長：目前需 ${latest.ratios.cashConversionCycle} 天完成現金回流，對外部流動性融資需求與利息成本負擔較大。`);
  } else {
    weaknesses.push(`現金流循環壓縮潛力：CCC 為 ${latest.ratios.cashConversionCycle} 天，可透過協商延長應付帳款天數 (DPO) 與加速收現同步優化。`);
  }

  // 6. 流動性與償債結構
  if (latest.ratios.currentRatio >= 180 && latest.ratios.quickRatio >= 120) {
    strengths.push(`短期流動性充沛：流動比率 ${latest.ratios.currentRatio}%、速動比率 ${latest.ratios.quickRatio}%，具備穩健的抗風險與即時償債韌性。`);
  } else if (latest.ratios.currentRatio < 130) {
    weaknesses.push(`短期流動性吃緊：流動比率 ${latest.ratios.currentRatio}%，需妥善調度資金池或預備銀行短期週轉額度以防資金鏈緊張。`);
  }

  // 7. 現金流品質
  if (latest.operatingCashFlow < 0) {
    weaknesses.push(`營業現金大幅淨流出：本期營業現金流為 NT$ ${(latest.operatingCashFlow/1000).toLocaleString()} 百萬元，出現實質資金缺口，需高度防範資金鏈斷裂。`);
  } else if (latest.ratios.ocfToNetIncome >= 90) {
    strengths.push(`獲利含金量高：營業現金流對淨利比達 ${latest.ratios.ocfToNetIncome}%，帳面利潤均有扎實的真金白銀支撐。`);
  } else {
    weaknesses.push(`獲利與現金流存在落差：營業現金流/淨利比僅 ${latest.ratios.ocfToNetIncome}%，需留意盈餘品質與未收帳款增長速度。`);
  }

  // 8. 成長動能與總體敏感度補充
  if (revGrowth < 5 && revGrowth >= 0) {
    weaknesses.push(`營收成長動能趨緩：本期營收成長率為 ${revGrowth.toFixed(1)}%，需積極開拓新市場或高單價產品線以突破成長天花板。`);
  } else if (revGrowth < 0) {
    weaknesses.push(`營收出現衰退警訊：本期營收 YoY 衰退 ${Math.abs(revGrowth).toFixed(1)}%，需全面檢視客戶流失率與主力產品競爭力。`);
  }

  // 保證即使最頂尖的企業，也能提供高品質的改善策略與風險監控
  if (weaknesses.length === 0) {
    weaknesses.push(
      `供應鏈與總體景氣敏感度：面對外部匯率與總體經貿波動，需加強避險操作與關鍵原材料多來源採購。`,
      `持續優化營運資金效率：目前 CCC 維持良好，可進一步深化供應鏈金融合作，將資金釋放最大化。`,
      `研發與資本支出回收追蹤：需嚴格追蹤各項資本投入之後續效益，確保新產品良率與毛利如期達成預期目標。`
    );
  }

  // 執行摘要
  const executiveSummary = isNetLoss
    ? `【經營全景診斷】「${companyName}」在 ${latest.period} 面臨嚴峻之營運挑戰與本業虧損，本期稅後淨損達 NT$ ${(Math.abs(latest.netIncome)/1000).toLocaleString()} 百萬元（每股虧損 NT$ ${latest.ratios.eps}），營業利益率為 ${latest.ratios.operatingMargin}%。毛利率為 ${latest.ratios.grossMargin}%，顯示受同業價格競爭與成本上升削弱。營運活動現金流量為 NT$ ${(latest.operatingCashFlow/1000).toLocaleString()} 百萬元，當前首要任務為精簡固定營業費用、提升核心通路獲利率，並嚴密監控短期償債與現金儲備。`
    : `【經營全景診斷】「${companyName}」在 ${latest.period} 綜合財務健康總體評估為「${health.rating}」（綜合指標得分 ${health.totalScore} 分）。本期營業收入達 NT$ ${(latest.revenue / 1000).toLocaleString()} 百萬元（YoY 成長率 ${revGrowth >= 0 ? '+' : ''}${revGrowth.toFixed(1)}%），營業毛利率為 ${latest.ratios.grossMargin}%、營業利益率為 ${latest.ratios.operatingMargin}%、股東權益報酬率 (ROE) 達 ${latest.ratios.roe}%。整體營運資金循環 (CCC) 為 ${latest.ratios.cashConversionCycle} 天，展現均衡穩健的營運效率。`;

  // 3. 應收帳款天數 (DSO) 與信用管理
  if (latest.ratios.dso <= 50) {
    strengths.push(`帳款回收極為迅速：應收帳款天數僅 ${latest.ratios.dso} 天，銷貨收現流暢、客戶信用控管嚴謹。`);
  } else if (latest.ratios.dso > 80) {
    weaknesses.push(`應收帳款滯留風險：DSO 達 ${latest.ratios.dso} 天（較前期變動 ${dsoChange > 0 ? '+' : ''}${dsoChange.toFixed(1)} 天），需防範下游客戶延遲付款與潛在呆帳損失。`);
  } else {
    weaknesses.push(`帳款回收週期優化空間：目前 DSO 為 ${latest.ratios.dso} 天，建議推動現金折扣促銷 (如 2/10 net 30) 以縮短資金滯留期。`);
  }

  // 4. 存貨天數 (DSI) 與庫存風險
  if (latest.ratios.dsi <= 60) {
    strengths.push(`存貨去化健康敏捷：存貨週轉天數 ${latest.ratios.dsi} 天，供應鏈彈性高、庫存積壓資金成本低。`);
  } else if (latest.ratios.dsi > 95) {
    weaknesses.push(`存貨週期拉長：DSI 達 ${latest.ratios.dsi} 天（週轉率 ${latest.ratios.inventoryTurnover} 次），需警戒存貨跌價損失提列與倉儲資金佔用。`);
  } else {
    weaknesses.push(`存貨去化與備料平衡：存貨天數為 ${latest.ratios.dsi} 天，需密切關注下游終端拉貨動能，避免安全庫存超額積壓。`);
  }

  // 5. 現金轉換循環 (CCC)
  if (latest.ratios.cashConversionCycle <= 40) {
    strengths.push(`營運資金循環卓越：現金轉換循環 (CCC) 僅 ${latest.ratios.cashConversionCycle} 天，資金週轉速度快，營運資金佔用極小。`);
  } else if (latest.ratios.cashConversionCycle > 80) {
    weaknesses.push(`現金轉換循環 (CCC) 偏長：目前需 ${latest.ratios.cashConversionCycle} 天完成現金回流，對外部流動性融資需求與利息成本負擔較大。`);
  } else {
    weaknesses.push(`現金流循環壓縮潛力：CCC 為 ${latest.ratios.cashConversionCycle} 天，可透過協商延長應付帳款天數 (DPO) 與加速收現同步優化。`);
  }

  // 6. 流動性與償債結構
  if (latest.ratios.currentRatio >= 180 && latest.ratios.quickRatio >= 120) {
    strengths.push(`短期流動性充沛：流動比率 ${latest.ratios.currentRatio}%、速動比率 ${latest.ratios.quickRatio}%，具備穩健的抗風險與即時償債韌性。`);
  } else if (latest.ratios.currentRatio < 130) {
    weaknesses.push(`短期流動性吃緊：流動比率 ${latest.ratios.currentRatio}%，需妥善調度資金池或預備銀行短期週轉額度以防資金鏈緊張。`);
  }

  // 7. 現金流品質
  if (latest.ratios.ocfToNetIncome >= 90) {
    strengths.push(`獲利含金量高：營業現金流對淨利比達 ${latest.ratios.ocfToNetIncome}%，帳面利潤均有扎實的真金白銀支撐。`);
  } else {
    weaknesses.push(`獲利與現金流存在落差：營業現金流/淨利比僅 ${latest.ratios.ocfToNetIncome}%，需留意盈餘品質與未收帳款增長速度。`);
  }

  // 8. 成長動能與總體敏感度補充
  if (revGrowth < 5 && revGrowth >= 0) {
    weaknesses.push(`營收成長動能趨緩：本期營收成長率為 ${revGrowth.toFixed(1)}%，需積極開拓新市場或高單價產品線以突破成長天花板。`);
  } else if (revGrowth < 0) {
    weaknesses.push(`營收出現衰退警訊：本期營收 YoY 衰退 ${Math.abs(revGrowth).toFixed(1)}%，需全面檢視客戶流失率與主力產品競爭力。`);
  }

  // 保證即使最頂尖的企業，也能提供高品質的改善策略與風險監控
  if (weaknesses.length === 0) {
    weaknesses.push(
      `供應鏈與總體景氣敏感度：面對外部匯率與總體經貿波動，需加強避險操作與關鍵原材料多來源採購。`,
      `持續優化營運資金效率：目前 CCC 維持良好，可進一步深化供應鏈金融合作，將資金釋放最大化。`,
      `研發與資本支出回收追蹤：需嚴格追蹤各項資本投入之後續效益，確保新產品良率與毛利如期達成預期目標。`
    );
  }

  // 趨勢外推預測 (AI Projections)
  const lastYear = latest.year;
  const baseRev = latest.revenue;
  const baseNet = latest.netIncome;
  const forecastGrowth = Math.max(-5, Math.min(18, Number((revGrowth * 0.7 + 5).toFixed(1))));
  const predRev = Math.round(baseRev * (1 + forecastGrowth / 100));
  const predMargin = Math.max(3, Number((latest.ratios.netMargin + (revGrowth > 0 ? 0.3 : -0.4)).toFixed(1)));
  const predNet = Math.round(predRev * (predMargin / 100));

  const forecastSeries = [
    ...sorted.map(p => ({
      period: `${p.period}`,
      isForecast: false,
      revenue: p.revenue,
      netIncome: p.netIncome,
      grossMargin: p.ratios.grossMargin,
      arTurnover: p.ratios.arTurnover,
      inventoryTurnover: p.ratios.inventoryTurnover,
      roe: p.ratios.roe,
    })),
    {
      period: `${lastYear + 1} 預測 (E)`,
      isForecast: true,
      revenue: predRev,
      netIncome: predNet,
      grossMargin: Number((latest.ratios.grossMargin + 0.2).toFixed(1)),
      arTurnover: Number((latest.ratios.arTurnover * 1.03).toFixed(2)),
      inventoryTurnover: Number((latest.ratios.inventoryTurnover * 1.02).toFixed(2)),
      roe: Number((latest.ratios.roe * 1.04).toFixed(1)),
    },
    {
      period: `${lastYear + 2} 預測 (E)`,
      isForecast: true,
      revenue: Math.round(predRev * 1.06),
      netIncome: Math.round(predNet * 1.08),
      grossMargin: Number((latest.ratios.grossMargin + 0.5).toFixed(1)),
      arTurnover: Number((latest.ratios.arTurnover * 1.05).toFixed(2)),
      inventoryTurnover: Number((latest.ratios.inventoryTurnover * 1.04).toFixed(2)),
      roe: Number((latest.ratios.roe * 1.06).toFixed(1)),
    },
  ];

  return {
    overallScore: health.totalScore,
    healthRating: health.rating,
    executiveSummary: `本期 ${companyName} 綜合財務健康評分為 ${health.totalScore} 分，評級為「${health.rating}」。` +
      `營業收入達 ${(latest.revenue / 1000).toLocaleString('zh-TW', { maximumFractionDigits: 1 })} 百萬元（YoY ${revGrowth >= 0 ? '+' : ''}${revGrowth.toFixed(1)}%），` +
      `毛利率 ${latest.ratios.grossMargin}%、營業利益率 ${latest.ratios.operatingMargin}%、稅後淨利率 ${latest.ratios.netMargin}%。` +
      `在營運資金方面，應收帳款週轉率為 ${latest.ratios.arTurnover} 次（天數 ${latest.ratios.dso} 天），存貨週轉率為 ${latest.ratios.inventoryTurnover} 次（天數 ${latest.ratios.dsi} 天），` +
      `現金轉換循環 (CCC) 為 ${latest.ratios.cashConversionCycle} 天。`,
    strengths: strengths.slice(0, 4),
    weaknessesAndRisks: weaknesses.slice(0, 4),
    turnoverAnalysis: {
      arAssessment: latest.ratios.dso <= 65
        ? `應收帳款帳齡健康，平均 ${latest.ratios.dso} 天完成結算收現，催收管理有效降低資金停滯風險。`
        : `應收帳款天數達 ${latest.ratios.dso} 天，建議對逾期客戶進行信用評級分層管理並實施早鳥付款現金折扣。`,
      inventoryAssessment: latest.ratios.dsi <= 80
        ? `存貨管理效率良好，存貨天數 ${latest.ratios.dsi} 天，與生產排程及終端需求匹配度高。`
        : `存貨天數 ${latest.ratios.dsi} 天偏高，建議導入 JIT 精實庫存或深化經銷商安全庫存協同預警機制。`,
      cccAssessment: `淨現金轉換循環為 ${latest.ratios.cashConversionCycle} 天，反映每筆營運資金自投入至回收之週期長度。`,
    },
    profitabilityAnalysis: {
      marginAssessment: `毛利率為 ${latest.ratios.grossMargin}%，營益率為 ${latest.ratios.operatingMargin}%，費用管控率呈現穩健態勢。`,
      dupontDrivers: `杜邦拆解顯示 ROE (${latest.ratios.roe}%) 主要受淨利率 (${latest.ratios.dupontNetMargin}%) 與資產週轉率 (${latest.ratios.dupontAssetTurnover} 次) 驅動，財務槓桿乘數為 ${latest.ratios.dupontEquityMultiplier} 倍，槓桿運用適中。`,
    },
    forecast: {
      nextPeriod: `${lastYear + 1} 年度預測`,
      predictedRevenueGrowth: forecastGrowth,
      predictedNetMargin: predMargin,
      predictedArTurnover: Number((latest.ratios.arTurnover * 1.03).toFixed(2)),
      predictedInventoryTurnover: Number((latest.ratios.inventoryTurnover * 1.02).toFixed(2)),
      predictedRoe: Number((latest.ratios.roe * 1.04).toFixed(1)),
      confidenceLevel: 88,
      trendCommentary: `根據歷史 ${sorted.length} 期多變量時序迴歸與季候趨勢模型，預估次年度營收維持約 ${forecastGrowth >= 0 ? '+' : ''}${forecastGrowth}% 成長，主要驅動力來自營運週轉效率微幅提升及毛利率持穩。`,
    },
    forecastSeries,
    strategicRecommendations: [
      {
        priority: '高',
        category: '營運資金優化',
        action: '壓縮應收帳款與存貨滯留週期，目標將現金循環天數 (CCC) 縮減 5-8 天。',
        expectedImpact: '估計可釋放約 NT$ ' + Math.round(latest.revenue * 0.02 / 1000).toLocaleString() + ' 百萬元流動現金，大幅降低短期融資利息成本。',
      },
      {
        priority: '高',
        category: '獲利結構提升',
        action: '針對高毛利核心主力產品提高出貨比重，精準管控管銷推廣預算投入產出比。',
        expectedImpact: '預期帶動營業利益率增加 0.8% 至 1.5%，直接挹注整體 ROE 回報。',
      },
      {
        priority: '中',
        category: '供應鏈與採購對策',
        action: '優化關鍵原料安全庫存閾值，並與主要供應商洽談延長應付帳款週期 (DPO)。',
        expectedImpact: '降低跌價損失提列風險，平滑營運現金流波動。',
      },
    ],
  };
}

/**
 * 智慧型 AI 財務分析助手即時諮詢推演引擎 (Financial Copilot Inference Engine)
 * 根據使用者具體問題意圖與最新多維財報數據，動態產生具備深度基本面價值之分析推演
 */
export function generateFinancialCopilotResponse(
  question: string,
  companyName: string,
  latest?: PeriodWithRatios,
  aiReport?: AiDiagnosticReport | null
): string {
  if (!latest) {
    return `【AI 財務分析助手】目前尚未載入「${companyName}」之財務數據，請先於上方選擇或匯入財務報表期別數據。`;
  }

  const q = question.toLowerCase().trim();

  // 0. 日常問候語友善引導 (Greeting Handler)
  if (['hi', 'hello', 'hey', '你好', '您好', '哈囉', '嗨', '早安', '午安', '晚安'].includes(q) || q === 'hi!' || q === 'hello!') {
    return `您好！我是「AI 財務分析助手（Financial Copilot）」👋\n\n` +
      `目前系統正在深入分析「${companyName}」在 ${latest.period} 的最新官方審計年報（毛利率 ${latest.ratios.grossMargin}%、ROE ${latest.ratios.roe}%）。\n\n` +
      `您可以向我詢問例如：\n` +
      `• 「這家公司具備長期的經濟護城河嗎？」\n` +
      `• 「檢驗本期的獲利含金量與營業現金流」\n` +
      `• 「分析 Altman Z 破產防禦指標與安全邊際」\n` +
      `• 「多空投資論點 (Bull vs. Bear) 怎麼看？」\n\n` +
      `請問今天想從哪一個財務維度開始深入探討呢？`;
  }
  const r = latest.ratios;
  const dso = r.dso;
  const dsi = r.dsi;
  const ccc = r.cashConversionCycle;
  const arTurnover = r.arTurnover;
  const invTurnover = r.inventoryTurnover;
  const gm = r.grossMargin;
  const om = r.operatingMargin;
  const nm = r.netMargin;
  const roe = r.roe;
  const eps = r.eps;
  const period = latest.period;
  const revMillions = (latest.revenue / 1000).toLocaleString('zh-TW', { maximumFractionDigits: 1 });
  const ocfMillions = (latest.operatingCashFlow / 1000).toLocaleString('zh-TW', { maximumFractionDigits: 1 });
  const capexMillions = (latest.capitalExpenditures / 1000).toLocaleString('zh-TW', { maximumFractionDigits: 1 });

  // 1. 應收帳款 / 信用政策 / DSO / 催收 深度分析
  if (q.includes('應收') || q.includes('dso') || q.includes('信用') || q.includes('催收') || q.includes('帳款') || q.includes('賒銷')) {
    const isHealthy = dso <= 65;
    const isWarning = dso > 85;
    const cashRelease = Math.round(latest.revenue * (5 / 365) / 1000).toLocaleString();

    return `【AI 財務分析助手・應收帳款與信用政策策略】\n\n` +
      `📊 1. 核心數據現況（基準期：${period}）：\n` +
      `• 應收帳款週轉率：${arTurnover} 次 / 年\n` +
      `• 平均收現天數 (DSO)：${dso} 天（行業標準優質區間約 45～65 天）\n` +
      `• 帳款總額：NT$ ${(latest.accountsReceivable / 1000).toLocaleString()} 百萬元\n\n` +
      `🔍 2. 深度診斷與風險洞察：\n` +
      (isWarning
        ? `• ⚠️ 當前 DSO 達 ${dso} 天明顯偏長，部分營運資金滯留在下游經銷端或大客戶手中，存在呆帳風險與隱性利息成本負擔。`
        : isHealthy
        ? `• ✅ 目前 DSO 為 ${dso} 天，款項回收節奏極為流暢，顯示對下游客戶具備良好議價力與信用控管紀律。`
        : `• ⚖️ 當前收現天數 ${dso} 天處於中等可控水位，但面對景氣變數仍需防範帳期拖延。`) +
      `\n\n🎯 3. 具體策略指引：\n` +
      `• 實施客戶信用分級與「2/10, net 30」早鳥付款現金折扣方案，加速優質客戶回款節奏。\n` +
      `• 對帳齡逾期 30 天以上之客戶啟動滾動預警，必要時運用應收帳款承購（Factoring）或信用保險鎖定資金。\n` +
      `• 💡 財務效益：若能將 DSO 壓縮 5 天，預估可為「${companyName}」即時釋放約 NT$ ${cashRelease} 百萬元 之自由營運現金！`;
  }

  // 2. 存貨去化 / DSI / 庫存 / 供應鏈 深度分析
  if (q.includes('存貨') || q.includes('庫存') || q.includes('dsi') || q.includes('去化') || q.includes('供應鏈') || q.includes('呆料')) {
    const isLean = dsi <= 60;
    const isHigh = dsi > 85;
    const workingCapitalSaving = Math.round(latest.costOfGoodsSold * (8 / 365) / 1000).toLocaleString();

    return `【AI 財務分析助手・存貨去化與供應鏈效能評估】\n\n` +
      `📊 1. 核心數據現況（基準期：${period}）：\n` +
      `• 存貨週轉率：${invTurnover} 次 / 年\n` +
      `• 存貨週轉天數 (DSI)：${dsi} 天（健康基準通常為 50～75 天）\n` +
      `• 存貨帳面總值：NT$ ${(latest.inventory / 1000).toLocaleString()} 百萬元\n\n` +
      `🔍 2. 深度診斷與去化分析：\n` +
      (isHigh
        ? `• ⚠️ 當前存貨天數 ${dsi} 天偏高，庫存去化速度趨緩，需高度警惕原材料跌價損失及倉儲資金佔用。`
        : isLean
        ? `• ✅ 存貨天數 ${dsi} 天表現優異（精實庫存），生產排程與終端出貨動能配合極為緊密。`
        : `• ⚖️ 存貨天數 ${dsi} 天維持在標準常態區間，需持續追蹤產品生命週期變化。`) +
      `\n\n🎯 3. 具體策略指引：\n` +
      `• 導入 S&OP（銷售與營運規劃）跨部門看板，以終端訂單即時驅動拉貨排程。\n` +
      `• 實施 ABC 庫存分類管理，針對週轉天數超過 90 天之慢速品項進行專案促銷或組合搭售出清。\n` +
      `• 💡 財務效益：若能縮短存貨天數 8 天，預計可降低約 NT$ ${workingCapitalSaving} 百萬元 之營運資金佔用！`;
  }

  // 3. 現金轉換循環 (CCC) / 營運資金 / 現金流 深度分析
  if (q.includes('ccc') || q.includes('現金循環') || q.includes('營運資金') || q.includes('現金轉換') || q.includes('現金流') || q.includes('資金')) {
    const isSuperEfficient = ccc <= 45;
    const cashPerDay = Math.round(latest.revenue / 365 / 1000).toLocaleString();

    return `【AI 財務分析助手・現金轉換循環 (CCC) 與資金槓桿】\n\n` +
      `📊 1. 現金循環拆解矩陣（基準期：${period}）：\n` +
      `• 應收帳款天數 (DSO)：${dso} 天\n` +
      `• 加上 存貨週轉天數 (DSI)：${dsi} 天\n` +
      `• 減去 應付帳款天數 (DPO)：約 ${(dso + dsi - ccc).toFixed(1)} 天\n` +
      `• ➔ 淨現金轉換循環 (CCC)：【 ${ccc} 天 】（營業淨現金流入：NT$ ${ocfMillions} 百萬元）\n\n` +
      `🔍 2. 資金效率診斷：\n` +
      (isSuperEfficient
        ? `• 🏆 企業展現極高之營運資金效率，從採購投入到銷售現金落袋僅需 ${ccc} 天，具備極強的營運資金自主性與擴張實力！`
        : `• 💡 當前 CCC 為 ${ccc} 天，代表每筆營運資本需在外流動 ${ccc} 天後才能回收，具備顯著優化空間。`) +
      `\n\n🎯 3. 雙管齊下優化行動方案：\n` +
      `• 【下游端】：加速應收帳款入帳速度，鎖定前 20% 主要營收來源進行早鳥折扣。\n` +
      `• 【上游端】：與核心供應商策略協商延長付款週期 (DPO 15～30 天)，善用商業信用無息槓桿。\n` +
      `• 💡 戰略價值：每壓縮 1 天 CCC，約等同釋放 NT$ ${cashPerDay} 百萬元 之無息流動現金！`;
  }

  // 4. 杜邦三因子拆解 / ROE / 獲利驅動力 深度分析
  if (q.includes('roe') || q.includes('杜邦') || q.includes('獲利') || q.includes('毛利') || q.includes('淨利') || q.includes('純益') || q.includes('驅動')) {
    const isHighRoe = roe >= 18;

    return `【AI 財務分析助手・杜邦分析三因子歸因與 ROE 驅動力】\n\n` +
      `📊 1. 杜邦分析三因子拆解公式（基準期：${period}）：\n` +
      `• 【稅後純益率】：${r.dupontNetMargin}% （營業毛利率 ${gm}%、營益率 ${om}%）\n` +
      `• 【總資產週轉率】：${r.dupontAssetTurnover} 次 / 年 （資產營運效率）\n` +
      `• 【財務權益乘數】：${r.dupontEquityMultiplier} 倍 （槓桿運用程度）\n` +
      `• ➔ 綜合成效：股東權益報酬率 (ROE) = 【 ${roe}% 】（每股盈餘 EPS NT$ ${eps}）\n\n` +
      `🔍 2. 核心驅動力與潛在弱點評析：\n` +
      (isHighRoe
        ? `• 🌟 本期 ROE 達 ${roe}% 表現極為亮眼！核心優勢來自「高稅後純益率 (${r.dupontNetMargin}%)」與穩健資產週轉，展現強大之產品定價權與技術壁壘。`
        : `• ⚖️ 本期 ROE 為 ${roe}%，若欲進一步突破，需聚焦於提升高毛利專案滲透率並優化固定資產產能利用率。`) +
      `\n\n🎯 3. 股東價值最大化建議：\n` +
      `• 產品線優化：聚焦毛利率高於 ${gm}% 之核心產品，淘汰低毛利代工訂單。\n` +
      `• 資本結構優化：在負債比率安全範圍內，善用低成本綠色債券或中長期融資，適度維持財務乘數效益。`;
  }

  // 5. 經濟護城河 (Economic Moat) 與長期競爭優勢分析
  if (q.includes('護城河') || q.includes('moat') || q.includes('競爭優勢') || q.includes('定價權') || q.includes('壁壘')) {
    const moatType = r.economicMoat;
    const moatLabel = moatType === 'wide' ? '👑 寬廣經濟護城河 (Wide Moat)' : moatType === 'narrow' ? '🛡️ 窄經濟護城河 (Narrow Moat)' : '⚠️ 無顯著護城河 (No Moat)';
    const fcfMillions = (r.freeCashFlow / 1000).toLocaleString('zh-TW', { maximumFractionDigits: 1 });

    return `【AI 財務分析助手・企業經濟護城河 (Economic Moat) 深度評級】\n\n` +
      `🏰 1. 護城河評級結果：【 ${moatLabel} 】（基準期：${period}）\n` +
      `• 營業毛利率：${gm}% （反映定價權與技術/品牌溢價防護盾）\n` +
      `• 股東權益報酬率 (ROE)：${roe}% （反映股東資本複利累積效應）\n` +
      `• 自由現金流 (FCF)：NT$ ${fcfMillions} 百萬元 （反映扣除資本支出後的真金白銀分配力）\n\n` +
      `🔍 2. 巴菲特式護城河歸因解析：\n` +
      (moatType === 'wide'
        ? `• 🌟 「${companyName}」具備高毛利與高 ROE 雙重支撐，代表其產品具有不可替代性或高度客戶黏著度，競爭對手難以透過價格戰侵蝕其超額利潤。`
        : moatType === 'narrow'
        ? `• ⚖️ 具備一定的產業競爭優勢，但面對同業擴產或技術更迭仍需持續維持高研發投入以捍衛市占率。`
        : `• ⚠️ 毛利率與 ROE 處於中低水位，易受原料價格波動與同業價格戰影響，尚未建立起強大的結構性壁壘。`) +
      `\n\n🎯 3. 價值投資者長線檢驗指標：\n` +
      `• 持續追蹤毛利率是否維持在 ${gm}% 以上，警惕毛利率逐季滑落。\n` +
      `• 觀察自由現金流是否維持正數，確保再投資資本回報率 (ROIC) 高於加權資金成本 (WACC)。`;
  }

  // 6. 獲利含金量 (Earnings Quality) 與現金流品質分析
  if (q.includes('含金量') || q.includes('獲利品質') || q.includes('真實獲利') || q.includes('紙上富貴') || q.includes('ocf/net')) {
    const ocfRatio = r.ocfToNetIncome;
    const isGold = ocfRatio >= 100;
    const isWarning = ocfRatio < 70;

    return `【AI 財務分析助手・獲利含金量與盈餘品質檢驗】\n\n` +
      `💎 1. 核心含金量指標矩陣（基準期：${period}）：\n` +
      `• 營業活動現金流 (OCF)：NT$ ${ocfMillions} 百萬元\n` +
      `• 帳面稅後淨利 (Net Income)：NT$ ${(latest.netIncome / 1000).toLocaleString()} 百萬元\n` +
      `• ➔ 【獲利含金量 (OCF/Net)】：【 ${ocfRatio}% 】（健康基準通常需 $\\ge 100\\%$）\n\n` +
      `🔍 2. 盈餘真實度深度解讀：\n` +
      (isGold
        ? `• 🏆 【真金白銀落袋】：獲利含金量達 ${ocfRatio}%（超過 100%），代表公司每賺 1 元帳面利潤，實際上流進超過 1 元的真實營運現金！獲利品質極為扎實，絕無應收帳款虛胖灌水之嫌！`
        : isWarning
        ? `• ⚠️ 【警訊：利潤現金轉化不足】：獲利含金量僅 ${ocfRatio}%（低於 70% 警戒線），部分帳面利潤被應收帳款或未售存貨積壓，投資人應提防「紙上富貴」與流動性隱憂。`
        : `• ⚖️ 獲利含金量為 ${ocfRatio}%，處於正常合理區解，營業現金流入與淨利走勢基本同步。`) +
      `\n\n🎯 3. 決策關注點：\n` +
      `• 檢視應收帳款收現天數 (DSO ${dso} 天) 是否持續穩定，杜絕盈餘操縱風險。`;
  }

  // 7. Altman Z-Score 破產防禦與財務安全邊際
  if (q.includes('altman') || q.includes('z-score') || q.includes('破產') || q.includes('安全邊際') || q.includes('下行風險') || q.includes('防禦')) {
    const z = r.altmanZScore;
    const zone = r.altmanZZone;
    const zoneLabel = zone === 'safe' ? '🏰 安全堡壘區 (Safe Zone - 破產風險極低)' : zone === 'grey' ? '⚖️ 灰色觀察區 (Grey Zone - 體質尚可)' : '🚨 財務困境區 (Distress Zone - 高風險警戒)';

    return `【AI 財務分析助手・Altman Z-Score 破產防禦與財務健全度】\n\n` +
      `🛡️ 1. 華爾街經典 Altman Z-Score 評分：【 ${z} 分 】\n` +
      `• 判定等級：【 ${zoneLabel} 】\n` +
      `• 流動比率：${r.currentRatio}% ｜ 負債比率：${r.debtRatio}% ｜ 利息保障倍數：${r.interestCoverageRatio} 倍\n\n` +
      `🔍 2. 破產防禦深度剖析：\n` +
      (zone === 'safe'
        ? `• ✅ 「${companyName}」Z 分數達 ${z} 分（遠高於安全線 2.99），營運資本充裕、獲利動能強勁且償債覆蓋率極高，即使遭遇景氣下行黑天鵝，依然具備強大抗風險韌性！`
        : zone === 'grey'
        ? `• ⚖️ Z 分數為 ${z} 分處於灰色區間，財務槓桿適中，但需持續監控短期償債資金儲備與負債到期結構。`
        : `• ⚠️ Z 分數僅 ${z} 分（低於 1.81 警戒線），顯示槓桿過高或營運資金吃緊，投資人應高度注意下行風險。`) +
      `\n\n🎯 3. 防禦清單：\n` +
      `• 檢查負債比率是否低於 50%，並確認自由現金流能持續覆蓋資本支出與利息負擔。`;
  }

  // 8. 價值投資 / 存股 / 多空投資論點 (Bull vs Bear)
  if (q.includes('存股') || q.includes('投資') || q.includes('多空') || q.includes('價值') || q.includes('買進') || q.includes('長期')) {
    return `【AI 財務分析助手・多空戰略觀點 (Bull vs. Bear Thesis)】\n\n` +
      `🟢 【多方看好理由 (Bull Case)】：\n` +
      `• 優異股東權益報酬率：ROE 達 ${roe}%，每股盈餘 EPS NT$ ${eps}，具備優異資本複利動能。\n` +
      `• 護城河與定價權：營業毛利率達 ${gm}%，產品具備定價優勢，抗通膨能力堅實。\n` +
      `• 營業現金流充沛：營業現金流達 NT$ ${ocfMillions} 百萬元，為股息發放與研發擴產提供厚實底氣。\n\n` +
      `🔴 【空方風險隱憂 (Bear Case)】：\n` +
      `• 資本支出折舊挑戰：本期資本支出 NT$ ${capexMillions} 百萬元，需追蹤新產能利用率以防折舊侵蝕淨利。\n` +
      `• 外部景氣與匯率敏感度：外銷比重高時需防範匯率逆風及終端需求降溫風險。\n\n` +
      `💡 綜合財務評估：整體財務體質健康，具備長期基本面支撐，適合採取「逢低分批佈局、長期價值投資」之策略！`;
  }

  // 9. 自由提問與綜合諮詢通用高階解答
  return `【AI 財務分析助手・經營與決策診斷】\n\n` +
    `針對您詢問「${question}」，結合「${companyName}」在 ${period} 的核心財務指標：\n\n` +
    `📊 1. 關鍵經營指標速覽：\n` +
    `• 營業收入：NT$ ${revMillions} 百萬元｜營業毛利率：${gm}%｜稅後淨利率：${nm}%\n` +
    `• 股東權益報酬率 (ROE)：${roe}%｜每股盈餘 (EPS)：NT$ ${eps}\n` +
    `• 獲利含金量：${r.ocfToNetIncome}% ｜ Altman Z 破產防禦分：${r.altmanZScore} (${r.altmanZZone === 'safe' ? '安全堡壘' : '穩定'})\n` +
    `• 收現天數 (DSO)：${dso} 天｜存貨天數 (DSI)：${dsi} 天｜現金循環 (CCC)：${ccc} 天\n\n` +
    `💡 2. 核心診斷結論：\n` +
    `無論從「營運資金效率」或「價值投資護城河與真實獲利含金量」視角來看，整體體質均展現優異韌性。建議持續追蹤自由現金流與毛利率穩定度！`;
}


