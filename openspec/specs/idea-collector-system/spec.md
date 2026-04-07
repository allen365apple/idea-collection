# Idea Collector System — System Architecture Spec

## Purpose

This spec defines the overall architecture of the "Idea 靈感蒐集器" system — a Slack-integrated creative inspiration collection and search tool used by the advertising team at 只要有人社群顧問. It serves as the single source of truth for how data flows through the system and what each component does.

## System Overview

The system collects creative inspiration from Slack messages, stores them in Google Sheets, uses Gemini AI to generate summaries and tags, and provides multiple search interfaces.

### Components

| Component | File | Runtime | Role |
|-----------|------|---------|------|
| Collection, Analysis & Search Engine | `google-apps-script.js` | Google Apps Script | Handles Slack events, collects ideas, runs AI analysis, manages images, serves search API |
| Web Frontend | `index.html` | GitHub Pages | Search page, about page, random idea feature |
| Presentation | `presentation.html` | GitHub Pages | Fullscreen slideshow explaining the system |
| Data Store | Google Sheets | Google Cloud | Central database (Sheet1) with 11 columns A-K |
| Image Storage | Google Drive | Google Cloud | Folder "Idea-Collector-Images" for uploaded images |

## Data Schema (Google Sheets)

| Column | Field | Description |
|--------|-------|-------------|
| A | 蒐集日期 | Date when the idea was collected |
| B | 原文日期 | Original publish date of the Slack message |
| C | 原始內容 | Original text content from Slack |
| D | 參考網址 | URLs extracted from the message |
| E | 撰寫者 | Original author of the message |
| F | 蒐集者 | Person who triggered the collection |
| G | 蒐集者備註 | Optional note from the collector (from #idea-inbox thread) |
| H | Idea 摘要 | AI-generated one-line summary |
| I | 標籤 | AI-generated tags (comma-separated) |
| J | Slack 來源 | Permalink to the original Slack message |
| K | 圖片連結 | Google Drive thumbnail URLs (newline-separated) |

## Collection Flows

### Flow 1: 💡 Emoji Reaction

1. User sees an inspiring message in a supported Slack channel
2. User adds 💡 emoji reaction to the message
3. External trigger writes a row to Google Sheets with the Slack permalink (J column)
4. `processNewRows` (hourly trigger) picks up the new row:
   - Fetches original text from Slack → C column
   - Parses publish date from permalink → B column
   - Downloads images from Slack → saves to Drive → K column
   - Fetches collector notes from #idea-inbox thread → G column
   - Calls Gemini AI for summary and tags → H, I columns
5. System posts notification to #idea-inbox channel

### Flow 2: @mention Save (`存` / `+`)

1. User sends `@Idea Collection Bot 存 <content>` (or `+` instead of `存`)
2. `doPost` receives `app_mention` event
3. Trigger detection: regex `/(^|[\s])([存\+])([\s]|$)/` checks for standalone `存` or `+`
4. `saveIdeaFromMention` executes (MUST complete within 3 seconds):
   - Resolves user name via Slack API
   - Extracts URLs from text
   - Gets message permalink
   - Checks for duplicates (see Deduplication)
   - Writes row to Google Sheets (H, I, K columns left empty)
   - Replies "✅ 已收藏！" in thread
5. `processNewRows` later fills in AI summary, tags, and images

### Design Constraint: 3-Second Response

Slack retries events if no HTTP 200 response is received within 3 seconds. The `saveIdeaFromMention` function MUST NOT perform heavy operations (image download, Drive upload) synchronously. These are deferred to `backfillImages` and `processNewRows` scheduled triggers.

## Deduplication (Three-Layer Defense)

| Layer | Mechanism | Scope |
|-------|-----------|-------|
| 1 | `event_id` cache (CacheService, 600s TTL) | Prevents Slack retry duplicates |
| 2 | `isSlackLinkDuplicate()` — scans J column for existing permalink | Prevents same message collected twice |
| 3 | Fast response (< 3 seconds) | Prevents Slack from retrying at all |

The dedup check applies to BOTH collection flows:
- `saveIdeaFromMention`: checks permalink before writing
- JSON write endpoint (💡 flow): checks `slackLink` before `appendRow`

## AI Analysis (Gemini)

### Model Priority
1. `gemini-3-flash-preview` (smartest)
2. `gemini-2.5-flash` (stable fallback)
3. `gemini-3.1-flash-lite-preview` (highest quota)

### Prompt Structure (`buildAnalysisPrompt`)

The prompt instructs Gemini to:
1. Analyze images first (if present), identifying type (brand post, meme, screenshot, etc.)
2. Generate a one-line colloquial summary (no marketing jargon)
3. Generate comprehensive tags across dimensions:
   - 節日/時機 (holidays/timing)
   - 情緒/調性 (emotion/tone)
   - ⭐ **形式/載體** (form/medium) — HIGH PRIORITY: the physical or digital form of the idea (poster, sticker, signage, T-shirt, vending machine, filter, etc.)
   - 內容形式 (content format: Reels, memes, etc.)
   - 行銷手法 (marketing technique)
   - 產業/品牌 (industry/brand)
   - 平台 (platform)
   - 具體元素 (concrete elements)
   - 來源/獎項 (source/awards)
4. Expand each tag with synonyms (e.g., 告示 → 告示, 公告, 佈告, 告示牌, 標語)
5. Output as JSON: `{ "ideas": [{ "summary", "tags", "url" }] }`

### Daily Limit
Free Gemini API quota limits processing to ~20 ideas per day. Excess ideas are queued for next day.

## Search System

### Web Search (`index.html`)
- Loads all data from `google-apps-script.js` search API (`doGet`) on page load
- Client-side search: matches keywords against H (summary) and I (tags) columns
- Supports multi-keyword AND logic
- Card-based results sorted by date (newest first)
- "🎲 抽點子" random idea feature
- Click card to open modal with full details, images, Slack source link

### Slack Bot Search (`@Idea Collection Bot <keywords>`)
- Triggered when @mention text has no `存`/`+` keyword and is ≤ 20 characters
- Calls `searchIdeas()` on Google Sheets directly
- Returns formatted text results in Slack thread
- Supports `#N` syntax to specify result count (default 10)

## Supported Channels

The 💡 emoji collection is limited to configured channels. The @mention save/search works in any channel where the bot is present.

Current 💡-enabled channels: `#discuss_account`, `#zzzz_general`, `#creative-team`, `#project_mcdonald_ig經營`, `#zzzz_random`, `#idea-inbox`, `#project_mcdonald_brand`, `#project_借勢話題小組`, `#zzzz_idea`, `#project_自主專案`

## Frontend Pages

### `index.html` — Search & About
- **Search page**: Search bar, card grid, random idea button, modal detail view with lightbox
- **About page**: System introduction, collection steps, supported channels/formats, search methods, tips, architecture diagram
- Navigation: top nav toggles between Search and About

### `presentation.html` — Slideshow
- 11-slide fullscreen presentation explaining the system
- Keyboard/touch/button navigation with progress dots
- Slide 5: Image analysis showcase with clickable example cards (hardcoded data, modal with lightbox)
- Used for team onboarding and internal presentations
