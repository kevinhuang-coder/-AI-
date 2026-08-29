import React from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { MetricCategory } from '../../types/financial';
import {
  RotateCcw,
  Percent,
  GitFork,
  ShieldCheck,
  Coins,
  LayoutGrid,
  FileDown,
} from 'lucide-react';

interface TabItem {
  id: MetricCategory;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TABS: TabItem[] = [
  { id: 'all', label: '綜合全景大盤', icon: LayoutGrid },
  { id: 'turnover', label: '營運週轉能力', icon: RotateCcw },
  { id: 'profitability', label: '獲利能力指標', icon: Percent },
  { id: 'dupont', label: '杜邦分析拆解', icon: GitFork },
  { id: 'solvency', label: '償債與結構', icon: ShieldCheck },
  { id: 'cashflow', label: '現金流量品質', icon: Coins },
];

export const MetricFilterTabs: React.FC = () => {
  const { selectedCategory, setSelectedCategory, setIsPdfModalOpen } = useFinancial();

  return (
    <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none touch-pan-x">
      <div className="flex items-center space-x-1">
        {TABS.map((tab) => {
        const Icon = tab.icon;
        const isSelected = selectedCategory === tab.id;
        return (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            onClick={() => setSelectedCategory(tab.id)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
              isSelected
                ? 'bg-slate-800 text-white font-semibold border border-slate-700/80 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
            <span>{tab.label}</span>
          </button>
        );
      })}
      </div>

      {/* Quick Export PDF Report Button */}
      <button
        onClick={() => setIsPdfModalOpen(true)}
        className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-semibold whitespace-nowrap shadow-sm transition cursor-pointer flex-shrink-0"
        title="預覽與產出單頁 A4 財務分析報告"
      >
        <FileDown className="w-3.5 h-3.5" />
        <span>產出 PDF 報告</span>
      </button>
    </div>
  );
};
