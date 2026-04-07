## Why

公司同仁需要一個快速搜尋「Idea 蒐集資料庫」的工具。目前資料存放在 Google Sheets 中，直接在 Sheets 上搜尋不夠直覺，也無法提供良好的瀏覽體驗。需要一個專用的網頁介面，讓使用者輸入關鍵字就能即時找到相關的創意案例。

## What Changes

- 新增一個靜態網頁應用（`index.html`），提供關鍵字搜尋介面與卡片式結果展示
- 新增 Google Apps Script（`apps-script-search.js`），作為資料 API，從 Google Sheets 讀取全部 Idea 資料並回傳 JSON
- 頁面載入時一次抓取全部資料，之後所有搜尋都在瀏覽器端完成，確保即時回應
- 搜尋範圍：Idea 摘要（H 欄）與標籤（I 欄），支援多關鍵字 AND 邏輯
- 搜尋結果依蒐集日期倒序排列，以卡片形式呈現摘要、標籤、撰寫者、日期、參考網址
- 部署至 GitHub Pages（`https://allen365apple.github.io/idea-collection/`）
- 採用 MUJI 風格極簡設計，響應式支援手機瀏覽（最小 375px）

## Non-Goals

- **不做 Google 帳號登入與權限管理**：初版不設門檻，任何知道網址的人都能使用
- **不做即時同步**：資料在頁面載入時抓取，使用期間不自動更新；重新整理頁面即可取得最新資料
- **不使用前端框架**：純 HTML/CSS/JS 即可滿足需求，不引入 React/Vue 等框架

## Capabilities

### New Capabilities

- `data-fetch`: 透過 Google Apps Script API 一次載入 Google Sheets 全部 Idea 資料，快取於瀏覽器記憶體中
- `idea-search`: 在瀏覽器端對已載入的資料執行關鍵字搜尋（比對 Idea 摘要與標籤，多關鍵字 AND 邏輯，結果依日期倒序）
- `search-ui`: 搜尋介面與卡片式結果展示，MUJI 風格極簡設計，響應式佈局

### Modified Capabilities

（無）

## Impact

- 新增檔案：`index.html`（前端網頁）、`apps-script-search.js`（Google Apps Script API）
- 外部依賴：Google Sheets（Sheet ID: `1eYHwf1ECW67B6iZi92uUHB-xDEKNERnPMGayKB7Mnjs`）、Google Apps Script 部署為 Web App
- 部署平台：GitHub Pages（repo: `allen365apple/idea-collection`）
- 字體依賴：Geist（Google Fonts）
