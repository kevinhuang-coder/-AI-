import { parseXbrlXmlString } from '../src/utils/xbrlParser';

const sampleXml = `<?xml version="1.0" encoding="UTF-8"?> 
<html xmlns="http://www.w3.org/1999/xhtml"
xmlns:ifrs-full="http://xbrl.ifrs.org/taxonomy/2017-03-09/ifrs-full"
xmlns:tifrs-ar="http://www.xbrl.org/tifrs/ar/2020-06-30"
xmlns:tifrs-notes="http://www.xbrl.org/tifrs/notes/2020-06-30"
xmlns:ix="http://www.xbrl.org/2013/inlineXBRL">
<head><title>5347 2025Q4 Financial report</title></head>
<body>
  <ix:hidden>
    <ix:nonNumeric name="tifrs-notes:CompanyID" contextRef="From20250101To20251231">5347</ix:nonNumeric>
    <ix:nonNumeric name="tifrs-notes:CompanyChineseName" contextRef="From20250101To20251231">世界先進積體電路股份有限公司</ix:nonNumeric>
  </ix:hidden>
  <ix:resources>
    <xbrli:context id="From20250101To20251231">
      <xbrli:period><xbrli:startDate>2025-01-01</xbrli:startDate><xbrli:endDate>2025-12-31</xbrli:endDate></xbrli:period>
    </xbrli:context>
    <xbrli:context id="AsOf20251231">
      <xbrli:period><xbrli:instant>2025-12-31</xbrli:instant></xbrli:period>
    </xbrli:context>
  </ix:resources>
  <ix:nonFraction name="ifrs-full:Revenue" contextRef="From20250101To20251231" scale="3" decimals="-3">48,591,245</ix:nonFraction>
  <ix:nonFraction name="ifrs-full:CostOfSales" contextRef="From20250101To20251231" scale="3" decimals="-3">34,937,406</ix:nonFraction>
  <ix:nonFraction name="ifrs-full:GrossProfit" contextRef="From20250101To20251231" scale="3" decimals="-3">13,653,839</ix:nonFraction>
  <ix:nonFraction name="ifrs-full:ProfitLossFromOperatingActivities" contextRef="From20250101To20251231" scale="3" decimals="-3">7,773,371</ix:nonFraction>
  <ix:nonFraction name="ifrs-full:ProfitLoss" contextRef="From20250101To20251231" scale="3" decimals="-3">7,770,450</ix:nonFraction>
  <ix:nonFraction name="ifrs-full:Assets" contextRef="AsOf20251231" scale="3" decimals="-3">200,468,778</ix:nonFraction>
  <ix:nonFraction name="ifrs-full:Liabilities" contextRef="AsOf20251231" scale="3" decimals="-3">116,879,251</ix:nonFraction>
  <ix:nonFraction name="ifrs-full:Equity" contextRef="AsOf20251231" scale="3" decimals="-3">83,589,527</ix:nonFraction>
  <ix:nonNumeric name="tifrs-ar:AccountantName" contextRef="AsOf20260202">勤業眾信聯合會計師事務所</ix:nonNumeric>
  <ix:nonNumeric name="tifrs-ar:AssuranceAccountantName1" contextRef="AsOf20260202">鄭淂蓁</ix:nonNumeric>
  <ix:nonNumeric name="tifrs-ar:AssuranceAccountantName2" contextRef="AsOf20260202">溫智源</ix:nonNumeric>
  <ix:nonNumeric name="tifrs-ar:ReviewAuditDate" contextRef="AsOf20260202">2026-02-02</ix:nonNumeric>
</body>
</html>`;

async function runTest() {
  console.log('🧪 正在測試 xbrlParser 官方 iXBRL 解析與會計師簽證溯源元數據提取...\n');
  const res = parseXbrlXmlString(sampleXml, '5347');
  console.log('解析結果 success:', res.success);
  if (res.company) {
    console.log(`🏢 公司代號: ${res.company.code}`);
    console.log(`🏢 公司名稱: ${res.company.name}`);
    console.log(`🏛️ 簽證會計師事務所: ${res.company.auditFirm}`);
    console.log(`✍️ 查核簽證會計師: ${res.company.auditors}`);
    console.log(`⚖️ 查核意見類型: ${res.company.auditOpinion}`);
    console.log(`📅 查核簽證日期: ${res.company.auditDate}`);
    const p = res.company.periods[0];
    console.log(`📊 2025 營業收入: NT$ ${p.revenue.toLocaleString()} 千元`);
    console.log(`📊 2025 營業毛利: NT$ ${p.grossProfit.toLocaleString()} 千元`);
    console.log(`📊 2025 營業利益: NT$ ${p.operatingIncome.toLocaleString()} 千元`);
    console.log(`📊 2025 資產總計: NT$ ${p.totalAssets.toLocaleString()} 千元`);
    console.log(`📊 2025 負債總計: NT$ ${p.totalLiabilities.toLocaleString()} 千元`);
    console.log(`📊 2025 權益總額: NT$ ${p.stockholdersEquity.toLocaleString()} 千元`);
    console.log(`⚖️ 會計勾稽狀態: ${res.reconciliationAudit.isBalanceSheetBalanced ? '100% 絕對平衡' : '不平衡'}`);
  }
}

runTest();
