import fs from 'fs';

const content = fs.readFileSync('/Users/huangyulong/.gemini/antigravity/brain/e8e10b98-248a-420c-9c4b-791d742d93ce/.system_generated/steps/2938/content.md', 'utf-8');

// Pattern: Stock code followed by stock name
// In HTML: <div class="td-item1 h5">2330</div> ... <div class="td-item2 ...">台積電</div>
const trRegex = /<tr class="btn"[^>]*redirectUrl\('\/Stock\/Content\/TW\/([0-9A-Z]+)'\)[\s\S]*?<div class="td-item1[^>]*>([0-9A-Z]+)<\/div>[\s\S]*?<div class="td-item2[^>]*>([^<]+)<\/div>/g;

const extractedStocks: Array<{ code: string; name: string }> = [];
const seen = new Set<string>();

let m;
while ((m = trRegex.exec(content)) !== null) {
  const code = m[2].trim();
  const name = m[3].trim();
  if (/^[0-9]{4}$/.test(code) && !code.startsWith('00') && !seen.has(code)) {
    seen.add(code);
    extractedStocks.push({ code, name });
  }
}

console.log('Successfully extracted', extractedStocks.length, 'individual Taiwan stocks from SinoPac:');
console.log(JSON.stringify(extractedStocks, null, 2));
