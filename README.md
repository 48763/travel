# 🇯🇵 日本旅遊時程安排 (Japan Travel Itinerary)

這是一個為個人旅遊設計的互動式行程網頁。具有側邊導覽目錄、行程小卡與錨點跳轉，桌機與手機皆有對應的版面。

## 🚀 快速開始

```bash
npm install   # 第一次執行需要
npm run dev
```

執行後請在瀏覽器打開：`http://localhost:5173/`

## 🛠 如何調整行程內容？

行程依日期拆分在 `src/schedule/`，檔名格式 `day-MMDD.tsx`（例如 `day-0528.tsx`）。
新增或修改檔案後不需要手動註冊，`src/data.tsx` 會透過 `import.meta.glob` 自動掃入並依檔名排序。

### 修改範例

```tsx
import { FaHotel } from 'react-icons/fa';
import type { Day } from '../types';
import { ICON_COLORS } from '../colors';

const day: Day = {
  date: '05/28 (四)',
  events: [
    {
      time: '15:00',
      title: '入住飯店',
      details: '這裡寫詳細資訊',
      address: '東京都江東区有明2丁目1-5',
      icon: <FaHotel />,
      iconColor: ICON_COLORS.hotel,
    },
  ],
};

export default day;
```

- `Day` / `Event` / `Line` 型別定義在 `src/types.ts`，欄位寫錯會在 typecheck 階段被抓到。
- 圖示色票集中在 `src/colors.ts`（`ICON_COLORS.hotel`、`food`、`train` …），整體換色時改一處即可。

### 換圖示

使用 [Font Awesome (Fa)](https://react-icons.github.io/react-icons/icons/fa/) 系列：
1. 在檔案頂部 `import { ..., FaNewIcon } from 'react-icons/fa';`
2. 在 `icon` 欄位寫 `<FaNewIcon />`

## 📂 專案結構

- `src/App.tsx` — 主元件，包含 Sidebar / DayEntry / EventCard 與行動裝置 overlay 行為。
- `src/App.css` — 視覺樣式與 RWD（≤ 768px 時 sidebar 變 overlay + backdrop）。
- `src/data.tsx` — 透過 `import.meta.glob` 匯總 `schedule/` 內所有 day-*.tsx。
- `src/schedule/` — 各日行程檔。
- `src/types.ts` — `Day` / `Event` / `Line` 型別。
- `src/colors.ts` — 共用 icon 色票。

## ✨ 特色

- **側邊目錄**：點日期或行程標題即可錨點跳轉。
- **桌機**：sidebar 常駐左側、可收合。
- **手機**：sidebar 改為覆蓋式 overlay，點外側遮罩或選單項目自動關閉。
- **2026 年日期對應**。

## 🚢 部署

- 推上 `main` 會由 GitHub Actions（`.github/workflows/deploy.yml`）自動 build 並 deploy 到 `gh-pages` 分支。
- 也可手動：`npm run deploy`（會跑 build 並用 `gh-pages` 套件推上去）。
- 容器化：`docker compose up --build`，預設曝露 `8080:80`。
