import { fetchTaiwanStockFinancials } from '../src/utils/stockFetcher';

async function verify5347() {
  console.log('🧪 正在執行世界先進 (5347) 官方真實審定數據斷言測試...\n');

  const vis = await fetchTaiwanStockFinancials('5347');
  if (!vis) {
    console.error('❌ 未能檢索到 5347 數據！');
    process.exit(1);
  }

  const p2025 = vis.periods.find((p) => p.year === 2025);
  const p2024 = vis.periods.find((p) => p.year === 2024);

  if (!p2025 || !p2024) {
    console.error('❌ 缺少 2024 或 2025 年度數據！');
    process.exit(1);
  }

  console.log('==========================================');
  console.log(`🏢 企業名稱: ${vis.name} (${vis.code})`);
  console.log('📊 2025 (114年) 損益表官方對齊核對:');
  console.log(`   營業收入: NT$ ${p2025.revenue.toLocaleString()} 千元 (預期: 48,591,245)`);
  console.log(`   營業成本: NT$ ${p2025.costOfGoodsSold.toLocaleString()} 千元 (預期: 34,937,406)`);
  console.log(`   營業毛利: NT$ ${p2025.grossProfit.toLocaleString()} 千元 (預期: 13,653,839)`);
  console.log(`   營業利益: NT$ ${p2025.operatingIncome.toLocaleString()} 千元 (預期: 7,773,371)`);
  console.log(`   毛利率: ${((p2025.grossProfit / p2025.revenue) * 100).toFixed(2)}%`);
  console.log(`   營益率: ${((p2025.operatingIncome / p2025.revenue) * 100).toFixed(2)}%`);

  console.log('\n📊 2024 (113年) 損益表官方對齊核對:');
  console.log(`   營業收入: NT$ ${p2024.revenue.toLocaleString()} 千元 (預期: 44,054,762)`);
  console.log(`   營業成本: NT$ ${p2024.costOfGoodsSold.toLocaleString()} 千元 (預期: 32,121,848)`);
  console.log(`   營業毛利: NT$ ${p2024.grossProfit.toLocaleString()} 千元 (預期: 11,932,914)`);
  console.log(`   營業利益: NT$ ${p2024.operatingIncome.toLocaleString()} 千元 (預期: 7,111,387)`);
  console.log('==========================================\n');

  const assertions = [
    p2025.revenue === 48591245,
    p2025.costOfGoodsSold === 34937406,
    p2025.grossProfit === 13653839,
    p2025.operatingIncome === 7773371,
    p2024.revenue === 44054762,
    p2024.costOfGoodsSold === 32121848,
    p2024.grossProfit === 11932914,
    p2024.operatingIncome === 7111387,
  ];

  if (assertions.every(Boolean)) {
    console.log('🌟 5347 世界先進所有官方數值與公開資訊觀測站 (MOPS) 1:1 完全一致，斷言 100% 通過！');
  } else {
    console.error('❌ 斷言失敗，數值與官方不一致！');
    process.exit(1);
  }
}

verify5347();
