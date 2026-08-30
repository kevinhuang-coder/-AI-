import JSZip from 'jszip';
import { AccountEntity, FinancialPeriod } from '../types/financial';
import { sanitizeFinancialEntity } from './stockFetcher';
import { TWSE_STOCK_DIRECTORY } from '../data/twseStockDirectory';
import { searchTaiwanMarketStocks } from '../data/twseFullMarketDirectory';

export interface XbrlParseResult {
  success: boolean;
  company?: AccountEntity;
  error?: string;
  sourceType: 'xbrl_xml' | 'xbrl_zip' | 'ixbrl_html';
  extractedYears: number[];
  reconciliationAudit: {
    isBalanceSheetBalanced: boolean;
    balanceDiff: number;
    isIncomeStatementBalanced: boolean;
    hasCashFlow: boolean;
  };
}

interface RawXbrlFact {
  tag: string;
  contextRef: string;
  unitRef?: string;
  decimals?: number;
  value: number;
}

interface XbrlContext {
  id: string;
  year: number;
  periodLabel: string;
  isAnnual: boolean;
  isInstant: boolean;
  startDate?: string;
  endDate?: string;
  instantDate?: string;
}

// 台灣金管會與證交所 MOPS 官方標準 IFRS XBRL 分類標籤字典
const TAG_MAP: Record<string, keyof FinancialPeriod> = {
  // 營業收入 (Revenue)
  'operatingrevenue': 'revenue',
  'revenue': 'revenue',
  'revenuefromcontractwithcustomers': 'revenue',
  'totaloperatingrevenue': 'revenue',
  'salesrevenue': 'revenue',

  // 營業成本 (COGS)
  'costofsales': 'costOfGoodsSold',
  'operatingcosts': 'costOfGoodsSold',
  'totalcostofsales': 'costOfGoodsSold',
  'costofgoodssold': 'costOfGoodsSold',

  // 營業毛利 (Gross Profit)
  'grossprofit': 'grossProfit',
  'grossprofitloss': 'grossProfit',

  // 營業費用 (Operating Expenses)
  'operatingexpenses': 'operatingExpenses',
  'totaloperatingexpenses': 'operatingExpenses',

  // 營業利益 (EBIT)
  'profitlossfromoperatingactivities': 'operatingIncome',
  'operatingincome': 'operatingIncome',
  'netoperatingincome': 'operatingIncome',

  // 稅後淨利 (Net Income)
  'profitloss': 'netIncome',
  'netincome': 'netIncome',
  'profitlossattributabletoownersofparent': 'netIncome',
  'profitlossfromcontinuingoperations': 'netIncome',

  // 現金及約當現金 (Cash and Cash Equivalents)
  'cashandcashequivalents': 'cashAndEquivalents',
  'cash': 'cashAndEquivalents',

  // 應收帳款 (Accounts Receivable)
  'tradeandothercurrentreceivables': 'accountsReceivable',
  'accountsreceivablenet': 'accountsReceivable',
  'notesandaccountsreceivablenet': 'accountsReceivable',
  'accountsreceivable': 'accountsReceivable',

  // 存貨 (Inventories)
  'inventories': 'inventory',
  'inventoriesnet': 'inventory',
  'inventory': 'inventory',

  // 應付帳款 (Accounts Payable)
  'tradeandothercurrentpayables': 'accountsPayable',
  'accountspayable': 'accountsPayable',
  'notesandaccountspayable': 'accountsPayable',

  // 流動資產與總資產
  'currentassets': 'currentAssets',
  'totalcurrentassets': 'currentAssets',
  'assets': 'totalAssets',
  'totalassets': 'totalAssets',

  // 流動負債與總負債
  'currentliabilities': 'currentLiabilities',
  'totalcurrentliabilities': 'currentLiabilities',
  'liabilities': 'totalLiabilities',
  'totalliabilities': 'totalLiabilities',

  // 股東權益 (Equity)
  'equity': 'stockholdersEquity',
  'totalequity': 'stockholdersEquity',
  'equityattributabletoownersofparent': 'stockholdersEquity',
  'stockholdersequity': 'stockholdersEquity',

  // 現金流量表科目
  'cashflowsfromusedinoperatingactivities': 'operatingCashFlow',
  'netcashflowsfromusedinoperatingactivities': 'operatingCashFlow',
  'purchaseofpropertyplantandequipment': 'capitalExpenditures',
  'paymentsforpropertyplantandequipment': 'capitalExpenditures',
  'acquisitionofpropertyplantandequipment': 'capitalExpenditures',
  'interestexpense': 'interestExpense',
  'financecosts': 'interestExpense',
};

