# IPv4 Subnet Calculator

一個可直接在瀏覽器使用的 IPv4 子網路計算網站，支援輸入 IP 位址搭配 CIDR 首碼或子網路遮罩，並輸出完整的網段資訊。

專案網址：
- GitHub: <https://github.com/hc023307c/ipv4test>

## 功能特色

- 支援輸入 `IP + CIDR 首碼`
- 支援輸入 `IP + 子網路遮罩`
- 自動檢查首碼與子網路遮罩是否一致
- 輸出子網路遮罩
- 輸出網段名稱
- 輸出廣播位址
- 輸出 IP 網段範圍
- 輸出可用 IP 範圍
- 顯示可用主機數
- 針對 `/31`、`/32` 做特殊情況處理
- 採用溫暖自然系的吉普力風格介面

## 專案結構

```text
.
├─ index.html
├─ style.css
├─ app.js
├─ work-plan.md
└─ README.md
```

## 使用方式

1. 開啟 `index.html`
2. 輸入 IPv4 位址
3. 輸入 CIDR 首碼，或輸入子網路遮罩
4. 按下「開始計算」
5. 查看結果區塊輸出的網段資訊

範例：

- IP: `192.168.1.10`
- 首碼: `/24`

## 輸出內容

系統會顯示以下資訊：

- 子網路遮罩
- 網段名稱，例如 `192.168.1.0/24`
- 廣播位址
- IP 網段範圍
- 可用 IP 範圍
- 可用主機數

## 技術說明

- 純前端靜態網站
- 使用 `HTML`、`CSS`、`JavaScript`
- 不依賴額外前端框架
- 適合部署到 GitHub Pages、Vercel 等靜態網站平台

## 本機開啟

這個專案不需要安裝套件。

你可以直接用瀏覽器開啟 [index.html](/c:/Users/Administrator/Desktop/project/test/index.html) 進行使用，或使用任意靜態伺服器啟動。

## 部署到 Vercel

此專案為靜態網站，部署流程通常如下：

1. 將專案推送到 GitHub
2. 登入 Vercel
3. 點選 `Add New Project`
4. 匯入 GitHub 上的 `ipv4test`
5. Framework Preset 選擇 `Other`，或使用 Vercel 自動偵測
6. `Build Command` 留空
7. `Output Directory` 留空
8. 直接部署

通常不需要設定環境變數。

## 後續可擴充方向

- 增加一鍵複製結果
- 增加更多網路資訊欄位，例如 Wildcard Mask
- 增加 IPv6 計算支援
- 增加更完整的輸入歷史與結果紀錄

## 授權

目前未額外指定授權條款，如需公開發佈，建議後續補上 `MIT License` 或其他授權檔案。
