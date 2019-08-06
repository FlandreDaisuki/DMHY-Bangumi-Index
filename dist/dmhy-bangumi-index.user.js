// ==UserScript==
// @name       DMHY Bangumi Index
// @name:zh-TW 動漫花園新番索引
// @description       Let DMHY header index back!
// @description:zh-TW 把動漫花園上方的索引弄回來
// @namespace https://github.com/FlandreDaisuki
// @author    FlandreDaisuki
// @match     https://share.dmhy.org/
// @match     https://share.dmhy.org/topics/*
// @require   https://unpkg.com/vue@2.6.10/dist/vue.min.js
// @require   https://unpkg.com/vuex@3.1.1/dist/vuex.min.js
// @require   https://unpkg.com/vue-router@3.0.7/dist/vue-router.min.js
// @require   https://unpkg.com/js-yaml@3.13.1/dist/js-yaml.min.js
// @require   https://unpkg.com/lz-string@1.4.4/libs/lz-string.min.js
// @connect   flandredaisuki.github.io
// @license   MIT
// @noframes
// @version   1.0.4
// @grant     GM_xmlhttpRequest
// ==/UserScript==

(function (Vue, Vuex, VueRouter, jsyaml, LZString) {
  'use strict';

  Vue = Vue && Vue.hasOwnProperty('default') ? Vue['default'] : Vue;
  Vuex = Vuex && Vuex.hasOwnProperty('default') ? Vuex['default'] : Vuex;
  VueRouter = VueRouter && VueRouter.hasOwnProperty('default') ? VueRouter['default'] : VueRouter;
  jsyaml = jsyaml && jsyaml.hasOwnProperty('default') ? jsyaml['default'] : jsyaml;
  LZString = LZString && LZString.hasOwnProperty('default') ? LZString['default'] : LZString;

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

  var script = {};

  function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
  /* server only */
  , shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
      createInjectorSSR = createInjector;
      createInjector = shadowMode;
      shadowMode = false;
    } // Vue.extend constructor export interop.


    var options = typeof script === 'function' ? script.options : script; // render functions

    if (template && template.render) {
      options.render = template.render;
      options.staticRenderFns = template.staticRenderFns;
      options._compiled = true; // functional template

      if (isFunctionalTemplate) {
        options.functional = true;
      }
    } // scopedId


    if (scopeId) {
      options._scopeId = scopeId;
    }

    var hook;

    if (moduleIdentifier) {
      // server build
      hook = function hook(context) {
        // 2.3 injection
        context = context || // cached call
        this.$vnode && this.$vnode.ssrContext || // stateful
        this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
        // 2.2 with runInNewContext: true

        if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
          context = __VUE_SSR_CONTEXT__;
        } // inject component styles


        if (style) {
          style.call(this, createInjectorSSR(context));
        } // register component module identifier for async chunk inference


        if (context && context._registeredComponents) {
          context._registeredComponents.add(moduleIdentifier);
        }
      }; // used by ssr in case component is cached and beforeCreate
      // never gets called


      options._ssrRegister = hook;
    } else if (style) {
      hook = shadowMode ? function () {
        style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
      } : function (context) {
        style.call(this, createInjector(context));
      };
    }

    if (hook) {
      if (options.functional) {
        // register for functional component in vue file
        var originalRender = options.render;

        options.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        // inject component registration as beforeCreate hook
        var existing = options.beforeCreate;
        options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }

    return script;
  }

  var normalizeComponent_1 = normalizeComponent;

  var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  function createInjector(context) {
    return function (id, style) {
      return addStyle(id, style);
    };
  }
  var HEAD;
  var styles = {};

  function addStyle(id, css) {
    var group = isOldIE ? css.media || 'default' : id;
    var style = styles[group] || (styles[group] = {
      ids: new Set(),
      styles: []
    });

    if (!style.ids.has(id)) {
      style.ids.add(id);
      var code = css.source;

      if (css.map) {
        // https://developer.chrome.com/devtools/docs/javascript-debugging
        // this makes source maps inside style tags work properly in Chrome
        code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

        code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
      }

      if (!style.element) {
        style.element = document.createElement('style');
        style.element.type = 'text/css';
        if (css.media) style.element.setAttribute('media', css.media);

        if (HEAD === undefined) {
          HEAD = document.head || document.getElementsByTagName('head')[0];
        }

        HEAD.appendChild(style.element);
      }

      if ('styleSheet' in style.element) {
        style.styles.push(code);
        style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
      } else {
        var index = style.ids.size - 1;
        var textNode = document.createTextNode(code);
        var nodes = style.element.childNodes;
        if (nodes[index]) style.element.removeChild(nodes[index]);
        if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
      }
    }
  }

  var browser = createInjector;

  /* script */
  const __vue_script__ = script;

  /* template */
  var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"🌐"}},[_c('nav',[_c('router-link',{attrs:{"to":"/weekly"}},[_vm._v("新番索引")]),_vm._v(" "),_c('router-link',{attrs:{"to":"/favorite"}},[_vm._v("書籤索引")])],1),_vm._v(" "),_c('router-view',{staticClass:"page-view"})],1)};
  var __vue_staticRenderFns__ = [];

    /* style */
    const __vue_inject_styles__ = function (inject) {
      if (!inject) return
      inject("data-v-6d304cfc_0", { source: "#🌐[data-v-6d304cfc]{margin-top:20px;font-size:14px}a[data-v-6d304cfc]{color:#000;text-decoration:none}nav>a[data-v-6d304cfc]{display:inline-block;padding:3px 15px;background:#fff;cursor:pointer;border-top:1px solid #247;border-left:1px solid #247;border-right:1px solid #247;border-radius:5px 5px 0 0}nav>a.router-link-exact-active[data-v-6d304cfc]{border-top:3px solid #1e90ff}.page-view[data-v-6d304cfc]{border:1px solid #247}", map: undefined, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__ = "data-v-6d304cfc";
    /* module identifier */
    const __vue_module_identifier__ = undefined;
    /* functional template */
    const __vue_is_functional_template__ = false;
    /* style inject SSR */
    

    
    var MainComp = normalizeComponent_1(
      { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
      __vue_inject_styles__,
      __vue_script__,
      __vue_scope_id__,
      __vue_is_functional_template__,
      __vue_module_identifier__,
      browser,
      undefined
    );

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

  var script$1 = {
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
        const found = this.favoriteBangumiList.find(b => b.title === this.utitle);
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
        const found = this.favoriteBangumiList.find(b => b.title === this.utitle);
        if (!found) {
          this.setValidity('書籤名稱不存在');
          return;
        }

        this.$store.dispatch('removeFavoriteBangumi', this.utitle);
      },
    },
  };

  /* script */
  const __vue_script__$1 = script$1;

  /* template */
  var __vue_render__$1 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_vm._m(0),_vm._v(" "),_c('div',{staticClass:"favorite-area"},[_c('div',{staticClass:"favorite-pool"},_vm._l((_vm.favoriteBangumiList),function(bangumi){return _c('a',{key:bangumi.title,staticClass:"bangumi",attrs:{"href":_vm._f("keywordLink")(bangumi.keyword),"role":"button"}},[_vm._v(_vm._s(bangumi.title))])}),0),_vm._v(" "),_c('div',{staticClass:"input-area"},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.userInputStr),expression:"userInputStr"}],ref:"userTitleInput",staticClass:"user-title-input",attrs:{"type":"text","placeholder":"為目前網址取名"},domProps:{"value":(_vm.userInputStr)},on:{"input":[function($event){if($event.target.composing){ return; }_vm.userInputStr=$event.target.value;},function($event){return _vm.setValidity('')}],"focus":function($event){return _vm.setValidity('')}}}),_vm._v(" "),_c('span',{staticClass:"tooltip"},[_vm._v(_vm._s(_vm.validityMsg))]),_vm._v(" "),_c('button',{staticClass:"add-btn",on:{"click":_vm.addFavorite}},[_vm._v("加入")]),_vm._v(" "),_c('button',{staticClass:"del-btn",on:{"click":_vm.delFavorite}},[_vm._v("刪除")])])])])};
  var __vue_staticRenderFns__$1 = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('header',[_c('span',[_vm._v("書籤索引")]),_vm._v(" "),_c('span',[_vm._v("將當前的搜索加入書籤，並自訂名稱")])])}];

    /* style */
    const __vue_inject_styles__$1 = function (inject) {
      if (!inject) return
      inject("data-v-27ecab8b_0", { source: "a[data-v-27ecab8b]{color:#247;text-decoration:none}header[data-v-27ecab8b]{color:#fff;background-color:#247;padding:5px;display:flex;font-size:.8rem}header>span[data-v-27ecab8b]:nth-of-type(n+2)::before{content:'::';padding:0 8px}header>span>a[data-v-27ecab8b]{color:#fff}.favorite-area[data-v-27ecab8b]{background-color:#fff}.favorite-pool[data-v-27ecab8b]{padding:10px;min-height:14px}.bangumi[data-v-27ecab8b]{border:1px solid orange;padding:2px;margin:1px 3px}.input-area[data-v-27ecab8b]{display:flex;justify-content:center;padding:4px;border-top:1px dotted #247}.input-area>*[data-v-27ecab8b]{margin:0 15px}.input-area>.user-title-input[data-v-27ecab8b]{border:1px solid #247;padding:0 7px;border-radius:5px;font-size:14px}.tooltip[data-v-27ecab8b]{position:absolute;background-color:#000;color:#fff;padding:5px 10px;border-radius:5px;transform-origin:bottom center;transform:translateY(-35px);display:none}.tooltip[data-v-27ecab8b]::after{content:'';width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:5px solid #000;position:absolute;top:100%;right:20%}.user-title-input:invalid+.tooltip[data-v-27ecab8b]{display:block}.input-area>button[data-v-27ecab8b]{border:none;border-radius:5px;padding:5px 21px;font-size:14px}.input-area>button.add-btn[data-v-27ecab8b]{background-color:#90ee90}.input-area>button.del-btn[data-v-27ecab8b]{background-color:#dc143c;color:#fff}", map: undefined, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$1 = "data-v-27ecab8b";
    /* module identifier */
    const __vue_module_identifier__$1 = undefined;
    /* functional template */
    const __vue_is_functional_template__$1 = false;
    /* style inject SSR */
    

    
    var PageFavoriteComp = normalizeComponent_1(
      { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
      __vue_inject_styles__$1,
      __vue_script__$1,
      __vue_scope_id__$1,
      __vue_is_functional_template__$1,
      __vue_module_identifier__$1,
      browser,
      undefined
    );

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

  var script$2 = {
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
        const WEEKDAY_STR = this.$store.state.const.WEEKDAY_STR;
        const TODAY_SENSITIVE_WEEKDAY_STR = WEEKDAY_STR.repeat(3).slice(
          this.todayWeekday + 5,
          this.todayWeekday + 12,
        );

        const weeklyBangumi = this.$store.state.weeklyBangumi;
        const keyedWeeklyBangumi = [...TODAY_SENSITIVE_WEEKDAY_STR].reduce(
          (collection, weekdayStr) => {
            return collection.set(weekdayStr, weeklyBangumi[weekdayStr]);
          },
          new Map(),
        );
        return [...keyedWeeklyBangumi.entries()];
      },
    },
    methods: {
      invExpansion() {
        this.expansion = !this.expansion;
      },
      forceUpdateWeekly() {
        localStorage.setItem('DMHY-Bangumi-Index::weekly-bangumi-cache-t', 0);
        location.assign('https://share.dmhy.org/');
      },
    },
  };

  /* script */
  const __vue_script__$2 = script$2;

  /* template */
  var __vue_render__$2 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('header',[_c('span',[_vm._v("新番資源索引")]),_vm._v(" "),_c('span',[_vm._v(_vm._s(_vm.todayStr))]),_vm._v(" "),_c('span',[_c('a',{attrs:{"href":"javascript:;","role":"button"},on:{"click":_vm.invExpansion}},[_vm._v(_vm._s(_vm.expansion ? '收起' : '展開'))])]),_vm._v(" "),_c('span',[_c('a',{attrs:{"href":"javascript:;","role":"button"},on:{"click":_vm.forceUpdateWeekly}},[_vm._v("強制更新")])])]),_vm._v(" "),_c('table',{staticClass:"weekly-table"},_vm._l((_vm.orderedWeeklyBangumi),function(ref,index){
  var weekday = ref[0];
  var dayBangumiList = ref[1];
  return _c('tr',{directives:[{name:"show",rawName:"v-show",value:(_vm.expansion ? true : index < 4),expression:"expansion ? true : index < 4"}],key:weekday,staticClass:"weekly-tr",class:{ 'weekly-tr-today': index === 2 }},[_c('td',{staticClass:"weekly-weekday-str"},[_vm._v(_vm._s(_vm._f("longerWeekdayStr")(weekday)))]),_vm._v(" "),_c('td',_vm._l((dayBangumiList),function(bangumi){return _c('a',{key:bangumi.title,staticClass:"bangumi",class:{ 'bangumi-old': bangumi.newold === 'old' },attrs:{"href":_vm._f("keywordLink")(bangumi.keyword)}},[_vm._v(_vm._s(bangumi.title))])}),0)])}),0)])};
  var __vue_staticRenderFns__$2 = [];

    /* style */
    const __vue_inject_styles__$2 = function (inject) {
      if (!inject) return
      inject("data-v-2738548f_0", { source: "a[data-v-2738548f]{color:#247;text-decoration:none}header[data-v-2738548f]{color:#fff;background-color:#247;padding:5px;display:flex;font-size:.8rem}header>span[data-v-2738548f]:nth-of-type(n+2)::before{content:'::';padding:0 8px}header>span>a[data-v-2738548f]{color:#fff}.weekly-table[data-v-2738548f]{border-collapse:collapse;width:100%}.weekly-tr[data-v-2738548f]{display:flex;align-items:center;border:2px solid #fff;background:#fff}.weekly-tr.weekly-tr-today[data-v-2738548f]{background-color:#ff9}.weekly-weekday-str[data-v-2738548f]{padding:3px 15px;margin-right:3px;background-color:#7e99be;color:#fff;font-weight:bolder}.bangumi[data-v-2738548f]{border:1px solid orange;padding:2px;margin:1px 3px}.bangumi-old[data-v-2738548f]{border:1px solid #002fff}", map: undefined, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$2 = "data-v-2738548f";
    /* module identifier */
    const __vue_module_identifier__$2 = undefined;
    /* functional template */
    const __vue_is_functional_template__$2 = false;
    /* style inject SSR */
    

    
    var PageWeeklyComp = normalizeComponent_1(
      { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
      __vue_inject_styles__$2,
      __vue_script__$2,
      __vue_scope_id__$2,
      __vue_is_functional_template__$2,
      __vue_module_identifier__$2,
      browser,
      undefined
    );

  // pre-process
  const $$ = s => Array.from(document.querySelectorAll(s));

  for (const adEl of $$('[id*="1280"]')) {
    adEl.remove();
  }

  const routes = [
    { path: '/weekly', component: PageWeeklyComp },
    { path: '/favorite', component: PageFavoriteComp },
  ];

  const fetcher = async (url, options = {}) => {
    const defaultOptions = {
      method: 'GET',
    };
    const opt = Object.assign({}, defaultOptions, options);
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        ...opt,
        url,
        onload: res => {
          // console.log(res);
          resolve(res.responseText);
        },
        onerror: err => {
          console.error(err);
          reject(err);
        },
      });
    });
  };

  const downloadBangumi = async newold => {
    const txt = await fetcher(
      `https://flandredaisuki.github.io/DMHY-Bangumi-Index/${newold}.yaml`,
    );

    const data = jsyaml.safeLoad(txt);
    const payloadList = [];
    for (const weekdayStr of store.state.const.WEEKDAY_STR) {
      const payload = {
        weekdayStr,
        bangumiList: [],
      };
      for (const [title, keyword] of Object.entries(data[weekdayStr])) {
        payload.bangumiList.push({
          title,
          keyword,
          newold,
        });
      }
      payloadList.push(payload);
    }
    return payloadList;
  };

  // entry point

  Vue.use(Vuex);
  Vue.use(VueRouter);

  const store = new Vuex.Store({
    state: {
      weeklyBangumi: {},
      favoriteBangumiList: [],
      const: {
        WEEKDAY_STR: '日一二三四五六',
      },
    },
    mutations: {
      appendWeeklyBangumi(state, { weekdayStr, bangumiList }) {
        if (!state.weeklyBangumi[weekdayStr]) {
          state.weeklyBangumi[weekdayStr] = [];
        }
        state.weeklyBangumi[weekdayStr].push(...bangumiList);

        // re-assign to trigger rendering
        state.weeklyBangumi = Object.assign({}, state.weeklyBangumi);
      },
      appendFavoriteBangumi(state, bangumi) {
        state.favoriteBangumiList.push(bangumi);
      },
      removeFavoriteBangumi(state, bangumiTitle) {
        const indexFound = state.favoriteBangumiList.findIndex(
          b => b.title === bangumiTitle,
        );
        if (indexFound >= 0) {
          state.favoriteBangumiList.splice(indexFound, 1);
        }
      },
      saveFavorites(state) {
        const key = 'DMHY-Bangumi-Index::favorite';
        localStorage.setItem(
          key,
          LZString.compressToBase64(JSON.stringify(state.favoriteBangumiList)),
        );
      },
      loadFavorites(state) {
        const key = 'DMHY-Bangumi-Index::favorite';
        state.favoriteBangumiList =
          JSON.parse(LZString.decompressFromBase64(localStorage.getItem(key))) ||
          [];
      },
      saveWeeklyBangumi(state) {
        const key = 'DMHY-Bangumi-Index::weekly-bangumi';
        localStorage.setItem(
          key,
          LZString.compressToBase64(JSON.stringify(state.weeklyBangumi)),
        );
      },
      loadWeeklyBangumi(state) {
        const key = 'DMHY-Bangumi-Index::weekly-bangumi';
        state.weeklyBangumi = JSON.parse(
          LZString.decompressFromBase64(localStorage.getItem(key)) || '{}',
        );
      },
    },
    actions: {
      async downloadWeeklyBangumi({ commit }) {
        const oldPayloadList = await downloadBangumi('old');
        for (const payload of oldPayloadList) {
          commit('appendWeeklyBangumi', payload);
        }
        const newPayloadList = await downloadBangumi('new');
        for (const payload of newPayloadList) {
          commit('appendWeeklyBangumi', payload);
        }
        commit('saveWeeklyBangumi');
      },
      appendFavoriteBangumi({ commit }, bangumi) {
        commit('appendFavoriteBangumi', bangumi);
        commit('saveFavorites');
      },
      removeFavoriteBangumi({ commit }, bangumiTitle) {
        commit('removeFavoriteBangumi', bangumiTitle);
        commit('saveFavorites');
      },
    },
  });

  const router = new VueRouter({
    routes,
  });

  window.vm = new Vue({
    el: $$('div.main > div')[0],
    store,
    router,
    mounted() {
      this.$router.push('/weekly');
      this.$store.commit('loadFavorites');
      this.$store.commit('saveFavorites');
      this.loadCachedWeeklyBangumi();
    },
    methods: {
      loadCachedWeeklyBangumi() {
        const cacheKey = 'DMHY-Bangumi-Index::weekly-bangumi-cache-t';
        const cacheT = Number(localStorage.getItem(cacheKey)) || 0;
        const maxCacheTime = 86400 * 1000 * 0.5; // ms of half day

        if (Date.now() - cacheT > maxCacheTime) {
          this.$store.dispatch('downloadWeeklyBangumi');
          localStorage.setItem(cacheKey, Date.now());
        } else {
          this.$store.commit('loadWeeklyBangumi');
        }
      },
    },
    render(h) {
      return h(MainComp);
    },
  });

  // window.vm.$mount($$('div.main > div')[0]);
  // processBangumi('old').then(() => processBangumi('new'));

}(Vue, Vuex, VueRouter, jsyaml, LZString));
