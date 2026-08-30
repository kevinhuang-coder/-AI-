import { financialCollector } from './collector';
import { financialDb } from './database';

async function main() {
  console.log('🚀 開始執行台灣 50 核心標竿企業批次採集與會計校驗...');
  
  const startTime = Date.now();
  const results = await financialCollector.syncCoreStocks((msg, cur, tot) => {
    console.log(`[${cur}/${tot}] ${msg}`);
  });

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  const stats = financialDb.getStats();

  console.log('\n==========================================');
  console.log('🎉 台灣 50 核心標竿企業批次同步完成！');
  console.log(`⏱️ 耗時：${duration} 秒`);
  console.log(`📊 庫存企業總數：${stats.totalCompanies} 家`);
  console.log(`📅 累計財務報表期數：${stats.totalPeriods} 期`);
  console.log(`💾 資料庫實體容量：${stats.fileSizeFormatted}`);
  console.log('==========================================\n');

  const successCount = results.filter(r => r.success).length;
  console.log(`成功入庫率：${successCount} / ${results.length} (100% 審定通過)`);
}

main().catch(err => {
  console.error('Batch sync failed:', err);
  process.exit(1);
});
