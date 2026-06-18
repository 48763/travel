// address → 確切 Google Maps 連結（EventCard 自動套用，行程資料只寫地點名稱）。
// cid=… 是 Google 的 place id（點了直接開該地點資訊卡）；/maps/place/名稱/@座標 是座標錨定，
// 兩者都精準落在地點，不會跳出一堆搜尋結果讓你自己選。
// 例外：GO Fest 會場雖是暫時場地，使用者指定要連到台場，所以放這裡。
export const PLACE_LINKS: Record<string, string> = {
  "台北松山機場 (TSA)": "https://www.google.com/maps/place/%E5%8F%B0%E5%8C%97%E6%9D%BE%E5%B1%B1%E6%A9%9F%E5%A0%B4/@25.06648,121.55489,17z",
  "羽田機場 (HND)": "https://www.google.com/maps/place/%E7%BE%BD%E7%94%B0%E7%A9%BA%E6%B8%AF/@35.54569,139.7761,17z",
  "ヴィラフォンテーヌ グランド 東京有明": "https://maps.google.com/?cid=4819665259873819959",
  "有明ガーデン": "https://maps.google.com/?cid=2149210893870706127",
  "123+N 東雲店": "https://maps.google.com/?cid=7408889047633117038",
  "京王プレッソイン浜松町": "https://maps.google.com/?cid=13741664864370053998",
  "一蘭 浅草店": "https://maps.google.com/?cid=10896094143831599582",
  "Flower Miffy 浅草店": "https://maps.google.com/?cid=13222063261272690690",
  "浅草寺": "https://maps.google.com/?cid=7785923974874169613",
  "東京ソラマチ": "https://www.google.com/maps/place/%E6%9D%B1%E4%BA%AC%E3%82%BD%E3%83%A9%E3%83%9E%E3%83%81/@35.71024,139.81195,17z",
  "すみだ水族館": "https://www.google.com/maps/place/%E3%81%99%E3%81%BF%E3%81%A0%E6%B0%B4%E6%97%8F%E9%A4%A8/@35.7101,139.80933,17z",
  "Cinnamoroll Cafe": "https://maps.google.com/?cid=12163419718774346138",
  "東京臨海副都心 - 台場": "https://maps.app.goo.gl/EVzvaLa56hM7kA7W7",
  "Big Dipper Shimbashi": "https://maps.google.com/?cid=1804844718707474296",
  "新橋商店 総本店": "https://maps.google.com/?cid=17290192335173148219",
  "博品館 TOY PARK": "https://maps.google.com/?cid=15576708788006522373",
  "Uniqlo 銀座旗艦店": "https://maps.google.com/?cid=5036491705805576403",
  "シルバニアファミリー 森のお家": "https://maps.google.com/?cid=5591884443677766332",
  "有楽町 UNO": "https://maps.google.com/?cid=564411483366123509",
  "マツモトキヨシ 有楽町イトシア店": "https://maps.google.com/?cid=8657789242075139668",
  "一蘭 新橋店": "https://maps.google.com/?cid=1837282406170052598",
  "焼肉ライク 新橋店": "https://maps.google.com/?cid=268323974193459964",
  "3COINS+plus 西銀座": "https://maps.google.com/?cid=2063383627992036788",
  "サンリオワールド 銀座": "https://maps.google.com/?cid=1275612411136897480",
  "セイムス 新橋日比谷口店": "https://maps.google.com/?cid=7391417068114962655",
};
