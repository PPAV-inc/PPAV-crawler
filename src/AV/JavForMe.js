import axios from 'axios';

import AV from './AV';
import getCheerio from '../getCheerio';
import retryAxios from '../utils/retryAxios';

export default class JavForMe extends AV {
  constructor() {
    super();
    this.source = 'javforme';
    this.baseURL = 'http://javfor.me';
    this.http = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
    });
  }

  _getAllPagesUrls = async () => {
    const searchUrls = new Set();
    let maxPageNum = 1;

    try {
      const { data } = await retryAxios(() => this.http.get('/'));

      const $ = getCheerio(data);

      $('a').each((i, e) => {
        const url = $(e).attr('href') || '';
        const match = url.match(/.*\/page\/(\d+)/);
        if (match && +match[1] > maxPageNum) maxPageNum = +match[1];
      });

      for (let i = 1, len = maxPageNum; i <= len; i += 1) {
        searchUrls.add(`/page/${i}`);
      }
    } catch (err) {
      console.error(`err message: ${err.message}`);
      console.error(`error at ${this.source} axios.get`);
    }

    return searchUrls;
  };

  _getCodeString = async url => {
    const { data } = await retryAxios(() => this.http.get(url));

    const $ = getCheerio(data);
    const target = $('title').text();

    return target;
  };

  _getCodes = target => {
    const _code = target.match(/\[.*?(\w+\d+)\]/);

    return _code ? [_code[1]] : [];
  };

  _filterVideoUrls = urls => urls.filter(url => /.*\/.*.html$/.test(url));
}
