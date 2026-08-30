import fs from 'fs';
import path from 'path';
import { AccountEntity } from '../types/financial';
import { sanitizeFinancialEntity, VERIFIED_TAIWAN_STOCKS } from '../utils/stockFetcher';

// 資料庫檔案儲存路徑
const DB_DIR = path.resolve(process.cwd(), 'data', 'db');
const DB_FILE = path.join(DB_DIR, 'financial_warehouse.json');

export interface WarehouseSchema {
  version: string;
  lastUpdated: string;
  metadata: {
    engine: string;
    description: string;
  };
  companies: Record<string, AccountEntity>;
}

export function normalizeStockCode(code: string): string {
  if (!code) return '';
  return code.trim().toUpperCase().replace(/-?TW$/i, '').replace(/[^0-9A-Z]/g, '').replace(/TW$/i, '');
}

class FinancialDatabase {
  private cache: WarehouseSchema = {
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
    metadata: {
      engine: 'Antigravity Taiwan Financial Warehouse Engine',
      description: '台灣上市櫃公司官方會計師查核審定純年報結構化資料庫',
    },
    companies: {},
  };

  private isLoaded = false;

  constructor() {
    this.init();
  }

  /**
   * 初始化資料庫目錄與預設標竿企業
   */
  private init() {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed.companies === 'object') {
          // 自動遷移修復鍵名（如 2002TW -> 2002）
          const cleanedCompanies: Record<string, AccountEntity> = {};
          Object.entries(parsed.companies as Record<string, AccountEntity>).forEach(([k, comp]) => {
            const cleanKey = normalizeStockCode(k);
            cleanedCompanies[cleanKey] = sanitizeFinancialEntity({
              ...comp,
              code: `${cleanKey}-TW`,
            });
          });

          // 強制灌入並覆蓋官方最新審定之 5 年四大表數據
          Object.entries(VERIFIED_TAIWAN_STOCKS).forEach(([code, stock]) => {
            const cleanKey = normalizeStockCode(code);
            cleanedCompanies[cleanKey] = sanitizeFinancialEntity({
              id: `stock-${cleanKey}`,
              name: stock.name,
              code: `${cleanKey}-TW`,
              industry: stock.industry,
              currency: stock.currency,
              description: stock.description,
              periods: stock.periods,
            });
          });

          parsed.companies = cleanedCompanies;
          this.cache = parsed;
          this.saveToDisk();
          this.isLoaded = true;
          console.log(`[Financial DB] 成功加載並校驗資料庫，共收錄 ${Object.keys(this.cache.companies).length} 家企業。`);
          return;
        }
      }

      // 首次初始化：載入內建官方審定標竿股票
      console.log('[Financial DB] 首次建立資料庫，正在灌入內建官方審定標竿企業...');
      Object.entries(VERIFIED_TAIWAN_STOCKS).forEach(([code, stock]) => {
        const cleanKey = normalizeStockCode(code);
        const entity: AccountEntity = {
          id: `stock-${cleanKey}`,
          name: stock.name,
          code: `${cleanKey}-TW`,
          industry: stock.industry,
          currency: stock.currency,
          description: stock.description,
          periods: stock.periods,
        };
        this.cache.companies[cleanKey] = sanitizeFinancialEntity(entity);
      });

      this.saveToDisk();
      this.isLoaded = true;
    } catch (err) {
      console.error('[Financial DB] 初始化失敗，降級使用記憶體模式:', err);
      this.isLoaded = true;
    }
  }

  /**
   * 原子化寫入磁碟 (確保寫入安全，避免資料庫損壞)
   */
  private saveToDisk(): boolean {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      this.cache.lastUpdated = new Date().toISOString();
      const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tempFile, JSON.stringify(this.cache, null, 2), 'utf-8');
      fs.renameSync(tempFile, DB_FILE);
      return true;
    } catch (err) {
      console.error('[Financial DB] 寫入磁碟失敗:', err);
      return false;
    }
  }

  /**
   * 查詢指定股票代號之官方審定財報 (0 延遲，< 1ms)
   */
  public getCompany(stockCode: string): AccountEntity | null {
    const cleanCode = normalizeStockCode(stockCode);
    if (!cleanCode) return null;
    return this.cache.companies[cleanCode] || null;
  }

  /**
   * 寫入或更新公司財報數據 (強制通過五重會計勾稽閘門)
   */
  public saveCompany(company: AccountEntity): boolean {
    if (!company || !company.code || !Array.isArray(company.periods)) return false;
    const cleanCode = normalizeStockCode(company.code);
    
    // 強制通過五重會計勾稽防偽閘門
    const sanitized = sanitizeFinancialEntity({
      ...company,
      code: `${cleanCode}-TW`,
    });
    this.cache.companies[cleanCode] = sanitized;
    return this.saveToDisk();
  }

  /**
   * 批次寫入多檔公司財報
   */
  public saveBatchCompanies(companies: AccountEntity[]): number {
    let count = 0;
    companies.forEach((c) => {
      if (c && c.code) {
        const cleanCode = normalizeStockCode(c.code);
        this.cache.companies[cleanCode] = sanitizeFinancialEntity({
          ...c,
          code: `${cleanCode}-TW`,
        });
        count++;
      }
    });
    if (count > 0) {
      this.saveToDisk();
    }
    return count;
  }

  /**
   * 取得資料庫中所有已收錄公司清單概要
   */
  public listCompanies(): Array<{
    code: string;
    name: string;
    industry: string;
    periodsCount: number;
    yearRange: string;
    lastUpdated: string;
  }> {
    return Object.entries(this.cache.companies).map(([code, c]) => {
      const periods = c.periods || [];
      const sortedYears = periods.map((p) => p.year).sort((a, b) => a - b);
      const yearRange = sortedYears.length > 0 ? `${sortedYears[0]} ~ ${sortedYears[sortedYears.length - 1]}` : '無';
      return {
        code,
        name: c.name,
        industry: c.industry,
        periodsCount: periods.length,
        yearRange,
        lastUpdated: this.cache.lastUpdated,
      };
    });
  }

  /**
   * 取得資料庫全貌健康統計 (總收錄數、期數、容量)
   */
  public getStats(): {
    totalCompanies: number;
    totalPeriods: number;
    fileSizeBytes: number;
    fileSizeFormatted: string;
    lastUpdated: string;
    version: string;
  } {
    const companies = Object.values(this.cache.companies);
    const totalCompanies = companies.length;
    const totalPeriods = companies.reduce((sum, c) => sum + (c.periods?.length || 0), 0);

    let fileSizeBytes = 0;
    try {
      if (fs.existsSync(DB_FILE)) {
        const stat = fs.statSync(DB_FILE);
        fileSizeBytes = stat.size;
      }
    } catch {
      fileSizeBytes = JSON.stringify(this.cache).length;
    }

    const fileSizeFormatted =
      fileSizeBytes >= 1024 * 1024
        ? `${(fileSizeBytes / (1024 * 1024)).toFixed(2)} MB`
        : `${(fileSizeBytes / 1024).toFixed(1)} KB`;

    return {
      totalCompanies,
      totalPeriods,
      fileSizeBytes,
      fileSizeFormatted,
      lastUpdated: this.cache.lastUpdated,
      version: this.cache.version,
    };
  }

  /**
   * 刪除指定股票
   */
  public deleteCompany(stockCode: string): boolean {
    const cleanCode = stockCode.trim().toUpperCase().replace(/[^0-9A-Z]/g, '').replace('-TW', '');
    if (this.cache.companies[cleanCode]) {
      delete this.cache.companies[cleanCode];
      return this.saveToDisk();
    }
    return false;
  }
}

// 導出全域單例實例
export const financialDb = new FinancialDatabase();
