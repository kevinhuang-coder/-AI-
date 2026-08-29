import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

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
      return res.json({ success: true, answer: textResponse });
    } catch (e: any) {
      console.error('Vercel ai-chat error:', e);
      return res.status(500).json({ error: e.message || 'AI 對話生成失敗' });
    }
  }

  return res.status(404).json({ error: 'Endpoint not found on Vercel API handler' });
}
