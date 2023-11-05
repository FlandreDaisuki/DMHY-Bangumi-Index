import { compressToBase64, decompressFromBase64 } from 'lz-string';
import { ref } from 'vue';
import { HOUR_IN_MS, WEEKDAY_STR } from '../constants';
import { downloadBangumi } from '../api';

export const weeklyBangumi = ref({});

/**
 * wb := weeklyBangumi
 * {
 *   日: [
 *     {title, keyword, isnew},
 *     {title, keyword, isnew},...
 *   ],
 *   一: [],
 *   ...
 * }
 * → xwb := [...W].join('\0'); # ordered by WEEKDAY_STR #
 * → W := [...B].join('\1')
 * → B := [T, K, N].join('\2')
 * → N := true: 1; false: 0;
 */
const compressedEncode = (wb) => {
  return [...WEEKDAY_STR]
    .map((w) =>
      wb[w]
        .map((b) => [b.title, b.keyword, Number(b.isnew)].join('\x02'))
        .join('\x01'),
    )
    .join('\x00');
};

const compressedDecode = (xwb) => {
  return xwb
    .split('\x00')
    .map((xw, i) => {
      return {
        [WEEKDAY_STR[i]]: xw.split('\x01')
          .filter(Boolean)
          .map((b) => {
            const [title, keyword, isnew] = b.split('\x02');
            return {
              title,
              keyword,
              isnew: isnew === '1',
            };
          }),
      };
    })
    .reduce((c, v) => {
      return Object.assign(c, v);
    }, {});
};

const encodeWeeklyBangumiToStorage = (wb) => {
  return compressToBase64(compressedEncode(wb));
};

const decodeWeeklyBangumiFromStorage = (xwb) => {
  return compressedDecode(decompressFromBase64(xwb));
};

const STORAGE_KEY = 'DMHY-Bangumi-Index::weekly-bangumi';
const CACHE_KEY = 'DMHY-Bangumi-Index::weekly-bangumi-cache-t';

export const save = () => {
  localStorage.setItem(
    STORAGE_KEY,
    encodeWeeklyBangumiToStorage(weeklyBangumi.value),
  );
};

export const load = () => {
  const xwb = localStorage.getItem(STORAGE_KEY);
  if (xwb) {
    weeklyBangumi.value = decodeWeeklyBangumiFromStorage(xwb) || {};
  }
  else {
    weeklyBangumi.value = {};
  }
};

export const add = (payload) => {
  for (const weekdayStr of WEEKDAY_STR) {
    if (!weeklyBangumi.value[weekdayStr]) {
      weeklyBangumi.value[weekdayStr] = [];
    }
    weeklyBangumi.value[weekdayStr].push(...payload[weekdayStr]);
  }
};

export const loadRemote = async () => {
  const [oldPayload, newPayload] = await Promise.all([
    downloadBangumi('old'),
    downloadBangumi('new'),
  ]);
  add(oldPayload);
  add(newPayload);
  localStorage.setItem(CACHE_KEY, Date.now());
  save();
};

export const loadWithCache = async () => {
  const cacheTime = Number(localStorage.getItem(CACHE_KEY)) || 0;
  const maxCacheTime = 12 * HOUR_IN_MS;
  if (Date.now() - cacheTime > maxCacheTime) {
    await loadRemote();
  }
  else {
    load();
  }
};

export const cleanCacheTime = () => {
  localStorage.setItem(CACHE_KEY, 0);
};
