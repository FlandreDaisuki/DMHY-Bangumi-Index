<template>
  <div>
    <header>
      <span>新番資源索引</span>
      <span>{{ todayStr }}</span>
      <span>
        <a href="javascript:;" role="button" @click="invExpansion">{{
          expansion ? "收起" : "展開"
        }}</a>
      </span>
      <span>
        <a href="javascript:;" role="button" @click="forceUpdateWeekly">強制更新</a>
      </span>
    </header>
    <table class="weekly-table">
      <tr
        v-for="([weekday, dayBangumiList], index) in orderedWeeklyBangumi"
        v-show="expansion ? true : index < 4"
        :key="weekday"
        class="weekly-tr"
        :class="{ 'weekly-tr-today': index === 2 }"
      >
        <td class="weekly-weekday-str">
          {{ weekday | longerWeekdayStr }}
        </td>
        <td>
          <a
            v-for="bangumi in dayBangumiList"
            :key="bangumi.title"
            class="bangumi"
            :href="bangumi.keyword | keywordLink"
            :class="{ 'bangumi-old': !bangumi.isnew }"
          >{{ bangumi.title }}</a>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { WEEKDAY_STR } from '../constants';

export default {
  filters: {
    keywordLink(keyword) {
      return `/topics/list?keyword=${keyword}`;
    },
    longerWeekdayStr(weekdayStr) {
      switch (weekdayStr) {
      case '日':
        return '星期日（日）';
      case '一':
        return '星期一（月）';
      case '二':
        return '星期二（火）';
      case '三':
        return '星期三（水）';
      case '四':
        return '星期四（木）';
      case '五':
        return '星期五（金）';
      case '六':
        return '星期六（土）';
      }
    },
  },
  data() {
    const now = Date.now();
    return {
      now,
      date: new Date(now),
      todayWeekday: new Date(now).getDay(),
      expansion: false,
    };
  },
  computed: {
    todayStr() {
      const longWeekdayStr = new Intl.DateTimeFormat('zh', {
        weekday: 'long',
      }).format(this.date);

      const dateStr = new Intl.DateTimeFormat('zh', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(this.date);

      return `西元 ${dateStr} ${longWeekdayStr}`;
    },
    orderedWeeklyBangumi() {
      const TODAY_SENSITIVE_WEEKDAY_STR = WEEKDAY_STR.repeat(3).slice(
        this.todayWeekday + 5,
        this.todayWeekday + 12
      );

      const weeklyBangumi = this.$store.state.weeklyBangumi;
      const keyedWeeklyBangumi = [...TODAY_SENSITIVE_WEEKDAY_STR].reduce(
        (collection, weekdayStr) => {
          return collection.set(weekdayStr, weeklyBangumi[weekdayStr]);
        },
        new Map()
      );
      return [...keyedWeeklyBangumi.entries()];
    },
  },
  methods: {
    invExpansion() {
      this.expansion = !this.expansion;
    },
    forceUpdateWeekly() {
      const cacheKey = this.$store.state.storageKey.cacheT;
      localStorage.setItem(cacheKey, 0);
      location.assign('https://share.dmhy.org/');
    },
  },
};
</script>

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
}
.bangumi-old {
  border: 1px solid #002fff;
}
</style>
