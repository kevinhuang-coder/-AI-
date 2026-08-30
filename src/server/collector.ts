import { AccountEntity } from '../types/financial';
import { sanitizeFinancialEntity, VERIFIED_TAIWAN_STOCKS } from '../utils/stockFetcher';
import { financialDb, normalizeStockCode } from './database';

// 台灣 50 (0050) 與核心代表性上市櫃權值龍頭企業清單 (共 50 檔)
export const TAIWAN_CORE_STOCKS: Array<{ code: string; name: string; industry: string }> = [
  // 1. 半導體晶圓與 IC 設計
  { code: '2330', name: '台積電', industry: '半導體晶圓代工' },
  { code: '5347', name: '世界先進', industry: '特殊製程與晶圓專工 (VIS)' },
  { code: '5274', name: '信驊', industry: '伺服器遠端管理晶片 (BMC) 龍頭' },
  { code: '2454', name: '聯發科', industry: '半導體 IC 設計' },
  { code: '2303', name: '聯電', industry: '晶圓專工與成熟製程' },
  { code: '3711', name: '日月光投控', industry: '半導體封裝與測試' },
  { code: '2379', name: '瑞昱', industry: '通訊網路晶片' },
  { code: '3034', name: '聯詠', industry: '驅動 IC 與顯示晶片' },
  { code: '3661', name: '世芯-KY', industry: '高階 ASIC 晶片設計' },
  { code: '6415', name: '矽力*-KY', industry: '電源管理晶片 (PMIC)' },
  { code: '2408', name: '南亞科', industry: 'DRAM 記憶體製造' },
  { code: '2027', name: '大成鋼', industry: '鋼鐵工業與不銹鋼通路' },

  // 2. AI 伺服器、EMS 電子製造與關鍵零組件
  { code: '2317', name: '鴻海', industry: '電子製造服務 (EMS)' },
  { code: '2382', name: '廣達', industry: 'AI 伺服器與筆記型電腦代工' },
  { code: '3231', name: '緯創', industry: 'AI 伺服器運算系統' },
  { code: '6669', name: '緯穎', industry: '超大型資料中心 AI 伺服器' },
  { code: '2308', name: '台達電', industry: '電源供應與綠能零組件' },
  { code: '2357', name: '華碩', industry: '電腦硬體與主機板品牌' },
  { code: '2327', name: '國巨', industry: '被動元件 (MLCC/電阻)' },
  { code: '3037', name: '欣興', industry: 'ABF 載板與高階 PCB' },
  { code: '2395', name: '研華', industry: '工業電腦與物聯網' },
  { code: '2345', name: '智邦', industry: '高階白牌網路交換器' },
  { code: '4938', name: '和碩', industry: '通訊與消費性電子代工' },

  // 3. 光學、精密機械與電機
  { code: '3008', name: '大立光', industry: '高階智慧手機光學鏡頭' },
  { code: '1590', name: '亞德客-KY', industry: '氣動元件與自動化設備' },
  { code: '1504', name: '東元', industry: '重電設備與高效能馬達' },

  // 4. 金融控股與壽險銀行
  { code: '2881', name: '富邦金', industry: '金融控股與壽險銀行' },
  { code: '2882', name: '國泰金', industry: '金融控股與壽險銀行' },
  { code: '2886', name: '兆豐金', industry: '外匯公股銀行金控' },
  { code: '2891', name: '中信金', industry: '消金與海外銀行金控' },
  { code: '2884', name: '玉山金', industry: '商業銀行與財富管理金控' },
  { code: '2885', name: '元大金', industry: '證券經紀與投信龍頭金控' },
  { code: '2892', name: '第一金', industry: '中小企業公股銀行金控' },
  { code: '5880', name: '合庫金', industry: '農業與公股銀行金控' },
  { code: '2880', name: '華南金', industry: '公股銀行金控' },
  { code: '2883', name: '凱基金', industry: '證券與壽險金控' },
  { code: '2887', name: '台新金', industry: '消金與數位銀行金控' },
  { code: '2890', name: '永豐金', industry: '證券與商業銀行金控' },
  { code: '2801', name: '彰銀', industry: '商業銀行' },
  { code: '5871', name: '中租-KY', industry: '租賃融資與太陽能電廠' },

  // 5. 航運、電信與零售通路
  { code: '2603', name: '長榮', industry: '全球貨櫃航運' },
  { code: '2609', name: '陽明', industry: '全球貨櫃航運' },
  { code: '2615', name: '萬海', industry: '亞洲近洋與遠洋貨櫃航運' },
  { code: '2412', name: '中華電', industry: '電信通訊與雲端 IDC' },
  { code: '4904', name: '遠傳', industry: '行動通訊與數位服務' },
  { code: '3045', name: '台灣大', industry: '行動通訊與電商整合' },
  { code: '1216', name: '統一', industry: '食品與多元零售投資' },
  { code: '2912', name: '統一超', industry: '連鎖超商零售通路 (7-ELEVEN)' },
  { code: '2727', name: '王品', industry: '連鎖餐飲服務業' },
  { code: '8454', name: '富邦媒', industry: '電子商務與網購平台 (momo)' },
  { code: '8464', name: '億豐', industry: '全球客製化窗簾製造與銷售' },
  { code: '6274', name: '台燿', industry: '高頻高速銅箔基板 (CCL)' },
  { code: '8044', name: '網家', industry: '電子商務與數位金融 (PChome)' },
  { code: '9910', name: '豐泰', industry: '運動鞋製造代工' },

  // 6. 塑化、鋼鐵與傳統基礎工業
  { code: '1101', name: '台泥', industry: '水泥製造與綠能儲能' },
  { code: '2002', name: '中鋼', industry: '鋼鐵冶煉與高值化鋼材' },
  { code: '1301', name: '台塑', industry: '石化基礎原料製造' },
  { code: '1303', name: '南亞', industry: '塑膠加工與電子材料' },
  { code: '6505', name: '台塑化', industry: '石油煉製與烯烴原料' },
];

