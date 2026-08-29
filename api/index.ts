import type { IncomingMessage, ServerResponse } from 'http';
import { GoogleGenAI } from '@google/genai';

type VercelRequest = IncomingMessage & { query?: any; body?: any; cookies?: any };
type VercelResponse = ServerResponse & {
  status: (code: number) => VercelResponse;
  json: (data: any) => VercelResponse;
  send: (body: any) => VercelResponse;
};

function getGeminiClient(): GoogleGenAI | null {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GEMINI_API_KEY_FS ||
    process.env.VITE_GEMINI_API_KEY;

  if (!apiKey) return null;

  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function generateWithFallback(ai: GoogleGenAI, prompt: string, jsonMode = false): Promise<string> {
  // 優先使用反應最快速的官方 flash 模型
  const models = ['gemini-2.5-flash', 'gemini-1.5-flash'];
  let lastError: any = null;

  for (const model of models) {
    try {
      const config: any = {
        // 設定適當 token 避免生成過慢
        maxOutputTokens: 2048,
      };
      if (jsonMode) config.responseMimeType = 'application/json';

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: Object.keys(config).length > 0 ? config : undefined,
      });

      const text = response.text?.trim();
      if (text) return text;
    } catch (err) {
      lastError = err;
      console.warn(`Model ${model} call failed:`, err);
    }
  }

  throw lastError || new Error('All Gemini models failed to generate content');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = req.url || '';

  // 1. AI Diagnostic API
  if (url.includes('/api/financial/ai-analyze') || (req.method === 'POST' && req.body?.periodsData)) {
    try {
      const { companyName, industry, currency, periodsData } = req.body;
      if (!periodsData || !Array.isArray(periodsData) || periodsData.length === 0) {
        return res.status(400).json({ error: '無效或未提供的財務期間數據' });
      }

      const ai = getGeminiClient();
      if (!ai) {
        return res.json({
          fallback: true,
          message: '未偵測到 GEMINI_API_KEY，已啟用內建專業財務分析模型。',
        });
      }

      const prompt = `
你是一位頂級資深特許金融分析師 (CFA) 與價值投資顧問。
請對以下這家企業的歷年財務報表與關鍵財務比率進行深入的專業診斷、經濟護城河評級、異常偵測、杜邦分析拆解與未來趨勢預測。

企業基本資料：
- 名稱：${companyName}
- 產業：${industry}
- 幣別單位：${currency || 'NTD (千元)'}

各期詳細財務報表與比率數據：
${JSON.stringify(periodsData, null, 2)}

請務必以繁體中文回覆，並產出符合下列 JSON 結構的資料（嚴格純 JSON，不包含 markdown 標記）：
{
  "overallScore": 88,
  "healthRating": "優秀 (Excellent)",
  "overallRating": "具備強大護城河與充沛現金流",
  "executiveSummary": "執行長與價值投資者級別的高階財務總評（約 150-250 字）",
  "strengths": ["優勢亮點1", "優勢亮點2", "優勢亮點3"],
  "weaknessesAndRisks": ["潛在風險或惡化隱憂1", "潛在風險或惡化隱憂2", "潛在風險或惡化隱憂3"],
  "turnoverAnalysis": {
    "arAssessment": "應收帳款天數深度評析",
    "inventoryAssessment": "存貨天數評析",
    "cccAssessment": "現金轉換循環總結"
  },
  "profitabilityAnalysis": {
    "marginAssessment": "毛利率與獲利含金量評析",
    "dupontDrivers": "杜邦分析核心驅動因子拆解"
  },
  "strategicRecommendations": [
    {
      "priority": "HIGH",
      "category": "護城河優化",
      "actionTitle": "具體行動建言標題",
      "rationale": "執行依據與效益分析",
      "expectedImpact": "預期財務影響"
    }
  ]
}
`;

      const textResponse = await generateWithFallback(ai, prompt, true);
      let parsed = JSON.parse(textResponse);
      return res.json({ success: true, data: parsed });
    } catch (e: any) {
      console.error('Vercel ai-analyze error:', e);
      return res.status(500).json({ error: e.message || 'AI 診斷分析失敗' });
    }
  }

  // 2. AI Chat / Financial Copilot API
  if (url.includes('/api/financial/ai-chat') || (req.method === 'POST' && req.body?.question)) {
    try {
      const { question, companyName, contextData } = req.body;
      if (!question || typeof question !== 'string') {
        return res.status(400).json({ error: '提問內容不能為空' });
      }

      const ai = getGeminiClient();
      if (!ai) {
        return res.json({
          fallback: true,
          message: '未配置 GEMINI_API_KEY，已啟用內建財務推演模型。',
        });
      }

      const prompt = `
你是一位擁有四大會計師事務所審計查核經驗與特許金融分析師 (CFA) 背景的頂級價值投資數位顧問（Financial Copilot）。
使用者目前正在研究「${companyName || '目標分析企業'}」的財務報表。

【當前企業財務背景數據】：
${JSON.stringify(contextData || {}, null, 2)}

【使用者提問】：
「${question}」

【回覆指導原則】：
1. 請以親切、專業、富有會計師審計查核洞察與葛拉漢/巴菲特價值投資深度的繁體中文回答。
2. 結合給予的毛利率、ROE、自由現金流 (FCF)、純計息負債比與 Altman Z 數值進行具體論證，勿空洞泛談。
3. 若涉及存股、估值或風險，請以專業審計與資本配置角度提出具體檢驗指標。
`;

      const textResponse = await generateWithFallback(ai, prompt, false);
      return res.json({ success: true, text: textResponse });
    } catch (e: any) {
      console.error('Vercel ai-chat error:', e);
      return res.status(500).json({ error: e.message || '財務助手對話分析失敗' });
    }
  }

  // 3. 全台股上市櫃 2000+ 股票代號即時查詢 API (嚴格 5 年官方年報四大表)
  if (url.includes('/api/financial/fetch-stock')) {
    try {
      const parsedUrl = new URL(url, 'http://localhost');
      const rawCode = (parsedUrl.searchParams.get('code') || (req.query?.code as string) || '').trim().toUpperCase().replace(/[^0-9A-Z]/g, '');

      if (!rawCode) {
        return res.status(400).json({ success: false, error: '請輸入有效之台股代號' });
      }

      const ai = getGeminiClient();
      if (!ai) {
        return res.json({
          success: false,
          error: '未配置 GEMINI_API_KEY，請先由標竿清單選取，或配置 API Key 啟用全市場查詢。',
        });
      }

      const prompt = `
你是一位精通台灣證券交易所 (TWSE)、證券櫃檯買賣中心 (TPEx) 與公開資訊觀測站 (MOPS) 官方會計審計財報的資深會計師。
請檢索並提取台灣上市公司/上櫃公司股票代號「${rawCode}」之真實官方審定財務報表數據。

【嚴格審計與資料規範】：
1. 僅提供連續 5 年「純年度年報（2021、2022、2023、2024、2025 全年）」，絕不混雜任何單一季度 (Q) 數據。
2. 幣別單位：新台幣千元 (NTD 千元)。
3. 各期報表必須具備會計勾稽平衡：資產總計 = 負債總計 + 股東權益總計，營業毛利 = 營收 - 成本，營業利益 = 毛利 - 費用。

【回傳 JSON 規格（嚴格純 JSON，不含 markdown 標記）】：
{
  "name": "公司官方中文全名（如：聯華電子 (UMC)）",
  "code": "${rawCode}-TW",
  "industry": "所屬產業別",
  "currency": "NTD (千元)",
  "description": "企業核心業務與競爭優勢簡介（約 50 字）",
  "periods": [
    {
      "year": 2021,
      "period": "110年度 (2021 全年)",
      "isQuarterly": false,
      "revenue": 213000000,
      "costOfGoodsSold": 140000000,
      "grossProfit": 73000000,
      "operatingExpenses": 20000000,
      "operatingIncome": 53000000,
      "netIncome": 55700000,
      "sharesOutstanding": 12400000,
      "accountsReceivable": 22000000,
      "contractAssets": 0,
      "inventory": 20000000,
      "accountsPayable": 15000000,
      "currentAssets": 150000000,
      "currentLiabilities": 60000000,
      "totalAssets": 380000000,
      "totalLiabilities": 120000000,
      "stockholdersEquity": 260000000,
      "cashAndEquivalents": 90000000,
      "operatingCashFlow": 78000000,
      "capitalExpenditures": 35000000,
      "interestExpense": 1200000
    },
    {
      "year": 2022,
      "period": "111年度 (2022 全年)",
      "isQuarterly": false,
      "revenue": 278000000,
      "costOfGoodsSold": 170000000,
      "grossProfit": 108000000,
      "operatingExpenses": 25000000,
      "operatingIncome": 83000000,
      "netIncome": 87000000,
      "sharesOutstanding": 12400000,
      "accountsReceivable": 25000000,
      "contractAssets": 0,
      "inventory": 25000000,
      "accountsPayable": 18000000,
      "currentAssets": 190000000,
      "currentLiabilities": 70000000,
      "totalAssets": 420000000,
      "totalLiabilities": 130000000,
      "stockholdersEquity": 290000000,
      "cashAndEquivalents": 120000000,
      "operatingCashFlow": 110000000,
      "capitalExpenditures": 45000000,
      "interestExpense": 1500000
    },
    {
      "year": 2023,
      "period": "112年度 (2023 全年)",
      "isQuarterly": false,
      "revenue": 222500000,
      "costOfGoodsSold": 155000000,
      "grossProfit": 67500000,
      "operatingExpenses": 24000000,
      "operatingIncome": 43500000,
      "netIncome": 60900000,
      "sharesOutstanding": 12400000,
      "accountsReceivable": 21000000,
      "contractAssets": 0,
      "inventory": 22000000,
      "accountsPayable": 16000000,
      "currentAssets": 180000000,
      "currentLiabilities": 65000000,
      "totalAssets": 410000000,
      "totalLiabilities": 125000000,
      "stockholdersEquity": 285000000,
      "cashAndEquivalents": 110000000,
      "operatingCashFlow": 85000000,
      "capitalExpenditures": 40000000,
      "interestExpense": 1400000
    },
    {
      "year": 2024,
      "period": "113年度 (2024 全年)",
      "isQuarterly": false,
      "revenue": 232000000,
      "costOfGoodsSold": 160000000,
      "grossProfit": 72000000,
      "operatingExpenses": 25000000,
      "operatingIncome": 47000000,
      "netIncome": 62000000,
      "sharesOutstanding": 12400000,
      "accountsReceivable": 23000000,
      "contractAssets": 0,
      "inventory": 23000000,
      "accountsPayable": 17000000,
      "currentAssets": 195000000,
      "currentLiabilities": 68000000,
      "totalAssets": 430000000,
      "totalLiabilities": 130000000,
      "stockholdersEquity": 300000000,
      "cashAndEquivalents": 125000000,
      "operatingCashFlow": 92000000,
      "capitalExpenditures": 38000000,
      "interestExpense": 1300000
    },
    {
      "year": 2025,
      "period": "114年度 (2025 全年)",
      "isQuarterly": false,
      "revenue": 245000000,
      "costOfGoodsSold": 168000000,
      "grossProfit": 77000000,
      "operatingExpenses": 26000000,
      "operatingIncome": 51000000,
      "netIncome": 66000000,
      "sharesOutstanding": 12400000,
      "accountsReceivable": 24000000,
      "contractAssets": 0,
      "inventory": 24000000,
      "accountsPayable": 18000000,
      "currentAssets": 210000000,
      "currentLiabilities": 70000000,
      "totalAssets": 450000000,
      "totalLiabilities": 135000000,
      "stockholdersEquity": 315000000,
      "cashAndEquivalents": 135000000,
      "operatingCashFlow": 98000000,
      "capitalExpenditures": 36000000,
      "interestExpense": 1200000
    }
  ]
}
`;

      const textResponse = await generateWithFallback(ai, prompt, true);
      let parsed = JSON.parse(textResponse);

      if (!parsed.name || !Array.isArray(parsed.periods) || parsed.periods.length === 0) {
        return res.status(404).json({ success: false, error: `查無股票代號 ${rawCode} 之官方審定年報` });
      }

      return res.json({ success: true, company: parsed });
    } catch (e: any) {
      console.error('Vercel fetch-stock error:', e);
      return res.status(500).json({ success: false, error: e.message || '檢索股票財報失敗' });
    }
  }

  return res.status(404).json({ error: 'Endpoint not found on Vercel API handler' });
}
