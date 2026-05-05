// Geocode script for travel itinerary
// - 掃 src/trips/**/*.ts 找 jp(...)/tw(...) 等呼叫
// - 載入 src/places/<country>.seed.json 取得二級行政區清單
// - 比對 .places-cache/<country>.json，缺的去 Nominatim 查
// - 結果寫回 cache（gitignored）
//
// 遵守 Nominatim 使用條款：
//   - 1 request / sec (本 script 用 1.2s 保守一點)
//   - 設定 User-Agent
//   - 用 namedetails=1 取多語言名稱

import fs from 'node:fs/promises';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PLACES_DIR = path.join(ROOT, 'src', 'places');
const CACHE_DIR = path.join(ROOT, '.places-cache');
const TRIPS_DIR = path.join(ROOT, 'src', 'trips');

const COUNTRIES = [
  { id: 'japan', helper: 'jp', country: 'Japan' },
  { id: 'taiwan', helper: 'tw', country: 'Taiwan' },
];

const NOMINATIM = 'https://nominatim.openstreetmap.org/search';
const USER_AGENT = 'travel-itinerary/1.0 (https://github.com/48763/travel)';
const REQUEST_DELAY_MS = 1200;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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

async function findHelperCalls(helperName) {
  const calls = new Set();
  const files = await collectFiles(TRIPS_DIR, /\.tsx?$/);
  const re = new RegExp(`\\b${helperName}\\(\\s*['"]([^'"]+)['"]`, 'g');
  for (const file of files) {
    const src = await fs.readFile(file, 'utf8');
    let m;
    while ((m = re.exec(src)) !== null) {
      calls.add(m[1]);
    }
  }
  return [...calls];
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

// 只保留我們實際會顯示的語言，避免 cache 暴漲
const KEEP_LANGS = new Set(['default', 'zh-Hant', 'zh-Hans', 'zh', 'ja', 'ko', 'en']);

function buildSearchParams(key, c) {
  // Nominatim 慣例：specific → general (從小到大)，最後接國家
  // 例如 "京都府,京都市,嵐山" 要送 "嵐山, 京都市, 京都府, Japan"
  const parts = key.split(',').map((s) => s.trim()).filter(Boolean);
  const reversed = [...parts].reverse();
  const q = [...reversed, c.country].join(', ');
  return new URLSearchParams({
    q,
    format: 'json',
    limit: '1',
    namedetails: '1',
    'accept-language': 'zh-Hant,zh,ja,ko,en',
  });
}

async function geocode(key, c) {
  const params = buildSearchParams(key, c);
  const url = `${NOMINATIM}?${params}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT },
  });
  if (!res.ok) {
    throw new Error(`Nominatim ${res.status}: ${res.statusText}`);
  }
  const arr = await res.json();
  if (!Array.isArray(arr) || arr.length === 0) {
    return null;
  }
  const hit = arr[0];
  const namedetails = hit.namedetails ?? {};
  const names = {};
  for (const k of Object.keys(namedetails)) {
    let lang;
    if (k === 'name') lang = 'default';
    else if (k.startsWith('name:')) lang = k.slice(5);
    else continue;
    if (KEEP_LANGS.has(lang)) names[lang] = namedetails[k];
  }
  return {
    lat: parseFloat(hit.lat),
    lng: parseFloat(hit.lon),
    names,
  };
}

async function processCountry(c) {
  const seedFile = path.join(PLACES_DIR, `${c.id}.seed.json`);
  const cacheFile = path.join(CACHE_DIR, `${c.id}.json`);

  const seed = await readJson(seedFile, []);
  const tripCalls = await findHelperCalls(c.helper);
  const cache = await readJson(cacheFile, {});

  const required = new Set([...seed, ...tripCalls]);
  const missing = [...required].filter((k) => !cache[k]);

  if (missing.length === 0) {
    console.log(`  [${c.id}] 已是最新（${required.size} 筆全部命中 cache）`);
    return;
  }

  console.log(`  [${c.id}] 需要查 ${missing.length} 筆（cache hits: ${required.size - missing.length}）`);

  for (let i = 0; i < missing.length; i++) {
    const key = missing[i];
    process.stdout.write(`    (${i + 1}/${missing.length}) ${key} ... `);
    try {
      const result = await geocode(key, c);
      if (result) {
        cache[key] = result;
        console.log(`✓ ${result.lat.toFixed(4)}, ${result.lng.toFixed(4)}`);
      } else {
        console.log('✗ 無結果');
      }
    } catch (err) {
      console.log(`✗ ${err.message}`);
    }
    if (i < missing.length - 1) await sleep(REQUEST_DELAY_MS);
  }

  await writeJson(cacheFile, cache);
}

async function main() {
  await ensureDir(CACHE_DIR);
  console.log('📍 Geocoding...');
  for (const c of COUNTRIES) {
    console.log(`\n國家: ${c.country}`);
    await processCountry(c);
  }
  console.log('\n✓ 完成');
}

main().catch((err) => {
  console.error('\n✗ 失敗:', err);
  process.exit(1);
});
