<script>
import { computed, onMounted, ref } from 'vue';
import * as favorite from '../store/favorite';
import * as weeklyBangumi from '../store/weeklyBangumi';
import PageWeekly from './PageWeekly.vue';
import PageFavorite from './PageFavorite.vue';

const TAB_NAMES = Object.freeze({
  WEEKLY: 'weekly',
  FAVORITE: 'favorite',
});

export default {
  components: {
    PageFavorite,
    PageWeekly,
  },
  setup() {
    const tab = ref(TAB_NAMES.WEEKLY);

    onMounted(() => {
      favorite.load();
      favorite.save();
      weeklyBangumi.loadWithCache();
    });

    return {
      TAB_NAMES,

      setTab: (tabName) => {
        tab.value = tabName;
      },
      shouldShowWeeklyTab: computed(() => {
        return tab.value === TAB_NAMES.WEEKLY;
      }),
      shouldShowFavoriteTab: computed(() => {
        return tab.value === TAB_NAMES.FAVORITE;
      }),
    };
  },
};
</script>

<template>
  <div id="🌐">
    <nav>
      <button
        type="button"
        :class="{ 'active-tab': shouldShowWeeklyTab }"
        @click="setTab(TAB_NAMES.WEEKLY)"
      >
        新番索引
      </button>
      <button
        type="button"
        :class="{ 'active-tab': shouldShowFavoriteTab }"
        @click="setTab(TAB_NAMES.FAVORITE)"
      >
        書籤索引
      </button>
    </nav>
    <PageWeekly v-show="shouldShowWeeklyTab" />
    <PageFavorite v-show="shouldShowFavoriteTab" />
  </div>
</template>

<style scoped>
#🌐 {
  margin-top: 20px;
  font-size: 14px;
}
button {
  font-size: 1rem;
  color: black;
  text-decoration: none;
}
nav > button {
  display: inline-block;
  padding: 4px 16px;
  background: #fff;
  cursor: pointer;
  border-width: 1px 1px 0 1px;
  border-style: solid;
  border-color: #247;
  border-radius: 4px 4px 0 0;
}
nav > button.active-tab {
  border-top: 3px solid dodgerblue;
}
.page-view {
  border: 1px solid #247;
}
</style>
