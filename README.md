# DMHY Bangumi Index 動漫花園新番索引

把動漫花園上方的索引弄回來

**本專案需要大家回饋想看的番或關鍵字**，專案維護者只會加入比較粗糙的新番關鍵字

## 安裝方法

1. 安裝 Tampermonkey
1. 點[這裡](https://github.com/FlandreDaisuki/DMHY-Bangumi-Index/raw/master/dist/dmhy-bangumi-index.user.js)下載

## 舊番表

打開腳本管理器前幾行可以看到:

```js
  const WEEKDAY_STR = '日一二三四五六';

  const BASE_URI = 'https://flandredaisuki.github.io/DMHY-Bangumi-Index';
  // const BASE_URI = 'https://flandredaisuki.github.io/DMHY-Bangumi-Index/history/2019-10';
```

下面的註解就是使用方法，歷史番表存在 [docs/history](https://github.com/FlandreDaisuki/DMHY-Bangumi-Index/tree/master/docs/history) 裡

## 預覽圖

![preview1](https://raw.githubusercontent.com/FlandreDaisuki/DMHY-Bangumi-Index/master/assets/preview1.jpg)
![preview2](https://raw.githubusercontent.com/FlandreDaisuki/DMHY-Bangumi-Index/master/assets/preview2.jpg)
![preview3](https://raw.githubusercontent.com/FlandreDaisuki/DMHY-Bangumi-Index/master/assets/preview3.jpg)

## 如何回饋

1. 直接使用 GitHub 或是 fork 去改 `docs/` 下的 yaml 檔
2. 根據[修改大綱](https://flandredaisuki.github.io/DMHY-Bangumi-Index/)改好後，發 PR 給我

## 授權

The MIT License (MIT)

Copyright (c) 2019-2022 FlandreDaisuki
