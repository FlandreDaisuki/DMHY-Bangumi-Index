import { ref } from 'vue';
import { compressToBase64, decompressFromBase64 } from 'lz-string';

const STORAGE_KEY = 'DMHY-Bangumi-Index::favorite';
export const favorites = ref([]);

export const load = () => {
  const fav = localStorage.getItem(STORAGE_KEY);
  if (!fav) { favorites.value = []; }
  try {
    favorites.value = JSON.parse(decompressFromBase64(fav));
  } catch {
    favorites.value = [];
  }
};

export const save = () => {
  localStorage.setItem(
    STORAGE_KEY,
    compressToBase64(JSON.stringify(favorites.value)),
  );
};

export const find = (title) => {
  const foundIndex = favorites.value.findIndex((fav) => fav.title === title);
  return {
    found: (foundIndex >= 0) ? favorites.value[foundIndex] : null,
    foundIndex,
  };
};

/** @type {(title: string) => void */
export const add = (title) => {
  const keyword = new URL(location).searchParams.get('keyword');
  favorites.value.push({ title, keyword });
  save();
};

/** @type {(title: string) => void */
export const remove = (title) => {
  const { found, foundIndex } = find(title);
  if (found) {
    favorites.value.splice(foundIndex, 1);
  }
  save();
};
