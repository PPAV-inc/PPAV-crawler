import axios from 'axios';

import AV from './AV';
import getCheerio from '../getCheerio';
import retryAxios from '../utils/retryAxios';

export default class JavForMe extends AV {
  constructor() {
    super();
    this.source = 'javforme';
    this.baseURL = 'https://javfor.me';
    this.http = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
    });
  }

  _getAllPagesUrls = async () => {
    const searchUrls = new Set();
    let maxPageNum = 1;

    try {
      while (true) {
        // eslint-disable-next-line
        const { data } = await retryAxios(() =>
          this.http.get(`/list/new/${maxPageNum}.html`)
        );

        const $ = getCheerio(data);

        const max = maxPageNum;
        // eslint-disable-next-line
        $('a').each((i, e) => {
          const url = $(e).attr('href') || '';
          const match = url.match(/.*\/list\/new\/(\d+).html/);
          if (match && +match[1] > maxPageNum) {
            maxPageNum = +match[1];
          }
        });

        if (max === maxPageNum) {
          break;
        }
      }

      for (let i = 1, len = maxPageNum / 1; i <= len; i += 1) {
        searchUrls.add(`/list/new/${i}.html`);
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
