const SHEET_ID = "1jQiLQM7BWa_4Cm7boyg0YJpr1iVKL1r68XEtNYGwHJY";

const SITES = [
  { name: "Homepage", url: "https://clickclack.infinityfree.me/" },
  { name: "Product Detail", url: "https://clickclack.infinityfree.me/product/k1" },
  { name: "Cart", url: "https://clickclack.infinityfree.me/cart" },
  { name: "Checkout", url: "https://clickclack.infinityfree.me/checkout" }
];

function setupMonitoring() {
  const ss = getSpreadsheet();
  SITES.forEach(site => getOrCreateSheet(ss, site.name));
  getOrCreateSheet(ss, "Daily Metrics");
  getOrCreateSheet(ss, "System Uptime");
  setupHeaders(ss);

  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger("checkWebsites").timeBased().everyMinutes(5).create();
  ScriptApp.newTrigger("updateAllMetrics").timeBased().everyDays(1).atHour(23).create();
}

function checkWebsites() {
  const ss = getSpreadsheet();
  const timestamp = new Date();

  SITES.forEach(site => {
    let sheet = getOrCreateSheet(ss, site.name);
    if (sheet.getLastRow() === 0) setupRawHeader(sheet);

    let status = "DOWN", httpCode = "", errorMsg = "";
    const start = new Date().getTime();

    try {
      const res = UrlFetchApp.fetch(site.url, {
        muteHttpExceptions: true,
        followRedirects: true,
        headers: { "User-Agent": "Mozilla/5.0" }
      });
      httpCode = res.getResponseCode();
      if (httpCode >= 200 && httpCode < 400) status = "UP";
    } catch (err) {
      errorMsg = err.toString();
    }

    sheet.appendRow([timestamp, status, httpCode, new Date().getTime() - start, errorMsg]);
  });
}

function updateDailyMetrics() {
  const ss = getSpreadsheet();
  const dailySheet = getOrCreateSheet(ss, "Daily Metrics");
  const timeZone = ss.getSpreadsheetTimeZone() || "GMT";
  const rows = [];

  SITES.forEach(site => {
    const rawSheet = ss.getSheetByName(site.name);
    if (!rawSheet || rawSheet.getLastRow() < 2) return;

    const data = rawSheet.getRange(2, 1, rawSheet.getLastRow() - 1, 5).getValues();
    const days = {};

    data.forEach(r => {
      if (!(r[0] instanceof Date)) return;
      const key = Utilities.formatDate(r[0], timeZone, "yyyy-MM-dd");
      if (!days[key]) days[key] = [];
      days[key].push({ status: r[1], responseTime: r[3] });
    });

    Object.keys(days).forEach(dateKey => {
      const list = days[dateKey];
      const up = list.filter(i => i.status === "UP");
      const times = up.map(i => i.responseTime).filter(v => typeof v === "number" && v > 0).sort((a, b) => a - b);
      const avg = times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;
      const p95 = calcPercentile(times, 95);
      const min = times.length > 0 ? times[0] : 0;
      const max = times.length > 0 ? times[times.length - 1] : 0;

      rows.push([dateKey, site.name, avg, p95, min, max, list.length, up.length, list.length - up.length]);
    });
  });

  rows.sort((a, b) => (b[0] > a[0] ? 1 : b[0] < a[0] ? -1 : a[1].localeCompare(b[1])));
  if (dailySheet.getLastRow() > 1) dailySheet.getRange(2, 1, dailySheet.getLastRow() - 1, 9).clearContent();
  if (rows.length > 0) dailySheet.getRange(2, 1, rows.length, 9).setValues(rows);
}

