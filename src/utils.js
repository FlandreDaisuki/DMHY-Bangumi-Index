export const $ = (s) => document.querySelector(s);
export const $$ = (s) => Array.from(document.querySelectorAll(s));
export const createKeywordLink = (keyword) => `/topics/list?keyword=${keyword}`;
export const transformWeekday = (weekdayStr) => {
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
};
