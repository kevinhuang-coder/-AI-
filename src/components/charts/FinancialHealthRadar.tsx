import React from 'react';
import { useFinancial } from '../../context/FinancialContext';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from 'recharts';
import { calculateHealthDimensions } from '../../utils/financialCalculations';
import {
  Activity,
  ShieldCheck,
  Award,
  TrendingUp,
  RotateCcw,
  Percent,
  Layers,
  Zap,
} from 'lucide-react';

export const FinancialHealthRadar: React.FC = () => {
  const { latestPeriod, activeCompany } = useFinancial();

  if (!latestPeriod) return null;

  const health = calculateHealthDimensions(latestPeriod);
  const r = latestPeriod.ratios;

  const getRatingColor = (rating: string) => {
    if (rating.includes('極佳') || rating.includes('AAA') || rating.includes('良好')) {
      return 'text-emerald-400 bg-emerald-950/80 border-emerald-800';
    }
    if (rating.includes('穩健') || rating.includes('AA') || rating.includes('A')) {
      return 'text-blue-400 bg-blue-950/80 border-blue-800';
    }
    if (rating.includes('注意') || rating.includes('BBB')) {
      return 'text-amber-400 bg-amber-950/80 border-amber-800';
    }
    return 'text-rose-400 bg-rose-950/80 border-rose-800';
  };

  const getScoreTag = (score: number) => {
    if (score >= 85) return { label: '極優', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    if (score >= 70) return { label: '良好', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' };
    if (score >= 55) return { label: '尚可', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    return { label: '待加強', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
  };

  // 動態依綜合評分計算產業排名與實質風險等級
  const getIndustryRank = (score: number) => {
    if (score >= 88) return { text: '前 10% (頂尖)', color: 'text-emerald-400' };
    if (score >= 75) return { text: '前 25% (優良)', color: 'text-cyan-300' };
    if (score >= 60) return { text: '中前段 40%', color: 'text-blue-300' };
    if (score >= 45) return { text: '中後段 65%', color: 'text-amber-400' };
    return { text: '後 20% (落後)', color: 'text-rose-400' };
  };

  const getRiskLevel = (score: number) => {
    if (score >= 88) return { text: '極低風險', color: 'text-emerald-400' };
    if (score >= 75) return { text: '低風險', color: 'text-cyan-300' };
    if (score >= 60) return { text: '中度穩健', color: 'text-blue-300' };
    if (score >= 45) return { text: '警戒注意', color: 'text-amber-400' };
    return { text: '高風險', color: 'text-rose-400' };
  };

  const rankInfo = getIndustryRank(health.totalScore);
  const riskInfo = getRiskLevel(health.totalScore);

  const dimensionList = [
    {
      name: '獲利能力',
      sub: 'Profitability',
      score: health.profitScore,
      barColor: 'bg-emerald-500',
      icon: Percent,
      highlight: `毛利率 ${r.grossMargin}% • 營益率 ${r.operatingMargin}%`,
    },
    {
      name: '營運週轉',
      sub: 'Operating Cycle',
      score: health.turnoverScore,
      barColor: 'bg-blue-500',
      icon: RotateCcw,
      highlight: `現金轉換循環 (CCC) ${r.cashConversionCycle} 天`,
    },
    {
      name: '償債流動',
      sub: 'Solvency & Liquidity',
      score: health.solvencyScore,
      barColor: 'bg-indigo-500',
      icon: ShieldCheck,
      highlight: `流動比率 ${r.currentRatio}% • 負債比 ${r.debtRatio}%`,
    },
    {
      name: '現金品質',
      sub: 'Cash Flow Quality',
      score: health.cashflowScore,
      barColor: 'bg-cyan-500',
      icon: Layers,
      highlight: `營業現金流 $${(latestPeriod.operatingCashFlow / 1000).toFixed(0)}M • FCF $${(r.freeCashFlow / 1000).toFixed(0)}M`,
    },
    {
      name: '資產效率',
      sub: 'Asset Productivity',
      score: health.assetEfficiencyScore,
      barColor: 'bg-amber-500',
      icon: Zap,
      highlight: `總資產週轉率 ${r.dupontAssetTurnover} 次 • 應收週轉 ${r.arTurnover} 次`,
    },
  ];

  return (
    <div className="rounded-2xl sm:rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm p-4.5 sm:p-7 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 sm:mb-6 pb-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <h3 className="text-base font-bold text-white tracking-tight">
                五維度財務健檢雷達 (Financial Health Radar)
              </h3>
              <span className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                {latestPeriod.period}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              全方位評估獲利能力、營運週轉、償債流動、現金品質與資產效率五大核心面向
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 self-start sm:self-auto">
          <span className={`text-xs px-3.5 py-1.5 rounded-xl border font-bold flex items-center gap-1.5 ${getRatingColor(health.rating)}`}>
            <Award className="w-3.5 h-3.5 flex-shrink-0" />
            <span>綜合評級：{health.rating}</span>
          </span>
        </div>
      </div>

      {/* Full-width 3-Column Executive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
        
        {/* Column 1: Overall Health Score Gauge (lg:col-span-3) */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center p-5 sm:p-6 bg-slate-950/70 rounded-2xl border border-slate-800 text-center min-h-[260px] sm:min-h-[300px]">
          <div className="relative flex items-center justify-center w-32 h-32 sm:w-36 sm:h-36">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="text-slate-800"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                className="text-cyan-400 transition-all duration-1000"
                strokeWidth="8"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * health.totalScore) / 100}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">{health.totalScore}</span>
              <span className="text-[10px] sm:text-[11px] text-slate-400 font-semibold uppercase font-mono mt-0.5">SCORE / 100</span>
            </div>
          </div>

          <div className="mt-3 space-y-1">
            <h4 className="text-sm font-bold text-slate-100">綜合財務健全指數</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed max-w-[200px]">
              依據 {latestPeriod.period} 各項財務指標權重加權彙總運算
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 w-full flex items-center justify-around text-center text-xs">
            <div>
              <span className="text-[10px] text-slate-500 block">產業排名</span>
              <span className={`text-xs font-bold font-mono ${rankInfo.color}`}>{rankInfo.text}</span>
            </div>
            <div className="w-px h-6 bg-slate-800" />
            <div>
              <span className="text-[10px] text-slate-500 block">風險等級</span>
              <span className={`text-xs font-bold font-mono ${riskInfo.color}`}>{riskInfo.text}</span>
            </div>
          </div>
        </div>

        {/* Column 2: Spacious Radar Chart Canvas (lg:col-span-5) */}
        <div className="lg:col-span-5 h-[270px] sm:h-[320px] w-full flex items-center justify-center bg-slate-950/40 rounded-2xl border border-slate-800/60 p-1 sm:p-2">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={health.radarData} margin={{ top: 15, right: 25, bottom: 15, left: 25 }}>
              <PolarGrid stroke="#1e293b" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: '#cbd5e1', fontSize: 11, fontWeight: 600 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                stroke="#334155"
                tick={{ fill: '#64748b', fontSize: 9 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '1rem',
                  color: '#f8fafc',
                  fontSize: '0.8rem',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                }}
                formatter={(value: any) => [`${value} 分 (滿分 100)`, '指標評分']}
              />
              <Radar
                name="健檢評分"
                dataKey="score"
                stroke="#06b6d4"
                strokeWidth={2.5}
                fill="#06b6d4"
                fillOpacity={0.4}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Column 3: 5 Dimensions Breakdown Cards (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-2 sm:space-y-2.5 flex flex-col justify-center">
          {dimensionList.map((dim) => {
            const Icon = dim.icon;
            const tag = getScoreTag(dim.score);
            return (
              <div
                key={dim.name}
                className="p-2.5 sm:p-3 bg-slate-950/70 rounded-xl border border-slate-800/90 hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <div className="p-1 rounded-lg bg-slate-900 text-slate-300">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-200">{dim.name}</span>
                      <span className="text-[10px] text-slate-400 ml-1.5 font-sans">({dim.sub})</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-extrabold text-white font-mono">{dim.score} 分</span>
                    <span className={`text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded border font-semibold ${tag.color}`}>
                      {tag.label}
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-1">
                  <div
                    className={`${dim.barColor} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min(100, Math.max(5, dim.score))}%` }}
                  />
                </div>

                <div className="text-[10px] text-slate-400 truncate font-mono">
                  {dim.highlight}
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};

