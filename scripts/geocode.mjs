// Geocode script — 掃 src/trips/**/*.ts 裡的 event.address，
// 用 Nominatim 解析座標 + 行政階層，寫入 .places-cache/addresses.json。
// trip 檔不再手寫 locations，runtime 會從 cache 推出來。
//
// Nominatim 政策：
//   - 1 request/s（這裡用 1.2s 保守）
//   - 必要 User-Agent
//   - 用 namedetails=1 + addressdetails=1 取多語言名稱與行政階層

import fs from 'node:fs/promises';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const TRIPS_DIR = path.join(ROOT, 'src', 'trips');
const CACHE_DIR = path.join(ROOT, '.places-cache');
const CACHE_FILE = path.join(CACHE_DIR, 'addresses.json');

const NOMINATIM = 'https://nominatim.openstreetmap.org/search';
const USER_AGENT = 'travel-itinerary/1.0 (https://github.com/48763/travel)';
const REQUEST_DELAY_MS = 1200;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// 只保留我們會顯示的語言
const KEEP_LANGS = new Set(['default', 'zh-Hant', 'zh-Hans', 'zh', 'ja', 'ko', 'en']);

// country_code → 該國原生語言 (用於 expanded card 的 "繁中 (原文)" 格式)
const NATIVE_LANG_BY_CC = {
  jp: 'ja',
  tw: 'zh-Hant',
  hk: 'zh-Hant',
  cn: 'zh-Hans',
  kr: 'ko',
};

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function readJson(file, fallback) {
  if (!existsSync(file)) return fallback;
  return JSON.parse(await fs.readFile(file, 'utf8'));
}

async function writeJson(file, data) {
  await fs.writeFile(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

async function collectFiles(dir, pattern) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await collectFiles(p, pattern)));
    } else if (pattern.test(entry.name)) {
      out.push(p);
    }
  }
  return out;
}

async function findAddresses() {
  const files = await collectFiles(TRIPS_DIR, /\.tsx?$/);
  const re = /\baddress:\s*['"]([^'"]+)['"]/g;
  const addrs = new Set();
  for (const f of files) {
    const src = await fs.readFile(f, 'utf8');
    let m;
    while ((m = re.exec(src)) !== null) {
      addrs.add(m[1]);
    }
  }
  return [...addrs];
}

function pickNames(namedetails) {
  const out = {};
  for (const k of Object.keys(namedetails)) {
    let lang;
    if (k === 'name') lang = 'default';
    else if (k.startsWith('name:')) lang = k.slice(5);
    else continue;
    if (KEEP_LANGS.has(lang)) out[lang] = namedetails[k];
  }
  return out;
}

// 47 都道府県 ISO 代碼 → 名稱（東京特別区這種沒 state 欄位的，用此 fallback）
const JP_ISO = {
  'JP-01': '北海道', 'JP-02': '青森県', 'JP-03': '岩手県', 'JP-04': '宮城県',
  'JP-05': '秋田県', 'JP-06': '山形県', 'JP-07': '福島県', 'JP-08': '茨城県',
  'JP-09': '栃木県', 'JP-10': '群馬県', 'JP-11': '埼玉県', 'JP-12': '千葉県',
  'JP-13': '東京都', 'JP-14': '神奈川県', 'JP-15': '新潟県', 'JP-16': '富山県',
  'JP-17': '石川県', 'JP-18': '福井県', 'JP-19': '山梨県', 'JP-20': '長野県',
  'JP-21': '岐阜県', 'JP-22': '静岡県', 'JP-23': '愛知県', 'JP-24': '三重県',
  'JP-25': '滋賀県', 'JP-26': '京都府', 'JP-27': '大阪府', 'JP-28': '兵庫県',
  'JP-29': '奈良県', 'JP-30': '和歌山県', 'JP-31': '鳥取県', 'JP-32': '島根県',
  'JP-33': '岡山県', 'JP-34': '広島県', 'JP-35': '山口県', 'JP-36': '徳島県',
  'JP-37': '香川県', 'JP-38': '愛媛県', 'JP-39': '高知県', 'JP-40': '福岡県',
  'JP-41': '佐賀県', 'JP-42': '長崎県', 'JP-43': '熊本県', 'JP-44': '大分県',
  'JP-45': '宮崎県', 'JP-46': '鹿児島県', 'JP-47': '沖縄県',
};

