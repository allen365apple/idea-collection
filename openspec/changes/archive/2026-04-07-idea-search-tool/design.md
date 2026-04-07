## Context

公司的 Idea 蒐集資料庫存放在 Google Sheets（Sheet ID: `1eYHwf1ECW67B6iZi92uUHB-xDEKNERnPMGayKB7Mnjs`），共 10 個欄位（A-J）。目前沒有專門的搜尋介面，同仁只能直接在 Sheets 上使用 Ctrl+F 搜尋，體驗不佳。

本專案要建立一個部署在 GitHub Pages 的靜態網頁，透過 Google Apps Script Web App 取得資料，在瀏覽器端完成所有搜尋操作。

## Goals / Non-Goals

**Goals:**

- 頁面載入時一次取得全部 Idea 資料，搜尋操作零延遲
- 提供直覺的關鍵字搜尋，支援多關鍵字 AND 邏輯
- MUJI 風格極簡設計，支援手機與桌面瀏覽
- 零成本部署（GitHub Pages + Google Apps Script）

**Non-Goals:**

- 不做使用者登入與權限管理
- 不做資料新增/編輯功能
- 不做離線快取或 Service Worker
- 不做分頁載入，一次載入全部資料即可

## Decisions

### Google Apps Script 作為資料 API

使用 Google Apps Script 部署為 Web App，提供一個 GET endpoint 回傳全部 Idea 資料的 JSON。

**為什麼選 GAS 而非其他方案：**
- GAS 可直接讀取 Google Sheets，不需要額外的 API key 或 OAuth 設定
- 部署為 Web App 後，任何人都能存取（設定為「Anyone」）
- 免費且無需維護伺服器

**替代方案：**
- Google Sheets API v4：需要 API key，有配額限制，CORS 設定複雜
- 定時同步成 JSON 檔案：需要 GitHub Actions + token，增加維護成本

### 前端載入後本地搜尋

頁面開啟時呼叫 GAS Web App API，將全部資料載入記憶體，之後所有搜尋都在 JavaScript 中完成。

**為什麼不是每次搜尋都打 API：**
- GAS 冷啟動需 1-3 秒，每次搜尋都等待會嚴重影響體驗
- Idea 資料量預估在數百到數千筆，JSON 大小約幾百 KB，一次載入無負擔
- 瀏覽器端 filter 幾千筆資料是微秒等級

### 純 HTML/CSS/JS 不使用框架

單一 `index.html` 檔案包含所有前端程式碼（HTML + CSS + JS）。

**為什麼不用框架：**
- 功能單純（一個搜尋框 + 結果列表），不需要元件化或狀態管理
- 部署到 GitHub Pages 最簡單，不需要建置步驟
- 減少依賴，長期維護成本最低

### GAS API 回傳格式

GAS API 回傳 JSON 陣列，每筆資料包含所有 10 個欄位。欄位使用語意化 key name：

```json
[
  {
    "date": "2024-01-15",
    "originalDate": "...",
    "content": "...",
    "url": "...",
    "author": "...",
    "collector": "...",
    "note": "...",
    "summary": "...",
    "tags": "...",
    "source": "..."
  }
]
```

第一列為標題列，從第二列開始讀取資料。

## Risks / Trade-offs

- **[GAS 冷啟動延遲]** → 首次載入可能需 1-3 秒。以 loading 動畫緩解，使用者只需等待一次。
- **[GAS 執行時間限制]** → Google Apps Script 單次執行上限 6 分鐘。以目前資料量不會觸發，但若資料成長至數萬筆需重新評估。
- **[資料非即時]** → 頁面載入後不會自動更新。使用者需重新整理頁面取得最新資料。以目前使用情境可接受。
- **[無存取控制]** → 任何知道網址的人都能搜尋。初版可接受，未來可加回 Google 登入。
- **[CORS 限制]** → GAS Web App 使用 JSONP 或已內建 CORS 支援（`doGet` + `ContentService` 回傳 JSON 時，Google 會處理 CORS header）。需在部署時確認 Access 設定為「Anyone」。
