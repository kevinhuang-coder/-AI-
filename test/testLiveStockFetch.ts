import { fetchTaiwanStockFinancials } from '../src/utils/stockFetcher';

async function testStocks() {
  console.log('🧪 正在執行全市場股票即時檢索與會計勾稽自動化測試...\n');

  const testCodes = ['2027', '6274', '3008', '9958', '2330'];

  for (const code of testCodes) {
    console.log(`🔍 正在檢索代號 [${code}]...`);
    const entity = await fetchTaiwanStockFinancials(code);

    if (!entity || !entity.periods || entity.periods.length === 0) {
      console.error(`❌ [${code}] 檢索失敗: 回傳為 null 或期數為 0`);
      process.exit(1);
    }

    const latestPeriod = entity.periods[entity.periods.length - 1];
    const bsDiff = Math.abs(latestPeriod.totalAssets - (latestPeriod.totalLiabilities + latestPeriod.stockholdersEquity));
    const isBsBalanced = bsDiff <= 5;

    console.log(`✅ [${code}] ${entity.name}`);
    console.log(`   產業分類: ${entity.industry}`);
    console.log(`   收錄期數: ${entity.periods.length} 期 (${entity.periods[0].year} ~ ${latestPeriod.year})`);
    console.log(`   最新年度營收: NT$ ${latestPeriod.revenue.toLocaleString()} 千元`);
    console.log(`   最新總資產: NT$ ${latestPeriod.totalAssets.toLocaleString()} 千元`);
    console.log(`   負債與權益合計: NT$ ${(latestPeriod.totalLiabilities + latestPeriod.stockholdersEquity).toLocaleString()} 千元`);
    console.log(`   ⚖️ 會計勾稽狀態: ${isBsBalanced ? '100% 平衡' : '❌ 不平衡'}\n`);

    if (!isBsBalanced) {
      console.error(`❌ [${code}] 資產負債表不平衡！`);
      process.exit(1);
    }
  }

  console.log('==========================================');
  console.log('🎉 所有全市場股票即時檢索與會計勾稽測試 100% 通過！');
  console.log('==========================================');
}

testStocks();
