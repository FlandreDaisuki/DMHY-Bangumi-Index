<template>
  <div>
    <header>
      <span>書籤索引</span>
      <span>將當前的搜索加入書籤，並自訂名稱</span>
    </header>
    <div class="favorite-area">
      <div class="favorite-pool">
        <a
          v-for="bangumi in favoriteBangumiList"
          :key="bangumi.title"
          :href="bangumi.keyword | keywordLink"
          role="button"
          class="bangumi"
        >{{ bangumi.title }}</a>
      </div>
      <div class="input-area">
        <input
          ref="userTitleInput"
          v-model="userInputStr"
          type="text"
          class="user-title-input"
          placeholder="為目前網址取名"
          @input="setValidity('')"
          @focus="setValidity('')"
        />
        <span class="tooltip">{{ validityMsg }}</span>
        <button class="add-btn" @click="addFavorite">
          加入
        </button>
        <button class="del-btn" @click="delFavorite">
          刪除
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  filters: {
    keywordLink(keyword) {
      return `/topics/list?keyword=${keyword}`;
    },
  },
  data() {
    return {
      userInputStr: '',
      validityMsg: '',
    };
  },
  computed: {
    favoriteBangumiList() {
      return this.$store.state.favoriteBangumiList;
    },
    utitle() {
      return this.userInputStr.trim();
    },
  },
  methods: {
    setValidity(msg) {
      this.validityMsg = msg;
      this.$refs.userTitleInput.setCustomValidity(this.validityMsg);
    },
    addFavorite() {
      if (!this.utitle) {
        this.setValidity('名稱欄為空');
        return;
      }
      const found = this.favoriteBangumiList.find((b) => b.title === this.utitle);
      if (found) {
        this.setValidity('書籤名稱已存在');
        return;
      }

      const keyword = new URL(location).searchParams.get('keyword');
      this.$store.dispatch('appendFavoriteBangumi', {
        title: this.utitle,
        keyword,
      });
    },
    delFavorite() {
      if (!this.utitle) {
        this.setValidity('名稱欄為空');
        return;
      }
      const found = this.favoriteBangumiList.find((b) => b.title === this.utitle);
      if (!found) {
        this.setValidity('書籤名稱不存在');
        return;
      }

      this.$store.dispatch('removeFavoriteBangumi', this.utitle);
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
}
.bangumi {
  border: 1px solid #ffa500;
  padding: 2px;
  margin: 1px 3px;
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
