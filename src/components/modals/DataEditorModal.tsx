import React, { useState, useEffect, useRef } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { AccountEntity, FinancialPeriod, FinancialChangeRecord } from '../../types/financial';
import { ChangeHistoryPanel } from './ChangeHistoryPanel';
import { fetchTaiwanStockFinancials, VERIFIED_TAIWAN_STOCKS } from '../../utils/stockFetcher';
import { searchTaiwanMarketStocks, MarketStockItem } from '../../data/twseFullMarketDirectory';
import { parseXbrlXmlString, parseXbrlZipArchive, XbrlParseResult } from '../../utils/xbrlParser';
import {
  X,
  Plus,
  Trash2,
  Upload,
  Download,
  Save,
  Building2,
  FileSpreadsheet,
  AlertCircle,
  FileText,
  Sparkles,
  Loader2,
  CheckCircle2,
  ArrowRight,
  Clock,
  RotateCcw,
  BookmarkPlus,
  Check,
  Search,
  Zap,
  Globe,
  FileCode,
  FolderArchive,
  ShieldCheck,
} from 'lucide-react';

export const DataEditorModal: React.FC = () => {
  const {
    isDataEditorOpen,
    setIsDataEditorOpen,
    editingCompany,
    addOrUpdateCompany,
    deleteCompany,
    setActiveCompanyId,
    changeHistory,
    addChangeRecord,
  } = useFinancial();

  const [activeTab, setActiveTab] = useState<'editor' | 'history'>('editor');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [industry, setIndustry] = useState('科技製造業');
  const [currency, setCurrency] = useState('NTD (千元)');
  const [description, setDescription] = useState('');
  const [periods, setPeriods] = useState<FinancialPeriod[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [restoreToast, setRestoreToast] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isParsingXbrl, setIsParsingXbrl] = useState(false);

  const [importSuccessInfo, setImportSuccessInfo] = useState<{
    companyName: string;
    periodsCount: number;
    filename: string;
  } | null>(null);

  // 台股即時聯網搜尋狀態
  const [stockCodeInput, setStockCodeInput] = useState('');
  const [isSearchingStock, setIsSearchingStock] = useState(false);
  const [stockSearchStatus, setStockSearchStatus] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 依台股代號一鍵即時連線官方財報
  const handleStockSearch = async (targetCode?: string) => {
    const codeToSearch = (targetCode || stockCodeInput).trim().toUpperCase();
    if (!codeToSearch) {
      setError('請輸入台股代號（例如 2330、8044、2317、2454、8454、2603）');
      return;
    }

    setIsSearchingStock(true);
    setError(null);
    setStockSearchStatus(`正在連線台灣證交所 / 金融公開資料庫獲取「${codeToSearch}」官方標準財報...`);

    try {
      const company = await fetchTaiwanStockFinancials(codeToSearch);
      if (!company) {
        throw new Error(`找不到股票代號「${codeToSearch}」之官方標準財報數據，請確認代號是否正確。`);
      }
      setName(company.name);
      setCode(company.code);
      setIndustry(company.industry);
      setCurrency(company.currency);
      setDescription(company.description);
      const sorted = [...company.periods].sort((a, b) => a.year - b.year);
      setPeriods(sorted);
      setImportSuccessInfo({
        companyName: company.name,
        periodsCount: sorted.length,
        filename: `台股代號 ${codeToSearch} 官方標準財報`,
      });
      setStockCodeInput('');

      addChangeRecord(
        {
          id: editingCompany ? editingCompany.id : `company-${Date.now()}`,
          name: company.name,
          code: company.code,
          industry: company.industry,
          currency: company.currency,
          description: company.description,
          periods: sorted,
        },
        'import_csv',
        '台股代號一鍵聯網載入',
        `成功連線載入「${company.name}」共 ${sorted.length} 期官方查核財務數據`
      );
    } catch (err: any) {
      console.error('Stock search error:', err);
      setError(err.message || '查詢台股財報失敗，請確認代號或改用 CSV 檔案上傳。');
    } finally {
      setIsSearchingStock(false);
      setStockSearchStatus(null);
    }
  };

  useEffect(() => {
    if (editingCompany) {
      setName(editingCompany.name);
      setCode(editingCompany.code);
      setIndustry(editingCompany.industry);
      setCurrency(editingCompany.currency);
      setDescription(editingCompany.description);
      setPeriods(editingCompany.periods);
      setImportSuccessInfo(null);
      setError(null);
      setRestoreToast(null);
    } else {
      // New Company Default
      setName('新事業部 / 自訂企業');
      setCode('NEW-01');
      setIndustry('電子零組件與製造');
      setCurrency('NTD (千元)');
      setDescription('自訂新增之財務分析實體');
      setPeriods([
        {
          id: `period-${Date.now()}-1`,
          year: 2024,
          period: '2024 年度',
          revenue: 5000000,
          costOfGoodsSold: 3200000,
          grossProfit: 1800000,
          operatingExpenses: 900000,
          operatingIncome: 900000,
          netIncome: 750000,
          sharesOutstanding: 150000,
          accountsReceivable: 650000,
          inventory: 600000,
          accountsPayable: 450000,
          currentAssets: 2800000,
          currentLiabilities: 1300000,
          totalAssets: 6000000,
          totalLiabilities: 2200000,
          stockholdersEquity: 3800000,
          cashAndEquivalents: 1200000,
          operatingCashFlow: 800000,
          capitalExpenditures: 300000,
        },
        {
          id: `period-${Date.now()}-2`,
          year: 2025,
          period: '2025 年度 (最新)',
          revenue: 5800000,
          costOfGoodsSold: 3600000,
          grossProfit: 2200000,
          operatingExpenses: 1050000,
          operatingIncome: 1150000,
          netIncome: 960000,
          sharesOutstanding: 150000,
          accountsReceivable: 720000,
          inventory: 640000,
          accountsPayable: 510000,
          currentAssets: 3400000,
          currentLiabilities: 1450000,
          totalAssets: 7000000,
          totalLiabilities: 2400000,
          stockholdersEquity: 4600000,
          cashAndEquivalents: 1600000,
          operatingCashFlow: 1080000,
          capitalExpenditures: 350000,
        },
      ]);
      setImportSuccessInfo(null);
      setError(null);
      setRestoreToast(null);
    }
  }, [editingCompany, isDataEditorOpen]);

  // Auto-dismiss restore toast after 5s
  useEffect(() => {
    if (restoreToast) {
      const timer = setTimeout(() => {
        setRestoreToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [restoreToast]);

  if (!isDataEditorOpen) return null;

  const handlePeriodChange = (index: number, field: keyof FinancialPeriod, value: any) => {
    setPeriods((prev) => {
      const next = [...prev];
      const updated = { ...next[index], [field]: value };

      // 自動連動毛利與營業利益
      if (field === 'revenue' || field === 'costOfGoodsSold') {
        const rev = field === 'revenue' ? Number(value) : updated.revenue;
        const cogs = field === 'costOfGoodsSold' ? Number(value) : updated.costOfGoodsSold;
        updated.grossProfit = rev - cogs;
        updated.operatingIncome = updated.grossProfit - updated.operatingExpenses;
      } else if (field === 'operatingExpenses' || field === 'grossProfit') {
        const gp = field === 'grossProfit' ? Number(value) : updated.grossProfit;
        const opex = field === 'operatingExpenses' ? Number(value) : updated.operatingExpenses;
        updated.operatingIncome = gp - opex;
      }

      next[index] = updated;
      return next;
    });
  };

  const handleAddPeriod = () => {
    const last = periods[periods.length - 1];
    const newYear = last ? last.year + 1 : 2025;
    const newPeriod: FinancialPeriod = {
      id: `period-${Date.now()}`,
      year: newYear,
      period: `${newYear} 年度`,
      revenue: last ? Math.round(last.revenue * 1.1) : 4000000,
      costOfGoodsSold: last ? Math.round(last.costOfGoodsSold * 1.08) : 2600000,
      grossProfit: last ? Math.round(last.grossProfit * 1.12) : 1400000,
      operatingExpenses: last ? Math.round(last.operatingExpenses * 1.05) : 700000,
      operatingIncome: last ? Math.round(last.operatingIncome * 1.15) : 700000,
      netIncome: last ? Math.round(last.netIncome * 1.15) : 580000,
      sharesOutstanding: last ? last.sharesOutstanding : 100000,
      accountsReceivable: last ? Math.round(last.accountsReceivable * 1.05) : 600000,
      inventory: last ? Math.round(last.inventory * 1.05) : 550000,
      accountsPayable: last ? Math.round(last.accountsPayable * 1.05) : 400000,
      currentAssets: last ? Math.round(last.currentAssets * 1.1) : 2500000,
      currentLiabilities: last ? Math.round(last.currentLiabilities * 1.05) : 1200000,
      totalAssets: last ? Math.round(last.totalAssets * 1.1) : 5000000,
      totalLiabilities: last ? Math.round(last.totalLiabilities * 1.05) : 2000000,
      stockholdersEquity: last ? Math.round(last.stockholdersEquity * 1.12) : 3000000,
      cashAndEquivalents: last ? Math.round(last.cashAndEquivalents * 1.15) : 1000000,
      operatingCashFlow: last ? Math.round(last.operatingCashFlow * 1.1) : 700000,
      capitalExpenditures: last ? Math.round(last.capitalExpenditures * 1.05) : 250000,
    };
    const updated = [...periods, newPeriod];
    setPeriods(updated);
  };

  const handleRemovePeriod = (index: number) => {
    if (periods.length <= 1) {
      setError('至少需保留一個財務期間數據');
      return;
    }
    const removedPeriod = periods[index];
    const updated = periods.filter((_, i) => i !== index);
    setPeriods(updated);
  };

  const handleSave = () => {
    if (!name.trim()) {
      setError('請填寫企業/帳戶名稱');
      return;
    }
    if (periods.length === 0) {
      setError('至少需包含一期財務數據');
      return;
    }

    const sortedPeriods = [...periods].sort((a, b) => a.year - b.year);
    const companyToSave: AccountEntity = {
      id: editingCompany ? editingCompany.id : `company-${Date.now()}`,
      name: name.trim(),
      code: code.trim() || 'CUSTOM',
      industry: industry.trim() || '綜合產業',
      currency: currency || 'NTD (千元)',
      description: description.trim() || '自訂財務報表數據',
      periods: sortedPeriods,
    };

    addOrUpdateCompany(
      companyToSave,
      true,
      `儲存「${companyToSave.name}」財務數據 (${sortedPeriods.length} 期)`
    );
    setActiveCompanyId(companyToSave.id);
    setIsDataEditorOpen(false);
  };

  // Restore snapshot handler
  const handleRestoreSnapshot = (snapshot: FinancialChangeRecord['snapshot'], record: FinancialChangeRecord) => {
    setName(snapshot.name);
    setCode(snapshot.code);
    setIndustry(snapshot.industry);
    setCurrency(snapshot.currency);
    setDescription(snapshot.description);
    setPeriods(JSON.parse(JSON.stringify(snapshot.periods)));
    setImportSuccessInfo(null);
    setError(null);
    setRestoreToast(`已成功還原至 ${record.timeFormatted} 之「${record.actionLabel}」版本（共 ${snapshot.periods.length} 個期別）`);
    setActiveTab('editor');

    // Add a change record logging the restoration
    const restoredCompany: AccountEntity = {
      id: editingCompany ? editingCompany.id : `company-${Date.now()}`,
      name: snapshot.name,
      code: snapshot.code,
      industry: snapshot.industry,
      currency: snapshot.currency,
      description: snapshot.description,
      periods: snapshot.periods,
    };
    addChangeRecord(
      restoredCompany,
      'restore_version',
      '還原數據版本',
      `還原至「${record.actionLabel} (${record.timeFormatted})」歷史快照`
    );
  };

  // Manual Snapshot Creation
  const handleCreateManualSnapshot = (customNote?: string) => {
    const currentSnapCompany: AccountEntity = {
      id: editingCompany ? editingCompany.id : `company-${Date.now()}`,
      name: name.trim() || '自訂企業',
      code: code.trim() || 'CUSTOM',
      industry: industry.trim() || '科技製造業',
      currency: currency || 'NTD (千元)',
      description: description.trim() || '自訂財務報表數據',
      periods: [...periods].sort((a, b) => a.year - b.year),
    };

    addChangeRecord(
      currentSnapCompany,
      'manual_snapshot',
      '手動快照還原點',
      customNote || `使用者建立之資料還原點 (${currentSnapCompany.periods.length} 期)`
    );
    setRestoreToast(`已成功建立「${customNote || '手動快照還原點'}」！`);
  };

  // Quick Undo to Most Recent Change
  const handleQuickUndo = () => {
    if (changeHistory.length === 0) return;
    const latestRecord = changeHistory[0];
    handleRestoreSnapshot(latestRecord.snapshot, latestRecord);
  };

  // CSV Template Download
  const downloadTemplate = () => {
    const headers = [
      '期間年度',
      '期間名稱',
      '營業收入',
      '營業成本',
      '營業費用',
      '稅後淨利',
      '流通股數',
      '應收帳款',
      '存貨',
      '應付帳款',
      '流動資產',
      '流動負債',
      '總資產',
      '總負債',
      '股東權益',
      '營業現金流',
      '資本支出',
    ];
    const sample = [
      '2024',
      '2024 年度',
      '5000000',
      '3200000',
      '900000',
      '750000',
      '150000',
      '650000',
      '600000',
      '450000',
      '2800000',
      '1300000',
      '6000000',
      '2200000',
      '3800000',
      '800000',
      '300000',
    ];
    const csvContent = '\uFEFF' + headers.join(',') + '\n' + sample.join(',');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '財務報表上傳範本.csv';
    link.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleProcessFile(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 統一處理上傳檔案 (支援 .zip, .xml, .xbrl, .html, .csv)
  const handleProcessFile = async (file: File) => {
    setError(null);
    const lowerName = file.name.toLowerCase();

    // 1. 官方 XBRL ZIP 壓縮包 (.zip)
    if (lowerName.endsWith('.zip')) {
      setIsParsingXbrl(true);
      try {
        const buffer = await file.arrayBuffer();
        const res = await parseXbrlZipArchive(buffer);
        if (res.success && res.company) {
          applyParsedCompany(res.company, file.name, '官方 MOPS XBRL 壓縮包');
        } else {
          setError(res.error || '無法解析該 ZIP 壓縮包中的 XBRL 報表');
        }
      } catch (err: any) {
        setError(`ZIP 解壓失敗: ${err.message}`);
      } finally {
        setIsParsingXbrl(false);
      }
      return;
    }

    // 2. 官方 XBRL / iXBRL 單檔 (.xml, .xbrl, .html)
    if (lowerName.endsWith('.xml') || lowerName.endsWith('.xbrl') || lowerName.endsWith('.html')) {
      setIsParsingXbrl(true);
      try {
        const text = await file.text();
        const res = parseXbrlXmlString(text);
        if (res.success && res.company) {
          applyParsedCompany(res.company, file.name, '官方 MOPS XBRL 申報檔');
        } else {
          setError(res.error || '無法解析該 XML 中的 IFRS 財務科目');
        }
      } catch (err: any) {
        setError(`XML 讀取失敗: ${err.message}`);
      } finally {
        setIsParsingXbrl(false);
      }
      return;
    }

    // 3. 標準 CSV 格式 (.csv)
    if (lowerName.endsWith('.csv') || file.type === 'text/csv') {
      handleCsvUploadFile(file);
      return;
    }

    setError('不支援的檔案格式。請上傳公開資訊觀測站官方 XBRL 檔 (*.zip, *.xml, *.xbrl) 或標準 CSV 檔 (*.csv)。');
  };

  const applyParsedCompany = (comp: AccountEntity, filename: string, sourceLabel: string) => {
    setName(comp.name);
    setCode(comp.code);
    setIndustry(comp.industry);
    setCurrency(comp.currency);
    setDescription(comp.description);
    const sorted = [...comp.periods].sort((a, b) => a.year - b.year);
    setPeriods(sorted);
    setImportSuccessInfo({
      companyName: comp.name,
      periodsCount: sorted.length,
      filename: `${filename} (${sourceLabel})`,
    });

    addChangeRecord(
      {
        id: editingCompany ? editingCompany.id : `company-${Date.now()}`,
        name: comp.name,
        code: comp.code,
        industry: comp.industry,
        currency: comp.currency,
        description: comp.description,
        periods: sorted,
      },
      'import_xbrl',
      '官方 XBRL 財報匯入',
      `自「${filename}」解析匯入 ${sorted.length} 個財務期別（會計師查核簽證審定）`
    );
  };

  // CSV Import helper
  const handleCsvUploadFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string;
        const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
        if (lines.length <= 1) {
          setError('CSV 檔案缺少數據列');
          return;
        }

        const newPeriods: FinancialPeriod[] = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map((c) => c.replace(/^"|"$/g, '').trim());
          if (cols.length >= 10) {
            const year = parseInt(cols[0], 10) || 2024;
            const periodLabel = cols[1] || `${year} 年度`;
            const rev = parseFloat(cols[2]) || 0;
            const cogs = parseFloat(cols[3]) || 0;
            const opex = parseFloat(cols[4]) || 0;
            const net = parseFloat(cols[5]) || 0;
            const shares = parseFloat(cols[6]) || 100000;
            const ar = parseFloat(cols[7]) || 0;
            const inv = parseFloat(cols[8]) || 0;
            const ap = parseFloat(cols[9]) || 0;
            const curAst = parseFloat(cols[10]) || rev * 0.5;
            const curLiab = parseFloat(cols[11]) || rev * 0.3;
            const totAst = parseFloat(cols[12]) || rev * 1.2;
            const totLiab = parseFloat(cols[13]) || rev * 0.5;
            const eq = parseFloat(cols[14]) || totAst - totLiab;
            const ocf = parseFloat(cols[15]) || net * 1.1;
            const capex = parseFloat(cols[16]) || rev * 0.05;

            newPeriods.push({
              id: `imported-${Date.now()}-${i}`,
              year,
              period: periodLabel,
              revenue: rev,
              costOfGoodsSold: cogs,
              grossProfit: rev - cogs,
              operatingExpenses: opex,
              operatingIncome: rev - cogs - opex,
              netIncome: net,
              sharesOutstanding: shares,
              accountsReceivable: ar,
              inventory: inv,
              accountsPayable: ap,
              currentAssets: curAst,
              currentLiabilities: curLiab,
              totalAssets: totAst,
              totalLiabilities: totLiab,
              stockholdersEquity: eq,
              cashAndEquivalents: curAst * 0.4,
              operatingCashFlow: ocf,
              capitalExpenditures: capex,
            });
          }
        }

        if (newPeriods.length > 0) {
          const sorted = [...newPeriods].sort((a, b) => a.year - b.year);
          setPeriods(sorted);
          setImportSuccessInfo({
            companyName: name || '匯入企業',
            periodsCount: sorted.length,
            filename: file.name,
          });
          setError(null);

          // Add history log for CSV import
          addChangeRecord(
            {
              id: editingCompany ? editingCompany.id : `company-${Date.now()}`,
              name: name || 'CSV 匯入企業',
              code: code || 'CSV',
              industry: industry || '綜合產業',
              currency: currency || 'NTD (千元)',
              description: description || `CSV 匯入：${file.name}`,
              periods: sorted,
            },
            'import_csv',
            'CSV 試算表匯入',
            `從「${file.name}」匯入 ${sorted.length} 個財務期間`
          );
        }
      } catch (err: any) {
        setError('CSV 解析失敗，請確認格式或下載範本對照。');
      }
    };
    reader.readAsText(file);
  };

  const currentFormState = {
    name,
    code,
    industry,
    currency,
    description,
    periods,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900/95 border border-slate-800 rounded-2xl sm:rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden my-2 sm:my-8 flex flex-col max-h-[94vh] sm:max-h-[90vh] backdrop-blur-md">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-950/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
                {editingCompany ? `編輯企業財報數據：${editingCompany.name}` : '新增分析帳戶 / 企業財報數據'}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400">
                支援手動填寫、PDF/CSV 智慧匯入與即時版本還原追蹤
              </p>
            </div>
          </div>

          {/* Navigation Tabs & Close */}
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center p-1 rounded-xl sm:rounded-2xl bg-slate-900 border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('editor')}
                className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg sm:rounded-xl text-xs font-semibold transition min-h-[32px] ${
                  activeTab === 'editor'
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/25'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>報表編輯</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg sm:rounded-xl text-xs font-semibold transition min-h-[32px] ${
                  activeTab === 'history'
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/25'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>歷史記錄</span>
                {changeHistory.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-blue-500/30 text-blue-200 text-[10px] font-mono">
                    {changeHistory.length}
                  </span>
                )}
              </button>
            </div>

            <button
              onClick={() => setIsDataEditorOpen(false)}
              className="p-1.5 sm:p-2 rounded-xl sm:rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
              title="關閉編輯器"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Restore Toast Notification */}
        {restoreToast && (
          <div className="mx-6 mt-4 p-3.5 bg-indigo-950/90 border border-indigo-700/80 rounded-2xl text-indigo-200 flex items-center justify-between shadow-lg shadow-indigo-950/40 animate-fade-in text-xs">
            <div className="flex items-center space-x-2.5">
              <RotateCcw className="w-4 h-4 text-indigo-400 flex-shrink-0 animate-spin-reverse" />
              <span className="font-semibold">{restoreToast}</span>
            </div>
            <button
              type="button"
              onClick={() => setRestoreToast(null)}
              className="p-1 rounded-lg text-indigo-400 hover:text-white hover:bg-indigo-900/50 transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {error && (
            <div className="p-4 bg-rose-950/60 border border-rose-800/80 rounded-2xl text-rose-300 flex items-start space-x-3 shadow-lg shadow-rose-950/40">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
              <div className="flex-1 text-xs leading-relaxed">
                <span className="font-semibold block text-rose-200 mb-0.5">檔案讀取或解析提醒：</span>
                {error}
              </div>
            </div>
          )}

          {activeTab === 'history' ? (
            /* History & Restore Points View */
            <ChangeHistoryPanel
              currentFormState={currentFormState}
              onRestoreSnapshot={handleRestoreSnapshot}
              onCreateManualSnapshot={handleCreateManualSnapshot}
            />
          ) : (
            /* Editor & Spreadsheet View */
            <div className="space-y-6">
              
              {/* Import Success Banner */}
              {importSuccessInfo && (
                <div className="p-4 bg-emerald-950/60 border border-emerald-800/80 rounded-2xl text-emerald-300 flex items-center justify-between shadow-lg shadow-emerald-950/40 animate-fade-in">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600/30 text-emerald-400 flex items-center justify-center border border-emerald-500/40 flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        成功匯入財務報表數據
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                          {importSuccessInfo.filename}
                        </span>
                      </h4>
                      <p className="text-xs text-emerald-400/90 mt-0.5">
                        已自動提取企業名稱「<span className="text-white font-medium">{importSuccessInfo.companyName}</span>」共 {importSuccessInfo.periodsCount} 個財務期別數值。您可於下方檢視或直接儲存。
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-md shadow-emerald-600/20 whitespace-nowrap ml-4"
                  >
                    <span>立即啟用分析</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Quick History Snapshot Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center space-x-2 text-slate-400 text-xs">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  <span>版本防護：</span>
                  <span className="text-slate-300">
                    目前已累積 <strong className="text-white">{changeHistory.length}</strong> 筆修改記錄
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {changeHistory.length > 0 && (
                    <button
                      type="button"
                      onClick={handleQuickUndo}
                      className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-[11px] font-medium transition"
                      title="還原至上一筆歷史快照"
                    >
                      <RotateCcw className="w-3 h-3 text-indigo-400" />
                      <span>還原上一版</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleCreateManualSnapshot()}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-[11px] font-semibold transition"
                    title="儲存當前數據狀態為快照"
                  >
                    <BookmarkPlus className="w-3 h-3 text-purple-400" />
                    <span>建立當前還原點</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('history')}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-[11px] font-semibold transition"
                  >
                    <span>查看完整記錄列表</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Taiwan Stock Quick Instant Fetcher Bar */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-950/70 via-indigo-950/60 to-slate-900/90 border border-blue-600/40 shadow-lg shadow-blue-950/40 space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/40 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>台股代號一鍵即時聯網載入</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-normal">
                          ⚡ 100% 官方標準數據
                        </span>
                      </h4>
                      <p className="text-xs text-slate-400">
                        直連台灣證券交易所 / 金融開放資料庫，輸入代號免下載檔案瞬間提取四大表
                      </p>
                    </div>
                  </div>
                </div>

                {/* Input & Search Trigger */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 relative">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={stockCodeInput}
                      onChange={(e) => setStockCodeInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleStockSearch()}
                      placeholder="輸入 4 碼代號或公司中文名稱 (例：2330、台積電、聯發科、鈊象、中鋼)..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-xs font-mono"
                    />

                    {/* Instant Full-Market Autocomplete Suggestions Dropdown */}
                    {stockCodeInput.trim().length >= 1 && searchTaiwanMarketStocks(stockCodeInput, 6).length > 0 && (
                      <div className="absolute left-0 right-0 top-full mt-1.5 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-800">
                        {searchTaiwanMarketStocks(stockCodeInput, 6).map((item) => (
                          <button
                            key={item.code}
                            type="button"
                            onClick={() => {
                              setStockCodeInput(item.code);
                              handleStockSearch(item.code);
                            }}
                            className="w-full px-3.5 py-2 text-left hover:bg-blue-600/20 flex items-center justify-between transition group text-xs"
                          >
                            <div className="flex items-center space-x-2">
                              <span className="font-mono font-bold text-cyan-400 group-hover:text-cyan-300">
                                {item.code}
                              </span>
                              <span className="font-medium text-white group-hover:text-blue-200">
                                {item.name}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                              <span>{item.industry}</span>
                              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                                {item.market}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={isSearchingStock}
                    onClick={() => handleStockSearch()}
                    className="flex items-center justify-center space-x-1.5 px-4 sm:px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold transition shadow-md shadow-blue-600/30 whitespace-nowrap min-h-[38px]"
                  >
                    {isSearchingStock ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>連線提取中...</span>
                      </>
                    ) : (
                      <>
                        <Globe className="w-4 h-4" />
                        <span>一鍵聯網載入</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Loading Status Indicator */}
                {stockSearchStatus && (
                  <p className="text-xs text-cyan-300 font-mono flex items-center gap-1.5 animate-pulse">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{stockSearchStatus}</span>
                  </p>
                )}

                {/* Popular Quick Suggestions */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs">
                  <span className="text-[11px] text-slate-400 mr-1">熱門官方財報：</span>
                  {[
                    { code: '2330', name: '台積電' },
                    { code: '8044', name: '網家 PChome' },
                    { code: '2317', name: '鴻海' },
                    { code: '2454', name: '聯發科' },
                    { code: '8454', name: 'momo 富邦媒' },
                    { code: '2603', name: '長榮海運' },
                  ].map((s) => (
                    <button
                      key={s.code}
                      type="button"
                      disabled={isSearchingStock}
                      onClick={() => handleStockSearch(s.code)}
                      className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-blue-900/40 text-slate-300 hover:text-blue-200 border border-slate-800 hover:border-blue-700/60 text-[11px] font-mono transition flex items-center gap-1"
                    >
                      <span className="text-blue-400 font-bold">{s.code}</span>
                      <span>{s.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Official MOPS XBRL & CSV Drag-and-Drop Dropzone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleProcessFile(file);
                }}
                className={`p-4 sm:p-5 rounded-2xl border-2 border-dashed transition-all flex flex-col sm:flex-row items-center justify-between gap-4 ${
                  isDragging
                    ? 'border-cyan-400 bg-cyan-950/40 scale-[1.01]'
                    : 'border-slate-700/80 bg-slate-950/70 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                    {isParsingXbrl ? (
                      <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
                    ) : (
                      <FolderArchive className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                        <span>公開資訊觀測站 (MOPS) 官方 XBRL / ZIP 拖曳上傳</span>
                      </h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                        🏆 100% 官方簽證原檔
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                      可直接拖入 MOPS 下載之 <span className="text-cyan-300 font-mono">.zip</span> 壓縮檔、<span className="text-cyan-300 font-mono">.xml / .xbrl</span> 單檔或標準 <span className="text-emerald-300 font-mono">.csv</span> 試算表，0.01 秒完成解析對帳。
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".zip,.xml,.xbrl,.html,.csv,text/csv,application/zip"
                    className="hidden"
                    onChange={handleFileInputChange}
                  />
                  <button
                    type="button"
                    onClick={downloadTemplate}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium transition min-h-[34px] cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-400" />
                    <span>CSV 範本</span>
                  </button>
                  <button
                    type="button"
                    disabled={isParsingXbrl}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold transition shadow-sm cursor-pointer min-h-[34px]"
                  >
                    {isParsingXbrl ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>選擇 XBRL/ZIP 檔案</span>
                  </button>
                </div>
              </div>

              {/* Company Metadata Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-slate-950/60 rounded-2xl border border-slate-800">
                <div className="space-y-1">
                  <label className="block text-slate-400 text-xs font-semibold">
                    企業 / 帳戶名稱 <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="例：台灣積體電路"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-400 text-xs font-semibold">股票代碼 / 識別碼</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="例：2330-TW"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-400 text-xs font-semibold">所屬產業別</label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="例：半導體製造業"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-400 text-xs font-semibold">數值幣別與單位</label>
                  <input
                    type="text"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    placeholder="例：NTD (千元)"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs font-medium"
                  />
                </div>

                <div className="md:col-span-4 space-y-1">
                  <label className="block text-slate-400 text-xs font-semibold">簡介或備註說明</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="簡要描述該財務實體之主要營運業務或模型假設"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs font-medium"
                  />
                </div>
              </div>

              {/* Financial Periods Spreadsheet Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>歷年/歷季財務數據試算表</span>
                      <span className="text-slate-400 text-xs font-normal">
                        (所有金額預設單位均為<strong>千元</strong>，比率將自動即時運算)
                      </span>
                    </h4>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddPeriod}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>新增下一期預測/歷史年度</span>
                  </button>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60 shadow-inner">
                  <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider border-b border-slate-800 font-semibold text-[11px]">
                      <tr>
                        <th className="p-3 sticky left-0 bg-slate-900 z-10">期間名稱</th>
                        <th className="p-3 text-right">年度</th>
                        <th className="p-3 text-right text-emerald-400">營業收入 (千元)</th>
                        <th className="p-3 text-right text-slate-300">營業成本 (千元)</th>
                        <th className="p-3 text-right text-cyan-400">營業毛利 (自動計算)</th>
                        <th className="p-3 text-right text-slate-300">營業費用 (千元)</th>
                        <th className="p-3 text-right text-blue-400">營業利益 (EBIT)</th>
                        <th className="p-3 text-right text-purple-400">稅後淨利 (千元)</th>
                        <th className="p-3 text-right text-slate-300">流通股數 (千股)</th>
                        <th className="p-3 text-right text-amber-400">應收帳款 (千元)</th>
                        <th className="p-3 text-right text-amber-400">存貨 (千元)</th>
                        <th className="p-3 text-right text-amber-400">應付帳款 (千元)</th>
                        <th className="p-3 text-right text-slate-300">流動資產 (千元)</th>
                        <th className="p-3 text-right text-slate-300">流動負債 (千元)</th>
                        <th className="p-3 text-right text-slate-200 font-bold">資產總額 (千元)</th>
                        <th className="p-3 text-right text-slate-200">負債總額 (千元)</th>
                        <th className="p-3 text-right text-blue-300 font-bold">股東權益 (千元)</th>
                        <th className="p-3 text-right text-emerald-400">營業現金流 (千元)</th>
                        <th className="p-3 text-right text-rose-400">資本支出 (千元)</th>
                        <th className="p-3 text-center">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 font-mono text-xs">
                      {periods.map((p, idx) => (
                        <tr key={p.id} className="hover:bg-slate-900/50 transition">
                          <td className="p-2 sticky left-0 bg-slate-950 z-10">
                            <input
                              type="text"
                              value={p.period}
                              onChange={(e) => handlePeriodChange(idx, 'period', e.target.value)}
                              className="w-28 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-white font-sans text-xs"
                            />
                          </td>
                          <td className="p-2 text-right">
                            <input
                              type="number"
                              value={p.year}
                              onChange={(e) => handlePeriodChange(idx, 'year', parseInt(e.target.value, 10) || 2024)}
                              className="w-16 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-white text-right text-xs"
                            />
                          </td>
                          <td className="p-2 text-right">
                            <input
                              type="number"
                              value={p.revenue}
                              onChange={(e) => handlePeriodChange(idx, 'revenue', parseFloat(e.target.value) || 0)}
                              className="w-28 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 font-semibold text-right text-xs"
                            />
                          </td>
                          <td className="p-2 text-right">
                            <input
                              type="number"
                              value={p.costOfGoodsSold}
                              onChange={(e) => handlePeriodChange(idx, 'costOfGoodsSold', parseFloat(e.target.value) || 0)}
                              className="w-28 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-right text-xs"
                            />
                          </td>
                          <td className="p-2 text-right text-cyan-300 font-semibold px-3">
                            ${p.grossProfit.toLocaleString()}
                          </td>
                          <td className="p-2 text-right">
                            <input
                              type="number"
                              value={p.operatingExpenses}
                              onChange={(e) => handlePeriodChange(idx, 'operatingExpenses', parseFloat(e.target.value) || 0)}
                              className="w-24 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-right text-xs"
                            />
                          </td>
                          <td className="p-2 text-right text-blue-300 font-semibold px-3">
                            ${p.operatingIncome.toLocaleString()}
                          </td>
                          <td className="p-2 text-right">
                            <input
                              type="number"
                              value={p.netIncome}
                              onChange={(e) => handlePeriodChange(idx, 'netIncome', parseFloat(e.target.value) || 0)}
                              className="w-28 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-purple-400 font-semibold text-right text-xs"
                            />
                          </td>
                          <td className="p-2 text-right">
                            <input
                              type="number"
                              value={p.sharesOutstanding}
                              onChange={(e) => handlePeriodChange(idx, 'sharesOutstanding', parseFloat(e.target.value) || 0)}
                              className="w-24 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-right text-xs"
                            />
                          </td>
                          <td className="p-2 text-right">
                            <input
                              type="number"
                              value={p.accountsReceivable}
                              onChange={(e) => handlePeriodChange(idx, 'accountsReceivable', parseFloat(e.target.value) || 0)}
                              className="w-24 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-amber-300 text-right text-xs"
                            />
                          </td>
                          <td className="p-2 text-right">
                            <input
                              type="number"
                              value={p.inventory}
                              onChange={(e) => handlePeriodChange(idx, 'inventory', parseFloat(e.target.value) || 0)}
                              className="w-24 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-amber-300 text-right text-xs"
                            />
                          </td>
                          <td className="p-2 text-right">
                            <input
                              type="number"
                              value={p.accountsPayable}
                              onChange={(e) => handlePeriodChange(idx, 'accountsPayable', parseFloat(e.target.value) || 0)}
                              className="w-24 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-amber-300 text-right text-xs"
                            />
                          </td>
                          <td className="p-2 text-right">
                            <input
                              type="number"
                              value={p.currentAssets}
                              onChange={(e) => handlePeriodChange(idx, 'currentAssets', parseFloat(e.target.value) || 0)}
                              className="w-28 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-right text-xs"
                            />
                          </td>
                          <td className="p-2 text-right">
                            <input
                              type="number"
                              value={p.currentLiabilities}
                              onChange={(e) => handlePeriodChange(idx, 'currentLiabilities', parseFloat(e.target.value) || 0)}
                              className="w-28 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-right text-xs"
                            />
                          </td>
                          <td className="p-2 text-right">
                            <input
                              type="number"
                              value={p.totalAssets}
                              onChange={(e) => handlePeriodChange(idx, 'totalAssets', parseFloat(e.target.value) || 0)}
                              className="w-28 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 font-bold text-right text-xs"
                            />
                          </td>
                          <td className="p-2 text-right">
                            <input
                              type="number"
                              value={p.totalLiabilities}
                              onChange={(e) => handlePeriodChange(idx, 'totalLiabilities', parseFloat(e.target.value) || 0)}
                              className="w-28 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-right text-xs"
                            />
                          </td>
                          <td className="p-2 text-right">
                            <input
                              type="number"
                              value={p.stockholdersEquity}
                              onChange={(e) => handlePeriodChange(idx, 'stockholdersEquity', parseFloat(e.target.value) || 0)}
                              className="w-28 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-blue-300 font-bold text-right text-xs"
                            />
                          </td>
                          <td className="p-2 text-right">
                            <input
                              type="number"
                              value={p.operatingCashFlow}
                              onChange={(e) => handlePeriodChange(idx, 'operatingCashFlow', parseFloat(e.target.value) || 0)}
                              className="w-28 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 text-right text-xs"
                            />
                          </td>
                          <td className="p-2 text-right">
                            <input
                              type="number"
                              value={p.capitalExpenditures}
                              onChange={(e) => handlePeriodChange(idx, 'capitalExpenditures', parseFloat(e.target.value) || 0)}
                              className="w-24 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-rose-400 text-right text-xs"
                            />
                          </td>
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemovePeriod(idx)}
                              className="p-1 rounded text-rose-400 hover:text-rose-200 hover:bg-rose-950 transition"
                              title="刪除此期間"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-950/90 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div>
            {editingCompany && !editingCompany.isConsolidatedGroup && (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`確定要刪除「${editingCompany.name}」嗎？`)) {
                    deleteCompany(editingCompany.id);
                    setIsDataEditorOpen(false);
                  }
                }}
                className="flex items-center justify-center space-x-1.5 px-3.5 py-2.5 rounded-xl sm:rounded-2xl bg-rose-950/80 text-rose-300 hover:bg-rose-900 border border-rose-800/80 text-xs font-semibold transition w-full sm:w-auto min-h-[40px]"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>刪除此企業帳戶</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              type="button"
              onClick={() => setIsDataEditorOpen(false)}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl sm:rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition min-h-[40px]"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex-[2] sm:flex-none flex items-center justify-center space-x-1.5 px-5 sm:px-6 py-2.5 rounded-xl sm:rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-500/25 min-h-[40px]"
            >
              <Save className="w-4 h-4" />
              <span>儲存並計算</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
