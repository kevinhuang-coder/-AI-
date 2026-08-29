import { GoogleGenAI } from '@google/genai';

/**
 * 取得前端或環境中的 Gemini Key
 */
export function getClientGeminiKey(): string | null {
  // 1. 優先檢查 LocalStorage (使用者自備 Key 或後台除錯 Key)
  const storedKey = typeof window !== 'undefined' ? localStorage.getItem('user_gemini_api_key') : null;
  if (storedKey && storedKey.trim()) return storedKey.trim();

  // 2. 檢查 Vite 前端環境變數
  const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY_FS;
  if (envKey && envKey.trim()) return envKey.trim();

  return null;
}

/**
 * 建立前端直連 Gemini 客戶端
 */
export function getBrowserGeminiClient(): GoogleGenAI | null {
  const key = getClientGeminiKey();
  if (!key) return null;
  return new GoogleGenAI({
    apiKey: key,
  });
}

/**
 * 前端直連發問 Financial Copilot
 */
export async function directAskGeminiCopilot(
  question: string,
  companyName: string,
  contextData: any
): Promise<string | null> {
  const ai = getBrowserGeminiClient();
  if (!ai) return null;

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

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text?.trim() || null;
  } catch (e) {
    console.warn('Browser direct Gemini API call failed:', e);
    return null;
  }
}
