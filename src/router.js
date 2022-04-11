import { createRouter, createWebHashHistory } from 'vue-router';
import PageFavoriteComp from './components/PageFavorite.vue';
import PageWeeklyComp from './components/PageWeekly.vue';


const routes = [
  { path: '/weekly', component: PageWeeklyComp },
  { path: '/favorite', component: PageFavoriteComp },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
