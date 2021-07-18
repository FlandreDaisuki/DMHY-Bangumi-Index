import { ref } from 'vue';

const STORAGE_KEY = 'DMHY-Bangumi-Index::expansion';

const expansion = ref(Boolean(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'false')));

export const get = () => expansion.value;

export const set = (v) => {
  expansion.value = Boolean(v);
  localStorage.setItem(STORAGE_KEY, expansion.value);
};
