<script>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import * as favorite from '../store/favorite';
import * as weeklyBangumi from '../store/weeklyBangumi';

export default {
  setup() {
    const router = useRouter();
    onMounted(() => {
      router.push('/weekly');
      favorite.load();
      favorite.save();
      weeklyBangumi.loadWithCache();
    });
  },
};
</script>

<template>
  <div id="🌐">
    <nav>
      <router-link to="/weekly">
        新番索引
      </router-link>
      <router-link to="/favorite">
        書籤索引
      </router-link>
    </nav>
    <router-view class="page-view" />
  </div>
</template>

<style scoped>
#🌐 {
  margin-top: 20px;
  font-size: 14px;
}
a {
  color: black;
  text-decoration: none;
}
nav > a {
  display: inline-block;
  padding: 3px 15px;
  background: #fff;
  cursor: pointer;
  border-top: 1px solid #247;
  border-left: 1px solid #247;
  border-right: 1px solid #247;
  border-radius: 5px 5px 0 0;
}
nav > a.router-link-exact-active {
  border-top: 3px solid dodgerblue;
}
.page-view {
  border: 1px solid #247;
}
</style>
