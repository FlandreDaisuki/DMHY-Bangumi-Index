import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import jsyaml from 'js-yaml';
import LZString from 'lz-string';

import MainComp from './components/Main.vue';
import PageFavoriteComp from './components/PageFavorite.vue';
import PageWeeklyComp from './components/PageWeekly.vue';

// pre-process
const $$ = s => Array.from(document.querySelectorAll(s));

for (const adEl of $$('[id*="1280"]')) {
  adEl.remove();
}

const routes = [
  { path: '/weekly', component: PageWeeklyComp },
  { path: '/favorite', component: PageFavoriteComp },
];

const fetcher = async (url, options = {}) => {
  const defaultOptions = {
    method: 'GET',
  };
  const opt = Object.assign({}, defaultOptions, options);
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      ...opt,
      url,
      onload: res => {
        console.log(res);
        resolve(res.responseText);
      },
      onerror: err => {
        console.error(err);
        reject(err);
      },
    });
  });
};

const downloadBangumi = async newold => {
  const txt = await fetcher(
    `https://flandredaisuki.github.io/DMHY-Bangumi-Index/${newold}.yaml`,
  );

  const data = jsyaml.safeLoad(txt);
  const payloadList = [];
  for (const weekdayStr of store.state.const.WEEKDAY_STR) {
    const payload = {
      weekdayStr,
      bangumiList: [],
    };
    for (const [title, keyword] of Object.entries(data[weekdayStr])) {
      payload.bangumiList.push({
        title,
        keyword,
        newold,
      });
    }
    payloadList.push(payload);
  }
  return payloadList;
};

// entry point

Vue.use(Vuex);
Vue.use(VueRouter);

const store = new Vuex.Store({
  state: {
    weeklyBangumi: {},
    favoriteBangumiList: [],
    const: {
      WEEKDAY_STR: '日一二三四五六',
    },
  },
  mutations: {
    appendWeeklyBangumi(state, { weekdayStr, bangumiList }) {
      if (!state.weeklyBangumi[weekdayStr]) {
        state.weeklyBangumi[weekdayStr] = [];
      }
      state.weeklyBangumi[weekdayStr].push(...bangumiList);

      // re-assign to trigger rendering
      state.weeklyBangumi = Object.assign({}, state.weeklyBangumi);
    },
    appendFavoriteBangumi(state, bangumi) {
      state.favoriteBangumiList.push(bangumi);
    },
    removeFavoriteBangumi(state, bangumiTitle) {
      const indexFound = state.favoriteBangumiList.findIndex(
        b => b.title === bangumiTitle,
      );
      if (indexFound >= 0) {
        state.favoriteBangumiList.splice(indexFound, 1);
      }
    },
    saveFavorites(state) {
      const key = 'DMHY-Bangumi-Index::favorite';
      localStorage.setItem(
        key,
        LZString.compressToBase64(JSON.stringify(state.favoriteBangumiList)),
      );
    },
    loadFavorites(state) {
      const key = 'DMHY-Bangumi-Index::favorite';
      state.favoriteBangumiList =
        JSON.parse(LZString.decompressFromBase64(localStorage.getItem(key))) ||
        [];
    },
    saveWeeklyBangumi(state) {
      const key = 'DMHY-Bangumi-Index::weekly-bangumi';
      localStorage.setItem(
        key,
        LZString.compressToBase64(JSON.stringify(state.weeklyBangumi)),
      );
    },
    loadWeeklyBangumi(state) {
      const key = 'DMHY-Bangumi-Index::weekly-bangumi';
      state.weeklyBangumi = JSON.parse(
        LZString.decompressFromBase64(localStorage.getItem(key)) || '{}',
      );
    },
  },
  actions: {
    async downloadWeeklyBangumi({ commit }) {
      const oldPayloadList = await downloadBangumi('old');
      for (const payload of oldPayloadList) {
        commit('appendWeeklyBangumi', payload);
      }
      const newPayloadList = await downloadBangumi('new');
      for (const payload of newPayloadList) {
        commit('appendWeeklyBangumi', payload);
      }
      commit('saveWeeklyBangumi');
    },
    appendFavoriteBangumi({ commit }, bangumi) {
      commit('appendFavoriteBangumi', bangumi);
      commit('saveFavorites');
    },
    removeFavoriteBangumi({ commit }, bangumiTitle) {
      commit('removeFavoriteBangumi', bangumiTitle);
      commit('saveFavorites');
    },
  },
});

const router = new VueRouter({
  routes,
});

window.vm = new Vue({
  el: $$('div.main > div')[0],
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
      const cacheKey = 'DMHY-Bangumi-Index::weekly-bangumi-cache-t';
      const cacheT = Number(localStorage.getItem(cacheKey)) || 0;
      const maxCacheTime = 86400 * 1000 * 0.5; // ms of half day

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

// window.vm.$mount($$('div.main > div')[0]);
// processBangumi('old').then(() => processBangumi('new'));
