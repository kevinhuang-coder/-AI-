import React, { useState } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { FinancialChangeRecord, ChangeActionType, FinancialPeriod } from '../../types/financial';
import {
  RotateCcw,
  Clock,
  BookmarkPlus,
  Trash2,
  CheckCircle2,
  FileText,
  FileSpreadsheet,
  SlidersHorizontal,
  PlusCircle,
  MinusCircle,
  Bookmark,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Filter,
  Layers,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';

interface ChangeHistoryPanelProps {
  currentFormState: {
    name: string;
    code: string;
    industry: string;
    currency: string;
    description: string;
    periods: FinancialPeriod[];
  };
  onRestoreSnapshot: (snapshot: FinancialChangeRecord['snapshot'], record: FinancialChangeRecord) => void;
  onCreateManualSnapshot: (note?: string) => void;
}

export const ChangeHistoryPanel: React.FC<ChangeHistoryPanelProps> = ({
  currentFormState,
  onRestoreSnapshot,
  onCreateManualSnapshot,
}) => {
  const {
    changeHistory,
    deleteChangeRecord,
    clearChangeHistory,
    editingCompany,
  } = useFinancial();

  const [filterType, setFilterType] = useState<string>('all');
  const [filterCurrentCompanyOnly, setFilterCurrentCompanyOnly] = useState<boolean>(false);
  const [expandedRecordId, setExpandedRecordId] = useState<string | null>(null);
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [snapshotNote, setSnapshotNote] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Format relative time
  const getRelativeTime = (timestamp: number): string => {
    const diff = Math.max(0, Date.now() - timestamp);
    const seconds = Math.floor(diff / 1000);
    if (seconds < 45) return '剛剛';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} 分鐘前`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} 小時前`;
    const days = Math.floor(hours / 24);
    return `${days} 天前`;
  };

  // Get action styling and icon
  const getActionBadge = (type: ChangeActionType) => {
    switch (type) {
      case 'import_pdf':
        return {
          icon: FileText,
          label: 'PDF 財報匯入',
          bg: 'bg-blue-950/60 text-blue-300 border-blue-800/80',
          iconColor: 'text-blue-400',
        };
      case 'import_csv':
        return {
          icon: FileSpreadsheet,
          label: 'CSV 匯入',
          bg: 'bg-cyan-950/60 text-cyan-300 border-cyan-800/80',
          iconColor: 'text-cyan-400',
        };
      case 'save_company':
        return {
          icon: CheckCircle2,
          label: '儲存變更',
          bg: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80',
          iconColor: 'text-emerald-400',
        };
      case 'manual_snapshot':
        return {
          icon: Bookmark,
          label: '手動快照還原點',
          bg: 'bg-purple-950/60 text-purple-300 border-purple-800/80',
          iconColor: 'text-purple-400',
        };
      case 'restore_version':
        return {
          icon: RotateCcw,
          label: '版本還原',
          bg: 'bg-indigo-950/60 text-indigo-300 border-indigo-800/80',
          iconColor: 'text-indigo-400',
        };
      case 'add_period':
        return {
          icon: PlusCircle,
          label: '新增期別',
          bg: 'bg-amber-950/60 text-amber-300 border-amber-800/80',
          iconColor: 'text-amber-400',
        };
      case 'remove_period':
        return {
          icon: MinusCircle,
          label: '刪除期別/帳戶',
          bg: 'bg-rose-950/60 text-rose-300 border-rose-800/80',
          iconColor: 'text-rose-400',
        };
      case 'edit_field':
      default:
        return {
          icon: SlidersHorizontal,
          label: '數值編輯',
          bg: 'bg-slate-800/80 text-slate-300 border-slate-700',
          iconColor: 'text-slate-400',
        };
    }
  };

  // Filter records
  const filteredRecords = changeHistory.filter((record) => {
    if (filterCurrentCompanyOnly && editingCompany && record.companyId !== editingCompany.id) {
      return false;
    }
    if (filterType === 'all') return true;
    if (filterType === 'import') return record.actionType === 'import_pdf' || record.actionType === 'import_csv';
    if (filterType === 'snapshot') return record.actionType === 'manual_snapshot' || record.actionType === 'restore_version';
    if (filterType === 'save') return record.actionType === 'save_company';
    return true;
  });

  const handleCreateSnapshotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateManualSnapshot(snapshotNote.trim() || undefined);
    setSnapshotNote('');
    setIsCreatingNote(false);
  };

  return (
    <div className="space-y-4 text-xs">
      
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-950/70 rounded-2xl border border-slate-800/90 shadow-sm">
        
        {/* Left Filter & Status */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-medium">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>歷史記錄</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-blue-600/30 text-blue-300 text-[10px] font-mono">
              {changeHistory.length} 筆
            </span>
          </div>

          <div className="flex items-center space-x-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-lg transition font-medium ${
                filterType === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              全部
            </button>
            <button
              type="button"
              onClick={() => setFilterType('import')}
              className={`px-2.5 py-1 rounded-lg transition font-medium ${
                filterType === 'import'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              PDF / CSV 匯入
            </button>
            <button
              type="button"
              onClick={() => setFilterType('snapshot')}
              className={`px-2.5 py-1 rounded-lg transition font-medium ${
                filterType === 'snapshot'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              快照與還原點
            </button>
            <button
              type="button"
              onClick={() => setFilterType('save')}
              className={`px-2.5 py-1 rounded-lg transition font-medium ${
                filterType === 'save'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              儲存記錄
            </button>
          </div>

          {editingCompany && (
            <label className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 cursor-pointer hover:bg-slate-800 transition select-none">
              <input
                type="checkbox"
                checked={filterCurrentCompanyOnly}
                onChange={(e) => setFilterCurrentCompanyOnly(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-0"
              />
              <span>僅限「{editingCompany.name}」</span>
            </label>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2">
          {!isCreatingNote ? (
            <button
              type="button"
              onClick={() => setIsCreatingNote(true)}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 font-semibold transition"
            >
              <BookmarkPlus className="w-3.5 h-3.5 text-purple-400" />
              <span>建立當前快照還原點</span>
            </button>
          ) : (
            <form onSubmit={handleCreateSnapshotSubmit} className="flex items-center space-x-1.5 animate-fade-in">
              <input
                type="text"
                value={snapshotNote}
                onChange={(e) => setSnapshotNote(e.target.value)}
                placeholder="輸入快照備註 (例如：調整營收預測前)"
                autoFocus
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-purple-500/60 text-white placeholder-slate-500 text-xs focus:outline-none w-56"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition"
              >
                儲存快照
              </button>
              <button
                type="button"
                onClick={() => setIsCreatingNote(false)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
              >
                取消
              </button>
            </form>
          )}

          {changeHistory.length > 0 && !showClearConfirm && (
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-800 transition"
              title="清除所有歷史紀錄"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          {showClearConfirm && (
            <div className="flex items-center space-x-1.5 bg-rose-950/80 border border-rose-800 p-1 rounded-xl animate-fade-in">
              <span className="text-rose-300 text-[11px] px-1 font-medium">確定清除全紀錄？</span>
              <button
                type="button"
                onClick={() => {
                  clearChangeHistory();
                  setShowClearConfirm(false);
                }}
                className="px-2 py-0.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold"
              >
                確定
              </button>
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 text-[10px]"
              >
                取消
              </button>
            </div>
          )}
        </div>
      </div>

      {/* History List */}
      {filteredRecords.length === 0 ? (
        <div className="py-12 px-6 rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 text-center flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h4 className="text-sm font-bold text-white">尚無符合條件的修改記錄</h4>
            <p className="text-xs text-slate-400">
              在報表編輯器中手動調整數據、匯入 PDF/CSV 財報或點擊「建立快照還原點」後，將自動在此留下版本紀錄，方便隨時一鍵還原。
            </p>
          </div>
          <button
            type="button"
            onClick={() => onCreateManualSnapshot('初始狀態快照備份')}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-md shadow-blue-600/20"
          >
            <BookmarkPlus className="w-4 h-4" />
            <span>為當前數據建立首個還原點</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRecords.map((record, index) => {
            const badge = getActionBadge(record.actionType);
            const Icon = badge.icon;
            const isExpanded = expandedRecordId === record.id;
            const isLatest = index === 0;

            return (
              <div
                key={record.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isLatest
                    ? 'border-blue-500/40 bg-slate-900/90 shadow-md shadow-blue-950/30'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                }`}
              >
                {/* Main Card Header */}
                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  
                  {/* Left Info */}
                  <div className="flex items-start space-x-3 flex-1 min-w-0">
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 ${badge.bg}`}>
                      <Icon className={`w-4 h-4 ${badge.iconColor}`} />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-white text-sm truncate">
                          {record.companyName}
                        </span>
                        
                        <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold flex items-center gap-1 ${badge.bg}`}>
                          {badge.label}
                        </span>

                        {isLatest && (
                          <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-semibold">
                            最新記錄
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-300 font-medium leading-relaxed">
                        {record.description}
                      </p>

                      {/* Stats Pills */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-[11px] text-slate-400 font-mono">
                        <span className="text-slate-300">
                          期別數: <strong className="text-white font-semibold">{record.summary.periodsCount} 期</strong>
                        </span>
                        <span>•</span>
                        <span>
                          最新期別: <strong className="text-slate-200">{record.summary.latestPeriod}</strong>
                        </span>
                        <span>•</span>
                        <span>
                          營收: <strong className="text-emerald-400 font-semibold">${record.summary.latestRevenue.toLocaleString()}</strong> 千元
                        </span>
                        <span>•</span>
                        <span>
                          淨利: <strong className="text-cyan-400 font-semibold">${record.summary.latestNetIncome.toLocaleString()}</strong> 千元
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions & Timestamp */}
                  <div className="flex items-center space-x-2 sm:self-center flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/80">
                    
                    <div className="text-right mr-2 hidden md:block">
                      <span className="block text-[11px] text-slate-400 font-mono">
                        {record.timeFormatted}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {getRelativeTime(record.timestamp)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setExpandedRecordId(isExpanded ? null : record.id)}
                      className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs transition"
                      title="檢視此版本數據明細"
                    >
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      <span className="hidden sm:inline">{isExpanded ? '收合' : '明細'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => onRestoreSnapshot(record.snapshot, record)}
                      className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-md shadow-blue-600/25 whitespace-nowrap"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>還原至此版本</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteChangeRecord(record.id)}
                      className="p-1.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-950/50 transition"
                      title="刪除此紀錄"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Expanded Snapshot Diff & Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 bg-slate-950/80 animate-fade-in space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center space-x-2 text-slate-300">
                        <Bookmark className="w-4 h-4 text-purple-400" />
                        <span className="font-semibold text-white">快照版本財務明細檔</span>
                        <span className="text-slate-400">({record.snapshot.code} • {record.snapshot.industry} • {record.snapshot.currency})</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        快照建立時間：{record.timeFormatted} ({getRelativeTime(record.timestamp)})
                      </span>
                    </div>

                    {/* Snapshot Periods Table */}
                    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
                      <table className="w-full text-left text-[11px] whitespace-nowrap">
                        <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800 font-semibold">
                          <tr>
                            <th className="p-2.5">財務期別</th>
                            <th className="p-2.5 text-right">營業收入 (千元)</th>
                            <th className="p-2.5 text-right">營業成本</th>
                            <th className="p-2.5 text-right">營業毛利</th>
                            <th className="p-2.5 text-right">營業利益</th>
                            <th className="p-2.5 text-right">稅後淨利</th>
                            <th className="p-2.5 text-right">流動資產</th>
                            <th className="p-2.5 text-right">總資產</th>
                            <th className="p-2.5 text-right">股東權益</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-mono">
                          {record.snapshot.periods.map((p) => {
                            // Compare with current form period if exists
                            const currentMatch = currentFormState.periods.find((cp) => cp.year === p.year);
                            const revDiff = currentMatch ? p.revenue - currentMatch.revenue : 0;
                            const netDiff = currentMatch ? p.netIncome - currentMatch.netIncome : 0;

                            return (
                              <tr key={p.id} className="hover:bg-slate-800/40 transition">
                                <td className="p-2.5 font-sans font-semibold text-white">
                                  {p.period}
                                </td>
                                <td className="p-2.5 text-right text-emerald-400">
                                  ${p.revenue.toLocaleString()}
                                  {revDiff !== 0 && (
                                    <span className={`ml-1.5 text-[9px] ${revDiff > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                      ({revDiff > 0 ? '+' : ''}{revDiff.toLocaleString()})
                                    </span>
                                  )}
                                </td>
                                <td className="p-2.5 text-right text-slate-300">
                                  ${p.costOfGoodsSold.toLocaleString()}
                                </td>
                                <td className="p-2.5 text-right text-cyan-300 font-semibold">
                                  ${p.grossProfit.toLocaleString()}
                                </td>
                                <td className="p-2.5 text-right text-blue-300">
                                  ${p.operatingIncome.toLocaleString()}
                                </td>
                                <td className="p-2.5 text-right text-purple-300 font-semibold">
                                  ${p.netIncome.toLocaleString()}
                                  {netDiff !== 0 && (
                                    <span className={`ml-1.5 text-[9px] ${netDiff > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                      ({netDiff > 0 ? '+' : ''}{netDiff.toLocaleString()})
                                    </span>
                                  )}
                                </td>
                                <td className="p-2.5 text-right text-slate-300">
                                  ${p.currentAssets.toLocaleString()}
                                </td>
                                <td className="p-2.5 text-right text-slate-200">
                                  ${p.totalAssets.toLocaleString()}
                                </td>
                                <td className="p-2.5 text-right text-amber-300">
                                  ${p.stockholdersEquity.toLocaleString()}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <p className="text-[11px] text-slate-400">
                        {record.snapshot.description || '無額外備註'}
                      </p>
                      <button
                        type="button"
                        onClick={() => onRestoreSnapshot(record.snapshot, record)}
                        className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-md shadow-blue-600/25"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>確認載入並還原此版本數據</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
