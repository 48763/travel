# 🇯🇵 旅遊時程模板 (Travel Itinerary Template)

互動式行程網頁。具有歷年旅行首頁、世界地圖總覽、單趟詳細頁（側邊導覽 + 錨點跳轉）、自動偵測「今日」並標示路線。**支援多趟行程切換**：透過 sidebar 選單或 URL hash（`#/japan-2026`）切換。

🌐 **Live demo**：<https://48763.github.io/travel/>

## 🚀 快速開始

```bash
npm install        # 第一次執行需要
npm run dev        # 開發模式 (預設 http://localhost:5173/)
npm run build      # 產出靜態檔到 dist/
npm run preview    # 用 vite preview 在本機預覽 production build
npm run lint       # ESLint
npm run geocode    # 解析 events.address → 座標 (dev/build 會自動帶跑)
```

> **第一次跑** `npm run dev` / `npm run build` 會自動觸發 prebuild hook，把每個 trip 檔裡的 `event.address` 送 OpenStreetMap Nominatim 解析（每筆約 1.2 秒，含 fallback 退階）。結果寫到 `.places-cache/addresses.json`（gitignored）。
>
> **後續執行** 只查新增的地址，已 cache 的瞬間命中。
>
> **CI**（GitHub Actions）跨 build 用 `actions/cache@v4` 把 `.places-cache/` 留住，所以實際每次 push 也只是補新地址。

## 🧳 新增一趟行程

每趟行程是 `src/trips/<分類>/<名稱>.ts` 一個檔案，**完全不需要改任何 index 或路由設定**——`src/trips/index.ts` 用 `import.meta.glob('./*/*.ts')` 自動掃所有資料夾。

```ts
// src/trips/2026/japan.ts
import { defineTrip } from '../../trip';

export default defineTrip(
  {
    id: 'japan-2026',          // 唯一 id，會用在 URL hash (#/japan-2026)
    title: '日本旅遊時程',       // sidebar 下拉與 <h1> 顯示
    year: 2026,                // 主要年份
    startMonth: 5,             // 起始月份，用於 d() 跨年判定
    accent: '#e67e22',         // 「今日」色帶與 sidebar 標記主色
  },
  (d) => [
    {
      date: d(5, 28),          // → '2026-05-28'，d() 自動帶入 year
      events: [
        {
          type: 'planeDeparture',
          time: '07:20',
          title: '啟程飛往日本',
          details: ['長榮航空 BR192', '台北松山 (TSA)'],
          address: '台北松山機場 (TSA)',  // ← 自動解析座標 + 行政階層
        },
      ],
    },
    // ... 其他天
  ],
);
```

**就這樣**。地圖 pin、首頁卡片地點清單、polyline，全部從 `events.address` 自動推 — **不需要再寫 `locations`**。

### 目錄分層

```
src/trips/
  index.ts                    ← 自動掃 ./*/*.ts，不需手動註冊
  2026/                       ← 真實行程依年份分層
    japan.ts                  →  id: 'japan-2026'
  2027/                       ← 之後新年份就再開一個資料夾
    japan-spring.ts
  samples/                    ← 範例獨立一層，不混進真實年份
    japan-spring.ts
```

一年多趟：同一年份資料夾裡放多份檔案即可（`2026/japan-may.ts`、`2026/japan-october.ts`）。

### 跨年行程

`startMonth` 用來支援跨年旅行：`d(month, day)` 傳入的 `month < startMonth` 時會視為已跨進新一年，自動把年份 +1。

| TRIP 設定 | `d(12, 28)` | `d(1, 3)` |
|---|---|---|
| `year: 2026, startMonth: 12` | `2026-12-28` | `2027-01-03` |
| `year: 2026, startMonth: 5`  | `2026-12-28` | `2026-01-03`（沒跨年）|

例外情況（測試資料、跨多年的長旅行）直接寫 ISO 字串 `'2026-04-29'` 取代 `d()`。

## 📍 地址 → 座標：自動 geocoding

每個 event 的 `address` 是 free-form 字串。`scripts/geocode.mjs` 會：

1. 掃 `src/trips/**/*.ts` 取出所有 `address` 字串
2. 比對 `.places-cache/addresses.json`，缺的去 Nominatim 查
3. 失敗會自動退階（去括號、去丁目、去街道名…），最多嘗試到第二層行政區
4. 從回應抽出 `lat / lng / namedetails / 行政階層 / 機場/車站分類`
5. 寫回 cache

### 機場 / 車站自動分類

Geocode script 看 Nominatim 的 `class: aeroway` / `class: railway` 欄位，自動把地址標記為 `airport` / `station` / `place`。為了避免退階匹配誤判（例如飯店地址退階到附近車站），加了 keyword guard：原 query 必須含 `機場 / 空港 / 駅 / station / airport` 等字才會被歸為 transit。

**Transit 點在 UI 的特殊處理**：

- **地圖**：小灰色 pin，**不參與 polyline**，FitBounds 也排除（zoom 聚焦真正旅遊區域）
- **首頁卡片**：用交通工具圖示取代名稱，連續同類自動合併
  - `airport` → `✈`
  - `station` → `🚆`
  - 例：你的 trip 從 TPE 飛到 HND，卡片顯示「✈ → 江東區 → 千代田區 → 港區 → ✈」
- **Trip 詳細頁**：照常顯示 `event.address` 跟 Google Maps 連結

