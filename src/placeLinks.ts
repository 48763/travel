// address → 確切 Google Maps 連結（EventCard 自動套用，行程資料只寫地點名稱）。
// cid=… 是 Google 的 place id（點了直接開該地點資訊卡）；/maps/place/名稱/@座標 是座標錨定，
// 兩者都精準落在地點，不會跳出一堆搜尋結果讓你自己選。
// 暫時性場地（GO Fest 的「東京臨海副都心」）不放這裡，維持名稱搜尋。
export const PLACE_LINKS: Record<string, string> = {
  "台北松山機場 (TSA)": "https://www.google.com/maps/place/%E5%8F%B0%E5%8C%97%E6%9D%BE%E5%B1%B1%E6%A9%9F%E5%A0%B4/@25.06648,121.55489,17z",
  "羽田機場 (HND)": "https://www.google.com/maps/place/%E7%BE%BD%E7%94%B0%E7%A9%BA%E6%B8%AF/@35.54569,139.7761,17z",
  "ヴィラフォンテーヌ グランド 東京有明": "https://maps.google.com/?cid=4819665259873819959",
  "有明ガーデン": "https://maps.google.com/?cid=2149210893870706127",
  "123+N 東雲店": "https://maps.google.com/?cid=7408889047633117038",
  "京王プレッソイン浜松町": "https://www.google.com/maps/place/%E4%BA%AC%E7%8E%8B%E3%83%97%E3%83%AC%E3%83%83%E3%82%BD%E3%82%A4%E3%83%B3%E6%B5%9C%E6%9D%BE%E7%94%BA/@35.65924,139.75287,17z",
  "一蘭 浅草店": "https://maps.google.com/?cid=10896094143831599582",
  "Flower Miffy 浅草店": "https://maps.google.com/?cid=13222063261272690690",
  "浅草寺": "https://maps.google.com/?cid=7785923974874169613",
  "東京ソラマチ": "https://www.google.com/maps/place/%E6%9D%B1%E4%BA%AC%E3%82%BD%E3%83%A9%E3%83%9E%E3%83%81/@35.71024,139.81195,17z",
  "すみだ水族館": "https://www.google.com/maps/place/%E3%81%99%E3%81%BF%E3%81%A0%E6%B0%B4%E6%97%8F%E9%A4%A8/@35.7101,139.80933,17z",
  "Cinnamoroll Cafe": "https://maps.google.com/?cid=12163419718774346138",
};
