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
  const { selectedCategory, setSelectedCategory, activeCompany } = useFinancial();

  return (
    <div className="bg-slate-900/50 border border-slate-800 p-2.5 sm:p-4 rounded-2xl sm:rounded-3xl backdrop-blur-sm shadow-sm relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Category Pill Tabs with smooth mobile horizontal scroll */}
        <div className="relative w-full md:w-auto overflow-hidden">
          <div className="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none touch-pan-x">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isSelected = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-3.5 py-2 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0 min-h-[38px] ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40 ring-1 ring-indigo-400/40'
                      : 'bg-slate-900/90 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Active Account Status Tag */}
        <div className="hidden lg:flex items-center space-x-2 text-xs text-slate-400 bg-slate-900 px-3.5 py-2 rounded-2xl border border-slate-800 flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>當前主體：</span>
          <span className="font-semibold text-slate-200">{activeCompany.name}</span>
          <span className="text-indigo-400 font-mono">({activeCompany.currency})</span>
        </div>

      </div>
    </div>
  );
};


