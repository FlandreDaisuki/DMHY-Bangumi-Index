import LZString from 'lz-string';

import { WEEKDAY_STR } from '../constants';

/**
 * wb := weeklyBangumi
 * {
 *   日: [
 *     {title, keyword, newold},
 *     {title, keyword, newold},...
 *   ],
 *   一: [],
 *   ...
 * }
 * → xwb := [...W].join('\0'); # ordered by WEEKDAY_STR #
 * → W := [...B].join('\1')
 * → B := [T, K, N].join('\2')
 * → N := new: 1; old: 0;
 */
const compressedEncode = wb => {
  return [...WEEKDAY_STR]
    .map(w =>
      wb[w]
        .map(b => [b.title, b.keyword, Number(b.newold === 'new')].join('\x02'))
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
          const [title, keyword, newold] = b.split('\x02');
          return {
            title,
            keyword,
            newold: Number(newold) ? 'new' : 'old',
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
  state.favoriteBangumiList =
    JSON.parse(LZString.decompressFromBase64(localStorage.getItem(key))) || [];
};
export const saveWeeklyBangumi = state => {
  const key = state.storageKey.weekly;
  localStorage.setItem(key, encodeWeeklyBangumiToStorage(state.weeklyBangumi));
};
export const loadWeeklyBangumi = state => {
  const key = state.storageKey.weekly;
  state.weeklyBangumi =
    decodeWeeklyBangumiFromStorage(localStorage.getItem(key)) || {};
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
