<script>
import { computed } from 'vue';
import { WEEKDAY_STR } from '../constants';
import { createKeywordLink, transformWeekday } from '../utils';
import * as expansion from '../store/expansion';
import { cleanCacheTime, weeklyBangumi } from '../store/weeklyBangumi';

export default {
  setup() {
    const date = new Date();
    const todayWeekday = date.getDay();
    const toggleExpansion = () => expansion.set(!expansion.get());

    const expansionStr = computed(() => expansion.get() ? '收起' : '展開');
    const todayStr = computed(() => {
      const longWeekdayStr = new Intl.DateTimeFormat('zh', {
        weekday: 'long',
      }).format(date);

      const dateStr = new Intl.DateTimeFormat('zh', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(date);

      return `西元 ${dateStr} ${longWeekdayStr}`;
    });

    const TODAY_SENSITIVE_WEEKDAY_STR = WEEKDAY_STR.repeat(3)
      .slice(todayWeekday + 5, todayWeekday + 12);

    const orderedWeeklyBangumi = computed(() => {
      const weeklyBangumiMap = [...TODAY_SENSITIVE_WEEKDAY_STR].reduce(
        (collection, weekdayStr) => {
          return collection.set(weekdayStr, weeklyBangumi.value[weekdayStr]);
        },
        new Map(),
      );
      return [...weeklyBangumiMap.entries()];
    });

    const forceUpdateWeekly = async () => {
      cleanCacheTime();
      location.assign('https://share.dmhy.org/');
    };

    const isIndexShow = (index) => expansion.get() ? true : index < 4;

    return {
      todayStr,
      expansionStr,
      orderedWeeklyBangumi,

      toggleExpansion,
      createKeywordLink,
      transformWeekday,
      isIndexShow,
      forceUpdateWeekly,
    };
  },
};
</script>

<template>
  <div>
    <header>
      <span>新番資源索引</span>
      <span>{{ todayStr }}</span>
      <span>
        <a href="javascript:;" role="button" @click="toggleExpansion">{{ expansionStr }}</a>
      </span>
      <span>
        <a href="javascript:;" role="button" @click="forceUpdateWeekly">強制更新</a>
      </span>
    </header>
    <table class="weekly-table">
      <tr
        v-for="([weekday, dayBangumiList], index) in orderedWeeklyBangumi"
        v-show="isIndexShow(index)"
        :key="weekday"
        class="weekly-tr"
        :class="{ 'weekly-tr-today': index === 2 }"
      >
        <td class="weekly-weekday-str">
          {{ transformWeekday(weekday) }}
        </td>
        <td>
          <a
            v-for="bangumi in dayBangumiList"
            :key="bangumi.title"
            class="bangumi"
            :href="createKeywordLink(bangumi.keyword)"
            :class="{ 'bangumi-old': !bangumi.isnew }"
          >{{ bangumi.title }}</a>
        </td>
      </tr>
    </table>
  </div>
</template>

<style scoped>
a {
  color: #247;
  text-decoration: none;
}
header {
  color: #fff;
  background-color: #247;
  padding: 5px;
  display: flex;
  font-size: 0.8rem;
}
header > span:nth-of-type(n + 2)::before {
  content: "::";
  padding: 0 8px;
}
header > span > a {
  color: #fff;
}
.weekly-table {
  border-collapse: collapse;
  width: 100%;
}
.weekly-tr {
  display: flex;
  align-items: center;
  border: 2px solid white;
  background: white;
}
.weekly-tr.weekly-tr-today {
  background-color: #ff9;
}
.weekly-weekday-str {
  padding: 3px 15px;
  margin-right: 3px;
  background-color: #7e99be;
  color: white;
  font-weight: bolder;
}
.weekly-weekday-str + td {
  display: flex;
  flex-flow: row wrap;
  flex: 1;
}
.bangumi {
  border: 1px solid #ffa500;
  padding: 2px;
  margin: 1px 3px;
  display: inline-flex;
  align-items: center;
}
.bangumi-old {
  border: 1px solid #002fff;
}
</style>
