import { defineTrip } from '../../trip';

export default defineTrip(
  {
    id: 'japan-2026',
    title: '日本旅遊時程',
    year: 2026,
    startMonth: 5,
    accent: '#e67e22',
  },
  (d) => [
  {
    date: '2026-04-29',
    events: [
      {
        type: 'shopping',
        time: '14:00',
        title: '[測試] 昨天的採買',
        details: '應該整筆呈現淡化（過去日期）',
        address: '台北市信義區信義路五段7號',
      },
      {
        type: 'food',
        time: '19:00',
        title: '[測試] 昨天的晚餐',
        details: '驗證 past 樣式：opacity 0.5',
      },
    ],
  },
  {
    date: '2026-04-30',
    events: [
      {
        type: 'planeDeparture',
        time: '08:30',
        title: '[測試] 今天出發',
        details: '驗證進站時應自動捲到這一節',
        address: '台北松山機場',
      },
      {
        type: 'train',
        time: '12:00',
        title: '[測試] 今天的轉乘',
        details: '驗證 train 類型 icon 與顏色',
        address: '東京駅',
      },
      {
        type: 'hotel',
        time: '15:00',
        title: '[測試] 今天的入住',
        details: '驗證 hotel 類型 + 多點路線（≥ 2 個地址才會出現「路線」按鈕）',
        address: '東京都江東区有明2丁目1-5',
      },
      {
        type: 'food',
        time: '19:30',
        title: '[測試] 今晚晚餐',
        details: '驗證 today 的 sidebar 標記與日期欄今日 badge',
      },
    ],
  },
  {
    date: d(5, 1),
    events: [
      {
        type: 'activity',
        time: '10:00',
        title: '[測試] 明天的活動',
        details: '驗證 future 樣式：應該不淡化、無今日標',
        address: '東京都千代田区日比谷公園',
      },
      {
        type: 'walking',
        time: '15:00',
        title: '[測試] 明天的散步',
        details: '驗證 walking 類型 icon',
      },
    ],
  },
  {
    date: d(5, 28),
    events: [
      {
        time: '07:20',
        title: '啟程飛往日本',
        details: '長榮航空 BR192\n台北松山 (TSA)',
        address: '台北松山機場 (TSA)',
        type: 'planeDeparture'
      },
      {
        time: '11:30',
        title: '抵達日本',
        details: '東京羽田 (HND)',
        address: '羽田機場 (HND)',
        type: 'planeArrival'
      },
      {
        time: '13:00',
        title: '前往 維拉芳泉東京有明大飯店',
        lines: [
          { 
            name: 'KK', 
            color: '#e60012', 
            description: '京急線, 往品川, 羽田機場第3航廈 -> 大井町, 約 20 分鐘' 
          },
          { 
            name: 'R', 
            color: '#00a0e2', 
            description: '臨海線, 往新木場, 大井町 -> 有明網球之森, 約 10 分鐘' 
          }
        ],
        type: 'train'
      },
      {
        time: '15:00',
        title: '入住 維拉芳泉東京有明大飯店',
        details: 'Villa Fontaine Grand Tokyo Ariake',
        address: '東京都江東区有明2丁目1-5',
        type: 'hotel'
      },
      {
        time: '17:00',
        title: '晚餐時間',
        details: '最晚點餐時間 21:30\n最晚用餐時間 22:00',
        type: 'food'
      },
      {
        time: '19:30',
        title: '有明花園購物中心',
        details: '步行約 5 分鐘',
        address: '東京都江東区有明2丁目1-8',
        type: 'shopping'
      }
    ]
  },
  {
    date: d(5, 29),
    events: [
      {
        time: '06:00',
        title: '早餐時間',
        details: '最晚用餐時間 10:00',
        type: 'food'
      },
      {
        time: '10:00',
        title: '退房手續',
        details: '最晚退房時間 11:00\n寄存行李',
        type: 'luggage'
      },
      {
        time: '10:00',
        title: 'Pokémon GO Fest 公園遊記',
        details: '本次旅程的主要活動內容。',
        address: '東京都千代田区日比谷公園',
        type: 'activity'
      },
      {
        time: '22:00',
        title: '入住 濱松町京王布萊索飯店',
        details: 'Keio Presso Inn Hamamatsucho',
        address: '東京都港区浜松町1丁目18-11',
        type: 'hotel'
      }
    ]
  },
  {
    date: d(5, 30),
    events: [
      {
        time: '全天',
        title: '彈性行程日',
        details: '本日為彈性時間，可自由安排。',
        type: 'schedule'
      }
    ]
  },
  {
    date: d(5, 31),
    events: [
      {
        time: '全天',
        title: '城市散步 & Pokémon Go',
        details: '探索城市的其他區域。',
        type: 'activity'
      }
    ]
  },
  {
    date: d(6, 1),
    events: [
      {
        time: '全天',
        title: '彈性行程日',
        details: '本日為彈性時間，可自由安排。',
        type: 'schedule'
      }
    ]
  },
  {
    date: d(6, 2),
    events: [
      {
        time: '全天',
        title: '彈性行程日',
        details: '本日為彈性時間，可自由安排。',
        type: 'schedule'
      },
      {
        time: '下午',
        title: '與布來燈碰面',
        details: '計畫會面地點與時間。',
        type: 'social'
      }
    ]
  },
  {
    date: d(6, 3),
    events: [
      {
        time: '未定',
        title: '未定行程',
        details: '請在此填寫您的計畫...',
        type: 'unknown'
      }
    ]
  },
  {
    date: d(6, 4),
    events: [
      {
        time: '未定',
        title: '未定行程',
        details: '請在此填寫您的計畫...',
        type: 'unknown'
      }
    ]
  },
  {
    date: d(6, 5),
    events: [
      {
        time: '未定',
        title: '未定行程',
        details: '請在此填寫您的計畫...',
        type: 'unknown'
      }
    ]
  },
  {
    date: d(6, 6),
    events: [
      {
        time: '10:00',
        title: '退房手續',
        details: '最晚退房時間 11:00',
        type: 'luggage'
      },
      {
        time: '全天',
        title: '休閒行程',
        details: '本日為休閒時間，輕鬆探索。',
        type: 'walking'
      }
    ]
  },
  {
    date: d(6, 7),
    events: [
      {
        time: '09:40',
        title: '起飛：返回台灣',
        details: '全日空 NH851\n東京羽田 (HND)',
        address: '羽田機場 (HND)',
        type: 'planeDeparture'
      },
      {
        time: '12:05',
        title: '抵達台灣',
        details: '台北松山 (TSA)',
        address: '台北松山機場 (TSA)',
        type: 'planeArrival'
      }
    ]
  },
  ],
);
