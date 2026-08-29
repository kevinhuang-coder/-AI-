import { FinancialPeriod } from '../types/financial';

/**
 * 依連續季度數據計算「近四季滾動 (TTM - Trailing Twelve Months)」類整年數據
 * 
 * 運算規則：
 * 1. 流量項目 (損益表、現金流量表)：以最新一季為基準，回溯加總最近連續 4 個季度的數值 (4-Quarter Sum)
 * 2. 存量項目 (資產負債表)：採用最新一季期末資產負債表的存量餘額 (Latest Quarter Ending Balance)
 */
export function computeTtmRollingPeriods(rawPeriods: FinancialPeriod[]): FinancialPeriod[] {
  if (!rawPeriods || rawPeriods.length === 0) return [];

  // 1. 分離出所有真實季度數據
  const quarterly = rawPeriods
    .filter(p => p.isQuarterly || p.quarter !== undefined || /Q[1-4]|第[1-4]季/i.test(p.period))
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      const qA = a.quarter || getQuarterFromLabel(a.period);
      const qB = b.quarter || getQuarterFromLabel(b.period);
      return qA - qB;
    });

  // 如果原本已經有至少 4 個季度，直接以滑動視窗計算真實 TTM
  if (quarterly.length >= 4) {
    const ttmResults: FinancialPeriod[] = [];

    for (let i = 3; i < quarterly.length; i++) {
      const window4 = quarterly.slice(i - 3, i + 1);
      const firstQ = window4[0];
      const latestQ = window4[3];
      const firstQNum = firstQ.quarter || getQuarterFromLabel(firstQ.period);
      const qNum = latestQ.quarter || getQuarterFromLabel(latestQ.period);

      // 4 季流量科目加總
      const rev = window4.reduce((acc, q) => acc + (q.revenue || 0), 0);
      const cogs = window4.reduce((acc, q) => acc + (q.costOfGoodsSold || 0), 0);
      const gross = window4.reduce((acc, q) => acc + (q.grossProfit || 0), 0);
      const opex = window4.reduce((acc, q) => acc + (q.operatingExpenses || 0), 0);
      const opInc = window4.reduce((acc, q) => acc + (q.operatingIncome || 0), 0);
      const net = window4.reduce((acc, q) => acc + (q.netIncome || 0), 0);
      const ocf = window4.reduce((acc, q) => acc + (q.operatingCashFlow || 0), 0);
      const capex = window4.reduce((acc, q) => acc + (q.capitalExpenditures || 0), 0);
      const interest = window4.reduce((acc, q) => acc + (q.interestExpense || 0), 0);

      ttmResults.push({
        id: `ttm-${latestQ.year}-q${qNum}`,
        year: latestQ.year,
        period: `${latestQ.year} Q${qNum} (${firstQ.year}Q${firstQNum}~${latestQ.year}Q${qNum} TTM)`,
        isQuarterly: false,
        quarter: qNum as any,
        revenue: rev,
        costOfGoodsSold: cogs,
        grossProfit: gross > 0 ? gross : (rev - cogs),
        operatingExpenses: opex,
        operatingIncome: opInc,
        netIncome: net,
        sharesOutstanding: latestQ.sharesOutstanding || 200000,
        accountsReceivable: latestQ.accountsReceivable,
        inventory: latestQ.inventory,
        accountsPayable: latestQ.accountsPayable,
        currentAssets: latestQ.currentAssets,
        currentLiabilities: latestQ.currentLiabilities,
        totalAssets: latestQ.totalAssets,
        totalLiabilities: latestQ.totalLiabilities,
        stockholdersEquity: latestQ.stockholdersEquity,
        cashAndEquivalents: latestQ.cashAndEquivalents,
        operatingCashFlow: ocf,
        capitalExpenditures: capex,
        interestExpense: interest,
      });
    }

    return ttmResults;
  }

  // 2. 若該公司只有年度數據，自動拆解並產出滾動 TTM
  const sortedAnnual = [...rawPeriods].filter(p => !p.isQuarterly).sort((a, b) => a.year - b.year);
  const derivedQuarterly: FinancialPeriod[] = [];

  sortedAnnual.forEach(ann => {
    // 依產業季節性典型權重拆解 (Q1: 22%, Q2: 24%, Q3: 26%, Q4: 28%)
    const weights = [0.22, 0.24, 0.26, 0.28];
    for (let q = 1; q <= 4; q++) {
      const w = weights[q - 1];
      derivedQuarterly.push({
        id: `derived-${ann.year}-q${q}`,
        year: ann.year,
        period: `${ann.year} Q${q}`,
        isQuarterly: true,
        quarter: q as any,
        revenue: Math.round(ann.revenue * w),
        costOfGoodsSold: Math.round(ann.costOfGoodsSold * w),
        grossProfit: Math.round(ann.grossProfit * w),
        operatingExpenses: Math.round(ann.operatingExpenses * w),
        operatingIncome: Math.round(ann.operatingIncome * w),
        netIncome: Math.round(ann.netIncome * w),
        sharesOutstanding: ann.sharesOutstanding,
        accountsReceivable: ann.accountsReceivable,
        inventory: ann.inventory,
        accountsPayable: ann.accountsPayable,
        currentAssets: ann.currentAssets,
        currentLiabilities: ann.currentLiabilities,
        totalAssets: ann.totalAssets,
        totalLiabilities: ann.totalLiabilities,
        stockholdersEquity: ann.stockholdersEquity,
        cashAndEquivalents: ann.cashAndEquivalents,
        operatingCashFlow: Math.round(ann.operatingCashFlow * w),
        capitalExpenditures: Math.round((ann.capitalExpenditures || 0) * w),
        interestExpense: Math.round((ann.interestExpense || 0) * w),
      });
    }
  });

  const ttmResults: FinancialPeriod[] = [];
  for (let i = 3; i < derivedQuarterly.length; i++) {
    const window4 = derivedQuarterly.slice(i - 3, i + 1);
    const firstQ = window4[0];
    const latestQ = window4[3];
    const firstQNum = firstQ.quarter || 1;
    const qNum = latestQ.quarter || (i % 4 + 1);

    const rev = window4.reduce((acc, q) => acc + q.revenue, 0);
    const cogs = window4.reduce((acc, q) => acc + q.costOfGoodsSold, 0);
    const gross = window4.reduce((acc, q) => acc + q.grossProfit, 0);
    const opex = window4.reduce((acc, q) => acc + q.operatingExpenses, 0);
    const opInc = window4.reduce((acc, q) => acc + q.operatingIncome, 0);
    const net = window4.reduce((acc, q) => acc + q.netIncome, 0);
    const ocf = window4.reduce((acc, q) => acc + q.operatingCashFlow, 0);
    const capex = window4.reduce((acc, q) => acc + (q.capitalExpenditures || 0), 0);
    const interest = window4.reduce((acc, q) => acc + (q.interestExpense || 0), 0);

    ttmResults.push({
      id: `ttm-roll-${latestQ.year}-q${qNum}`,
      year: latestQ.year,
      period: `${latestQ.year} Q${qNum} (${firstQ.year}Q${firstQNum}~${latestQ.year}Q${qNum} TTM)`,
      isQuarterly: false,
      quarter: qNum as any,
      revenue: rev,
      costOfGoodsSold: cogs,
      grossProfit: gross,
      operatingExpenses: opex,
      operatingIncome: opInc,
      netIncome: net,
      sharesOutstanding: latestQ.sharesOutstanding,
      accountsReceivable: latestQ.accountsReceivable,
      inventory: latestQ.inventory,
      accountsPayable: latestQ.accountsPayable,
      currentAssets: latestQ.currentAssets,
      currentLiabilities: latestQ.currentLiabilities,
      totalAssets: latestQ.totalAssets,
      totalLiabilities: latestQ.totalLiabilities,
      stockholdersEquity: latestQ.stockholdersEquity,
      cashAndEquivalents: latestQ.cashAndEquivalents,
      operatingCashFlow: ocf,
      capitalExpenditures: capex,
      interestExpense: interest,
    });
  }

  return ttmResults.slice(-6);
}

function getQuarterFromLabel(periodLabel: string): number {
  if (/Q1|第1季|第１季/i.test(periodLabel)) return 1;
  if (/Q2|第2季|第２季/i.test(periodLabel)) return 2;
  if (/Q3|第3季|第３季/i.test(periodLabel)) return 3;
  if (/Q4|第4季|第４季/i.test(periodLabel)) return 4;
  return 4;
}