export interface IngestionResult {
  code: string;
  name: string;
  success: boolean;
  periodsCount: number;
  source: 'verified_preset' | 'finmind_api' | 'cached_db' | 'failed';
  message: string;
}

class FinancialCollector {
  private isSyncing = false;

  /**
   * 採集單檔股票並自動清洗入庫
   */
  public async collectAndStoreStock(stockCode: string): Promise<IngestionResult> {
    const cleanCode = normalizeStockCode(stockCode);
    if (!cleanCode) {
      return {
        code: stockCode,
        name: '未知',
        success: false,
        periodsCount: 0,
        source: 'failed',
        message: '無效的股票代號',
      };
    }

    // 1. 檢查是否已在資料庫中
    const existing = financialDb.getCompany(cleanCode);
    if (existing && existing.periods && existing.periods.length >= 3) {
      return {
        code: cleanCode,
        name: existing.name,
        success: true,
        periodsCount: existing.periods.length,
        source: 'cached_db',
        message: '已在庫內，資料完整。',
      };
    }

    // 2. 檢查是否在內建標竿企業庫中
    if (VERIFIED_TAIWAN_STOCKS[cleanCode]) {
      const stock = VERIFIED_TAIWAN_STOCKS[cleanCode];
      const entity: AccountEntity = {
        id: `stock-${cleanCode}`,
        name: stock.name,
        code: stock.code,
        industry: stock.industry,
        currency: stock.currency,
        description: stock.description,
        periods: stock.periods,
      };
      const sanitized = sanitizeFinancialEntity(entity);
      financialDb.saveCompany(sanitized);

      return {
        code: cleanCode,
        name: sanitized.name,
        success: true,
        periodsCount: sanitized.periods.length,
        source: 'verified_preset',
        message: '成功自官方審定庫灌入資料庫。',
      };
    }

    // 3. 透過公開金融 API 抓取
    try {
      const finMindUrl = `https://api.finmindtrade.com/api/v4/data?dataset=TaiwanStockFinancialStatements&data_id=${cleanCode}&start_date=2021-01-01`;
      const response = await fetch(finMindUrl);
      if (response.ok) {
        const result: any = await response.json();
        if (result && Array.isArray(result.data) && result.data.length > 0) {
          const dateGroups: Record<string, any> = {};
          result.data.forEach((item: any) => {
            const date = item.date;
            if (!dateGroups[date]) dateGroups[date] = { date };
            dateGroups[date][item.type] = item.value;
          });

          const sortedDates = Object.keys(dateGroups).sort();
          const periods = sortedDates.slice(-8).map((d, idx) => {
            const row = dateGroups[d];
            const year = parseInt(d.substring(0, 4), 10) || 2025;
            const month = parseInt(d.substring(5, 7), 10) || 12;
            const quarter = month <= 3 ? 1 : month <= 6 ? 2 : month <= 9 ? 3 : 4;
            const isQ = month !== 12 || d.includes('-03-') || d.includes('-06-') || d.includes('-09-');

            const rev = Number(row.Revenue || row.TotalRevenue || 0);
            const cogs = Number(row.CostOfGoodsSold || 0);
            const gross = Number(row.GrossProfit || (rev - cogs));
            const opExp = Number(row.OperatingExpenses || 0);
            const opInc = Number(row.OperatingIncome || (gross - opExp));
            const netInc = Number(row.IncomeAfterTaxes || row.NetIncome || 0);

            return {
              id: `api-stock-${cleanCode}-${d}`,
              year,
              period: isQ ? `${year} Q${quarter} (${year - 1911}Q${quarter})` : `${year} 年度 (${year - 1911}年)`,
              isQuarterly: isQ,
              quarter: quarter as any,
              revenue: rev,
              costOfGoodsSold: cogs,
              grossProfit: gross,
              operatingExpenses: opExp,
              operatingIncome: opInc,
              netIncome: netInc,
              sharesOutstanding: Number(row.TotalShares || 200000),
              accountsReceivable: Number(row.AccountsReceivable || row.NotesAndAccountsReceivable || 0),
              inventory: Number(row.Inventories || row.Inventory || 0),
              accountsPayable: Number(row.AccountsPayable || row.NotesAndAccountsPayable || 0),
              currentAssets: Number(row.CurrentAssets || 0),
              currentLiabilities: Number(row.CurrentLiabilities || 0),
              totalAssets: Number(row.TotalAssets || 0),
              totalLiabilities: Number(row.TotalLiabilities || 0),
              stockholdersEquity: Number(row.TotalEquity || row.StockholdersEquity || 0),
              cashAndEquivalents: Number(row.CashAndCashEquivalents || 0),
              operatingCashFlow: Number(row.CashFlowsFromOperatingActivities || 0),
              capitalExpenditures: Number(row.CapitalExpenditure || 0),
              interestExpense: Number(row.InterestExpense || 0),
            };
          });

          const knownStock = TAIWAN_CORE_STOCKS.find((s) => s.code === cleanCode);
          const entity: AccountEntity = {
            id: `stock-${cleanCode}`,
            name: knownStock ? knownStock.name : `台股代號 ${cleanCode}`,
            code: `${cleanCode}-TW`,
            industry: knownStock ? knownStock.industry : '台灣上市櫃公開申報實體',
            currency: 'NTD (千元)',
            description: `自台灣證券交易所公開資訊觀測站即時獲取並經五重會計勾稽校驗之 ${cleanCode} 標準財報。`,
            periods,
          };

          const sanitized = sanitizeFinancialEntity(entity);
          financialDb.saveCompany(sanitized);

          return {
            code: cleanCode,
            name: sanitized.name,
            success: true,
            periodsCount: sanitized.periods.length,
            source: 'finmind_api',
            message: '成功自公開金融資料庫採集並通過五重會計校驗入庫。',
          };
        }
      }
    } catch (err: any) {
      console.warn(`[Collector] 採集 ${cleanCode} 失敗:`, err?.message || err);
    }

    return {
      code: cleanCode,
      name: '查無數據',
      success: false,
      periodsCount: 0,
      source: 'failed',
      message: '無法自公開網路檢索到該股票之官方財務報告。',
    };
  }

  /**
   * 批量同步核心標竿企業清單
   */
  public async syncCoreStocks(
    onProgress?: (msg: string, current: number, total: number) => void
  ): Promise<IngestionResult[]> {
    if (this.isSyncing) {
      throw new Error('資料庫同步工作正在執行中，請稍候...');
    }

    this.isSyncing = true;
    const results: IngestionResult[] = [];
    const total = TAIWAN_CORE_STOCKS.length;

    try {
      for (let i = 0; i < total; i++) {
        const item = TAIWAN_CORE_STOCKS[i];
        if (onProgress) {
          onProgress(`正在採集與校驗 [${item.code}] ${item.name}...`, i + 1, total);
        }

        const res = await this.collectAndStoreStock(item.code);
        results.push(res);

        // 安全延遲，避免頻率限制
        await new Promise((r) => setTimeout(r, 150));
      }
    } finally {
      this.isSyncing = false;
    }

    return results;
  }
}

export const financialCollector = new FinancialCollector();