// 日本政令指定都市：他們的「区」是 suburb 級（如 京都市下京区 / 大阪市中央区），
// 不像東京 23 特別区是 city 級。
const JP_DESIGNATED_CITIES = new Set([
  '京都市', '大阪市', '横浜市', '名古屋市', '札幌市', '福岡市', '仙台市',
  '広島市', '北九州市', '神戸市', '川崎市', 'さいたま市', '千葉市', '新潟市',
  '静岡市', '浜松市', '堺市', '岡山市', '熊本市', '相模原市',
]);

function pickAdminPath(addr) {
  const cc = (addr.country_code ?? '').toLowerCase();
  if (cc === 'jp') return pickJpAdminPath(addr);
  if (cc === 'tw') return pickTwAdminPath(addr);
  // generic fallback
  const level2 = addr.state || addr.province || addr.region || '';
  const level3 = addr.city || addr.county || addr.town || addr.municipality || '';
  return [level2, level3].filter(Boolean).join(',');
}

function pickJpAdminPath(addr) {
  let level2 = addr.state || addr.province || '';
  if (!level2 && addr['ISO3166-2-lvl4']) {
    level2 = JP_ISO[addr['ISO3166-2-lvl4']] || '';
  }
  const level3 = addr.city || addr.county || addr.town || '';
  // 京都市等政令市：「区」在 suburb
  const isDesignated = JP_DESIGNATED_CITIES.has(level3);
  const level4 = isDesignated ? (addr.suburb || addr.city_district || '') : '';
  return [level2, level3, level4].filter(Boolean).join(',');
}

function pickTwAdminPath(addr) {
  // 台灣直轄市/縣市 通常在 city 欄位，「區/鄉/鎮」在 suburb
  const level2 = addr.state || addr.province || addr.city || '';
  const level3 = (addr.city && addr.city !== level2)
    ? addr.city
    : (addr.suburb || addr.city_district || addr.county || '');
  return [level2, level3].filter(Boolean).join(',');
}

// 從完整地址退階成多個變體，從最精確到最寬鬆，依序嘗試。
function generateVariations(addr) {
  const out = [];
  const seen = new Set();
  const add = (s) => {
    const t = (s ?? '').trim();
    if (t && !seen.has(t)) {
      seen.add(t);
      out.push(t);
    }
  };
  add(addr);
  // 1. 去掉括號內容："台北松山機場 (TSA)" → "台北松山機場"
  const noParen = addr.replace(/\([^)]*\)/g, '').trim();
  add(noParen);
  // 2. 去掉日文丁目/番地："東京都江東区有明2丁目1-5" → "東京都江東区有明"
  add(noParen.replace(/\d+丁目.*$/, '').replace(/\d+番地.*$/, ''));
  // 3. 砍掉結尾數字段："京都市東山区清水1丁目294" → "京都市東山区清水"
  add(noParen.replace(/\d[\d-丁目番地号]*$/, ''));
  // 4. 截到日文 admin 第三層 (区/市/町/村)
  const jpL3 = noParen.match(/^(.+?[区市町村])/);
  if (jpL3) add(jpL3[1]);
  // 5. 截到台灣 admin 第三層 (區/鄉/鎮/市)
  const twL3 = noParen.match(/^(.+?[縣市].+?[區鄉鎮市])/);
  if (twL3) add(twL3[1]);
  // 6. 截到第二層 (都道府県/縣市)
  const jpL2 = noParen.match(/^(.+?[都道府県])/);
  if (jpL2) add(jpL2[1]);
  const twL2 = noParen.match(/^(.+?[縣市])/);
  if (twL2) add(twL2[1]);
  return out;
}

