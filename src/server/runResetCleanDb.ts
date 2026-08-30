import { financialDb } from './database';

function main() {
  console.log('🧹 正在執行資料庫全面深度清理與審定標竿重置...');
  financialDb.resetToCleanVerifiedBase();
  const stats = financialDb.getStats();
  console.log('\n==========================================');
  console.log('✨ 財務資料庫已成功重置為 100% 官方純淨審定狀態！');
  console.log(`📊 收錄純淨標竿企業：${stats.totalCompanies} 家`);
  console.log(`📅 累計財務報表期數：${stats.totalPeriods} 期`);
  console.log(`💾 資料庫實體容量：${stats.fileSizeFormatted}`);
  console.log('==========================================\n');
}

main();
