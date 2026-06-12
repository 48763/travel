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
    date: d(5, 28),
    events: [
      {
        time: '05:30',
        title: '抵達松山機場',
        address: '台北松山機場 (TSA)',
        type: 'schedule'
      },
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
        address: 'ヴィラフォンテーヌ グランド 東京有明',
        type: 'hotel'
      },
      {
        time: '17:30',
        title: '飯店晚餐',
        details: '最晚點餐時間 21:30\n最晚用餐時間 22:00',
        type: 'food'
      },
      {
        time: '18:30',
        title: '有明花園購物中心',
        details: '飯店旁，步行約 5 分鐘',
        address: '有明ガーデン',
        type: 'shopping'
      },
      {
        time: '20:40',
        title: '123+N 東雲店',
        address: '123+N 東雲店',
        type: 'activity'
      },
      {
        time: '23:00',
        title: '回到 維拉芳泉東京有明大飯店',
        address: 'ヴィラフォンテーヌ グランド 東京有明',
        type: 'walking'
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
        time: '11:00',
        title: 'Pokémon GO Fest 公園遊記',
        details: '本次旅程的主要活動內容。',
        address: '東京臨海副都心',
        type: 'activity'
      },
      {
        time: '20:00',
        title: '取行李',
        details: '從 維拉芳泉東京有明大飯店 取出寄存的行李',
        address: 'ヴィラフォンテーヌ グランド 東京有明',
        type: 'luggage'
      },
      {
        time: '20:30',
        title: '前往 濱松町京王布萊索飯店',
        lines: [
          { name: 'U', color: '#E5821D', description: 'ゆりかもめ, 往新橋, 有明テニスの森 → 新橋, 約 23 分鐘' },
          { name: 'JY', color: '#9ACD32', description: 'JR 山手線, 往品川方向, 新橋 → 浜松町, 約 2 分鐘' }
        ],
        type: 'train'
      },
      {
        time: '22:00',
        title: '入住 濱松町京王布萊索飯店',
        details: 'Keio Presso Inn Hamamatsucho',
        address: '京王プレッソイン浜松町',
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
      },
      {
        time: '23:00',
        title: '回到 濱松町京王布萊索飯店',
        address: '京王プレッソイン浜松町',
        type: 'walking'
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
      },
      {
        time: '23:00',
        title: '回到 濱松町京王布萊索飯店',
        address: '京王プレッソイン浜松町',
        type: 'walking'
      }
    ]
  },
  {
    date: d(6, 1),
    events: [
      {
        time: '10:00',
        title: '前往 淺草',
        lines: [
          { name: 'A', color: '#EF4868', description: '都営浅草線, 往押上方面, 大門 → 浅草, 約 14 分鐘' }
        ],
        type: 'train'
      },
      {
        time: '10:30',
        title: '一蘭拉麵 淺草店',
        details: '本日第一餐\n雷門徒步約 1 分鐘',
        address: '一蘭 浅草店',
        type: 'food'
      },
      {
        time: '11:30',
        title: 'Flower Miffy',
        details: '米菲兔主題花店',
        address: 'Flower Miffy 浅草店',
        type: 'shopping'
      },
      {
        time: '12:00',
        title: '淺草寺',
        details: '雷門 / 仲見世通 / 本堂',
        address: '浅草寺',
        type: 'walking'
      },
      {
        time: '14:30',
        title: '前往 東京晴空塔',
        lines: [
          { name: 'TS', color: '#F18F1F', description: '東武スカイツリーライン, 往北千住方面, 浅草 → とうきょうスカイツリー, 約 3 分鐘' }
        ],
        type: 'train'
      },
      {
        time: '15:00',
        title: '晴空塔 Solamachi 百貨 + 寶可夢中心',
        details: '寶可夢中心 Skytree Town 位於 Solamachi 4F\n沿途逛百貨樓層',
        address: '東京ソラマチ',
        type: 'shopping'
      },
      {
        time: '17:00',
        title: '墨田水族館',
        details: 'Solamachi 5-6F',
        address: 'すみだ水族館',
        type: 'activity'
      },
      {
        time: '19:00',
        title: 'Tokyo Solamachi LOFT',
        details: 'Solamachi 2F',
        address: '東京ソラマチ',
        type: 'shopping'
      },
      {
        time: '22:40',
        title: '回 濱松町京王布萊索飯店',
        lines: [
          { name: 'A', color: '#EF4868', description: '都営浅草線直通, 往泉岳寺方面, 押上 → 大門, 約 20 分鐘' }
        ],
        type: 'train'
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
      },
      {
        time: '23:00',
        title: '回到 濱松町京王布萊索飯店',
        address: '京王プレッソイン浜松町',
        type: 'walking'
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
      },
      {
        time: '23:00',
        title: '回到 濱松町京王布萊索飯店',
        address: '京王プレッソイン浜松町',
        type: 'walking'
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
      },
      {
        time: '23:00',
        title: '回到 濱松町京王布萊索飯店',
        address: '京王プレッソイン浜松町',
        type: 'walking'
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
      },
      {
        time: '23:00',
        title: '回到 濱松町京王布萊索飯店',
        address: '京王プレッソイン浜松町',
        type: 'walking'
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
