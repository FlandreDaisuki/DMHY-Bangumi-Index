// put constant as front as possible
import './constants';

import { createApp } from 'vue';

import { $, $$ } from './utils';
import MainComp from './components/Main.vue';

// pre-process

const adSelectors = [
  '.ad',
  '[id="1280_ad"] > a',
  '.main > div:first-child',
].join(',');
for (const adEl of $$(adSelectors)) {
  adEl.remove();
}

// entry point

const app = createApp(MainComp)
  .mount($('#mini_jmd').parentElement);

unsafeWindow.DMHYBangumiIndex$app = app;
