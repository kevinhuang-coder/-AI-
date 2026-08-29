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
  Building2,
} from 'lucide-react';

interface TabItem {
  id: MetricCategory;
  label: string;
  sub: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TABS: TabItem[] = [
  { id: 'all', label: '綜合全景大盤', sub: 'Overview', icon: LayoutGrid },
  { id: 'turnover', label: '週轉營運能力', sub: 'AR & Inventory', icon: RotateCcw },
  { id: 'profitability', label: '獲利能力指標', sub: 'Margins & ROE', icon: Percent },
  { id: 'dupont', label: '杜邦分析拆解', sub: 'DuPont Tree', icon: GitFork },
  { id: 'solvency', label: '償債與結構', sub: 'Solvency & Debt', icon: ShieldCheck },
  { id: 'cashflow', label: '現金流量品質', sub: 'OCF & Free Cash', icon: Coins },
];

export const MetricFilterTabs: React.FC = () => {
  const { selectedCategory, setSelectedCategory } = useFinancial();

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl backdrop-blur-md shadow-sm relative">
      <div className="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto pb-0.5 scrollbar-none touch-pan-x">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isSelected = selectedCategory === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              onClick={() => setSelectedCategory(tab.id)}
              className={`flex items-center space-x-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0 min-h-[38px] cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-900/40 ring-1 ring-indigo-400/40 font-bold scale-[1.01]'
                  : 'bg-slate-950/60 text-slate-400 hover:bg-slate-850 hover:text-slate-200 border border-slate-800/80'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};