async function tryQuery(query) {
  const params = new URLSearchParams({
    q: query,
    format: 'json',
    limit: '1',
    namedetails: '1',
    addressdetails: '1',
    'accept-language': 'zh-Hant,zh,ja,ko,en',
  });
  const res = await fetch(`${NOMINATIM}?${params}`, {
    headers: { 'User-Agent': USER_AGENT },
  });
  if (!res.ok) throw new Error(`Nominatim ${res.status}`);
  const arr = await res.json();
  if (!Array.isArray(arr) || arr.length === 0) return null;

  const hit = arr[0];
  const addr = hit.address ?? {};
  const cc = (addr.country_code ?? '').toLowerCase();

  return {
    lat: parseFloat(hit.lat),
    lng: parseFloat(hit.lon),
    names: pickNames(hit.namedetails ?? {}),
    adminPath: pickAdminPath(addr),
    country: addr.country ?? '',
    nativeLang: NATIVE_LANG_BY_CC[cc] ?? 'en',
    kind: classifyKind(hit, query),
  };
}

// 用戶原 query 含這些字樣，才允許標為 transit。否則退階匹配到附近機場/車站時會誤判
// （例如飯店地址退階到「浜松町」誤命中浜松町駅）。
const TRANSIT_KEYWORD_RE = /機場|空港|airport|駅|車站|station/i;

function classifyKind(hit, query) {
  const klass = (hit.class ?? '').toLowerCase();
  const type = (hit.type ?? '').toLowerCase();
  const addresstype = (hit.addresstype ?? '').toLowerCase();
  const looksLikeTransit = TRANSIT_KEYWORD_RE.test(query);
  const isAeroway = klass === 'aeroway' || addresstype === 'aeroway' || type === 'aerodrome';
  const isRailway = klass === 'railway' || addresstype === 'station' || type === 'station';
  if (isAeroway && looksLikeTransit) return 'airport';
  if (isRailway && looksLikeTransit) return 'station';
  return 'place';
}

async function geocode(originalAddr) {
  const variations = generateVariations(originalAddr);
  for (let i = 0; i < variations.length; i++) {
    if (i > 0) await sleep(REQUEST_DELAY_MS);
    const result = await tryQuery(variations[i]);
    if (result) return { ...result, matchedQuery: variations[i] };
  }
  return null;
}

async function main() {
  await ensureDir(CACHE_DIR);
  // 確保 cache 檔存在 — 即使是空的，trip.ts 才能 import 它
  if (!existsSync(CACHE_FILE)) {
    await writeJson(CACHE_FILE, {});
  }

  console.log('📍 Geocoding addresses...');
  const addrs = await findAddresses();
  const cache = await readJson(CACHE_FILE, {});
  const missing = addrs.filter((a) => !cache[a]);

  if (missing.length === 0) {
    console.log(`  已是最新（${addrs.length} 個全部命中 cache）`);
    return;
  }

  console.log(`  需要查 ${missing.length} 個（cache hits: ${addrs.length - missing.length}）`);

  for (let i = 0; i < missing.length; i++) {
    const addr = missing[i];
    process.stdout.write(`  (${i + 1}/${missing.length}) ${addr} ... `);
    try {
      const result = await geocode(addr);
      if (result) {
        cache[addr] = result;
        const note = result.matchedQuery !== addr ? ` (退階: "${result.matchedQuery}")` : '';
        console.log(`✓ ${result.adminPath || '(no admin)'} ${result.lat.toFixed(4)}, ${result.lng.toFixed(4)}${note}`);
      } else {
        console.log('✗ 無結果');
      }
    } catch (err) {
      console.log(`✗ ${err.message}`);
    }
    if (i < missing.length - 1) await sleep(REQUEST_DELAY_MS);
  }

  await writeJson(CACHE_FILE, cache);
  console.log('\n✓ 完成');
}

main().catch((err) => {
  console.error('\n✗ 失敗:', err);
  process.exit(1);
});
