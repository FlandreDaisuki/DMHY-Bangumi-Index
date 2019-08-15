import LZString from 'lz-string';

import { WEEKDAY_STR } from '../constants';

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
const compressedEncode = wb => {
  return [...WEEKDAY_STR]
    .map(w =>
      wb[w]
        .map(b => [b.title, b.keyword, Number(b.isnew)].join('\x02'))
        .join('\x01'),
    )
    .join('\x00');
};

const compressedDecode = xwb => {
  return xwb
    .split('\x00')
    .map((xw, i) => {
      return {
        [WEEKDAY_STR[i]]: xw.split('\x01').map(b => {
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

const encodeWeeklyBangumiToStorage = wb => {
  return LZString.compressToBase64(compressedEncode(wb));
};

const decodeWeeklyBangumiFromStorage = xwb => {
  return compressedDecode(LZString.decompressFromBase64(xwb));
};

// exports

export const appendWeeklyBangumi = (state, weeklyBangumiPayload) => {
  for (const weekdayStr of WEEKDAY_STR) {
    if (!state.weeklyBangumi[weekdayStr]) {
      state.weeklyBangumi[weekdayStr] = [];
    }
    state.weeklyBangumi[weekdayStr].push(...weeklyBangumiPayload[weekdayStr]);
  }

  // FIXME: re-assign to trigger rendering
  state.weeklyBangumi = { ...state.weeklyBangumi };
};

export const appendFavoriteBangumi = (state, bangumi) => {
  state.favoriteBangumiList.push(bangumi);
};
export const removeFavoriteBangumi = (state, bangumiTitle) => {
  const indexFound = state.favoriteBangumiList.findIndex(
    b => b.title === bangumiTitle,
  );
  if (indexFound >= 0) {
    state.favoriteBangumiList.splice(indexFound, 1);
  }
};
export const saveFavorites = state => {
  const key = state.storageKey.favorite;
  localStorage.setItem(
    key,
    LZString.compressToBase64(JSON.stringify(state.favoriteBangumiList)),
  );
};
export const loadFavorites = state => {
  const key = state.storageKey.favorite;
  const fav = localStorage.getItem(key);
  if (fav) {
    state.favoriteBangumiList =
      JSON.parse(LZString.decompressFromBase64(fav)) || [];
  } else {
    state.favoriteBangumiList = [];
  }
};
export const saveWeeklyBangumi = state => {
  const key = state.storageKey.weekly;
  localStorage.setItem(key, encodeWeeklyBangumiToStorage(state.weeklyBangumi));
};
export const loadWeeklyBangumi = state => {
  const key = state.storageKey.weekly;
  const xwb = localStorage.getItem(key);
  if (xwb) {
    state.weeklyBangumi = decodeWeeklyBangumiFromStorage(xwb) || {};
  } else {
    state.weeklyBangumi = {};
  }
};

export default {
  appendWeeklyBangumi,
  appendFavoriteBangumi,
  removeFavoriteBangumi,
  saveFavorites,
  loadFavorites,
  saveWeeklyBangumi,
  loadWeeklyBangumi,
};
