import yaml from 'js-yaml';
import { WEEKDAY_STR, BASE_URI } from './constants';

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

export const downloadBangumi = async(newold) => {
  const txt = await fetcher(
    `${BASE_URI}/${newold}.yaml`,
  );

  const data = yaml.load(txt);
  return YAMLToWeeklyBangumiPayload(data, newold === 'new');
};
