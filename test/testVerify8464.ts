import { fetchTaiwanStockFinancials } from '../src/utils/stockFetcher';

async function verify8464() {
  console.log('🧪 正在執行億豐 (8464) 官方真實審定數據斷言測試...\n');

  const comp = await fetchTaiwanStockFinancials('8464');
  if (!comp) {
    console.error('❌ 未能檢索到 8464 數據！');
    process.exit(1);
  }

  const p2024 = comp.periods.find((p) => p.year === 2024);
  const p2023 = comp.periods.find((p) => p.year === 2023);
  const p2022 = comp.periods.find((p) => p.year === 2022);
  const p2021 = comp.periods.find((p) => p.year === 2021);

  if (!p2024 || !p2023 || !p2022 || !p2021) {
    console.error('❌ 缺少歷史年度數據！');
    process.exit(1);
  }

  console.log('==========================================');
  console.log(`🏢 企業名稱: ${comp.name} (${comp.code})`);
  console.log('📊 2024 (113年) 損益表官方對齊核對 (個位數精確無湊整):');
  console.log(`   營業收入: NT$ ${p2024.revenue.toLocaleString()} 千元 (預期: 29,141,832)`);
  console.log(`   營業成本: NT$ ${p2024.costOfGoodsSold.toLocaleString()} 千元 (預期: 13,248,519)`);
  console.log(`   營業毛利: NT$ ${p2024.grossProfit.toLocaleString()} 千元 (預期: 15,893,313)`);
  console.log(`   營業利益: NT$ ${p2024.operatingIncome.toLocaleString()} 千元 (預期: 6,396,419)`);
  console.log(`   稅後淨利: NT$ ${p2024.netIncome.toLocaleString()} 千元 (預期: 5,718,492)`);
  console.log(`   毛利率: ${((p2024.grossProfit / p2024.revenue) * 100).toFixed(2)}%`);
  console.log(`   營益率: ${((p2024.operatingIncome / p2024.revenue) * 100).toFixed(2)}%`);

  console.log('\n📊 2023 (112年) 損益表官方對齊核對:');
  console.log(`   營業收入: NT$ ${p2023.revenue.toLocaleString()} 千元 (預期: 27,249,568)`);
  console.log(`   營業毛利: NT$ ${p2023.grossProfit.toLocaleString()} 千元 (預期: 14,965,249)`);

  console.log('\n📊 2022 (111年) 損益表官方對齊核對:');
  console.log(`   營業收入: NT$ ${p2022.revenue.toLocaleString()} 千元 (預期: 28,951,048)`);
  console.log(`   營業毛利: NT$ ${p2022.grossProfit.toLocaleString()} 千元 (預期: 15,931,777)`);

  console.log('\n📊 2021 (110年) 損益表官方對齊核對:');
  console.log(`   營業收入: NT$ ${p2021.revenue.toLocaleString()} 千元 (預期: 29,024,819)`);
  console.log(`   營業毛利: NT$ ${p2021.grossProfit.toLocaleString()} 千元 (預期: 15,342,629)`);
  console.log('==========================================\n');

  const assertions = [
    p2024.revenue === 29141832,
    p2024.costOfGoodsSold === 13248519,
    p2024.grossProfit === 15893313,
    p2024.operatingIncome === 6396419,
    p2024.netIncome === 5718492,
    p2023.revenue === 27249568,
    p2023.grossProfit === 14965249,
    p2022.revenue === 28951048,
    p2022.grossProfit === 15931777,
    p2021.revenue === 29024819,
    p2021.grossProfit === 15342629,
  ];

  if (assertions.every(Boolean)) {
    console.log('🌟 8464 億豐所有官方數值與公開資訊觀測站 (MOPS) 1:1 完全一致，斷言 100% 通過！');
  } else {
    console.error('❌ 斷言失敗，數值與官方不一致！');
    process.exit(1);
  }
}

verify8464();
