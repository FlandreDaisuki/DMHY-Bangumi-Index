import Vue from 'vue';
import Vuex from 'vuex';

import mutations from './store/mutations';
import actions from './store/actions';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    weeklyBangumi: {},
    favoriteBangumiList: [],
    storageKey: {
      favorite: 'DMHY-Bangumi-Index::favorite',
      weekly: 'DMHY-Bangumi-Index::weekly-bangumi',
      cacheT: 'DMHY-Bangumi-Index::weekly-bangumi-cache-t',
      expansion: 'DMHY-Bangumi-Index::expansion',
    },
  },
  mutations,
  actions,
});