function updateSystemUptime() {
  const ss = getSpreadsheet();
  const uptimeSheet = getOrCreateSheet(ss, "System Uptime");
  const timeZone = ss.getSpreadsheetTimeZone() || "GMT";
  const intervalMap = {};
  const siteDayStats = {};

  SITES.forEach(site => {
    const rawSheet = ss.getSheetByName(site.name);
    if (!rawSheet || rawSheet.getLastRow() < 2) return;

    const data = rawSheet.getRange(2, 1, rawSheet.getLastRow() - 1, 5).getValues();
    data.forEach(r => {
      if (!(r[0] instanceof Date)) return;
      const dKey = Utilities.formatDate(r[0], timeZone, "yyyy-MM-dd");
      const iKey = Utilities.formatDate(r[0], timeZone, "yyyy-MM-dd HH:mm");
      const isUp = r[1] === "UP";

      if (!intervalMap[dKey]) intervalMap[dKey] = {};
      if (!intervalMap[dKey][iKey]) intervalMap[dKey][iKey] = {};
      intervalMap[dKey][iKey][site.name] = isUp;

      if (!siteDayStats[dKey]) siteDayStats[dKey] = {};
      if (!siteDayStats[dKey][site.name]) siteDayStats[dKey][site.name] = { up: 0, total: 0 };
      siteDayStats[dKey][site.name].total++;
      if (isUp) siteDayStats[dKey][site.name].up++;
    });
  });

  const dates = Object.keys(intervalMap).sort().reverse();
  const rows = [];
  let totAll = 0, upAll = 0, outAll = 0, maxOutAll = 0;

  dates.forEach(dKey => {
    const obj = intervalMap[dKey];
    const sorted = Object.keys(obj).sort();
    let upCount = 0, outCount = 0, curOut = 0, maxOut = 0;

    sorted.forEach(k => {
      if (SITES.every(s => obj[k][s.name] === true)) {
        upCount++;
        if (curOut > 0) {
          outCount++;
          maxOut = Math.max(maxOut, curOut);
          curOut = 0;
        }
      } else {
        curOut += 5;
      }
    });

    if (curOut > 0) {
      outCount++;
      maxOut = Math.max(maxOut, curOut);
    }

    const total = sorted.length;
    const downCount = total - upCount;
    const pct = total > 0 ? (upCount / total) * 100 : 0;
    const status = pct === 100 ? "OPERATIONAL" : pct >= 95 ? "DEGRADED" : "OUTAGE";

    const pcts = SITES.map(s => {
      const st = siteDayStats[dKey]?.[s.name] || { up: 0, total: 0 };
      return st.total > 0 ? ((st.up / st.total) * 100).toFixed(2) + "%" : "N/A";
    });

    totAll += total;
    upAll += upCount;
    outAll += outCount;
    maxOutAll = Math.max(maxOutAll, maxOut);

    rows.push([dKey, pct.toFixed(2) + "%", downCount * 5, status, outCount, maxOut, pcts[0], pcts[1], pcts[2], pcts[3], total]);
  });

  if (totAll > 0) {
    const overallPct = ((upAll / totAll) * 100).toFixed(2) + "%";
    const overallDown = (totAll - upAll) * 5;
    const pctsAll = SITES.map(s => {
      let up = 0, tot = 0;
      dates.forEach(d => {
        const st = siteDayStats[d]?.[s.name] || { up: 0, total: 0 };
        up += st.up;
        tot += st.total;
      });
      return tot > 0 ? ((up / tot) * 100).toFixed(2) + "%" : "N/A";
    });

    rows.unshift(["ALL TIME (OVERALL)", overallPct, overallDown, overallPct === "100.00%" ? "OPERATIONAL" : "DEGRADED", outAll, maxOutAll, pctsAll[0], pctsAll[1], pctsAll[2], pctsAll[3], totAll]);
  }

  if (uptimeSheet.getLastRow() > 1) uptimeSheet.getRange(2, 1, uptimeSheet.getLastRow() - 1, 11).clearContent();
  if (rows.length > 0) {
    uptimeSheet.getRange(2, 1, rows.length, 11).setValues(rows);
    uptimeSheet.getRange("A2:K2").setFontWeight("bold");
  }
}

function updateAllMetrics() {
  updateDailyMetrics();
  updateSystemUptime();
}

function getSpreadsheet() {
  if (SHEET_ID && SHEET_ID !== "YOUR_SHEET_ID_HERE") {
    try {
      return SpreadsheetApp.openById(SHEET_ID);
    } catch (e) {}
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

function getOrCreateSheet(ss, name) {
  return ss.getSheetByName(name) || ss.insertSheet(name);
}

function setupRawHeader(sheet) {
  sheet.appendRow(["Timestamp", "Status", "HTTP Code", "Response Time (ms)", "Error"]);
  sheet.getRange("A1:E1").setFontWeight("bold");
  sheet.setFrozenRows(1);
}

function setupHeaders(ss) {
  SITES.forEach(s => {
    const sheet = ss.getSheetByName(s.name);
    if (sheet.getLastRow() === 0) setupRawHeader(sheet);
  });

  const daily = ss.getSheetByName("Daily Metrics");
  if (daily.getLastRow() === 0) {
    daily.appendRow(["Date", "Page", "Avg Load Time (ms)", "95th Percentile (ms)", "Min Load Time (ms)", "Max Load Time (ms)", "Total Checks", "UP", "DOWN"]);
    daily.getRange("A1:I1").setFontWeight("bold");
    daily.setFrozenRows(1);
  }

  const uptime = ss.getSheetByName("System Uptime");
  if (uptime.getLastRow() === 0) {
    uptime.appendRow(["Date", "System Uptime %", "System Downtime (min)", "Status", "Outages", "Longest Outage (min)", "Homepage %", "Product Detail %", "Cart %", "Checkout %", "Total Checks"]);
    uptime.getRange("A1:K1").setFontWeight("bold");
    uptime.setFrozenRows(1);
  }
}

function calcPercentile(arr, p) {
  if (!arr || arr.length === 0) return 0;
  return arr[Math.max(0, Math.min(Math.ceil(arr.length * (p / 100)) - 1, arr.length - 1))];
}