### 行政階層：依國家分支

不同國家的 Nominatim 回應結構不一致，script 內建幾個國家的 fallback：

- **日本**：`state` 缺時用 `ISO3166-2-lvl4` 推都道府県（東京特別区、大阪這種沒填 state 的情況）；政令市（京都/大阪/横浜/名古屋…）會額外加 `suburb` 為第三層（下京区、北区等）
- **台灣**：`city`（直轄市/縣市）+ `suburb`（區/鄉/鎮）
- **其他**：`state` + `city/county` 的 generic fallback

新增國家 fallback：在 `scripts/geocode.mjs` 看 `pickAdminPath()`，按該國行政結構新增 case。

### Label 顯示規則

- **首頁卡片 / 地圖 pin**：繁中 (`names['zh-Hant']`)，沒有就 fallback 到該國原文
- **展開卡片**：「繁中 (原文)」雙語格式；同字串自動省略括號

## 🧩 資料結構

| 欄位 | 說明 |
|---|---|
| `Day.date` | ISO `YYYY-MM-DD`，畫面上格式化成「05/28 (四)」 |
| `Event.type` | 字串列舉，決定該 event 的 icon 與顏色 |
| `Event.time` | 時間字串（free form） |
| `Event.title` | 標題 |
| `Event.details` | `string` 或 `string[]`，陣列每個元素自成一行 |
| `Event.address` | Google Maps 連結 + **自動 geocoding 的來源** |
| `Event.lines` | 交通線路 chip（顏色 + 名稱 + 描述），描述地鐵/鐵道轉乘 |

`Event.type` 目前支援：
`planeDeparture` / `planeArrival` / `train` / `schedule` / `hotel` / `food` / `shopping` / `activity` / `walking` / `luggage` / `social` / `unknown`

### 預設行程怎麼選

進站順序：

1. URL hash 指定的 `id`（例如 `#/japan-2026-autumn`）→ 進該趟
2. 今日落在某一趟的日期區間內 → 自動切到該趟並捲到當日
3. 否則 → 顯示**歷年旅行首頁**（卡片清單 + 世界地圖）

### 加一個新的 event 類型

1. `src/types.ts` 的 `EventType` 聯合型別加入新名字（例如 `'onsen'`）
2. `src/eventStyle.tsx` 的 `EVENT_STYLE` 對應新增 `{ icon: <FaXxx />, color: '#...' }`
3. 任何 trip 即可使用 `type: 'onsen'`

## 📂 專案結構

```
src/
  App.tsx                    ← routing (hash → trip 或 landing) + layout
  App.css                    ← 樣式 + RWD (≤768px sidebar overlay)
  main.tsx
  constants.ts               ← MOBILE_QUERY 等共用常數
  dateUtils.ts               ← formatDate / todayISO / dayStatus
  types.ts                   ← Day / Event / Line / EventType
  eventStyle.tsx             ← EventType → icon + color 對應表
  trip.ts                    ← TripDefinition / TripLocation 型別 + defineTrip 工廠
                                (defineTrip 自動從 events.address 推出 locations)
  trips/
    index.ts                 ← auto-glob './*/*.ts' + 分組+排序
    2026/japan.ts            ← 真實行程
    samples/japan-spring.ts  ← 範例行程
  TripIndex.tsx              ← 歷年旅行首頁 (卡片清單，依分類分區)
  TripMap.tsx                ← Leaflet 世界地圖 + transit pin 區分
  TripSelector.tsx           ← Sidebar 下拉切換選單 (扁平分組清單)
  Sidebar.tsx                ← Trip 詳細頁的側邊導覽
  DayEntry.tsx               ← 一天的事件清單
  EventCard.tsx              ← 單一 event 顯示
  ScrollControls.tsx         ← 右下角浮動按鈕 (回頂端/到底/回首頁)

scripts/
  geocode.mjs                ← Nominatim 解析 events.address → .places-cache/

.places-cache/               ← gitignored，CI 用 actions/cache 跨 build 留存
  addresses.json             ← 解析結果：{lat,lng,names,adminPath,kind,...}
```

## ✨ 特色

- **歷年旅行首頁**：所有 trip 卡片依分類顯示，世界地圖標出每趟旅遊區域；hover 卡片時對應地圖 pin 高亮、地圖飛過去；點卡片展開預覽，再點「進入行程」進入該趟
- **多趟切換**：sidebar 下拉與 URL hash（`#/<id>`），主色／標題／路線都跟著切換
- **今日自動定位**：開啟頁面如果當天落在某一趟內，自動切到該趟並捲到當日
- **過去日期淡化**：已過去的日期透明度降低
- **整日路線**：每天 ≥ 2 個帶地址的 event，日期欄會多一個「路線」按鈕，一鍵 Google Maps 多點導航
- **手機**：sidebar 改為覆蓋式 overlay，trip selector 全螢幕 drawer；點選單項目自動關閉
- **transit 區分**：機場/車站自動偵測，地圖小灰 pin、卡片用 ✈ / 🚆 圖示取代

## 🚢 部署

- 推上 `main` → GitHub Actions（`.github/workflows/deploy.yml`）自動 build + deploy 到 `gh-pages` 分支
  - 內含 `actions/cache@v4` 跨 build 留住 `.places-cache/`，CI 也只查新地址
- 容器化：`docker compose up --build`，預設曝露 `8080:80`
