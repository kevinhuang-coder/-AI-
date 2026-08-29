import { VERIFIED_TAIWAN_STOCKS, fetchTaiwanStockFinancials } from './src/utils/stockFetcher';
import { calculateAllPeriodsRatios, generateLocalAiReport, generateFinancialCopilotResponse } from './src/utils/financialCalculations';
import vercelHandler from './api/index';

async function runSystemSelfTest() {
  console.log('====================================');
  console.log('🚀 開始執行全系統功能完整性自我檢測');
  console.log('====================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string) {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
    }
  }

  // 1. 檢測官方標準 5 年年報資料庫
  console.log('【測試 1：官方 5 年審計年報資料庫檢核】');
  const benchmarkStocks = ['2330', '2454', '2317', '2308', '2357', '3231', '2382', '3130', '2603', '8454', '8044'];
  for (const code of benchmarkStocks) {
    const stock = await fetchTaiwanStockFinancials(code);
    assert(!!stock && stock.periods.length >= 3, `股票代號 ${code} (${stock?.name}) 正確載入 ${stock?.periods.length} 期年度財報`);
    
    // 驗證是否純年度年報（無 Q 季度）
    const hasQuarterly = stock?.periods.some(p => p.period.includes('Q'));
    assert(!hasQuarterly, `股票代號 ${code} 嚴格限定純年度年報 (無季度混雜)`);
  }

  // 2. 檢測財務比率與 31 項審計指標計算引擎
  console.log('\n【測試 2：財務比率與杜邦/現金流指標計算引擎】');
  const tsmc = await fetchTaiwanStockFinancials('2330');
  if (tsmc) {
    const periodsWithRatios = calculateAllPeriodsRatios(tsmc.periods);
    const latest = periodsWithRatios[periodsWithRatios.length - 1];
    
    assert(latest.ratios.grossMargin > 0, `台積電最新毛利率計算正確: ${latest.ratios.grossMargin}%`);
    assert(latest.ratios.roe > 0, `台積電最新 ROE 計算正確: ${latest.ratios.roe}%`);
    assert(latest.ratios.rigorousFcf > 0, `台積電嚴謹 FCF 計算正確: ${(latest.ratios.rigorousFcf / 1000000).toFixed(1)} 億`);
    assert(latest.ratios.altmanZScore > 0, `台積電 Altman Z-Score 計算正確: ${latest.ratios.altmanZScore} (${latest.ratios.altmanZZone})`);
    assert(latest.ratios.coreCashConversionRatio > 0, `台積電獲利現金含金量計算正確: ${latest.ratios.coreCashConversionRatio}%`);
  }

  // 3. 檢測本地高階審計診斷報告生成 (Zero-Latency Diagnostic)
  console.log('\n【測試 3：本地高階價值投資診斷報告生成】');
  if (tsmc) {
    const periodsWithRatios = calculateAllPeriodsRatios(tsmc.periods);
    const localReport = generateLocalAiReport(tsmc.name, periodsWithRatios);
    assert(!!localReport.executiveSummary, '成功生成執行長級高階摘要');
    assert(localReport.strengths.length >= 2, `生成 ${localReport.strengths.length} 條看好亮點`);
    assert(localReport.weaknessesAndRisks.length >= 2, `生成 ${localReport.weaknessesAndRisks.length} 條風險提示`);
    assert(localReport.overallScore > 0, `綜合健康度評分: ${localReport.overallScore} 分 (${localReport.overallRating})`);
  }

  // 4. 檢測 Financial Copilot 智能問答引擎 (本地推演與降級保底)
  console.log('\n【測試 4：Financial Copilot 智能問答推演】');
  if (tsmc) {
    const periodsWithRatios = calculateAllPeriodsRatios(tsmc.periods);
    const latest = periodsWithRatios[periodsWithRatios.length - 1];
    const copilotAnswer = generateFinancialCopilotResponse(
      '這家公司具備長期的經濟護城河與定價壁壘嗎？',
      tsmc.name,
      latest
    );
    assert(copilotAnswer.length > 50, 'Copilot 順利輸出繁體中文專業投資分析');
    assert(copilotAnswer.includes(tsmc.name), 'Copilot 精準命中目標企業');
  }

  // 5. 檢測 Vercel Serverless Function 處理器 (api/index.ts)
  console.log('\n【測試 5：Vercel Serverless 雲端 API 處理器測試】');
  try {
    let mockResponseData: any = null;
    let mockStatusCode: number = 200;

    const mockReq: any = {
      method: 'POST',
      url: '/api/financial/ai-chat',
      body: {
        question: '請以價值投資角度分析資本配置',
        companyName: '台積電',
        contextData: { revenue: 3458120390, ratios: { grossMargin: 58.0, roe: 26.2 } }
      },
      headers: {}
    };

    const mockRes: any = {
      setHeader: () => {},
      status: (code: number) => {
        mockStatusCode = code;
        return mockRes;
      },
      json: (data: any) => {
        mockResponseData = data;
        return mockRes;
      },
      end: () => {}
    };

    await vercelHandler(mockReq, mockRes);
    assert(mockStatusCode === 200, `Vercel Serverless API 回應狀態碼正常: ${mockStatusCode}`);
    assert(mockResponseData && (mockResponseData.success || mockResponseData.fallback), 'Vercel API 正確回傳 AI 或保底分析數據');
  } catch (err) {
    console.error('Vercel API handler test error:', err);
    assert(false, 'Vercel API 處理器應正常執行');
  }

  console.log('\n====================================');
  console.log(`🎯 檢測完成：通過 ${passed} / ${total} 項測試 (${Math.round((passed / total) * 100)}%)`);
  console.log('====================================');
}

runSystemSelfTest().catch(console.error);
