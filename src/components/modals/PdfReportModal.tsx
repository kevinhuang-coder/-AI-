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
  const { isPdfModalOpen, setIsPdfModalOpen, activeCompany, latestPeriod, aiReport } =
    useFinancial();

  const reportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  if (!isPdfModalOpen || !latestPeriod || !aiReport) return null;

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
        scale: 2.5,
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

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 5) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`${activeCompany.name}_財務報表分析與經營決策報告_${latestPeriod.period}.pdf`);
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
        <div className="no-print px-4 sm:px-6 py-3 sm:py-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                PDF 財務分析報告預覽與匯出
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400">
                符合高階主管與董事會呈報標準之高解析度 A4 財務決策診斷書
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 sm:px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition min-h-[36px] cursor-pointer"
            >
              <Printer className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span>直接列印</span>
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="flex items-center space-x-1.5 px-4 sm:px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-600/25 disabled:opacity-50 min-h-[36px] cursor-pointer"
            >
              <Download className={`w-4 h-4 flex-shrink-0 ${isExporting ? 'animate-bounce' : ''}`} />
              <span>{isExporting ? '產生高畫質 PDF 中...' : '下載 A4 PDF 報告'}</span>
            </button>
            <button
              onClick={() => setIsPdfModalOpen(false)}
              className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Report Canvas (Executive White Paper Theme) */}
        <div id="printable-report-wrapper" className="p-3 sm:p-6 overflow-y-auto flex-1 bg-slate-950/80">
          
          <div
            ref={reportRef}
            id="printable-report"
            className="bg-white text-slate-900 border border-slate-200 rounded-xl sm:rounded-2xl p-6 sm:p-9 max-w-3xl mx-auto shadow-xl space-y-5 font-sans"
          >
            
            {/* 1. Official Header Banner */}
            <div className="border-b-2 border-slate-900 pb-4">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                <div>
                  <div className="flex items-center space-x-1.5 text-blue-700 font-bold text-xs uppercase tracking-wider mb-1">
                    <Building2 className="w-4 h-4" />
                    <span>{activeCompany.industry} • 智析財策 AI 財務分析與經營決策報告</span>
                  </div>
                  <h1 className="text-2xl font-black text-slate-950 tracking-tight">
                    {activeCompany.name}
                  </h1>
                  <p className="text-xs text-slate-600 mt-1">
                    股票代號 / 識別碼：<span className="font-mono font-bold text-slate-800">{activeCompany.code}</span> • 報告基準期：<span className="font-bold text-slate-900">{latestPeriod.period}</span>
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>AI 診斷評級: {health.rating} ({health.totalScore}分)</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1.5 flex items-center sm:justify-end space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>產出日期: {currentDate}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Executive Summary Box */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h2 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                執行摘要與經營全景診斷 (Executive Summary)
              </h2>
              <p className="text-xs text-slate-800 leading-relaxed font-normal">
                {aiReport.executiveSummary}
              </p>
            </div>

            {/* 3. Key Financial Ratios Snapshot Grid */}
            <div>
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                關鍵指標摘要 (Key Ratios & Indicators)
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">應收帳款週轉率 / DSO</span>
                  <div className="text-sm sm:text-base font-bold text-blue-900 mt-0.5 font-mono">
                    {curRatios.arTurnover} 次 <span className="text-[10px] text-slate-600 font-normal font-sans">({curRatios.dso} 天)</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">存貨週轉率 / DSI</span>
                  <div className="text-sm sm:text-base font-bold text-indigo-900 mt-0.5 font-mono">
                    {curRatios.inventoryTurnover} 次 <span className="text-[10px] text-slate-600 font-normal font-sans">({curRatios.dsi} 天)</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">現金轉換循環 (CCC)</span>
                  <div className="text-sm sm:text-base font-bold text-cyan-900 mt-0.5 font-mono">
                    {curRatios.cashConversionCycle} 天
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">營業毛利率 (Gross Margin)</span>
                  <div className="text-sm sm:text-base font-bold text-emerald-800 mt-0.5 font-mono">
                    {curRatios.grossMargin}%
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">營業利益率 (Operating Margin)</span>
                  <div className="text-sm sm:text-base font-bold text-emerald-800 mt-0.5 font-mono">
                    {curRatios.operatingMargin}%
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">股東權益報酬率 (ROE)</span>
                  <div className="text-sm sm:text-base font-bold text-amber-900 mt-0.5 font-mono">
                    {curRatios.roe}% <span className="text-[10px] text-slate-600 font-normal font-sans">(EPS ${curRatios.eps})</span>
                  </div>
                </div>

              </div>
            </div>

            {/* 4. Strengths & Risk Warnings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                <div className="flex items-center space-x-1.5 text-emerald-900 font-bold mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                  <span>核心競爭優勢與經營亮點</span>
                </div>
                <ul className="space-y-1.5 text-emerald-950 text-[11px]">
                  {(aiReport.strengths && aiReport.strengths.length > 0) ? (
                    aiReport.strengths.slice(0, 3).map((s, i) => (
                      <li key={i}>• {s}</li>
                    ))
                  ) : (
                    <li className="text-emerald-800 italic">• 財務指標表現均衡穩定</li>
                  )}
                </ul>
              </div>

              <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl">
                <div className="flex items-center space-x-1.5 text-amber-900 font-bold mb-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                  <span>潛在風險警訊與改善空間</span>
                </div>
                <ul className="space-y-1.5 text-amber-950 text-[11px]">
                  {(aiReport.weaknessesAndRisks && aiReport.weaknessesAndRisks.length > 0) ? (
                    aiReport.weaknessesAndRisks.slice(0, 3).map((w, i) => (
                      <li key={i}>• {w}</li>
                    ))
                  ) : (
                    <li className="text-amber-800 italic">• 各項營運與獲利指標均達標，持續監控外在景氣變數</li>
                  )}
                </ul>
              </div>
            </div>

            {/* 5. DuPont Decomposition Breakdown */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <h3 className="font-bold text-slate-900 mb-2">
                杜邦分析三因子歸因 (DuPont Attribution)
              </h3>
              <div className="flex items-center justify-between text-center font-mono flex-wrap gap-2 px-2">
                <div>
                  <span className="text-slate-500 block text-[10px]">稅後純益率</span>
                  <span className="text-emerald-800 font-bold text-xs sm:text-sm">{curRatios.dupontNetMargin}%</span>
                </div>
                <span className="text-slate-400 font-sans font-bold">×</span>
                <div>
                  <span className="text-slate-500 block text-[10px]">總資產週轉率</span>
                  <span className="text-blue-900 font-bold text-xs sm:text-sm">{curRatios.dupontAssetTurnover}次</span>
                </div>
                <span className="text-slate-400 font-sans font-bold">×</span>
                <div>
                  <span className="text-slate-500 block text-[10px]">權益乘數</span>
                  <span className="text-indigo-900 font-bold text-xs sm:text-sm">{curRatios.dupontEquityMultiplier}倍</span>
                </div>
                <span className="text-slate-400 font-sans font-bold">=</span>
                <div>
                  <span className="text-amber-900 block text-[10px]">ROE 報酬率</span>
                  <span className="text-amber-900 font-bold text-xs sm:text-sm">{curRatios.dupontRoe}%</span>
                </div>
              </div>
            </div>

            {/* 6. Strategic Recommendations */}
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                決策行動方案建議 (Strategic Action Matrix)
              </h3>
              <div className="space-y-2 text-xs">
                {aiReport.strategicRecommendations.map((rec, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5">
                    <div>
                      <span className="font-bold text-slate-900">【{rec.category}】</span>
                      <span className="text-slate-700 ml-1">{rec.action}</span>
                    </div>
                    <span className="text-[11px] text-blue-800 font-semibold flex-shrink-0 sm:ml-2 font-mono bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      成效: {rec.expectedImpact}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 7. Footer Sign-off & Disclaimer */}
            <div className="border-t border-slate-200 pt-3 space-y-1 text-[10px] text-slate-500">
              <div className="flex justify-between items-center">
                <span>報告由「智析財策 AI (Finalyze AI) 企業財務報表分析與經營決策系統」自動生成 • 內部機密文件</span>
                <span>頁碼 1 / 1</span>
              </div>
              <p className="text-[9px] text-slate-400 leading-normal">
                【免責聲明】本分析報告及其杜邦拆解、營運預測與建議僅供企業內部經營決策輔助與情境評估參考，不構成任何形式之法定簽證、公開財務確信、稅務或投資建議。
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

