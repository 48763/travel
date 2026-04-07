#!/bin/bash

# 日本旅遊時程安排 - 快速啟動腳本

echo "🚀 正在準備啟動日本旅遊時程網頁..."

# 檢查是否在正確的目錄 (檢查是否有 package.json)
if [ ! -f "package.json" ]; then
    echo "❌ 找不到 package.json，請在專案根目錄執行此腳本。"
    exit 1
fi

# 檢查是否有 node_modules，沒有的話則安裝
if [ ! -d "node_modules" ]; then
    echo "📦 偵測到尚未安裝函式庫，正在進行安裝 (npm install)..."
    npm install
fi

# 啟動開發伺服器
echo "🌐 伺服器啟動中，請稍候..."
npm run dev
