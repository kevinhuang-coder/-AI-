import React, { useRef, useState } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { calculateHealthDimensions } from '../../utils/financialCalculations';
import {
  X,
  Printer,
  Download,
  FileText,
  Building2,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Award,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const PdfReportModal: React.FC = () => {
  const { isPdfModalOpen, setIsPdfModalOpen, activeCompany, latestPeriod, aiReport, viewMode } =
    useFinancial();

  const reportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  if (!isPdfModalOpen || !latestPeriod || !aiReport) return null;

  const isInvestor = viewMode === 'investor';
  const health = calculateHealthDimensions(latestPeriod);
  const curRatios = latestPeriod.ratios;
  const currentDate = new Date().toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleDownloadPdf = async () => {
    if (!reportRef.current || isExporting) return;
    setIsExporting(true);

    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // 嚴格確保只輸出單頁 A4（210mm x 297mm）
      const pdfWidth = 210;
      const pdfHeight = 297;
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

      const fileName = isInvestor
        ? `${activeCompany.name}_價值投資基本面研究報告_${latestPeriod.period}.pdf`
        : `${activeCompany.name}_財務經營決策報告_${latestPeriod.period}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('PDF Generation failed, fallback to print:', error);
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden my-2 sm:my-6 flex flex-col max-h-[94vh] sm:max-h-[92vh]">
        
        {/* Modal Controls Header */}
        <div className="no-print px-4 sm:px-6 py-3 sm:py-3.5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl ${isInvestor ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30' : 'bg-blue-600/20 text-blue-400 border-blue-500/30'} border flex items-center justify-center flex-shrink-0`}>
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                {isInvestor ? 'PDF 價值投資研究報告預覽與匯出' : 'PDF 財務分析報告預覽與匯出'}
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-400">
                {isInvestor
                  ? '符合機構法人與價值投資人標準之單頁 A4 基本面與安全邊際報告書'
                  : '符合高階主管與董事會呈報標準之單頁 A4 財務決策診斷書'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition min-h-[34px] cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
              <span>直接列印 (1 頁)</span>
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-xl ${isInvestor ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-blue-600 hover:bg-blue-500'} text-white text-xs font-bold transition shadow-lg disabled:opacity-50 min-h-[34px] cursor-pointer`}
            >
              <Download className={`w-3.5 h-3.5 flex-shrink-0 ${isExporting ? 'animate-bounce' : ''}`} />
              <span>{isExporting ? '生成單頁 A4 中...' : '下載單頁 A4 PDF'}</span>
            </button>
            <button
              onClick={() => setIsPdfModalOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Report Canvas (Executive 1-Page A4 Theme) */}
        <div id="printable-report-wrapper" className="p-3 sm:p-5 overflow-y-auto flex-1 bg-slate-950/80">
          
          <div
            ref={reportRef}
            id="printable-report"
            className="bg-white text-slate-900 border border-slate-200 rounded-xl p-5 sm:p-7 max-w-[760px] mx-auto shadow-xl space-y-3.5 font-sans"
            style={{ minHeight: '980px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            
            {/* Top Container */}
            <div className="space-y-3.5">
              {/* 1. Official Header Banner */}
              <div className="border-b-2 border-slate-900 pb-2.5">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <div className="flex items-center space-x-1.5 text-blue-800 font-bold text-[10px] uppercase tracking-wider mb-0.5">
                      <Building2 className="w-3.5 h-3.5 text-blue-700" />
                      <span>{activeCompany.industry} • {isInvestor ? '智析財策 AI 價值投資與基本面研究報告' : '智析財策 AI 財務分析與經營決策報告'}</span>
                    </div>
                    <h1 className="text-xl font-black text-slate-950 tracking-tight">
                      {activeCompany.name}
                    </h1>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      股票代號 / 識別碼：<span className="font-mono font-bold text-slate-800">{activeCompany.code}</span> • 報告基準期：<span className="font-bold text-slate-900">{latestPeriod.period}</span>
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 text-[11px] font-bold">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>{isInvestor ? '投資評級' : 'AI 診斷評級'}: {health.rating} ({health.totalScore}分)</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-end space-x-1">
                      <Calendar className="w-2.5 h-2.5" />
                      <span>產出日期: {currentDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Executive Summary Box */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <h2 className="text-[11px] font-bold text-blue-900 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  {isInvestor ? '價值投資總評與基本面全景 (Investment Executive Summary)' : '執行摘要與經營全景診斷 (Executive Summary)'}
                </h2>
                <p className="text-[11px] text-slate-800 leading-relaxed font-normal">
                  {isInvestor
                    ? `【價值投資視角總評】${activeCompany.name} 在 ${latestPeriod.period} 展現出「${curRatios.economicMoat === 'wide' ? '寬廣經濟護城河 (Wide Moat)' : curRatios.economicMoat === 'narrow' ? '中度競爭壁壘' : '一般競爭結構'}」，營業毛利率 ${curRatios.grossMargin}% 展現良好定價能力。獲利含金量達 ${curRatios.ocfToNetIncome}%（真實現金流落袋扎實），自由現金流為 NT$ ${(curRatios.freeCashFlow / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })} 百萬元，Altman Z 破產防禦分數錄得 ${curRatios.altmanZScore} 分（處於 ${curRatios.altmanZZone === 'safe' ? '安全堡壘區' : '穩定區'}），整體具備高度基本面防禦韌性。`
                    : aiReport.executiveSummary}
                </p>
              </div>

              {/* 3. Key Financial Ratios Snapshot Grid */}
              <div>
                <h2 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {isInvestor ? '價值投資核心指標 (Value & Solvency Ratios)' : '關鍵營運與財務指標摘要 (Key Ratios & Indicators)'}
                </h2>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  
                  {isInvestor ? (
                    <>
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-slate-500 block text-[9px]">經濟護城河 (Economic Moat)</span>
                        <div className="text-xs sm:text-sm font-bold text-amber-900 mt-0.5 font-sans">
                          {curRatios.economicMoat === 'wide' ? '👑 寬護城河' : curRatios.economicMoat === 'narrow' ? '🛡️ 窄護城河' : '無顯著壁壘'}
                        </div>
                      </div>

                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-slate-500 block text-[9px]">獲利含金量 (OCF/Net)</span>
                        <div className="text-xs sm:text-sm font-bold text-emerald-800 mt-0.5 font-mono">
                          {curRatios.ocfToNetIncome}% <span className="text-[9px] text-slate-600 font-normal font-sans">({curRatios.ocfToNetIncome >= 100 ? '真金白銀' : '正常'})</span>
                        </div>
                      </div>

                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-slate-500 block text-[9px]">自由現金流 (FCF)</span>
                        <div className="text-xs sm:text-sm font-bold text-blue-900 mt-0.5 font-mono">
                          ${(curRatios.freeCashFlow / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })} M
                        </div>
                      </div>

                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-slate-500 block text-[9px]">Altman Z 破產防禦分</span>
                        <div className="text-xs sm:text-sm font-bold text-purple-900 mt-0.5 font-mono">
                          {curRatios.altmanZScore} 分 <span className="text-[9px] text-slate-600 font-normal font-sans">({curRatios.altmanZZone === 'safe' ? '安全堡壘' : '灰色區'})</span>
                        </div>
                      </div>

                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-slate-500 block text-[9px]">營業毛利率 (定價壁壘)</span>
                        <div className="text-xs sm:text-sm font-bold text-emerald-800 mt-0.5 font-mono">
                          {curRatios.grossMargin}%
                        </div>
                      </div>

                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-slate-500 block text-[9px]">股東權益報酬率 (ROE)</span>
                        <div className="text-xs sm:text-sm font-bold text-amber-900 mt-0.5 font-mono">
                          {curRatios.roe}% <span className="text-[9px] text-slate-600 font-normal font-sans">(EPS ${curRatios.eps})</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-slate-500 block text-[9px]">應收帳款週轉率 / DSO</span>
                        <div className="text-xs sm:text-sm font-bold text-blue-900 mt-0.5 font-mono">
                          {curRatios.arTurnover} 次 <span className="text-[9px] text-slate-600 font-normal font-sans">({curRatios.dso} 天)</span>
                        </div>
                      </div>

                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-slate-500 block text-[9px]">存貨週轉率 / DSI</span>
                        <div className="text-xs sm:text-sm font-bold text-indigo-900 mt-0.5 font-mono">
                          {curRatios.inventoryTurnover} 次 <span className="text-[9px] text-slate-600 font-normal font-sans">({curRatios.dsi} 天)</span>
                        </div>
                      </div>

                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-slate-500 block text-[9px]">現金轉換循環 (CCC)</span>
                        <div className="text-xs sm:text-sm font-bold text-cyan-900 mt-0.5 font-mono">
                          {curRatios.cashConversionCycle} 天
                        </div>
                      </div>

                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-slate-500 block text-[9px]">營業毛利率 (Gross Margin)</span>
                        <div className="text-xs sm:text-sm font-bold text-emerald-800 mt-0.5 font-mono">
                          {curRatios.grossMargin}%
                        </div>
                      </div>

                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-slate-500 block text-[9px]">營業利益率 (Operating Margin)</span>
                        <div className="text-xs sm:text-sm font-bold text-emerald-800 mt-0.5 font-mono">
                          {curRatios.operatingMargin}%
                        </div>
                      </div>

                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-slate-500 block text-[9px]">股東權益報酬率 (ROE)</span>
                        <div className="text-xs sm:text-sm font-bold text-amber-900 mt-0.5 font-mono">
                          {curRatios.roe}% <span className="text-[9px] text-slate-600 font-normal font-sans">(EPS ${curRatios.eps})</span>
                        </div>
                      </div>
                    </>
                  )}

                </div>
              </div>

              {/* 4. Strengths & Risk Warnings */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                  <div className="flex items-center space-x-1 text-emerald-900 font-bold mb-1.5 text-[11px]">
                    <CheckCircle2 className="w-3 h-3 text-emerald-700 flex-shrink-0" />
                    <span>核心競爭優勢與亮點</span>
                  </div>
                  <ul className="space-y-1 text-emerald-950 text-[10px] leading-tight">
                    {(aiReport.strengths && aiReport.strengths.length > 0) ? (
                      aiReport.strengths.slice(0, 3).map((s, i) => (
                        <li key={i}>• {s}</li>
                      ))
                    ) : (
                      <li className="text-emerald-800 italic">• 財務指標表現均衡穩定</li>
                    )}
                  </ul>
                </div>

                <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-xl">
                  <div className="flex items-center space-x-1 text-amber-900 font-bold mb-1.5 text-[11px]">
                    <AlertTriangle className="w-3 h-3 text-amber-700 flex-shrink-0" />
                    <span>潛在風險與改善空間</span>
                  </div>
                  <ul className="space-y-1 text-amber-950 text-[10px] leading-tight">
                    {(aiReport.weaknessesAndRisks && aiReport.weaknessesAndRisks.length > 0) ? (
                      aiReport.weaknessesAndRisks.slice(0, 3).map((w, i) => (
                        <li key={i}>• {w}</li>
                      ))
                    ) : (
                      <li className="text-amber-800 italic">• 各項營運指標達標，持續監控景氣變數</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* 5. DuPont Decomposition Breakdown */}
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <h3 className="font-bold text-slate-900 mb-1 text-[11px]">
                  杜邦分析三因子歸因 (DuPont Attribution)
                </h3>
                <div className="flex items-center justify-between text-center font-mono flex-wrap gap-1 px-1 text-[11px]">
                  <div>
                    <span className="text-slate-500 block text-[9px]">稅後純益率</span>
                    <span className="text-emerald-800 font-bold">{curRatios.dupontNetMargin}%</span>
                  </div>
                  <span className="text-slate-400 font-sans font-bold">×</span>
                  <div>
                    <span className="text-slate-500 block text-[9px]">總資產週轉率</span>
                    <span className="text-blue-900 font-bold">{curRatios.dupontAssetTurnover}次</span>
                  </div>
                  <span className="text-slate-400 font-sans font-bold">×</span>
                  <div>
                    <span className="text-slate-500 block text-[9px]">權益乘數</span>
                    <span className="text-indigo-900 font-bold">{curRatios.dupontEquityMultiplier}倍</span>
                  </div>
                  <span className="text-slate-400 font-sans font-bold">=</span>
                  <div>
                    <span className="text-amber-900 block text-[9px]">ROE 報酬率</span>
                    <span className="text-amber-900 font-bold">{curRatios.dupontRoe}%</span>
                  </div>
                </div>
              </div>

              {/* 6. Strategic Recommendations */}
              <div>
                <h3 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  決策行動方案建議 (Strategic Action Matrix)
                </h3>
                <div className="space-y-1.5 text-xs">
                  {aiReport.strategicRecommendations.map((rec, i) => (
                    <div key={i} className="p-2 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-[10.5px]">
                      <div>
                        <span className="font-bold text-slate-900">【{rec.category}】</span>
                        <span className="text-slate-700 ml-1">{rec.action}</span>
                      </div>
                      <span className="text-[9.5px] text-blue-800 font-semibold flex-shrink-0 ml-2 font-mono bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                        成效: {rec.expectedImpact}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 7. Footer Sign-off & Disclaimer (Bottom Pinned) */}
            <div className="border-t border-slate-200 pt-2 space-y-0.5 text-[9px] text-slate-500">
              <div className="flex justify-between items-center">
                <span>報告由「智析財策 AI (Finalyze AI) 企業財務報表分析與經營決策系統」自動生成 • 內部機密文件</span>
                <span className="font-bold">頁碼 1 / 1</span>
              </div>
              <p className="text-[8.5px] text-slate-400 leading-tight">
                【免責聲明】本分析報告及其杜邦拆解、營運預測與建議僅供企業內部經營決策輔助與情境評估參考，不構成任何形式之法定簽證、公開財務確信、稅務或投資建議。
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};


