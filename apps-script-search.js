// ====================================================
// 網頁搜尋 API — doGet
// 用途：回傳全部 Idea 資料給前端網頁（靈感搜尋狂魔）
// 使用方式：貼到現有 Apps Script 程式碼的最下方即可
// 注意：部署後需「更新」部署版本，新的 doGet 才會生效
// ====================================================

var WEB_API_COLUMN_KEYS = [
  'date',         // A: 蒐集日期
  'originalDate', // B: 原文日期
  'content',      // C: 原始內容
  'url',          // D: 參考網址
  'author',       // E: 撰寫者
  'collector',    // F: 蒐集者
  'note',         // G: 蒐集者備註
  'summary',      // H: Idea 摘要
  'tags',         // I: 標籤
  'source'        // J: Slack 來源
];

function doGet() {
  var ss = SpreadsheetApp.openById('1eYHwf1ECW67B6iZi92uUHB-xDEKNERnPMGayKB7Mnjs');
  var sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) sheet = ss.getSheets()[0];
  var lastRow = sheet.getLastRow();

  if (lastRow <= 1) {
    return ContentService
      .createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var dataRange = sheet.getRange(2, 1, lastRow - 1, WEB_API_COLUMN_KEYS.length);
  var values = dataRange.getValues();
  var result = [];

  for (var i = 0; i < values.length; i++) {
    var row = values[i];

    // 排除空白列（A 欄和 H 欄都沒資料才跳過）
    if (!row[0] && !row[7]) {
      continue;
    }

    var obj = {};
    for (var j = 0; j < WEB_API_COLUMN_KEYS.length; j++) {
      var val = row[j];
      if (j === 0 && val instanceof Date) {
        val = Utilities.formatDate(val, Session.getScriptTimeZone(), 'yyyy-MM-dd');
      }
      obj[WEB_API_COLUMN_KEYS[j]] = val !== undefined && val !== null ? String(val) : '';
    }
    result.push(obj);
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
