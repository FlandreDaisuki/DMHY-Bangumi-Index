// ==UserScript==
// @name       DMHY Bangumi Index
// @name:zh-TW 動漫花園新番索引
// @description       Let DMHY header index back!
// @description:zh-TW 把動漫花園上方的索引弄回來
// @namespace https://github.com/FlandreDaisuki
// @author    FlandreDaisuki
// @match     https://share.dmhy.org/*
// @require   https://unpkg.com/vue@2.6.10/dist/vue.js
// @require   https://unpkg.com/vuex@3.1.1/dist/vuex.js
// @require   https://unpkg.com/vue-router@3.0.7/dist/vue-router.js
// @require   https://unpkg.com/js-yaml@3.13.1/dist/js-yaml.js
// @require   https://unpkg.com/lz-string@1.4.4/libs/lz-string.js
// @resource  OLD_YAML https://flandredaisuki.github.io/DMHY-Bangumi-Index/old.yaml
// @resource  NEW_YAML https://flandredaisuki.github.io/DMHY-Bangumi-Index/new.yaml
// @license   MIT
// @noframes
// @version   1.0.0
// @grant     GM_getResourceText
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
  var __vue_render__ = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      { attrs: { id: "🌐" } },
      [
        _c(
          "nav",
          [
            _c("router-link", { attrs: { to: "/weekly" } }, [_vm._v("新番索引")]),
            _vm._v(" "),
            _c("router-link", { attrs: { to: "/favorite" } }, [
              _vm._v("書籤索引")
            ])
          ],
          1
        ),
        _vm._v(" "),
        _c("router-view", { staticClass: "page-view" })
      ],
      1
    )
  };
  var __vue_staticRenderFns__ = [];
  __vue_render__._withStripped = true;

    /* style */
    const __vue_inject_styles__ = function (inject) {
      if (!inject) return
      inject("data-v-07b1eca8_0", { source: "\n#🌐[data-v-07b1eca8] {\n  margin-top: 20px;\n  font-size: 14px;\n}\na[data-v-07b1eca8] {\n  color: black;\n  text-decoration: none;\n}\nnav > a[data-v-07b1eca8] {\n  display: inline-block;\n  padding: 3px 15px;\n  background: #fff;\n  cursor: pointer;\n  border-top: 1px solid #247;\n  border-left: 1px solid #247;\n  border-right: 1px solid #247;\n  border-radius: 5px 5px 0 0;\n}\nnav > a.router-link-exact-active[data-v-07b1eca8] {\n  border-top: 3px solid dodgerblue;\n}\n.page-view[data-v-07b1eca8] {\n  border: 1px solid #247;\n}\n", map: {"version":3,"sources":["/home/flandre/dev/DMHY-Bangumi-Index/src/components/Main.vue"],"names":[],"mappings":";AAeA;EACA,gBAAA;EACA,eAAA;AACA;AACA;EACA,YAAA;EACA,qBAAA;AACA;AACA;EACA,qBAAA;EACA,iBAAA;EACA,gBAAA;EACA,eAAA;EACA,0BAAA;EACA,2BAAA;EACA,4BAAA;EACA,0BAAA;AACA;AACA;EACA,gCAAA;AACA;AACA;EACA,sBAAA;AACA","file":"Main.vue","sourcesContent":["<template>\n  <div id=\"🌐\">\n    <nav>\n      <router-link to=\"/weekly\">新番索引</router-link>\n      <router-link to=\"/favorite\">書籤索引</router-link>\n    </nav>\n    <router-view class=\"page-view\"></router-view>\n  </div>\n</template>\n\n<script>\nexport default {};\n</script>\n\n<style scoped>\n#🌐 {\n  margin-top: 20px;\n  font-size: 14px;\n}\na {\n  color: black;\n  text-decoration: none;\n}\nnav > a {\n  display: inline-block;\n  padding: 3px 15px;\n  background: #fff;\n  cursor: pointer;\n  border-top: 1px solid #247;\n  border-left: 1px solid #247;\n  border-right: 1px solid #247;\n  border-radius: 5px 5px 0 0;\n}\nnav > a.router-link-exact-active {\n  border-top: 3px solid dodgerblue;\n}\n.page-view {\n  border: 1px solid #247;\n}\n</style>\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__ = "data-v-07b1eca8";
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
  var __vue_render__$1 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", [
      _vm._m(0),
      _vm._v(" "),
      _c("div", { staticClass: "favorite-area" }, [
        _c(
          "div",
          { staticClass: "favorite-pool" },
          _vm._l(_vm.favoriteBangumiList, function(bangumi) {
            return _c(
              "a",
              {
                key: bangumi.title,
                staticClass: "bangumi",
                attrs: {
                  href: _vm._f("keywordLink")(bangumi.keyword),
                  role: "button"
                }
              },
              [_vm._v(_vm._s(bangumi.title))]
            )
          }),
          0
        ),
        _vm._v(" "),
        _c("div", { staticClass: "input-area" }, [
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.userInputStr,
                expression: "userInputStr"
              }
            ],
            ref: "userTitleInput",
            staticClass: "user-title-input",
            attrs: { type: "text", placeholder: "為目前網址取名" },
            domProps: { value: _vm.userInputStr },
            on: {
              input: [
                function($event) {
                  if ($event.target.composing) {
                    return
                  }
                  _vm.userInputStr = $event.target.value;
                },
                function($event) {
                  return _vm.setValidity("")
                }
              ],
              focus: function($event) {
                return _vm.setValidity("")
              }
            }
          }),
          _vm._v(" "),
          _c("span", { staticClass: "tooltip" }, [
            _vm._v(_vm._s(_vm.validityMsg))
          ]),
          _vm._v(" "),
          _c(
            "button",
            { staticClass: "add-btn", on: { click: _vm.addFavorite } },
            [_vm._v("加入")]
          ),
          _vm._v(" "),
          _c(
            "button",
            { staticClass: "del-btn", on: { click: _vm.delFavorite } },
            [_vm._v("刪除")]
          )
        ])
      ])
    ])
  };
  var __vue_staticRenderFns__$1 = [
    function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("header", [
        _c("span", [_vm._v("書籤索引")]),
        _vm._v(" "),
        _c("span", [_vm._v("將當前的搜索加入書籤，並自訂名稱")])
      ])
    }
  ];
  __vue_render__$1._withStripped = true;

    /* style */
    const __vue_inject_styles__$1 = function (inject) {
      if (!inject) return
      inject("data-v-7ac4a43b_0", { source: "\na[data-v-7ac4a43b] {\n  color: #247;\n  text-decoration: none;\n}\nheader[data-v-7ac4a43b] {\n  color: #fff;\n  background-color: #247;\n  padding: 5px;\n  display: flex;\n  font-size: 0.8rem;\n}\nheader > span[data-v-7ac4a43b]:nth-of-type(n + 2)::before {\n  content: '::';\n  padding: 0 8px;\n}\nheader > span > a[data-v-7ac4a43b] {\n  color: #fff;\n}\n.favorite-area[data-v-7ac4a43b] {\n  background-color: #fff;\n}\n.favorite-pool[data-v-7ac4a43b] {\n  padding: 10px;\n  min-height: 14px;\n}\n.bangumi[data-v-7ac4a43b] {\n  border: 1px solid #ffa500;\n  padding: 2px;\n  margin: 1px 3px;\n}\n.input-area[data-v-7ac4a43b] {\n  display: flex;\n  justify-content: center;\n  padding: 4px;\n  border-top: 1px dotted #247;\n}\n.input-area > *[data-v-7ac4a43b] {\n  margin: 0 15px;\n}\n.input-area > .user-title-input[data-v-7ac4a43b] {\n  border: 1px solid #247;\n  padding: 0 7px;\n  border-radius: 5px;\n  font-size: 14px;\n}\n.tooltip[data-v-7ac4a43b] {\n  position: absolute;\n  background-color: #000;\n  color: white;\n  padding: 5px 10px;\n  border-radius: 5px;\n  transform-origin: bottom center;\n  transform: translateY(-35px);\n  display: none;\n}\n.tooltip[data-v-7ac4a43b]::after {\n  content: '';\n  width: 0;\n  height: 0;\n  border-left: 5px solid transparent;\n  border-right: 5px solid transparent;\n  border-top: 5px solid black;\n  position: absolute;\n  top: 100%;\n  right: 20%;\n}\n.user-title-input:invalid + .tooltip[data-v-7ac4a43b] {\n  display: block;\n}\n.input-area > button[data-v-7ac4a43b] {\n  border: none;\n  border-radius: 5px;\n  padding: 5px 21px;\n  font-size: 14px;\n}\n.input-area > button.add-btn[data-v-7ac4a43b] {\n  background-color: lightgreen;\n}\n.input-area > button.del-btn[data-v-7ac4a43b] {\n  background-color: crimson;\n  color: white;\n}\n", map: {"version":3,"sources":["/home/flandre/dev/DMHY-Bangumi-Index/src/components/PageFavorite.vue"],"names":[],"mappings":";AA+FA;EACA,WAAA;EACA,qBAAA;AACA;AACA;EACA,WAAA;EACA,sBAAA;EACA,YAAA;EACA,aAAA;EACA,iBAAA;AACA;AACA;EACA,aAAA;EACA,cAAA;AACA;AACA;EACA,WAAA;AACA;AACA;EACA,sBAAA;AACA;AACA;EACA,aAAA;EACA,gBAAA;AACA;AACA;EACA,yBAAA;EACA,YAAA;EACA,eAAA;AACA;AACA;EACA,aAAA;EACA,uBAAA;EACA,YAAA;EACA,2BAAA;AACA;AACA;EACA,cAAA;AACA;AACA;EACA,sBAAA;EACA,cAAA;EACA,kBAAA;EACA,eAAA;AACA;AACA;EACA,kBAAA;EACA,sBAAA;EACA,YAAA;EACA,iBAAA;EACA,kBAAA;EACA,+BAAA;EACA,4BAAA;EACA,aAAA;AACA;AACA;EACA,WAAA;EACA,QAAA;EACA,SAAA;EACA,kCAAA;EACA,mCAAA;EACA,2BAAA;EACA,kBAAA;EACA,SAAA;EACA,UAAA;AACA;AACA;EACA,cAAA;AACA;AACA;EACA,YAAA;EACA,kBAAA;EACA,iBAAA;EACA,eAAA;AACA;AACA;EACA,4BAAA;AACA;AACA;EACA,yBAAA;EACA,YAAA;AACA","file":"PageFavorite.vue","sourcesContent":["<template>\n  <div>\n    <header>\n      <span>書籤索引</span>\n      <span>將當前的搜索加入書籤，並自訂名稱</span>\n    </header>\n    <div class=\"favorite-area\">\n      <div class=\"favorite-pool\">\n        <a\n          v-for=\"bangumi in favoriteBangumiList\"\n          :key=\"bangumi.title\"\n          :href=\"bangumi.keyword | keywordLink\"\n          role=\"button\"\n          class=\"bangumi\"\n          >{{ bangumi.title }}</a\n        >\n      </div>\n      <div class=\"input-area\">\n        <input\n          ref=\"userTitleInput\"\n          v-model=\"userInputStr\"\n          type=\"text\"\n          class=\"user-title-input\"\n          placeholder=\"為目前網址取名\"\n          @input=\"setValidity('')\"\n          @focus=\"setValidity('')\"\n        />\n        <span class=\"tooltip\">{{ validityMsg }}</span>\n        <button class=\"add-btn\" @click=\"addFavorite\">加入</button>\n        <button class=\"del-btn\" @click=\"delFavorite\">刪除</button>\n      </div>\n    </div>\n  </div>\n</template>\n<script>\nexport default {\n  filters: {\n    keywordLink(keyword) {\n      return `/topics/list?keyword=${keyword}`;\n    },\n  },\n  data() {\n    return {\n      userInputStr: '',\n      validityMsg: '',\n    };\n  },\n  computed: {\n    favoriteBangumiList() {\n      return this.$store.state.favoriteBangumiList;\n    },\n    utitle() {\n      return this.userInputStr.trim();\n    },\n  },\n  methods: {\n    setValidity(msg) {\n      this.validityMsg = msg;\n      this.$refs.userTitleInput.setCustomValidity(this.validityMsg);\n    },\n    addFavorite() {\n      if (!this.utitle) {\n        this.setValidity('名稱欄為空');\n        return;\n      }\n      const found = this.favoriteBangumiList.find(b => b.title === this.utitle);\n      if (found) {\n        this.setValidity('書籤名稱已存在');\n        return;\n      }\n\n      const keyword = new URL(location).searchParams.get('keyword');\n      this.$store.dispatch('appendFavoriteBangumi', {\n        title: this.utitle,\n        keyword,\n      });\n    },\n    delFavorite() {\n      if (!this.utitle) {\n        this.setValidity('名稱欄為空');\n        return;\n      }\n      const found = this.favoriteBangumiList.find(b => b.title === this.utitle);\n      if (!found) {\n        this.setValidity('書籤名稱不存在');\n        return;\n      }\n\n      this.$store.dispatch('removeFavoriteBangumi', this.utitle);\n    },\n  },\n};\n</script>\n\n<style scoped>\na {\n  color: #247;\n  text-decoration: none;\n}\nheader {\n  color: #fff;\n  background-color: #247;\n  padding: 5px;\n  display: flex;\n  font-size: 0.8rem;\n}\nheader > span:nth-of-type(n + 2)::before {\n  content: '::';\n  padding: 0 8px;\n}\nheader > span > a {\n  color: #fff;\n}\n.favorite-area {\n  background-color: #fff;\n}\n.favorite-pool {\n  padding: 10px;\n  min-height: 14px;\n}\n.bangumi {\n  border: 1px solid #ffa500;\n  padding: 2px;\n  margin: 1px 3px;\n}\n.input-area {\n  display: flex;\n  justify-content: center;\n  padding: 4px;\n  border-top: 1px dotted #247;\n}\n.input-area > * {\n  margin: 0 15px;\n}\n.input-area > .user-title-input {\n  border: 1px solid #247;\n  padding: 0 7px;\n  border-radius: 5px;\n  font-size: 14px;\n}\n.tooltip {\n  position: absolute;\n  background-color: #000;\n  color: white;\n  padding: 5px 10px;\n  border-radius: 5px;\n  transform-origin: bottom center;\n  transform: translateY(-35px);\n  display: none;\n}\n.tooltip::after {\n  content: '';\n  width: 0;\n  height: 0;\n  border-left: 5px solid transparent;\n  border-right: 5px solid transparent;\n  border-top: 5px solid black;\n  position: absolute;\n  top: 100%;\n  right: 20%;\n}\n.user-title-input:invalid + .tooltip {\n  display: block;\n}\n.input-area > button {\n  border: none;\n  border-radius: 5px;\n  padding: 5px 21px;\n  font-size: 14px;\n}\n.input-area > button.add-btn {\n  background-color: lightgreen;\n}\n.input-area > button.del-btn {\n  background-color: crimson;\n  color: white;\n}\n</style>\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$1 = "data-v-7ac4a43b";
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
    },
  };

  /* script */
  const __vue_script__$2 = script$2;

  /* template */
  var __vue_render__$2 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", [
      _c("header", [
        _c("span", [_vm._v("新番資源索引")]),
        _vm._v(" "),
        _c("span", [_vm._v(_vm._s(_vm.todayStr))]),
        _vm._v(" "),
        _c("span", [
          _c(
            "a",
            {
              attrs: { href: "javascript:;", role: "button" },
              on: { click: _vm.invExpansion }
            },
            [
              _vm._v(
                "\n        " +
                  _vm._s(_vm.expansion ? "收起" : "展開") +
                  "\n      "
              )
            ]
          )
        ])
      ]),
      _vm._v(" "),
      _c(
        "table",
        { staticClass: "weekly-table" },
        _vm._l(_vm.orderedWeeklyBangumi, function(ref, index) {
          var weekday = ref[0];
          var dayBangumiList = ref[1];
          return _c(
            "tr",
            {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: _vm.expansion ? true : index < 4,
                  expression: "expansion ? true : index < 4"
                }
              ],
              key: weekday,
              staticClass: "weekly-tr",
              class: { "weekly-tr-today": index === 2 }
            },
            [
              _c("td", { staticClass: "weekly-weekday-str" }, [
                _vm._v(_vm._s(_vm._f("longerWeekdayStr")(weekday)))
              ]),
              _vm._v(" "),
              _c(
                "td",
                _vm._l(dayBangumiList, function(bangumi) {
                  return _c(
                    "a",
                    {
                      key: bangumi.title,
                      staticClass: "bangumi",
                      class: { "bangumi-old": bangumi.newold === "old" },
                      attrs: { href: _vm._f("keywordLink")(bangumi.keyword) }
                    },
                    [_vm._v(_vm._s(bangumi.title))]
                  )
                }),
                0
              )
            ]
          )
        }),
        0
      )
    ])
  };
  var __vue_staticRenderFns__$2 = [];
  __vue_render__$2._withStripped = true;

    /* style */
    const __vue_inject_styles__$2 = function (inject) {
      if (!inject) return
      inject("data-v-2b324272_0", { source: "\na[data-v-2b324272] {\n  color: #247;\n  text-decoration: none;\n}\nheader[data-v-2b324272] {\n  color: #fff;\n  background-color: #247;\n  padding: 5px;\n  display: flex;\n  font-size: 0.8rem;\n}\nheader > span[data-v-2b324272]:nth-of-type(n + 2)::before {\n  content: '::';\n  padding: 0 8px;\n}\nheader > span > a[data-v-2b324272] {\n  color: #fff;\n}\n.weekly-table[data-v-2b324272] {\n  border-collapse: collapse;\n  width: 100%;\n}\n.weekly-tr[data-v-2b324272] {\n  display: flex;\n  align-items: center;\n  border: 2px solid white;\n  background: white;\n}\n.weekly-tr.weekly-tr-today[data-v-2b324272] {\n  background-color: #ff9;\n}\n.weekly-weekday-str[data-v-2b324272] {\n  padding: 3px 15px;\n  margin-right: 3px;\n  background-color: #7e99be;\n  color: white;\n  font-weight: bolder;\n}\n.bangumi[data-v-2b324272] {\n  border: 1px solid #ffa500;\n  padding: 2px;\n  margin: 1px 3px;\n}\n.bangumi-old[data-v-2b324272] {\n  border: 1px solid #002fff;\n}\n", map: {"version":3,"sources":["/home/flandre/dev/DMHY-Bangumi-Index/src/components/PageWeekly.vue"],"names":[],"mappings":";AA6GA;EACA,WAAA;EACA,qBAAA;AACA;AACA;EACA,WAAA;EACA,sBAAA;EACA,YAAA;EACA,aAAA;EACA,iBAAA;AACA;AACA;EACA,aAAA;EACA,cAAA;AACA;AACA;EACA,WAAA;AACA;AACA;EACA,yBAAA;EACA,WAAA;AACA;AACA;EACA,aAAA;EACA,mBAAA;EACA,uBAAA;EACA,iBAAA;AACA;AACA;EACA,sBAAA;AACA;AACA;EACA,iBAAA;EACA,iBAAA;EACA,yBAAA;EACA,YAAA;EACA,mBAAA;AACA;AACA;EACA,yBAAA;EACA,YAAA;EACA,eAAA;AACA;AACA;EACA,yBAAA;AACA","file":"PageWeekly.vue","sourcesContent":["<template>\n  <div>\n    <header>\n      <span>新番資源索引</span>\n      <span>{{ todayStr }}</span>\n      <span>\n        <a href=\"javascript:;\" role=\"button\" @click=\"invExpansion\">\n          {{ expansion ? '收起' : '展開' }}\n        </a>\n      </span>\n    </header>\n    <table class=\"weekly-table\">\n      <tr\n        v-for=\"([weekday, dayBangumiList], index) in orderedWeeklyBangumi\"\n        v-show=\"expansion ? true : index < 4\"\n        :key=\"weekday\"\n        class=\"weekly-tr\"\n        :class=\"{ 'weekly-tr-today': index === 2 }\"\n      >\n        <td class=\"weekly-weekday-str\">{{ weekday | longerWeekdayStr }}</td>\n        <td>\n          <a\n            v-for=\"bangumi in dayBangumiList\"\n            :key=\"bangumi.title\"\n            class=\"bangumi\"\n            :href=\"bangumi.keyword | keywordLink\"\n            :class=\"{ 'bangumi-old': bangumi.newold === 'old' }\"\n            >{{ bangumi.title }}</a\n          >\n        </td>\n      </tr>\n    </table>\n  </div>\n</template>\n\n<script>\nexport default {\n  filters: {\n    keywordLink(keyword) {\n      return `/topics/list?keyword=${keyword}`;\n    },\n    longerWeekdayStr(weekdayStr) {\n      switch (weekdayStr) {\n        case '日':\n          return '星期日（日）';\n        case '一':\n          return '星期一（月）';\n        case '二':\n          return '星期二（火）';\n        case '三':\n          return '星期三（水）';\n        case '四':\n          return '星期四（木）';\n        case '五':\n          return '星期五（金）';\n        case '六':\n          return '星期六（土）';\n      }\n    },\n  },\n  data() {\n    const now = Date.now();\n    return {\n      now,\n      date: new Date(now),\n      todayWeekday: new Date(now).getDay(),\n      expansion: false,\n    };\n  },\n  computed: {\n    todayStr() {\n      const longWeekdayStr = new Intl.DateTimeFormat('zh', {\n        weekday: 'long',\n      }).format(this.date);\n\n      const dateStr = new Intl.DateTimeFormat('zh', {\n        day: 'numeric',\n        month: 'long',\n        year: 'numeric',\n      }).format(this.date);\n\n      return `西元 ${dateStr} ${longWeekdayStr}`;\n    },\n    orderedWeeklyBangumi() {\n      const WEEKDAY_STR = this.$store.state.const.WEEKDAY_STR;\n      const TODAY_SENSITIVE_WEEKDAY_STR = WEEKDAY_STR.repeat(3).slice(\n        this.todayWeekday + 5,\n        this.todayWeekday + 12,\n      );\n\n      const weeklyBangumi = this.$store.state.weeklyBangumi;\n      const keyedWeeklyBangumi = [...TODAY_SENSITIVE_WEEKDAY_STR].reduce(\n        (collection, weekdayStr) => {\n          return collection.set(weekdayStr, weeklyBangumi[weekdayStr]);\n        },\n        new Map(),\n      );\n      return [...keyedWeeklyBangumi.entries()];\n    },\n  },\n  methods: {\n    invExpansion() {\n      this.expansion = !this.expansion;\n    },\n  },\n};\n</script>\n\n<style scoped>\na {\n  color: #247;\n  text-decoration: none;\n}\nheader {\n  color: #fff;\n  background-color: #247;\n  padding: 5px;\n  display: flex;\n  font-size: 0.8rem;\n}\nheader > span:nth-of-type(n + 2)::before {\n  content: '::';\n  padding: 0 8px;\n}\nheader > span > a {\n  color: #fff;\n}\n.weekly-table {\n  border-collapse: collapse;\n  width: 100%;\n}\n.weekly-tr {\n  display: flex;\n  align-items: center;\n  border: 2px solid white;\n  background: white;\n}\n.weekly-tr.weekly-tr-today {\n  background-color: #ff9;\n}\n.weekly-weekday-str {\n  padding: 3px 15px;\n  margin-right: 3px;\n  background-color: #7e99be;\n  color: white;\n  font-weight: bolder;\n}\n.bangumi {\n  border: 1px solid #ffa500;\n  padding: 2px;\n  margin: 1px 3px;\n}\n.bangumi-old {\n  border: 1px solid #002fff;\n}\n</style>\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$2 = "data-v-2b324272";
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

  const YAMLtoPayloadList = newold => {
    const name = newold.toUpperCase() + '_YAML';
    const txt = GM_getResourceText(name);

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
        const oldPayloadList = YAMLtoPayloadList('old');
        for (const payload of oldPayloadList) {
          commit('appendWeeklyBangumi', payload);
        }
        const newPayloadList = YAMLtoPayloadList('new');
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
