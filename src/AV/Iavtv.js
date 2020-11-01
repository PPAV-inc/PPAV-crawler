import axios from 'axios';

import AV from './AV';
import getCheerio from '../getCheerio';
import retryAxios from '../utils/retryAxios';

export default class Iavtv extends AV {
  constructor() {
    super();
    this.source = 'iavtv';
    this.baseURL = 'http://www.iavtv.net';
    this.http = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
    });
  }

  _getAllPagesUrls = async () => {
    const searchUrls = new Set();
    let maxPageNum = 1;

    try {
      const { data } = await retryAxios(() =>
        this.http.get(`/?new=1&order=new&num=${maxPageNum}`)
      );

      const $ = getCheerio(data);

      // eslint-disable-next-line no-loop-func
      $('a').each((i, e) => {
        const url = $(e).attr('href') || '';
        const match = url.match(/\?new=1&order=new&num=(\d+)/);
        if (match && +match[1] > maxPageNum) maxPageNum = +match[1];
      });

      for (let i = 1, len = maxPageNum; i <= len; i += 1) {
        searchUrls.add(`/?new=1&order=new&num=${i}`);
      }
    } catch (err) {
      console.error(`err message: ${err.message}`);
      console.error(`error at ${this.source} axios.get`);
    }

    return searchUrls;
  };

  _getCodeString = async (url) => {
    const { data } = await retryAxios(() => this.http.get(url));

    const $ = getCheerio(data);
    const target = $('title').text();

    return target;
  };

  _filterVideoUrls = (urls) => {
    // filter not video url
    const filterUrls = urls.filter((url) => /player\.php\?uuid.*/.test(url));

    return filterUrls;
  };
}
