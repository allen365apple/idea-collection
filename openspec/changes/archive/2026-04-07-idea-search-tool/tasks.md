## 1. Google Apps Script API

- [x] 1.1 建立 `apps-script-search.js`：實作 `doGet` endpoint，讀取 Sheet1 全部資料列，將 A-J 欄對應至語意化 key name（date, originalDate, content, url, author, collector, note, summary, tags, source），排除標題列與空白列，回傳 JSON 陣列（實作「GAS Web App returns all Idea data」requirement，採用「Google Apps Script 作為資料 API」decision）
- [x] 1.2 在 `apps-script-search.js` 中處理空試算表情境：當 Sheet1 只有標題列時回傳空 JSON 陣列 `[]`（涵蓋「Empty spreadsheet」scenario）

## 2. 前端頁面結構與設計

- [x] 2.1 建立 `index.html` 基本結構：設定 HTML meta viewport、載入 Geist 字體（Google Fonts）、設定頁面背景色 `#fafaf8`，實作 MUJI 風格極簡設計（實作「MUJI-style minimal design」requirement，採用「純 HTML/CSS/JS 不使用框架」decision）
- [x] 2.2 實作搜尋輸入介面：頁面頂部的搜尋輸入框與搜尋按鈕，包含 placeholder 提示文字，支援 Enter 鍵與按鈕觸發搜尋（實作「Search input interface」requirement）
- [x] 2.3 實作卡片式結果展示：搜尋結果以白底 `#ffffff` + 邊框 `#e8e8e5` 的卡片呈現，每張卡片顯示 summary、tags、author、date、可點擊的 URL 連結（新分頁開啟）（實作「Card-style result display」與「Result display fields」requirement）
- [x] 2.4 處理 URL 為空的情況：當 `url` 欄位為空時，卡片不顯示連結區塊（涵蓋「Missing reference URL」scenario）
- [x] 2.5 實作響應式佈局：支援 375px 手機到桌面寬度，窄螢幕垂直堆疊，寬螢幕設定最大寬度置中（實作「Responsive layout」requirement）

## 3. 資料載入

- [x] 3.1 實作頁面載入時呼叫 GAS Web App API 取得全部資料並存入記憶體，採用「前端載入後本地搜尋」decision，使用「GAS API 回傳格式」decision 定義的 JSON 結構（實作「Frontend loads all data on page open」requirement）
- [x] 3.2 實作 loading 狀態：資料載入中顯示 loading indicator，搜尋輸入框設為 disabled；載入完成後隱藏 indicator 並啟用輸入框（實作「Loading state」requirement）
- [x] 3.3 實作載入失敗處理：網路錯誤或逾時時顯示錯誤訊息與重試按鈕（涵蓋「Data load fails」scenario）

## 4. 搜尋邏輯

- [x] 4.1 實作關鍵字搜尋函式：比對 summary 與 tags 欄位，不區分大小寫，支援單一關鍵字與多關鍵字 AND 邏輯（空格分隔）（實作「Keyword search matches summary and tags」requirement）
- [x] 4.2 實作結果排序：搜尋結果依 date 欄位（yyyy-MM-dd）倒序排列，最新的在前面（實作「Results sorted by date descending」requirement）
- [x] 4.3 實作空結果與空輸入狀態：無符合結果時顯示提示訊息；搜尋框為空時顯示預設空白狀態（涵蓋「No matching results」與「Empty search input」scenario）
