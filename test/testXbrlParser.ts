import { parseXbrlXmlString } from '../src/utils/xbrlParser';

// 模擬台灣公開資訊觀測站 (MOPS) 信驊 (5274) 114年度官方 IFRS XBRL XML
const sampleMopsXbrlXml = `<?xml version="1.0" encoding="UTF-8"?>
<xbrli:xbrl xmlns:ifrs-full="http://xbrl.ifrs.org/taxonomy/2021-03-24/ifrs-full" xmlns:xbrli="http://www.xbrl.org/2003/instance">
  <xbrli:context id="AsOf20251231">
    <xbrli:entity>
      <xbrli:identifier scheme="http://www.twse.com.tw">5274</xbrli:identifier>
    </xbrli:entity>
    <xbrli:period>
      <xbrli:instant>2025-12-31</xbrli:instant>
    </xbrli:period>
  </xbrli:context>
  
  <xbrli:context id="Duration20250101To20251231">
    <xbrli:entity>
      <xbrli:identifier scheme="http://www.twse.com.tw">5274</xbrli:identifier>
    </xbrli:entity>
    <xbrli:period>
      <xbrli:startDate>2025-01-01</xbrli:startDate>
      <xbrli:endDate>2025-12-31</xbrli:endDate>
    </xbrli:period>
  </xbrli:context>

  <!-- 損益表 (Income Statement) -->
  <ifrs-full:OperatingRevenue contextRef="Duration20250101To20251231" unitRef="TWD" decimals="-3">6850200</ifrs-full:OperatingRevenue>
  <ifrs-full:CostOfSales contextRef="Duration20250101To20251231" unitRef="TWD" decimals="-3">2329068</ifrs-full:CostOfSales>
  <ifrs-full:GrossProfit contextRef="Duration20250101To20251231" unitRef="TWD" decimals="-3">4521132</ifrs-full:GrossProfit>
  <ifrs-full:OperatingExpenses contextRef="Duration20250101To20251231" unitRef="TWD" decimals="-3">1325400</ifrs-full:OperatingExpenses>
  <ifrs-full:ProfitLossFromOperatingActivities contextRef="Duration20250101To20251231" unitRef="TWD" decimals="-3">3195732</ifrs-full:ProfitLossFromOperatingActivities>
  <ifrs-full:ProfitLoss contextRef="Duration20250101To20251231" unitRef="TWD" decimals="-3">2850120</ifrs-full:ProfitLoss>

  <!-- 資產負債表 (Balance Sheet) -->
  <ifrs-full:CashAndCashEquivalents contextRef="AsOf20251231" unitRef="TWD" decimals="-3">5788290</ifrs-full:CashAndCashEquivalents>
  <ifrs-full:TradeAndOtherCurrentReceivables contextRef="AsOf20251231" unitRef="TWD" decimals="-3">1605970</ifrs-full:TradeAndOtherCurrentReceivables>
  <ifrs-full:Inventories contextRef="AsOf20251231" unitRef="TWD" decimals="-3">279678</ifrs-full:Inventories>
  <ifrs-full:CurrentAssets contextRef="AsOf20251231" unitRef="TWD" decimals="-3">8408204</ifrs-full:CurrentAssets>
  <ifrs-full:Assets contextRef="AsOf20251231" unitRef="TWD" decimals="-3">10333000</ifrs-full:Assets>
  <ifrs-full:CurrentLiabilities contextRef="AsOf20251231" unitRef="TWD" decimals="-3">1542100</ifrs-full:CurrentLiabilities>
  <ifrs-full:Liabilities contextRef="AsOf20251231" unitRef="TWD" decimals="-3">1924796</ifrs-full:Liabilities>
  <ifrs-full:Equity contextRef="AsOf20251231" unitRef="TWD" decimals="-3">8408204</ifrs-full:Equity>

  <!-- 現金流量表 (Cash Flow) -->
  <ifrs-full:CashFlowsFromUsedInOperatingActivities contextRef="Duration20250101To20251231" unitRef="TWD" decimals="-3">2950400</ifrs-full:CashFlowsFromUsedInOperatingActivities>
  <ifrs-full:PaymentsForPropertyPlantAndEquipment contextRef="Duration20250101To20251231" unitRef="TWD" decimals="-3">195000</ifrs-full:PaymentsForPropertyPlantAndEquipment>
</xbrli:xbrl>`;

function runTest() {
  console.log('🧪 正在執行 XBRL 解析器自動化測試...');
  const result = parseXbrlXmlString(sampleMopsXbrlXml, '5274');

  if (!result.success || !result.company) {
    console.error('❌ 解析失敗:', result.error);
    process.exit(1);
  }

  const comp = result.company;
  const p = comp.periods[0];

  console.log('\n==========================================');
  console.log('🎉 官方 XBRL 解析成功！');
  console.log(`🏢 企業名稱: ${comp.name} (${comp.code})`);
  console.log(`🏭 所屬產業: ${comp.industry}`);
  console.log(`📅 解析期別: ${p.period}`);
  console.log(`💰 營業收入: NT$ ${p.revenue.toLocaleString()} 千元`);
  console.log(`💵 現金及約當: NT$ ${p.cashAndEquivalents.toLocaleString()} 千元`);
  console.log(`📦 官方存貨: NT$ ${p.inventory.toLocaleString()} 千元`);
  console.log(`⚖️ 資產總計: NT$ ${p.totalAssets.toLocaleString()} 千元`);
  console.log(`⚖️ 負債+權益: NT$ ${(p.totalLiabilities + p.stockholdersEquity).toLocaleString()} 千元`);
  console.log(`✅ 資產負債表平衡狀態: ${result.reconciliationAudit.isBalanceSheetBalanced ? '100% 平衡' : '不平衡'}`);
  console.log('==========================================\n');

  if (
    p.cashAndEquivalents === 5788290 &&
    p.accountsReceivable === 1605970 &&
    p.inventory === 279678 &&
    p.revenue === 6850200
  ) {
    console.log('🌟 所有會計科目斷言測試 100% 通過！');
  } else {
    console.error('❌ 會計科目數值與官方不一致！');
    process.exit(1);
  }
}

runTest();
