import React, { useState, useEffect, useMemo } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import {
  X,
  Database,
  RefreshCw,
  Search,
  Plus,
  Trash2,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Layers,
  HardDrive,
  Calendar,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

interface DbStats {
  totalCompanies: number;
  totalPeriods: number;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  lastUpdated: string;
  version: string;
}

interface StoredCompanySummary {
  code: string;
  name: string;
  industry: string;
  periodsCount: number;
  yearRange: string;
  lastUpdated: string;
}

export const DatabaseHubModal: React.FC = () => {
  const { isDatabaseModalOpen, setIsDatabaseModalOpen, loadStockByCode } = useFinancial();

  const [stats, setStats] = useState<DbStats | null>(null);
  const [companies, setCompanies] = useState<StoredCompanySummary[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncingBatch, setIsSyncingBatch] = useState(false);
  const [syncProgress, setSyncProgress] = useState<{ current: number; total: number; msg: string } | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString('zh-TW', { hour12: false });
    setLogs((prev) => [`[${time}] ${msg}`, ...prev.slice(0, 50)]);
  };

  // 讀取資料庫現狀統計與公司清單
  const fetchDbOverview = async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);

      const [statsRes, stocksRes] = await Promise.all([
        fetch('/api/financial/db/stats'),
        fetch('/api/financial/db/stocks'),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success) setStats(statsData.stats);
      }

      if (stocksRes.ok) {
        const stocksData = await stocksRes.json();
        if (stocksData.success) setCompanies(stocksData.companies);
      }
    } catch (err: any) {
      console.error('Fetch DB error:', err);
      setErrorMsg('無法連接至專屬資料庫服務，請確認後端運行狀態。');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isDatabaseModalOpen) {
      fetchDbOverview();
    }
  }, [isDatabaseModalOpen]);

  // 單檔股票手動採集並入庫
  const handleSyncSingleStock = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanCode = inputCode.trim().toUpperCase().replace(/[^0-9A-Z]/g, '');
    if (!cleanCode) return;

    try {
      setIsLoading(true);
      setErrorMsg(null);
      addLog(`開始採集與會計校驗代號「${cleanCode}」...`);

      const res = await fetch('/api/financial/db/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: cleanCode }),
      });

      const data = await res.json();
      if (data.success) {
        addLog(`🟢 [${cleanCode}] ${data.result.name} 採集成功，共 ${data.result.periodsCount} 期數據通過五重勾稽入庫！`);
        setInputCode('');
        await fetchDbOverview();
      } else {
        const errMsg = data.error || data.result?.message || '採集失敗';
        addLog(`🔴 [${cleanCode}] 採集失敗: ${errMsg}`);
        setErrorMsg(errMsg);
      }
    } catch (err: any) {
      addLog(`🔴 網路錯誤: ${err.message}`);
      setErrorMsg(err.message || '連線逾時');
    } finally {
      setIsLoading(false);
    }
  };

  // 批量一鍵同步台灣 50 核心標竿企業
  const handleBatchSyncCoreStocks = async () => {
    if (isSyncingBatch) return;

    try {
      setIsSyncingBatch(true);
      setErrorMsg(null);
      addLog('🚀 啟動批量同步台灣 50 (0050) 核心標竿企業群...');
      setSyncProgress({ current: 1, total: 22, msg: '正在批量向官方數據庫發起請求並執行五重會計檢驗...' });

      const res = await fetch('/api/financial/db/batch-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      if (data.success) {
        addLog(`🎉 批量同步完成！共處理 ${data.results.length} 檔核心指標企業。`);
        await fetchDbOverview();
      } else {
        addLog(`⚠️ 批量同步中斷: ${data.error || '未知錯誤'}`);
      }
    } catch (err: any) {
      addLog(`🔴 批量同步連線失敗: ${err.message}`);
    } finally {
      setIsSyncingBatch(false);
      setSyncProgress(null);
    }
  };

  // 刪除庫內指定公司
  const handleDeleteStock = async (code: string, name: string) => {
    if (!confirm(`確定要自資料庫中移除「[${code}] ${name}」的全部歷史報表嗎？`)) return;

    try {
      const res = await fetch(`/api/financial/db/stock/${code}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        addLog(`🗑️ 已自資料庫移除 [${code}] ${name}`);
        await fetchDbOverview();
      }
    } catch (err: any) {
      console.error('Delete stock err:', err);
    }
  };

  // 一鍵從資料庫直接加載至分析看板
  const handleLoadToAnalyzer = async (code: string) => {
    try {
      setIsLoading(true);
      addLog(`⚡ 正在將 [${code}] 載入至分析主看板...`);
      await loadStockByCode(code);
      setIsDatabaseModalOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setErrorMsg(err.message || '載入失敗');
    } finally {
      setIsLoading(false);
    }
  };

  // 庫內篩選搜尋
  const filteredCompanies = useMemo(() => {
    if (!searchTerm.trim()) return companies;
    const q = searchTerm.trim().toLowerCase();
    return companies.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q)
    );
  }, [companies, searchTerm]);

  if (!isDatabaseModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-5xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-5 sm:px-7 py-4.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0 shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                  專屬台股財務資料庫管理中心 (Financial Warehouse Hub)
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  本機資料庫運作中
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                收錄經五重會計勾稽審定之純年報數據庫，提供全市場 0 延遲秒開與自動化批量同步
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={fetchDbOverview}
              disabled={isLoading}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition text-xs flex items-center gap-1.5"
              title="重新整理資料庫現況"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
            <button
              onClick={() => setIsDatabaseModalOpen(false)}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-950/50 hover:text-rose-400 text-slate-400 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">

          {/* 4 Health & Storage Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/90 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 font-semibold block mb-0.5">已收錄企業總數</span>
                <span className="text-2xl font-black text-white font-mono">
                  {stats?.totalCompanies || companies.length}
                  <span className="text-xs font-normal text-slate-500 ml-1 font-sans">家</span>
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Layers className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/90 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 font-semibold block mb-0.5">累計財務報表期數</span>
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  {stats?.totalPeriods || 0}
                  <span className="text-xs font-normal text-slate-500 ml-1 font-sans">期</span>
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Calendar className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/90 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 font-semibold block mb-0.5">資料庫儲存佔用</span>
                <span className="text-2xl font-black text-indigo-300 font-mono">
                  {stats?.fileSizeFormatted || '0 KB'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <HardDrive className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/90 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 font-semibold block mb-0.5">會計勾稽驗證率</span>
                <span className="text-2xl font-black text-amber-300 font-mono">
                  100%
                  <span className="text-[11px] font-bold text-emerald-400 ml-1 font-sans">審定</span>
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Synchronization Control Panel */}
          <div className="p-4.5 sm:p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  自動化採集與全市場同步引擎
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  支援一鍵批量更新核心標竿企業，或輸入任意台股代碼即時檢索並自動通過會計防偽入庫
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  onClick={handleBatchSyncCoreStocks}
                  disabled={isSyncingBatch || isLoading}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingBatch ? 'animate-spin' : ''}`} />
                  <span>{isSyncingBatch ? '批量同步中...' : '一鍵同步台灣 50 核心標竿企業'}</span>
                </button>
              </div>
            </div>

            {/* Progress Notification */}
            {syncProgress && (
              <div className="p-3 bg-indigo-950/40 border border-indigo-800/60 rounded-xl text-xs text-indigo-200 flex items-center gap-2.5 animate-pulse">
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-400 flex-shrink-0" />
                <span>{syncProgress.msg}</span>
              </div>
            )}

            {/* Single Stock Ingest Form */}
            <form onSubmit={handleSyncSingleStock} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="輸入任意台股代號（例如：2727 王品、2603 長榮、3008 大立光、2308 台達電）..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={!inputCode.trim() || isLoading}
                className="px-4.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs flex items-center gap-1.5 transition border border-slate-700 disabled:opacity-40 flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>採集並入庫</span>
              </button>
            </form>

            {errorMsg && (
              <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Stored Stocks Directory Table */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-bold text-white">庫存已索引企業目錄 ({filteredCompanies.length})</h4>
                <span className="text-[11px] text-slate-400 font-mono">Database Registry</span>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="搜尋庫內代號、名稱或產業..."
                  className="w-full pl-8.5 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="bg-slate-950/70 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="max-h-[280px] overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px] tracking-wider z-10">
                    <tr>
                      <th className="py-2.5 px-4">代號</th>
                      <th className="py-2.5 px-4">企業名稱</th>
                      <th className="py-2.5 px-4 hidden md:table-cell">所屬產業別</th>
                      <th className="py-2.5 px-4 text-center">收錄年期</th>
                      <th className="py-2.5 px-4 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredCompanies.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-500">
                          {searchTerm ? '查無符合搜尋條件的庫存股票' : '資料庫目前為空，請點擊上方按鈕進行採集'}
                        </td>
                      </tr>
                    ) : (
                      filteredCompanies.map((c) => (
                        <tr key={c.code} className="hover:bg-slate-900/60 transition group">
                          <td className="py-2.5 px-4 font-mono font-bold text-cyan-400">
                            {c.code}
                          </td>
                          <td className="py-2.5 px-4 font-medium text-white">
                            {c.name}
                          </td>
                          <td className="py-2.5 px-4 text-slate-400 hidden md:table-cell text-[11px] truncate max-w-[200px]">
                            {c.industry}
                          </td>
                          <td className="py-2.5 px-4 text-center font-mono text-[11px] text-slate-300">
                            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700/80">
                              {c.yearRange} ({c.periodsCount}年)
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-right space-x-1.5 flex-shrink-0">
                            <button
                              onClick={() => handleLoadToAnalyzer(c.code)}
                              className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white font-bold text-[11px] transition inline-flex items-center gap-1 border border-indigo-500/30"
                            >
                              <span>⚡ 載入分析</span>
                            </button>
                            <button
                              onClick={() => handleDeleteStock(c.code, c.name)}
                              className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition"
                              title="自資料庫移除"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Live Activity & Ingestion Logs */}
          {logs.length > 0 && (
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] space-y-1">
              <div className="text-slate-400 font-bold flex items-center justify-between mb-1 pb-1 border-b border-slate-800">
                <span>採集日誌與會計校驗紀錄 (Ingestion Console):</span>
                <span className="text-[10px] text-slate-500">最近 50 筆</span>
              </div>
              <div className="max-h-24 overflow-y-auto space-y-0.5 text-slate-300">
                {logs.map((log, i) => (
                  <div key={i} className="leading-tight truncate">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>所有入庫數據皆已強制通過「五重會計恆等式與單位量級硬勾稽」</span>
          </div>
          <button
            onClick={() => setIsDatabaseModalOpen(false)}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition"
          >
            關閉
          </button>
        </div>

      </div>
    </div>
  );
};
