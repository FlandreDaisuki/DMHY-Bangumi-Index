import Vue from 'vue';

import store from './store';
import router from './router';

import MainComp from './components/Main.vue';

import { A_DAY_MS } from './constants';

// pre-process

const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

const adSelectors = [
  '.ad',
  '[id="1280_ad"] > a',
  '.main > div:first-child',
].join(',');
for (const adEl of $$(adSelectors)) {
  adEl.remove();
}

// entry point

const vm = new Vue({
  el: $('#mini_jmd') ? $('#mini_jmd').parentElement : $('#mini_jmd'),
  store,
  router,
  mounted() {
    this.$router.push('/weekly');
    this.$store.commit('loadFavorites');
    this.$store.commit('saveFavorites');
    this.loadCachedWeeklyBangumi();
  },
  methods: {
    loadCachedWeeklyBangumi() {
      const cacheKey = this.$store.state.storageKey.cacheT;
      const cacheT = Number(localStorage.getItem(cacheKey)) || 0;
      const maxCacheTime = A_DAY_MS / 2; // 12hr in milliseconds

      if (Date.now() - cacheT > maxCacheTime) {
        this.$store.dispatch('downloadWeeklyBangumi');
        localStorage.setItem(cacheKey, Date.now());
      } else {
        this.$store.commit('loadWeeklyBangumi');
      }
    },
  },
  render(h) {
    return h(MainComp);
  },
});

unsafeWindow.DMHYBangumiIndex$vm = vm;
