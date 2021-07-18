import PageFavoriteComp from './components/PageFavorite.vue';
import PageWeeklyComp from './components/PageWeekly.vue';

import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  { path: '/weekly', component: PageWeeklyComp },
  { path: '/favorite', component: PageFavoriteComp },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
