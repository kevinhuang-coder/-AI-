import { AccountEntity, FinancialPeriod } from '../types/financial';
import { VERIFIED_TAIWAN_STOCKS, sanitizeFinancialEntity } from '../utils/stockFetcher';

export const SAMPLE_COMPANIES: AccountEntity[] = [
  sanitizeFinancialEntity({
    id: 'company-tsmc-2330',
    name: VERIFIED_TAIWAN_STOCKS['2330'].name,
    code: VERIFIED_TAIWAN_STOCKS['2330'].code,
    industry: VERIFIED_TAIWAN_STOCKS['2330'].industry,
    currency: VERIFIED_TAIWAN_STOCKS['2330'].currency,
    description: VERIFIED_TAIWAN_STOCKS['2330'].description,
    periods: VERIFIED_TAIWAN_STOCKS['2330'].periods,
  }),
  sanitizeFinancialEntity({
    id: 'company-mediatek-2454',
    name: VERIFIED_TAIWAN_STOCKS['2454'].name,
    code: VERIFIED_TAIWAN_STOCKS['2454'].code,
    industry: VERIFIED_TAIWAN_STOCKS['2454'].industry,
    currency: VERIFIED_TAIWAN_STOCKS['2454'].currency,
    description: VERIFIED_TAIWAN_STOCKS['2454'].description,
    periods: VERIFIED_TAIWAN_STOCKS['2454'].periods,
  }),
  sanitizeFinancialEntity({
    id: 'company-foxconn-2317',
    name: VERIFIED_TAIWAN_STOCKS['2317'].name,
    code: VERIFIED_TAIWAN_STOCKS['2317'].code,
    industry: VERIFIED_TAIWAN_STOCKS['2317'].industry,
    currency: VERIFIED_TAIWAN_STOCKS['2317'].currency,
    description: VERIFIED_TAIWAN_STOCKS['2317'].description,
    periods: VERIFIED_TAIWAN_STOCKS['2317'].periods,
  }),
];

/**
 * 依多帳戶動態計算集團合併綜合數據 (Consolidated Group Aggregate)
 */
export function buildConsolidatedCompany(companies: AccountEntity[]): AccountEntity {
  if (companies.length === 0) {
    return {
      id: 'consolidated-group',
      name: '集團合併綜合報表',
      code: 'GRP-TOTAL',
      industry: '多元綜合集團 (合併報表)',
      currency: 'NTD (千元)',
      description: '多帳戶整合加總報表，消除內部關聯交易與綜合加權整體財務表現。',
      isConsolidatedGroup: true,
      periods: [],
    };
  }

  // 取得所有唯一的年份與期間
  const years = Array.from(new Set(companies.flatMap(c => c.periods.map(p => p.year)))).sort((a, b) => a - b);

  const consolidatedPeriods: FinancialPeriod[] = years.map(year => {
    let rev = 0;
    let cogs = 0;
    let gross = 0;
    let opex = 0;
    let opInc = 0;
    let net = 0;
    let ar = 0;
    let inv = 0;
    let ap = 0;
    let curAst = 0;
    let curLiab = 0;
    let totAst = 0;
    let totLiab = 0;
    let eq = 0;
    let cash = 0;
    let ocf = 0;
    let capex = 0;
    let interest = 0;
    let shares = 0;

    companies.forEach(c => {
      const p = c.periods.find(item => item.year === year);
      if (p) {
        rev += p.revenue;
        cogs += p.costOfGoodsSold;
        gross += p.grossProfit;
        opex += p.operatingExpenses;
        opInc += p.operatingIncome;
        net += p.netIncome;
        ar += p.accountsReceivable;
        inv += p.inventory;
        ap += p.accountsPayable;
        curAst += p.currentAssets;
        curLiab += p.currentLiabilities;
        totAst += p.totalAssets;
        totLiab += p.totalLiabilities;
        eq += p.stockholdersEquity;
        cash += p.cashAndEquivalents;
        ocf += p.operatingCashFlow;
        capex += p.capitalExpenditures;
        interest += (p.interestExpense || 0);
        shares = Math.max(shares, p.sharesOutstanding);
      }
    });

    return {
      id: `consolidated-${year}`,
      year,
      period: `${year} 科技三雄合併`,
      revenue: rev,
      costOfGoodsSold: cogs,
      grossProfit: gross,
      operatingExpenses: opex,
      operatingIncome: opInc,
      netIncome: net,
      sharesOutstanding: shares > 0 ? shares : 30000000,
      accountsReceivable: ar,
      inventory: inv,
      accountsPayable: ap,
      currentAssets: curAst,
      currentLiabilities: curLiab,
      totalAssets: totAst,
      totalLiabilities: totLiab,
      stockholdersEquity: eq,
      cashAndEquivalents: cash,
      operatingCashFlow: ocf,
      capitalExpenditures: capex,
      interestExpense: interest,
    };
  });

  return {
    id: 'consolidated-group',
    name: '台股科技三雄綜合觀測 (台積電 / 聯發科 / 鴻海)',
    code: 'TW-TECH3',
    industry: '半導體、IC設計與電子製造龍頭綜合',
    currency: 'NTD (千元)',
    description: '涵蓋台積電 (2330)、聯發科 (2454)、鴻海 (2317) 台灣三大權值龍頭之綜合表現，代表台灣高科技產業最核心之獲利引擎與營運趨勢。',
    isConsolidatedGroup: true,
    periods: consolidatedPeriods,
  };
}
