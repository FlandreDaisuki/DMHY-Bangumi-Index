import Vue from 'vue';
import VueRouter from 'vue-router';

import PageFavoriteComp from './components/PageFavorite.vue';
import PageWeeklyComp from './components/PageWeekly.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/weekly', component: PageWeeklyComp },
  { path: '/favorite', component: PageFavoriteComp },
];

export default new VueRouter({
  routes,
});
