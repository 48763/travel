# 🇯🇵 日本旅遊時程安排 (Japan Travel Itinerary)

這是一個為個人旅遊設計的互動式行程網頁。具有側邊導覽目錄、行程小卡與錨點跳轉，桌機與手機皆有對應的版面，會在當天自動定位、標示「今日」並提供整日 Google Maps 路線。**支援多趟行程切換**：透過 sidebar 下拉選單或 URL hash（`#/japan-2026`）切換不同行程。

🌐 **Live demo**：<https://48763.github.io/travel/>

## 🚀 快速開始

```bash
npm install        # 第一次執行需要
npm run dev        # 開發模式 (預設 http://localhost:5173/)
npm run build      # 產出靜態檔到 dist/
npm run preview    # 用 vite preview 在本機預覽 production build
npm run lint       # ESLint
```

## 🧳 新增一趟行程

每趟行程是 `src/trips/<年份>/<名稱>.ts` 一個檔案，**完全不需要改任何 index 或路由設定**——`src/trips/index.ts` 用 `import.meta.glob('./*/*.ts')` 自動掃所有年份資料夾。

範例：

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
          address: '台北松山機場 (TSA)',
        },
      ],
    },
    // ... 其他天
  ],
);
```

### 一年多趟

同一年份資料夾裡放多份檔案即可，例如：

```
src/trips/2026/
  japan.ts          → id: 'japan-2026',         title: '日本 2026 春'
  japan-autumn.ts   → id: 'japan-2026-autumn',  title: '日本 2026 秋'
```

`id` 跟 `title` 唯一即可，命名隨意。Sidebar 下拉會顯示所有趟，依首日日期升冪排序。

### 跨年行程

`startMonth` 是用來支援跨年旅行：`d(month, day)` 傳入的 `month < startMonth` 時會視為已跨進新一年，自動把年份 +1。

| TRIP 設定 | `d(12, 28)` | `d(1, 3)` |
|---|---|---|
| `year: 2026, startMonth: 12` | `2026-12-28` | `2027-01-03` |
| `year: 2026, startMonth: 5`  | `2026-12-28` | `2026-01-03`（沒跨年）|

例外情況（測試資料、跨多年的長旅行）就直接寫 ISO 字串 `'2026-04-29'` 取代 `d()`。

## 🧩 資料結構

- **`Day.date`**: ISO `YYYY-MM-DD`，畫面上自動格式化成「05/28 (四)」。
- **`Event.type`**: 字串列舉，決定該 event 的 icon 與顏色。目前支援：
  `planeDeparture` / `planeArrival` / `train` / `schedule` / `hotel` / `food` / `shopping` / `activity` / `walking` / `luggage` / `social` / `unknown`。
- **`Event.details`**: `string` 或 `string[]`。陣列時每個元素自成一行（內部以 `\n` 串接，CSS 用 `pre-wrap` 渲染）。
- **`Event.address`**: 有填的話會自動產出 Google Maps 連結；同一天 ≥ 2 個 events 帶 address 時，日期欄會自動出現「路線」按鈕串成多點導航。
- **`Event.lines`**: 交通線路 chip（顏色 + 名稱 + 描述），用於描述地鐵/鐵道轉乘。

### 預設行程怎麼選

進站時優先順序：

1. URL hash 指定的 `id`（例如 `#/japan-2026-autumn`）。
2. 今日落在某一趟的日期區間內 → 自動切到該趟。
3. 否則 → 行程清單裡最後一趟（最新一趟）。

### 加一個新的 event 類型

1. `src/types.ts` 的 `EventType` 聯合型別加入新名字（例如 `'onsen'`）。
2. `src/eventStyle.tsx` 的 `EVENT_STYLE` 對應新增 `{ icon: <FaXxx />, color: '#...' }`。
3. 任何 trip 即可使用 `type: 'onsen'`。

## 📂 專案結構

- `src/App.tsx` — 主元件：Sidebar / DayEntry / EventCard / ScrollControls，含「今日」自動定位與 trip 切換邏輯。
- `src/App.css` — 視覺樣式與 RWD（≤ 768px overlay sidebar、日期 sticky 在頂部）。`--accent` CSS 變數從 `App.tsx` 注入，由 trip.accent 控制。
- `src/trip.ts` — `TripDefinition` / `TripMeta` 型別 + `defineTrip(meta, scheduleFn)` 工廠（負責 binding `d()` helper）。
- `src/trips/<year>/<name>.ts` — 每趟行程一份檔，`export default defineTrip(...)`。
- `src/trips/index.ts` — auto-glob 收集所有 trip + `pickDefaultTrip(today)`。
- `src/types.ts` — `Day` / `Event` / `Line` / `EventType` 型別。
- `src/eventStyle.tsx` — `EventType` 到 icon + color 的集中對應表。

## ✨ 特色

- **多趟切換**：sidebar 下拉與 URL hash（`#/<id>`），主色／標題／路線都跟著切換。
- **今日自動定位**：開啟頁面如果當天落在某一趟內，自動切到該趟並捲到當日。
- **過去日期淡化**：已過去的日期透明度降低，視覺上更聚焦於現在與未來。
- **整日路線**：每天若有 ≥ 2 個帶地址的 event，日期欄會多一個「路線」按鈕，一鍵開啟 Google Maps 多點路線。
- **桌機**：sidebar 常駐左側、可收合。
- **手機**：sidebar 改為覆蓋式 overlay，點外側遮罩或選單項目自動關閉；日期欄 sticky 在頂部。
- **回頂端／到最底**：右下角浮動按鈕。

## 🚢 部署

- 推上 `main` 會由 GitHub Actions（`.github/workflows/deploy.yml`）自動 build 並 deploy 到 `gh-pages` 分支。
- 容器化：`docker compose up --build`，預設曝露 `8080:80`。
