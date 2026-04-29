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

## 🛠 如何調整行程內容？

行程依日期拆分在 `src/schedule/`，檔名格式 `day-MMDD.tsx`（例如 `day-0528.tsx`）。
新增或修改檔案後不需要手動註冊，`src/data.tsx` 會透過 `import.meta.glob` 自動掃入並依檔名排序。

### 修改範例

```tsx
import type { Day } from '../types';

const day: Day = {
  date: '2026-05-28', // ISO 格式 (YYYY-MM-DD)，畫面上會自動格式化成「05/28 (四)」
  events: [
    {
      type: 'hotel',
      time: '15:00',
      title: '入住飯店',
      details: '這裡寫詳細資訊',
      address: '東京都江東区有明2丁目1-5',
    },
  ],
};

export default day;
```

- 型別 `Day` / `Event` / `Line` / `EventType` 都定義在 `src/types.ts`，欄位寫錯或 type 拼錯會在 typecheck 抓到。
- 每個 event 的 `type` 會對到 `src/eventStyle.tsx` 裡的 `EVENT_STYLE`，由它統一決定圖示與顏色。目前支援：`planeDeparture` / `planeArrival` / `train` / `schedule` / `hotel` / `food` / `shopping` / `activity` / `walking` / `luggage` / `social` / `unknown`。
- 想加新類型或換圖示／顏色，編輯 `eventStyle.tsx` 即可，所有 event 一次套用。

### 加一個新的 event 類型

1. 在 `src/types.ts` 的 `EventType` 聯合型別加入新名字（例如 `'onsen'`）。
2. 在 `src/eventStyle.tsx` 的 `EVENT_STYLE` 對應新增 `{ icon: <FaXxx />, color: '#...' }`。
3. schedule 檔即可使用 `type: 'onsen'`。

## 📂 專案結構

- `src/App.tsx` — 主元件：Sidebar / DayEntry / EventCard / ScrollControls，以及行動裝置 overlay、自動定位「今日」邏輯。
- `src/App.css` — 視覺樣式與 RWD（≤ 768px 時 sidebar 變 overlay、日期 sticky 在頂部）。
- `src/data.tsx` — 透過 `import.meta.glob` 匯總 `schedule/` 內所有 day-*.tsx。
- `src/schedule/` — 各日行程檔（純資料，不再 import icon／color）。
- `src/types.ts` — `Day` / `Event` / `Line` / `EventType` 型別。
- `src/eventStyle.tsx` — `EventType` 到 icon + color 的集中對應表。

## ✨ 特色

- **今日自動定位**：開啟頁面如果當天落在行程範圍內，會自動捲到當日，並在日期欄與 Sidebar 加上「今日」標。
- **過去日期淡化**：已過去的日期透明度降低，視覺上更聚焦於現在與未來。
- **整日路線**：每天若有 ≥ 2 個帶地址的 event，日期欄會多一個「路線」按鈕，一鍵開啟 Google Maps 多點路線。
- **側邊目錄**：點日期或行程標題即可錨點跳轉。
- **桌機**：sidebar 常駐左側、可收合。
- **手機**：sidebar 改為覆蓋式 overlay，點外側遮罩或選單項目自動關閉；日期欄 sticky 在頂部，方便長日滑動時辨認。
- **回頂端／到最底**：右下角浮動按鈕。

## 🚢 部署

- 推上 `main` 會由 GitHub Actions（`.github/workflows/deploy.yml`）自動 build 並 deploy 到 `gh-pages` 分支。
- 容器化：`docker compose up --build`，預設曝露 `8080:80`。
