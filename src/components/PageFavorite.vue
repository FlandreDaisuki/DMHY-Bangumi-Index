<script>
import { computed, ref } from 'vue';
import { createKeywordLink } from '../utils';
import { add, favorites, find, remove } from '../store/favorite';

export default {
  setup() {
    const userInputStr = ref('');
    const validityMsg = ref('');
    const title = computed(() => userInputStr.value.trim());
    const titleInputEl = ref();

    const setValidity = (msg) => {
      validityMsg.value = msg;
      titleInputEl.value.setCustomValidity(msg);
    };
    const onClickAdd = () => {
      if (!title.value) { return setValidity('名稱欄為空'); }
      if (find(title.value).found) { return setValidity('書籤名稱已存在'); }
      add(title.value);
    };
    const onClickRemove = () => {
      if (!title.value) { return setValidity('名稱欄為空'); }
      if (!find(title.value).found) { return setValidity('書籤名稱不存在'); }
      remove(title.value);
    };

    return {
      userInputStr,
      favorites,
      validityMsg,
      titleInputEl,
      createKeywordLink,
      setValidity,
      onClickAdd,
      onClickRemove,
    };
  },
};
</script>

<template>
  <div>
    <header>
      <span>書籤索引</span>
      <span>將當前的搜索加入書籤，並自訂名稱</span>
    </header>
    <div class="favorite-area">
      <div class="favorite-pool">
        <a
          v-for="bangumi in favorites"
          :key="bangumi.title"
          :href="createKeywordLink(bangumi.keyword)"
          role="button"
          class="bangumi"
        >{{ bangumi.title }}</a>
      </div>
      <div class="input-area">
        <input
          ref="titleInputEl"
          v-model="userInputStr"
          type="text"
          class="user-title-input"
          placeholder="為目前網址取名"
          @input="setValidity('')"
          @focus="setValidity('')"
        >
        <span class="tooltip">{{ validityMsg }}</span>
        <button class="add-btn" @click="onClickAdd">
          加入
        </button>
        <button class="del-btn" @click="onClickRemove">
          刪除
        </button>
      </div>
    </div>
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
  content: '::';
  padding: 0 8px;
}
header > span > a {
  color: #fff;
}
.favorite-area {
  background-color: #fff;
}
.favorite-pool {
  padding: 10px;
  min-height: 14px;
  display: flex;
}
.bangumi {
  border: 1px solid #ffa500;
  padding: 2px;
  margin: 1px 3px;
  display: inline-flex;
  align-items: center;
}
.input-area {
  display: flex;
  justify-content: center;
  padding: 4px;
  border-top: 1px dotted #247;
}
.input-area > * {
  margin: 0 15px;
}
.input-area > .user-title-input {
  border: 1px solid #247;
  padding: 0 7px;
  border-radius: 5px;
  font-size: 14px;
}
.tooltip {
  position: absolute;
  background-color: #000;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  transform-origin: bottom center;
  transform: translateY(-35px);
  display: none;
}
.tooltip::after {
  content: '';
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid black;
  position: absolute;
  top: 100%;
  right: 20%;
}
.user-title-input:invalid + .tooltip {
  display: block;
}
.input-area > button {
  border: none;
  border-radius: 5px;
  padding: 5px 21px;
  font-size: 14px;
}
.input-area > button.add-btn {
  background-color: lightgreen;
}
.input-area > button.del-btn {
  background-color: crimson;
  color: white;
}
</style>
