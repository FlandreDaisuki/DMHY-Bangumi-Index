// ==UserScript==
// @name       DMHY Bangumi Index
// @name:zh-TW 動漫花園新番索引
// @description       Let DMHY header index back!
// @description:zh-TW 把動漫花園上方的索引弄回來
// @namespace https://github.com/FlandreDaisuki
// @author    FlandreDaisuki
// @match     https://dmhy.org/
// @match     https://dmhy.org/topics/*
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
// @version   1.1.8
// @grant     GM_xmlhttpRequest
// @grant     unsafeWindow
// ==/UserScript==

(function (Vue, Vuex, LZString, jsyaml, VueRouter) {
  'use strict';

  Vue = Vue && Object.prototype.hasOwnProperty.call(Vue, 'default') ? Vue['default'] : Vue;
  Vuex = Vuex && Object.prototype.hasOwnProperty.call(Vuex, 'default') ? Vuex['default'] : Vuex;
  LZString = LZString && Object.prototype.hasOwnProperty.call(LZString, 'default') ? LZString['default'] : LZString;
  jsyaml = jsyaml && Object.prototype.hasOwnProperty.call(jsyaml, 'default') ? jsyaml['default'] : jsyaml;
  VueRouter = VueRouter && Object.prototype.hasOwnProperty.call(VueRouter, 'default') ? VueRouter['default'] : VueRouter;

  const A_DAY_MS = 86400 * 1000;

  const WEEKDAY_STR = '日一二三四五六';

  /**
   * wb := weeklyBangumi
   * {
   *   日: [
   *     {title, keyword, isnew},
   *     {title, keyword, isnew},...
   *   ],
   *   一: [],
   *   ...
   * }
   * → xwb := [...W].join('\0'); # ordered by WEEKDAY_STR #
   * → W := [...B].join('\1')
   * → B := [T, K, N].join('\2')
   * → N := true: 1; false: 0;
   */
  const compressedEncode = (wb) => {
    return [...WEEKDAY_STR]
      .map((w) =>
        wb[w]
          .map((b) => [b.title, b.keyword, Number(b.isnew)].join('\x02'))
          .join('\x01'),
      )
      .join('\x00');
  };

  const compressedDecode = (xwb) => {
    return xwb
      .split('\x00')
      .map((xw, i) => {
        return {
          [WEEKDAY_STR[i]]: xw.split('\x01')
            .filter(Boolean)
            .map((b) => {
              const [title, keyword, isnew] = b.split('\x02');
              return {
                title,
                keyword,
                isnew: isnew === '1',
              };
            }),
        };
      })
      .reduce((c, v) => {
        return Object.assign(c, v);
      }, {});
  };

  const encodeWeeklyBangumiToStorage = (wb) => {
    return LZString.compressToBase64(compressedEncode(wb));
  };

  const decodeWeeklyBangumiFromStorage = (xwb) => {
    return compressedDecode(LZString.decompressFromBase64(xwb));
  };

  // exports

  const appendWeeklyBangumi = (state, weeklyBangumiPayload) => {
    for (const weekdayStr of WEEKDAY_STR) {
      if (!state.weeklyBangumi[weekdayStr]) {
        state.weeklyBangumi[weekdayStr] = [];
      }
      state.weeklyBangumi[weekdayStr].push(...weeklyBangumiPayload[weekdayStr]);
    }

    // FIXME: re-assign to trigger rendering
    state.weeklyBangumi = { ...state.weeklyBangumi };
  };

  const appendFavoriteBangumi = (state, bangumi) => {
    state.favoriteBangumiList.push(bangumi);
  };
  const removeFavoriteBangumi = (state, bangumiTitle) => {
    const indexFound = state.favoriteBangumiList.findIndex(
      (b) => b.title === bangumiTitle,
    );
    if (indexFound >= 0) {
      state.favoriteBangumiList.splice(indexFound, 1);
    }
  };
  const saveFavorites = (state) => {
    const key = state.storageKey.favorite;
    localStorage.setItem(
      key,
      LZString.compressToBase64(JSON.stringify(state.favoriteBangumiList)),
    );
  };
  const loadFavorites = (state) => {
    const key = state.storageKey.favorite;
    const fav = localStorage.getItem(key);
    if (fav) {
      state.favoriteBangumiList =
        JSON.parse(LZString.decompressFromBase64(fav)) || [];
    } else {
      state.favoriteBangumiList = [];
    }
  };
  const saveWeeklyBangumi = (state) => {
    const key = state.storageKey.weekly;
    localStorage.setItem(key, encodeWeeklyBangumiToStorage(state.weeklyBangumi));
  };
  const loadWeeklyBangumi = (state) => {
    const key = state.storageKey.weekly;
    const xwb = localStorage.getItem(key);
    if (xwb) {
      state.weeklyBangumi = decodeWeeklyBangumiFromStorage(xwb) || {};
    } else {
      state.weeklyBangumi = {};
    }
  };

  var mutations = {
    appendWeeklyBangumi,
    appendFavoriteBangumi,
    removeFavoriteBangumi,
    saveFavorites,
    loadFavorites,
    saveWeeklyBangumi,
    loadWeeklyBangumi,
  };

  const fetcher = async(url, options = {}) => {
    const defaultOptions = {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
      },
    };
    const opt = Object.assign({}, defaultOptions, options);
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        ...opt,
        url,
        onload: (res) => {
          // console.log(res);
          resolve(res.responseText);
        },
        onerror: (err) => {
          console.error('DMHY-Bangumi-Index::req-err', err);
          reject(err);
        },
      });
    });
  };

  const YAMLToWeeklyBangumiPayload = (data, isnew) => {
    const weeklyBangumiPayload = {};

    for (const weekdayStr of WEEKDAY_STR) {
      weeklyBangumiPayload[weekdayStr] = [];
      for (const [title, keyword] of Object.entries(data[weekdayStr])) {
        weeklyBangumiPayload[weekdayStr].push({
          title,
          keyword,
          isnew,
        });
      }
    }
    return weeklyBangumiPayload;
  };

  const downloadBangumi = async(newold) => {
    const txt = await fetcher(
      `https://flandredaisuki.github.io/DMHY-Bangumi-Index/${newold}.yaml`,
    );

    const data = jsyaml.safeLoad(txt);
    return YAMLToWeeklyBangumiPayload(data, newold === 'new');
  };

  // exports

  const downloadWeeklyBangumi = async({ commit }) => {
    commit('appendWeeklyBangumi', await downloadBangumi('old'));
    commit('appendWeeklyBangumi', await downloadBangumi('new'));
    commit('saveWeeklyBangumi');
  };
  const appendFavoriteBangumi$1 = ({ commit }, bangumi) => {
    commit('appendFavoriteBangumi', bangumi);
    commit('saveFavorites');
  };
  const removeFavoriteBangumi$1 = ({ commit }, bangumiTitle) => {
    commit('removeFavoriteBangumi', bangumiTitle);
    commit('saveFavorites');
  };

  var actions = {
    downloadWeeklyBangumi,
    appendFavoriteBangumi: appendFavoriteBangumi$1,
    removeFavoriteBangumi: removeFavoriteBangumi$1,
  };

  Vue.use(Vuex);

  var store = new Vuex.Store({
    state: {
      weeklyBangumi: {},
      favoriteBangumiList: [],
      storageKey: {
        favorite: 'DMHY-Bangumi-Index::favorite',
        weekly: 'DMHY-Bangumi-Index::weekly-bangumi',
        cacheT: 'DMHY-Bangumi-Index::weekly-bangumi-cache-t',
        expansion: 'DMHY-Bangumi-Index::expansion',
      },
    },
    mutations,
    actions,
  });

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

  var script = {
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

  function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
      if (typeof shadowMode !== 'boolean') {
          createInjectorSSR = createInjector;
          createInjector = shadowMode;
          shadowMode = false;
      }
      // Vue.extend constructor export interop.
      const options = typeof script === 'function' ? script.options : script;
      // render functions
      if (template && template.render) {
          options.render = template.render;
          options.staticRenderFns = template.staticRenderFns;
          options._compiled = true;
          // functional template
          if (isFunctionalTemplate) {
              options.functional = true;
          }
      }
      // scopedId
      if (scopeId) {
          options._scopeId = scopeId;
      }
      let hook;
      if (moduleIdentifier) {
          // server build
          hook = function (context) {
              // 2.3 injection
              context =
                  context || // cached call
                      (this.$vnode && this.$vnode.ssrContext) || // stateful
                      (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
              // 2.2 with runInNewContext: true
              if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                  context = __VUE_SSR_CONTEXT__;
              }
              // inject component styles
              if (style) {
                  style.call(this, createInjectorSSR(context));
              }
              // register component module identifier for async chunk inference
              if (context && context._registeredComponents) {
                  context._registeredComponents.add(moduleIdentifier);
              }
          };
          // used by ssr in case component is cached and beforeCreate
          // never gets called
          options._ssrRegister = hook;
      }
      else if (style) {
          hook = shadowMode
              ? function (context) {
                  style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
              }
              : function (context) {
                  style.call(this, createInjector(context));
              };
      }
      if (hook) {
          if (options.functional) {
              // register for functional component in vue file
              const originalRender = options.render;
              options.render = function renderWithStyleInjection(h, context) {
                  hook.call(context);
                  return originalRender(h, context);
              };
          }
          else {
              // inject component registration as beforeCreate hook
              const existing = options.beforeCreate;
              options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
          }
      }
      return script;
  }

  const isOldIE = typeof navigator !== 'undefined' &&
      /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  function createInjector(context) {
      return (id, style) => addStyle(id, style);
  }
  let HEAD;
  const styles = {};
  function addStyle(id, css) {
      const group = isOldIE ? css.media || 'default' : id;
      const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
      if (!style.ids.has(id)) {
          style.ids.add(id);
          let code = css.source;
          if (css.map) {
              // https://developer.chrome.com/devtools/docs/javascript-debugging
              // this makes source maps inside style tags work properly in Chrome
              code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
              // http://stackoverflow.com/a/26603875
              code +=
                  '\n/*# sourceMappingURL=data:application/json;base64,' +
                      btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                      ' */';
          }
          if (!style.element) {
              style.element = document.createElement('style');
              style.element.type = 'text/css';
              if (css.media)
                  style.element.setAttribute('media', css.media);
              if (HEAD === undefined) {
                  HEAD = document.head || document.getElementsByTagName('head')[0];
              }
              HEAD.appendChild(style.element);
          }
          if ('styleSheet' in style.element) {
              style.styles.push(code);
              style.element.styleSheet.cssText = style.styles
                  .filter(Boolean)
                  .join('\n');
          }
          else {
              const index = style.ids.size - 1;
              const textNode = document.createTextNode(code);
              const nodes = style.element.childNodes;
              if (nodes[index])
                  style.element.removeChild(nodes[index]);
              if (nodes.length)
                  style.element.insertBefore(textNode, nodes[index]);
              else
                  style.element.appendChild(textNode);
          }
      }
  }

  /* script */
  const __vue_script__ = script;

  /* template */
  var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_vm._m(0),_vm._v(" "),_c('div',{staticClass:"favorite-area"},[_c('div',{staticClass:"favorite-pool"},_vm._l((_vm.favoriteBangumiList),function(bangumi){return _c('a',{key:bangumi.title,staticClass:"bangumi",attrs:{"href":_vm._f("keywordLink")(bangumi.keyword),"role":"button"}},[_vm._v(_vm._s(bangumi.title))])}),0),_vm._v(" "),_c('div',{staticClass:"input-area"},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.userInputStr),expression:"userInputStr"}],ref:"userTitleInput",staticClass:"user-title-input",attrs:{"type":"text","placeholder":"為目前網址取名"},domProps:{"value":(_vm.userInputStr)},on:{"input":[function($event){if($event.target.composing){ return; }_vm.userInputStr=$event.target.value;},function($event){return _vm.setValidity('')}],"focus":function($event){return _vm.setValidity('')}}}),_vm._v(" "),_c('span',{staticClass:"tooltip"},[_vm._v(_vm._s(_vm.validityMsg))]),_vm._v(" "),_c('button',{staticClass:"add-btn",on:{"click":_vm.addFavorite}},[_vm._v("\n        加入\n      ")]),_vm._v(" "),_c('button',{staticClass:"del-btn",on:{"click":_vm.delFavorite}},[_vm._v("\n        刪除\n      ")])])])])};
  var __vue_staticRenderFns__ = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('header',[_c('span',[_vm._v("書籤索引")]),_vm._v(" "),_c('span',[_vm._v("將當前的搜索加入書籤，並自訂名稱")])])}];

    /* style */
    const __vue_inject_styles__ = function (inject) {
      if (!inject) return
      inject("data-v-1ba14ed2_0", { source: "a[data-v-1ba14ed2]{color:#247;text-decoration:none}header[data-v-1ba14ed2]{color:#fff;background-color:#247;padding:5px;display:flex;font-size:.8rem}header>span[data-v-1ba14ed2]:nth-of-type(n+2)::before{content:'::';padding:0 8px}header>span>a[data-v-1ba14ed2]{color:#fff}.favorite-area[data-v-1ba14ed2]{background-color:#fff}.favorite-pool[data-v-1ba14ed2]{padding:10px;min-height:14px;display:flex}.bangumi[data-v-1ba14ed2]{border:1px solid orange;padding:2px;margin:1px 3px;display:inline-flex;align-items:center}.input-area[data-v-1ba14ed2]{display:flex;justify-content:center;padding:4px;border-top:1px dotted #247}.input-area>*[data-v-1ba14ed2]{margin:0 15px}.input-area>.user-title-input[data-v-1ba14ed2]{border:1px solid #247;padding:0 7px;border-radius:5px;font-size:14px}.tooltip[data-v-1ba14ed2]{position:absolute;background-color:#000;color:#fff;padding:5px 10px;border-radius:5px;transform-origin:bottom center;transform:translateY(-35px);display:none}.tooltip[data-v-1ba14ed2]::after{content:'';width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:5px solid #000;position:absolute;top:100%;right:20%}.user-title-input:invalid+.tooltip[data-v-1ba14ed2]{display:block}.input-area>button[data-v-1ba14ed2]{border:none;border-radius:5px;padding:5px 21px;font-size:14px}.input-area>button.add-btn[data-v-1ba14ed2]{background-color:#90ee90}.input-area>button.del-btn[data-v-1ba14ed2]{background-color:#dc143c;color:#fff}", map: undefined, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__ = "data-v-1ba14ed2";
    /* module identifier */
    const __vue_module_identifier__ = undefined;
    /* functional template */
    const __vue_is_functional_template__ = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__ = normalizeComponent(
      { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
      __vue_inject_styles__,
      __vue_script__,
      __vue_scope_id__,
      __vue_is_functional_template__,
      __vue_module_identifier__,
      false,
      createInjector,
      undefined,
      undefined
    );

  //

  var script$1 = {
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
        expansion: localStorage.getItem(this.$store.state.storageKey.expansion) === 'true',
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
        localStorage.setItem(this.$store.state.storageKey.expansion, this.expansion);
      },
      forceUpdateWeekly() {
        const cacheKey = this.$store.state.storageKey.cacheT;
        localStorage.setItem(cacheKey, 0);
        location.assign('https://share.dmhy.org/');
      },
    },
  };

  /* script */
  const __vue_script__$1 = script$1;

  /* template */
  var __vue_render__$1 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('header',[_c('span',[_vm._v("新番資源索引")]),_vm._v(" "),_c('span',[_vm._v(_vm._s(_vm.todayStr))]),_vm._v(" "),_c('span',[_c('a',{attrs:{"href":"javascript:;","role":"button"},on:{"click":_vm.invExpansion}},[_vm._v(_vm._s(_vm.expansion ? "收起" : "展開"))])]),_vm._v(" "),_c('span',[_c('a',{attrs:{"href":"javascript:;","role":"button"},on:{"click":_vm.forceUpdateWeekly}},[_vm._v("強制更新")])])]),_vm._v(" "),_c('table',{staticClass:"weekly-table"},_vm._l((_vm.orderedWeeklyBangumi),function(ref,index){
  var weekday = ref[0];
  var dayBangumiList = ref[1];
  return _c('tr',{directives:[{name:"show",rawName:"v-show",value:(_vm.expansion ? true : index < 4),expression:"expansion ? true : index < 4"}],key:weekday,staticClass:"weekly-tr",class:{ 'weekly-tr-today': index === 2 }},[_c('td',{staticClass:"weekly-weekday-str"},[_vm._v("\n        "+_vm._s(_vm._f("longerWeekdayStr")(weekday))+"\n      ")]),_vm._v(" "),_c('td',_vm._l((dayBangumiList),function(bangumi){return _c('a',{key:bangumi.title,staticClass:"bangumi",class:{ 'bangumi-old': !bangumi.isnew },attrs:{"href":_vm._f("keywordLink")(bangumi.keyword)}},[_vm._v(_vm._s(bangumi.title))])}),0)])}),0)])};
  var __vue_staticRenderFns__$1 = [];

    /* style */
    const __vue_inject_styles__$1 = function (inject) {
      if (!inject) return
      inject("data-v-245777da_0", { source: "a[data-v-245777da]{color:#247;text-decoration:none}header[data-v-245777da]{color:#fff;background-color:#247;padding:5px;display:flex;font-size:.8rem}header>span[data-v-245777da]:nth-of-type(n+2)::before{content:\"::\";padding:0 8px}header>span>a[data-v-245777da]{color:#fff}.weekly-table[data-v-245777da]{border-collapse:collapse;width:100%}.weekly-tr[data-v-245777da]{display:flex;align-items:center;border:2px solid #fff;background:#fff}.weekly-tr.weekly-tr-today[data-v-245777da]{background-color:#ff9}.weekly-weekday-str[data-v-245777da]{padding:3px 15px;margin-right:3px;background-color:#7e99be;color:#fff;font-weight:bolder}.weekly-weekday-str+td[data-v-245777da]{display:flex;flex-flow:row wrap;flex:1}.bangumi[data-v-245777da]{border:1px solid orange;padding:2px;margin:1px 3px;display:inline-flex;align-items:center}.bangumi-old[data-v-245777da]{border:1px solid #002fff}", map: undefined, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$1 = "data-v-245777da";
    /* module identifier */
    const __vue_module_identifier__$1 = undefined;
    /* functional template */
    const __vue_is_functional_template__$1 = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$1 = normalizeComponent(
      { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
      __vue_inject_styles__$1,
      __vue_script__$1,
      __vue_scope_id__$1,
      __vue_is_functional_template__$1,
      __vue_module_identifier__$1,
      false,
      createInjector,
      undefined,
      undefined
    );

  Vue.use(VueRouter);

  const routes = [
    { path: '/weekly', component: __vue_component__$1 },
    { path: '/favorite', component: __vue_component__ },
  ];

  var router = new VueRouter({
    routes,
  });

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

  var script$2 = {};

  /* script */
  const __vue_script__$2 = script$2;

  /* template */
  var __vue_render__$2 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"🌐"}},[_c('nav',[_c('router-link',{attrs:{"to":"/weekly"}},[_vm._v("\n      新番索引\n    ")]),_vm._v(" "),_c('router-link',{attrs:{"to":"/favorite"}},[_vm._v("\n      書籤索引\n    ")])],1),_vm._v(" "),_c('router-view',{staticClass:"page-view"})],1)};
  var __vue_staticRenderFns__$2 = [];

    /* style */
    const __vue_inject_styles__$2 = function (inject) {
      if (!inject) return
      inject("data-v-cc46936e_0", { source: "#🌐[data-v-cc46936e]{margin-top:20px;font-size:14px}a[data-v-cc46936e]{color:#000;text-decoration:none}nav>a[data-v-cc46936e]{display:inline-block;padding:3px 15px;background:#fff;cursor:pointer;border-top:1px solid #247;border-left:1px solid #247;border-right:1px solid #247;border-radius:5px 5px 0 0}nav>a.router-link-exact-active[data-v-cc46936e]{border-top:3px solid #1e90ff}.page-view[data-v-cc46936e]{border:1px solid #247}", map: undefined, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$2 = "data-v-cc46936e";
    /* module identifier */
    const __vue_module_identifier__$2 = undefined;
    /* functional template */
    const __vue_is_functional_template__$2 = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__$2 = normalizeComponent(
      { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
      __vue_inject_styles__$2,
      __vue_script__$2,
      __vue_scope_id__$2,
      __vue_is_functional_template__$2,
      __vue_module_identifier__$2,
      false,
      createInjector,
      undefined,
      undefined
    );

  // pre-process

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));

  const adSelectors = [
    '.ad',
    '[id="1280_ad"] > a',
    '.main > div:first-child',
  ].join(',');
  for (const adEl of $$(adSelectors)) {
    adEl.remove();
  }

  // entry point

  const vm = new Vue({
    el: $('#mini_jmd') ? $('#mini_jmd').parentElement : $('#mini_jmd'),
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
        const cacheKey = this.$store.state.storageKey.cacheT;
        const cacheT = Number(localStorage.getItem(cacheKey)) || 0;
        const maxCacheTime = A_DAY_MS / 2; // 12hr in milliseconds

        if (Date.now() - cacheT > maxCacheTime) {
          this.$store.dispatch('downloadWeeklyBangumi');
          localStorage.setItem(cacheKey, Date.now());
        } else {
          this.$store.commit('loadWeeklyBangumi');
        }
      },
    },
    render(h) {
      return h(__vue_component__$2);
    },
  });

  unsafeWindow.DMHYBangumiIndex$vm = vm;

}(Vue, Vuex, LZString, jsyaml, VueRouter));
