import React, { useRef, useState, useMemo } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import { calculateHealthDimensions, generateLocalAiReport } from '../../utils/financialCalculations';
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
  Bot,
  Target,
  ShieldCheck,
  TrendingUp,
  RotateCcw,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const PdfReportModal: React.FC = () => {
  const {
    isPdfModalOpen,
    setIsPdfModalOpen,
    activeCompany,
    latestPeriod,
    aiReport,
    activeCompanyPeriodsWithRatios,
    viewMode,
  } = useFinancial();

  const reportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  // 確保無論何時開啟，都能即時獲得完整的分析診斷數據
  const effectiveReport = useMemo(() => {
    if (aiReport) return aiReport;
    if (activeCompany && activeCompanyPeriodsWithRatios.length > 0) {
      return generateLocalAiReport(activeCompany.name, activeCompanyPeriodsWithRatios);
    }
    return null;
  }, [aiReport, activeCompany, activeCompanyPeriodsWithRatios]);

  if (!isPdfModalOpen || !latestPeriod || !effectiveReport) return null;

  const isInvestor = viewMode === 'investor';
  const health = calculateHealthDimensions(latestPeriod);
  const r = latestPeriod.ratios;
  const currentDate = new Date().toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  /**
   * 獨立單頁 A4 隔離列印引擎
   * 徹底隔離背景網頁，保證輸出精準 1 頁 A4，絕不溢出多頁！
   */
  const handlePrintIsolatedA4 = () => {
    if (!reportRef.current) return;
    const contentHtml = reportRef.current.innerHTML;

    const oldIframe = document.getElementById('a4-print-isolated-iframe');
    if (oldIframe) oldIframe.remove();

    const iframe = document.createElement('iframe');
    iframe.id = 'a4-print-isolated-iframe';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) return;

    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map((el) => el.outerHTML)
      .join('\n');

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${activeCompany.code || ''}_${activeCompany.name}_基本面深度診斷報告_${latestPeriod.period}</title>
          ${styles}
          <style>
            @page {
              size: A4 portrait;
              margin: 5mm 6mm;
            }
            * {
              box-sizing: border-box;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            html, body {
              margin: 0;
              padding: 0;
              background: #ffffff !important;
              color: #0f172a !important;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang TC", "Noto Sans TC", sans-serif;
              font-size: 10px;
            }
            .a4-sheet {
              width: 100%;
              max-width: 100%;
              height: 285mm;
              max-height: 285mm;
              overflow: hidden;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              background: #ffffff;
              padding: 2px;
            }
          </style>
        </head>
        <body>
          <div class="a4-sheet">
            ${contentHtml}
          </div>
        </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    }, 250);
  };

  /**
   * 一鍵直接下載單頁 A4 PDF 檔案
   */
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
        windowWidth: 794,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.96);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      // 嚴格確保只輸出單頁 A4（210mm x 297mm）
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');

      const fileName = `${activeCompany.code ? activeCompany.code + '_' : ''}${activeCompany.name}_基本面深度診斷報告_${latestPeriod.period}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('PDF Generation failed, falling back to print dialog:', error);
      handlePrintIsolatedA4();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden my-2 sm:my-6 flex flex-col max-h-[94vh] sm:max-h-[92vh]">
        
        {/* Modal Controls Header */}
        <div className="no-print px-4 sm:px-6 py-3 sm:py-3.5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>基本面深度診斷報告產出</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-mono">
                  精準單頁 A4
                </span>
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-400">
                1:1 完整導出主畫面「價值投資與基本面深度診斷報告」，一鍵下載為高解析度單頁 PDF
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={handlePrintIsolatedA4}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold transition min-h-[34px] cursor-pointer"
              title="喚醒瀏覽器列印視窗"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>直接列印</span>
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-900/30 disabled:opacity-50 min-h-[34px] cursor-pointer"
            >
              <Download className={`w-3.5 h-3.5 flex-shrink-0 ${isExporting ? 'animate-bounce' : ''}`} />
              <span>{isExporting ? '正在生成單頁 PDF...' : '下載單頁 A4 PDF'}</span>
            </button>
            <button
              onClick={() => setIsPdfModalOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="關閉預覽視窗"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Report Canvas (Exact 1-Page A4 Dimension: 794px * 1123px) */}
        <div id="printable-report-wrapper" className="p-3 sm:p-6 overflow-y-auto overflow-x-auto flex-1 bg-slate-950/90 flex justify-center items-start">
          
          <div
            ref={reportRef}
            id="printable-report"
            className="bg-white text-slate-900 border border-slate-300 rounded-lg shadow-2xl font-sans"
            style={{
              width: '794px',
              minWidth: '794px',
              maxWidth: '794px',
              height: '1123px',
              minHeight: '1123px',
              maxHeight: '1123px',
              boxSizing: 'border-box',
              padding: '24px 28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              backgroundColor: '#ffffff',
            }}
          >
            
            {/* Top Main Section */}
            <div className="space-y-2">
              
              {/* 1. Header Banner */}
              <div className="border-b-2 border-slate-900 pb-1.5">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <div className="flex items-center space-x-1.5 text-emerald-800 font-bold text-[9.5px] uppercase tracking-wider mb-0.5">
                      <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{activeCompany.industry} • 《凱文黃的知識天地》價值投資與基本面深度診斷報告</span>
                    </div>
                    <h1 className="text-lg font-black text-slate-950 tracking-tight leading-tight">
                      {activeCompany.name}
                    </h1>
                    <p className="text-[9.5px] text-slate-600 mt-0.5">
                      股票代號 / 識別碼：<span className="font-mono font-bold text-slate-800">{activeCompany.code}</span> • 報告基準期：<span className="font-bold text-slate-900">{latestPeriod.period} 官方審定年報</span>
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="inline-flex items-center px-2.5 py-1 rounded bg-slate-900 text-white font-mono font-bold text-[11px] border border-slate-700">
                      <span>綜合財務評級：{health.rating} ({health.totalScore}分)</span>
                    </div>
                    <div className="text-[9px] text-slate-500 mt-1 flex items-center justify-end space-x-1">
                      <Calendar className="w-2.5 h-2.5" />
                      <span>產出日期: {currentDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. 基本面研究核心結論總評 (Executive Summary Narrative) */}
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-900 uppercase tracking-wider mb-0.5">
                  <Bot className="w-3.5 h-3.5 text-indigo-600" />
                  <span>基本面研究核心結論總評 (Executive Diagnostic Conclusion)</span>
                </div>
                <p className="text-[9.5px] text-slate-800 leading-relaxed font-normal">
                  {latestPeriod.netIncome < 0 ? (
                    `【價值投資視角總評】${activeCompany.name} 在 ${latestPeriod.period} 處於「營運虧損與基本面承壓期」，稅後淨損達 NT$ ${(Math.abs(latestPeriod.netIncome) / 1000).toLocaleString()} 百萬元（ROE 為 ${r.roe}%，每股虧損 NT$ ${r.eps}）。雖然營業毛利率為 ${r.grossMargin}%，但嚴謹自由現金流為實質赤字 NT$ ${(r.rigorousFcf / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })} 百萬元，且 Altman Z 破產防禦分數僅 ${r.altmanZScore} 分（落入 ${r.altmanZZone === 'distress' ? '財務困境警戒區' : '灰色考驗區'}），整體缺乏價值投資安全邊際，應嚴密防範營運現金持續消耗與流動性風險。`
                  ) : r.economicMoat === 'wide' ? (
                    `【價值投資視角總評】${activeCompany.name} 在 ${latestPeriod.period} 展現出「寬廣經濟護城河 (Wide Moat)」，營業毛利率 ${r.grossMargin}% 與 ROE ${r.roe}% 展現出強大的定價自主權與長期資本複利潛力。核心本業現金轉換率達 ${r.coreCashConversionRatio}%，創造嚴謹自由現金流 NT$ ${(r.rigorousFcf / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })} 百萬元，Altman Z 評分達 ${r.altmanZScore} 分（處於 安全堡壘區），具備極高基本面安全邊際。`
                  ) : (
                    `【價值投資視角總評】${activeCompany.name} 在 ${latestPeriod.period} 展現出「${r.economicMoat === 'narrow' ? '中度競爭壁壘' : '一般競爭結構'}」，營業毛利率 ${r.grossMargin}%，ROE 為 ${r.roe}%。核心本業現金轉換率達 ${r.coreCashConversionRatio}%，自由現金流為 NT$ ${(r.rigorousFcf / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })} 百萬元，Altman Z 破產防禦分數為 ${r.altmanZScore} 分（處於 ${r.altmanZZone === 'safe' ? '安全堡壘區' : r.altmanZZone === 'grey' ? '灰色過渡區' : '警戒區'}）。`
                  )}
                </p>
              </div>

              {/* 3. 多空投資論點對比 (Bull Case vs Bear Case) */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                
                {/* 多方看好亮點 */}
                <div className="p-2 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                  <div className="flex items-center space-x-1 text-emerald-900 font-bold mb-1 text-[10px]">
                    <CheckCircle2 className="w-3 h-3 text-emerald-700 flex-shrink-0" />
                    <span>🟢 核心競爭優勢與多方亮點 (Bull Case Thesis)</span>
                  </div>
                  <ul className="space-y-0.5 text-emerald-950 text-[9px] leading-tight">
                    {latestPeriod.netIncome < 0 ? (
                      <>
                        <li>• <strong>日常本業現金流入：</strong>營業現金流為 NT$ ${(latestPeriod.operatingCashFlow / 1000).toLocaleString()} 百萬元，日常營運未全面斷流。</li>
                        <li>• <strong>基礎產品銷貨毛利：</strong>營業毛利率維持在 {r.grossMargin}%，仍具備基礎銷貨毛利空間。</li>
                        <li>• <strong>轉型重整契機：</strong>若能加速處分虧損事業與優化費用結構，具備潛在轉虧為盈題材。</li>
                      </>
                    ) : (
                      <>
                        <li>• <strong>卓越資本回報力：</strong>ROE 達 {r.roe}%，每股盈餘 EPS 達 NT$ {r.eps}，展現長期複利滾動潛力。</li>
                        <li>• <strong>營運現金流入扎實：</strong>核心現金轉換率 {r.coreCashConversionRatio}%，營業現金流高於帳面利潤，盈餘品質優良。</li>
                        <li>• <strong>安全堡壘防禦：</strong>Altman Z-Score {r.altmanZScore} 分，純計息負債比僅 {r.interestBearingDebtRatio}%，具抗風險底氣。</li>
                      </>
                    )}
                  </ul>
                </div>

                {/* 空方風險地雷提示 */}
                <div className="p-2 bg-amber-50/70 border border-amber-200 rounded-xl">
                  <div className="flex items-center space-x-1 text-amber-900 font-bold mb-1 text-[10px]">
                    <AlertTriangle className="w-3 h-3 text-amber-700 flex-shrink-0" />
                    <span>🔴 潛在風險警訊與隱憂提示 (Bear Case Risks)</span>
                  </div>
                  <ul className="space-y-0.5 text-amber-950 text-[9px] leading-tight">
                    {latestPeriod.netIncome < 0 ? (
                      <>
                        <li>• <strong>實質虧損侵蝕淨值：</strong>稅後淨損達 NT$ ${(Math.abs(latestPeriod.netIncome) / 1000).toLocaleString()} 百萬元，淨值遭實質減損。</li>
                        <li>• <strong>自由現金流赤字：</strong>自由現金流為淨流出 NT$ ${(Math.abs(r.rigorousFcf) / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })} 百萬元，營運現金持續消耗。</li>
                        <li>• <strong>破產防禦落入警戒：</strong>Altman Z 分數僅 {r.altmanZScore} 分，需高度防範債務展延與流動性風險。</li>
                      </>
                    ) : (
                      <>
                        <li>• <strong>資本支出折舊壓力：</strong>本期 CapEx 達 NT$ ${(latestPeriod.capitalExpenditures / 1000).toLocaleString()} 百萬元，需追蹤新產能毛利效益。</li>
                        <li>• <strong>同業競爭與毛利防禦：</strong>面對產業價格競爭，需嚴密防範毛利率是否出現逐季侵蝕跡象。</li>
                        <li>• <strong>估值防禦與市場預期：</strong>若市場給予高本益比評價，需確保營收成長率能如期兌現以支撐估值。</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>

              {/* 4. 四大核心維度深度診斷模組 (4 Diagnostic Pillars) */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                
                {/* 護城河評級 */}
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[9.5px] font-bold text-blue-950 flex items-center gap-1 mb-0.5">
                    <RotateCcw className="w-3 h-3 text-blue-700" />
                    經濟護城河與定價壁壘 (Moat & Pricing Power)
                  </span>
                  <p className="text-[9px] text-slate-700 leading-snug">
                    {latestPeriod.netIncome < 0
                      ? `目前本業呈虧損狀態，毛利率為 ${r.grossMargin}%，尚未形成堅實之長期經濟護城河，面對激烈市場競爭缺乏定價保護。`
                      : `營業毛利率達 ${r.grossMargin}%，技術與品牌護城河深度評定為「${r.economicMoat === 'wide' ? '寬廣護城河 (Wide Moat)' : r.economicMoat === 'narrow' ? '中度護城河' : '一般結構'}」，具備相應定價自主權。`}
                  </p>
                </div>

                {/* 自由現金流能力 */}
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[9.5px] font-bold text-emerald-950 flex items-center gap-1 mb-0.5">
                    <TrendingUp className="w-3 h-3 text-emerald-700" />
                    獲利現金含金量與 FCF 產生力 (Cash Quality & FCF)
                  </span>
                  <p className="text-[9px] text-slate-700 leading-snug">
                    {r.rigorousFcf < 0
                      ? `嚴謹自由現金流為赤字 NT$ ${(r.rigorousFcf / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })} 百萬元，本期未能產生實質自由現金流，需提防後續營運資金調度壓力。`
                      : `核心現金轉換率達 ${r.coreCashConversionRatio}%，本期創造自由現金流 NT$ ${(r.rigorousFcf / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })} 百萬元，為未來營運擴張提供現金後盾。`}
                  </p>
                </div>

              </div>

              {/* 5. 杜邦分析三因子拆解 (DuPont Decomposition) */}
              <div className="p-1.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div className="flex items-center justify-between px-1 mb-0.5">
                  <h3 className="font-bold text-slate-900 text-[9.5px]">杜邦分析三因子歸因 (DuPont Decomposition Attribution)</h3>
                  <span className="text-[8.5px] text-slate-500 font-mono">ROE = 稅後純益率 × 資產週轉率 × 權益乘數</span>
                </div>
                <div className="flex items-center justify-between text-center font-mono flex-wrap gap-1 px-1 text-[10px]">
                  <div>
                    <span className="text-slate-500 block text-[8px]">稅後純益率</span>
                    <span className="text-emerald-800 font-bold">{r.dupontNetMargin}%</span>
                  </div>
                  <span className="text-slate-400 font-sans font-bold">×</span>
                  <div>
                    <span className="text-slate-500 block text-[8px]">總資產週轉率</span>
                    <span className="text-blue-900 font-bold">{r.dupontAssetTurnover}次</span>
                  </div>
                  <span className="text-slate-400 font-sans font-bold">×</span>
                  <div>
                    <span className="text-slate-500 block text-[8px]">權益乘數 (槓桿)</span>
                    <span className="text-indigo-900 font-bold">{r.dupontEquityMultiplier}倍</span>
                  </div>
                  <span className="text-slate-400 font-sans font-bold">=</span>
                  <div>
                    <span className="text-amber-900 block text-[8px]">ROE 股東權益報酬率</span>
                    <span className="text-amber-900 font-bold">{r.dupontRoe}%</span>
                  </div>
                </div>
              </div>

              {/* 6. 價值投資人長期策略指引 (Investment Guidance & Action Matrix) */}
              <div>
                <div className="flex items-center space-x-1 text-[10px] font-bold text-indigo-900 uppercase tracking-wider mb-1">
                  <Target className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                  <span>價值投資人長期策略指引 (Value Investment Strategy Guidance)</span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  
                  {/* Pillar 1 */}
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[9px] font-bold text-slate-900">長線複利潛力</span>
                        <span className="text-[8px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                          {latestPeriod.netIncome < 0 ? '承壓虧損' : r.roe >= 15 ? '優質複利' : '穩健持平'}
                        </span>
                      </div>
                      <p className="text-[8.5px] text-slate-700 leading-tight">
                        {latestPeriod.netIncome < 0
                          ? `ROE 為負值 (${r.roe}%)，本業虧損，投資人應避免盲目抄底。`
                          : `具備高 ROE (${r.roe}%)，適合價值型投資者逢回檔分批評估持有價值。`}
                      </p>
                    </div>
                    <div className="mt-1 pt-1 border-t border-slate-200 text-[8px] text-emerald-800 font-semibold">
                      關注: {latestPeriod.netIncome < 0 ? '何時由虧轉盈及毛利回升' : '每季毛利率與 EPS 成長性'}
                    </div>
                  </div>

                  {/* Pillar 2 */}
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[9px] font-bold text-slate-900">股息與自由現金保護</span>
                        <span className="text-[8px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 border border-blue-300">
                          {r.rigorousFcf <= 0 ? '現金吃緊' : '現金流充沛'}
                        </span>
                      </div>
                      <p className="text-[8.5px] text-slate-700 leading-tight">
                        {r.rigorousFcf <= 0
                          ? `自由現金流赤字 (NT$ ${(r.rigorousFcf / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })}M)，短期缺乏實質現金股息支撐。`
                          : `自由現金流充沛，具備持續穩定配發現金股息之財務實力，下行防禦性高。`}
                      </p>
                    </div>
                    <div className="mt-1 pt-1 border-t border-slate-200 text-[8px] text-blue-800 font-semibold">
                      關注: {r.rigorousFcf <= 0 ? '防範再籌資與現金存量消耗' : '檢驗 CapEx 對 FCF 之佔用比'}
                    </div>
                  </div>

                  {/* Pillar 3 */}
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[9px] font-bold text-slate-900">破產防禦與安全邊際</span>
                        <span className="text-[8px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 border border-purple-300">
                          {r.altmanZZone === 'safe' ? '堡壘級' : r.altmanZZone === 'grey' ? '觀察區' : '困境警戒'}
                        </span>
                      </div>
                      <p className="text-[8.5px] text-slate-700 leading-tight">
                        {r.altmanZZone === 'safe'
                          ? `Altman Z 達 ${r.altmanZScore} 分，負債結構穩固，即使遭遇大環境逆風亦無財務危機隱憂。`
                          : `Altman Z 為 ${r.altmanZScore} 分，需密切留意營運資金週轉與短期借款展延能力。`}
                      </p>
                    </div>
                    <div className="mt-1 pt-1 border-t border-slate-200 text-[8px] text-purple-800 font-semibold">
                      關注: {r.altmanZZone === 'distress' ? '防範流動性危機與信用風險' : '確保流動比率維持在 180% 以上'}
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* 7. Footer Sign-off & Disclaimer (Bottom Pinned) */}
            <div className="border-t border-slate-200 pt-1.5 space-y-0.5 text-[8px] text-slate-500">
              <div className="flex justify-between items-center">
                <span>報告由「價值決策 (Value Decision) 財報分析工具」自動生成 • 內部研究參考文件</span>
                <span className="font-bold">第 1 頁 / 共 1 頁</span>
              </div>
              <p className="text-[7.5px] text-slate-400 leading-tight">
                【免責聲明】本分析報告及其財務指標、杜邦拆解與建議僅供基本面學術研討與決策輔助參考，不構成任何形式之法定簽證、公開財務確信、稅務或特定個股投資買賣建議。
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
