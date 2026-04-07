# 🇯🇵 日本旅遊時程安排 (Japan Travel Itinerary)

這是一個專為個人旅遊設計的互動式行程安排網頁。具有側邊導覽目錄、精美的行程小卡以及流暢的錨點跳轉功能。

## 🚀 快速開始

你可以直接執行根目錄下的 `start.sh` 腳本，或是手動執行以下指令：

```bash
cd travel-schedule
npm install    # 僅第一次執行需要
npm run dev
```

執行後，請在瀏覽器打開：`http://localhost:5173/`

---

## 🛠 如何調整行程內容？

為了方便管理，行程已經按日期拆分。你可以直接修改以下路徑的檔案：

- **主要路徑：** `travel-schedule/src/schedule/`
- **檔案命名：** `day-MMDD.tsx` (例如 `day-0528.tsx`)

### **修改範例：**

在檔案中，你可以自由新增、修改或刪除 `events` 陣列中的物件：

```typescript
{
  time: '15:00',
  title: '入住飯店',
  details: '這裡寫詳細資訊',
  icon: <FaHotel />, // 從頂部引入的圖示名稱
  iconColor: '#8e44ad' // 圖示顏色
}
```

### **如何更換圖示？**

我們使用的是 [Font Awesome (Fa)](https://react-icons.github.io/react-icons/icons/fa/) 系列圖示。
1. 在檔案頂部 `import { ..., FaNewIcon } from 'react-icons/fa';`
2. 在 `icon` 欄位使用 `<FaNewIcon />`

---

## 📂 專案結構

- `src/App.tsx`: 主程式邏輯與介面佈局。
- `src/App.css`: 所有的視覺樣式與兩欄式佈局設定。
- `src/data.tsx`: 行程總管理處，負責匯總各個日期的檔案。
- `src/schedule/`: 存放每日行程的獨立資料夾。

---

## ✨ 特色功能

- **側邊目錄：** 點擊日期或具體行程標題可快速跳轉。
- **可收縮設計：** 點擊 `<` 隱藏目錄，點擊 `≡` 重新展開。
- **精美小卡：** 每個行程點都有專屬時間、圖示與內容區塊。
- **2026 日曆對應：** 所有的星期均已對應 2026 年的正確日期。