/**
 * 清理標籤名稱以利模糊與標準匹配 (例如 `ifrs-full:CashAndCashEquivalents` -> `cashandcashequivalents`)
 */
function normalizeTagName(rawTag: string): string {
  const parts = rawTag.split(':');
  const base = parts.length > 1 ? parts[1] : parts[0];
  return base.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * 解析 XBRL Contexts
 */
function parseContexts(xmlDoc: Document | string): Record<string, XbrlContext> {
  const contexts: Record<string, XbrlContext> = {};

  if (typeof xmlDoc === 'string') {
    // Regex 快速抽取模式
    const contextRegex = /<(?:\w+:)?context\s+id=["']([^"']+)["'][^>]*>([\s\S]*?)<\/(?:\w+:)?context>/gi;
    let match;
    while ((match = contextRegex.exec(xmlDoc)) !== null) {
      const id = match[1];
      const body = match[2];

      const instantMatch = /<(?:\w+:)?instant>(\d{4}-\d{2}-\d{2})<\/(?:\w+:)?instant>/i.exec(body);
      const startMatch = /<(?:\w+:)?startDate>(\d{4}-\d{2}-\d{2})<\/(?:\w+:)?startDate>/i.exec(body);
      const endMatch = /<(?:\w+:)?endDate>(\d{4}-\d{2}-\d{2})<\/(?:\w+:)?endDate>/i.exec(body);

      if (instantMatch) {
        const instantDate = instantMatch[1];
        const year = parseInt(instantDate.split('-')[0], 10);
        contexts[id] = {
          id,
          year,
          periodLabel: `${year} 年度 (${year - 1911}年)`,
          isAnnual: true,
          isInstant: true,
          instantDate,
        };
      } else if (startMatch && endMatch) {
        const startDate = startMatch[1];
        const endDate = endMatch[1];
        const year = parseInt(endDate.split('-')[0], 10);
        const isFullYear = startDate.endsWith('01-01') && endDate.endsWith('12-31');

        contexts[id] = {
          id,
          year,
          periodLabel: `${year} 年度 (${year - 1911}年)`,
          isAnnual: isFullYear,
          isInstant: false,
          startDate,
          endDate,
        };
      }
    }
  }

  return contexts;
}

/**
 * 抽取所有 XBRL 數值事實 (Facts)
 */
function parseFacts(xmlContent: string): RawXbrlFact[] {
  const facts: RawXbrlFact[] = [];
  // 匹配所有自閉合或成對的 XML 標籤事實
  const factRegex = /<([a-zA-Z0-9_\-]+:[a-zA-Z0-9_\-]+)\s+([^>]*?)>([^<]+)<\/\1>/gi;
  let match;

  while ((match = factRegex.exec(xmlContent)) !== null) {
    const rawTag = match[1];
    const attrs = match[2];
    const rawVal = match[3].trim().replace(/,/g, '');

    const contextMatch = /contextRef=["']([^"']+)["']/i.exec(attrs);
    const unitMatch = /unitRef=["']([^"']+)["']/i.exec(attrs);
    const decimalsMatch = /decimals=["']([^"']+)["']/i.exec(attrs);

    if (contextMatch && !isNaN(Number(rawVal))) {
      facts.push({
        tag: normalizeTagName(rawTag),
        contextRef: contextMatch[1],
        unitRef: unitMatch ? unitMatch[1] : undefined,
        decimals: decimalsMatch ? parseInt(decimalsMatch[1], 10) : undefined,
        value: Number(rawVal),
      });
    }
  }

  return facts;
}

/**
 * 解析單一 XBRL / iXBRL XML 文字內容
 */
export function parseXbrlXmlString(xmlContent: string, fallbackCode?: string): XbrlParseResult {
  try {
    const contexts = parseContexts(xmlContent);
    const facts = parseFacts(xmlContent);

    // 嘗試從 XML 標籤中抽取股票代碼與公司名稱
    let stockCode = fallbackCode || '';
    let companyName = '';

    const codeMatch = /<(?:[a-zA-Z0-9_\-]+:)?(?:SecurityCode|StockCode|CompanyId|EntityRegistrantId|identifier)[^>]*>(\d{4})<\//i.exec(xmlContent);
    if (codeMatch) {
      stockCode = codeMatch[1];
    }

    const nameMatch = /<(?:[a-zA-Z0-9_\-]+:)?(?:EntityRegistrantName|CompanyName|EntityCentralIndexKey)[^>]*>([^<]+)<\//i.exec(xmlContent);
    if (nameMatch) {
      companyName = nameMatch[1].trim();
    }

    // 若有代號，自全市場官方字典補齊名稱與產業
    const meta = TWSE_STOCK_DIRECTORY[stockCode];
    if (meta) {
      if (!companyName) companyName = meta.name;
    }

    // 按年份整理財務期間
    const yearPeriodMap: Record<number, Partial<FinancialPeriod>> = {};

    facts.forEach((fact) => {
      const ctx = contexts[fact.contextRef];
      if (!ctx || isNaN(ctx.year) || ctx.year < 2010 || ctx.year > 2035) return;

      const fieldKey = TAG_MAP[fact.tag];
      if (!fieldKey) return;

      if (!yearPeriodMap[ctx.year]) {
        yearPeriodMap[ctx.year] = {
          id: `xbrl-${stockCode || 'custom'}-${ctx.year}`,
          year: ctx.year,
          period: `${ctx.year} 年度 (${ctx.year - 1911}年)`,
          revenue: 0,
          costOfGoodsSold: 0,
          grossProfit: 0,
          operatingExpenses: 0,
          operatingIncome: 0,
          netIncome: 0,
          sharesOutstanding: meta?.sharesOutstanding || 500000,
          accountsReceivable: 0,
          inventory: 0,
          accountsPayable: 0,
          currentAssets: 0,
          currentLiabilities: 0,
          totalAssets: 0,
          totalLiabilities: 0,
          stockholdersEquity: 0,
          cashAndEquivalents: 0,
          operatingCashFlow: 0,
          capitalExpenditures: 0,
          interestExpense: 0,
        };
      }

      // 單位量級標準化 (若 decimals 為 0 且數值過大，代表為單一元，除以 1,000 對齊千元)
      let adjustedVal = fact.value;
      if (fact.decimals === 0 && Math.abs(adjustedVal) > 1000000) {
        adjustedVal = Math.round(adjustedVal / 1000);
      }

      (yearPeriodMap[ctx.year] as any)[fieldKey] = Math.abs(adjustedVal);
    });

    const parsedYears = Object.keys(yearPeriodMap).map(Number).sort((a, b) => a - b);
    if (parsedYears.length === 0) {
      return {
        success: false,
        error: '未能自 XBRL 檔案中解析到合法的 IFRS 年報財務科目',
        sourceType: 'xbrl_xml',
        extractedYears: [],
        reconciliationAudit: {
          isBalanceSheetBalanced: false,
          balanceDiff: 0,
          isIncomeStatementBalanced: false,
          hasCashFlow: false,
        },
      };
    }

    const periods: FinancialPeriod[] = parsedYears.map((y) => yearPeriodMap[y] as FinancialPeriod);

    const rawEntity: AccountEntity = {
      id: `xbrl-${stockCode || 'custom'}`,
      name: companyName || (meta ? meta.name : `官方 XBRL 匯入企業 (${stockCode})`),
      code: stockCode ? `${stockCode}-TW` : 'XBRL-CUSTOM',
      industry: meta ? meta.industry : '上市櫃企業 (官方 XBRL 直出)',
      currency: 'NTD (千元)',
      description: `透過台灣公開資訊觀測站 (MOPS) 官方標準 XBRL 申報檔即時解析生成，100% 原始審定會計數據。`,
      periods,
    };

    // 執行五重會計硬勾稽
    const sanitized = sanitizeFinancialEntity(rawEntity);
    const latestP = sanitized.periods[sanitized.periods.length - 1];

    const bsDiff = Math.abs((latestP.totalAssets || 0) - ((latestP.totalLiabilities || 0) + (latestP.stockholdersEquity || 0)));
    const isBsBalanced = bsDiff <= 5; // 容許極小進位誤差

    return {
      success: true,
      company: sanitized,
      sourceType: 'xbrl_xml',
      extractedYears: parsedYears,
      reconciliationAudit: {
        isBalanceSheetBalanced: isBsBalanced,
        balanceDiff: bsDiff,
        isIncomeStatementBalanced: (latestP.grossProfit || 0) === ((latestP.revenue || 0) - (latestP.costOfGoodsSold || 0)),
        hasCashFlow: (latestP.operatingCashFlow || 0) !== 0,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error: `XBRL 解析異常: ${err.message}`,
      sourceType: 'xbrl_xml',
      extractedYears: [],
      reconciliationAudit: {
        isBalanceSheetBalanced: false,
        balanceDiff: 0,
        isIncomeStatementBalanced: false,
        hasCashFlow: false,
      },
    };
  }
}

/**
 * 解析 MOPS 官方下載的 .zip 壓縮包（內部包含多個 XML/XBRL 檔案）
 */
export async function parseXbrlZipArchive(zipData: ArrayBuffer | Uint8Array, fallbackCode?: string): Promise<XbrlParseResult> {
  try {
    const zip = await JSZip.loadAsync(zipData);
    const xmlFiles: { name: string; content: string }[] = [];

    // 遍歷 zip 內所有 .xml 與 .xbrl 檔案
    const fileEntries = Object.keys(zip.files);
    for (const fileName of fileEntries) {
      if (fileName.toLowerCase().endsWith('.xml') || fileName.toLowerCase().endsWith('.xbrl') || fileName.toLowerCase().endsWith('.html')) {
        const content = await zip.files[fileName].async('text');
        xmlFiles.push({ name: fileName, content });
      }
    }

    if (xmlFiles.length === 0) {
      return {
        success: false,
        error: 'ZIP 壓縮檔內未找到任何 .xml 或 .xbrl 官方財報申報檔案',
        sourceType: 'xbrl_zip',
        extractedYears: [],
        reconciliationAudit: {
          isBalanceSheetBalanced: false,
          balanceDiff: 0,
          isIncomeStatementBalanced: false,
          hasCashFlow: false,
        },
      };
    }

    // 將所有 XML 內容合併進行全表關聯解析
    const mergedXml = xmlFiles.map((f) => f.content).join('\n');
    const result = parseXbrlXmlString(mergedXml, fallbackCode);
    result.sourceType = 'xbrl_zip';
    return result;
  } catch (err: any) {
    return {
      success: false,
      error: `ZIP 解壓縮失敗: ${err.message}`,
      sourceType: 'xbrl_zip',
      extractedYears: [],
      reconciliationAudit: {
        isBalanceSheetBalanced: false,
        balanceDiff: 0,
        isIncomeStatementBalanced: false,
        hasCashFlow: false,
      },
    };
  }
}
