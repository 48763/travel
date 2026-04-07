# --- 階段 1: 編譯 (Build Stage) ---
FROM node:20-slim AS build

WORKDIR /app

# 先複製相依性檔案，加速 Docker layer 快取
COPY package*.json ./
RUN npm install

# 複製其餘程式碼並進行編譯
COPY . .
RUN npm run build

# --- 階段 2: 伺服 (Production Stage) ---
FROM nginx:stable-alpine

# 從 build 階段將編譯好的檔案 (dist) 複製到 nginx 目錄
COPY --from=build /app/dist /usr/share/nginx/html

# 曝露 80 埠
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
