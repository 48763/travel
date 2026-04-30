# 🇯🇵 日本旅遊時程安排 (Japan Travel Itinerary)

這是一個為個人旅遊設計的互動式行程網頁。具有側邊導覽目錄、行程小卡與錨點跳轉，桌機與手機皆有對應的版面，並會在當天自動定位、標示「今日」並提供整日 Google Maps 路線。

🌐 **Live demo**：<https://48763.github.io/travel/>

## 🚀 快速開始

```bash
npm install        # 第一次執行需要
npm run dev        # 開發模式 (預設 http://localhost:5173/)
npm run build      # 產出靜態檔到 dist/
npm run preview    # 用 vite preview 在本機預覽 production build
npm run lint       # ESLint
```

## 🧳 重複使用模板

下次旅行只需要改兩個檔案：

### 1. `src/trip.config.ts`

```ts
export const TRIP = {
  title: '日本旅遊時程', // 頁面標題與瀏覽器 tab
  year: 2026,            // 旅程主要年份
  startMonth: 5,         // 起始月份（用於跨年判定）
  accent: '#e67e22',     // 「今日」色帶與 sidebar 標記主色
} as const;
```

`startMonth` 是用來支援**跨年旅行**：如果 `d(month, day)` 傳入的 `month < startMonth`，會視為旅行已經跨進新一年，自動把年份 +1。範例：

| TRIP 設定 | `d(12, 28)` | `d(1, 3)` |
|---|---|---|
| `year: 2026, startMonth: 12` | `2026-12-28` | `2027-01-03` |
| `year: 2026, startMonth: 5`  | `2026-12-28` | `2026-01-03`（沒跨年）|

非典型情況（例如測試資料、跨多年的長旅行）就直接寫 ISO 字串 `'2026-04-29'` 取代 `d()`。

### 2. `src/schedule/index.ts`

整趟行程在這一個檔案，每天一個物件：

```ts
import type { Day } from '../types';
import { d } from '../trip.config';

export const schedule: Day[] = [
  {
    date: d(5, 28), // → '2026-05-28'
    events: [
      {
        type: 'planeDeparture',
        time: '07:20',
        title: '啟程飛往日本',
        details: ['長榮航空 BR192', '台北松山 (TSA)'], // 也可以寫單一字串
        address: '台北松山機場 (TSA)',
      },
      {
        type: 'hotel',
        time: '15:00',
        title: '入住飯店',
        address: '東京都江東区有明2丁目1-5',
      },
    ],
  },
  // ... 後面繼續每一天
];
```

## 🧩 資料結構

- **`Day.date`**: ISO 格式 `YYYY-MM-DD`，畫面上會自動格式化成「05/28 (四)」。建議用 `d(month, day)` 帶入 TRIP.year，避免年份重打。
- **`Event.type`**: 字串列舉，決定該 event 的 icon 與顏色。目前支援：
  `planeDeparture` / `planeArrival` / `train` / `schedule` / `hotel` / `food` / `shopping` / `activity` / `walking` / `luggage` / `social` / `unknown`。
- **`Event.details`**: `string` 或 `string[]`。用陣列時，每個元素自成一行（內部以 `\n` 串接，CSS 用 `pre-wrap` 渲染）。
- **`Event.address`**: 有填的話會自動產出 Google Maps 連結；同一天 ≥ 2 個 events 帶 address 時，日期欄會自動出現「路線」按鈕串成多點導航。
- **`Event.lines`**: 交通線路 chip（顏色 + 名稱 + 描述），用於描述地鐵/鐵道轉乘。

### 加一個新的 event 類型

1. `src/types.ts` 的 `EventType` 聯合型別加入新名字（例如 `'onsen'`）。
2. `src/eventStyle.tsx` 的 `EVENT_STYLE` 對應新增 `{ icon: <FaXxx />, color: '#...' }`。
3. schedule 即可使用 `type: 'onsen'`。

## 📂 專案結構

- `src/App.tsx` — 主元件：Sidebar / DayEntry / EventCard / ScrollControls，含「今日」自動定位邏輯。
- `src/App.css` — 視覺樣式與 RWD（≤ 768px overlay sidebar、日期 sticky 在頂部）。`--accent` CSS 變數從 `App.tsx` 注入，由 `TRIP.accent` 控制。
- `src/trip.config.ts` — 旅行特定設定（標題、年份、起始月、主色）+ 日期 helper `d(m, day)`。
- `src/schedule/index.ts` — 整趟行程的單一資料檔。
- `src/types.ts` — `Day` / `Event` / `Line` / `EventType` 型別。
- `src/eventStyle.tsx` — `EventType` 到 icon + color 的集中對應表。

## ✨ 特色

- **今日自動定位**：開啟頁面如果當天落在行程範圍內，會自動捲到當日，並在日期欄與 Sidebar 加上「今日」標。
- **過去日期淡化**：已過去的日期透明度降低，視覺上更聚焦於現在與未來。
- **整日路線**：每天若有 ≥ 2 個帶地址的 event，日期欄會多一個「路線」按鈕，一鍵開啟 Google Maps 多點路線。
- **側邊目錄**：點日期或行程標題即可錨點跳轉。
- **桌機**：sidebar 常駐左側、可收合。
- **手機**：sidebar 改為覆蓋式 overlay，點外側遮罩或選單項目自動關閉；日期欄 sticky 在頂部。
- **回頂端／到最底**：右下角浮動按鈕。

## 🚢 部署

- 推上 `main` 會由 GitHub Actions（`.github/workflows/deploy.yml`）自動 build 並 deploy 到 `gh-pages` 分支。
- 容器化：`docker compose up --build`，預設曝露 `8080:80`。
